from django.contrib.auth.models import AbstractUser
from django.db import models


BATTING_STYLES = [
    ('right_hand', 'Right-hand Bat'),
    ('left_hand', 'Left-hand Bat'),
]

BOWLING_STYLES = [
    ('right_arm_fast', 'Right-arm Fast'),
    ('left_arm_fast', 'Left-arm Fast'),
    ('right_arm_medium', 'Right-arm Medium'),
    ('left_arm_medium', 'Left-arm Medium'),
    ('right_arm_offspin', 'Right-arm Off Spin'),
    ('left_arm_orthodox', 'Left-arm Orthodox'),
    ('right_arm_legspin', 'Right-arm Leg Spin'),
    ('left_arm_chinaman', 'Left-arm Chinaman'),
]

PLAYING_ROLES = [
    ('batter', 'Batter'),
    ('bowler', 'Bowler'),
    ('all_rounder', 'All-rounder'),
    ('wicket_keeper', 'Wicket-keeper'),
    ('wk_batter', 'Wicket-keeper Batter'),
]

PAYMENT_STATUSES = [
    ('unpaid', 'Not Paid'),
    ('pending', 'Pending Verification'),
    ('verified', 'Verified'),
    ('rejected', 'Rejected'),
]


class User(AbstractUser):
    """Extended Django user with unique email."""
    email = models.EmailField(unique=True)

    class Meta:
        db_table = 'auth_user'

    def __str__(self):
        return self.username


class PlayerProfile(models.Model):
    """Player profile linked to a user account."""
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='player_profile')
    full_name = models.CharField(max_length=150)
    phone_number = models.CharField(max_length=15, blank=True)
    photo = models.ImageField(upload_to='players/', blank=True, null=True)
    date_of_birth = models.DateField(blank=True, null=True)
    batting_style = models.CharField(max_length=30, choices=BATTING_STYLES, blank=True)
    bowling_style = models.CharField(max_length=40, choices=BOWLING_STYLES, blank=True)
    playing_role = models.CharField(max_length=30, choices=PLAYING_ROLES, blank=True)
    jersey_number = models.PositiveSmallIntegerField(blank=True, null=True)
    bio = models.TextField(blank=True)
    payment_status = models.CharField(max_length=20, choices=PAYMENT_STATUSES, default='unpaid')
    payment_screenshot = models.ImageField(upload_to='payments/', blank=True, null=True)
    payment_note = models.CharField(max_length=255, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'player_profile'

    def __str__(self):
        return self.full_name or self.user.username
