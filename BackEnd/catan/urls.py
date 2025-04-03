from django.urls import path, include
from rest_framework import routers
from .views.player_views import  PlayerViewSet
from .views.game_result_views import GameResultViewSet
from .views.personal_result_views import PersonalResultViewSet

router = routers.DefaultRouter()
router.register(r'player', PlayerViewSet)
router.register(r'gameResult', GameResultViewSet)
router.register(r'personalResult', PersonalResultViewSet)

urlpatterns = [
    path('api/', include(router.urls)),
]