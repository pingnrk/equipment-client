import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = 'https://localhost:7273/api/auth';

  public isLoggedIn$ = new BehaviorSubject<boolean>(this.hasToken());
  public currentUserRole = localStorage.getItem('role');

  constructor(private http: HttpClient, private router: Router) {}

  login(credentials: any) {
    return this.http.post<any>(`${this.apiUrl}/login`, credentials).pipe(
      tap((response) => {
        // เมื่อ Login สำเร็จ ให้เก็บข้อมูลลงเครื่อง
        localStorage.setItem('token', response.token);
        localStorage.setItem('role', response.role);

        this.currentUserRole = response.role;
        this.isLoggedIn$.next(true); // แจ้งเตือนทั้งแอพว่า Login แล้ว
      })
    );
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    this.isLoggedIn$.next(false);
    this.router.navigate(['/login']);
  }

  getToken() {
    return localStorage.getItem('token');
  }

  private hasToken(): boolean {
    return !!localStorage.getItem('token');
  }
}
