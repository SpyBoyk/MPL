"""
URL configuration for MPL project.
"""
from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from django.http import JsonResponse


def health_check(request):
    return JsonResponse({'status': 'ok', 'project': 'Malghar Premier League'})


urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/health/', health_check, name='health-check'),
    path('api/auth/', include('apps.accounts.urls')),
    path('api/', include('apps.accounts.urls')),
    path('api/', include('apps.tournaments.urls')),
    path('api/', include('apps.teams.urls')),
    path('api/', include('apps.matches.urls')),
    path('api/', include('apps.statistics.urls')),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)

# Admin site customization
admin.site.site_header = 'Malghar Premier League Admin'
admin.site.site_title = 'MPL Admin'
admin.site.index_title = 'Tournament Management'
