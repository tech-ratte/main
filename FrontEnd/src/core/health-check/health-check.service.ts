import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, map, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class HealthCheckService {
  private apiUrl = 'https://main-8r55.onrender.com/health';

  constructor(private http: HttpClient) {}

  checkHealth() {
    return this.http.get(this.apiUrl).pipe(
      map(() => true),
      catchError(() => of(false))
    );
  }
}
