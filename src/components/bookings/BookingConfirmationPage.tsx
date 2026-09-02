import { useNavigate, useParams } from 'react-router-dom';
import { AlertCircle, CheckCircle2, RefreshCw } from 'lucide-react';
import { useBookingQuery } from '../../features/bookings/hooks/useBookings';
import { Button } from '../common/Button';
import { ButtonGroup } from '../common/ButtonGroup';

export function BookingConfirmationPage() {
  const { bookingId = '' } = useParams<{ bookingId: string }>();
  const navigate = useNavigate();
  const query = useBookingQuery(bookingId);
  const booking = query.data?.data;

  if (query.isLoading) return <div className="booking-confirmation-page text-center">Loading confirmation…</div>;

  if (query.isError || !booking) {
    return <div className="booking-confirmation-page">
      <div className="form-alert-error"><AlertCircle size={20} /><span>Unable to load this booking confirmation.</span></div>
      <ButtonGroup align="right" className="mt-4">
        <Button variant="secondary" onClick={() => navigate('/bookings')}>My Bookings</Button>
        <Button variant="primary" leftIcon={<RefreshCw size={16} />} onClick={() => query.refetch()}>Retry</Button>
      </ButtonGroup>
    </div>;
  }

  return <div className="booking-confirmation-page text-center">
    <CheckCircle2 size={58} className="text-success mx-auto" />
    <h1 className="mt-3">Booking confirmed</h1>
    <p className="text-muted mt-1">Your booking was created successfully.</p>
    <div className="booking-summary-card confirmation-card mt-4 text-left">
      <div className="summary-row"><span>Booking number</span><strong>{booking.bookingNumber}</strong></div>
      <div className="summary-row"><span>Service</span><strong>{booking.serviceName}</strong></div>
      <div className="summary-row"><span>Provider</span><strong>{booking.provider.name}</strong></div>
      <div className="summary-row"><span>Date & time</span><strong>{booking.scheduledDate}, {booking.startTime}–{booking.endTime}</strong></div>
      <div className="summary-row"><span>Customer</span><strong>{booking.customerName}</strong></div>
      <div className="summary-row"><span>Address</span><strong>{booking.serviceAddress}</strong></div>
      <div className="summary-row summary-total"><span>Total</span><strong>{booking.currency} {booking.price.toLocaleString()}</strong></div>
    </div>
    <ButtonGroup align="right" className="mt-4">
      <Button variant="secondary" onClick={() => navigate('/')}>Browse Services</Button>
      <Button variant="primary" onClick={() => navigate('/bookings')}>View My Bookings</Button>
    </ButtonGroup>
  </div>;
}
