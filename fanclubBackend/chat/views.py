# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.shortcuts import render
from rest_framework import generics
from chat.models import Group, Message
from chat.serializers import GroupDetailedSerializer, GroupSerializer, MessageSerializer
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from django.db.models import Q
from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework import status


# Create your views here.

class GroupViewSet(viewsets.ModelViewSet):
    """
    This viewset automatically provides `list`, `create`, `retrieve`,
    `update` and `destroy` actions.

    Additionally we also provide an extra `highlight` action.
    """

    queryset = Group.objects.all()
    serializer_class = GroupSerializer
    permission_classes = [IsAuthenticated]
    pagination_class = None

    def get_permissions(self):
        """Set custom permissions for each action."""
        if self.action in ['update', 'partial_update']:
            permission_classes = [IsAuthenticated]
            if (not Group.objects.filter(id=self.kwargs.get('pk'), admins=self.request.user)):
                permission_classes = [IsAdminUser]
        else:
            permission_classes = [IsAuthenticated]
        return [permission() for permission in permission_classes]

    def get_serializer_class(self):
        if self.action == 'retrieve':
            return GroupDetailedSerializer
        return GroupSerializer

    @action(detail=False, methods=['get'])
    def followed_groups(self, request):
        followed_groups = Group.objects.filter(members=request.user)
        serializer = self.get_serializer(followed_groups, many=True)
        return Response(serializer.data)

    @action(detail=True, methods=['get'])
    def follow_group(self, request, pk=None):
        group = self.get_object()
        group.members.add(request.user)
        group.save()
        serializer = self.get_serializer(Group.objects.all(),many=True)
        return Response(serializer.data)

    @action(detail=True, methods=['get'])
    def unfollow_group(self, request, pk=None):
        group = self.get_object()
        group.members.remove(request.user)
        group.save()
        serializer = self.get_serializer(Group.objects.all(),many=True)
        return Response(serializer.data)
    
    @action(detail=False, methods=['post'])
    def add_admin(self, request):
        is_group_admin = Group.objects.filter(id=request.data['group_id'], admins=request.user.id)
        if (not is_group_admin):
            return Response("User is not a Group Admin", status=status.HTTP_400_BAD_REQUEST)
        group = Group.objects.filter(id=request.data['group_id'])
        group[0].admins.add(request.data['new_admin_id'])
        group[0].save()
        serializer = self.get_serializer(Group.objects.get(pk=request.data['group_id']))
        return Response(serializer.data)

class MessageViewSet(viewsets.ViewSet):
    """
    A simple ViewSet for messages.
    """ 

    @action(detail=False, methods=['post'], permission_classes=[IsAuthenticated])
    def group_messages(self, request):
        group_id = request.data['group_id']
        group_messages = Message.objects.filter(group_from=group_id)
        serializer = MessageSerializer(group_messages, many=True)
        return Response(serializer.data)
    
    @action(detail=False, methods=['post'], permission_classes=[IsAuthenticated])
    def unread_read_group_messages(self, request):
        group_id = request.data['group_id']
        group_messages_all = Message.objects.filter(group_from=group_id)
        group_messages_read = Message.objects.filter(group_from=group_id, read_by=request.user.id)
        group_messages_unread = group_messages_all.difference(group_messages_read)
        serializer_read = MessageSerializer(group_messages_read, many=True)
        serializer_unread = MessageSerializer(group_messages_unread, many=True)
        return Response({"read_messages":serializer_read.data,"unread_messages":serializer_unread.data})
