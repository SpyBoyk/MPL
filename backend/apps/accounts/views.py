from rest_framework import status, generics, permissions
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.authtoken.models import Token

from .serializers import (
    RegisterSerializer, LoginSerializer,
    UserSerializer, PlayerProfileSerializer,
)
from .models import PlayerProfile


class RegisterView(APIView):
    """Register a new user with player profile."""
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        serializer = RegisterSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        return Response(
            {
                'message': 'Registration successful. Please log in.',
                'user': UserSerializer(user).data,
            },
            status=status.HTTP_201_CREATED,
        )


class LoginView(APIView):
    """Login and receive auth token."""
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        serializer = LoginSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.validated_data['user']
        token, _ = Token.objects.get_or_create(user=user)

        # Get player profile
        profile_data = None
        try:
            profile = user.player_profile
            profile_data = PlayerProfileSerializer(profile).data
        except PlayerProfile.DoesNotExist:
            pass

        return Response({
            'token': token.key,
            'user': UserSerializer(user).data,
            'player_profile': profile_data,
        })


class PlayerDashboardView(APIView):
    """Player dashboard data for the authenticated user."""
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        try:
            profile = request.user.player_profile
        except PlayerProfile.DoesNotExist:
            return Response(
                {'detail': 'Player profile not found.'},
                status=status.HTTP_404_NOT_FOUND,
            )

        from apps.statistics.services.stats import PlayerStatsService
        from apps.matches.models import Match
        from apps.teams.models import SquadMembership

        # Get current team
        membership = SquadMembership.objects.select_related('team', 'season').filter(
            player=profile, season__is_current=True
        ).first()

        # Career stats
        career_stats = PlayerStatsService.get_batting_stats(profile)
        bowling_stats = PlayerStatsService.get_bowling_stats(profile)
        career_stats.update(bowling_stats)

        # Recent performances
        recent_performances = PlayerStatsService.get_recent_performances(profile, limit=5)

        # Upcoming matches
        upcoming_matches = []
        if membership:
            from apps.matches.serializers import MatchListSerializer
            matches = Match.objects.filter(
                status='scheduled',
                season__is_current=True,
            ).filter(
                models_q_team_filter(membership.team)
            ).order_by('date')[:3]
            upcoming_matches = MatchListSerializer(matches, many=True).data

        # Chart data
        charts = PlayerStatsService.get_chart_data(profile)

        # Profile completion
        fields = ['full_name', 'photo', 'date_of_birth', 'batting_style',
                  'bowling_style', 'playing_role', 'jersey_number', 'bio']
        filled = sum(1 for f in fields if getattr(profile, f))
        profile_completion = int((filled / len(fields)) * 100)

        return Response({
            'player': PlayerProfileSerializer(profile).data,
            'profile_completion': profile_completion,
            'career_stats': career_stats,
            'recent_performances': recent_performances,
            'upcoming_matches': upcoming_matches,
            'charts': charts,
            'team': {
                'id': membership.team.id,
                'name': membership.team.name,
                'short_name': membership.team.short_name,
                'slug': membership.team.slug,
                'is_captain': membership.is_captain,
            } if membership else None,
        })


class PlayerProfileView(APIView):
    """Get authenticated user's player profile."""
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        try:
            profile = request.user.player_profile
        except PlayerProfile.DoesNotExist:
            return Response(
                {'detail': 'Player profile not found.'},
                status=status.HTTP_404_NOT_FOUND,
            )
        return Response(PlayerProfileSerializer(profile).data)


class PlayerListView(generics.ListAPIView):
    """List all player profiles with search and filter."""
    serializer_class = PlayerProfileSerializer
    permission_classes = [permissions.AllowAny]

    def get_queryset(self):
        queryset = PlayerProfile.objects.select_related('user').prefetch_related(
            'memberships__team', 'memberships__season'
        )
        search = self.request.query_params.get('search')
        if search:
            queryset = queryset.filter(full_name__icontains=search)

        role = self.request.query_params.get('role')
        if role:
            queryset = queryset.filter(playing_role=role)

        team = self.request.query_params.get('team')
        if team:
            queryset = queryset.filter(
                memberships__team__slug=team,
                memberships__season__is_current=True,
            )

        return queryset


class PlayerDetailView(generics.RetrieveAPIView):
    """Get a specific player profile with stats."""
    serializer_class = PlayerProfileSerializer
    permission_classes = [permissions.AllowAny]
    queryset = PlayerProfile.objects.select_related('user').prefetch_related(
        'memberships__team', 'memberships__season'
    )

    def retrieve(self, request, *args, **kwargs):
        instance = self.get_object()
        data = self.get_serializer(instance).data

        # Add career stats
        from apps.statistics.services.stats import PlayerStatsService
        data['batting_stats'] = PlayerStatsService.get_batting_stats(instance)
        data['bowling_stats'] = PlayerStatsService.get_bowling_stats(instance)
        data['fielding_stats'] = PlayerStatsService.get_fielding_stats(instance)
        data['recent_performances'] = PlayerStatsService.get_recent_performances(instance, limit=10)

        return Response(data)


def models_q_team_filter(team):
    """Helper to filter matches involving a specific team."""
    from django.db.models import Q
    return Q(team_a=team) | Q(team_b=team)
