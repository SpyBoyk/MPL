from rest_framework import generics, permissions
from rest_framework.views import APIView
from rest_framework.response import Response

from .models import Season, Venue, Award
from .serializers import SeasonSerializer, SeasonListSerializer, VenueSerializer, AwardSerializer
from apps.teams.models import Team
from apps.accounts.models import PlayerProfile
from apps.matches.models import Match


class SeasonListView(generics.ListAPIView):
    """List all seasons."""
    serializer_class = SeasonListSerializer
    permission_classes = [permissions.AllowAny]
    queryset = Season.objects.all()
    pagination_class = None


class SeasonDetailView(generics.RetrieveAPIView):
    """Get season details by slug."""
    serializer_class = SeasonSerializer
    permission_classes = [permissions.AllowAny]
    queryset = Season.objects.all()
    lookup_field = 'slug'


class VenueListView(generics.ListAPIView):
    """List all venues."""
    serializer_class = VenueSerializer
    permission_classes = [permissions.AllowAny]
    queryset = Venue.objects.all()
    pagination_class = None


class TournamentOverviewView(APIView):
    """Aggregate stats for homepage."""
    permission_classes = [permissions.AllowAny]

    def get(self, request):
        current_season = Season.objects.filter(is_current=True).first()

        if current_season:
            teams_count = Team.objects.filter(
                squad__season=current_season
            ).distinct().count()
            players_count = PlayerProfile.objects.filter(
                memberships__season=current_season
            ).distinct().count()
            total_matches = Match.objects.filter(season=current_season).count()
            matches_completed = Match.objects.filter(
                season=current_season, status='completed'
            ).count()
            upcoming_matches = Match.objects.filter(
                season=current_season, status='scheduled'
            ).count()
        else:
            teams_count = Team.objects.count()
            players_count = PlayerProfile.objects.count()
            total_matches = 0
            matches_completed = 0
            upcoming_matches = 0

        return Response({
            'current_season': SeasonSerializer(current_season).data if current_season else None,
            'teams_count': teams_count,
            'players_count': players_count,
            'total_matches': total_matches,
            'matches_completed': matches_completed,
            'upcoming_matches': upcoming_matches,
        })


class AwardListView(generics.ListCreateAPIView):
    """List all awards or register a new award."""
    serializer_class = AwardSerializer
    permission_classes = [permissions.AllowAny]
    queryset = Award.objects.all()
    pagination_class = None

    def get_queryset(self):
        queryset = Award.objects.all()
        category = self.request.query_params.get('category')
        if category and category != 'All':
            queryset = queryset.filter(category__iexact=category)
        award_type = self.request.query_params.get('type')
        if award_type and award_type != 'All':
            queryset = queryset.filter(award_type__iexact=award_type)
        return queryset


class AwardDetailView(generics.RetrieveUpdateDestroyAPIView):
    """Retrieve, update, or delete a tournament award."""
    serializer_class = AwardSerializer
    permission_classes = [permissions.AllowAny]
    queryset = Award.objects.all()

