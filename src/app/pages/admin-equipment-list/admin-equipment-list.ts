import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { DxDataGridModule, DxButtonModule } from 'devextreme-angular';
import notify from 'devextreme/ui/notify';
import { EquipmentService } from '../../services/equipment';

@Component({
  selector: 'app-admin-equipment-list',
  standalone: true,
  imports: [CommonModule, DxDataGridModule, DxButtonModule],
  templateUrl: './admin-equipment-list.html',
  styleUrl: './admin-equipment-list.css',
})
export class AdminEquipmentList implements OnInit {
  equipments: any[] = [];

  constructor(private service: EquipmentService, private equipmentService: EquipmentService, private router: Router) {
    this.onEditClick = this.onEditClick.bind(this);
    this.onDeleteClick = this.onDeleteClick.bind(this);
  }

  ngOnInit() { this.loadData(); }

  loadData() {
    this.service.getAll().subscribe(data => this.equipments = data);
  }

  goToAdd() {
    this.router.navigate(['/admin/items/add']); // ไปหน้า Add
  }

  onEditClick(e: any) {
    this.router.navigate(['/admin/items/edit', e.row.data.id]); // ไปหน้า Edit
  }

  onDeleteClick(e: any) {
    if(confirm('Delete this item?')) {
        this.service.delete(e.row.data.id).subscribe(() => {
            notify('Deleted', 'success');
            this.loadData();
        });
    }
  }
    getFullImageUrl(relativePath: string): string {
    return this.equipmentService.getImageUrl(relativePath);
  }
}