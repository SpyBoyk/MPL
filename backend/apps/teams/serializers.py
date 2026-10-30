from rest_framework import serializers
from .models import Team, SquadMembership
from apps.accounts.serializers import PlayerProfileListSerializer


class SquadMemberSerializer(serializers.ModelSerializer):
    player = PlayerProfileListSerializer()

    class Meta:
        model = SquadMembership
        fields = ('id', 'player', 'is_captain', 'joined_date')


class TeamListSerializer(serializers.ModelSerializer):
    captain = serializers.SerializerMethodField()
    squad_count = serializers.SerializerMethodField()

    class Meta:
        model = Team
        fields = (
            'id', 'name', 'short_name', 'slug', 'logo',
            'primary_color', 'secondary_color', 'captain', 'squad_count'
        )

    def get_captain(self, obj):
        membership = obj.squad.filter(
            is_captain=True, season__is_current=True
        ).select_related('player').first()
        if membership:
            return membership.player.full_name
        return None

    def get_squad_count(self, obj):
        return obj.squad.filter(season__is_current=True).count()


class TeamDetailSerializer(serializers.ModelSerializer):
    squad = serializers.SerializerMethodField()
    captain = serializers.SerializerMethodField()
    description = serializers.CharField()

    class Meta:
        model = Team
        fields = (
            'id', 'name', 'short_name', 'slug', 'logo',
            'primary_color', 'secondary_color', 'description',
            'captain', 'squad'
        )

    def get_captain(self, obj):
        membership = obj.squad.filter(
            is_captain=True, season__is_current=True
        ).select_related('player').first()
        if membership:
            return {
                'id': membership.player.id,
                'full_name': membership.player.full_name,
            }
        return None

    def get_squad(self, obj):
        memberships = obj.squad.filter(
            season__is_current=True
        ).select_related('player', 'player__user').order_by('-is_captain', 'player__full_name')
        return SquadMemberSerializer(memberships, many=True).data
