from django.urls import path
from . import views

urlpatterns = [
    path('', views.home, name='expenses-home'),
    path('add_expense/', views.add_expense, name='add_expense'),
]