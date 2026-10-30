from django.db import models


MATCH_STATUSES = [
    ('scheduled', 'Scheduled'),
    ('live', 'Live'),
    ('completed', 'Completed'),
    ('abandoned', 'Abandoned'),
    ('postponed', 'Postponed'),
]

TOSS_DECISIONS = [
    ('bat', 'Bat'),
    ('bowl', 'Bowl'),
]

EXTRAS_CHOICES = [
    ('wide', 'Wide'),
    ('no_ball', 'No Ball'),
    ('bye', 'Bye'),
    ('leg_bye', 'Leg Bye'),
]

WICKET_TYPES = [
    ('bowled', 'Bowled'),
    ('caught', 'Caught'),
    ('lbw', 'LBW'),
    ('run_out', 'Run Out'),
    ('stumped', 'Stumped'),
    ('hit_wicket', 'Hit Wicket'),
    ('caught_and_bowled', 'Caught and Bowled'),
    ('retired_hurt', 'Retired Hurt'),
    ('retired_out', 'Retired Out'),
    ('obstructing', 'Obstructing the Field'),
    ('timed_out', 'Timed Out'),
    ('handled_ball', 'Handled the Ball'),
]


class Match(models.Model):
    """A cricket match between two teams in a season."""
    season = models.ForeignKey(
        'tournaments.Season', on_delete=models.CASCADE, related_name='matches'
    )
    match_number = models.PositiveIntegerField()
    team_a = models.ForeignKey(
        'teams.Team', on_delete=models.CASCADE, related_name='matches_as_team_a'
    )
    team_b = models.ForeignKey(
        'teams.Team', on_delete=models.CASCADE, related_name='matches_as_team_b'
    )
    venue = models.ForeignKey(
        'tournaments.Venue', on_delete=models.SET_NULL, null=True, blank=True,
        related_name='matches'
    )
    date = models.DateTimeField()
    status = models.CharField(max_length=20, choices=MATCH_STATUSES, default='scheduled')
    match_format = models.CharField(max_length=20, default='T20')
    toss_winner = models.ForeignKey(
        'teams.Team', null=True, blank=True, on_delete=models.SET_NULL,
        related_name='toss_wins'
    )
    toss_decision = models.CharField(max_length=5, choices=TOSS_DECISIONS, blank=True)
    is_featured = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'match'
        unique_together = ('season', 'match_number')
        ordering = ['date']
        indexes = [
            models.Index(fields=['status', 'date']),
            models.Index(fields=['season', 'status']),
        ]
        verbose_name_plural = 'matches'

    def __str__(self):
        return f"Match {self.match_number}: {self.team_a.short_name} vs {self.team_b.short_name}"


class MatchResult(models.Model):
    """Outcome of a completed match."""
    match = models.OneToOneField(Match, on_delete=models.CASCADE, related_name='result')
    winner = models.ForeignKey(
        'teams.Team', null=True, blank=True, on_delete=models.SET_NULL,
        related_name='match_wins'
    )
    result_summary = models.CharField(max_length=255)
    player_of_match = models.ForeignKey(
        'accounts.PlayerProfile', null=True, blank=True, on_delete=models.SET_NULL,
        related_name='potm_awards'
    )
    is_tie = models.BooleanField(default=False)
    is_no_result = models.BooleanField(default=False)

    class Meta:
        db_table = 'match_result'

    def __str__(self):
        return f"Result: {self.match} — {self.result_summary}"


