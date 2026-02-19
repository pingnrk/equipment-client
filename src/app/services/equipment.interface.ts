export interface Equipment {
  id: string; // GUID
  code: string;
  name: string;
  categoryId: number;
  imageUrl?: string; // Note: Can be a base64 data URL or a path like /images/filename.jpg
  status: number; // 1: Available, 2: Borrowed
  stock: number;
  isDeleted: boolean;
  createdAt: string; // ISO 8601 Date string
}

export interface Category {
  id: number;
    name: string;
  }

  // POST /api/Equipments
// Use FormData for this request
export interface CreateEquipmentDto {
  code: string;
  name: string;
  categoryId: number;
  stock: number;
  imageFile?: File;
}

