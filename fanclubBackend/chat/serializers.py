from rest_framework import serializers
from chat.models import Group, Message
from users.serializers import ProfileSerializer

class GroupSerializer(serializers.ModelSerializer):

    class Meta:
        model = Group
        fields = "__all__"

class GroupDetailedSerializer(serializers.ModelSerializer):
    members = ProfileSerializer(many=True, read_only=True)
    admins = ProfileSerializer(many=True, read_only=True)

    class Meta:
        model = Group
        fields = "__all__"

class MessageSerializer(serializers.ModelSerializer):
    profile_from = ProfileSerializer(read_only=True)
    group_from = GroupSerializer(read_only=True)
    read_by = ProfileSerializer(many=True, read_only=True)

    class Meta:
        model = Message
        fields = "__all__"
