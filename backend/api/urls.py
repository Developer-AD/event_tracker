"""Django URL Configuration"""
from api import views
from django.urls import path, include
from .views import EventSearchAPIView

urlpatterns = [
    path('', views.home_view, name='home'),
    path('search/', EventSearchAPIView.as_view(), name='event-search'),
]