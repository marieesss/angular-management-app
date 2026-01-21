import { Component, DestroyRef, inject, signal, computed } from '@angular/core'; // Ajout de computed
import { CommonModule } from '@angular/common';
import { TaskService } from '../services/taskService';
import { Status, Tasks } from '../interfaces/tasks';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { TaskCard } from '../../../shared/task-card/task-card';
import { ConfirmModalComponent } from '../../../shared/components/confirm-modal/confirm-modal.component';
import { ToastService } from '../../../core/auth/services/toast.service';
import { ToastComponent } from '../../../shared/components/toast/toast.component';

// Type pour le filtre
type FilterType = 'ALL' | 'TODO' | 'DONE';

@Component({
  selector: 'app-task-list',
  imports: [CommonModule, TaskCard, ConfirmModalComponent, ToastComponent],
  templateUrl: './task-list.html',
  styleUrl: './task-list.css',
})
export class TaskList {
  private taskService = inject(TaskService);
  private toastService = inject(ToastService);
  task = signal<Tasks[]>([]);
  private destroyRef = inject(DestroyRef);
  taskToDelete = signal<Tasks | null>(null);
  
  // État du filtre actuel
  filter = signal<FilterType>('ALL');

  // Signal calculé : se met à jour automatiquement si 'task' ou 'filter' change
  filteredTasks = computed(() => {
    const tasks = this.task();
    const currentFilter = this.filter();

    switch (currentFilter) {
      case 'DONE':
        return tasks.filter(t => t.status === Status.DONE);
      case 'TODO':
        // On considère "À faire" comme PENDING ou IN_PROGRESS
        return tasks.filter(t => t.status === Status.PENDING || t.status === Status.IN_PROGRESS);
      case 'ALL':
      default:
        return tasks;
    }
  });

  ngOnInit() {
    this.taskService.getTasks().pipe(takeUntilDestroyed(this.destroyRef)).subscribe((tasks) => {
      this.task.set(tasks);
    });
  }

  // Méthode pour changer le filtre via l'UI
  setFilter(newFilter: FilterType) {
    this.filter.set(newFilter);
  }

  onStartTaskEdit(task: Tasks) {
   this.taskService.updateTask(task).pipe(takeUntilDestroyed(this.destroyRef)).subscribe((updatedTask) => {
      const currentTasks = this.task();
      const index = currentTasks.findIndex(t => t.id === updatedTask.id);
      if (index !== -1) {
        currentTasks[index] = updatedTask;
        this.task.set([...currentTasks]); // Cela déclenchera aussi la mise à jour de filteredTasks
      }
    });
  }

  onDeleteTask(task: Tasks) {
    this.taskToDelete.set(task);
  }

  confirmDelete() {
    const task = this.taskToDelete();
    if (task && task.id) {
      this.taskService.deleteTask(task.id).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
        next: () => {
          const currentTasks = this.task();
          this.task.set(currentTasks.filter(t => t.id !== task.id));
          this.taskToDelete.set(null);
          this.toastService.show('Tâche supprimée avec succès !', 'success');
        },
        error: () => {
          this.toastService.show('Erreur lors de la suppression de la tâche', 'error');
        }
      });
    }
  }

  cancelDelete() {
    this.taskToDelete.set(null);
  }
}