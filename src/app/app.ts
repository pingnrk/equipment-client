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
    { text: 'Browse Equipments', icon: 'find', path: '/equipments', public: true }, 
    
    { text: 'My Cart', icon: 'cart', path: '/cart' },
    { text: 'My History', icon: 'clock', path: '/history' },
    
    { text: 'Admin Dashboard', icon: 'chart', path: '/admin', requireAdmin: true }, 
  ];

  constructor(private router: Router, public authService: AuthService) {
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
    this.menuItems = this.allMenuItems.filter(item => {
      
      if (item.public) {
        return true;
      }

      if (!this.isLoggedIn) {
        return false;
      }

      if (item.requireAdmin && !this.isAdmin) {
        return false;
      }

      return true;
    });

    if (!this.isLoggedIn) {
         this.menuItems.push({ text: 'Login / Register', icon: 'key', path: '/login' });
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