class Innings(models.Model):
    """One innings of a match (first or second)."""
    match = models.ForeignKey(Match, on_delete=models.CASCADE, related_name='innings')
    innings_number = models.PositiveSmallIntegerField()  # 1 or 2
    batting_team = models.ForeignKey(
        'teams.Team', on_delete=models.CASCADE, related_name='batting_innings'
    )
    bowling_team = models.ForeignKey(
        'teams.Team', on_delete=models.CASCADE, related_name='bowling_innings'
    )
    total_runs = models.PositiveIntegerField(default=0)
    total_wickets = models.PositiveSmallIntegerField(default=0)
    total_overs = models.DecimalField(max_digits=4, decimal_places=1, default=0)
    total_extras = models.PositiveIntegerField(default=0)
    is_completed = models.BooleanField(default=False)
    target = models.PositiveIntegerField(null=True, blank=True)

    class Meta:
        db_table = 'innings'
        unique_together = ('match', 'innings_number')
        ordering = ['innings_number']
        verbose_name_plural = 'innings'

    def __str__(self):
        return (
            f"{self.batting_team.short_name} Innings "
            f"({self.total_runs}/{self.total_wickets}, {self.total_overs} ov)"
        )

    @property
    def run_rate(self):
        """Calculate current run rate."""
        if self.total_overs and self.total_overs > 0:
            # Convert overs notation (e.g., 5.3 means 5 overs 3 balls)
            overs_decimal = self._overs_to_decimal(float(self.total_overs))
            if overs_decimal > 0:
                return round(self.total_runs / overs_decimal, 2)
        return 0.0

    @property
    def required_run_rate(self):
        """Calculate required run rate for chasing team."""
        if self.target and self.innings_number == 2:
            overs_per_innings = self.match.season.overs_per_innings
            overs_faced = self._overs_to_decimal(float(self.total_overs))
            overs_remaining = overs_per_innings - overs_faced
            runs_needed = self.target - self.total_runs
            if overs_remaining > 0 and runs_needed > 0:
                return round(runs_needed / overs_remaining, 2)
        return 0.0

    @staticmethod
    def _overs_to_decimal(overs_notation):
        """Convert overs notation (e.g., 5.3) to decimal (5.5)."""
        whole_overs = int(overs_notation)
        balls = round((overs_notation - whole_overs) * 10)
        return whole_overs + balls / 6


class BallDelivery(models.Model):
    """Individual delivery (ball) in an innings."""
    innings = models.ForeignKey(Innings, on_delete=models.CASCADE, related_name='deliveries')
    over_number = models.PositiveSmallIntegerField()       # 0-indexed over
    ball_number = models.PositiveSmallIntegerField()       # legal ball in over (1-6)
    delivery_number = models.PositiveIntegerField()        # sequential count (incl. extras)
    batter = models.ForeignKey(
        'accounts.PlayerProfile', on_delete=models.CASCADE, related_name='batting_deliveries'
    )
    non_striker = models.ForeignKey(
        'accounts.PlayerProfile', on_delete=models.CASCADE, related_name='non_striker_deliveries'
    )
    bowler = models.ForeignKey(
        'accounts.PlayerProfile', on_delete=models.CASCADE, related_name='bowling_deliveries'
    )
    runs_scored = models.PositiveSmallIntegerField(default=0)       # off the bat
    extras_type = models.CharField(max_length=10, choices=EXTRAS_CHOICES, blank=True)
    extras_runs = models.PositiveSmallIntegerField(default=0)
    is_wide = models.BooleanField(default=False)
    is_no_ball = models.BooleanField(default=False)
    is_bye = models.BooleanField(default=False)
    is_leg_bye = models.BooleanField(default=False)
    is_wicket = models.BooleanField(default=False)
    is_boundary = models.BooleanField(default=False)
    is_six = models.BooleanField(default=False)
    wicket_type = models.CharField(max_length=20, choices=WICKET_TYPES, blank=True)
    wicket_player = models.ForeignKey(
        'accounts.PlayerProfile', null=True, blank=True, on_delete=models.SET_NULL,
        related_name='wicket_dismissals'
    )
    fielder = models.ForeignKey(
        'accounts.PlayerProfile', null=True, blank=True, on_delete=models.SET_NULL,
        related_name='fielding_contributions'
    )
    total_runs_this_ball = models.PositiveSmallIntegerField(default=0)
    is_legal = models.BooleanField(default=True)
    timestamp = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'ball_delivery'
        ordering = ['delivery_number']
        indexes = [
            models.Index(fields=['innings', 'over_number', 'ball_number']),
            models.Index(fields=['batter']),
            models.Index(fields=['bowler']),
        ]
        verbose_name_plural = 'ball deliveries'

    def __str__(self):
        return (
            f"Over {self.over_number}.{self.ball_number} — "
            f"{self.bowler} to {self.batter} — {self.total_runs_this_ball} runs"
        )

    def save(self, *args, **kwargs):
        # Calculate total runs for this ball
        self.total_runs_this_ball = self.runs_scored + self.extras_runs
        # Set is_legal
        self.is_legal = not (self.is_wide or self.is_no_ball)
        # Set extras_type convenience field
        if self.is_wide:
            self.extras_type = 'wide'
        elif self.is_no_ball:
            self.extras_type = 'no_ball'
        elif self.is_bye:
            self.extras_type = 'bye'
        elif self.is_leg_bye:
            self.extras_type = 'leg_bye'
        super().save(*args, **kwargs)
