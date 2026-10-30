"""
Centralized cricket scoring service.

All cricket scoring calculations are performed here to avoid duplication.
"""
from collections import defaultdict, OrderedDict
from django.db.models import Sum, Count, Q, F
from apps.matches.models import Innings, BallDelivery, Match, MatchResult


class ScoringService:
    """Centralized cricket scoring logic."""

    @staticmethod
    def record_delivery(innings, delivery_data):
        """
        Record a single ball delivery and update innings totals.

        delivery_data should contain:
            batter, non_striker, bowler, runs_scored,
            is_wide, is_no_ball, is_bye, is_leg_bye,
            extras_runs, is_wicket, wicket_type, wicket_player,
            fielder, is_boundary, is_six
        """
        # Determine if this is a legal delivery
        is_wide = delivery_data.get('is_wide', False)
        is_no_ball = delivery_data.get('is_no_ball', False)
        is_legal = not (is_wide or is_no_ball)

        # Get current ball count
        last_delivery = innings.deliveries.order_by('-delivery_number').first()
        delivery_number = (last_delivery.delivery_number + 1) if last_delivery else 1

        # Calculate over and ball number
        legal_balls = innings.deliveries.filter(is_legal=True).count()
        if is_legal:
            current_over = legal_balls // 6
            current_ball = (legal_balls % 6) + 1
        else:
            # For illegal deliveries, use the current over/ball position
            current_over = legal_balls // 6
            current_ball = (legal_balls % 6) if (legal_balls % 6) > 0 else 0

        # Calculate extras
        runs_scored = delivery_data.get('runs_scored', 0)
        extras_runs = delivery_data.get('extras_runs', 0)

        # For wides: minimum 1 extra
        if is_wide and extras_runs == 0:
            extras_runs = 1

        # For no-balls: minimum 1 extra
        if is_no_ball and extras_runs == 0:
            extras_runs = 1

        delivery = BallDelivery(
            innings=innings,
            over_number=current_over,
            ball_number=current_ball if is_legal else 0,
            delivery_number=delivery_number,
            batter_id=delivery_data['batter'],
            non_striker_id=delivery_data['non_striker'],
            bowler_id=delivery_data['bowler'],
            runs_scored=runs_scored,
            extras_runs=extras_runs,
            is_wide=is_wide,
            is_no_ball=is_no_ball,
            is_bye=delivery_data.get('is_bye', False),
            is_leg_bye=delivery_data.get('is_leg_bye', False),
            is_wicket=delivery_data.get('is_wicket', False),
            is_boundary=delivery_data.get('is_boundary', False),
            is_six=delivery_data.get('is_six', False),
            wicket_type=delivery_data.get('wicket_type', ''),
            wicket_player_id=delivery_data.get('wicket_player'),
            fielder_id=delivery_data.get('fielder'),
        )
        delivery.save()

        # Update innings totals
        ScoringService._update_innings_totals(innings)

        return delivery

    @staticmethod
    def _update_innings_totals(innings):
        """Recalculate innings totals from deliveries."""
        deliveries = innings.deliveries.all()

        total_runs = 0
        total_extras = 0
        total_wickets = 0
        legal_balls = 0

        for d in deliveries:
            total_runs += d.runs_scored + d.extras_runs
            total_extras += d.extras_runs
            if d.is_wicket and d.wicket_type not in ('retired_hurt',):
                total_wickets += 1
            if d.is_legal:
                legal_balls += 1

        overs = legal_balls // 6
        balls = legal_balls % 6
        total_overs = float(f"{overs}.{balls}")

        innings.total_runs = total_runs
        innings.total_extras = total_extras
        innings.total_wickets = total_wickets
        innings.total_overs = total_overs
        innings.save()

    @staticmethod
    def get_batting_scorecard(innings):
        """Calculate batting scorecard from deliveries."""
        deliveries = innings.deliveries.select_related(
            'batter', 'bowler', 'fielder', 'wicket_player'
        ).all()

        batters = OrderedDict()

        for d in deliveries:
            batter_id = d.batter_id
            if batter_id not in batters:
                batters[batter_id] = {
                    'player_id': batter_id,
                    'player_name': d.batter.full_name,
                    'runs': 0,
                    'balls': 0,
                    'fours': 0,
                    'sixes': 0,
                    'how_out': 'not out',
                    'strike_rate': 0.0,
                }

            # Count balls faced (only legal deliveries, excluding wides)
            if not d.is_wide:
                batters[batter_id]['balls'] += 1

            # Count runs (only off the bat, not byes/leg byes)
            if not d.is_bye and not d.is_leg_bye:
                batters[batter_id]['runs'] += d.runs_scored

            if d.is_boundary:
                batters[batter_id]['fours'] += 1
            if d.is_six:
                batters[batter_id]['sixes'] += 1

            # Check if this batter got out
            if d.is_wicket and d.wicket_player_id == batter_id:
                dismissal = ScoringService._format_dismissal(d)
                batters[batter_id]['how_out'] = dismissal

        # Calculate strike rates
        for batter in batters.values():
            if batter['balls'] > 0:
                batter['strike_rate'] = round(
                    (batter['runs'] / batter['balls']) * 100, 2
                )

        return list(batters.values())

    @staticmethod
    def _format_dismissal(delivery):
        """Format dismissal text."""
        wtype = delivery.wicket_type
        bowler_name = delivery.bowler.full_name

        if wtype == 'bowled':
            return f"b {bowler_name}"
        elif wtype == 'caught':
            fielder = delivery.fielder.full_name if delivery.fielder else '?'
            return f"c {fielder} b {bowler_name}"
        elif wtype == 'caught_and_bowled':
            return f"c & b {bowler_name}"
        elif wtype == 'lbw':
            return f"lbw b {bowler_name}"
        elif wtype == 'stumped':
            fielder = delivery.fielder.full_name if delivery.fielder else '?'
            return f"st {fielder} b {bowler_name}"
        elif wtype == 'run_out':
            fielder = delivery.fielder.full_name if delivery.fielder else '?'
            return f"run out ({fielder})"
        elif wtype == 'hit_wicket':
            return f"hit wicket b {bowler_name}"
        elif wtype == 'retired_hurt':
            return "retired hurt"
        elif wtype == 'retired_out':
            return "retired out"
        else:
            return wtype

    @staticmethod
    def get_bowling_scorecard(innings):
        """Calculate bowling scorecard from deliveries."""
        deliveries = innings.deliveries.select_related('bowler').all()

        bowlers = OrderedDict()

        for d in deliveries:
            bowler_id = d.bowler_id
            if bowler_id not in bowlers:
                bowlers[bowler_id] = {
                    'player_id': bowler_id,
                    'player_name': d.bowler.full_name,
                    'legal_balls': 0,
                    'runs': 0,
                    'wickets': 0,
                    'maidens': 0,
                    'dots_in_over': 0,
                    'current_over': -1,
                    'current_over_runs': 0,
                    'overs': '0',
                    'economy': 0.0,
                }

            # Track legal balls
            if d.is_legal:
                bowlers[bowler_id]['legal_balls'] += 1

            # Runs conceded: everything except byes and leg byes
            if not d.is_bye and not d.is_leg_bye:
                runs_conceded = d.runs_scored + d.extras_runs
                bowlers[bowler_id]['runs'] += runs_conceded

                # Track maiden overs
                if d.is_legal:
                    if d.over_number != bowlers[bowler_id]['current_over']:
                        # New over
                        if (bowlers[bowler_id]['current_over'] >= 0 and
                                bowlers[bowler_id]['current_over_runs'] == 0 and
                                bowlers[bowler_id]['legal_balls'] > 6):
                            bowlers[bowler_id]['maidens'] += 1
                        bowlers[bowler_id]['current_over'] = d.over_number
                        bowlers[bowler_id]['current_over_runs'] = runs_conceded
                    else:
                        bowlers[bowler_id]['current_over_runs'] += runs_conceded
            else:
                # Byes and leg byes don't count against the bowler
                pass

            # Wickets (excluding run-outs which aren't bowler's wicket)
            if d.is_wicket and d.wicket_type not in ('run_out', 'retired_hurt', 'retired_out', 'obstructing'):
                bowlers[bowler_id]['wickets'] += 1

        # Format output
        result = []
        for bowler in bowlers.values():
            legal_balls = bowler['legal_balls']
            overs = legal_balls // 6
            balls = legal_balls % 6
            overs_str = f"{overs}.{balls}" if balls > 0 else str(overs)

            # Check last over for maiden
            if (bowler['current_over_runs'] == 0 and legal_balls > 0 and
                    legal_balls % 6 == 0 and bowler['current_over'] >= 0):
                bowler['maidens'] += 1

            overs_decimal = overs + balls / 6
            economy = round(bowler['runs'] / overs_decimal, 2) if overs_decimal > 0 else 0.0

            result.append({
                'player_id': bowler['player_id'],
                'player_name': bowler['player_name'],
                'overs': overs_str,
                'maidens': bowler['maidens'],
                'runs': bowler['runs'],
                'wickets': bowler['wickets'],
                'economy': economy,
            })

        return result

    @staticmethod
    def get_fall_of_wickets(innings):
        """Get fall of wickets from deliveries."""
        deliveries = innings.deliveries.select_related('wicket_player').filter(
            is_wicket=True
        ).exclude(wicket_type='retired_hurt').order_by('delivery_number')

        fall_of_wickets = []
        running_total = 0
        wicket_count = 0

        # We need running totals, so iterate all deliveries up to each wicket
        all_deliveries = innings.deliveries.order_by('delivery_number')
        running = 0
        legal_balls = 0

        for d in all_deliveries:
            running += d.runs_scored + d.extras_runs
            if d.is_legal:
                legal_balls += 1

            if d.is_wicket and d.wicket_type != 'retired_hurt':
                wicket_count += 1
                overs = legal_balls // 6
                balls = legal_balls % 6
                fall_of_wickets.append({
                    'wicket_number': wicket_count,
                    'score': running,
                    'overs': f"{overs}.{balls}",
                    'player_name': d.wicket_player.full_name if d.wicket_player else '?',
                })

        return fall_of_wickets

    @staticmethod
    def get_extras_breakdown(innings):
        """Get breakdown of extras."""
        deliveries = innings.deliveries.all()

        wides = 0
        no_balls = 0
        byes = 0
        leg_byes = 0

        for d in deliveries:
            if d.is_wide:
                wides += d.extras_runs
            elif d.is_no_ball:
                no_balls += d.extras_runs
            elif d.is_bye:
                byes += d.extras_runs
            elif d.is_leg_bye:
                leg_byes += d.extras_runs

        return {
            'wides': wides,
            'no_balls': no_balls,
            'byes': byes,
            'leg_byes': leg_byes,
            'total': wides + no_balls + byes + leg_byes,
        }

    @staticmethod
    def complete_innings(innings):
        """Mark an innings as completed."""
        ScoringService._update_innings_totals(innings)
        innings.is_completed = True
        innings.save()

    @staticmethod
    def calculate_match_result(match):
        """
        Calculate and save match result after both innings are completed.
        """
        innings_list = match.innings.order_by('innings_number')
        if innings_list.count() < 2:
            return None

        first_innings = innings_list[0]
        second_innings = innings_list[1]

        if first_innings.total_runs > second_innings.total_runs:
            winner = first_innings.batting_team
            margin = first_innings.total_runs - second_innings.total_runs
            summary = f"{winner.name} won by {margin} runs"
        elif second_innings.total_runs > first_innings.total_runs:
            winner = second_innings.batting_team
            wickets_remaining = 10 - second_innings.total_wickets
            summary = f"{winner.name} won by {wickets_remaining} wickets"
        else:
            winner = None
            summary = "Match tied"

        result, created = MatchResult.objects.update_or_create(
            match=match,
            defaults={
                'winner': winner,
                'result_summary': summary,
                'is_tie': winner is None,
                'is_no_result': False,
            }
        )

        match.status = 'completed'
        match.save()

        return result

    @staticmethod
    def overs_to_decimal(overs_notation):
        """Convert overs notation (e.g., 5.3 overs) to decimal (5.5)."""
        overs_float = float(overs_notation)
        whole_overs = int(overs_float)
        balls = round((overs_float - whole_overs) * 10)
        return whole_overs + balls / 6
