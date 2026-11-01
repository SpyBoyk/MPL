from django.urls import path
from .views import (
    RegisterView, LoginView,
    PlayerDashboardView, PlayerProfileView,
    PlayerListView, PlayerDetailView,
    ResetPlayerPasswordView,
    AdminUserListView, AdminPaymentStatusView,
)

urlpatterns = [
    path('register/', RegisterView.as_view(), name='register'),
    path('login/', LoginView.as_view(), name='login'),
    path('player/dashboard/', PlayerDashboardView.as_view(), name='player-dashboard'),
    path('player/profile/', PlayerProfileView.as_view(), name='player-profile'),
    path('players/', PlayerListView.as_view(), name='player-list'),
    path('players/<int:pk>/', PlayerDetailView.as_view(), name='player-detail'),
    path('players/<int:pk>/reset-password/', ResetPlayerPasswordView.as_view(), name='player-reset-password'),
    path('admin/users/', AdminUserListView.as_view(), name='admin-user-list'),
    path('admin/users/<int:pk>/payment-status/', AdminPaymentStatusView.as_view(), name='admin-payment-status'),
]
