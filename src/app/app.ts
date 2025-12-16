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
  
  // State ของ User
  isLoggedIn = false;
  userName: string | null = '';
  isAdmin = false;

  // เมนูที่แสดงผลจริง (จะถูกกรองตามสิทธิ์)
  menuItems: any[] = [];

  // เมนูทั้งหมดที่มีในระบบ
  private allMenuItems = [
    { text: 'Browse Equipments', icon: 'find', path: '/equipments' },
    { text: 'My Cart', icon: 'cart', path: '/cart' },
    { text: 'My History', icon: 'clock', path: '/history' },
    // อันนี้ใส่ flag พิเศษไว้เช็ค
    { text: 'Admin Dashboard', icon: 'chart', path: '/admin', requireAdmin: true }, 
  ];

  constructor(private router: Router, public authService: AuthService) {
    // 1. จัดการเรื่อง Active Menu (Highlight สี)
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.selectedKeys = [event.urlAfterRedirects.split('?')[0]];
        
        // ถ้าจอมือถือ ให้หุบ Drawer เมื่อเปลี่ยนหน้า
        if (window.innerWidth < 700) {
          this.isDrawerOpen = false;
        }
      }
    });

    // 2. Subscribe สถานะ Login (Reactive)
    this.authService.isLoggedIn$.subscribe((status) => {
      this.isLoggedIn = status;
      this.updateUserState(); // อัปเดตข้อมูล User และ Role
      this.updateMenu();      // อัปเดตเมนูตาม Role ใหม่
    });
  }

  ngOnInit() {
    // เรียกครั้งแรกเผื่อ Refresh หน้าจอ
    this.updateUserState();
    this.updateMenu();
  }

  // ฟังก์ชันดึงข้อมูล User และ Role จาก LocalStorage
  updateUserState() {
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role');
    const name = localStorage.getItem('fullName') || localStorage.getItem('username'); // แล้วแต่ว่าตอน Login เก็บชื่อ key ว่าอะไร

    this.isLoggedIn = !!token;
    this.isAdmin = role === 'Admin';
    this.userName = name;
  }

  // ฟังก์ชันกรองเมนู
  updateMenu() {
    if (!this.isLoggedIn) {
      this.menuItems = []; // ถ้ายังไม่ Login ไม่โชว์เมนู (หรือจะโชว์แค่ Equipments ก็ได้แล้วแต่ design)
      return;
    }

    this.menuItems = this.allMenuItems.filter(item => {
      // ถ้าเมนูต้องการ Admin แต่คนนี้ไม่ใช่ Admin -> ไม่เอา
      if (item.requireAdmin && !this.isAdmin) {
        return false;
      }
      return true;
    });
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
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