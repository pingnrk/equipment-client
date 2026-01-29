import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { DxButtonModule, DxDrawerModule, DxListModule, DxToolbarModule } from 'devextreme-angular';
import { AuthService } from './services/auth';

@Component({
  selector: 'app-root',
  imports: [
    CommonModule,
    RouterOutlet,
    DxDrawerModule,
    DxListModule,
    DxToolbarModule,
    DxButtonModule,
  ],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App implements OnInit {
  title = 'Equipment System';
  isDrawerOpen = true;
  selectedKeys: string[] = [];

  isLoggedIn = false;
  userName: string | null = '';
  isAdmin = false;

  menuItems: any[] = [];

  private allMenuItems = [
    // 👤 เมนู User (ใส่ role: 'User' กำกับไว้เลย)
    { text: 'Browse Equipments', icon: 'find', path: '/equipments', public: true },
    { text: 'My Cart', icon: 'cart', path: '/cart', role: 'User' },
    { text: 'My History', icon: 'clock', path: '/history', role: 'User' },

    { text: 'Approve Requests', icon: 'check', path: '/admin/requests', role: 'Admin' },
    { text: 'Manage Inventory', icon: 'box', path: '/admin/items', role: 'Admin' },
    { text: 'Users', icon: 'group', path: '/admin/users', role: 'Admin' },

    { text: 'Dashboard', icon: 'chart', path: '/admin/dashboard', role: 'Admin' },
    { text: 'Reports', icon: 'xlsxfile', path: '/admin/reports', role: 'Admin' },
  ];

  constructor(
    private router: Router,
    public authService: AuthService,
  ) {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.selectedKeys = [event.urlAfterRedirects.split('?')[0]];
        if (window.innerWidth < 700) {
          this.isDrawerOpen = false;
        }
      }
    });

    this.authService.isLoggedIn$.subscribe((status) => {
      this.isLoggedIn = status;
      this.updateUserState();
      this.updateMenu();
    });
  }

  ngOnInit() {
    this.updateUserState();
    this.updateMenu();
  }

  updateUserState() {
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role');
    const name = localStorage.getItem('fullName') || localStorage.getItem('username');

    this.isLoggedIn = !!token;
    this.isAdmin = role === 'Admin';
    this.userName = name;
  }

  updateMenu() {
    this.menuItems = this.allMenuItems.filter((item) => {
      // 🟢 Case 1: คนนอก (ยังไม่ Login)
      if (!this.isLoggedIn) {
        // ให้เห็นเฉพาะเมนูที่เป็น public เท่านั้น
        return (item as any).public;
      }

      // 🔴 Case 2: เป็น Admin (จุดที่แก้!)
      if (this.isAdmin) {
        // ให้เห็น "เฉพาะ" เมนูที่มี role = 'Admin' เท่านั้น (ตัด public ทิ้งไปเลย)
        return item.role === 'Admin';
      }

      // 🔵 Case 3: เป็น User ทั่วไป
      // ให้เห็นเมนู User + เมนู public (เพราะ User ต้องเข้าไปดูของเพื่อยืม)
      return item.role === 'User' || (item as any).public;
    });

    // ปุ่ม Login (ถ้ายังไม่เข้าสู่ระบบ ให้โชว์ปุ่ม Login)
    if (!this.isLoggedIn) {
      this.menuItems.push({ text: 'Login', icon: 'key', path: '/login' });
    }
  }

  logout() {
    this.authService.logout();
  }

  goToLogin() {
    this.router.navigate(['/login']);
  }

  toggleDrawer() {
    this.isDrawerOpen = !this.isDrawerOpen;
  }

  onItemClick(e: any) {
    const path = e.itemData.path;
    if (path) {
      this.router.navigate([path]);
    }
  }
}
