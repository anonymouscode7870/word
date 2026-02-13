import { Component } from '@angular/core';

@Component({
  selector: 'app-counter',
  imports: [],
  templateUrl: './counter.html',
  styleUrl: './counter.css',
})
export class Counter {
  count:number = 0;

  // handle using 3 function 
  increment(){
    this.count= this.count + 1
  }
  decrement(){
    this.count--;
  }
  reset(){
    this.count = 0;
  }
// ................................................................
// handle using one function
  handleCounter(arglelo:string){
    if(arglelo === 'increment'){
      this.count++;
    }else if(arglelo === 'decrement'){
      this.count--;
    }else if(arglelo === 'reset'){
      this.count = 0;
    }
  }

}
