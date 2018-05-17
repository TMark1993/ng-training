import { Component, OnInit } from '@angular/core';

import { Task, TaskService } from '../../task.barrel';
import { AppComponent } from '../../../app.component';
import { DragulaService } from 'ng2-dragula';

@Component({
  selector: 'app-task-list',
  templateUrl: './task-list.component.html',
  styleUrls: ['./task-list.component.css']
})
export class TaskListComponent implements OnInit, AppComponent {
  public tasks: Task[];
  public loading: boolean = true;

  title = 'Testing ng2-dragula';

  public constructor(private _taskService: TaskService, private dragula: DragulaService) {
    dragula.drag.subscribe((value) => {
      this.onDrag(value.slice(1));
    });
    dragula.drop.subscribe((value) => {
      console.log(`drop: ${value[0]}`);
      this.onDrop(value.slice(1));
    });
    dragula.setOptions('bag-one', {
      moves: function (el, container, handle) {
        return new RegExp('(?:^|\\s+)handle(?:\\s+|$)').test(handle.className);
      }
    });
  }

  public onDrag(args) {
    let [e, el] = args;
  }

  public onDrop(args) {
    let [e, el] = args;
      let i = 1;
      let inputlist = document.getElementsByTagName("INPUT");
        for (let k=0; k < inputlist.length-1; k++) {
          if (inputlist[k].getAttribute("type") == "hidden") {
            for (const Task_ of this.tasks) { 
              if (Task_.id.toString() === (<HTMLSelectElement>inputlist[k]).value) {
                //console.log((<HTMLSelectElement>inputlist[k]).value + '---' + Task_.id);
                   Task_.position = i++;
                     this.loading = true;
                   this._taskService.update(
                     Task_,
                         {
                         success: updatedTask_ => this.loadTasks(),
                         error: error => this.loadTasks(),
                         finally: () => this.loading = false
                         }
                     );
               }
              }
          }
        }
        //console.log(this.tasks);
  }

  public ngOnInit() {
    this.loadTasks();
  }

  public loadTasks() {
    this.loading = true;
    this._taskService.list({
      success: response => {
        this.tasks = response;
      },
      finally: () => this.loading = false
    });
  }

  public addNewTask() {
    this.loading = true;
    let task = new Task();
    task.name = 'New Task';
    this._taskService.create(
      task,
      {
        success: newTask => {
          task = newTask;
          task.position = this.tasks.length + 1;
          this._taskService.update(
           task,
           {
              success: updatedTask => this.loadTasks(),
              error: error => this.loadTasks(),
              finally: () => this.loading = false
            }
          );
        },
        finally: () => this.loadTasks()
      }
    )
  }

  public removeTask(task: Task) {
    let index: number = this.tasks.indexOf(task);
    if (index !== -1) {
      this.tasks.splice(index, 1);
    }
  }

}
