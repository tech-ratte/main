import { Component, inject } from '@angular/core';
import { coreImports } from '../../../../core/core.imports';
import { GameResultService } from '../game-result.service';
import { CatanColors, GameResult, GameTitles, PersonalResult } from '../game.model';
import { PersonalResultService } from '../personal-result.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ChartData, ChartOptions, ChartType } from 'chart.js';
import { MatDialog } from '@angular/material/dialog';
import { RegisterGameDialogComponent } from '../register-game-dialog/register-game-dialog.component';
import { TimeFormatService } from '../../../../core/time-format/time-format.service';

@Component({
  selector: 'app-playing-game',
  imports: [...coreImports],
  templateUrl: './playing-game.component.html',
  styleUrl: './playing-game.component.scss',
})
export class PlayingGameComponent {
  // ゲーム情報
  gameResult!: GameResult;
  // プレイヤー情報
  personalResults: PersonalResult[] = [];
  myTurnResult!: PersonalResult;
  winnerResult!: PersonalResult;
  // 時間情報(表示用)
  startTime: string = '';
  endTime: string = '';
  // ゲーム終了判定
  gameEnded: boolean = false;
  // クエリ
  gameId: string = '';
  // リンククエリ
  id: string = '';
  order: number = 0;
  // グラフ種類
  public ChartType: ChartType = 'bar';
  // 合計グラフ描画設定
  public sumChartOptions: ChartOptions = {
    responsive: false,
    scales: {
      y: {
        ticks: {
          stepSize: 2,
        },
        beginAtZero: true,
      },
    },
  };
  // 合計グラフ描画設定
  public personalChartOptions: ChartOptions = {
    responsive: false,
    scales: {
      y: {
        ticks: {
          stepSize: 2,
        },
        beginAtZero: true,
        max: 0,
      },
    },
  };
  // 合計グラフデータ設定
  public gameChartData?: ChartData<'bar'>;
  // 該当プレイヤーのグラフデータ設定
  public personalChartData?: ChartData<'bar'>;
  // 全プレイヤーのグラフデータ設定
  public allPersonalChartData: ChartData<'bar'>[] = [];
  // 現在選択中の出目
  nowDice: number = 0;
  // ローディング状態
  loading: boolean = false;
  // 直近の出目カラー
  recentDiceColor: string[] = [];

  // タイトル設定
  setGameTitle(title: string): string {
    switch (title) {
      case 'catan':
        return GameTitles.CATAN;
      case 'space':
        return GameTitles.SPACE;
      case 'sea':
        return GameTitles.SEA;
      default:
        return '';
    }
  }

  // カタンカラー設定
  setCatanColor(color: string): string {
    switch (color) {
      case 'red':
        return CatanColors.RED;
      case 'white':
        return CatanColors.WHITE;
      case 'blue':
        return CatanColors.BLUE;
      case 'yellow':
        return CatanColors.YELLOW;
      case 'green':
        return CatanColors.GREEN;
      case 'brown':
        return CatanColors.BROWN;
      default:
        return '';
    }
  }

  // 開拓地建設
  BuildingLand(index: number): void {
    if (this.personalResults[index].land! < 5) {
      this.personalResults[index].land!++;
    }
  }
  // 都市化
  BuildingCity(index: number): void {
    if (0 < this.personalResults[index].land! && this.personalResults[index].city! < 4) {
      this.personalResults[index].land!--;
      this.personalResults[index].city!++;
    }
  }
  // 発展
  Developments(index: number): void {
    this.personalResults[index].card!++;
  }

  // 今回の出目
  dice(dice: number): void {
    if (dice != this.nowDice) {
      const deleteGameKey = `dice${this.nowDice}` as keyof GameResult;
      const deletePersonalKey = `dice${this.nowDice}` as keyof PersonalResult;
      this.gameResult[deleteGameKey]!--;
      this.myTurnResult[deletePersonalKey]!--;
      const addGameKey = `dice${dice}` as keyof GameResult;
      const addPersonalKey = `dice${dice}` as keyof PersonalResult;
      this.gameResult[addGameKey]!++;
      this.myTurnResult[addPersonalKey]!++;
      this.nowDice = dice;
    }
  }

