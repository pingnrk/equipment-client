import { Routes } from '@angular/router';
import { Login } from './pages/login/login';
import { Equipments } from './pages/equipments/equipments';
import { AdminDashboard } from './pages/admin-dashboard/admin-dashboard';
import { Register } from './pages/register/register';
import { Cart } from './pages/cart/cart';
import { AddEquipment } from './pages/add-equipment/add-equipment';
import { MyHistory } from './pages/my-history/my-history';

export const routes: Routes = [
  { path: 'login', component: Login },
  { path: 'equipments', component: Equipments },
  { path: 'admin', component: AdminDashboard },
  { path: 'register', component: Register },
  { path: 'cart', component: Cart },
  { path: 'add-equipment', component: AddEquipment },
  { path: 'history', component: MyHistory },

  { path: '', redirectTo: 'equipments', pathMatch: 'full' },
];
