import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { DxDataGridModule, DxButtonModule } from 'devextreme-angular';
import notify from 'devextreme/ui/notify';
import { EquipmentService } from '../../services/equipment';
import { confirm } from 'devextreme/ui/dialog';
import { LoadingService } from '../../services/loading.service';
import { finalize, lastValueFrom, Observable } from 'rxjs';
import { CustomStore } from 'devextreme/common/data';

@Component({
  selector: 'app-admin-equipment-list',
  standalone: true,
  imports: [CommonModule, DxDataGridModule, DxButtonModule],
  templateUrl: './admin-equipment-list.html',
  styleUrl: './admin-equipment-list.css',
})
export class AdminEquipmentList implements OnInit {
  equipments: any[] = [];
  isLoading: Observable<boolean>;
  dataSource: any;

  constructor(
    private equipmentService: EquipmentService,
    private router: Router,
    private loadingService: LoadingService,
  ) {
    this.isLoading = this.loadingService.isLoading;
    this.onEditClick = this.onEditClick.bind(this);
    this.onDeleteClick = this.onDeleteClick.bind(this);
  }

  ngOnInit() {
    this.loadData();
  }

  loadData() {
    this.dataSource = new CustomStore({
      key: 'id',
      load: (loadOptions: any) => {
        const size = loadOptions.take || 10;
        const skip = loadOptions.skip || 0;
        const page = skip / size + 1;

        let search = '';

        if (loadOptions.searchValue) {
          search = loadOptions.searchValue;
        }

        if (loadOptions.filter) {
          const filter = loadOptions.filter;

          if (Array.isArray(filter)) {
            search = filter[0][2];
          }
        }

        return lastValueFrom(this.equipmentService.getAll(page, size, search)).then((res: any) => {
          return {
            data: res.data,
            totalCount: res.totalCount,
          };
        });
      },
    });
  }

  goToAdd() {
    this.router.navigate(['/admin/items/add']);
  }

  onEditClick(e: any) {
    this.router.navigate(['/admin/items/edit', e.row.data.id]);
  }

  onDeleteClick = (e: any) => {
    const itemToDelete = e.row.data; // ดึงข้อมูลแถวนั้นมา
    confirm(`ต้องการลบรายการ "${itemToDelete.name}" ใช่หรือไม่?`, 'ยืนยันการลบ').then((result) => {
      if (result) {
        this.equipmentService.delete(itemToDelete.id).subscribe({
          next: () => {
            notify('ลบข้อมูลสำเร็จ', 'success', 3000);
            this.loadData();
          },
          error: (err) => {
            console.error(err);
            notify('เกิดข้อผิดพลาดในการลบ', 'error', 3000);
          },
        });
      }
    });
  };

  getFullImageUrl(base64String: string): string {
    if (!base64String) {
      return 'assets/no-image.png';
    }
    return base64String;
  }
}
