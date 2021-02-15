from chat.views import GroupViewSet, MessageViewSet
from rest_framework.routers import DefaultRouter

router = DefaultRouter()
router.register(r'groups', GroupViewSet, basename='group')
router.register(r'messages', MessageViewSet, basename='message')
urlpatterns = router.urls
