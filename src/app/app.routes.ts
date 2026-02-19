import { Routes } from '@angular/router';
import { Login } from './pages/login/login';
import { Register } from './pages/register/register';
import { Cart } from './pages/cart/cart';
import { Equipments } from './pages/equipments/equipments'; // หน้าหน้าร้าน (User)
import { AddEquipment } from './pages/add-equipment/add-equipment';
import { MyHistory } from './pages/my-history/my-history';
import { AdminDashboard } from './pages/admin-dashboard/admin-dashboard';
import { AdminEquipmentList } from './pages/admin-equipment-list/admin-equipment-list';
import { AdminManageRequests } from './pages/admin-manage-requests/admin-manage-requests';
import { AdminReports } from './pages/admin-reports/admin-reports';
import { AdminUsers } from './pages/admin-users/admin-users';
import { AdminCategories } from './pages/admin-categories/admin-categories';
import { TrackRequests } from './pages/track-requests/track-requests';
import { adminGuard } from './auth.guard';


export const routes: Routes = [
  // --- 🏠 Public / Auth ---
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: Login },
  { path: 'register', component: Register },

  // --- 🛍️ User Zone ---
  { path: 'equipments', component: Equipments }, // หน้าร้าน
  { path: 'cart', component: Cart },
  { path: 'track-requests', component: TrackRequests }, // ตะกร้า
  { path: 'history', component: MyHistory }, // ประวัติ

  // --- 🛠️ Admin Zone ---
  { path: 'admin/dashboard', component: AdminDashboard, canActivate: [adminGuard] }, // 1. หน้ากราฟ
  { path: 'admin/requests', component: AdminManageRequests, data: { type: 'approve' }, canActivate: [adminGuard] }, // โหมดอนุมัติ
  { path: 'admin/return', component: AdminManageRequests, data: { type: 'return' }, canActivate: [adminGuard] },   // โหมดคืนของ
  { path: 'admin/reports', component: AdminReports, canActivate: [adminGuard] },
  { path: 'admin/users', component: AdminUsers, canActivate: [adminGuard] },
  { path: 'admin/items', component: AdminEquipmentList, canActivate: [adminGuard] },
  { path: 'admin/items/add', component: AddEquipment, canActivate: [adminGuard] },
  { path: 'admin/items/edit/:id', component: AddEquipment, canActivate: [adminGuard] },
  { path: 'admin/categories', component: AdminCategories, canActivate: [adminGuard] },
  { path: '**', redirectTo: 'login' },
];
