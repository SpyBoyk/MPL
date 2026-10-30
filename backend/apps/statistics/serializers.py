from rest_framework import serializers


class TeamStandingsSerializer(serializers.Serializer):
    position = serializers.IntegerField()
    team = serializers.DictField()
    played = serializers.IntegerField()
    won = serializers.IntegerField()
    lost = serializers.IntegerField()
    tied = serializers.IntegerField()
    no_result = serializers.IntegerField()
    points = serializers.IntegerField()
    net_run_rate = serializers.FloatField()
    form = serializers.ListField(child=serializers.CharField())


class LeaderboardEntrySerializer(serializers.Serializer):
    rank = serializers.IntegerField()
    id = serializers.IntegerField()
    full_name = serializers.CharField()
    photo = serializers.CharField(allow_null=True)
    playing_role = serializers.CharField()
    team = serializers.DictField(allow_null=True)
    # Flexible extra fields depending on stat_type
    runs = serializers.IntegerField(required=False)
    innings = serializers.IntegerField(required=False)
    highest_score = serializers.CharField(required=False)
    batting_average = serializers.FloatField(required=False, allow_null=True)
    strike_rate = serializers.FloatField(required=False, allow_null=True)
    fours = serializers.IntegerField(required=False)
    sixes = serializers.IntegerField(required=False)
    wickets = serializers.IntegerField(required=False)
    economy_rate = serializers.FloatField(required=False, allow_null=True)
    best_bowling = serializers.CharField(required=False)
    catches = serializers.IntegerField(required=False)
