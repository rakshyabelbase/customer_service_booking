import { Outlet } from 'react-router-dom';
import { Navbar } from '../components/layout/Navbar';

export function MainLayout() {
  return (
    <div className="min-h-screen bg-app">
      <Navbar />

      <main className="app-container">
        <Outlet />
      </main>
    </div>
  );
}