import { Component, OnInit } from '@angular/core';
import { TimeFormatService } from '../../../core/time-format/time-format.service';
import { CatanColors } from '../game/game.model';
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

  // カタンカラー設定
  setCatanColor(color: string): string {
    switch (color) {
      case 'red':
        return CatanColors.RED;
      case 'white':
        return CatanColors.WHITE;
      case 'blue':
        return CatanColors.BLUE;
      case 'yellow':
        return CatanColors.YELLOW;
      case 'green':
        return CatanColors.GREEN;
      case 'brown':
        return CatanColors.BROWN;
      default:
        return '';
    }
  }

  constructor(
    private personalResultService: PersonalResultService,
    public timeFormatService: TimeFormatService,
  ) {}

  ngOnInit(): void {
    this.personalResultService.getAggregate().subscribe(
      (response) => {
        this.aggregate = response;
      },
      (error) => {
        console.error('Error getting aggregate:', error);
      },
    );
  }
}
