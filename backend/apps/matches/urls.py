from django.urls import path
from .views import (
    MatchListView, MatchDetailView,
    FixtureListView, ResultListView,
    RecordDeliveryView, StartInningsView,
    CompleteInningsView, CompleteMatchView,
    RecentDeliveriesView, MatchScorecardView,
)

urlpatterns = [
    path('matches/', MatchListView.as_view(), name='match-list'),
    path('matches/<int:pk>/', MatchDetailView.as_view(), name='match-detail'),
    path('fixtures/', FixtureListView.as_view(), name='fixture-list'),
    path('results/', ResultListView.as_view(), name='result-list'),
    # Scoring endpoints (admin)
    path('matches/<int:pk>/start-innings/', StartInningsView.as_view(), name='start-innings'),
    path('matches/<int:pk>/record-delivery/', RecordDeliveryView.as_view(), name='record-delivery'),
    path('matches/<int:pk>/complete-innings/', CompleteInningsView.as_view(), name='complete-innings'),
    path('matches/<int:pk>/complete-match/', CompleteMatchView.as_view(), name='complete-match'),
    path('matches/<int:pk>/recent-deliveries/', RecentDeliveriesView.as_view(), name='recent-deliveries'),
    path('matches/<int:pk>/scorecard/', MatchScorecardView.as_view(), name='match-scorecard'),
]
