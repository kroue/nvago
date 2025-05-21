from django.urls import path
from .views import (
    RegisterView,
    OTPVerifyView,
    LoginView,
    LogoutView,
    SendResetOTPView,
    VerifyResetOTPView,
    ResetPasswordView,
)

urlpatterns = [
    path('register/', RegisterView.as_view()),
    path('verify/', OTPVerifyView.as_view()),
    path('login/', LoginView.as_view()),
    path('logout/', LogoutView.as_view()),
    path('send-reset-otp/', SendResetOTPView.as_view()),  # Endpoint to send OTP
    path('verify-reset-otp/', VerifyResetOTPView.as_view()),  # Endpoint to verify OTP
    path('reset-password/', ResetPasswordView.as_view()),  # Endpoint to reset password
]
