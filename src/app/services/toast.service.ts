import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export type ToastType = 'info' | 'success' | 'error' | 'warning';

@Injectable({
  providedIn: 'root'
})
export class ToastService {
  isVisible = new BehaviorSubject<boolean>(false);
  message = new BehaviorSubject<string>('');
  type = new BehaviorSubject<ToastType>('info');

  show(message: string, type: ToastType = 'success') {
    this.message.next(message);
    this.type.next(type);
    this.isVisible.next(true);
  }

  hide() {
    this.isVisible.next(false);
  }
}
