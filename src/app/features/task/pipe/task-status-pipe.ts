import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'taskStatus',
})
export class TaskStatusPipe implements PipeTransform {
  transform(value: string): string {
    switch (value) {
      case 'DONE': return 'Terminé ✅';
      case 'IN_PROGRESS': return 'En Cours ⏳';
      default: return 'À faire';
    }
  }

}
