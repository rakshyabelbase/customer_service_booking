import { useNavigate, useParams } from 'react-router-dom';
import { AlertCircle, RefreshCw } from 'lucide-react';
import { useBookingQuery } from '../hooks/useBookings';
import { Button } from '../../../components/common/Button';
import { ButtonGroup } from '../../../components/common/ButtonGroup';
import { BookingConfirmationView } from '../components/BookingConfirmationView';

export function BookingConfirmationPage() {
  const { bookingId = '' } = useParams<{ bookingId: string }>();
  const navigate = useNavigate();
  const query = useBookingQuery(bookingId);
  const booking = query.data?.data;

  if (query.isLoading) return <div className="booking-confirmation-page text-center">Loading confirmation…</div>;
  if (query.isError || !booking) return <div className="booking-confirmation-page">
    <div className="form-alert-error"><AlertCircle size={20} /><span>Unable to load this booking confirmation.</span></div>
    <ButtonGroup align="right" className="mt-4">
      <Button variant="secondary" onClick={() => navigate('/bookings')}>My Bookings</Button>
      <Button variant="primary" leftIcon={<RefreshCw size={16} />} onClick={() => query.refetch()}>Retry</Button>
    </ButtonGroup>
  </div>;

  return <div className="booking-confirmation-page">
    <BookingConfirmationView booking={booking} onBrowseServices={() => navigate('/')} onViewBookings={() => navigate('/bookings')} />
  </div>;
}
