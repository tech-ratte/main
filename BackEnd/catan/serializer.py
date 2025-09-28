from rest_framework import serializers
from .models import GameResult, PersonalResult, Player
from django.conf import settings

class PlayerSerializer(serializers.ModelSerializer):
    class Meta:
        model = Player
        fields = '__all__'

class PersonalResultSerializer(serializers.ModelSerializer):
    player = serializers.PrimaryKeyRelatedField(queryset=Player.objects.all())
    game = serializers.PrimaryKeyRelatedField(queryset=GameResult.objects.all())

    class Meta:
        model = PersonalResult
        fields = '__all__'

    def to_representation(self, instance):
        """
        GET 時にplayerを展開して返す
        """
        representation = super().to_representation(instance)
        
        # プレイヤー情報を追加
        player_data = {
            "id": instance.player.id,
            "name": instance.player.name,
            "icon": f"{instance.player.icon.url}" if instance.player.icon else None,
        }
        representation['player'] = player_data
        
        return representation

class GameResultSerializer(serializers.ModelSerializer):
    players = serializers.SerializerMethodField()

    class Meta:
        model = GameResult
        fields = '__all__'
        extra_fields = ['players']

    def get_players(self, obj):
        return [
            {
                'name': pr.player.name,
                'icon': pr.player.icon.url,
                'color': pr.color
            }
            for pr in obj.personalresult_set.all()
        ]