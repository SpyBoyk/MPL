from rest_framework import serializers
from django.contrib.auth import authenticate
from .models import User, PlayerProfile


class RegisterSerializer(serializers.Serializer):
    full_name = serializers.CharField(max_length=150)
    username = serializers.CharField(max_length=150)
    email = serializers.EmailField()
    password = serializers.CharField(min_length=8, write_only=True)
    password_confirm = serializers.CharField(min_length=8, write_only=True)

    def validate_username(self, value):
        if User.objects.filter(username=value).exists():
            raise serializers.ValidationError('Username is already taken.')
        return value

    def validate_email(self, value):
        if User.objects.filter(email=value).exists():
            raise serializers.ValidationError('Email is already registered.')
        return value

    def validate(self, data):
        if data['password'] != data['password_confirm']:
            raise serializers.ValidationError({'password_confirm': 'Passwords do not match.'})
        return data

    def create(self, validated_data):
        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data['email'],
            password=validated_data['password'],
            first_name=validated_data['full_name'].split(' ')[0],
            last_name=' '.join(validated_data['full_name'].split(' ')[1:]),
        )
        PlayerProfile.objects.create(
            user=user,
            full_name=validated_data['full_name'],
        )
        return user


class LoginSerializer(serializers.Serializer):
    username = serializers.CharField()
    password = serializers.CharField(write_only=True)

    def validate(self, data):
        username = data.get('username')
        password = data.get('password')

        # Allow login with email as well
        if '@' in username:
            try:
                user_obj = User.objects.get(email=username)
                username = user_obj.username
            except User.DoesNotExist:
                raise serializers.ValidationError('Invalid credentials.')

        user = authenticate(username=username, password=password)
        if not user:
            raise serializers.ValidationError('Invalid credentials.')
        if not user.is_active:
            raise serializers.ValidationError('Account is disabled.')

        data['user'] = user
        return data


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'username', 'email', 'first_name', 'last_name')


class PlayerProfileSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    team = serializers.SerializerMethodField()

    class Meta:
        model = PlayerProfile
        fields = (
            'id', 'user', 'full_name', 'photo', 'date_of_birth',
            'batting_style', 'bowling_style', 'playing_role',
            'jersey_number', 'bio', 'team', 'created_at', 'updated_at'
        )

    def get_team(self, obj):
        membership = obj.memberships.select_related('team', 'season').filter(
            season__is_current=True
        ).first()
        if membership:
            return {
                'id': membership.team.id,
                'name': membership.team.name,
                'short_name': membership.team.short_name,
                'slug': membership.team.slug,
                'logo': membership.team.logo.url if membership.team.logo else None,
                'is_captain': membership.is_captain,
            }
        return None


class PlayerPhotoUpdateSerializer(serializers.Serializer):
    photo = serializers.ImageField()


class PlayerProfileListSerializer(serializers.ModelSerializer):
    """Compact serializer for player listings."""
    team = serializers.SerializerMethodField()

    class Meta:
        model = PlayerProfile
        fields = (
            'id', 'full_name', 'photo', 'playing_role',
            'batting_style', 'bowling_style', 'jersey_number', 'team'
        )

    def get_team(self, obj):
        membership = obj.memberships.select_related('team').filter(
            season__is_current=True
        ).first()
        if membership:
            return {
                'id': membership.team.id,
                'name': membership.team.name,
                'short_name': membership.team.short_name,
                'slug': membership.team.slug,
            }
        return None
