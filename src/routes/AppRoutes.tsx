import { Route, Routes } from 'react-router-dom';
import { BookingConfirmationPage } from '../features/bookings/pages/BookingConfirmationPage';
import { MyBookingsPage } from '../features/bookings/pages/MyBookingsPage';
import { ServiceDetailPage } from '../features/services/pages/ServiceDetailPage';
import { ServiceListPage } from '../features/services/pages/ServiceListPage';
import { MainLayout } from '../layouts/MainLayout';

export function AppRoutes() {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route index element={<ServiceListPage />} />
        <Route path="/services/:serviceId" element={<ServiceDetailPage />} />
        <Route path="/bookings" element={<MyBookingsPage />} />
        <Route
          path="/bookings/confirmation/:bookingId"
          element={<BookingConfirmationPage />}
        />
        <Route path="*" element={<ServiceListPage />} />
      </Route>
    </Routes>
  );
}
