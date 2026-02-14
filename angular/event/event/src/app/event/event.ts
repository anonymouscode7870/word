import { Component } from '@angular/core';

@Component({
  selector: 'app-event',
  imports: [],
  templateUrl: './event.html',
  styleUrl: './event.css',
})
export class Event {
  name = "";
  displayName = "";
  email="";
  // click event handler
  handleClick(event: MouseEvent){
    console.log(event);
    console.log(event.target);
    console.log(event.type)
  }

  // mouse enter event handler
  handleMouseEnter(event: MouseEvent){
    console.log(event);
    console.log(event.target);
    console.log(event.type)
  }

  // input event handler
  handleInput(value: string){
    console.log(value);

    // console.log((event.target as HTMLInputElement).value);
    // console.log(event.type)
  }

  // get user input
  handleGetInput(value: string){
    console.log(value);
    this.name = value;
  }

  //SET input val
  handleSetInput(){
    this.displayName = this.name;
  }


  // handleEmailInput(value: string){ // no need as i m using template reference variable
  //   console.log(value);
  //   this.email = value;

  // }

    getEmail(val: string){
       console.log(val);
       this.email = val;

    }

    setEmail(){
      this.email="abc@gmail.com";
    }
}

