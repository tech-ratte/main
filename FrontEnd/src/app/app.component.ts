import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { coreImports } from '../core/core.imports';
import { interval, Subscription, takeWhile } from 'rxjs';
import { HealthCheckService } from '../core/health-check/health-check.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, ...coreImports],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent implements OnInit {
  progress = 0;
  maxTime = 90000; // 90秒
  pollInterval = 5000; // 5秒ごとにヘルスチェック
  private pollSub?: Subscription;

  constructor(private healthCheckService: HealthCheckService) {}

  ngOnInit() {
    // this.startPolling();
  }

  startPolling() {
    const startTime = Date.now();

    this.pollSub = interval(this.pollInterval)
      .pipe(
        takeWhile(() => Date.now() - startTime < this.maxTime && this.progress < 100)
      )
      .subscribe(() => {
        this.healthCheckService.checkHealth().subscribe(isHealthy => {
          if (isHealthy) {
            this.progress = 100;  // サーバーが回復したら即100%
            this.pollSub?.unsubscribe();
          } else {
            // サーバーがまだダウンなら少しずつ進める
            const elapsed = Date.now() - startTime;
            this.progress = Math.min((elapsed / this.maxTime) * 100, 99);
          }
        });
      });
  }
}
