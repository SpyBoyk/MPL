"""
Player and Team Statistics Service.

Computes comprehensive batting, bowling, fielding, and leaderboard statistics
derived directly from ball-by-ball match data.
"""
from collections import defaultdict
from django.db.models import Sum, Count, Q, Max, Case, When, IntegerField
from apps.matches.models import Match, Innings, BallDelivery
from apps.accounts.models import PlayerProfile
from apps.teams.models import Team


BOWLER_CREDITED_WICKETS = [
    'bowled', 'caught', 'lbw', 'stumped', 'hit_wicket', 'caught_and_bowled'
]


class PlayerStatsService:
    """Calculates batting, bowling, and fielding metrics for player profiles."""

    @classmethod
    def get_batting_stats(cls, player, season=None):
        """Aggregate batting stats for a player."""
        deliveries = BallDelivery.objects.filter(batter=player)
        if season:
            deliveries = deliveries.filter(innings__match__season=season)

        # Innings where player batted
        innings_ids = deliveries.values_list('innings_id', flat=True).distinct()
        innings_count = len(innings_ids)

        if innings_count == 0:
            return {
                'matches': 0,
                'innings': 0,
                'runs': 0,
                'balls_faced': 0,
                'highest_score': '0',
                'batting_average': None,
                'strike_rate': 0.0,
                'fours': 0,
                'sixes': 0,
                'fifties': 0,
                'hundreds': 0,
                'not_outs': 0,
            }

        total_runs = deliveries.aggregate(total=Sum('runs_scored'))['total'] or 0
        # Balls faced excludes wides (no-balls count as balls faced)
        balls_faced = deliveries.exclude(is_wide=True).count()
        fours = deliveries.filter(is_boundary=True).count()
        sixes = deliveries.filter(is_six=True).count()

        # Innings-wise scores and dismissals
        dismissals = BallDelivery.objects.filter(
            wicket_player=player,
            is_wicket=True,
            innings_id__in=innings_ids
        ).values_list('innings_id', flat=True).distinct()
        dismissal_count = len(dismissals)
        not_outs = max(0, innings_count - dismissal_count)

        # Calculate scores per innings for HS, 50s, 100s
        inn_scores = (
            deliveries.values('innings_id')
            .annotate(score=Sum('runs_scored'))
            .order_by('-score')
        )

        fifties = 0
        hundreds = 0
        highest_score_val = 0
        is_hs_not_out = False

        for item in inn_scores:
            s = item['score'] or 0
            inn_id = item['innings_id']
            is_out = inn_id in dismissals
            if s >= 100:
                hundreds += 1
            elif s >= 50:
                fifties += 1

            if s > highest_score_val or (s == highest_score_val and not is_out):
                highest_score_val = s
                is_hs_not_out = not is_out

        hs_str = f"{highest_score_val}{'*' if is_hs_not_out and highest_score_val > 0 else ''}"

        # Average: total_runs / times dismissed (or total_runs if never out and runs > 0)
        if dismissal_count > 0:
            avg = round(total_runs / dismissal_count, 2)
        elif total_runs > 0:
            avg = float(total_runs)
        else:
            avg = None

        sr = round((total_runs / balls_faced * 100), 2) if balls_faced > 0 else 0.0

        # Distinct matches played (batting or bowling)
        matches_count = Match.objects.filter(
            Q(innings__deliveries__batter=player) | Q(innings__deliveries__bowler=player)
        )
        if season:
            matches_count = matches_count.filter(season=season)
        matches_count = matches_count.distinct().count()

        return {
            'matches': matches_count,
            'innings': innings_count,
            'runs': total_runs,
            'balls_faced': balls_faced,
            'highest_score': hs_str,
            'batting_average': avg,
            'strike_rate': sr,
            'fours': fours,
            'sixes': sixes,
            'fifties': fifties,
            'hundreds': hundreds,
            'not_outs': not_outs,
        }

    @classmethod
    def get_bowling_stats(cls, player, season=None):
        """Aggregate bowling stats for a player."""
        deliveries = BallDelivery.objects.filter(bowler=player)
        if season:
            deliveries = deliveries.filter(innings__match__season=season)

        innings_ids = deliveries.values_list('innings_id', flat=True).distinct()
        innings_count = len(innings_ids)

        if innings_count == 0:
            return {
                'bowling_innings': 0,
                'overs_bowled': '0.0',
                'maidens': 0,
                'runs_conceded': 0,
                'wickets': 0,
                'bowling_average': None,
                'economy_rate': 0.0,
                'bowling_strike_rate': None,
                'best_bowling': '-',
                'three_wickets': 0,
                'five_wickets': 0,
            }

        legal_balls = deliveries.filter(is_legal=True).count()
        overs_str = f"{legal_balls // 6}.{legal_balls % 6}"
        overs_decimal = (legal_balls // 6) + ((legal_balls % 6) / 6.0)

        # Runs conceded = runs_scored + extras_runs for wides and no-balls (not byes/leg-byes)
        runs_conceded = 0
        for d in deliveries:
            if not d.is_bye and not d.is_leg_bye:
                runs_conceded += d.runs_scored + d.extras_runs

        # Bowler wickets
        wickets = deliveries.filter(
            is_wicket=True,
            wicket_type__in=BOWLER_CREDITED_WICKETS
        ).count()

        # Maidens calculation (overs with 6 legal balls and 0 bowler runs conceded)
        overs_grouped = defaultdict(lambda: {'legal': 0, 'runs': 0})
        for d in deliveries:
            key = (d.innings_id, d.over_number)
            if d.is_legal:
                overs_grouped[key]['legal'] += 1
            if not d.is_bye and not d.is_leg_bye:
                overs_grouped[key]['runs'] += d.runs_scored + d.extras_runs

        maidens = sum(
            1 for o in overs_grouped.values()
            if o['legal'] == 6 and o['runs'] == 0
        )

        economy = round(runs_conceded / overs_decimal, 2) if overs_decimal > 0 else 0.0
        avg = round(runs_conceded / wickets, 2) if wickets > 0 else None
        bowling_sr = round(legal_balls / wickets, 2) if wickets > 0 else None

        # Best bowling in an innings & 3w/5w hauls
        best_w = -1
        best_r = 999
        three_w = 0
        five_w = 0

        for inn_id in innings_ids:
            inn_delivs = deliveries.filter(innings_id=inn_id)
            w = inn_delivs.filter(is_wicket=True, wicket_type__in=BOWLER_CREDITED_WICKETS).count()
            r = 0
            for d in inn_delivs:
                if not d.is_bye and not d.is_leg_bye:
                    r += d.runs_scored + d.extras_runs

            if w >= 5:
                five_w += 1
            elif w >= 3:
                three_w += 1

            if w > best_w or (w == best_w and r < best_r):
                best_w = w
                best_r = r

        best_bowling_str = f"{best_w}/{best_r}" if best_w >= 0 else '-'

        return {
            'bowling_innings': innings_count,
            'overs_bowled': overs_str,
            'maidens': maidens,
            'runs_conceded': runs_conceded,
            'wickets': wickets,
            'bowling_average': avg,
            'economy_rate': economy,
            'bowling_strike_rate': bowling_sr,
            'best_bowling': best_bowling_str,
            'three_wickets': three_w,
            'five_wickets': five_w,
        }

    @classmethod
    def get_fielding_stats(cls, player, season=None):
        """Aggregate fielding stats: catches, run-outs, stumpings."""
        fielding_delivs = BallDelivery.objects.filter(fielder=player, is_wicket=True)
        if season:
            fielding_delivs = fielding_delivs.filter(innings__match__season=season)

        catches = fielding_delivs.filter(wicket_type__in=['caught', 'caught_and_bowled']).count()
        run_outs = fielding_delivs.filter(wicket_type='run_out').count()
        stumpings = fielding_delivs.filter(wicket_type='stumped').count()

        return {
            'catches': catches,
            'run_outs': run_outs,
            'stumpings': stumpings,
            'total_dismissals': catches + run_outs + stumpings,
        }

    @classmethod
    def get_recent_performances(cls, player, limit=5):
        """Get recent match performance list for a player."""
        matches = Match.objects.filter(
            Q(innings__deliveries__batter=player) | Q(innings__deliveries__bowler=player),
            status='completed'
        ).distinct().select_related('team_a', 'team_b', 'season').order_by('-date')[:limit]

        performances = []
        for match in matches:
            # Batting in this match
            batting_delivs = BallDelivery.objects.filter(
                innings__match=match,
                batter=player
            )
            runs = batting_delivs.aggregate(total=Sum('runs_scored'))['total'] or 0
            balls = batting_delivs.exclude(is_wide=True).count()
            is_out = BallDelivery.objects.filter(
                innings__match=match,
                wicket_player=player,
                is_wicket=True
            ).exists()

            # Bowling in this match
            bowling_delivs = BallDelivery.objects.filter(
                innings__match=match,
                bowler=player
            )
            wickets = bowling_delivs.filter(
                is_wicket=True,
                wicket_type__in=BOWLER_CREDITED_WICKETS
            ).count()
            bowling_runs = 0
            for d in bowling_delivs:
                if not d.is_bye and not d.is_leg_bye:
                    bowling_runs += d.runs_scored + d.extras_runs
            overs_legal = bowling_delivs.filter(is_legal=True).count()
            overs = f"{overs_legal // 6}.{overs_legal % 6}"

            opponent = match.team_b.short_name if match.team_a.name in str(player) else match.team_a.short_name

            performances.append({
                'match_id': match.id,
                'match_number': match.match_number,
                'date': match.date.strftime('%Y-%m-%d'),
                'opponent': opponent,
                'vs_team': f"{match.team_a.short_name} vs {match.team_b.short_name}",
                'batting': f"{runs}{'*' if not is_out and balls > 0 else ''} ({balls})" if balls > 0 else 'DNB',
                'bowling': f"{wickets}/{bowling_runs} ({overs} ov)" if overs_legal > 0 else 'DNB',
                'result': match.result.result_summary if hasattr(match, 'result') else None,
            })

        return performances

    @classmethod
    def get_chart_data(cls, player):
        """Prepare chart series for player dashboard (runs scored per match, wickets per match)."""
        matches = Match.objects.filter(
            Q(innings__deliveries__batter=player) | Q(innings__deliveries__bowler=player),
            status='completed'
        ).distinct().order_by('date')[:10]

        runs_chart = []
        wickets_chart = []

        for m in matches:
            label = f"M{m.match_number}"
            # Runs
            runs = BallDelivery.objects.filter(
                innings__match=m,
                batter=player
            ).aggregate(total=Sum('runs_scored'))['total'] or 0

            # Wickets
            wkts = BallDelivery.objects.filter(
                innings__match=m,
                bowler=player,
                is_wicket=True,
                wicket_type__in=BOWLER_CREDITED_WICKETS
            ).count()

            runs_chart.append({'match': label, 'runs': runs})
            wickets_chart.append({'match': label, 'wickets': wkts})

        return {
            'runs_progression': runs_chart,
            'wickets_progression': wickets_chart,
        }

    @classmethod
    def get_leaderboard(cls, stat_type, season=None, limit=10):
        """Generate leaderboards for batting, bowling, or fielding categories."""
        players = PlayerProfile.objects.all()

        if season:
            players = players.filter(memberships__season=season).distinct()

        results = []
        for p in players:
            # Get player's current team
            team_mem = p.memberships.filter(season=season if season else p.memberships.first().season if p.memberships.exists() else None).first() if p.memberships.exists() else None
            team_info = {
                'name': team_mem.team.name,
                'short_name': team_mem.team.short_name,
                'slug': team_mem.team.slug,
                'logo': team_mem.team.logo.url if team_mem.team.logo else None,
            } if team_mem else None

            base_entry = {
                'id': p.id,
                'full_name': p.full_name,
                'photo': p.photo.url if p.photo else None,
                'playing_role': p.get_playing_role_display(),
                'team': team_info,
            }

            if stat_type in ('most_runs', 'batting'):
                stats = cls.get_batting_stats(p, season=season)
                if stats['runs'] > 0:
                    base_entry.update({
                        'innings': stats['innings'],
                        'runs': stats['runs'],
                        'highest_score': stats['highest_score'],
                        'batting_average': stats['batting_average'],
                        'strike_rate': stats['strike_rate'],
                        'fours': stats['fours'],
                        'sixes': stats['sixes'],
                        'fifties': stats['fifties'],
                        'hundreds': stats['hundreds'],
                    })
                    results.append(base_entry)

            elif stat_type in ('most_wickets', 'bowling'):
                stats = cls.get_bowling_stats(p, season=season)
                if stats['wickets'] > 0 or stats['runs_conceded'] > 0:
                    base_entry.update({
                        'bowling_innings': stats['bowling_innings'],
                        'overs': stats['overs_bowled'],
                        'wickets': stats['wickets'],
                        'runs_conceded': stats['runs_conceded'],
                        'bowling_average': stats['bowling_average'],
                        'economy_rate': stats['economy_rate'],
                        'best_bowling': stats['best_bowling'],
                    })
                    results.append(base_entry)

            elif stat_type in ('most_sixes', 'sixes'):
                stats = cls.get_batting_stats(p, season=season)
                if stats['sixes'] > 0:
                    base_entry.update({
                        'sixes': stats['sixes'],
                        'fours': stats['fours'],
                        'runs': stats['runs'],
                    })
                    results.append(base_entry)

            elif stat_type in ('fielding', 'catches'):
                stats = cls.get_fielding_stats(p, season=season)
                if stats['total_dismissals'] > 0:
                    base_entry.update({
                        'catches': stats['catches'],
                        'run_outs': stats['run_outs'],
                        'stumpings': stats['stumpings'],
                        'total_dismissals': stats['total_dismissals'],
                    })
                    results.append(base_entry)

        # Sort based on stat_type
        if stat_type in ('most_runs', 'batting'):
            results.sort(key=lambda x: (-x['runs'], -(x['strike_rate'] or 0)))
        elif stat_type in ('most_wickets', 'bowling'):
            results.sort(key=lambda x: (-x['wickets'], x['economy_rate'] or 999.0))
        elif stat_type in ('most_sixes', 'sixes'):
            results.sort(key=lambda x: (-x['sixes'], -x['runs']))
        elif stat_type in ('fielding', 'catches'):
            results.sort(key=lambda x: (-x['total_dismissals'], -x['catches']))

        # Apply limit and rank
        limited = results[:limit]
        for idx, item in enumerate(limited, 1):
            item['rank'] = idx

        return limited


class TeamStatsService:
    """Calculates team level aggregated stats."""

    @classmethod
    def get_team_season_stats(cls, team, season):
        """Aggregate batting and bowling performance for a team in a season."""
        from apps.statistics.services.standings import StandingsService
        record = StandingsService.get_team_record(team, season)
        nrr = StandingsService.calculate_net_run_rate(team, season)

        matches = Match.objects.filter(
            Q(team_a=team) | Q(team_b=team),
            season=season,
            status='completed'
        )

        innings = Innings.objects.filter(match__in=matches, batting_team=team)
        highest_total = innings.aggregate(max_runs=Max('total_runs'))['max_runs'] or 0

        total_runs = innings.aggregate(tot=Sum('total_runs'))['tot'] or 0
        total_wickets_lost = innings.aggregate(tot=Sum('total_wickets'))['tot'] or 0

        return {
            'team_id': team.id,
            'name': team.name,
            'short_name': team.short_name,
            'record': record,
            'net_run_rate': nrr,
            'highest_total': highest_total,
            'total_runs_scored': total_runs,
            'total_wickets_lost': total_wickets_lost,
        }
