from django.db import models


class Team(models.Model):
    """Cricket team participating in MPL."""
    name = models.CharField(max_length=100)
    short_name = models.CharField(max_length=10)
    slug = models.SlugField(unique=True)
    logo = models.ImageField(upload_to='teams/', blank=True, null=True)
    primary_color = models.CharField(max_length=7, default='#0a1628')
    secondary_color = models.CharField(max_length=7, default='#d4a843')
    description = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'team'
        ordering = ['name']

    def __str__(self):
        return self.name


class SquadMembership(models.Model):
    """Links a player to a team for a specific season."""
    team = models.ForeignKey(Team, on_delete=models.CASCADE, related_name='squad')
    player = models.ForeignKey(
        'accounts.PlayerProfile', on_delete=models.CASCADE, related_name='memberships'
    )
    season = models.ForeignKey(
        'tournaments.Season', on_delete=models.CASCADE, related_name='squad_memberships'
    )
    is_captain = models.BooleanField(default=False)
    joined_date = models.DateField(auto_now_add=True)

    class Meta:
        db_table = 'squad_membership'
        unique_together = ('player', 'season')
        ordering = ['-is_captain', 'player__full_name']

    def __str__(self):
        role = " (C)" if self.is_captain else ""
        return f"{self.player.full_name} → {self.team.short_name} ({self.season.name}){role}"

    def save(self, *args, **kwargs):
        # Ensure only one captain per team per season
        if self.is_captain:
            SquadMembership.objects.filter(
                team=self.team, season=self.season, is_captain=True
            ).exclude(pk=self.pk).update(is_captain=False)
        super().save(*args, **kwargs)
