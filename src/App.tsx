import { QueryClient, QueryClientProvider, useIsFetching } from '@tanstack/react-query';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ToastProvider } from './components/common/ToastContext';
import { ServiceList } from './components/services/ServiceList';
import { ServiceDetailPage } from './components/services/ServiceDetailPage';
import { DevToolbar } from './components/common/DevToolbar';
import { useState } from 'react';
import { Navbar } from './components/layout/Navbar';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      staleTime: 1000 * 60 * 5, // 5 minutes default stale time
      refetchOnWindowFocus: false,
    },
  },
});

function MainLayout() {
  const [devToolbarOpen, setDevToolbarOpen] = useState(false);
  const isFetchingCount = useIsFetching();

  return (
    <div className="min-h-screen bg-app">
      <Navbar
        isFetching={isFetchingCount > 0}
        devToolbarOpen={devToolbarOpen}
        onToggleDevToolbar={() => {
          setDevToolbarOpen((previousValue) => !previousValue);
        }}
      />
      <DevToolbar isOpen={devToolbarOpen} onClose={() => setDevToolbarOpen(false)} />
      <main className="app-container">
        <Routes>
          <Route path="/" element={<ServiceList />} />
          <Route path="/services/:serviceId" element={<ServiceDetailPage />} />
          <Route path="*" element={<ServiceList />} />
        </Routes>
      </main>
    </div>
  );
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ToastProvider>
        <BrowserRouter>
          <MainLayout />
        </BrowserRouter>
      </ToastProvider>
    </QueryClientProvider>
  );
}
