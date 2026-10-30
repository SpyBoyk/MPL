from django.db import models


SEASON_STATUSES = [
    ('upcoming', 'Upcoming'),
    ('ongoing', 'Ongoing'),
    ('completed', 'Completed'),
]


class Venue(models.Model):
    """Cricket ground / venue for matches."""
    name = models.CharField(max_length=200)
    city = models.CharField(max_length=100, blank=True)
    capacity = models.PositiveIntegerField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'venue'
        ordering = ['name']

    def __str__(self):
        if self.city:
            return f"{self.name}, {self.city}"
        return self.name


class Season(models.Model):
    """Tournament season (e.g., MPL 2026)."""
    name = models.CharField(max_length=100)
    slug = models.SlugField(unique=True)
    start_date = models.DateField()
    end_date = models.DateField()
    status = models.CharField(max_length=20, choices=SEASON_STATUSES, default='upcoming')
    is_current = models.BooleanField(default=False)
    points_per_win = models.PositiveSmallIntegerField(default=2)
    points_per_tie = models.PositiveSmallIntegerField(default=1)
    points_per_no_result = models.PositiveSmallIntegerField(default=1)
    overs_per_innings = models.PositiveSmallIntegerField(default=20)
    description = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'season'
        ordering = ['-start_date']

    def __str__(self):
        return self.name

    def save(self, *args, **kwargs):
        # Ensure only one season is marked as current
        if self.is_current:
            Season.objects.filter(is_current=True).exclude(pk=self.pk).update(is_current=False)
        super().save(*args, **kwargs)


class Award(models.Model):
    """Tournament Award & Sponsorship Model."""
    AWARD_TYPES = [
        ('cash', 'Cash Prize'),
        ('trophy', 'Trophy'),
        ('medal', 'Medal'),
        ('memento', 'Memento'),
    ]

    AWARD_CATEGORIES = [
        ('Championship', 'Championship Honors'),
        ('Individual', 'Individual Honors'),
        ('Special', 'Special Recognitions'),
        ('Patron', 'Patron Recognitions'),
    ]

    title = models.CharField(max_length=200)
    category = models.CharField(max_length=50, choices=AWARD_CATEGORIES, default='Individual')
    award_type = models.CharField(max_length=20, choices=AWARD_TYPES, default='cash')
    amount = models.PositiveIntegerField(default=0, help_text="Cash value or trophy valuation in INR")
    sponsor = models.CharField(max_length=200, help_text="Sponsoring dignitary or contributor")
    dedication = models.CharField(max_length=255, blank=True, help_text="In Memory Of / Dedication")
    recipient = models.CharField(max_length=200, blank=True, help_text="Intended recipient team or player")
    season = models.ForeignKey(
        'tournaments.Season', on_delete=models.SET_NULL, null=True, blank=True, related_name='awards'
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'tournament_award'
        ordering = ['-amount', 'title']

    def __str__(self):
        return f"{self.title} - ₹{self.amount} ({self.sponsor})"
