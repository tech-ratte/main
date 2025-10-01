import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { GenericApiService } from '../../../core/generic-api.service';
import { catchError, Observable, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class PersonalResultService extends GenericApiService {
  // urlセット
  protected override setUrl(url: string): void {
    super.setUrl(url);
  }

  // タイトルごとの集計取得（クエリ対応）
  public getAggregate(game_title?: string): Observable<any> {
    let params = new HttpParams();
    if (game_title)
      params = params.set('game_title', game_title);
    return this.http.get(super._url + 'aggregate/', { params }).pipe(
      catchError((error) => {
        console.error('GetApiError', error);
        return throwError(() => new Error('データの取得に失敗しました'));
      }),
    );
  }

  constructor(http: HttpClient) {
    super(http);
    this.setUrl(super.getApiUrl() + 'personalResult/');
  }
}
