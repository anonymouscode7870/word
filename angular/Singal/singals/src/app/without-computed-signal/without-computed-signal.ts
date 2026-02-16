import { Component } from '@angular/core';

@Component({
  selector: 'app-without-computed-signal',
  imports: [],
  templateUrl: './without-computed-signal.html',
  styleUrl: './without-computed-signal.css',
})
export class WithoutComputedSignal {

  x = 11;
  y = 22;

  summ = this.x + this.y;

  calculate(){
    console.log(this.summ);
    this.x = 200;
    console.log(this.summ); 
    // the value of summ will not be updated, 
    // it will still be 33, because it is not a computed signal,
    // it is just a regular variable
  }
}
