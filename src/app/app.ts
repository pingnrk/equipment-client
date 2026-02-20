import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
  NavigationCancel,
  NavigationEnd,
  NavigationError,
  NavigationStart,
  Router,
  RouterModule,
} from '@angular/router';
import {
  DxButtonModule,
  DxDrawerModule,
  DxListModule,
  DxLoadPanelModule,
  DxToastModule,
  DxToolbarModule,
} from 'devextreme-angular';
import { AuthService } from './services/auth';
import { LoadingService } from './services/loading.service';
import { ToastService } from './services/toast.service';
import { confirm } from 'devextreme/ui/dialog';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    DxDrawerModule,
    DxListModule,
    DxToolbarModule,
    DxButtonModule,
    DxLoadPanelModule,
    DxToastModule,
  ],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App implements OnInit {
  title = 'Equipment System';
  isDrawerOpen = true;
  selectedKeys: string[] = [];
  isLoading = false;

  toastVisible = false;
  toastMessage = '';
  toastType: any = 'info';

  isLoggedIn = false;
  userName: string | null = '';
  isAdmin = false;

  // ✅ เพิ่มตัวแปรนี้เข้ามาเพื่อเช็คว่าเป็นหน้า Login/Register หรือไม่
  isPublicRoute = false;

  menuItems: any[] = [];

  private allMenuItems = [
    //user
    { text: 'Browse Equipments', icon: 'find', path: '/equipments', role: 'User' },
    { text: 'My Cart', icon: 'cart', path: '/cart', role: 'User' },
    { text: 'My History', icon: 'clock', path: '/history', role: 'User' },
    { text: 'Track Requests', icon: 'folder', path: '/track-requests', role: 'User' },

    //admin
    { text: 'Approve Requests', icon: 'check', path: '/admin/requests', role: 'Admin' },
    { text: 'Return Equipment', icon: 'revert', path: '/admin/return', role: 'Admin' },
    { text: 'Manage Inventory', icon: 'box', path: '/admin/items', role: 'Admin' },
    { text: 'Users', icon: 'group', path: '/admin/users', role: 'Admin' },
    { text: 'Categories', icon: 'tags', path: '/admin/categories', role: 'Admin' },
    { text: 'Dashboard', icon: 'chart', path: '/admin/dashboard', role: 'Admin' },
    { text: 'Reports', icon: 'xlsxfile', path: '/admin/reports', role: 'Admin' },
  ];

  constructor(
    private router: Router,
    public authService: AuthService,
    public loadingService: LoadingService,
    public toastService: ToastService,
  ) {
    this.loadingService.isLoading.subscribe((loading) => {
      this.isLoading = loading;
    });

    this.toastService.isVisible.subscribe((v) => (this.toastVisible = v));
    this.toastService.message.subscribe((m) => (this.toastMessage = m));
    this.toastService.type.subscribe((t) => (this.toastType = t));

    this.router.events.subscribe((event) => {
      if (event instanceof NavigationStart) {
        this.loadingService.show();
      }

      if (
        event instanceof NavigationEnd ||
        event instanceof NavigationCancel ||
        event instanceof NavigationError
      ) {
        this.loadingService.hide();
      }

      if (event instanceof NavigationEnd) {
        const currentUrl = event.urlAfterRedirects ? event.urlAfterRedirects.split('?')[0] : '';
        const publicRoutes = ['/login', '/register'];

        // ✅ อัปเดตสถานะ ว่าตอนนี้อยู่หน้า Public หรือไม่
        this.isPublicRoute = publicRoutes.includes(currentUrl);

        if (event.urlAfterRedirects) {
          this.selectedKeys = [currentUrl];

          const token = localStorage.getItem('token');
          if (!token && !this.isPublicRoute) {
            this.router.navigate(['/login']);
          }
        }

        if (this.isPublicRoute) {
          this.isDrawerOpen = false;
        } else if (window.innerWidth < 700) {
          this.isDrawerOpen = false;
        } else {
          this.isDrawerOpen = true;
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
      if (!this.isLoggedIn) {
        return (item as any).public;
      }
      if (this.isAdmin) {
        return item.role === 'Admin';
      }
      return item.role === 'User' || (item as any).public;
    });
  }

  async logout() {
    const result = await confirm('คุณต้องการออกจากระบบหรือไม่?', 'ยืนยันการออกจากระบบ');
    if (!result) {
      return;
    }
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  goToLogin() {
    this.router.navigate(['/login']);
  }

  toggleDrawer() {
    this.isDrawerOpen = !this.isDrawerOpen;
  }

  onItemClick(item: any) {}

  capitalize(s: string) {
    return s.charAt(0).toUpperCase() + s.slice(1);
  }

  onToastHidden() {
    this.toastService.hide();
  }
}
