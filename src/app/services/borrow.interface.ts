import { Equipment } from './equipment.interface';
import { User } from './user.interface';

export interface BorrowRequest {
  id: string; // GUID
  userId: string; // GUID
  startDate: string; // ISO 8601 Date string
  endDate: string; // ISO 8601 Date string
  requestDate: string; // ISO 8601 Date string
  returnDate?: string; // ISO 8601 Date string
  status: number; // 1: Pending, 2: Approved, 3: Rejected, 4: Returned
  approvedBy?: string; // GUID of Admin
  user?: User;
  items: BorrowRequestItem[];
}

export interface BorrowRequestItem {
  id: number;
  borrowRequestId: string; // GUID
  equipmentId: string; // GUID
    quantity: number;
    itemStatus: number;
    equipment?: Equipment;
  }
  
  // POST /api/BorrowRequests
  export interface BorrowRequestDto {
    startDate: string; // ISO 8601 Date string
    endDate: string; // ISO 8601 Date string
    items: {
      equipmentId: string; // GUID
      quantity: number;
    }[];
  }
  