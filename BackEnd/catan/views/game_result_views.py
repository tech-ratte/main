from ..views.pagination import CustomPagination
from ..models import GameResult
from ..serializer import GameResultSerializer
from rest_framework import viewsets, filters
from rest_framework.decorators import action
from rest_framework.response import Response

# from django.shortcuts import get_object_or_404
from django_filters.rest_framework import DjangoFilterBackend

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
    filterset_fields = ['title', 'date', 'startTime', 'endTime', 'playTime']

    # 最新の1件のみ取得（detail：False → GetAll, True → idのGet）
    @action(detail=False, methods=['get'], url_path='latest')
    def latest(self, request):
        latest_result = GameResult.objects.order_by('-created_at').first()
        if latest_result:
            serializer = self.get_serializer(latest_result)
            return Response(serializer.data, status=200)
        return Response({}, status=200)  # データがない場合は空のレスポンス
    
    # Player情報を追加
    @action(detail=False, methods=['get'], url_path='game-info')
    def gameInfo(self, request):
        # playerを同時に取得
        game_results = GameResult.objects.prefetch_related('personalresult_set__player').order_by('-date')
        # ページネーションの適用
        # paginator = CustomPagination()
        # result_page = paginator.paginate_queryset(game_results, request)
        # playerを追加
        game_data = []
        for game in game_results:
            player_list = [
                {"name":personal_result.player.name,
                            "icon":personal_result.player.icon.url,
                            "color":personal_result.color
                }
                for personal_result in game.personalresult_set.all()
            ]
            game_serializer = GameResultSerializer(game)
            game_dict = game_serializer.data
            game_dict["players"] = player_list            
            game_data.append(game_dict)
        return  Response(game_data, status=200)
    