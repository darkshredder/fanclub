from django.db import models
from utilities.models import TimestampModel
from django.contrib.auth.models import (AbstractUser)
from django.core.validators import RegexValidator
from .customusermanager import CustomUserManager


class AbstractProfile(AbstractUser, TimestampModel):
    username = None
    full_name = models.CharField(max_length=50, verbose_name="Name")
    email = models.EmailField(
        db_index=True, max_length=100, verbose_name="Email Id", unique=True)
    phone_number = models.CharField(
        max_length=10,
        blank=True,
        null=True,
        validators=[
            RegexValidator(regex="^[6-9]\d{9}$",
                           message="Phone Number Not Valid",)
        ],
        verbose_name="Phone Number")

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = []
    objects = CustomUserManager()

    class Meta:
        abstract = True

    def __str__(self):
        return self.full_name


class Profile(AbstractProfile):
    class Meta:
        verbose_name_plural = "Profile"