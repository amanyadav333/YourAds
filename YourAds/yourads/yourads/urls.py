from django.contrib import admin
from django.urls import path,include

urlpatterns = [
    path('admin/', admin.site.urls),
    path('', include('usernewspaper.urls')),
    path('', include('vendernewspaper.urls')),
    path('', include('venderhording.urls')),
]
