from django.shortcuts import render, redirect
from django.views import View
from django.http import JsonResponse
import json
from django.contrib.auth.models import User
from django.contrib.auth import authenticate, login
from validate_email import validate_email
from django.contrib import messages


class RegisterView(View):
    def get(self, request):
        return render(request, 'authentication/register.html')

    def post(self, request):
        username = request.POST.get('username', '').strip()
        email = request.POST.get('email', '').strip()
        password = request.POST.get('password', '').strip()

        context = {'username': username, 'email': email}

        # Ensure all fields are filled
        if not username or not email or not password:
            messages.error(request, 'All fields are required')
            return render(request, 'authentication/register.html', context)

        # Validate password length
        if len(password) < 6:
            messages.error(request, 'Password too short')
            return render(request, 'authentication/register.html', context)

        # Check if username already exists
        if User.objects.filter(username=username).exists():
            messages.error(request, 'Username already taken')
            return render(request, 'authentication/register.html', context)

        # Check if email is already in use
        if User.objects.filter(email=email).exists():
            messages.error(request, 'Email already in use')
            return render(request, 'authentication/register.html', context)

        # Create user
        user = User.objects.create_user(username=username, email=email)
        user.set_password(password)
        user.save()

        messages.success(
            request, 'Account created successfully. You can now log in.')
        return redirect('login')


class LoginView(View):
    def get(self, request):
        return render(request, 'authentication/login.html')

    def post(self, request):
        username = request.POST.get('username', '').strip()
        password = request.POST.get('password', '').strip()

        if not username or not password:
            messages.error(request, 'All fields are required')
            return render(request, 'authentication/login.html', {'username': username})

        user = authenticate(request, username=username, password=password)
        if user is not None:
            login(request, user)
            messages.success(request, 'Login successful')
            return redirect('dashboard')  # Change to your dashboard page
        else:
            messages.error(request, 'Invalid username or password')
            return render(request, 'authentication/login.html', {'username': username})


class UsernameValidationView(View):
    def post(self, request):
        data = json.loads(request.body)
        username = data.get('username', '')

        if not username.isalnum():
            return JsonResponse({'username_error': 'Username should contain only alphanumeric characters'}, status=400)

        if User.objects.filter(username=username).exists():
            return JsonResponse({'username_error': 'Username already taken'}, status=409)

        return JsonResponse({'username_valid': True})


class EmailValidationView(View):
    def post(self, request):
        data = json.loads(request.body)
        email = data.get('email', '')

        if not validate_email(email):
            return JsonResponse({'email_error': 'Enter a valid email'}, status=400)

        if User.objects.filter(email=email).exists():
            return JsonResponse({'email_error': 'Email already in use'}, status=409)

        return JsonResponse({'email_valid': True})
