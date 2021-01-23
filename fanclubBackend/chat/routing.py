from django.urls import path

from channels.routing import ProtocolTypeRouter, URLRouter

from .consumers import GroupChatConsumer


websockets = URLRouter([
    path(
        "ws/group-chat/<int:group_id>", GroupChatConsumer.as_asgi(),
        name="group-chat",
    ),
])