export interface User {
  id: string;
  employeeId: string;
  fullName: string;
  email: string;
  role: 'Admin' | 'Member';
  isActive: boolean;
  createdAt: string;
}
