import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DxDataGridModule, DxButtonModule } from 'devextreme-angular';
import notify from 'devextreme/ui/notify';
import { UserService, User } from '../../services/user';
import { lastValueFrom } from 'rxjs';

@Component({
  selector: 'app-admin-users',
  standalone: true,
  imports: [CommonModule, DxDataGridModule, DxButtonModule],
  templateUrl: './admin-users.html',
  styleUrl: './admin-users.css',
})
export class AdminUsers implements OnInit {
  users: User[] = [];
  roles = ['User', 'Admin']; // ตัวเลือก Role

  constructor(private userService: UserService) {}

  ngOnInit() {
    this.loadData();
  }

  loadData() {
    this.userService.getAll().subscribe({
      next: (data) => (this.users = data),
      error: (err) => notify('Load users failed', 'error', 2000),
    });
  }

  // 🔥 Event: เมื่อมีการเพิ่มข้อมูลใหม่ (Insert)
  async onRowInserting(e: any) {
    // e.data คือข้อมูลที่ User กรอกมา
    try {
      await lastValueFrom(this.userService.create(e.data));
      notify('User created successfully', 'success', 2000);
    } catch (err) {
      notify('Create failed', 'error', 2000);
      e.cancel = true; // ยกเลิกการปิด Popup ถ้า Error
    }
  }

  // 🔥 Event: เมื่อมีการแก้ไข (Update)
  async onRowUpdating(e: any) {
    // e.newData = ค่าใหม่, e.oldData = ค่าเก่า, e.key = ID
    const updatedData = { ...e.oldData, ...e.newData };
    try {
      await lastValueFrom(this.userService.update(e.key, updatedData));
      notify('User updated successfully', 'success', 2000);
    } catch (err) {
      notify('Update failed', 'error', 2000);
      e.cancel = true;
    }
  }

  // 🔥 Event: เมื่อมีการลบ (Delete)
  async onRowRemoving(e: any) {
    try {
      await lastValueFrom(this.userService.delete(e.key));
      notify('User deleted', 'success', 2000);
    } catch (err) {
      notify('Delete failed', 'error', 2000);
      e.cancel = true;
    }
  }
}
