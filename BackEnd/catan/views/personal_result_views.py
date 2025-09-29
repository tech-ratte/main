from ..views.pagination import CustomPagination
from ..models import PersonalResult
from ..serializer import PersonalResultSerializer
from rest_framework import viewsets, filters
from rest_framework.decorators import action
from rest_framework.response import Response
from django.db.models import Sum, Count, Case, When, IntegerField, F, Value
from collections import defaultdict

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
    filterset_fields = ['player', 'game', 'win', 'color', 'longestRoad', 'largestArmy', 'yellowFriend', 'greenFriend', 'readFriend', 'blueFriend', 'merchant', 'saviourPoint']

    # game_titleごとに集計
    @action(detail=False, methods=['get'], url_path='aggregate')
    def aggregate(self, request):
        game_title = request.query_params.get('game_title')
        # 集計対象の色・順番を事前にリスト化
        COLORS = ['red', 'white', 'blue', 'yellow', 'green', 'brown']
        ORDERS = [1, 2, 3, 4, 5, 6]

        # クエリ指定がなければ全レコード対象
        qs_base = PersonalResult.objects.all()
        if game_title:
            qs_base = qs_base.filter(game__title=game_title)

        qs = qs_base.values(
            'player__name', 'player__icon', 'player__isGraduated'
        ).annotate(
            play_count=Count('id'),
            win=Sum(Case(When(win=True, then=1), default=0, output_field=IntegerField())),
            dice2=Sum('dice2'),
            dice3=Sum('dice3'),
            dice4=Sum('dice4'),
            dice5=Sum('dice5'),
            dice6=Sum('dice6'),
            dice7=Sum('dice7'),
            dice8=Sum('dice8'),
            dice9=Sum('dice9'),
            dice10=Sum('dice10'),
            dice11=Sum('dice11'),
            dice12=Sum('dice12'),
            point=Sum('point'),
            longestRoad=Sum(Case(When(longestRoad=True, then=1), default=0, output_field=IntegerField())),
            largestArmy=Sum(Case(When(largestArmy=True, then=1), default=0, output_field=IntegerField())),
            halfPoint=Sum('halfPoint'),
            yellowFriend=Sum(Case(When(yellowFriend=True, then=1), default=0, output_field=IntegerField())),
            greenFriend=Sum(Case(When(greenFriend=True, then=1), default=0, output_field=IntegerField())),
            readFriend=Sum(Case(When(readFriend=True, then=1), default=0, output_field=IntegerField())),
            blueFriend=Sum(Case(When(blueFriend=True, then=1), default=0, output_field=IntegerField())),
            merchant=Sum(Case(When(merchant=True, then=1), default=0, output_field=IntegerField())),
            saviourPoint=Sum('saviourPoint'),
            **{
                f'color_{c}': Count(Case(When(color=c, then=1))) for c in COLORS
            },
            **{
                f'order_{o}': Count(Case(When(order=o, then=1))) for o in ORDERS
            }
        )

        # 結果を整形して辞書型にまとめる
        result = []
        for s in qs:
            color_dict = {c: s[f'color_{c}'] for c in COLORS}
            order_dict = {str(o): s[f'order_{o}'] for o in ORDERS}
            icon = s['player__icon']
            # S3のURLを返す
            if icon and not str(icon).startswith('http'):
                from django.conf import settings
                # S3のバケットURLを組み立て
                icon = f"https://{settings.AWS_STORAGE_BUCKET_NAME}.s3.amazonaws.com/{icon}"
            player_data = {
                'player': {
                    'name': s['player__name'],
                    'icon': icon,
                    'isGraduated': s['player__isGraduated'],
                },
                'play_count': s['play_count'],
                'win': s['win'],
                'color': color_dict,
                'order': order_dict,
                'dice2': s['dice2'], 'dice3': s['dice3'], 'dice4': s['dice4'], 'dice5': s['dice5'],
                'dice6': s['dice6'], 'dice7': s['dice7'], 'dice8': s['dice8'], 'dice9': s['dice9'],
                'dice10': s['dice10'], 'dice11': s['dice11'], 'dice12': s['dice12'],
                'point': s['point'],
                'longestRoad': s['longestRoad'],
                'largestArmy': s['largestArmy'],
                'halfPoint': s['halfPoint'],
                'yellowFriend': s['yellowFriend'],
                'greenFriend': s['greenFriend'],
                'readFriend': s['readFriend'],
                'blueFriend': s['blueFriend'],
                'merchant': s['merchant'],
                'saviourPoint': s['saviourPoint'],
            }
            result.append(player_data)

        return Response(result, status=200)