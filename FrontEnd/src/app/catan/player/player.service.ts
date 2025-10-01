import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { GenericApiService } from '../../../core/generic-api.service';

@Injectable({
  providedIn: 'root',
})
export class PlayerService extends GenericApiService {
  // urlセット
  protected override setUrl(url: string): void {
    super.setUrl(url);
  }

  constructor(http: HttpClient) {
    super(http);
    this.setUrl(super.getApiUrl() + 'player/');
  }
}
