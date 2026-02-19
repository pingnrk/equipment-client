import { Pipe, PipeTransform } from '@angular/core';
import { formatDate } from '@angular/common';

@Pipe({
  name: 'dateFormat',
  standalone: true,
})
export class DateFormatPipe implements PipeTransform {
  transform(value: string | Date | null | undefined, format: string = 'dd/MM/yyyy'): string {
    if (value == null) {
      return '';
    }
    try {
      return formatDate(value, format, 'en-US'); // Using 'en-US' locale as a default
    } catch (error) {
      console.error('DateFormatPipe: Invalid date value', value);
      return '';
    }
  }
}
