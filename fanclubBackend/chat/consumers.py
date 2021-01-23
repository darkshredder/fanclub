# Built in imports.
import json

# Third Party imports.
from channels.exceptions import DenyConnection
from channels.generic.websocket import AsyncWebsocketConsumer
from channels.db import database_sync_to_async

# Django imports.
from django.core.exceptions import ObjectDoesNotExist
from django.contrib.auth.models import AnonymousUser

# Local imports.
from chat.models import Group, Message
from users.serializers import ProfileSerializer

@database_sync_to_async
def get_group(group_id):
    return Group.objects.get(pk=group_id)

@database_sync_to_async
def save_message(message, user, group):

    return Message(text=message, profile_from=user, group_from=group).save()

@database_sync_to_async
def serialize_user(user):
    return ProfileSerializer(user).data

class GroupChatConsumer(AsyncWebsocketConsumer):

    async def connect(self):
       self.room_name = self.scope['url_route']['kwargs']['group_id']
       self.room_group_name = f'Group_{self.room_name}'

       if self.scope['user'] == AnonymousUser():
           raise DenyConnection("Invalid User")

       await self.channel_layer.group_add(self.room_group_name, self.channel_name)

        # If invalid group_name then deny the connection.
       try:
            self.group = await get_group(self.room_name)
       except:
            raise DenyConnection("Invalid Group Name")
       await self.accept()
    
    async def receive(self, text_data):

        message = json.loads(text_data).get('message')

        await save_message(message,self.scope['user'], self.group)

        await self.channel_layer.group_send(
            self.room_group_name,
            {
                'type': 'chat.message',
                'room_id': self.room_name,
                'message': message,
                'user': await serialize_user(self.scope['user'])
            }
        )

    async def chat_message(self, event):
        await self.send(text_data=json.dumps(
        {
            "room": event["room_id"],
            "username": event["user"],
            "message": event["message"],
        })
    )

    async def websocket_disconnect(self, message):
        # Leave room group
        await self.channel_layer.group_discard(
            self.room_group_name,
            self.channel_name
        )