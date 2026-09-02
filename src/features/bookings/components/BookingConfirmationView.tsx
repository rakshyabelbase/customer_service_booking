import { useEffect, useRef } from 'react';
import { CheckCircle2 } from 'lucide-react';
import type { Booking } from '../../../types';
import { Button } from '../../../components/common/Button';
import { ButtonGroup } from '../../../components/common/ButtonGroup';

type BookingConfirmationViewProps = { booking: Booking; onBrowseServices: () => void; onViewBookings: () => void };

export function BookingConfirmationView({ booking, onBrowseServices, onViewBookings }: BookingConfirmationViewProps) {
  const headingRef = useRef<HTMLHeadingElement>(null);
  useEffect(() => { headingRef.current?.focus(); }, []);

  return <div className="booking-confirmation-view text-center">
    <div className="booking-confirmation-header">
    <CheckCircle2 size={58} className="text-success mx-auto" />
    <h1 ref={headingRef} tabIndex={-1} className="mt-3">Booking confirmed</h1>
    <p className="text-muted mt-1">Your booking was created successfully.</p>
    </div>
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
      <Button variant="secondary" onClick={onBrowseServices}>Browse Services</Button>
      <Button variant="primary" onClick={onViewBookings}>View My Bookings</Button>
    </ButtonGroup>
  </div>;
}
