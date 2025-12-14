export interface BorrowRequest {
  id: string;
  userId: string;
  user: User; // User ที่ยืม
  requestDate: string; // วันที่กดขอ (ส่งมาจาก C# เป็น String ISO)
  startDate: string; // วันเริ่มยืม
  endDate: string; // วันคืน
  status: number; // 1=Pending, 2=Approved, 3=Rejected, 4=Returned
  items: BorrowRequestItem[];
}

export interface User {
  id: string;
  userName: string;
  email: string;
}

export interface BorrowRequestItem {
  id: string;
  equipmentId: string;
  quantity: number;
  equipment: Equipment;
}

export interface Equipment {
  id: string;
  name: string;
  code: string;
  imageUrl: string;
  stock: number;
}
