// Based on the provided API documentation, here are the suggested features and updates
// for the Angular frontend to ensure compatibility and implement all functionalities.

// 1. Update Core TypeScript Interfaces
// The most critical step is to align the frontend interfaces with the API's data structures.
// Location: src/app/services/

// In `equipment.interface.ts`:
/*
export interface Equipment {
  id: string;
  code: string;
  name: string;
  categoryId: number;
  imageUrl?: string;
  status: number; // 1: Available, 2: Borrowed
  stock: number;
  isDeleted: boolean;
  createdAt: string;
}

export interface Category {
  id: number;
  name: string;
}
*/

// In `borrow.interface.ts`:
/*
export interface BorrowRequest {
  id: string;
  userId: string;
  startDate: string;
  endDate: string;
  requestDate: string;
  returnDate?: string;
  status: number; // 1: Pending, 2: Approved, 3: Rejected, 4: Returned
  approvedBy?: string;
  user?: User; // Assuming User interface is defined/imported
  items: BorrowRequestItem[];
}

export interface BorrowRequestItem {
  id: number;
  borrowRequestId: string;
  equipmentId: string;
  quantity: number;
  itemStatus: number;
  equipment?: Equipment; // Assuming Equipment interface is defined/imported
}
*/

// In `user.ts` or a new `user.interface.ts`:
/*
export interface User {
  id: string;
  employeeId: string;
  fullName: string;
  email: string;
  role: 'Admin' | 'Member';
  isActive: boolean;
  createdAt: string;
}
*/


// 2. Enhance Authentication Service (auth.ts) and Add Route Guards
// Location: src/app/services/auth.ts, src/app/app.routes.ts

// In `auth.ts`:
// - The `login` method must correctly handle the API response: `{ token, role, fullName }`.
// - Store not just the token, but also the `role` and `fullName` in localStorage or a state management service.
// - Create methods like `getUserRole(): 'Admin' | 'Member' | null` and `isAuthenticated(): boolean`.

// Create a new file for Route Guards (e.g., `src/app/auth.guard.ts`):
// - Implement a guard (`canActivate` function) that checks if a user is authenticated and has the 'Admin' role.
// - Apply this guard to all admin-only routes in `app.routes.ts`.
/* e.g., in app.routes.ts
{
  path: 'admin-dashboard',
  component: AdminDashboardComponent,
  canActivate: [adminGuard] // The new guard
},
*/


// 3. Update Equipment Service (equipment.ts)
// Location: src/app/services/equipment.ts

// - The `addEquipment` method needs to be refactored to use `FormData`.
/* e.g.,
addEquipment(equipmentData: CreateEquipmentDto, imageFile: File): Observable<any> {
  const formData = new FormData();
  formData.append('code', equipmentData.code);
  formData.append('name', equipmentData.name);
  formData.append('categoryId', equipmentData.categoryId.toString());
  formData.append('stock', equipmentData.stock.toString());
  formData.append('imageFile', imageFile);

  return this.http.post('/api/Equipments', formData);
}
*/
// - The `CreateEquipmentDto` interface should be created based on the API documentation.


// 4. Implement Borrow Request Logic (borrow.ts / cart.ts)
// Location: src/app/services/borrow.ts

// - Create a method to submit a borrow request. It should take cart items and dates,
//   then construct and POST the `BorrowRequestDto`.
/*
// DTO for the request
export interface BorrowRequestDto {
  startDate: string;
  endDate: string;
  items: {
    equipmentId: string;
    quantity: number;
  }[];
}

// Service method
submitBorrowRequest(requestData: BorrowRequestDto): Observable<any> {
  return this.http.post('/api/BorrowRequests', requestData);
}
*/
// - Implement methods for admins to manage requests: `approveRequest(id)`, `rejectRequest(id)`, `markAsReturned(id)`.
//   These will call `PUT /api/BorrowRequests/{id}/approve`, etc.


// 5. Create Helper Pipes for Data Display
// Create a new folder `src/app/pipes`

// - Create a `request-status.pipe.ts` to convert the status number to text.
//   (e.g., 1 -> 'Pending', 2 -> 'Approved', 3 -> 'Rejected', 4 -> 'Returned').
// - Create a `date-format.pipe.ts` to format the ISO date strings into a more readable format (e.g., 'dd/MM/yyyy').
// - Use these pipes in the HTML templates for `my-history`, `track-requests`, and `admin-manage-requests`.


// 6. General Improvements
// - **Error Handling**: All HTTP requests in services should have proper RxJS `catchError` handling to show user-friendly messages using a Toast/Snackbar service.
// - **Image Handling**: Components displaying equipment images must correctly bind the `imageUrl` property to an `<img>` tag's `src` attribute.
// - **Environment Variables**: The API base URL should be stored in the environment files (`src/environments/environment.ts`).
