import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { CatanComponent } from './catan/catan.component';
import { PlayerComponent } from './catan/player/player.component';
import { GameComponent } from './catan/game/game.component';
import { CatanHomeComponent } from './catan/catan-home/catan-home.component';
import { PlayingGameComponent } from './catan/game/playing-game/playing-game.component';

export const routes: Routes = [
  { path: '', component: HomeComponent, title: 'home' },
  {
    path: 'catan',
    component: CatanComponent,
    children: [
      { path: '', component: CatanHomeComponent, title: 'Catan' },
      { path: 'player', component: PlayerComponent, title: 'Player' },
      {
        path: 'game',
        children: [
          { path: '', component: GameComponent, title: 'Game' },
          { path: 'playing-game', component: PlayingGameComponent, title: 'Playing Game' },
        ],
      },
    ],
  },
  { path: '**', redirectTo: '', pathMatch: 'full' },
];

export const appRoutes = provideRouter(routes, withComponentInputBinding(), { useHash: true });