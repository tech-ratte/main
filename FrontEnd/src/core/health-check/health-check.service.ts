import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, map, of } from 'rxjs';
import { GenericApiService } from '../generic-api.service';

@Injectable({
  providedIn: 'root'
})
export class HealthCheckService extends GenericApiService {
  checkHealth() {
    return this.http.get(super._url).pipe(
      map(() => true),
      catchError(() => of(false))
    );
  }

  constructor(http: HttpClient) {
    super(http);
    this.setUrl(super.getBaseUrl() + 'health/');
  }
}
