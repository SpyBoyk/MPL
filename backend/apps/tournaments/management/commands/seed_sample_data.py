"""
Management command to seed realistic sample data for the Malghar Premier League (MPL)
with all 58 official tournament players.
"""
from datetime import datetime, timedelta, date
import re
from django.core.management.base import BaseCommand
from django.utils import timezone
from django.contrib.auth import get_user_model

from apps.accounts.models import PlayerProfile
from apps.tournaments.models import Season, Venue
from apps.teams.models import Team, SquadMembership
from apps.matches.models import Match, MatchResult, Innings, BallDelivery

User = get_user_model()


class Command(BaseCommand):
    help = 'Seeds Malghar Premier League with official 58 tournament players across 6 teams'

    def handle(self, *args, **options):
        self.stdout.write(self.style.NOTICE('Seeding official MPL tournament roster...'))

        # 1. Admin user
        admin_user, created = User.objects.get_or_create(
            username='admin',
            defaults={
                'email': 'admin@malgharpl.com',
                'is_staff': True,
                'is_superuser': True,
                'first_name': 'MPL',
                'last_name': 'Administrator',
            }
        )
        if created:
            admin_user.set_password('admin123')
            admin_user.save()
            self.stdout.write(self.style.SUCCESS('Created superuser: admin / admin123'))

        # 2. Season
        season, _ = Season.objects.get_or_create(
            slug='mpl-2026',
            defaults={
                'name': 'MPL Season 2026',
                'start_date': date(2026, 3, 1),
                'end_date': date(2026, 4, 30),
                'status': 'ongoing',
                'is_current': True,
                'points_per_win': 2,
                'points_per_tie': 1,
                'points_per_no_result': 1,
                'overs_per_innings': 20,
                'description': 'The premier village championship of Malghar featuring top regional cricketing talent.'
            }
        )
        season.is_current = True
        season.save()

        # 3. Venue
        venue, _ = Venue.objects.get_or_create(
            name='Malghar Cricket Ground',
            defaults={
                'city': 'Malghar, Maharashtra',
                'capacity': 8500,
            }
        )

        # 4. Teams
        teams_data = [
            {
                'name': 'Lakshmikant Group',
                'short_name': 'LG',
                'slug': 'lakshmikant-group',
                'primary_color': '#eab308',
                'secondary_color': '#0f172a',
                'description': 'The reigning champions known for aggressive top-order batting and disciplined spin bowling.',
            },
            {
                'name': 'Aaradhya 11',
                'short_name': 'A11',
                'slug': 'aaradhya-11',
                'primary_color': '#2563eb',
                'secondary_color': '#1e293b',
                'description': 'Precision pace bowling and explosive finishers anchored by young local heroes.',
            },
            {
                'name': 'Dharmveer Fighter',
                'short_name': 'DF',
                'slug': 'dharmveer-fighter',
                'primary_color': '#059669',
                'secondary_color': '#022c22',
                'description': 'A resilient outfit known for fighting till the last ball with exceptional fielding.',
            },
            {
                'name': 'Saish 11',
                'short_name': 'S11',
                'slug': 'saish-11',
                'primary_color': '#dc2626',
                'secondary_color': '#450a0a',
                'description': 'Fiery pace battery and attacking middle-order fearless in run chases.',
            },
            {
                'name': 'Shivneri 11',
                'short_name': 'SN11',
                'slug': 'shivneri-11',
                'primary_color': '#7c3aed',
                'secondary_color': '#2e1065',
                'description': 'Tactical strategists known for spin depth and high powerplay scoring rates.',
            },
            {
                'name': 'Omkar 11',
                'short_name': 'OM11',
                'slug': 'omkar-11',
                'primary_color': '#ea580c',
                'secondary_color': '#431407',
                'description': 'Crowd favorites sporting fearless boundary hitters and deceptive slower-ball specialists.',
            },
        ]

        teams = {}
        for t_info in teams_data:
            team, _ = Team.objects.get_or_create(
                slug=t_info['slug'],
                defaults=t_info
            )
            teams[t_info['short_name']] = team

        # 5. ALL 58 REAL PLAYERS
        # Format: (name, team_short, role, bat_style, bowl_style, is_captain, jersey)
        official_players_data = [
            # Team 1: Malghar Super Kings (MSK) - 10 Players
            ('Prasad Rahate', 'MSK', 'batter', 'right_hand', '', True, 18),
            ('Akash Jadhav', 'MSK', 'all_rounder', 'right_hand', 'right_arm_fast', False, 7),
            ('Amogh Bapat', 'MSK', 'batter', 'left_hand', '', False, 10),
            ('Tushar Rahate', 'MSK', 'bowler', 'right_hand', 'right_arm_offspin', False, 99),
            ('Ramdas Pawar', 'MSK', 'all_rounder', 'right_hand', 'right_arm_medium', False, 8),
            ('Banti Rahate', 'MSK', 'wk_batter', 'right_hand', '', False, 1),
            ('Vikas Pawar', 'MSK', 'bowler', 'right_hand', 'right_arm_fast', False, 24),
            ('Prashant Teravkar', 'MSK', 'batter', 'right_hand', '', False, 3),
            ('Anuj Pawar', 'MSK', 'all_rounder', 'left_hand', 'left_arm_orthodox', False, 22),
            ('Nilesh Kilje', 'MSK', 'bowler', 'right_hand', 'right_arm_medium', False, 17),

            # Team 2: Malghar Royals (MR) - 10 Players
            ('Abhi Kilje', 'MR', 'batter', 'right_hand', '', True, 11),
            ('Ayush Kilje', 'MR', 'bowler', 'right_hand', 'right_arm_fast', False, 25),
            ('Siddhesh Kilje', 'MR', 'all_rounder', 'left_hand', 'left_arm_orthodox', False, 9),
            ('Tejas Nitin Khedekar', 'MR', 'batter', 'right_hand', '', False, 14),
            ('Mahesh Manohar Mahadik', 'MR', 'bowler', 'right_hand', 'right_arm_offspin', False, 77),
            ('Vinay Kilje', 'MR', 'wk_batter', 'right_hand', '', False, 5),
            ('Saurabh Kilje', 'MR', 'bowler', 'left_hand', 'left_arm_fast', False, 19),
            ('Prem Ghole', 'MR', 'batter', 'right_hand', '', False, 33),
            ('Rahul Date', 'MR', 'all_rounder', 'right_hand', 'right_arm_medium', False, 45),
            ('Deepak Latke', 'MR', 'bowler', 'right_hand', 'right_arm_fast', False, 12),

            # Team 3: Malghar Titans (MT) - 10 Players
            ('Rushikesh Thasale', 'MT', 'all_rounder', 'right_hand', 'right_arm_fast', True, 33),
            ('Sandesh Pawar', 'MT', 'batter', 'left_hand', '', False, 6),
            ('Sachin Waje', 'MT', 'bowler', 'right_hand', 'right_arm_offspin', False, 21),
            ('Praphull Pawar', 'MT', 'batter', 'right_hand', '', False, 15),
            ('Sachin Pawar', 'MT', 'all_rounder', 'right_hand', 'right_arm_medium', False, 27),
            ('Shubham Waje', 'MT', 'wk_batter', 'right_hand', '', False, 2),
            ('Prasad Kilje', 'MT', 'bowler', 'left_hand', 'left_arm_fast', False, 13),
            ('Pranit Tatkare', 'MT', 'batter', 'right_hand', '', False, 44),
            ('Suyog Tambade', 'MT', 'all_rounder', 'left_hand', 'left_arm_orthodox', False, 88),
            ('Bacchu Mahadik', 'MT', 'bowler', 'right_hand', 'right_arm_medium', False, 30),

            # Team 4: Malghar Warriors (MW) - 10 Players
            ('Prafulla Mahadik', 'MW', 'batter', 'right_hand', '', True, 5),
            ('Dinesh Mahadik', 'MW', 'bowler', 'right_hand', 'right_arm_fast', False, 16),
            ('Siddhesh Waje', 'MW', 'all_rounder', 'right_hand', 'right_arm_medium', False, 23),
            ('Sandesh Chile', 'MW', 'batter', 'left_hand', '', False, 4),
            ('Viru Waje', 'MW', 'wk_batter', 'right_hand', '', False, 10),
            ('Barkya Ghole', 'MW', 'bowler', 'right_hand', 'right_arm_offspin', False, 29),
            ('Tushar Khatate', 'MW', 'all_rounder', 'right_hand', 'right_arm_fast', False, 55),
            ('Sumit Waje', 'MW', 'batter', 'right_hand', '', False, 37),
            ('Swaraj Ghole', 'MW', 'bowler', 'left_hand', 'left_arm_orthodox', False, 49),
            ('Shashank Ghole', 'MW', 'all_rounder', 'right_hand', 'right_arm_medium', False, 66),

            # Team 5: Malghar Challengers (MC) - 9 Players
            ('Suraj Waje', 'MC', 'batter', 'left_hand', '', True, 77),
            ('Vicky Waje', 'MC', 'bowler', 'right_hand', 'right_arm_fast', False, 13),
            ('Abhijit Mahadik', 'MC', 'all_rounder', 'right_hand', 'right_arm_medium', False, 28),
            ('Kiran Ghole', 'MC', 'batter', 'right_hand', '', False, 31),
            ('Vishal Pawar', 'MC', 'bowler', 'right_hand', 'right_arm_offspin', False, 51),
            ('Sairaj Mahadik', 'MC', 'wk_batter', 'right_hand', '', False, 8),
            ('Kalpesh Kilje', 'MC', 'all_rounder', 'left_hand', 'left_arm_orthodox', False, 36),
            ('Vishal Mahadik', 'MC', 'bowler', 'left_hand', 'left_arm_fast', False, 42),
            ('Nilesh Mahadik (Bhaya)', 'MC', 'batter', 'right_hand', '', False, 90),

            # Team 6: Malghar Strikers (MS) - 9 Players
            ('Akshay Dilip Mahadik', 'MS', 'batter', 'right_hand', '', True, 21),
            ('Sandeep Ghole', 'MS', 'bowler', 'right_hand', 'right_arm_fast', False, 14),
            ('Rohan Mahadik', 'MS', 'all_rounder', 'left_hand', 'right_arm_medium', False, 35),
            ('Shubham Latke', 'MS', 'batter', 'right_hand', '', False, 26),
            ('Pranay Zhagade', 'MS', 'wk_batter', 'right_hand', '', False, 9),
            ('Sagar Duduskar', 'MS', 'bowler', 'right_hand', 'right_arm_offspin', False, 80),
            ('Suyash Ombalkar', 'MS', 'all_rounder', 'right_hand', 'right_arm_medium', False, 63),
            ('Manish Dalvi', 'MS', 'bowler', 'left_hand', 'left_arm_orthodox', False, 47),
            ('Sanket Chile', 'MS', 'batter', 'right_hand', '', False, 17),
        ]

        def make_username(full_name):
            clean = re.sub(r'[^a-zA-Z0-9\s]', '', full_name).lower().strip()
            parts = clean.split()
            if len(parts) >= 2:
                return f"{parts[0]}_{parts[-1]}"
            return parts[0]

        player_map = {}
        for full_name, team_short, role, bat_style, bowl_style, is_capt, jersey in official_players_data:
            uname = make_username(full_name)
            # Ensure unique username
            base_uname = uname
            counter = 1
            while User.objects.filter(username=uname).exclude(email=f"{base_uname}@malgharpl.com").exists():
                uname = f"{base_uname}_{counter}"
                counter += 1

            u, _ = User.objects.get_or_create(
                username=uname,
                defaults={
                    'email': f"{uname}@malgharpl.com",
                    'first_name': full_name.split()[0],
                    'last_name': full_name.split()[-1],
                }
            )
            u.set_password('player123')
            u.save()

            profile, _ = PlayerProfile.objects.get_or_create(
                user=u,
                defaults={
                    'full_name': full_name,
                    'batting_style': bat_style,
                    'bowling_style': bowl_style,
                    'playing_role': role,
                    'jersey_number': jersey,
                    'bio': f"Official player for {teams[team_short].name} in Malghar Premier League 2026.",
                }
            )
            profile.full_name = full_name
            profile.batting_style = bat_style
            profile.bowling_style = bowl_style
            profile.playing_role = role
            profile.jersey_number = jersey
            profile.save()

            player_map[full_name] = profile

            # Squad membership
            SquadMembership.objects.update_or_create(
                player=profile,
                season=season,
                defaults={
                    'team': teams[team_short],
                    'is_captain': is_capt,
                }
            )

        self.stdout.write(self.style.SUCCESS(f'Successfully registered and seeded all {len(official_players_data)} official players!'))

        # 6. Seed Realistic Matches & Deliveries using the real players
        now = timezone.now()

        # MATCH 1: MSK vs MR (MSK won by 13 runs)
        m1, _ = Match.objects.get_or_create(
            season=season,
            match_number=1,
            defaults={
                'team_a': teams['MSK'],
                'team_b': teams['MR'],
                'venue': venue,
                'date': now - timedelta(days=5),
                'status': 'completed',
                'match_format': 'T20',
                'toss_winner': teams['MSK'],
                'toss_decision': 'bat',
                'is_featured': True,
            }
        )

        inn1, _ = Innings.objects.get_or_create(
            match=m1,
            innings_number=1,
            defaults={
                'batting_team': teams['MSK'],
                'bowling_team': teams['MR'],
                'total_runs': 178,
                'total_wickets': 4,
                'total_overs': 20.0,
                'total_extras': 12,
                'is_completed': True,
            }
        )
        self._seed_sample_innings_deliveries(
            innings=inn1,
            striker=player_map['Prasad Rahate'],
            non_striker=player_map['Akash Jadhav'],
            bowler1=player_map['Ayush Kilje'],
            bowler2=player_map['Siddhesh Kilje'],
            wicket_keeper=player_map['Vinay Kilje'],
            target_runs=178,
            target_wickets=4
        )

        inn2, _ = Innings.objects.get_or_create(
            match=m1,
            innings_number=2,
            defaults={
                'batting_team': teams['MR'],
                'bowling_team': teams['MSK'],
                'total_runs': 165,
                'total_wickets': 7,
                'total_overs': 20.0,
                'total_extras': 8,
                'is_completed': True,
                'target': 179,
            }
        )
        self._seed_sample_innings_deliveries(
            innings=inn2,
            striker=player_map['Abhi Kilje'],
            non_striker=player_map['Tejas Nitin Khedekar'],
            bowler1=player_map['Tushar Rahate'],
            bowler2=player_map['Vikas Pawar'],
            wicket_keeper=player_map['Banti Rahate'],
            target_runs=165,
            target_wickets=7
        )

        MatchResult.objects.update_or_create(
            match=m1,
            defaults={
                'winner': teams['MSK'],
                'result_summary': 'Malghar Super Kings won by 13 runs',
                'player_of_match': player_map['Prasad Rahate'],
                'is_tie': False,
                'is_no_result': False,
            }
        )

        # MATCH 2: MT vs MW (MT won by 5 wickets)
        m2, _ = Match.objects.get_or_create(
            season=season,
            match_number=2,
            defaults={
                'team_a': teams['MT'],
                'team_b': teams['MW'],
                'venue': venue,
                'date': now - timedelta(days=3),
                'status': 'completed',
                'match_format': 'T20',
                'toss_winner': teams['MT'],
                'toss_decision': 'bowl',
                'is_featured': False,
            }
        )

        inn2_1, _ = Innings.objects.get_or_create(
            match=m2,
            innings_number=1,
            defaults={
                'batting_team': teams['MW'],
                'bowling_team': teams['MT'],
                'total_runs': 142,
                'total_wickets': 8,
                'total_overs': 20.0,
                'total_extras': 6,
                'is_completed': True,
            }
        )
        self._seed_sample_innings_deliveries(
            innings=inn2_1,
            striker=player_map['Prafulla Mahadik'],
            non_striker=player_map['Sandesh Chile'],
            bowler1=player_map['Rushikesh Thasale'],
            bowler2=player_map['Sachin Waje'],
            wicket_keeper=player_map['Shubham Waje'],
            target_runs=142,
            target_wickets=8
        )

        inn2_2, _ = Innings.objects.get_or_create(
            match=m2,
            innings_number=2,
            defaults={
                'batting_team': teams['MT'],
                'bowling_team': teams['MW'],
                'total_runs': 146,
                'total_wickets': 5,
                'total_overs': 18.4,
                'total_extras': 10,
                'is_completed': True,
                'target': 143,
            }
        )
        self._seed_sample_innings_deliveries(
            innings=inn2_2,
            striker=player_map['Sandesh Pawar'],
            non_striker=player_map['Praphull Pawar'],
            bowler1=player_map['Dinesh Mahadik'],
            bowler2=player_map['Barkya Ghole'],
            wicket_keeper=player_map['Viru Waje'],
            target_runs=146,
            target_wickets=5
        )

        MatchResult.objects.update_or_create(
            match=m2,
            defaults={
                'winner': teams['MT'],
                'result_summary': 'Malghar Titans won by 5 wickets (with 8 balls remaining)',
                'player_of_match': player_map['Rushikesh Thasale'],
                'is_tie': False,
                'is_no_result': False,
            }
        )

        # MATCH 3: MC vs MS (Live Match)
        m3, _ = Match.objects.get_or_create(
            season=season,
            match_number=3,
            defaults={
                'team_a': teams['MC'],
                'team_b': teams['MS'],
                'venue': venue,
                'date': now - timedelta(hours=1),
                'status': 'live',
                'match_format': 'T20',
                'toss_winner': teams['MC'],
                'toss_decision': 'bat',
                'is_featured': True,
            }
        )

        inn3_1, _ = Innings.objects.get_or_create(
            match=m3,
            innings_number=1,
            defaults={
                'batting_team': teams['MC'],
                'bowling_team': teams['MS'],
                'total_runs': 88,
                'total_wickets': 2,
                'total_overs': 10.3,
                'total_extras': 4,
                'is_completed': False,
            }
        )
        self._seed_sample_innings_deliveries(
            innings=inn3_1,
            striker=player_map['Suraj Waje'],
            non_striker=player_map['Kiran Ghole'],
            bowler1=player_map['Sandeep Ghole'],
            bowler2=player_map['Sagar Duduskar'],
            wicket_keeper=player_map['Pranay Zhagade'],
            target_runs=88,
            target_wickets=2
        )

        # Upcoming Fixtures
        upcoming = [
            (4, teams['MSK'], teams['MT'], now + timedelta(days=2), True),
            (5, teams['MR'], teams['MW'], now + timedelta(days=4), False),
            (6, teams['MC'], teams['MSK'], now + timedelta(days=6), False),
            (7, teams['MS'], teams['MT'], now + timedelta(days=8), False),
        ]
        for num, ta, tb, m_date, feat in upcoming:
            Match.objects.get_or_create(
                season=season,
                match_number=num,
                defaults={
                    'team_a': ta,
                    'team_b': tb,
                    'venue': venue,
                    'date': m_date,
                    'status': 'scheduled',
                    'match_format': 'T20',
                    'is_featured': feat,
                }
            )

        self.stdout.write(self.style.SUCCESS('Tournament database seeded successfully with all 58 official players!'))

    def _seed_sample_innings_deliveries(
        self, innings, striker, non_striker, bowler1, bowler2, wicket_keeper, target_runs, target_wickets
    ):
        """Generates realistic ball-by-ball deliveries matching desired totals."""
        if innings.deliveries.exists():
            return

        current_runs = 0
        current_wickets = 0
        deliv_count = 1
        overs_to_generate = min(12, int(float(innings.total_overs or 10)))

        for ov in range(overs_to_generate):
            bowler = bowler1 if ov % 2 == 0 else bowler2
            for ball in range(1, 7):
                if current_runs >= target_runs and innings.is_completed:
                    break

                is_wkt = (current_wickets < target_wickets and (ov + ball) % 5 == 0)
                runs = 0 if is_wkt else (6 if (ov * 6 + ball) % 11 == 0 else (4 if (ov * 6 + ball) % 7 == 0 else (ov + ball) % 3))

                if is_wkt:
                    current_wickets += 1
                    w_type = 'bowled' if current_wickets % 2 == 1 else 'caught'
                    fielder = wicket_keeper if w_type == 'caught' else None

                    BallDelivery.objects.create(
                        innings=innings,
                        over_number=ov,
                        ball_number=ball,
                        delivery_number=deliv_count,
                        batter=striker,
                        non_striker=non_striker,
                        bowler=bowler,
                        runs_scored=0,
                        extras_runs=0,
                        is_wide=False,
                        is_no_ball=False,
                        is_wicket=True,
                        wicket_type=w_type,
                        wicket_player=striker,
                        fielder=fielder,
                        is_legal=True,
                    )
                else:
                    current_runs += runs
                    BallDelivery.objects.create(
                        innings=innings,
                        over_number=ov,
                        ball_number=ball,
                        delivery_number=deliv_count,
                        batter=striker if ball % 2 == 1 else non_striker,
                        non_striker=non_striker if ball % 2 == 1 else striker,
                        bowler=bowler,
                        runs_scored=runs,
                        extras_runs=0,
                        is_wide=False,
                        is_no_ball=False,
                        is_boundary=(runs == 4),
                        is_six=(runs == 6),
                        is_legal=True,
                    )

                deliv_count += 1

        BallDelivery.objects.create(
            innings=innings,
            over_number=0,
            ball_number=0,
            delivery_number=deliv_count,
            batter=striker,
            non_striker=non_striker,
            bowler=bowler1,
            runs_scored=0,
            extras_runs=1,
            is_wide=True,
            is_legal=False,
        )
