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


class MessageViewSet(viewsets.ViewSet):
    """
    A simple ViewSet for messages.
    """ 

    @action(detail=False, methods=['post'], permission_classes=[IsAuthenticated])
    def group_messages(self, request):
        group_id = request.data['group_id']
        group_messages = Message.objects.filter(group_from=group_id)
        print(group_messages)
        serializer = MessageSerializer(group_messages, many=True)
        return Response(serializer.data)
