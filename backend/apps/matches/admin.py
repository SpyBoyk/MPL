from django.contrib import admin
from .models import Match, MatchResult, Innings, BallDelivery


class InningsInline(admin.TabularInline):
    model = Innings
    extra = 0
    readonly_fields = ('run_rate',)
    show_change_link = True

    def run_rate(self, obj):
        return obj.run_rate if obj.pk else '-'
    run_rate.short_description = 'Run Rate'


class MatchResultInline(admin.StackedInline):
    model = MatchResult
    extra = 0
    raw_id_fields = ('player_of_match',)


@admin.register(Match)
class MatchAdmin(admin.ModelAdmin):
    list_display = (
        'match_number', 'season', 'team_a', 'team_b', 'venue',
        'date', 'status', 'is_featured'
    )
    list_filter = ('season', 'status', 'is_featured')
    search_fields = ('team_a__name', 'team_b__name', 'venue__name')
    date_hierarchy = 'date'
    list_editable = ('status', 'is_featured')
    autocomplete_fields = ('season', 'team_a', 'team_b', 'venue', 'toss_winner')
    inlines = [MatchResultInline, InningsInline]


@admin.register(MatchResult)
class MatchResultAdmin(admin.ModelAdmin):
    list_display = ('match', 'winner', 'result_summary', 'player_of_match', 'is_tie', 'is_no_result')
    list_filter = ('is_tie', 'is_no_result')
    search_fields = ('result_summary', 'match__team_a__name', 'match__team_b__name')
    raw_id_fields = ('match', 'winner', 'player_of_match')


class BallDeliveryInline(admin.TabularInline):
    model = BallDelivery
    extra = 0
    readonly_fields = ('total_runs_this_ball', 'is_legal')
    fields = (
        'over_number', 'ball_number', 'delivery_number',
        'batter', 'bowler', 'runs_scored',
        'is_wide', 'is_no_ball', 'is_bye', 'is_leg_bye',
        'extras_runs', 'is_wicket', 'wicket_type',
        'is_boundary', 'is_six', 'total_runs_this_ball', 'is_legal'
    )
    raw_id_fields = ('batter', 'non_striker', 'bowler', 'wicket_player', 'fielder')


@admin.register(Innings)
class InningsAdmin(admin.ModelAdmin):
    list_display = (
        'match', 'innings_number', 'batting_team', 'bowling_team',
        'total_runs', 'total_wickets', 'total_overs', 'run_rate', 'is_completed'
    )
    list_filter = ('is_completed', 'match__season')
    search_fields = ('match__team_a__name', 'match__team_b__name', 'batting_team__name')
    readonly_fields = ('run_rate',)
    inlines = [BallDeliveryInline]

    def run_rate(self, obj):
        return obj.run_rate
    run_rate.short_description = 'Run Rate'


@admin.register(BallDelivery)
class BallDeliveryAdmin(admin.ModelAdmin):
    list_display = (
        'innings', 'over_number', 'ball_number', 'batter', 'bowler',
        'runs_scored', 'extras_type', 'extras_runs', 'is_wicket', 'total_runs_this_ball'
    )
    list_filter = ('is_wicket', 'is_wide', 'is_no_ball', 'is_boundary', 'is_six')
    search_fields = ('batter__full_name', 'bowler__full_name')
    raw_id_fields = ('innings', 'batter', 'non_striker', 'bowler', 'wicket_player', 'fielder')
