from rest_framework import permissions, status
from rest_framework.views import APIView
from rest_framework.response import Response

from apps.tournaments.models import Season
from apps.tournaments.serializers import SeasonSerializer
from apps.teams.models import Team
from .services.standings import StandingsService
from .services.stats import PlayerStatsService, TeamStatsService


class PointsTableView(APIView):
    """
    Get points table / standings for a season.
    Accepts optional ?season=<slug> query param (defaults to current season).
    """
    permission_classes = [permissions.AllowAny]

    def get(self, request):
        season_slug = request.query_params.get('season')
        if season_slug:
            season = Season.objects.filter(slug=season_slug).first()
        else:
            season = Season.objects.filter(is_current=True).first() or Season.objects.first()

        if not season:
            return Response({'detail': 'No season found.'}, status=status.HTTP_404_NOT_FOUND)

        standings = StandingsService.calculate_standings(season)
        return Response({
            'season': SeasonSerializer(season).data,
            'standings': standings,
        })


class StatisticsLeaderboardView(APIView):
    """
    Get player leaderboards for a season.
    Accepts:
      - ?season=<slug>
      - ?stat_type=batting|bowling|sixes|fielding (default: batting)
      - ?limit=10
      - ?top=true (returns dictionary of top performers for homepage)
    """
    permission_classes = [permissions.AllowAny]

    def get(self, request):
        season_slug = request.query_params.get('season')
        if season_slug:
            season = Season.objects.filter(slug=season_slug).first()
        else:
            season = Season.objects.filter(is_current=True).first()

        # If top=true, return snapshot for homepage
        is_top = request.query_params.get('top', '').lower() in ('true', '1')
        if is_top:
            top_batters = PlayerStatsService.get_leaderboard('batting', season=season, limit=3)
            top_bowlers = PlayerStatsService.get_leaderboard('bowling', season=season, limit=3)
            top_sixes = PlayerStatsService.get_leaderboard('sixes', season=season, limit=3)

            return Response({
                'season': SeasonSerializer(season).data if season else None,
                'top_batters': top_batters,
                'top_bowlers': top_bowlers,
                'top_six_hitters': top_sixes,
            })

        stat_type = request.query_params.get('stat_type', 'batting')
        try:
            limit = int(request.query_params.get('limit', 10))
        except ValueError:
            limit = 10

        leaderboard = PlayerStatsService.get_leaderboard(stat_type, season=season, limit=limit)

        return Response({
            'season': SeasonSerializer(season).data if season else None,
            'stat_type': stat_type,
            'leaderboard': leaderboard,
        })


class TeamStatsView(APIView):
    """Get aggregated season stats for a specific team."""
    permission_classes = [permissions.AllowAny]

    def get(self, request, slug):
        team = Team.objects.filter(slug=slug).first()
        if not team:
            return Response({'detail': 'Team not found.'}, status=status.HTTP_404_NOT_FOUND)

        season_slug = request.query_params.get('season')
        if season_slug:
            season = Season.objects.filter(slug=season_slug).first()
        else:
            season = Season.objects.filter(is_current=True).first()

        if not season:
            return Response({'detail': 'Season not found.'}, status=status.HTTP_404_NOT_FOUND)

        stats_data = TeamStatsService.get_team_season_stats(team, season)
        return Response(stats_data)
