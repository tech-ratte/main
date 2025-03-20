from django.urls import path, include,re_path
from rest_framework import routers
from .views import GameResultViewSet, PersonalResultViewSet, PlayerViewSet
from django.conf import settings
from django.views.static import serve

router = routers.DefaultRouter()
router.register(r'player', PlayerViewSet)
router.register(r'gameResult', GameResultViewSet)
router.register(r'personalResult', PersonalResultViewSet)

urlpatterns = [
    path('api/', include(router.urls)),
]