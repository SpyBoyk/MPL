from rest_framework import serializers
from .models import Season, Venue, Award


class VenueSerializer(serializers.ModelSerializer):
    class Meta:
        model = Venue
        fields = ('id', 'name', 'city', 'capacity')


class SeasonSerializer(serializers.ModelSerializer):
    class Meta:
        model = Season
        fields = (
            'id', 'name', 'slug', 'start_date', 'end_date',
            'status', 'is_current', 'overs_per_innings',
            'points_per_win', 'points_per_tie', 'points_per_no_result',
            'description'
        )


class SeasonListSerializer(serializers.ModelSerializer):
    class Meta:
        model = Season
        fields = ('id', 'name', 'slug', 'status', 'is_current', 'start_date', 'end_date')


class AwardSerializer(serializers.ModelSerializer):
    class Meta:
        model = Award
        fields = (
            'id', 'title', 'category', 'award_type', 'amount',
            'sponsor', 'dedication', 'recipient', 'season',
            'created_at', 'updated_at'
        )
