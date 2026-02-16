import { Component, signal, computed } from '@angular/core';

@Component({
  selector: 'app-computed-signals',
  imports: [],
  templateUrl: './computed-signals.html',
  styleUrl: './computed-signals.css',
})
export class ComputedSignals {

  x = signal(11);
  y = signal(22);

 
   // computed signal
  sum = computed(() => this.x() + this.y());

  ComputedSignalscalculate(){
    console.log(this.sum());
    this.x.set(33);
    console.log(this.sum()); // 
  }

  // we cannot directly set/update the value of a computed signal, it is read-only
  // this.sum.set(44); // not allowed
  // we can change the value of x and y, and the sum will be automatically updated
  // that is by changing the values of dependent signals, the computed signal will be automatically updated
    
}
