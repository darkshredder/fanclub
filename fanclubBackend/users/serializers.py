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
        fields = "__all__"


