"""
Standings / Points Table Service.

Calculates league standings, points, win/loss records, form, and Net Run Rate (NRR)
for a given tournament season.
"""
from decimal import Decimal
from django.db.models import Q
from apps.matches.models import Match, Innings
from apps.teams.models import Team


class StandingsService:
    """Service to calculate points table and team standings."""

    @staticmethod
    def _overs_to_decimal(overs):
        """Convert cricket overs notation (e.g., 19.3) to mathematical decimal (19.5)."""
        if not overs:
            return 0.0
        val = float(overs)
        whole = int(val)
        balls = round((val - whole) * 10)
        return whole + (balls / 6.0)

    @classmethod
    def get_team_record(cls, team, season):
        """Get match win/loss/tie/no-result record for a team in a season."""
        matches = Match.objects.filter(
            Q(team_a=team) | Q(team_b=team),
            season=season,
            status='completed'
        ).select_related('result', 'result__winner')

        played = matches.count()
        won = 0
        lost = 0
        tied = 0
        no_result = 0
        form = []

        # Sort matches by date descending for recent form
        for match in sorted(matches, key=lambda m: m.date):
            res = getattr(match, 'result', None)
            if not res:
                continue
            if res.is_no_result:
                no_result += 1
                form.append('NR')
            elif res.is_tie:
                tied += 1
                form.append('T')
            elif res.winner_id == team.id:
                won += 1
                form.append('W')
            else:
                lost += 1
                form.append('L')

        # Recent form: last 5 matches
        recent_form = form[-5:] if form else []

        points = (
            (won * season.points_per_win) +
            (tied * season.points_per_tie) +
            (no_result * season.points_per_no_result)
        )

        return {
            'played': played,
            'won': won,
            'lost': lost,
            'tied': tied,
            'no_result': no_result,
            'points': points,
            'form': recent_form,
        }

    @classmethod
    def calculate_net_run_rate(cls, team, season):
        """
        Calculate Net Run Rate (NRR) for a team in a season.
        NRR = (Runs Scored / Overs Faced) - (Runs Conceded / Overs Bowled)
        For all-out innings, the full quota of overs (e.g. 20) is counted.
        """
        max_overs = float(season.overs_per_innings or 20)

        completed_matches = Match.objects.filter(
            Q(team_a=team) | Q(team_b=team),
            season=season,
            status='completed'
        ).exclude(result__is_no_result=True)

        total_runs_scored = 0
        total_overs_faced = 0.0

        total_runs_conceded = 0
        total_overs_bowled = 0.0

        for match in completed_matches:
            # Batting innings for this team
            batting_inn = match.innings.filter(batting_team=team).first()
            if batting_inn:
                total_runs_scored += batting_inn.total_runs
                # If all-out (10 wickets) use full quota
                if batting_inn.total_wickets >= 10:
                    total_overs_faced += max_overs
                else:
                    total_overs_faced += cls._overs_to_decimal(batting_inn.total_overs)

            # Bowling innings for this team
            bowling_inn = match.innings.filter(bowling_team=team).first()
            if bowling_inn:
                total_runs_conceded += bowling_inn.total_runs
                # If opponent was all-out use full quota
                if bowling_inn.total_wickets >= 10:
                    total_overs_bowled += max_overs
                else:
                    total_overs_bowled += cls._overs_to_decimal(bowling_inn.total_overs)

        for_rr = (total_runs_scored / total_overs_faced) if total_overs_faced > 0 else 0.0
        against_rr = (total_runs_conceded / total_overs_bowled) if total_overs_bowled > 0 else 0.0

        nrr = for_rr - against_rr
        return round(nrr, 3)

    @classmethod
    def calculate_standings(cls, season):
        """Calculate complete league standings table for a season."""
        # Find all teams participating in this season
        teams = Team.objects.filter(squad__season=season).distinct()
        if not teams.exists():
            # Fallback to teams with matches in this season
            teams = Team.objects.filter(
                Q(matches_as_team_a__season=season) | Q(matches_as_team_b__season=season)
            ).distinct()

        standings = []
        for team in teams:
            record = cls.get_team_record(team, season)
            nrr = cls.calculate_net_run_rate(team, season)

            standings.append({
                'team': {
                    'id': team.id,
                    'name': team.name,
                    'short_name': team.short_name,
                    'slug': team.slug,
                    'logo': team.logo.url if team.logo else None,
                    'primary_color': team.primary_color,
                    'secondary_color': team.secondary_color,
                },
                'played': record['played'],
                'won': record['won'],
                'lost': record['lost'],
                'tied': record['tied'],
                'no_result': record['no_result'],
                'points': record['points'],
                'net_run_rate': nrr,
                'form': record['form'],
            })

        # Tie-breakers:
        # 1. Points (descending)
        # 2. Net Run Rate (descending)
        # 3. Wins (descending)
        # 4. Team name (ascending)
        standings.sort(
            key=lambda x: (
                -x['points'],
                -x['net_run_rate'],
                -x['won'],
                x['team']['name']
            )
        )

        # Assign ranks
        for idx, item in enumerate(standings, 1):
            item['position'] = idx

        return standings
