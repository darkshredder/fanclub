from django.db import models
from django.utils import timezone


class TimestampModel(models.Model):

    created = models.DateTimeField(auto_now_add=True)
    modified = models.DateTimeField(auto_now=True)
    class Meta:
        abstract = True
        ordering = ['-created_at', '-updated_at']