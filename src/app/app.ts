import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
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
export class App {
  title = 'Equipment System';
  isDrawerOpen = false;
  selectedKeys: string[] = [];
  isLoggedIn = false;

  menuItems = [
    { text: 'Browse Equipments', icon: 'find', path: '/equipments' },
    { text: 'My Cart', icon: 'cart', path: '/cart' }, // เดี๋ยวค่อยสร้าง
    { text: 'My History', icon: 'clock', path: '/history' }, // เดี๋ยวค่อยสร้าง
    { text: 'Admin Dashboard', icon: 'chart', path: '/admin' },
  ];

  /**
   *
   */
  constructor(private router: Router, private authService: AuthService) {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.selectedKeys = [event.urlAfterRedirects.split('?')[0]];
      }
    });

    this.authService.isLoggedIn$.subscribe((status) => {
      this.isLoggedIn = status;
    });
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
      if (window.innerWidth < 700) this.isDrawerOpen = false;
    }
  }
}