  // Redo(): void {
  //   // ターンを更新
  //   this.gameResult.turn!--;
  //   // 順番
  //   this.order = ((this.gameResult.turn! - 1) % this.personalResults.length) + 1;
  //   // 手番プレイヤーを前のプレイヤーに変更
  //   this.myTurnResult = this.personalResults[this.order - 1];

  //   // 出目を修正
  //   const deleteGameKey = `dice${this.gameResult['recentDice1']}` as keyof GameResult;
  //   const deletePersonalKey = `dice${this.gameResult['recentDice1']}` as keyof PersonalResult;
  //   this.gameResult[deleteGameKey]!--;
  //   this.myTurnResult[deletePersonalKey]!--;
  //   console.log(this.myTurnResult[deletePersonalKey]);
  //   // 直近の出目を更新
  //   this.gameResult['recentDice1'] = this.gameResult['recentDice2'];
  //   this.gameResult['recentDice2'] = this.gameResult['recentDice3'];
  //   this.gameResult['recentDice3'] = this.gameResult['recentDice4'];
  //   this.gameResult['recentDice4'] = this.gameResult['recentDice5'];
  //   this.gameResult['recentDice5'] = this.gameResult['recentDice6'];
  //   this.recentDice1Color = this.recentDice2Color;
  //   this.recentDice2Color = this.recentDice3Color;
  //   this.recentDice3Color = this.recentDice4Color;
  //   this.recentDice4Color = this.recentDice5Color;
  //   this.recentDice5Color = this.recentDice6Color;
  //   this.recentDice6Color = '';

  //   // formData成形
  //   const formGameData = new FormData();
  //   Object.entries(this.gameResult).forEach(([key, value]) => {
  //     if (value) {
  //       formGameData.append(key, value);
  //     }
  //   });
  //   const formPersonalData = new FormData();
  //   Object.entries(this.myTurnResult).forEach(([key, value]) => {
  //     if (value) {
  //       formPersonalData.append(key, key != 'player' ? value : value.id);
  //     }
  //   });

  //   // GameResultを更新
  //   this.gameResultService.update(formGameData).subscribe(() => {
  //     // PersonalResultを更新
  //     this.personalResultService.update(formPersonalData).subscribe(() => {
  //       this.nowDice = 0;
  //       // クエリを更新（constructor呼び出し）
  //       this.router.navigate([], {
  //         relativeTo: this.activatedRoute,
  //         queryParams: {
  //           id: this.id,
  //           order: this.order,
  //         },
  //         queryParamsHandling: 'merge', // 既存のクエリパラメータを保持
  //       });
  //     });
  //   });
  // }

  Register(): void {
    this.loading = true;

    // StartTimeを設定
    if (this.gameResult.startTime == null) {
      this.gameResult.startTime = this.timeFormatService.convertDateToDateTimeField(new Date());
    }

    if (this.gameResult.endTime == null) {
      // ターンを更新
      this.gameResult.turn!++;

      // 直近の出目を更新
      this.gameResult['recentDice6'] = this.gameResult['recentDice5'];
      this.gameResult['recentDice5'] = this.gameResult['recentDice4'];
      this.gameResult['recentDice4'] = this.gameResult['recentDice3'];
      this.gameResult['recentDice3'] = this.gameResult['recentDice2'];
      this.gameResult['recentDice2'] = this.gameResult['recentDice1'];
      this.gameResult['recentDice1'] = this.nowDice;
      this.nowDice = 0;
    }
    // formData成形
    const formGameData = new FormData();
    Object.entries(this.gameResult).forEach(([key, value]) => {
      if (value) {
        formGameData.append(key, value);
      }
    });
    // GameResultを更新
    this.gameResultService.update(formGameData).subscribe(() => {});

    // formData成形
    for (let i = 0; i < this.personalResults.length; i++) {
      const formPersonalData = new FormData();
      Object.entries(this.personalResults[i]).forEach(([key, value]) => {
        if (value) {
          formPersonalData.append(key, key != 'player' ? value : value.id);
        }
      });

      // PersonalResultを更新
      this.personalResultService.update(formPersonalData).subscribe(() => {
        // クエリを更新（constructor呼び出し）
        this.router.navigate([], {
          relativeTo: this.activatedRoute,
          queryParams: {
            id: this.id,
            order: (this.order % this.personalResults.length) + 1,
          },
          queryParamsHandling: 'merge', // 既存のクエリパラメータを保持
        });
      });
    }
  }

