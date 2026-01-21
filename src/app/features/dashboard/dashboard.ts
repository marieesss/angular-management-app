import { Component, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { toSignal } from '@angular/core/rxjs-interop';

import { TaskService } from '../task/services/taskService';
import type { Tasks } from '../task/interfaces/tasks';
import { Status } from '../task/interfaces/tasks';
import { AuthService } from '../../core/auth/services/auth-service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class Dashboard {
  private readonly taskService = inject(TaskService);
  private readonly authService = inject(AuthService);

  readonly tasks = toSignal(this.taskService.getTasks(), { initialValue: [] as Tasks[] });

  readonly isAdmin = computed(() => this.authService.currentUser()?.role === 'ADMIN');

  // Libellé dynamique (admin => global, user => mes tâches)
  readonly scopeLabel = computed(() => (this.isAdmin() ? 'Global (tous les utilisateurs)' : 'Mes tâches'));

  readonly totalTasks = computed(() => this.tasks().length);

  readonly doneTasks = computed(() =>
    this.tasks().filter(t => t.status === Status.DONE).length
  );

  readonly completionPercent = computed(() => {
    const total = this.totalTasks();
    if (total === 0) return 0;
    return Math.round((this.doneTasks() / total) * 100);
  });
}