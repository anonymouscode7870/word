import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Event } from './event/event';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Event],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('event');
}
