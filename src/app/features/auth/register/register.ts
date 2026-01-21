import {Component, DestroyRef, inject} from '@angular/core';
import {AuthService} from '../../../core/auth/services/auth-service';
import {FormBuilder, ReactiveFormsModule, Validators} from '@angular/forms';
import {Credentials} from '../../../core/auth/interfaces/credentials';
import {Router, RouterLink} from '@angular/router';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';
import { ToastService } from '../../../core/auth/services/toast.service';
import { ToastComponent } from '../../../shared/components/toast/toast.component';

@Component({
  selector: 'app-register',
  imports: [
    ReactiveFormsModule,
    RouterLink,
    ToastComponent
  ],
  templateUrl: './register.html',
  styleUrl: './register.css',
})
export class Register {
  private authService:AuthService = inject(AuthService)
  private fb = inject(FormBuilder)
  private router = inject(Router)
  private destroyRef = inject(DestroyRef);
  private toastService = inject(ToastService);

  registerForm = this.fb.nonNullable.group({
    username: ['', Validators.required],
    password: ['', [Validators.required, Validators.minLength(6)]]
  })

  onSubmit() {
    const credentials: Credentials = this.registerForm.getRawValue()
    this.authService.register(credentials)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
      next: () => {
        this.toastService.show('Compte créé avec succès ! Redirection...', 'success');
        // Delay navigation to let the user see the toast
        setTimeout(() => this.router.navigate(['/login']), 1500);
      },
      error: (err) => {
        console.log(err)
        // Show error in toast instead of text below form
        this.toastService.show(err.error.message || 'Une erreur est survenue', 'error');
      }
    })
  }

}
