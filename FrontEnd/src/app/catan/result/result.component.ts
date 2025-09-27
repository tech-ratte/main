import { Component, OnInit } from '@angular/core';
import { TimeFormatService } from '../../../core/time-format/time-format.service';
import { CatanColors, PersonalResult } from '../game/game.model';
import { PlayerService } from '../player/player.service';
import { coreImports } from '../../../core/core.imports';
import { PersonalResultService } from '../game/personal-result.service';
import { Player } from '../player/player.model';

@Component({
  selector: 'app-result',
  imports: [...coreImports],
  templateUrl: './result.component.html',
  styleUrl: './result.component.scss',
})
export class ResultComponent implements OnInit {
  players: Player[] = [];
  personalResults: PersonalResult[] = [];

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
    private playerService: PlayerService,
    private personalResultService: PersonalResultService,
    public timeFormatService: TimeFormatService,
  ) {}

  ngOnInit(): void {
    this.playerService.getAll().subscribe(
      (response) => {
        this.players = response;
      },
      (error) => {
        console.error('Error getting players:', error);
      },
    );

    this.personalResultService.getAll().subscribe(
      (response) => {
        this.personalResults = response;
      },
      (error) => {
        console.error('Error getting personalResults:', error);
      },
    );
  }
}
