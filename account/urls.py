from django.contrib import admin
from django.urls import path, include
from django.contrib.auth import views
from .views import RegisterView

urlpatterns = [
    path('register/', RegisterView.as_view(), name="register"),
    path('', include('django.contrib.auth.urls')),
    
]