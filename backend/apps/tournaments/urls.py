from django.urls import path
from .views import (
    SeasonListView, SeasonDetailView, VenueListView,
    TournamentOverviewView, AwardListView, AwardDetailView,
)

urlpatterns = [
    path('seasons/', SeasonListView.as_view(), name='season-list'),
    path('seasons/<slug:slug>/', SeasonDetailView.as_view(), name='season-detail'),
    path('venues/', VenueListView.as_view(), name='venue-list'),
    path('tournament-overview/', TournamentOverviewView.as_view(), name='tournament-overview'),
    path('awards/', AwardListView.as_view(), name='award-list'),
    path('awards/<int:pk>/', AwardDetailView.as_view(), name='award-detail'),
]

