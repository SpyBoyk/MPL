import secrets
import string

from rest_framework import status, generics, permissions
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.authtoken.models import Token
from rest_framework.parsers import MultiPartParser, FormParser

from .serializers import (
    RegisterSerializer, LoginSerializer,
    AuthUserSerializer, PlayerProfileSerializer, PlayerProfileSelfSerializer,
    PlayerPhotoUpdateSerializer, AdminPaymentStatusSerializer,
)
from .models import PlayerProfile

MAX_PHOTO_SIZE = 5 * 1024 * 1024  # 5MB


class RegisterView(APIView):
    """Register a new user with player profile."""
    permission_classes = [permissions.AllowAny]
    parser_classes = [MultiPartParser, FormParser]

    def post(self, request):
        serializer = RegisterSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        return Response(
            {
                'message': 'Registration successful. Please log in.',
                'user': AuthUserSerializer(user).data,
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
            profile_data = PlayerProfileSelfSerializer(profile).data
        except PlayerProfile.DoesNotExist:
            pass

        return Response({
            'token': token.key,
            'user': AuthUserSerializer(user).data,
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
            'player': PlayerProfileSelfSerializer(profile).data,
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
    """Get or partially update the authenticated user's own player profile."""
    permission_classes = [permissions.IsAuthenticated]
    parser_classes = [MultiPartParser, FormParser]

    def get(self, request):
        try:
            profile = request.user.player_profile
        except PlayerProfile.DoesNotExist:
            return Response(
                {'detail': 'Player profile not found.'},
                status=status.HTTP_404_NOT_FOUND,
            )
        return Response(PlayerProfileSelfSerializer(profile).data)

    def patch(self, request):
        """Update the caller's own profile photo. The target is always
        request.user.player_profile — never taken from client input — so a
        player can only ever change their own photo."""
        try:
            profile = request.user.player_profile
        except PlayerProfile.DoesNotExist:
            return Response(
                {'detail': 'Player profile not found.'},
                status=status.HTTP_404_NOT_FOUND,
            )

        serializer = PlayerPhotoUpdateSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        photo = serializer.validated_data['photo']

        if photo.size > MAX_PHOTO_SIZE:
            return Response(
                {'detail': 'Photo must be 5MB or smaller.'},
                status=status.HTTP_400_BAD_REQUEST,
            )

        if profile.photo:
            profile.photo.delete(save=False)
        profile.photo = photo
        profile.save(update_fields=['photo', 'updated_at'])

        return Response(PlayerProfileSelfSerializer(profile).data)


class ResetPlayerPasswordView(APIView):
    """Reset a player's login password to a new random temporary password
    (admin only). The temporary password is returned once in the response
    for the admin to relay to the player — it is never emailed or logged."""
    permission_classes = [permissions.IsAdminUser]

    def post(self, request, pk):
        try:
            profile = PlayerProfile.objects.select_related('user').get(pk=pk)
        except PlayerProfile.DoesNotExist:
            return Response(
                {'detail': 'Player not found.'},
                status=status.HTTP_404_NOT_FOUND,
            )

        alphabet = string.ascii_letters + string.digits
        temporary_password = ''.join(secrets.choice(alphabet) for _ in range(10))

        user = profile.user
        user.set_password(temporary_password)
        user.save(update_fields=['password'])

        # Resetting the password signs the player out of any existing session.
        Token.objects.filter(user=user).delete()

        return Response({
            'detail': f"Password reset for {profile.full_name or user.username}.",
            'username': user.username,
            'temporary_password': temporary_password,
        })


class AdminUserListView(generics.ListAPIView):
    """List every registered player with account status (active/admin) and
    payment-verification status — the admin user-management screen (admin
    only). Uses the same 'self' serializer as a player's own dashboard, since
    an admin is allowed to see exactly what a player can see about
    themselves, for every player at once."""
    serializer_class = PlayerProfileSelfSerializer
    permission_classes = [permissions.IsAdminUser]
    queryset = PlayerProfile.objects.select_related('user').order_by('-created_at')


class AdminPaymentStatusView(APIView):
    """Approve or reject a player's uploaded payment screenshot (admin only)."""
    permission_classes = [permissions.IsAdminUser]

    def post(self, request, pk):
        try:
            profile = PlayerProfile.objects.select_related('user').get(pk=pk)
        except PlayerProfile.DoesNotExist:
            return Response(
                {'detail': 'Player not found.'},
                status=status.HTTP_404_NOT_FOUND,
            )

        serializer = AdminPaymentStatusSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        profile.payment_status = serializer.validated_data['status']
        profile.payment_note = serializer.validated_data.get('note', '')
        profile.save(update_fields=['payment_status', 'payment_note', 'updated_at'])

        return Response(PlayerProfileSelfSerializer(profile).data)


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
