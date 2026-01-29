import { Routes } from '@angular/router';
import { Login } from './pages/login/login';
import { Register } from './pages/register/register';
import { Cart } from './pages/cart/cart';
import { Equipments } from './pages/equipments/equipments';
import { AddEquipment } from './pages/add-equipment/add-equipment'; // ⚠️ อย่าลืม Import อันนี้
import { MyHistory } from './pages/my-history/my-history';
import { AdminDashboard } from './pages/admin-dashboard/admin-dashboard';

export const routes: Routes = [
  // ถ้าเข้า path ว่างๆ ให้ดีดไป equipments
  { path: '', redirectTo: 'equipments', pathMatch: 'full' },

  { path: 'login', component: Login },
  { path: 'register', component: Register },
  { path: 'cart', component: Cart },
  { path: 'history', component: MyHistory },
  { path: 'admin', component: AdminDashboard },

  // 👇👇👇 จุดสำคัญที่ต้องแก้ครับ 👇👇👇
  { path: 'equipments', component: Equipments },           // หน้ารายการ
  { path: 'equipments/add', component: AddEquipment },     // หน้าเพิ่ม
  { path: 'equipments/edit/:id', component: AddEquipment }, // หน้าแก้ไข
  // 👆👆👆 แก้ให้ตรงกับ TS ที่เขียนมา 👆👆👆
];