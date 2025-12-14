import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { DxFormModule, DxButtonModule } from 'devextreme-angular';
import notify from 'devextreme/ui/notify';
import { AuthService } from '../../services/auth';

@Component({
  selector: 'app-register',
  imports: [CommonModule, DxFormModule, DxButtonModule],
  templateUrl: './register.html',
  styleUrl: './register.css',
})
export class Register {
  formData = {
    employeeId: '',
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
  };
  isLoading = false;

  constructor(private authService: AuthService, private router: Router) {}

  passwordComparison = () => {
    return this.formData.password;
  };

  onSubmit(e: any) {
    e.preventDefault();
    this.isLoading = true;
    const { confirmPassword, ...dataToSend } = this.formData;

    this.authService.register(dataToSend).subscribe({
      next: (res) => {
        this.isLoading = false;
        notify('Registration successful! Please login.', 'success', 3000);
        this.router.navigate(['/login']); // สมัครเสร็จเด้งไปหน้า Login
      },
      error: (err) => {
        this.isLoading = false;
        console.error(err);
        // แสดง Error ที่ Backend ส่งมา (เช่น Employee ID ซ้ำ)
        const errorMsg = err.error || 'Registration failed.';
        notify(errorMsg, 'error', 3000);
      },
    });
  }

  goToLogin() {
    this.router.navigate(['/login']);
  }
}
