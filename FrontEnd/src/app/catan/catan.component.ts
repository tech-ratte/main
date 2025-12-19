import { Component, OnDestroy, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { coreImports } from '../../core/core.imports';
import { interval, Subscription, takeWhile } from 'rxjs';
import { HealthCheckService } from '../../core/health-check/health-check.service';

@Component({
  selector: 'app-catan',
  imports: [...coreImports, RouterModule],
  templateUrl: './catan.component.html',
  styleUrl: './catan.component.scss',
})
export class CatanComponent implements OnInit, OnDestroy {
  progress = 0;
  loading = true;
  progressSub?: Subscription;
  healthSub?: Subscription;

  constructor(private healthService: HealthCheckService) {}

  ngOnInit() {
    const totalDuration = 90_000; // 90秒
    const step = 100; // 100msごと
    const increment = (100 * step) / totalDuration;

    // プログレスバー進行
    this.progressSub = interval(step)
      .pipe(takeWhile(() => this.loading && this.progress < 100))
      .subscribe(() => {
        this.progress = Math.min(this.progress + increment, 100);
      });

    //  最初にヘルスチェック
    this.healthService.checkHealth().subscribe((ok) => {
      if (ok) {
        this.progress = 100;
        this.loading = false;
        this.cleanup();
      }
    });

    // 5秒ごとのヘルスチェック
    this.healthSub = interval(5000)
      .pipe(takeWhile(() => this.loading))
      .subscribe(() => {
        this.healthService.checkHealth().subscribe((ok) => {
          if (ok) {
            this.progress = 100;   // 一気に 100%
            this.loading = false;  // ローディング終了
            this.cleanup();
          }
        });
      });
  }

  ngOnDestroy() {
    this.cleanup();
  }

  private cleanup() {
    this.progressSub?.unsubscribe();
    this.healthSub?.unsubscribe();
  }
}
