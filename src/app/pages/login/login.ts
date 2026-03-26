import { Component } from '@angular/core';
import { AuthService } from '../../services/auth';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import notify from 'devextreme/ui/notify';
import { DxFormModule, DxButtonModule, DxLoadIndicatorModule } from 'devextreme-angular';
import { finalize, Observable } from 'rxjs';
import { LoadingService } from '../../services/loading.service';

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
  isLoading: Observable<boolean>;

  constructor(
    private authService: AuthService,
    private router: Router,
    private loadingService: LoadingService,
  ) {
    this.isLoading = this.loadingService.isLoading;
  }

  onSubmit(e: any) {
    e.preventDefault();
    this.loadingService.show();
    this.authService
      .login(this.formData)
      .pipe(finalize(() => this.loadingService.hide()))
      .subscribe({
        next: () => {
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
          console.error(err);
          notify('Login failed: Invalid email or password', 'error', 3000);
        },
      });
  }

  goToRegister() {
    this.router.navigate(['/register']);
  }
}
