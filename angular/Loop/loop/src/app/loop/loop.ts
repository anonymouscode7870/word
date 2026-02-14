import { Component } from '@angular/core';

@Component({
  selector: 'app-loop',
  imports: [],
  templateUrl: './loop.html',
  styleUrl: './loop.css',
})
export class Loop {

  users = ["john", "doe", "smith", "jane"];

  students = [
    { name: "john", age: 20 },
    { name: "doe", age: 22 },
    { name: "smith", age: 21 },
    { name: "jane", age: 23 }
  ];

}
