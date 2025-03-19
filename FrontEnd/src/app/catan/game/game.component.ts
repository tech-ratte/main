import { Component, OnInit } from '@angular/core';
import { coreImports } from '../../../core/core.imports';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Colors, Titles } from './game.model';
import { GameResultService } from './game-result.service';
import { Option } from '../../../core/core.model';
import { SheardFieldComponent } from '../../../core/sheard-field/shared-field.component';
import { PersonalResultService } from './personal-result.service';
import { PlayerService } from '../player/player.service';
import { ActivatedRoute, Router } from '@angular/router';
import { forkJoin, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { TimeFormatService } from '../../../core/time-format/time-format.service';

@Component({
  selector: 'app-game',
  imports: [...coreImports, SheardFieldComponent],
  templateUrl: './game.component.html',
  styleUrl: './game.component.scss',
})
export class GameComponent implements OnInit {
  // クエリ
  notGraduated: string = 'isGraduated=false';
  // GameResultテーブルに対応
  gameResultForm: FormGroup;
  // 人数分のPersonalsResultテーブルに対応
  personalResultsForm: FormGroup;
  // ゲームタイトル
  titles: Option[] = Titles;
  // 色
  colors: Option[] = Colors;
  optionColors = ['#c70000', '#ddddaa', '#2307a1', '#ffad32', '#146677', '#330022'];
  // プレイヤー
  players: Option[] = [];
  // 最低人数
  minNumberOfPlayer: number = 3;
  // 最高人数
  maxNumberOfPlayer: number = 6;

  // personalResults の取得
  get personalResults(): FormArray {
    return this.personalResultsForm.get('results') as FormArray;
  }

  // personalResult の取得
  personalResult(index: number): FormGroup {
    return this.personalResults.at(index) as FormGroup;
  }

  // PersonalResultテーブルに対応
  personalResultForm(): FormGroup {
    return this.fb.group({
      player: [, [Validators.required]],
      game: [],
      order: [, [Validators.required]],
      color: [, [Validators.required]],
      // land: [2],
    });
  }

  // orderセット
  orderSet(): void {
    for (let i = 0; i < this.personalResults.length; i++) {
      this.personalResult(i).patchValue({ order: i + 1 });
    }
  }

  // 人数を追加
  addPersonalResult(): void {
    if (this.personalResults.length < this.maxNumberOfPlayer) {
      this.personalResults.push(this.personalResultForm());
      this.orderSet();
    }
  }
  // 人数を削除
  removePersonalResult(index: number): void {
    if (this.personalResults.length > this.minNumberOfPlayer) {
      this.personalResults.removeAt(index);
      this.orderSet();
    }
  }

  Register(): void {
    // GameResultを登録
    this.gameResultService.create(this.gameResultForm.value).subscribe(() => {
      this.gameResultService.getLatestGame().subscribe((response) => {
        const createRequests = this.personalResults.controls.map((control, i) => {
          // 登録したGameResultのIDを追加
          this.personalResult(i).patchValue({ game: response.id });
          // PlayerResultを登録
          return this.personalResultService.create(control.value).pipe(
            catchError(error => {
              // エラーが発生しても処理を続ける
              console.error('PlayerResult registration error', error);
              return of(null); // エラーの場合はnullを返して次に進む
            })
          );
        });
        // 全てのcreateリクエストが完了するのを待つ
        forkJoin(createRequests).subscribe(() => {
          // すべての登録が完了した後にナビゲート
          this.router.navigate(['playing-game'], {
            relativeTo: this.activatedRoute,
            queryParams: { id: response.id },
          });
        });
      });
    });
  }

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private timeFormatService: TimeFormatService,
    private playerService: PlayerService,
    private gameResultService: GameResultService,
    private personalResultService: PersonalResultService,
  ) {
    // GameResultテーブルに対応
    this.gameResultForm = this.fb.group({
      title: ['catan', [Validators.required]],
      date: [, [Validators.required]],
    });

    // 人数分のPersonalResultテーブルに対応
    this.personalResultsForm = this.fb.group({
      results: this.fb.array([]),
    });

    // yyyy-mm-dd に変換して FormControl に反映
    this.gameResultForm.get('date')?.valueChanges.subscribe((date) => {
      if (date) {
        const formattedDate = this.timeFormatService.convertDateToDateField(date);
        this.gameResultForm.get('date')?.setValue(formattedDate, { emitEvent: false }); // 変更をトリガーしない
      }
    });
  }

  ngOnInit(): void {
    // 日付をプレイ当日に指定
    this.gameResultForm.controls['date'].patchValue(new Date());

    // 最低人数を4人に指定
    for (let i = 0; i < 4; i++) {
      this.addPersonalResult();
    }

    // クエリセット
    this.playerService.addQuery(this.notGraduated);
    // プレイヤー取得
    this.playerService.queryList$.subscribe((queryList) => {
      this.playerService.getAll(queryList).subscribe((response) => {
        this.players = response.map((item: { id: any; name: string }) => ({
          key: item.id,
          viewValue: item.name,
        }));
      });
    });
  }
}
