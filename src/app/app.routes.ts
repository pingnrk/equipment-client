import { Routes } from '@angular/router';
import { Login } from './pages/login/login';
import { Register } from './pages/register/register';
import { Cart } from './pages/cart/cart';
import { Equipments } from './pages/equipments/equipments'; // หน้าหน้าร้าน (User)
import { AddEquipment } from './pages/add-equipment/add-equipment';
import { MyHistory } from './pages/my-history/my-history';
import { AdminDashboard } from './pages/admin-dashboard/admin-dashboard';
import { AdminEquipmentList } from './pages/admin-equipment-list/admin-equipment-list';

export const routes: Routes = [
  // --- 🏠 Public / Auth ---
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: Login },
  { path: 'register', component: Register },

  // --- 🛍️ User Zone ---
  { path: 'equipments', component: Equipments },  // หน้าร้าน
  { path: 'cart', component: Cart },              // ตะกร้า
  { path: 'history', component: MyHistory },      // ประวัติ

  // --- 🛠️ Admin Zone ---
  { path: 'admin/dashboard', component: AdminDashboard }, // หน้า Approve
  
  // หน้ารายการของสำหรับ Admin (ต้องแยกจาก User)
  { path: 'admin/items', component: AdminEquipmentList }, 
  
  // หน้าเพิ่ม/แก้ไข (ใช้ component เดิมได้ แต่เปลี่ยน path)
  { path: 'admin/items/add', component: AddEquipment },     
  { path: 'admin/items/edit/:id', component: AddEquipment },


  { path: '**', redirectTo: 'login' }
];