import { Route, Routes } from 'react-router-dom';
import { BookingConfirmationPage } from '../components/bookings/BookingConfirmationPage';
import { MyBookingsPage } from '../components/bookings/MyBookingsPage';
import { ServiceDetailPage } from '../components/services/ServiceDetailPage';
import { ServiceList } from '../components/services/ServiceList';
import { MainLayout } from '../layouts/MainLayout';

export function AppRoutes() {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route index element={<ServiceList />} />
        <Route path="/services/:serviceId" element={<ServiceDetailPage />} />
        <Route path="/bookings" element={<MyBookingsPage />} />
        <Route
          path="/bookings/confirmation/:bookingId"
          element={<BookingConfirmationPage />}
        />
        <Route path="*" element={<ServiceList />} />
      </Route>
    </Routes>
  );
}
