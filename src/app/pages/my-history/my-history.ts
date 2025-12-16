import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { DxDataGridModule } from 'devextreme-angular';
import { BorrowService } from '../../services/borrow';
import { BorrowRequest } from '../../services/borrow.interface';

@Component({
  selector: 'app-my-history',
  imports: [DxDataGridModule,CommonModule],
  templateUrl: './my-history.html',
  styleUrl: './my-history.css',
})
export class MyHistory implements OnInit {
  requests: BorrowRequest[] = [];

  constructor(private borrowService: BorrowService) {}

  ngOnInit(): void {
      this.loadMyRequests();
  }

  loadMyRequests() {
    this.borrowService.getMyRequests().subscribe({
      next: (res) => {
        this.requests = res;
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  getStatusText(status: number) {
    switch (status) {
      case 1: return 'Pending';
      case 2: return 'Approved';
      case 3: return 'Rejected';
      case 4: return 'Returned';
      default: return 'Unknown';
    }
  }

}