  // ゲーム終了時の登録
  LastRegister(): void {
    // EndTimeを設定
    this.gameResult.endTime = this.timeFormatService.convertDateToDateTimeField(new Date());

    // PlayTimeを設定
    const playTime =
      new Date(this.gameResult.endTime!).getTime() - new Date(this.gameResult.startTime!).getTime();
    this.gameResult.playTime = this.timeFormatService.convertTimeToTimeField(playTime);

    this.Register();
  }

  // 登録ダイアログ
  readonly dialog = inject(MatDialog);
  GameEnd(): void {
    const dialogRef = this.dialog.open(RegisterGameDialogComponent, {
      height: '750px',
      width: '450px',
      autoFocus: false,
      data: {
        myTurnResultData: this.myTurnResult,
        personalResultsData: this.personalResults,
      },
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result !== undefined) {
        this.LastRegister();
      }
    });
  }

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private route: ActivatedRoute,
    private timeFormatService: TimeFormatService,
    private gameResultService: GameResultService,
    private personalResultService: PersonalResultService,
  ) {
    // クエリ情報取得
    this.route.queryParams.subscribe((params) => {
      // ゲームID
      this.id = params['id'];
      // クエリセット
      if (this.gameId == '') {
        this.gameId = 'game=' + this.id;
        this.personalResultService.resetQuery();
        this.personalResultService.addQuery(this.gameId);
      }

      // gameResultの取得
      this.gameResultService.get(this.id).subscribe((response) => {
        this.gameResult = response;

        //時間情報
        if (this.gameResult.startTime != null) {
          this.startTime = this.timeFormatService.convertDateToTimeField(
            new Date(this.gameResult.startTime!),
          );
        }
        if (this.gameResult.endTime != null) {
          this.endTime = this.timeFormatService.convertDateToTimeField(
            new Date(this.gameResult.endTime!),
          );
          this.gameEnded = true;
        }

        // 合計グラフデータ設定
        this.gameChartData = {
          labels: [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
          datasets: [
            {
              data: [
                this.gameResult!.dice2!,
                this.gameResult!.dice3!,
                this.gameResult!.dice4!,
                this.gameResult!.dice5!,
                this.gameResult!.dice6!,
                this.gameResult!.dice7!,
                this.gameResult!.dice8!,
                this.gameResult!.dice9!,
                this.gameResult!.dice10!,
                this.gameResult!.dice11!,
                this.gameResult!.dice12!,
              ], // データ配列
              label: '出目の合計',
              backgroundColor: 'rgba(76, 183, 255, 0.2)', // 背景色
              borderColor: 'rgb(76, 183, 255)', // 枠線色
              borderWidth: 1,
            },
          ],
        };

        // gameResultと関連するpersonalResultの取得
        this.personalResultService.queryList$.subscribe(() => {
          this.personalResultService.getAll().subscribe((response) => {
            this.personalResults = response;
            // 順番
            this.order = ((this.gameResult.turn! - 1) % this.personalResults.length) + 1;
            // 手番プレイヤーを決定
            this.myTurnResult = this.personalResults[this.order - 1];

            // ゲーム中は該当プレイヤーのみ表示
            if (this.gameResult.endTime == null) {
              // 個人グラフデータ設定
              this.personalChartData = {
                labels: [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
                datasets: [
                  {
                    data: [
                      this.myTurnResult!.dice2!,
                      this.myTurnResult!.dice3!,
                      this.myTurnResult!.dice4!,
                      this.myTurnResult!.dice5!,
                      this.myTurnResult!.dice6!,
                      this.myTurnResult!.dice7!,
                      this.myTurnResult!.dice8!,
                      this.myTurnResult!.dice9!,
                      this.myTurnResult!.dice10!,
                      this.myTurnResult!.dice11!,
                      this.myTurnResult!.dice12!,
                    ], // データ配列
                    label: `${this.myTurnResult!.player?.name}の出目`,
                    backgroundColor: this.setCatanColor(this.myTurnResult!.color!) + '34', // 背景色(34=透明度：#??????34)
                    borderColor: this.setCatanColor(this.myTurnResult!.color!), // 枠線色
                    borderWidth: 1,
                  },
                ],
              };
            }
            // ゲーム終了後は全プレイヤー表示
            else {
              // グラフ縦軸の最大値
              let max = 0;

              for (let i = 0; i < this.personalResults.length; i++) {
                // 勝利プレイヤー
                if (this.personalResults[i]!.win == true) {
                  this.winnerResult = this.personalResults[i];
                }

                // 個人グラフデータ設定
                this.allPersonalChartData?.push({
                  labels: [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
                  datasets: [
                    {
                      data: [
                        this.personalResults[i]!.dice2!,
                        this.personalResults[i]!.dice3!,
                        this.personalResults[i]!.dice4!,
                        this.personalResults[i]!.dice5!,
                        this.personalResults[i]!.dice6!,
                        this.personalResults[i]!.dice7!,
                        this.personalResults[i]!.dice8!,
                        this.personalResults[i]!.dice9!,
                        this.personalResults[i]!.dice10!,
                        this.personalResults[i]!.dice11!,
                        this.personalResults[i]!.dice12!,
                      ], // データ配列
                      label: `${this.personalResults[i]!.player?.name}の出目`,
                      backgroundColor: this.setCatanColor(this.personalResults[i]!.color!) + '34', // 背景色(34=透明度：#??????34)
                      borderColor: this.setCatanColor(this.personalResults[i]!.color!), // 枠線色
                      borderWidth: 1,
                    },
                  ],
                });

                // グラフ縦軸の最大値を計算
                if (max < this.personalResults[i]!.dice2!) max = this.personalResults[i]!.dice2!;
                if (max < this.personalResults[i]!.dice3!) max = this.personalResults[i]!.dice3!;
                if (max < this.personalResults[i]!.dice4!) max = this.personalResults[i]!.dice4!;
                if (max < this.personalResults[i]!.dice5!) max = this.personalResults[i]!.dice5!;
                if (max < this.personalResults[i]!.dice6!) max = this.personalResults[i]!.dice6!;
                if (max < this.personalResults[i]!.dice7!) max = this.personalResults[i]!.dice7!;
                if (max < this.personalResults[i]!.dice8!) max = this.personalResults[i]!.dice8!;
                if (max < this.personalResults[i]!.dice9!) max = this.personalResults[i]!.dice9!;
                if (max < this.personalResults[i]!.dice10!) max = this.personalResults[i]!.dice10!;
                if (max < this.personalResults[i]!.dice11!) max = this.personalResults[i]!.dice11!;
                if (max < this.personalResults[i]!.dice12!) max = this.personalResults[i]!.dice12!;
              }
              // グラフ縦軸の最大値を設定
              this.personalChartOptions.scales!['y']!.max = max;
            }

            this.recentDiceColor = [];
            // 直近プレイヤーの要素番号
            var recentTurnElement = this.order - 1;
            for (let i = 0; i < 6; i++) {
              // 環再現
              if (recentTurnElement - 1 < 0) {
                recentTurnElement = this.personalResults.length;
              }
              recentTurnElement--;
              // 直近出目の色設定
              this.recentDiceColor.push(
                this.setCatanColor(this.personalResults[recentTurnElement].color!),
              );
            }
          });
        });
      });
    this.loading = false;
    });
  }
}
