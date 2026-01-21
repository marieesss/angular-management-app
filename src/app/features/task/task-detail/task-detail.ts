import { Component, DestroyRef, inject, Input, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { TaskService } from '../services/taskService';
import { Tasks } from '../interfaces/tasks';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { TaskStatusPipe } from '../pipe/task-status-pipe';
import { CommonModule } from '@angular/common';
import { ToastService } from '../../../core/auth/services/toast.service';
import { ToastComponent } from '../../../shared/components/toast/toast.component';

@Component({
  selector: 'app-task-detail',
  imports: [TaskStatusPipe, CommonModule, RouterLink, ToastComponent],
  templateUrl: './task-detail.html',
  styleUrl: './task-detail.css',
})
export class TaskDetail {
  private taskService = inject(TaskService)
  private destroyRef = inject(DestroyRef);
  private router = inject(Router);
  private toastService = inject(ToastService);

  @Input() id?: string;

  task = signal<Tasks | null>(null);


  ngOnInit() {
    if(this.id){
      this.taskService.getTaskById(Number(this.id)).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
        next: (task) => {
          this.task.set(task);
        }
      })
    }

  }

  onDelete() {
    if(this.task()?.id){
      this.taskService.deleteTask(this.task()?.id!).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
        next: () => {
          this.task.set(null);
          this.toastService.show('Tâche supprimée avec succès !', 'success');
          setTimeout(() => this.router.navigate(['/tasks']), 1500);
        },
        error: () => {
          this.toastService.show('Erreur lors de la suppression de la tâche', 'error');
        }
      })
    }

  }


}
