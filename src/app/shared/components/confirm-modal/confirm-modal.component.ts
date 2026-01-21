import { Component, output, input } from '@angular/core';

@Component({
  selector: 'app-confirm-modal',
  standalone: true,
  imports: [],
  templateUrl: './confirm-modal.component.html',
  styleUrl: './confirm-modal.component.css'
})
export class ConfirmModalComponent {
  title = input<string>('Confirmation');
  message = input<string>('Êtes-vous sûr de vouloir continuer ?');
  confirmText = input<string>('Confirmer');
  cancelText = input<string>('Annuler');

  confirm = output<void>();
  cancel = output<void>();

  onConfirm(): void {
    this.confirm.emit();
  }

  onCancel(): void {
    this.cancel.emit();
  }
}
