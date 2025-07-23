import { Outlet } from 'react-router-dom';
import Navbar from '../components/Navbar';

export default function AdminLayout() {
  return (
    <div className="min-vh-100" style={{ backgroundColor: 'var(--color-gray)' }}>
      <Navbar />
      <main>
        <Outlet />
      </main>
    </div>
  );
}