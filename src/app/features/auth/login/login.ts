import {Component, inject} from '@angular/core';
import {AuthService} from '../../../core/auth/services/auth-service';
import {FormBuilder, ReactiveFormsModule, Validators} from '@angular/forms';
import {Router, RouterLink} from '@angular/router';
import { ToastService } from '../../../core/auth/services/toast.service';
import { ToastComponent } from '../../../shared/components/toast/toast.component';

@Component({
  selector: 'app-login',
  imports: [
    ReactiveFormsModule,
    RouterLink,
    ToastComponent
  ],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  private authService:AuthService = inject(AuthService)
  private fb = inject(FormBuilder)
  private router = inject(Router)
  private toastService = inject(ToastService)

  loginForm = this.fb.nonNullable.group({
    username: ['', Validators.required],
    password: ['', [Validators.required, Validators.minLength(6)] ]
  })

  onSubmit() {
    const credentials = this.loginForm.getRawValue()
    this.authService.login(credentials)
      .subscribe({
        next: () => {
          this.toastService.show('Connexion réussie !', 'success');
          setTimeout(() => this.router.navigate(['/tasks']), 1500);
        },
        error: (err) => {
          this.toastService.show('Identifiants incorrects', 'error');
        }
      })
  }


}
