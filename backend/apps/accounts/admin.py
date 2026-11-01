from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from .models import User, PlayerProfile


class PlayerProfileInline(admin.StackedInline):
    model = PlayerProfile
    can_delete = False
    verbose_name_plural = 'Player Profile'
    extra = 0


@admin.register(User)
class UserAdmin(BaseUserAdmin):
    inlines = [PlayerProfileInline]
    list_display = ('username', 'email', 'first_name', 'last_name', 'is_staff', 'date_joined')
    list_filter = ('is_staff', 'is_superuser', 'is_active')
    search_fields = ('username', 'email', 'first_name', 'last_name')


@admin.register(PlayerProfile)
class PlayerProfileAdmin(admin.ModelAdmin):
    list_display = ('full_name', 'user', 'phone_number', 'payment_status', 'playing_role', 'batting_style', 'bowling_style', 'jersey_number')
    list_filter = ('playing_role', 'batting_style', 'bowling_style', 'payment_status')
    search_fields = ('full_name', 'phone_number', 'user__username', 'user__email')
    raw_id_fields = ('user',)
