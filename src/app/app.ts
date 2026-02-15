import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { NavigationEnd, Router, RouterModule } from '@angular/router'; // ✅ 1. เพิ่ม RouterModule ตรงนี้
import { DxButtonModule, DxDrawerModule, DxListModule, DxToolbarModule } from 'devextreme-angular';
import { AuthService } from './services/auth';

@Component({
  selector: 'app-root',
  standalone: true, // ปกติ Standalone จะมีบรรทัดนี้ (ถ้าไม่มีก็ไม่เป็นไรถ้ามันทำงานได้)
  imports: [
    CommonModule,
    RouterModule, // ✅ 2. เอา RouterModule มาใส่ตรงนี้! (สำคัญมาก ไม่งั้น routerLink แดง)
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
    //user
    { text: 'Browse Equipments', icon: 'find', path: '/equipments', role: 'User' },
    { text: 'My Cart', icon: 'cart', path: '/cart', role: 'User' },
    { text: 'My History', icon: 'clock', path: '/history', role: 'User' },
    { text: 'Track Requests', icon: 'folder', path: '/track-requests', role: 'User' },

    //admin
    { text: 'Approve Requests', icon: 'check', path: '/admin/requests', role: 'Admin' },
    { text: 'Manage Inventory', icon: 'box', path: '/admin/items', role: 'Admin' },
    { text: 'Users', icon: 'group', path: '/admin/users', role: 'Admin' },
    { text: 'Categories', icon: 'tags', path: '/admin/categories', role: 'Admin' },
    { text: 'Dashboard', icon: 'chart', path: '/admin/dashboard', role: 'Admin' },
    { text: 'Reports', icon: 'xlsxfile', path: '/admin/reports', role: 'Admin' },
  ];

  constructor(
    private router: Router,
    public authService: AuthService,
  ) {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        // เช็คว่า url มีค่าไหมก่อน split เพื่อกัน error
        if (event.urlAfterRedirects) {
            const currentUrl = event.urlAfterRedirects.split('?')[0];
            this.selectedKeys = [currentUrl];

            // 🔒 Security Check: ถ้ายังไม่ Login และไม่ได้อยู่หน้า Login/Register ให้ดีดไป Login
            const token = localStorage.getItem('token');
            const publicRoutes = ['/login', '/register'];
            if (!token && !publicRoutes.includes(currentUrl)) {
                this.router.navigate(['/login']);
            }
        }

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
        return (item as any).public;
      }

      // 🔴 Case 2: เป็น Admin
      if (this.isAdmin) {
        return item.role === 'Admin';
      }

      // 🔵 Case 3: เป็น User ทั่วไป
      return item.role === 'User' || (item as any).public;
    });

    // ปุ่ม Login ลบออกได้เลย เพราะเราเอาไปใส่ใน Navbar ขวาบนแยกแล้วตาม HTML ใหม่
    // แต่ถ้าอยากเก็บไว้ในลิสต์ด้วยก็ไม่เป็นไร
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']); // เพิ่มให้ดีดไปหน้า login หลัง logout
  }

  goToLogin() {
    this.router.navigate(['/login']);
  }

  toggleDrawer() {
    this.isDrawerOpen = !this.isDrawerOpen;
  }

  // ✅ แก้ฟังก์ชันนี้ให้รองรับ HTML แบบใหม่ (Bootstrap List)
  onItemClick(item: any) {
    // 1. อัปเดต Title หัวเว็บ
    this.title = item.text;




    // 3. ไม่ต้องสั่ง navigate() แล้ว เพราะใน HTML เราใช้ [routerLink]="item.path" มันไปเองอัตโนมัติ
  }
}
