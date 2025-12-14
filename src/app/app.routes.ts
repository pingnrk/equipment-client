import { Routes } from '@angular/router';
import { Login } from './pages/login/login';
import { Equipments } from './pages/equipments/equipments';
import { AdminDashboard } from './pages/admin-dashboard/admin-dashboard';

export const routes: Routes = [
  { path: 'login', component: Login },
  { path: 'equipments', component: Equipments },
  { path: 'admin', component: AdminDashboard },

  { path: '', redirectTo: 'equipments', pathMatch: 'full' },
];
