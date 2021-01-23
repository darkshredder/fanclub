from utilities.models import TimestampModel
from users.models import Profile
from chat.models import Group
from django.db import models

class Message(TimestampModel):

    text = models.TextField(verbose_name="text message", default="", blank=True, null=True, max_length=1000)
    group_from = models.ForeignKey(
        Group, on_delete=models.CASCADE, related_name='group_from')
    profile_from = models.ForeignKey(
        Profile, on_delete=models.CASCADE, related_name='profile_from')
    message_img = models.ImageField(
        upload_to='chat/message/', verbose_name="Message Image", blank=True, null=True, default=None)
    read_by = models.ManyToManyField(
        Profile, related_name="read_by")

    
    def __str__(self):
        return f'{self.text} - {self.profile_from.full_name} - {self.group_from.title}'

    class Meta:
        """
        Meta class for Messages
        """
        verbose_name_plural = 'Message'