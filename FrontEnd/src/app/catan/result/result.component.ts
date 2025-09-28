import { Component, OnInit } from '@angular/core';
import { TimeFormatService } from '../../../core/time-format/time-format.service';
import { coreImports } from '../../../core/core.imports';
import { PersonalResultService } from '../game/personal-result.service';

@Component({
  selector: 'app-result',
  imports: [...coreImports],
  templateUrl: './result.component.html',
  styleUrl: './result.component.scss',
})
export class ResultComponent implements OnInit {
  aggregate: any[] = [];

  play_count_ranking: any[] = [];

  setPlayCountRanking() {
    this.play_count_ranking = this.aggregate
      .map((result) => ({
        player: result.player,
        play_count: result.play_count,
      }))
      .sort((a, b) => b.play_count - a.play_count);
  }

  constructor(
    private personalResultService: PersonalResultService,
    public timeFormatService: TimeFormatService,
  ) {}

  ngOnInit(): void {
    this.personalResultService.getAggregate().subscribe(
      (response) => {
        this.aggregate = response;
        this.setPlayCountRanking();
      },
      (error) => {
        console.error('Error getting aggregate:', error);
      },
    );
  }
}
