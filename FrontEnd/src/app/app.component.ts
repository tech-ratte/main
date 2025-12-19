import { Component, OnDestroy, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { coreImports } from '../core/core.imports';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, ...coreImports],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {}
