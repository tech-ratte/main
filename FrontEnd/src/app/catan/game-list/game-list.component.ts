import { AfterViewInit, Component, inject, OnInit, ViewChild } from '@angular/core';
import { coreImports } from '../../../core/core.imports';
import { GameResultService } from '../game/game-result.service';
import { LiveAnnouncer } from '@angular/cdk/a11y';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort, Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { GameResult, GameTitles } from '../game/game.model';
import { TimeFormatService } from '../../../core/time-format/time-format.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-game-list',
  imports: [...coreImports],
  templateUrl: './game-list.component.html',
  styleUrl: './game-list.component.scss',
})
export class GameListComponent implements OnInit, AfterViewInit {
  // プレイヤー情報
  gameResults: GameResult[] = [];
  // クエリ
  // notGraduated: string = 'isGraduated=false';
  // テーブルカラム
  displayedColumns: string[] = ['date', 'title', 'startTime', 'endTime', 'info'];
  // 表示データ
  dataSource: MatTableDataSource<GameResult> = new MatTableDataSource();
  // テーブルソート用
  private _liveAnnouncer = inject(LiveAnnouncer);
  @ViewChild(MatSort) sort: MatSort | undefined;
  // ページネーション用
  @ViewChild(MatPaginator) paginator: MatPaginator | undefined;

  // 卒業生の表示可否
  // private _isViewGraduated: boolean = false;
  // get isViewGraduated(): boolean {
  //   return this._isViewGraduated;
  // }
  // set isViewGraduated(value: boolean) {
  //   this._isViewGraduated = value;
  //   if (this._isViewGraduated) {
  //     this.playerService.deleteQuery(this.notGraduated);
  //     this.displayedColumns.splice(4, 0, 'isGraduated');
  //   } else {
  //     this.playerService.addQuery(this.notGraduated);
  //     this.displayedColumns.splice(4, 1);
  //   }
  // }

  // Delete(id: string): void {
  //   this.playerService.delete(id).subscribe(
  //     (response) => {
  //       console.log('Player deleted successfully:', response);
  //     }
  //   );
  //   location.reload();
  // }
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

  openDetails(id?: string): void {
    // すべての登録が完了した後にナビゲート
    this.router.navigate(['../game/playing-game'], {
      relativeTo: this.activatedRoute,
      queryParams: { id: id },
    });
  }

  // テーブルソート
  announceSortChange(sortState: Sort) {
    if (sortState.direction) {
      this._liveAnnouncer.announce(`Sorted ${sortState.direction}ending`);
    } else {
      this._liveAnnouncer.announce('Sorting cleared');
    }
  }

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private gameResultService: GameResultService,
    public timeFormatService: TimeFormatService,
  ) {}

  ngOnInit(): void {
    // this.playerService.addQuery(this.notGraduated);

    this.gameResultService.getGameWithPlayer().subscribe(
      (response) => {
        this.gameResults = response;
        this.dataSource.data = this.gameResults;
      },
      (error) => {
        console.error('Error getting player:', error);
      },
    );
  }

  ngAfterViewInit(): void {
    if (this.paginator) {
      this.dataSource.paginator = this.paginator;
    }
    if (this.sort) {
      this.dataSource.sort = this.sort;
    }
  }
}
