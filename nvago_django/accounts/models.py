from django.contrib.auth.models import User
from django.db import models

class Profile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    otp = models.CharField(max_length=6, blank=True)
    is_verified = models.BooleanField(default=False)

    def __str__(self):
        return self.user.username
