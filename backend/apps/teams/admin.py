from django.contrib import admin
from .models import Team, SquadMembership


class SquadMembershipInline(admin.TabularInline):
    model = SquadMembership
    extra = 1
    raw_id_fields = ('player',)
    autocomplete_fields = ('season',)


@admin.register(Team)
class TeamAdmin(admin.ModelAdmin):
    list_display = ('name', 'short_name', 'slug', 'primary_color')
    search_fields = ('name', 'short_name')
    prepopulated_fields = {'slug': ('name',)}
    inlines = [SquadMembershipInline]


@admin.register(SquadMembership)
class SquadMembershipAdmin(admin.ModelAdmin):
    list_display = ('player', 'team', 'season', 'is_captain')
    list_filter = ('season', 'team', 'is_captain')
    search_fields = ('player__full_name', 'team__name')
    raw_id_fields = ('player',)
    autocomplete_fields = ('season', 'team')
