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
    email: '',
    password: '',
  };
  isLoading = false;

  constructor(private authService: AuthService, private router: Router) {}

  onSubmit(e: any) {
    e.preventDefault(); // กันหน้าเว็บ Refresh
    this.isLoading = true;

    this.authService.login(this.formData).subscribe({
      next: () => {
        this.isLoading = false;
        notify('Login Success!', 'success', 2000); // แจ้งเตือนสีเขียว
        this.router.navigate(['/equipments']); // เด้งไปหน้าเลือกของ
      },
      error: (err) => {
        this.isLoading = false;
        console.error(err);
        notify('Login failed: Invalid email or password', 'error', 3000); // แจ้งเตือนสีแดง
      },
    });
  }
}
