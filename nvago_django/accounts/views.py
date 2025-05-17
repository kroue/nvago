from django.contrib.auth.models import User
from django.contrib.auth import authenticate, login, logout
from django.core.mail import send_mail
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .serializers import RegisterSerializer, OTPVerifySerializer, LoginSerializer
from .models import Profile
import random
from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator
from rest_framework.authtoken.views import ObtainAuthToken
from rest_framework.authtoken.models import Token

class RegisterView(APIView):
    def post(self, request):
        serializer = RegisterSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            otp = str(random.randint(100000, 999999))
            user.profile.otp = otp
            user.profile.is_verified = False
            user.profile.save()
            send_mail(
                'Your OTP Code',
                f'Your OTP code is {otp}',
                'noreply@nvago.com',
                [user.email],
                fail_silently=False,
            )
            return Response({'message': 'User registered. OTP sent to email.'}, status=201)
        return Response(serializer.errors, status=400)

class OTPVerifyView(APIView):
    def post(self, request):
        serializer = OTPVerifySerializer(data=request.data)
        if serializer.is_valid():
            try:
                user = User.objects.get(email=serializer.validated_data['email'])
                profile = user.profile
                if profile.otp == serializer.validated_data['otp']:
                    profile.is_verified = True
                    profile.otp = ''
                    profile.save()
                    return Response({'message': 'Email verified.'})
                else:
                    return Response({'error': 'Invalid OTP.'}, status=400)
            except User.DoesNotExist:
                return Response({'error': 'User not found.'}, status=404)
        return Response(serializer.errors, status=400)

@method_decorator(csrf_exempt, name='dispatch')
class LoginView(APIView):
    def post(self, request):
        serializer = LoginSerializer(data=request.data)
        if serializer.is_valid():
            user = authenticate(
                username=serializer.validated_data['username'],
                password=serializer.validated_data['password']
            )
            if user and user.profile.is_verified:
                login(request, user)
                return Response({'message': 'Logged in.'})
            return Response({'error': 'Invalid credentials or email not verified.'}, status=400)
        return Response(serializer.errors, status=400)

class LogoutView(APIView):
    def post(self, request):
        logout(request)
        return Response({'message': 'Logged out.'})

@method_decorator(csrf_exempt, name='dispatch')
class CustomObtainAuthToken(ObtainAuthToken):
    def post(self, request, *args, **kwargs):
        response = super().post(request, *args, **kwargs)
        token = Token.objects.get(key=response.data['token'])
        user = token.user
        return Response({
            'token': token.key,
            'first_name': user.first_name,
            'last_name': user.last_name,
        })
