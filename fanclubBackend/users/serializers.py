from __future__ import unicode_literals
from rest_framework import serializers
from users.models import Profile, Hobby

class Hobbyserializer(serializers.ModelSerializer):

    class Meta:
        model = Hobby
        fields = "__all__"

class ProfileSerializer(serializers.ModelSerializer):
    hobbies = Hobbyserializer(many=True, read_only=True)
    class Meta:
        model = Profile
        exclude = ('password', 'is_superuser', 'is_staff', 'is_active', 'user_permissions', 'groups')
