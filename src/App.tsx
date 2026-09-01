import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ToastProvider } from './components/common/ToastContext';
import { ServiceList } from './components/services/ServiceList';

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
  return (
    <div className="min-h-screen bg-app">
      <main className="app-container">
        <ServiceList />
      </main>
    </div>
  );
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ToastProvider>
        <MainLayout />
      </ToastProvider>
    </QueryClientProvider>
  );
}
