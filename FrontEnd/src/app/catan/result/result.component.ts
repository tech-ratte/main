import { Component, OnInit } from '@angular/core';
import { TimeFormatService } from '../../../core/time-format/time-format.service';
import { coreImports } from '../../../core/core.imports';
import { PersonalResultService } from '../game/personal-result.service';

@Component({
  selector: 'app-result',
  imports: [...coreImports],
  templateUrl: './result.component.html',
  styleUrl: './result.component.scss',
})
export class ResultComponent implements OnInit {
  aggregate: any[] = [];
  play_count_ranking: any[][] = [];
  win_count_ranking: any[][] = [];
  win_rate_ranking: any[][] = [];
  point_ranking: any[][] = [];
  road_count_ranking: any[][] = [];
  road_rate_ranking: any[][] = [];
  army_count_ranking: any[][] = [];
  army_rate_ranking: any[][] = [];

  // 同点の場合に同じ順位にする
  groupRankingByScore(ranking: any[], key: string): any[][] {
    const groups: any[][] = [];
    let currentScore = ranking[0][key];
    let currentGroup: any[] = [];
    let rank = 1;
    for (const player of ranking) {
      if (player[key] !== currentScore) {
        groups.push(currentGroup);
        currentGroup = [];
        currentScore = player[key];
        rank++;
      }
      currentGroup.push(player);
    }
    if (currentGroup.length) groups.push(currentGroup);
    return groups;
  }

  // ランキング設定
  setRanking() {
    // プレイ回数
    const play_count_sort = this.aggregate
      .map((result) => ({
        icon: result.player.icon,
        name: result.player.name,
        play_count: result.play_count,
      }))
      .sort((a, b) => b.play_count - a.play_count);
    this.play_count_ranking = this.groupRankingByScore(play_count_sort, 'play_count');    

    // 勝利回数
    const win_count_sort = this.aggregate
      .map((result) => ({
        icon: result.player.icon,
        name: result.player.name,
        win_count: result.win,
      }))
      .sort((a, b) => b.win_count - a.win_count);
    this.win_count_ranking = this.groupRankingByScore(win_count_sort, 'win_count');

    // 勝率
    const win_rate_sort = this.aggregate
      .map((result) => ({
        icon: result.player.icon,
        name: result.player.name,
        win_rate: result.play_count > 0 ? (result.win / result.play_count) * 100 : 0,
      }))
      .sort((a, b) => b.win_rate - a.win_rate);
    this.win_rate_ranking = this.groupRankingByScore(win_rate_sort, 'win_rate');

    // 獲得ポイント
    const point_sort = this.aggregate
      .map((result) => ({
        icon: result.player.icon,
        name: result.player.name,
        point: result.point,
      }))
      .sort((a, b) => b.point - a.point);
    this.point_ranking = this.groupRankingByScore(point_sort, 'point');
    
    // 最長道路獲得回数
    const road_count_sort = this.aggregate
      .map((result) => ({
        icon: result.player.icon,
        name: result.player.name,
        road_count: result.longestRoad,
      }))
      .sort((a, b) => b.road_count - a.road_count);
    this.road_count_ranking = this.groupRankingByScore(road_count_sort, 'road_count');

    // 最長道路獲得率
    const road_rate_sort = this.aggregate
      .map((result) => ({
        icon: result.player.icon,
        name: result.player.name,
        road_rate: result.longestRoad > 0 ? (result.longestRoad / result.play_count) * 100 : 0,
      }))
      .sort((a, b) => b.road_rate - a.road_rate);
    this.road_rate_ranking = this.groupRankingByScore(road_rate_sort, 'road_rate');

    // 最大騎士力獲得回数
    const army_count_sort = this.aggregate
      .map((result) => ({
        icon: result.player.icon,
        name: result.player.name,
        army_count: result.largestArmy,
      }))
      .sort((a, b) => b.army_count - a.army_count);
    this.army_count_ranking = this.groupRankingByScore(army_count_sort, 'army_count');

    // 最大騎士力獲得率
    const army_rate_sort = this.aggregate
      .map((result) => ({
        icon: result.player.icon,
        name: result.player.name,
        army_rate: result.largestArmy > 0 ? (result.largestArmy / result.play_count) * 100 : 0,
      }))
      .sort((a, b) => b.army_rate - a.army_rate);
    this.army_rate_ranking = this.groupRankingByScore(army_rate_sort, 'army_rate');
  }

  constructor(
    private personalResultService: PersonalResultService,
    public timeFormatService: TimeFormatService,
  ) {}

  ngOnInit(): void {
    this.personalResultService.getAggregate().subscribe(
      (response) => {
        this.aggregate = response;
        this.setRanking();
      },
      (error) => {
        console.error('Error getting aggregate:', error);
      },
    );
  }
}
