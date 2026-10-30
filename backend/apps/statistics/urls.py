from django.urls import path
from .views import PointsTableView, StatisticsLeaderboardView, TeamStatsView

urlpatterns = [
    path('points-table/', PointsTableView.as_view(), name='points-table'),
    path('statistics/', StatisticsLeaderboardView.as_view(), name='statistics-leaderboard'),
    path('statistics/team/<slug:slug>/', TeamStatsView.as_view(), name='team-stats'),
]
