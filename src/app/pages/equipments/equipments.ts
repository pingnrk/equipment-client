import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { DxDataGridModule } from 'devextreme-angular';
import { Equipment, EquipmentService } from '../../services/equipment';

@Component({
  selector: 'app-equipments',
  imports: [CommonModule, DxDataGridModule],
  templateUrl: './equipments.html',
  styleUrl: './equipments.css',
})
export class Equipments implements OnInit {
  equipments: Equipment[] = [];

  constructor(private equipmentService: EquipmentService) {}

  ngOnInit(): void {
    this.loadData();
  }

  loadData() {
    this.equipmentService.getAll().subscribe({
      next: (data) => {
        this.equipments = data;
      },
      error: (err) => console.error('Error fetching data:', err),
    });
  }

  getFullImageUrl(relativePath: string): string {
    return this.equipmentService.getImageUrl(relativePath);
  }
}
