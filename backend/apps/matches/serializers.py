from rest_framework import serializers
from .models import Match, MatchResult, Innings, BallDelivery
from apps.tournaments.serializers import VenueSerializer


class MatchResultSerializer(serializers.ModelSerializer):
    winner_name = serializers.CharField(source='winner.name', read_only=True, default=None)
    player_of_match_name = serializers.CharField(
        source='player_of_match.full_name', read_only=True, default=None
    )

    class Meta:
        model = MatchResult
        fields = (
            'winner', 'winner_name', 'result_summary',
            'player_of_match', 'player_of_match_name',
            'is_tie', 'is_no_result'
        )


class BallDeliverySerializer(serializers.ModelSerializer):
    batter_name = serializers.CharField(source='batter.full_name', read_only=True)
    bowler_name = serializers.CharField(source='bowler.full_name', read_only=True)
    non_striker_name = serializers.CharField(source='non_striker.full_name', read_only=True)
    fielder_name = serializers.CharField(source='fielder.full_name', read_only=True, default=None)
    wicket_player_name = serializers.CharField(
        source='wicket_player.full_name', read_only=True, default=None
    )

    class Meta:
        model = BallDelivery
        fields = (
            'id', 'over_number', 'ball_number', 'delivery_number',
            'batter', 'batter_name', 'non_striker', 'non_striker_name',
            'bowler', 'bowler_name',
            'runs_scored', 'extras_type', 'extras_runs',
            'is_wide', 'is_no_ball', 'is_bye', 'is_leg_bye',
            'is_wicket', 'is_boundary', 'is_six',
            'wicket_type', 'wicket_player', 'wicket_player_name',
            'fielder', 'fielder_name',
            'total_runs_this_ball', 'is_legal', 'timestamp'
        )


class BatterScorecardSerializer(serializers.Serializer):
    """Calculated batting scorecard entry."""
    player_id = serializers.IntegerField()
    player_name = serializers.CharField()
    how_out = serializers.CharField()
    runs = serializers.IntegerField()
    balls = serializers.IntegerField()
    fours = serializers.IntegerField()
    sixes = serializers.IntegerField()
    strike_rate = serializers.FloatField()


class BowlerScorecardSerializer(serializers.Serializer):
    """Calculated bowling scorecard entry."""
    player_id = serializers.IntegerField()
    player_name = serializers.CharField()
    overs = serializers.CharField()
    maidens = serializers.IntegerField()
    runs = serializers.IntegerField()
    wickets = serializers.IntegerField()
    economy = serializers.FloatField()


class FallOfWicketSerializer(serializers.Serializer):
    """Fall of wicket entry."""
    wicket_number = serializers.IntegerField()
    score = serializers.IntegerField()
    overs = serializers.CharField()
    player_name = serializers.CharField()


class InningsSerializer(serializers.ModelSerializer):
    batting_team_name = serializers.CharField(source='batting_team.name', read_only=True)
    batting_team_short = serializers.CharField(source='batting_team.short_name', read_only=True)
    bowling_team_name = serializers.CharField(source='bowling_team.name', read_only=True)
    run_rate = serializers.FloatField(read_only=True)
    required_run_rate = serializers.FloatField(read_only=True)

    class Meta:
        model = Innings
        fields = (
            'id', 'innings_number', 'batting_team', 'batting_team_name',
            'batting_team_short', 'bowling_team', 'bowling_team_name',
            'total_runs', 'total_wickets', 'total_overs', 'total_extras',
            'is_completed', 'target', 'run_rate', 'required_run_rate'
        )


class InningsDetailSerializer(InningsSerializer):
    """Innings with full scorecard."""
    batting_scorecard = serializers.SerializerMethodField()
    bowling_scorecard = serializers.SerializerMethodField()
    fall_of_wickets = serializers.SerializerMethodField()
    extras_breakdown = serializers.SerializerMethodField()

    class Meta(InningsSerializer.Meta):
        fields = InningsSerializer.Meta.fields + (
            'batting_scorecard', 'bowling_scorecard',
            'fall_of_wickets', 'extras_breakdown'
        )

    def get_batting_scorecard(self, obj):
        from apps.matches.services.scoring import ScoringService
        return ScoringService.get_batting_scorecard(obj)

    def get_bowling_scorecard(self, obj):
        from apps.matches.services.scoring import ScoringService
        return ScoringService.get_bowling_scorecard(obj)

    def get_fall_of_wickets(self, obj):
        from apps.matches.services.scoring import ScoringService
        return ScoringService.get_fall_of_wickets(obj)

    def get_extras_breakdown(self, obj):
        from apps.matches.services.scoring import ScoringService
        return ScoringService.get_extras_breakdown(obj)


class MatchListSerializer(serializers.ModelSerializer):
    """Compact match listing."""
    team_a_name = serializers.CharField(source='team_a.name', read_only=True)
    team_a_short = serializers.CharField(source='team_a.short_name', read_only=True)
    team_a_logo = serializers.ImageField(source='team_a.logo', read_only=True)
    team_b_name = serializers.CharField(source='team_b.name', read_only=True)
    team_b_short = serializers.CharField(source='team_b.short_name', read_only=True)
    team_b_logo = serializers.ImageField(source='team_b.logo', read_only=True)
    venue = VenueSerializer(read_only=True)
    season_name = serializers.CharField(source='season.name', read_only=True)
    result = MatchResultSerializer(read_only=True)
    team_a_score = serializers.SerializerMethodField()
    team_b_score = serializers.SerializerMethodField()

    class Meta:
        model = Match
        fields = (
            'id', 'match_number', 'season', 'season_name',
            'team_a', 'team_a_name', 'team_a_short', 'team_a_logo',
            'team_b', 'team_b_name', 'team_b_short', 'team_b_logo',
            'venue', 'date', 'status', 'match_format',
            'toss_winner', 'toss_decision', 'is_featured',
            'result', 'team_a_score', 'team_b_score'
        )

    def get_team_a_score(self, obj):
        innings = obj.innings.filter(batting_team=obj.team_a).first()
        if innings:
            return f"{innings.total_runs}/{innings.total_wickets} ({innings.total_overs} ov)"
        return None

    def get_team_b_score(self, obj):
        innings = obj.innings.filter(batting_team=obj.team_b).first()
        if innings:
            return f"{innings.total_runs}/{innings.total_wickets} ({innings.total_overs} ov)"
        return None


class MatchDetailSerializer(MatchListSerializer):
    """Full match details with innings and scorecards."""
    innings_data = serializers.SerializerMethodField()

    class Meta(MatchListSerializer.Meta):
        fields = MatchListSerializer.Meta.fields + ('innings_data',)

    def get_innings_data(self, obj):
        innings_qs = obj.innings.select_related(
            'batting_team', 'bowling_team'
        ).prefetch_related('deliveries')
        return InningsDetailSerializer(innings_qs, many=True).data
