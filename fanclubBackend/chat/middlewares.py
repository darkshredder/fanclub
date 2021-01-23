# Third party imports
from urllib.parse import urlparse, parse_qs
from channels.auth import AuthMiddlewareStack
from channels.db import database_sync_to_async

# DRF imports.
from rest_framework.authtoken.models import Token
from rest_framework.exceptions import AuthenticationFailed
# Django imports.
from django.contrib.auth.models import AnonymousUser
from django.db import close_old_connections


@database_sync_to_async
def get_user(token_key):
    
    return Token.objects.get(key=token_key).user
    
class TokenAuthMiddleware:
    """
    Token authorization middleware for channels
    """    
    def __init__(self, app):
        self.app = app

    async def __call__(self, scope, receive, send):
        query_string = scope['query_string']
        if query_string:
            try:
                parsed_query = parse_qs(query_string)
                token_key = parsed_query[b'token'][0].decode()
                token_name = 'token'
                if token_name == 'token':
                    user = await get_user(token_key)
                    scope['user'] = user
                    close_old_connections()
            except AuthenticationFailed:
                scope['user'] = AnonymousUser()
        else:
            scope['user'] = AnonymousUser()
        return await self.app(scope, receive, send)

def TokenAuthMiddlewareStack(app):

    return TokenAuthMiddleware(AuthMiddlewareStack(app))