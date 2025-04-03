from ..views.pagination import CustomPagination
from ..models import PersonalResult
from ..serializer import PersonalResultSerializer
from rest_framework import viewsets, filters

# from django.shortcuts import get_object_or_404
from django_filters.rest_framework import DjangoFilterBackend

class PersonalResultViewSet(viewsets.ModelViewSet):
    queryset = PersonalResult.objects.all()
    serializer_class = PersonalResultSerializer
    filter_backends = [filters.OrderingFilter, filters.SearchFilter, DjangoFilterBackend]
    # 並び替え可能なフィールド
    ordering_fields = ['game__created_at','order']
    ordering = ['-game__created_at','order']
    # 検索可能なフィールド（部分一致）
    search_fields = ['']
    # フィルタ可能なフィールド
    filterset_fields = ['game', 'win', 'color', 'longestRoad', 'largestArmy', 'yellowFriend', 'greenFriend', 'readFriend', 'blueFriend']