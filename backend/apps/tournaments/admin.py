from django.contrib import admin
from .models import Season, Venue, Award


@admin.register(Venue)
class VenueAdmin(admin.ModelAdmin):
    list_display = ('name', 'city', 'capacity')
    search_fields = ('name', 'city')


@admin.register(Season)
class SeasonAdmin(admin.ModelAdmin):
    list_display = (
        'name', 'slug', 'status', 'is_current', 'start_date', 'end_date',
        'overs_per_innings', 'points_per_win', 'points_per_tie'
    )
    list_filter = ('status', 'is_current')
    search_fields = ('name',)
    prepopulated_fields = {'slug': ('name',)}
    date_hierarchy = 'start_date'
    list_editable = ('status', 'is_current')


@admin.register(Award)
class AwardAdmin(admin.ModelAdmin):
    list_display = ('title', 'category', 'award_type', 'amount', 'sponsor', 'recipient')
    list_filter = ('category', 'award_type', 'season')
    search_fields = ('title', 'sponsor', 'dedication', 'recipient')
    ordering = ('-amount',)
