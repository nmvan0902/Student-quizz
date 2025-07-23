// src/layouts/AdminLayout.jsx
import { Outlet } from 'react-router-dom';

// Không cần khai báo kiểu cho props nếu không có
export default function AdminLayout() {
  return (
    <div className="flex">
      {/* <Sidebar /> */}
      <main className="flex-1 p-4">
        <Outlet />
      </main>
    </div>
  );
}