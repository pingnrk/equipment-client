import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Equipment } from './equipment';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  private selectedItems = new BehaviorSubject<Equipment[]>([]);
  selectedItems$ = this.selectedItems.asObservable();

  constructor() {}
  setItems(items: Equipment[]) {
    this.selectedItems.next(items);
  }
  getItems(): Equipment[] {
    return this.selectedItems.getValue();
  }

  clearCart() {
    this.selectedItems.next([]);
  }
}
