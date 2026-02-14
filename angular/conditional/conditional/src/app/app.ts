import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Ifelse } from './ifelse/ifelse';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Ifelse],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('conditional');
}
