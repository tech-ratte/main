import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { CatanComponent } from './catan/catan.component';
import { PlayerComponent } from './catan/player/player.component';
import { GameComponent } from './catan/game/game.component';
import { ResultComponent } from './catan/result/result.component';
import { PlayingGameComponent } from './catan/game/playing-game/playing-game.component';
import { GameListComponent } from './catan/game-list/game-list.component';

export const routes: Routes = [
  { path: '', component: HomeComponent, title: 'home' },
  {
    path: 'catan',
    component: CatanComponent,
    children: [
      { path: '', component: ResultComponent, title: 'Catan | Result' },
      { path: 'player', component: PlayerComponent, title: 'Catan | Player' },
      {
        path: 'game',
        children: [
          { path: '', component: GameComponent, title: 'Catan | Game' },
          { path: 'playing-game', component: PlayingGameComponent, title: 'Catan | Playing Game' },
        ],
      },
      { path: 'game-list', component: GameListComponent, title: 'Catan | List' },
    ],
  },
];
