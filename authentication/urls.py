from .views import RegisterView, LoginView, UsernameValidationView, EmailValidationView
from django.urls import path
from django.views.decorators.csrf import csrf_exempt

urlpatterns = [
    path('register/', RegisterView.as_view(), name='register'),
    path('login/', LoginView.as_view(), name='login'),
    path('validate_username/', csrf_exempt(UsernameValidationView.as_view()),
         name='validate_username'),
    path('validate_email/', csrf_exempt(EmailValidationView.as_view()),
         name='validate_email'),

]
