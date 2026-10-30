from django.test import TestCase
from django.utils import timezone
from datetime import date
from apps.tournaments.models import Season, Venue
from apps.teams.models import Team
from apps.accounts.models import User, PlayerProfile
from apps.matches.models import Match, Innings, BallDelivery
from apps.matches.services.scoring import ScoringService
from apps.statistics.services.standings import StandingsService


class ScoringEngineTestCase(TestCase):
    def setUp(self):
        self.season = Season.objects.create(
            name='Test Season',
            slug='test-season',
            start_date=date(2026, 1, 1),
            end_date=date(2026, 12, 31),
            status='ongoing',
            is_current=True,
            overs_per_innings=20
        )
        self.venue = Venue.objects.create(name='Test Stadium')
        self.team_a = Team.objects.create(name='Team A', short_name='TMA', slug='team-a')
        self.team_b = Team.objects.create(name='Team B', short_name='TMB', slug='team-b')

        # Users and players
        u1 = User.objects.create_user(username='batter1', email='b1@test.com', password='pw')
        u2 = User.objects.create_user(username='batter2', email='b2@test.com', password='pw')
        u3 = User.objects.create_user(username='bowler1', email='bw1@test.com', password='pw')

        self.batter1 = PlayerProfile.objects.create(user=u1, full_name='Batter One')
        self.batter2 = PlayerProfile.objects.create(user=u2, full_name='Batter Two')
        self.bowler1 = PlayerProfile.objects.create(user=u3, full_name='Bowler One')

        self.match = Match.objects.create(
            season=self.season,
            match_number=1,
            team_a=self.team_a,
            team_b=self.team_b,
            venue=self.venue,
            date=timezone.now(),
            status='live',
        )

        self.innings = Innings.objects.create(
            match=self.match,
            innings_number=1,
            batting_team=self.team_a,
            bowling_team=self.team_b,
        )

    def test_record_dot_ball(self):
        deliv = ScoringService.record_delivery(self.innings, {
            'batter': self.batter1.id,
            'non_striker': self.batter2.id,
            'bowler': self.bowler1.id,
            'runs_scored': 0,
        })
        self.innings.refresh_from_db()
        self.assertEqual(self.innings.total_runs, 0)
        self.assertEqual(float(self.innings.total_overs), 0.1)
        self.assertEqual(self.innings.total_wickets, 0)
        self.assertTrue(deliv.is_legal)

    def test_record_boundary_four(self):
        deliv = ScoringService.record_delivery(self.innings, {
            'batter': self.batter1.id,
            'non_striker': self.batter2.id,
            'bowler': self.bowler1.id,
            'runs_scored': 4,
            'is_boundary': True,
        })
        self.innings.refresh_from_db()
        self.assertEqual(self.innings.total_runs, 4)
        self.assertTrue(deliv.is_boundary)
        self.assertEqual(deliv.runs_scored, 4)

    def test_record_wide_ball(self):
        deliv = ScoringService.record_delivery(self.innings, {
            'batter': self.batter1.id,
            'non_striker': self.batter2.id,
            'bowler': self.bowler1.id,
            'is_wide': True,
            'extras_runs': 1,
        })
        self.innings.refresh_from_db()
        self.assertEqual(self.innings.total_runs, 1)
        self.assertEqual(self.innings.total_extras, 1)
        # Legal overs should still be 0.0 because wide is not legal
        self.assertEqual(float(self.innings.total_overs), 0.0)
        self.assertFalse(deliv.is_legal)

    def test_record_no_ball_with_bat_runs(self):
        deliv = ScoringService.record_delivery(self.innings, {
            'batter': self.batter1.id,
            'non_striker': self.batter2.id,
            'bowler': self.bowler1.id,
            'runs_scored': 2,
            'is_no_ball': True,
            'extras_runs': 1,
        })
        self.innings.refresh_from_db()
        self.assertEqual(self.innings.total_runs, 3)
        self.assertEqual(self.innings.total_extras, 1)
        self.assertEqual(float(self.innings.total_overs), 0.0)
        self.assertFalse(deliv.is_legal)

    def test_record_wicket(self):
        deliv = ScoringService.record_delivery(self.innings, {
            'batter': self.batter1.id,
            'non_striker': self.batter2.id,
            'bowler': self.bowler1.id,
            'runs_scored': 0,
            'is_wicket': True,
            'wicket_type': 'bowled',
            'wicket_player': self.batter1.id,
        })
        self.innings.refresh_from_db()
        self.assertEqual(self.innings.total_wickets, 1)
        self.assertEqual(float(self.innings.total_overs), 0.1)

    def test_over_completion(self):
        # Record 6 legal balls
        for _ in range(6):
            ScoringService.record_delivery(self.innings, {
                'batter': self.batter1.id,
                'non_striker': self.batter2.id,
                'bowler': self.bowler1.id,
                'runs_scored': 1,
            })
        self.innings.refresh_from_db()
        self.assertEqual(float(self.innings.total_overs), 1.0)
        self.assertEqual(self.innings.total_runs, 6)

    def test_batting_scorecard_calculation(self):
        # 1st ball: 4 runs
        ScoringService.record_delivery(self.innings, {
            'batter': self.batter1.id,
            'non_striker': self.batter2.id,
            'bowler': self.bowler1.id,
            'runs_scored': 4,
            'is_boundary': True,
        })
        # 2nd ball: 6 runs
        ScoringService.record_delivery(self.innings, {
            'batter': self.batter1.id,
            'non_striker': self.batter2.id,
            'bowler': self.bowler1.id,
            'runs_scored': 6,
            'is_six': True,
        })

        card = ScoringService.get_batting_scorecard(self.innings)
        self.assertEqual(len(card), 1)
        b1 = card[0]
        self.assertEqual(b1['runs'], 10)
        self.assertEqual(b1['balls'], 2)
        self.assertEqual(b1['fours'], 1)
        self.assertEqual(b1['sixes'], 1)
        self.assertEqual(b1['strike_rate'], 500.0)
