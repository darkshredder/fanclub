from utilities.models import TimestampModel
from users.models import Profile
from django.db import models

class Group(TimestampModel):

    title = models.CharField(max_length=50, verbose_name="Group name", unique=True)
    description = models.TextField(verbose_name="Group Description", default="", max_length=1000)
    members = models.ManyToManyField(
        Profile, related_name="group_members")
    admins = models.ManyToManyField(
        Profile, related_name="group_admins")
    group_img = models.ImageField(
        upload_to='chat/group/', verbose_name="Group Image", blank=True, null=True, default=None)

    
    def __str__(self):
        return self.title

    class Meta:
        """
        Meta class for Groups
        """
        verbose_name_plural = 'Group'