import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Loop } from './loop/loop';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Loop],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('loop');
}
