import { Component, computed, signal, WritableSignal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ComputedSignals } from './computed-signals/computed-signals';
import { WithoutComputedSignal } from './without-computed-signal/without-computed-signal';
import { EffectSignal } from './effect-signal/effect-signal';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, ComputedSignals, WithoutComputedSignal, EffectSignal],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('singals');

  count = signal<number | string>(0);
 
  // more strickt typing
  data: WritableSignal<number | string> = signal(0);
  counter(){
    // this.count.update(c => c + 1); // correct
    // this.count.set(this.count() + 1); // correct  
    // this.count()++; // not allowed

  }

  update(){
    this.count.set('updated');
  }

}
