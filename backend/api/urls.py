"""Django URL Configuration"""
from api import views
from django.urls import path, include
from .views import EventSearchAPIView, TestErrorView

urlpatterns = [
    path('', views.home_view, name='home'),
    path('test/', views.TestErrorView.as_view(), name='test'),
    path('search/', EventSearchAPIView.as_view(), name='event-search'),
]