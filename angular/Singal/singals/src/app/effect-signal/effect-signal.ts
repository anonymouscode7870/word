import { Component, effect, signal } from '@angular/core';

@Component({
  selector: 'app-effect-signal',
  imports: [],
  templateUrl: './effect-signal.html',
  styleUrl: './effect-signal.css',
})
export class EffectSignal {

  username = signal('abc');

  // effect signal
  constructor() {
    effect(() => {
      console.log(` ${this.username()}`);
    });
  }
}
