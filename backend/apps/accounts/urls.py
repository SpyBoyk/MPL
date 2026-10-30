from django.urls import path
from .views import (
    RegisterView, LoginView,
    PlayerDashboardView, PlayerProfileView,
    PlayerListView, PlayerDetailView,
)

urlpatterns = [
    path('register/', RegisterView.as_view(), name='register'),
    path('login/', LoginView.as_view(), name='login'),
    path('player/dashboard/', PlayerDashboardView.as_view(), name='player-dashboard'),
    path('player/profile/', PlayerProfileView.as_view(), name='player-profile'),
    path('players/', PlayerListView.as_view(), name='player-list'),
    path('players/<int:pk>/', PlayerDetailView.as_view(), name='player-detail'),
]
