import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { DxDataGridModule, DxButtonModule, DxDataGridComponent } from 'devextreme-angular';
import { EquipmentService } from '../../services/equipment';
import { AuthService } from '../../services/auth';
import { CartService } from '../../services/cart';
import { Router } from '@angular/router';
import notify from 'devextreme/ui/notify';
import { Equipment } from '../../services/equipment.interface'; // ตรวจสอบ path ให้ถูกต้องตามโปรเจกต์จริง
import { finalize, Observable } from 'rxjs';
import { LoadingService } from '../../services/loading.service';

@Component({
  selector: 'app-equipments',
  imports: [CommonModule, DxDataGridModule, DxButtonModule],
  templateUrl: './equipments.html',
  styleUrl: './equipments.css',
})
export class Equipments implements OnInit {
  equipments: Equipment[] = [];
  selectedItemKeys: string[] = [];
  isLoading: Observable<boolean>;

  @ViewChild(DxDataGridComponent, { static: false }) dataGrid!: DxDataGridComponent;

  constructor(
    private equipmentService: EquipmentService,
    public authService: AuthService,
    private cartService: CartService,
    private router: Router,
    private loadingService: LoadingService,
  ) {
    this.isLoading = this.loadingService.isLoading;
  }

  ngOnInit(): void {
    this.loadData();
  }

  loadData() {
    this.loadingService.show();
    this.equipmentService
      .getAll()
      .pipe(finalize(() => this.loadingService.hide()))
      .subscribe({
        next: (data) => {
          this.equipments = data;
        },
        error: (err) => console.error('Error fetching data:', err),
      });
  }

  getFullImageUrl(base64String: string): string {
    if (!base64String) {
      return 'assets/no-image.png';
    }
    return base64String;
  }


  async onProceed() {
    if (!this.authService.getToken()) {
      notify('Please login to continue borrowing.', 'warning', 2000);
      this.router.navigate(['/login']);
      return;
    }

    const selectedData = await this.dataGrid.instance.getSelectedRowsData();
    if (selectedData.length === 0) {
      notify('Please select at least one item', 'warning', 2000);
      return;
    }
    this.cartService.setItems(selectedData);
    this.router.navigate(['/cart']);
  }


}
