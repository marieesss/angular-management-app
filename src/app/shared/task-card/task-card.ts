import { Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Status, Tasks } from '../../features/task/interfaces/tasks';
import { TaskStatusPipe } from '../../features/task/pipe/task-status-pipe';
import { FrenchDatePipe } from '../../features/task/pipe/french-date.pipe';

@Component({
  selector: 'app-task-card',
  imports: [CommonModule, TaskStatusPipe, FrenchDatePipe],
  templateUrl: './task-card.html',
  styleUrl: './task-card.css',
})
export class TaskCard {
  task = input.required<Tasks>();
  
  editTask = output<Tasks>();
  startTaskEdit = output<Tasks>();
  deleteTask = output<Tasks>();

  onEdit() {
    this.editTask.emit(this.task());
  }

  onStart() {
    if (this.task().id) {
      this.startTaskEdit.emit({ ...this.task(), status: Status.IN_PROGRESS });
    }
  }

  onEnd() {
    if (this.task().id) {
      this.startTaskEdit.emit({ ...this.task(), status: Status.DONE });
    }
  }

  onDelete() {
    if (this.task().id) {
      this.deleteTask.emit(this.task());
    }
  }
}
