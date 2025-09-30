import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { coreImports } from '../core/core.imports';
import { HealthCheckService } from '../core/health-check/health-check.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, ...coreImports],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent implements OnInit {
  isLoading = true;

  constructor(private healthService: HealthCheckService) {}

  ngOnInit() {
    this.healthService.checkHealth().subscribe((ok) => {
      if (ok) {
        this.isLoading = false;
        // 必要なら location.href = '/admin';
      } else {
        // 再試行ロジックを入れてもOK
        setTimeout(() => this.ngOnInit(), 3000);
      }
    });
  }
}
