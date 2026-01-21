import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'frenchDate',
  standalone: true
})
export class FrenchDatePipe implements PipeTransform {
  transform(value: string | undefined): string {
    if (!value) {
      return 'Date non disponible';
    }

    const date = new Date(value);

    if (isNaN(date.getTime())) {
      return 'Date invalide';
    }

    const options: Intl.DateTimeFormatOptions = {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };

    return new Intl.DateTimeFormat('fr-FR', options).format(date);
  }
}
