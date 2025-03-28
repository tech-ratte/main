import os

from .models import GameResult, PersonalResult, Player
from .serializer import GameResultSerializer, PersonalResultSerializer, PlayerSerializer
from django.core.exceptions import ObjectDoesNotExist
from rest_framework import viewsets, filters
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.decorators import action
from rest_framework.response import Response

# from django.shortcuts import get_object_or_404
from django.conf import settings
from django_filters.rest_framework import DjangoFilterBackend
import boto3

class PlayerViewSet(viewsets.ModelViewSet):
    queryset = Player.objects.all()
    serializer_class = PlayerSerializer
    filter_backends = [filters.OrderingFilter, filters.SearchFilter, DjangoFilterBackend]
    # 並び替え可能なフィールド
    ordering_fields = ['birthday', 'created_at']
    ordering = ['-birthday']  # デフォルトは `birthday` の降順
    # 検索可能なフィールド（部分一致）
    search_fields = ['name']
    # フィルタ可能なフィールド
    filterset_fields = ['name', 'username', 'isGraduated']

    # ファイルアップロード対応
    parser_classes = (MultiPartParser, FormParser)

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        # boto3クライアントを初期化
        self.s3_client = boto3.client('s3', region_name=settings.AWS_S3_REGION_NAME)

    def update(self, request, *args, **kwargs):
        player = self.get_object()
        log_messages = []
        # プレイヤー情報の更新
        if 'icon' in request.FILES:
            new_icon = request.FILES['icon']
            log_messages.append(f"New icon from S3: {new_icon}")
            # 既存のアイコンがある場合は削除
            if player.icon:
                # S3のファイルパス（キー）
                icon_key = str(player.icon)
                try:
                    # アイコンをS3から削除
                    self.s3_client.delete_object(Bucket=settings.AWS_STORAGE_BUCKET_NAME, Key=icon_key)
                    log_messages.append(f"Deleted icon from S3: {icon_key}")
                except Exception as e:
                    # エラーハンドリング
                    log_messages.append(f"Error deleting icon from S3: {e}")
                    return Response({"error": "Failed to delete previous icon from S3"}, status=500)
            # 新しいアイコンを設定
            player.icon = new_icon
        # プレイヤー情報の他のフィールドを更新
        serializer = self.get_serializer(player, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)
        return Response({"data":serializer.data, "logs":log_messages})

class GameResultViewSet(viewsets.ModelViewSet):
    queryset = GameResult.objects.all()
    serializer_class = GameResultSerializer
    filter_backends = [filters.OrderingFilter, filters.SearchFilter, DjangoFilterBackend]
    # 並び替え可能なフィールド
    ordering_fields = ['date', 'playTime', 'created_at']
    ordering = ['-created_at']
    # 検索可能なフィールド（部分一致）
    search_fields = ['']
    # フィルタ可能なフィールド
    filterset_fields = ['title', 'date', 'playTime']

    # 最新の1件のみ取得（detail：False → GetAll, True → idのGet）
    @action(detail=False, methods=['get'], url_path='latest')
    def latest(self, request):
        """最新の 1 件を取得するエンドポイント"""
        latest_result = GameResult.objects.order_by('-created_at').first()
        if latest_result:
            serializer = self.get_serializer(latest_result)
            return Response(serializer.data)
        return Response({}, status=200)  # データがない場合は空のレスポンス
    
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