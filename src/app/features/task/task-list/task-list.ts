import { Component, DestroyRef, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TaskService } from '../services/taskService';
import { Status, Tasks } from '../interfaces/tasks';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { TaskCard } from '../../../shared/task-card/task-card';

@Component({
  selector: 'app-task-list',
  imports: [CommonModule, TaskCard],
  templateUrl: './task-list.html',
  styleUrl: './task-list.css',
})
export class TaskList {
  private taskService = inject(TaskService);
  task = signal<Tasks[]>([]);
  private destroyRef = inject(DestroyRef);

  ngOnInit() {
    this.taskService.getTasks().pipe(takeUntilDestroyed(this.destroyRef)).subscribe((tasks) => {
      this.task.set(tasks);
    });
  }

  onStartTaskEdit(task: Tasks) {
   this.taskService.updateTask(task).pipe(takeUntilDestroyed(this.destroyRef)).subscribe((updatedTask) => {
      const currentTasks = this.task();
      const index = currentTasks.findIndex(t => t.id === updatedTask.id);
      if (index !== -1) {
        currentTasks[index] = updatedTask;
        this.task.set([...currentTasks]);
      }
    });
  }

  onDeleteTask(task: Tasks) {
    this.taskService.deleteTask(task.id!).pipe(takeUntilDestroyed(this.destroyRef)).subscribe(() => {
    
      const currentTasks = this.task();
      this.task.set(currentTasks.filter(t => t.id !== task.id));
    });
  }

}
