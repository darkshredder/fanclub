from __future__ import unicode_literals

from django.shortcuts import get_object_or_404
from users.serializers import ProfileSerializer
from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.response import Response
from users.models import Profile, Hobby
from rest_framework.authtoken.models import Token
from django.contrib.auth import authenticate
from rest_framework import status
from django.contrib.auth.models import update_last_login
import requests
from django.core.exceptions import ObjectDoesNotExist
from rest_framework.permissions import IsAuthenticated
from utilities.base64conv import decode_base64_file
import base64
from django.core.files.base import ContentFile
class UserViewSet(viewsets.ViewSet):
    """
    A simple ViewSet for Register or Login, Hobby Add,Delete and Fetch Profile users.
    """ 


    @action(detail=False, methods=['post'])
    def register(self, request):
        profile = Profile.objects._create_user(
                email=request.data['email'],
                full_name=request.data['full_name'],
                password=request.data['password'],
            )
        profile.set_password(request.data['password'])
        request.data._mutable = True
        image = False
        if(request.data.get('profile_img')):
            image = request.data['profile_img']
            request.data['profile_img'] = ''
        request.data['password'] = profile.password
        request.data._mutable = False
        serializer = ProfileSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
        if (image):
            profile_main = Profile.objects.filter(email=serializer.data['email'])[0]
            profile_main.profile_img = image
            profile_main.save()
            serializer = ProfileSerializer(profile_main)
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
            return Response("Email Not Found", status=status.HTTP_404_NOT_FOUND)

        user = authenticate(email=email, password=password)
        if user is not None:
            token, created = Token.objects.get_or_create(user=user)
            update_last_login(None, user)

            return Response({"token": token.key}, status=status.HTTP_200_OK)

        return Response("Passwords does not match", status=status.HTTP_403_FORBIDDEN)
    
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
    


    @action(detail=False, methods=['get'], permission_classes=[IsAuthenticated])
    def profile(self, request):
        serializer = ProfileSerializer(request.user)
        return Response(serializer.data)



    @action(detail=False, methods=['post'], permission_classes=[IsAuthenticated])
    def addHobby(self, request):
        data = request.data
        user = request.user
        hobby = data.get("hobby", None)
        if not hobby:
            return Response("Hobby should be provided ! ", status=status.HTTP_400_BAD_REQUEST)
        hobby = hobby.lower().title()
        hobbyObject, created = Hobby.objects.get_or_create(name=hobby)
        user.hobbies.add(hobbyObject)
        user.save()
        return Response({"status": "Successfully added a new hobby"}, status=status.HTTP_200_OK)
    
    @action(detail=False, methods=['post'], permission_classes=[IsAuthenticated])
    def deleteHobby(self, request):
        data = request.data
        user = request.user
        hobbyId = data.get("hobbyId", None)
        if not hobbyId:
            return Response("Hobby should be provided ! ", status=status.HTTP_400_BAD_REQUEST)
        try:
            hobby = Hobby.objects.get(id=hobbyId)
            user.hobbies.remove(hobby)
            user.save()
            return Response({"status": "Successfully removed  hobby"}, status=status.HTTP_200_OK)

        except ObjectDoesNotExist:
            return Response("Wrong Hobby provided!!! ", status=status.HTTP_400_BAD_REQUEST)


