import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, tap } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = `${environment.apiUrl}/auth`;

  public isLoggedIn$ = new BehaviorSubject<boolean>(this.hasToken());
  public currentUserRole = localStorage.getItem('role');
  public currentUserName = localStorage.getItem('fullName');

  constructor(private http: HttpClient, private router: Router) {}

  login(credentials: any) {
    return this.http.post<any>(`${this.apiUrl}/login`, credentials).pipe(
      tap((response) => {
        // เมื่อ Login สำเร็จ ให้เก็บข้อมูลลงเครื่อง
        localStorage.setItem('token', response.token);
        localStorage.setItem('role', response.role);
        localStorage.setItem('fullName', response.fullName);
        this.currentUserRole = response.role;
        this.currentUserName = response.fullName;
        this.isLoggedIn$.next(true); // แจ้งเตือนทั้งแอพว่า Login แล้ว
      })
    );
  }

  register(userData: any) {
    return this.http.post(`${this.apiUrl}/register`, userData);
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    localStorage.removeItem('fullName');
    this.currentUserName = null;
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
