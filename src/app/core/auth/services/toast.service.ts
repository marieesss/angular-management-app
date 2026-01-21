import { Injectable, signal } from '@angular/core';

export interface Toast {
  message: string;
  type: 'success' | 'error' | 'info';
}

@Injectable({
  providedIn: 'root'
})
export class ToastService {
  // Signal pour gérer l'état du toast
  toast = signal<Toast | null>(null);

  show(message: string, type: 'success' | 'error' | 'info' = 'info'): void {
    this.toast.set({ message, type });

    // Auto-dismiss après 3 secondes
    setTimeout(() => {
      this.toast.set(null);
    }, 3000);
  }

  hide(): void {
    this.toast.set(null);
  }
}
