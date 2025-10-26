import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { CatanComponent } from './catan/catan.component';
import { PlayerComponent } from './catan/player/player.component';
import { GameComponent } from './catan/game/game.component';
import { ResultComponent } from './catan/result/result.component';
import { PlayingGameComponent } from './catan/game/playing-game/playing-game.component';
import { GameListComponent } from './catan/game-list/game-list.component';
import { ***REMOVED******REMOVED***Component } from './***REMOVED***/***REMOVED***.component';
import { TopComponent } from './***REMOVED***/top/top.component';
import { GraduationProjectComponent } from './***REMOVED***/graduation-project/graduation-project.component';
import { ProgrammingComponent } from './***REMOVED***/programming/programming.component';
import { BoardGameManagementComponent } from './***REMOVED***/programming/board-game-management/board-game-management.component';
import { QuizCppComponent } from './***REMOVED***/programming/quiz-cpp/quiz-cpp.component';

export const routes: Routes = [
  { path: '', component: HomeComponent, title: 'home' },
  { path: '***REMOVED***',
    component: ***REMOVED******REMOVED***Component,
    children: [
      { path: '', component: TopComponent, title: '***REMOVED*** ***REMOVED***' },
      { path: 'graduation-project', component: GraduationProjectComponent, title: '***REMOVED*** ***REMOVED*** | 卒業研究' },
      { path: 'programming',
        children: [
          { path: '', component: ProgrammingComponent, title: '***REMOVED*** ***REMOVED*** | 制作物' },
          { path: 'board-game-management', component: BoardGameManagementComponent, title: '***REMOVED*** ***REMOVED*** | ボードゲームの戦績管理' },
          { path: 'quiz-cpp', component: QuizCppComponent, title: '***REMOVED*** ***REMOVED*** | クイズアプリケーション' },
        ],
      },
    ],
  },
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
