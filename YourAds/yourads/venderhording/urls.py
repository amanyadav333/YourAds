from django.urls import path
from . import views
from django.conf.urls import url

urlpatterns = [
    url(r'^ajax/otherhordingtypes/', views.otherhordingtypes),
    url(r'^ajax/venderhordingsaved/', views.venderhordingsaved),
    url(r'^ajax/gethordingposition/', views.gethordingposition),
]