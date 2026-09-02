import { useState } from 'react';
import { useIsFetching } from '@tanstack/react-query';
import { Outlet } from 'react-router-dom';
import { DevToolbar } from '../components/common/DevToolbar';
import { Navbar } from '../components/layout/Navbar';

export function MainLayout() {
  const [devToolbarOpen, setDevToolbarOpen] = useState(false);
  const isFetchingCount = useIsFetching();

  return (
    <div className="min-h-screen bg-app">
      <Navbar
        isFetching={isFetchingCount > 0}
        devToolbarOpen={devToolbarOpen}
        onToggleDevToolbar={() =>
          setDevToolbarOpen((previousValue) => !previousValue)
        }
      />

      <DevToolbar
        isOpen={devToolbarOpen}
        onClose={() => setDevToolbarOpen(false)}
      />

      <main className="app-container">
        <Outlet />
      </main>
    </div>
  );
}
