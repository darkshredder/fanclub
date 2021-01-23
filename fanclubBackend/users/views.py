from django.shortcuts import get_object_or_404
from users.serializers import ProfileSerializer
from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.response import Response
from users.models import Profile
from rest_framework.authtoken.models import Token
from django.contrib.auth import authenticate
from rest_framework import status
from django.contrib.auth.models import update_last_login
import requests
from django.core.exceptions import ObjectDoesNotExist
class UserViewSet(viewsets.ViewSet):
    """
    A simple ViewSet for Register or Login users.
    """
    @action(detail=False, methods=['post'])
    def register(self, request):
        profile = Profile.objects._create_user(
                email=request.data['email'],
                full_name=request.data['full_name'],
                password=request.data['password']
            )
        profile.set_password(request.data['password'])
        profile.save()
        serializer = ProfileSerializer(profile)
        return Response(serializer.data)

    @action(detail=False, methods=['post'])
    def login(self, request):
        data = request.data
        email = data.get("email", None)
        password = data.get("password", None)

        if not email:
            return Response("Email should be provided ! ", status=status.HTTP_400_BAD_REQUEST)
        if not password:
            return Response("Password cannot be empty", status=status.HTTP_400_BAD_REQUEST)
        try:
            profile = Profile.objects.get(email=email)
        except ObjectDoesNotExist:
            return Response({"error_msg:Username Not Found"}, status=status.HTTP_404_NOT_FOUND)

        user = authenticate(email=email, password=password)
        if user is not None:
            token, created = Token.objects.get_or_create(user=user)
            update_last_login(None, user)

            # if user.role_type == "CA":

            return Response({"token": token.key}, status=status.HTTP_200_OK)

        return Response({"error_msg": "Passwords does not match"}, status=status.HTTP_403_FORBIDDEN)
    
    @action(detail=False, methods=['post'])
    def googleLoginSignup(self, request):
        data = request.data
        auth_code = data.get("authcode", None)
        client_id = "36916455718-7djcchmdloilsqh5s8oodnl1e5jhdgjt.apps.googleusercontent.com"
        client_secret = "xUOv9B0Se7RNf3njgagNL0nx"
        redirect_uri = "https://www.example.com/google"
        url = "https://oauth2.googleapis.com/token"
        if not auth_code:
            return Response("Authorization code should be provided ! ", status=status.HTTP_400_BAD_REQUEST)
        data = {"code": auth_code, "client_id": client_id, "client_secret": client_secret, "redirect_uri": redirect_uri, "grant_type": "authorization_code"}
        res = requests.post(url, data=data)
        res = res.json()
        url = "https://www.googleapis.com/oauth2/v1/userinfo?access_token={}".format(res['access_token'])
        res = requests.get(url)
        res = res.json()
        try:
            profile = Profile.objects.get(email=res['email'])
            token, created = Token.objects.get_or_create(user=profile)
            update_last_login(None, profile)
            return Response({"token": token.key}, status=status.HTTP_200_OK)

        except ObjectDoesNotExist:
            profile = Profile.objects._create_user(
                email=res['email'],
                full_name=res['name'],
                password=res['id']
            )
            profile.save()
            token, created = Token.objects.get_or_create(user=profile)
            update_last_login(None, profile)
            return Response({"token": token.key}, status=status.HTTP_200_OK)


