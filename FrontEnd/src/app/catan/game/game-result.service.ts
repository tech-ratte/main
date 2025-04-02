import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { GenericApiService } from '../../../core/generic-api.service';
import { catchError, Observable, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class GameResultService extends GenericApiService {
  // urlセット
  protected override setUrl(url: string): void {
    super.setUrl(url);
  }

  // 最新の1件だけ取得
  public getLatestGame(): Observable<any> {
    return this.http.get(super._url + 'latest/').pipe(
      catchError((error) => {
        console.error('GetApiError', error);
        return throwError(() => new Error('データの取得に失敗しました'));
      }),
    );
  }

  // Player情報を追加
  public getGameWithPlayer(): Observable<any> {
    return this.http.get(super._url + 'with-player/').pipe(
      catchError((error) => {
        console.error('GetApiError', error);
        return throwError(() => new Error('データの取得に失敗しました'));
      }),
    );
  }

  constructor(http: HttpClient) {
    super(http);
    this.setUrl(super.getBaseUrl() + 'gameResult/');
  }
}
