import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DxDataGridModule, DxButtonModule } from 'devextreme-angular';
import notify from 'devextreme/ui/notify';
import { UserService } from '../../services/user';
import { finalize, lastValueFrom, Observable } from 'rxjs';
import { User } from '../../services/user.interface';
import { LoadingService } from '../../services/loading.service';

@Component({
  selector: 'app-admin-users',
  standalone: true,
  imports: [CommonModule, DxDataGridModule, DxButtonModule],
  templateUrl: './admin-users.html',
  styleUrl: './admin-users.css',
})
export class AdminUsers implements OnInit {
  users: User[] = [];
  roles = ['Admin', 'Member'];
  isLoading: Observable<boolean>;

  constructor(
    private userService: UserService,
    private loadingService: LoadingService,
  ) {
    this.isLoading = this.loadingService.isLoading;
  }

  ngOnInit() {
    this.loadData();
  }

  loadData() {
    this.loadingService.show();
    this.userService
      .getAll()
      .pipe(finalize(() => this.loadingService.hide()))
      .subscribe({
        next: (data) => {
          this.users = data.map((u: any) => ({
            ...u,
            role: this.roles.find((r) => r.toLowerCase() === u.role?.toLowerCase()) || u.role,
          }));
        },
        error: (err) => notify('Load users failed', 'error', 2000),
      });
  }


  async onRowInserting(e: any) {
    if (!e.data.password) {
      notify('กรุณากรอกรหัสผ่าน', 'error', 2000);
      e.cancel = true;
      return;
    }

    try {
      await lastValueFrom(this.userService.create(e.data));
      notify('เพิ่มผู้ใช้งานสำเร็จ', 'success', 2000);
    } catch (err) {
      notify('เพิ่มข้อมูลล้มเหลว', 'error', 2000);
      e.cancel = true;
    }
  }

  async onRowUpdating(e: any) {
    const updatedData = { ...e.oldData, ...e.newData };

    if (!e.newData.password) delete updatedData.password;

    try {
      await lastValueFrom(this.userService.update(e.key, updatedData));
      notify('แก้ไขข้อมูลสำเร็จ', 'success', 2000);
    } catch (err) {
      notify('แก้ไขล้มเหลว', 'error', 2000);
      e.cancel = true;
    }
  }


  async onRowRemoving(e: any) {
    try {
      await lastValueFrom(this.userService.delete(e.key));
      notify('ลบข้อมูลสำเร็จ', 'success', 2000);
    } catch (err) {
      notify('ลบข้อมูลล้มเหลว', 'error', 2000);
      e.cancel = true;
    }
  }
}
