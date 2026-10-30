from django.db.models import Q
from rest_framework import generics, permissions, status
from rest_framework.views import APIView
from rest_framework.response import Response

from .models import Match, Innings, BallDelivery
from .serializers import (
    MatchListSerializer, MatchDetailSerializer,
    BallDeliverySerializer,
)
from .services.scoring import ScoringService


class MatchListView(generics.ListAPIView):
    """List matches with filters."""
    serializer_class = MatchListSerializer
    permission_classes = [permissions.AllowAny]

    def get_queryset(self):
        queryset = Match.objects.select_related(
            'team_a', 'team_b', 'venue', 'season', 'result', 'toss_winner',
            'result__winner', 'result__player_of_match'
        ).prefetch_related('innings')

        season = self.request.query_params.get('season')
        if season:
            queryset = queryset.filter(season__slug=season)

        match_status = self.request.query_params.get('status')
        if match_status:
            queryset = queryset.filter(status=match_status)

        team = self.request.query_params.get('team')
        if team:
            queryset = queryset.filter(Q(team_a__slug=team) | Q(team_b__slug=team))

        is_featured = self.request.query_params.get('is_featured')
        if is_featured:
            queryset = queryset.filter(is_featured=True)

        limit = self.request.query_params.get('limit')
        if limit:
            try:
                queryset = queryset[:int(limit)]
            except (ValueError, TypeError):
                pass

        return queryset


class FixtureListView(generics.ListAPIView):
    """List upcoming fixtures."""
    serializer_class = MatchListSerializer
    permission_classes = [permissions.AllowAny]

    def get_queryset(self):
        queryset = Match.objects.select_related(
            'team_a', 'team_b', 'venue', 'season'
        ).filter(status='scheduled').order_by('date')

        season = self.request.query_params.get('season')
        if season:
            queryset = queryset.filter(season__slug=season)

        limit = self.request.query_params.get('limit')
        if limit:
            try:
                queryset = queryset[:int(limit)]
            except (ValueError, TypeError):
                pass

        return queryset


class ResultListView(generics.ListAPIView):
    """List completed matches."""
    serializer_class = MatchListSerializer
    permission_classes = [permissions.AllowAny]

    def get_queryset(self):
        queryset = Match.objects.select_related(
            'team_a', 'team_b', 'venue', 'season', 'result',
            'result__winner', 'result__player_of_match'
        ).prefetch_related('innings').filter(
            status='completed'
        ).order_by('-date')

        season = self.request.query_params.get('season')
        if season:
            queryset = queryset.filter(season__slug=season)

        limit = self.request.query_params.get('limit')
        if limit:
            try:
                queryset = queryset[:int(limit)]
            except (ValueError, TypeError):
                pass

        return queryset


class MatchDetailView(generics.RetrieveAPIView):
    """Full match details with scorecards."""
    serializer_class = MatchDetailSerializer
    permission_classes = [permissions.AllowAny]
    queryset = Match.objects.select_related(
        'team_a', 'team_b', 'venue', 'season', 'result',
        'result__winner', 'result__player_of_match', 'toss_winner'
    ).prefetch_related(
        'innings__deliveries__batter',
        'innings__deliveries__bowler',
        'innings__deliveries__fielder',
        'innings__deliveries__wicket_player',
        'innings__deliveries__non_striker',
        'innings__batting_team',
        'innings__bowling_team',
    )


class RecordDeliveryView(APIView):
    """Record a ball delivery (admin only)."""
    permission_classes = [permissions.IsAdminUser]

    def post(self, request, pk):
        try:
            match = Match.objects.get(pk=pk)
        except Match.DoesNotExist:
            return Response(
                {'detail': 'Match not found.'},
                status=status.HTTP_404_NOT_FOUND
            )

        innings_number = request.data.get('innings_number', 1)
        innings = match.innings.filter(innings_number=innings_number).first()
        if not innings:
            return Response(
                {'detail': f'Innings {innings_number} not found.'},
                status=status.HTTP_404_NOT_FOUND
            )

        if innings.is_completed:
            return Response(
                {'detail': 'Innings is already completed.'},
                status=status.HTTP_400_BAD_REQUEST
            )

        delivery = ScoringService.record_delivery(innings, request.data)
        return Response(
            BallDeliverySerializer(delivery).data,
            status=status.HTTP_201_CREATED
        )


