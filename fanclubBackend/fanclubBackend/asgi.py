from channels.routing import ProtocolTypeRouter, URLRouter
from chat.routing import websockets

from chat.middlewares import TokenAuthMiddlewareStack

application = ProtocolTypeRouter({
    "websocket": TokenAuthMiddlewareStack(websockets),
})