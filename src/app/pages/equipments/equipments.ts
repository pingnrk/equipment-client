import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { DxDataGridModule, DxButtonModule, DxDataGridComponent } from 'devextreme-angular';
import { EquipmentService } from '../../services/equipment';
import { AuthService } from '../../services/auth';
import { CartService } from '../../services/cart';
import { Router } from '@angular/router';
import notify from 'devextreme/ui/notify';
import { Equipment } from '../../services/equipment.interface';
import { lastValueFrom, Observable } from 'rxjs'; // 👈 นำเข้า lastValueFrom
import { LoadingService } from '../../services/loading.service';
import CustomStore from 'devextreme/data/custom_store'; // 👈 นำเข้า CustomStore

@Component({
  selector: 'app-equipments',
  imports: [CommonModule, DxDataGridModule, DxButtonModule],
  templateUrl: './equipments.html',
  styleUrl: './equipments.css',
})
export class Equipments implements OnInit {
  dataSource: any; // 💡 เปลี่ยนจาก equipments: Equipment[] = [];
  selectedItemKeys: string[] = []; // 💡 เก็บ Array ของ ID ที่ติ๊กเลือกไว้
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
    this.dataSource = new CustomStore({
      key: 'id',
      load: (loadOptions: any) => {
        this.loadingService.show();

        const size = loadOptions.take || 10;
        const skip = loadOptions.skip || 0;
        const page = skip / size + 1;
        const search = loadOptions.searchValue || '';

        return lastValueFrom(this.equipmentService.getAll(page, size, search))
          .then((res: any) => {
            this.loadingService.hide();
            return {
              data: res.data,
              totalCount: res.totalCount,
            };
          })
          .catch((error) => {
            this.loadingService.hide();
            console.error(error);
            throw 'โหลดข้อมูลไม่สำเร็จ';
          });
      },
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
