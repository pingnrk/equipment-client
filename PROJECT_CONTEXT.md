### 1. Project Overview
- โปรเจกต์นี้คือระบบจัดการอุปกรณ์สำหรับเช่า/ยืม (Equipment Management System) ที่ทำงานบนเว็บ
- แก้ปัญหาการจัดการอุปกรณ์, การยืม-คืน, และการติดตามสถานะของอุปกรณ์
- ผู้ใช้งานหลักคือผู้ดูแลระบบ (Admin) และผู้ใช้งานทั่วไป (User) ที่ต้องการยืมอุปกรณ์
- ประเภทโปรเจกต์: Web Application (Single Page Application)

### 2. Tech Stack
- ภาษา: TypeScript, HTML, CSS
- Framework / Library หลัก: Angular, devxextreme
- Database: neon postgresd
- Tool / Service ภายนอก: Not explicitly found in the project, but likely uses a RESTful API for backend communication.

### 3. Project Structure
- `/src`: โฟลเดอร์หลักของ Source Code Angular application
- `/src/app`: ประกอบด้วย Application-level components, services, และ routing
  - `/src/app/pages`: เก็บ Component สำหรับแต่ละหน้า (Page) ของเว็บแอปพลิเคชัน เช่น login, register, equipment list, admin dashboard, cart, my history, add equipment
  - `/src/app/services`: เก็บ Angular Services สำหรับจัดการ Business Logic และการติดต่อกับ API เช่น `auth.ts`, `borrow.ts`, `cart.ts`, `categories.ts`, `equipment.ts`
  - `/src/app/app.ts`: Root component ของแอปพลิเคชัน
  - `/src/app/app.routes.ts`: กำหนด Routing สำหรับหน้าต่างๆ ในแอปพลิเคชัน
  - `/src/app/auth.interceptor.ts`: จัดการการแนบ Authentication token ไปกับ HTTP requests
- `/public`: เก็บ Static assets เช่น `favicon.ico`
- ไฟล์ entry point หลักคือ `/src/main.ts` (Angular application bootstrap) และ `/src/index.html` (HTML shell)

### 4. Core Logic & Application Flow
- **Authentication Flow**: ผู้ใช้งานสามารถ `login` และ `register` ได้ผ่านหน้า `/login` และ `/register` โดย `auth.service.ts` จัดการการเรียก API และเก็บ Token. `auth.interceptor.ts` จะแนบ Token นี้ไปกับทุกๆ HTTP Request ที่ถูกส่งไป Backend
- **Equipment Management Flow**: 
  - ผู้ดูแลระบบ (Admin) สามารถเพิ่มอุปกรณ์ใหม่ได้ผ่านหน้า `/add-equipment` โดยใช้ `equipment.service.ts`
  - ผู้ใช้ทั่วไปสามารถดูรายการอุปกรณ์ได้ที่หน้า `/equipments`
- **Borrowing/Cart Flow**: 
  - ผู้ใช้สามารถเพิ่มอุปกรณ์ลงในตะกร้าได้ (cart functionality handled by `cart.service.ts`)
  - การยืมอุปกรณ์และการจัดการประวัติการยืม-คืน (borrowing history) จัดการโดย `borrow.service.ts` และแสดงผลที่หน้า `/my-history`
- **Admin Dashboard**: หน้า `/admin-dashboard` แสดงภาพรวมและฟังก์ชันการจัดการสำหรับผู้ดูแลระบบ (รายละเอียดเพิ่มเติมต้องดูในโค้ด)

### 5. Completed Features
- ระบบ Authentication (Login, Register)
- การแสดงรายการอุปกรณ์ (Equipments listing)
- ระบบตะกร้า (Cart)
- ประวัติการยืม-คืน (Borrow history)
- การเพิ่มอุปกรณ์สำหรับ Admin (Add Equipment)
- Admin Dashboard (มีการ Implement หน้าแล้ว, ต้องดูรายละเอียดฟังก์ชันในโค้ด)

### 6. Work in Progress / TODO
- TODO ที่พบในโค้ด: "Not found in the project"
- ส่วนที่ยังไม่สมบูรณ์: รายละเอียดฟังก์ชันของ Admin Dashboard, การจัดการ Error/Edge cases บางส่วนอาจต้องตรวจสอบเพิ่มเติม

### 7. Constraints & Caveats
- ส่วนที่ hack / ยังไม่ clean: "Not found in the project"
- Dependency ที่เปราะบาง: "Not found in the project"
- จุดที่ห้ามแก้โดยไม่ระวัง: การแก้ไขไฟล์ `auth.interceptor.ts` หรือ `auth.service.ts` อาจส่งผลกระทบต่อระบบ Authentication ทั้งหมด

### 8. How to Run the Project
- คำสั่งติดตั้ง: `npm install`
- คำสั่ง run / build / test:
  - Run Development Server: `ng serve`
  - Build Production: `ng build`
  - Run Tests: `ng test`

### 9. Next Steps / Suggested Roadmap
- พัฒนาฟังก์ชันการจัดการผู้ใช้สำหรับ Admin
- เพิ่มฟีเจอร์การค้นหาและ Filter อุปกรณ์
- ปรับปรุง UI/UX ให้ดีขึ้นและรองรับ Responsive Design
- เพิ่มการจัดการสถานะอุปกรณ์ (เช่น Available, Borrowed, Under Maintenance)
- Implement Notification system สำหรับการยืม-คืน
