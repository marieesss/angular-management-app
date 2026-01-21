import {Component, inject, Input, OnInit, signal, WritableSignal} from '@angular/core';
import {AuthService} from '../../../core/auth/services/auth-service';
import {FormBuilder, ReactiveFormsModule, Validators} from '@angular/forms';
import {Tasks} from '../interfaces/tasks';
import {TaskService} from '../services/taskService';
import {Router} from '@angular/router';
import {UsersService} from '../../users/users-service';
import {User} from '../../../core/auth/interfaces/user';
import {ToastService} from '../../../core/auth/services/toast.service';
import {ToastComponent} from '../../../shared/components/toast/toast.component';

@Component({
  selector: 'app-task-form',
  imports: [
    ReactiveFormsModule,
    ToastComponent
  ],
  templateUrl: './task-form.html',
  styleUrl: './task-form.css',
})
export class TaskForm implements OnInit{
  protected authService: AuthService = inject(AuthService)
  private fb = inject(FormBuilder)
  private taskService = inject(TaskService)
  private router = inject(Router)
  private usersService = inject(UsersService)
  private toastService = inject(ToastService)

  @Input() id?: string;

  users: WritableSignal<User[]> = signal<User[]>([])

  tasksForm = this.fb.nonNullable.group({
    title: ['', [Validators.required, Validators.minLength(1)]],
    description: ['', Validators.required],
    targetUserId: [null as string | null]
  })

  ngOnInit() {
    if (this.authService.currentUser()?.role === 'ADMIN') {
      this.usersService.getAllUsers().subscribe({
        next: (users: User[]) => this.users.set(users),
      })
    }

    if(this.id){
      this.taskService.getTaskById(Number(this.id)).subscribe({
        next: (task: Tasks) => {
          this.tasksForm.setValue({
            title: task.title,
            description: task.description,
            targetUserId: task.targetUserId || null
          })
        }
      })
  }
}




  onSubmit() {
    if (this.tasksForm.invalid) {
      this.tasksForm.markAllAsTouched();
      this.toastService.show('Veuillez remplir tous les champs requis', 'error');
      return;
    }

    const task: Tasks = this.tasksForm.getRawValue()
    if(this.id){
      this.taskService.updateTask({id: Number(this.id), ...task}).subscribe({
        next: () => {
          this.toastService.show('Tâche modifiée avec succès !', 'success');
          setTimeout(() => this.router.navigate(['/tasks']), 1000);
        },
        error: () => {
          this.toastService.show('Erreur lors de la modification de la tâche', 'error');
        }
      })
    }
    else{
      this.taskService.createTask(task).subscribe({
        next: () => {
          this.toastService.show('Tâche créée avec succès !', 'success');
          setTimeout(() => this.router.navigate(['/tasks']), 1000);
        },
        error: () => {
          this.toastService.show('Erreur lors de la création de la tâche', 'error');
        }
      })
    }
  }

}
