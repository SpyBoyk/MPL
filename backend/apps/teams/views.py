from rest_framework import generics, permissions
from .models import Team
from .serializers import TeamListSerializer, TeamDetailSerializer


class TeamListView(generics.ListAPIView):
    """List all teams."""
    serializer_class = TeamListSerializer
    permission_classes = [permissions.AllowAny]
    pagination_class = None

    def get_queryset(self):
        queryset = Team.objects.prefetch_related('squad__player', 'squad__season')
        season = self.request.query_params.get('season')
        if season:
            queryset = queryset.filter(squad__season__slug=season).distinct()
        return queryset


class TeamDetailView(generics.RetrieveAPIView):
    """Get team details with squad."""
    serializer_class = TeamDetailSerializer
    permission_classes = [permissions.AllowAny]
    queryset = Team.objects.prefetch_related(
        'squad__player__user', 'squad__season'
    )
    lookup_field = 'slug'
