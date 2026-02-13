import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Login } from './login/login';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Login],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('hii dear');
  title2 = 'hj jhsdh cch j';

  name: string = 'hii';
  age: number| number| boolean = 20;

  alertCalled(){
    alert('alert called');
    this.name = 'hello';
    this.age = 30;
    this.age = true;
    this.otherFunction();   // use of this keyword to call other function in same class
  }

  otherFunction(){
    console.log('other function called');
  }

  add (a: number, b: number): number{
    return a + b;
  }
  // cannot write as b become any type
  add2(a, b){
    return a + b;
  }
}
