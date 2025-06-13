import { Component } from '@angular/core';
import { coreImports } from '../../../core/core.imports';

@Component({
  selector: 'app-result',
  imports: [...coreImports],
  templateUrl: './result.component.html',
  styleUrl: './result.component.scss',
})
export class ResultComponent {}
