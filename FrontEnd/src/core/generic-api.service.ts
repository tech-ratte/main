import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, catchError, Observable, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class GenericApiService {
  // 共通のApiUrl（urlを変更する場合はここ）
  private baseUrl = 'http://127.0.0.1:8000/api/';
  // private baseUrl = 'https://main-8r55.onrender.com/api/';
  private url: any;
  // 共通のApiUrlを渡すメソッド
  protected getBaseUrl(): string {
    return this.baseUrl;
  }
  // リクエスト用のUrlをセットするメソッド
  protected setUrl(url: any): void {
    this.url = url;
  }
  get _url(): any {
    return this.url;
  }

  // クエリ情報
  private queryListSubject = new BehaviorSubject<string[]>([]);
  queryList$ = this.queryListSubject.asObservable();

  // Getリクエスト（すべて）
  public getAll(): Observable<any> {
    let query = '';
    for (let [index, queryParameter] of this.queryListSubject.getValue().entries()) {
      index == 0 ? (query = queryParameter) : query + '&' + queryParameter;
    }

    return this.http.get(`${this.url}?${query}`).pipe(
      catchError((error) => {
        console.error('GetApiError', error);
        return throwError(() => new Error('データの取得に失敗しました'));
      }),
    );
  }

  // Getリクエスト
  public get(id: string): Observable<any> {
    return this.http.get(`${this.url}${id}/`).pipe(
      catchError((error) => {
        console.error('GetApiError', error);
        return throwError(() => new Error('データの取得に失敗しました'));
      }),
    );
  }

  // Postリクエスト
  public create(data: any): Observable<any> {
    return this.http.post(this.url, data).pipe(
      catchError((error) => {
        console.error('PostApiError', error);
        return throwError(() => new Error('データの送信に失敗しました'));
      }),
    );
  }

  // Putリクエスト
  public update(data: any): Observable<any> {
    return this.http.put(`${this.url}${data.get('id')}/`, data).pipe(
      catchError((error) => {
        console.error('PutApiError', error);
        return throwError(() => new Error('データの送信に失敗しました'));
      }),
    );
  }

  // Deleteリクエスト
  public delete(id: string): Observable<any> {
    return this.http.delete(`${this.url}${id}/`).pipe(
      catchError((error) => {
        console.error('DeleteApiError', error);
        return throwError(() => new Error('データの削除に失敗しました'));
      }),
    );
  }

  // クエリのリセット
  resetQuery(): void {
    this.queryListSubject.next([]); // 空の配列をセット
  }

  // クエリの追加
  addQuery(query: string): void {
    const currentList = this.queryListSubject.value;
    // list.findIndex() 「条件を満たすlistのindexを返す　全て満たさない場合-1」
    const index = currentList.findIndex((item) => item === query);
    index == -1 && currentList.push(query);
    this.queryListSubject.next(currentList);
  }

  // クエリの追加
  deleteQuery(query: string): void {
    const currentList = this.queryListSubject.value;
    // list.findIndex() 「条件を満たすlistのindexを返す　全て満たさない場合-1」
    const index = currentList.findIndex((item) => item === query);
    // splice(index, n) 「indexからn番目の要素を削除」
    index != -1 && currentList.splice(index, 1);
    this.queryListSubject.next(currentList);
  }

  constructor(protected http: HttpClient) {}
}
