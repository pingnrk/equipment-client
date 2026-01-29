import { Component } from '@angular/core';
import { AuthService } from '../../services/auth';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import notify from 'devextreme/ui/notify';
import { DxFormModule, DxButtonModule, DxLoadIndicatorModule } from 'devextreme-angular';

@Component({
  selector: 'app-login',
  imports: [CommonModule, DxFormModule, DxButtonModule, DxLoadIndicatorModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  formData = {
    employeeId: '',
    password: '',
  };
  isLoading = false;

  constructor(
    private authService: AuthService,
    private router: Router,
  ) {}

  onSubmit(e: any) {
    e.preventDefault();
    this.isLoading = true;

    this.authService.login(this.formData).subscribe({
      next: () => {
        this.isLoading = false;

        // ✅ เช็ค Role ก่อนดีด
        if (
          this.authService.currentUserRole === 'Admin' ||
          localStorage.getItem('role') === 'Admin'
        ) {
          this.router.navigate(['/admin/dashboard']); // Admin ไปหลังบ้าน
        } else {
          this.router.navigate(['/equipments']); // User ไปหน้าร้าน
        }
      },
      error: (err) => {
        this.isLoading = false;
        console.error(err);
        notify('Login failed: Invalid email or password', 'error', 3000);
      },
    });
  }

  goToRegister() {
    this.router.navigate(['/register']);
  }
}
