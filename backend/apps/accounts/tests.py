from django.test import TestCase
from django.urls import reverse
from rest_framework.test import APIClient
from rest_framework import status
from apps.accounts.models import User, PlayerProfile


class AuthTestCase(TestCase):
    def setUp(self):
        self.client = APIClient()

    def test_registration_success(self):
        data = {
            'username': 'newplayer',
            'email': 'newplayer@example.com',
            'full_name': 'New Player',
            'password': 'StrongPassword123!',
            'password_confirm': 'StrongPassword123!',
        }
        response = self.client.post('/api/auth/register/', data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertTrue(User.objects.filter(username='newplayer').exists())
        self.assertTrue(PlayerProfile.objects.filter(user__username='newplayer').exists())

    def test_registration_password_mismatch(self):
        data = {
            'username': 'mismatch',
            'email': 'mismatch@example.com',
            'full_name': 'Mismatch Player',
            'password': 'Password123!',
            'password_confirm': 'DifferentPassword123!',
        }
        response = self.client.post('/api/auth/register/', data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_registration_duplicate_username(self):
        User.objects.create_user(username='existing', email='orig@test.com', password='password123')
        data = {
            'username': 'existing',
            'email': 'different@test.com',
            'full_name': 'Duplicate User',
            'password': 'Password123!',
            'password_confirm': 'Password123!',
        }
        response = self.client.post('/api/auth/register/', data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_login_success(self):
        u = User.objects.create_user(username='loginuser', email='login@test.com', password='ValidPassword123')
        PlayerProfile.objects.create(user=u, full_name='Login Player')

        response = self.client.post('/api/auth/login/', {
            'username': 'loginuser',
            'password': 'ValidPassword123'
        }, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('token', response.data)
        self.assertEqual(response.data['user']['username'], 'loginuser')

    def test_login_invalid_password(self):
        User.objects.create_user(username='loginuser2', email='login2@test.com', password='ValidPassword123')
        response = self.client.post('/api/auth/login/', {
            'username': 'loginuser2',
            'password': 'WrongPassword'
        }, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