class StartInningsView(APIView):
    """Start a new innings for a match (admin only)."""
    permission_classes = [permissions.IsAdminUser]

    def post(self, request, pk):
        try:
            match = Match.objects.get(pk=pk)
        except Match.DoesNotExist:
            return Response(
                {'detail': 'Match not found.'},
                status=status.HTTP_404_NOT_FOUND
            )

        innings_number = request.data.get('innings_number', 1)
        batting_team_id = request.data.get('batting_team')
        bowling_team_id = request.data.get('bowling_team')

        if not batting_team_id or not bowling_team_id:
            return Response(
                {'detail': 'batting_team and bowling_team are required.'},
                status=status.HTTP_400_BAD_REQUEST
            )

        innings, created = Innings.objects.get_or_create(
            match=match,
            innings_number=innings_number,
            defaults={
                'batting_team_id': batting_team_id,
                'bowling_team_id': bowling_team_id,
            }
        )

        if not created:
            return Response(
                {'detail': f'Innings {innings_number} already exists.'},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Set target for second innings
        if innings_number == 2:
            first_innings = match.innings.filter(innings_number=1).first()
            if first_innings:
                innings.target = first_innings.total_runs + 1
                innings.save()

        match.status = 'live'
        match.save()

        from .serializers import InningsSerializer
        return Response(
            InningsSerializer(innings).data,
            status=status.HTTP_201_CREATED
        )


class CompleteInningsView(APIView):
    """Complete an innings (admin only)."""
    permission_classes = [permissions.IsAdminUser]

    def post(self, request, pk):
        try:
            match = Match.objects.get(pk=pk)
        except Match.DoesNotExist:
            return Response(
                {'detail': 'Match not found.'},
                status=status.HTTP_404_NOT_FOUND
            )

        innings_number = request.data.get('innings_number', 1)
        innings = match.innings.filter(innings_number=innings_number).first()
        if not innings:
            return Response(
                {'detail': f'Innings {innings_number} not found.'},
                status=status.HTTP_404_NOT_FOUND
            )

        ScoringService.complete_innings(innings)
        from .serializers import InningsSerializer
        return Response(InningsSerializer(innings).data)


class CompleteMatchView(APIView):
    """Complete a match and calculate result (admin only)."""
    permission_classes = [permissions.IsAdminUser]

    def post(self, request, pk):
        try:
            match = Match.objects.get(pk=pk)
        except Match.DoesNotExist:
            return Response(
                {'detail': 'Match not found.'},
                status=status.HTTP_404_NOT_FOUND
            )

        result = ScoringService.calculate_match_result(match)
        if not result:
            return Response(
                {'detail': 'Cannot calculate result. Ensure both innings are recorded.'},
                status=status.HTTP_400_BAD_REQUEST
            )

        from .serializers import MatchResultSerializer
        return Response(MatchResultSerializer(result).data)


class RecentDeliveriesView(generics.ListAPIView):
    """Get recent deliveries for a match."""
    serializer_class = BallDeliverySerializer
    permission_classes = [permissions.AllowAny]
    pagination_class = None

    def get_queryset(self):
        match_id = self.kwargs['pk']
        innings_number = self.request.query_params.get('innings', 1)
        limit = int(self.request.query_params.get('limit', 12))
        return BallDelivery.objects.select_related(
            'batter', 'bowler', 'non_striker', 'fielder', 'wicket_player'
        ).filter(
            innings__match_id=match_id,
            innings__innings_number=innings_number,
        ).order_by('-delivery_number')[:limit]


class MatchScorecardView(APIView):
    """Get full calculated scorecard for a match."""
    permission_classes = [permissions.AllowAny]

    def get(self, request, pk):
        try:
            match = Match.objects.prefetch_related(
                'innings__deliveries__batter',
                'innings__deliveries__bowler',
                'innings__deliveries__fielder',
                'innings__deliveries__wicket_player',
            ).get(pk=pk)
        except Match.DoesNotExist:
            return Response(
                {'detail': 'Match not found.'},
                status=status.HTTP_404_NOT_FOUND
            )

        scorecard = []
        for innings in match.innings.order_by('innings_number'):
            scorecard.append({
                'innings_number': innings.innings_number,
                'batting_team': innings.batting_team.name,
                'batting_team_short': innings.batting_team.short_name,
                'total_runs': innings.total_runs,
                'total_wickets': innings.total_wickets,
                'total_overs': str(innings.total_overs),
                'run_rate': innings.run_rate,
                'batting': ScoringService.get_batting_scorecard(innings),
                'bowling': ScoringService.get_bowling_scorecard(innings),
                'fall_of_wickets': ScoringService.get_fall_of_wickets(innings),
                'extras': ScoringService.get_extras_breakdown(innings),
            })

        return Response({
            'match_id': match.id,
            'match_number': match.match_number,
            'scorecard': scorecard,
        })
