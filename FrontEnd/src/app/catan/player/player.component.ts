import { AfterViewInit, Component, inject, OnInit, ViewChild } from '@angular/core';
import { Player } from './player.model';
import { PlayerService } from './player.service';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort, Sort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { LiveAnnouncer } from '@angular/cdk/a11y';
import { RegisterPlayerDialogComponent } from './register-player-dialog/register-player-dialog.component';
import { of } from 'rxjs';
import { coreImports } from '../../../core/core.imports';

export interface CreateDialogData {
  name: string;
  username: string;
  password: string;
  birthday: Date;
  icon: string;
}

@Component({
  selector: 'app-player',
  imports: [...coreImports],
  templateUrl: './player.component.html',
  styleUrl: './player.component.scss',
})
export class PlayerComponent implements OnInit, AfterViewInit {
  // プレイヤー情報
  players: Player[] = [];
  // クエリ
  notGraduated: string = 'isGraduated=false';
  // テーブルカラム
  displayedColumns: string[] = ['icon', 'name', 'username', 'birthday', 'edit'];
  // 表示データ
  dataSource: MatTableDataSource<Player> = new MatTableDataSource();
  // テーブルソート用
  private _liveAnnouncer = inject(LiveAnnouncer);
  @ViewChild(MatSort) sort: MatSort | undefined;
  // ページネーション用
  @ViewChild(MatPaginator) paginator: MatPaginator | undefined;

  // 卒業生の表示可否
  private _isViewGraduated: boolean = false;
  get isViewGraduated(): boolean {
    return this._isViewGraduated;
  }
  set isViewGraduated(value: boolean) {
    this._isViewGraduated = value;
    if (this._isViewGraduated) {
      this.playerService.deleteQuery(this.notGraduated);
      this.displayedColumns.splice(4, 0, 'isGraduated');
    } else {
      this.playerService.addQuery(this.notGraduated);
      this.displayedColumns.splice(4, 1);
    }
  }

  // 登録ダイアログ
  readonly dialog = inject(MatDialog);
  openRegisterDialog(id?: string): void {
    // idが渡された場合はデータを渡す
    const player$ = id ? this.playerService.get(id) : of(undefined);
    player$.subscribe((selectPlayer) => {
      const dialogRef = this.dialog.open(RegisterPlayerDialogComponent, {
        height: '750px',
        width: '450px',
        autoFocus: false,
        data: selectPlayer,
      });
      // idが渡された場合は編集、idが無い場合は新規登録
      dialogRef.afterClosed().subscribe((result) => {
        if (result !== undefined) {
          id ? this.Edit(result) : this.Register(result);
        }
      });
    });
  }

  // Playerを追加
  Register(data: any): void {
    this.playerService.create(data).subscribe((response) => {
      console.log('Player created successfully:', response);
      location.reload();
    });
  }

  // Playerを編集
  Edit(data: any): void {
    this.playerService.update(data).subscribe((response) => {
      console.log('Player updated successfully:', response);
      location.reload();
    });
  }

  // Delete(id: string): void {
  //   this.playerService.delete(id).subscribe(
  //     (response) => {
  //       console.log('Player deleted successfully:', response);
  //     }
  //   );
  //   location.reload();
  // }

  // テーブルソート
  announceSortChange(sortState: Sort) {
    if (sortState.direction) {
      this._liveAnnouncer.announce(`Sorted ${sortState.direction}ending`);
    } else {
      this._liveAnnouncer.announce('Sorting cleared');
    }
  }

  constructor(private playerService: PlayerService) {}

  ngOnInit(): void {
    this.playerService.addQuery(this.notGraduated);

    // クエリ数の変動を検知してGet呼び出し
    this.playerService.queryList$.subscribe(() => {
      this.playerService.getAll().subscribe(
        (response) => {
          this.players = response;
          this.dataSource.data = this.players;
        },
        (error) => {
          console.error('Error getting player:', error);
        },
      );
    });
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
