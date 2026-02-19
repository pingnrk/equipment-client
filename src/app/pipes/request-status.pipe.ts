import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'requestStatus',
  standalone: true,
})
export class RequestStatusPipe implements PipeTransform {
  transform(value: number): string {
    switch (value) {
      case 1:
        return 'Pending';
      case 2:
        return 'Approved';
      case 3:
        return 'Rejected';
      case 4:
        return 'Returned';
      default:
        return 'Unknown';
    }
  }
}
