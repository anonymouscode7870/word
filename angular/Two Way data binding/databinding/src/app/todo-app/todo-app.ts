import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-todo-app',
  imports: [FormsModule],
  templateUrl: './todo-app.html',
  styleUrl: './todo-app.css',
})
export class TodoApp {
  buttonText = "Edit";
  task = "";


  // listOfItems: string[] = [];

  listOfItems: { id: number; task: string, isdisabled: boolean, isDone: boolean }[] = [];

  // listOfItems = []; here i have to define the type of array as string or object otherwise it will give error because it is not able to understand the type of array

  addTask() {
    console.log(this.task);
    if (this.task.length == 0) {
      // alert("Please enter a task");
      return;
    }
    this.listOfItems.push({ id: this.listOfItems.length + 1, task: this.task, isdisabled: true, isDone: true });
    this.task = "";
  }


  editTask(id: number) {
    const taskToUpdate = this.listOfItems.find(item => item.id === id);
    if (taskToUpdate) {
      taskToUpdate.isdisabled = false;
    }
  }

  saveTask(id: number) {
    const taskToUpdate = this.listOfItems.find(item => item.id === id);
    if (taskToUpdate) {

      taskToUpdate.task = taskToUpdate.task; // Update the task with the new value
      if (taskToUpdate.task.length == 0) {
        // alert("Please enter a task");
        return;
      }
      taskToUpdate.isdisabled = true;
    }
  }

  done(id: number) {
    const taskToUpdate = this.listOfItems.find(item => item.id === id);
    if (taskToUpdate) {
      if (this.buttonText === "Edit") {

        taskToUpdate.isDone = false;


      }
    }

  }



  removetTask(id: number) {
    {
      this.listOfItems = this.listOfItems.filter(item => item.id !== id);
    }




  }

}
