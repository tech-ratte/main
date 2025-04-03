from ..models import Player
from ..serializer import PlayerSerializer
from rest_framework import viewsets, filters
from rest_framework.parsers import MultiPartParser, FormParser
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
        # プレイヤー情報の更新
        if 'icon' in request.FILES:
            new_icon = request.FILES['icon']
            # 既存のアイコンがある場合は削除
            if player.icon:
                # S3のファイルパス（キー）
                delete_key = f"{player.icon}"
                if not "default" in delete_key:
                    self.s3_client.delete_object(Bucket=settings.AWS_STORAGE_BUCKET_NAME, Key=delete_key)
            # 新しいアイコンを設定
            player.icon = new_icon
        # プレイヤー情報の他のフィールドを更新
        serializer = self.get_serializer(player, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)
        return Response(serializer.data, status=200)
