import { Component } from '@angular/core';

@Component({
  selector: 'app-ifelse',
  imports: [],
  templateUrl: './ifelse.html',
  styleUrl: './ifelse.css',
})
export class Ifelse {
  condition = false;

  colr: number = 1;
  colrr = true

  toggle(){
    this.condition = !this.condition;

  }

  changeColorbg(){
    this.colrr = !this.colrr;
  }

  changeColor(val:number){
    this.colr = val;
  }


}
