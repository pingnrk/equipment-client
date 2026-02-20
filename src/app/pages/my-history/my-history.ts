import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { DxDataGridModule } from 'devextreme-angular';
import { BorrowService } from '../../services/borrow';
import { BorrowRequest } from '../../services/borrow.interface';
import { finalize, Observable } from 'rxjs';
import { LoadingService } from '../../services/loading.service';

@Component({
  selector: 'app-my-history',
  imports: [DxDataGridModule, CommonModule],
  templateUrl: './my-history.html',
  styleUrl: './my-history.css',
})
export class MyHistory implements OnInit {
  historyRequests: BorrowRequest[] = [];
  isLoading: Observable<boolean>;

  constructor(
    private borrowService: BorrowService,
    private loadingService: LoadingService,
  ) {
    this.isLoading = this.loadingService.isLoading;
  }

  ngOnInit(): void {
    this.loadMyRequests();
  }

  loadMyRequests() {
    this.loadingService.show();
    this.borrowService
      .getMyRequests()
      .pipe(finalize(() => this.loadingService.hide()))
      .subscribe({
        next: (res) => {
          this.historyRequests = res.filter((item) => item.status === 3 || item.status === 4);
        },
        error: (err) => console.log(err),
      });
  }

  getStatusText(status: number) {
    switch (status) {
      // case 1: return 'Pending';
      // case 2: return 'Approved';
      case 3:
        return 'Rejected';
      case 4:
        return 'Returned';
      default:
        return 'Unknown';
    }
  }

  getFullImageUrl(imageUrl: string): string {
    if (!imageUrl) return 'assets/no-image.png';
    return imageUrl;
  }
}
