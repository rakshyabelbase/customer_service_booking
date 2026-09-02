import { useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AlertCircle, Building2, Calendar, Clock, MapPin, RefreshCw, Search } from 'lucide-react';
import type { Booking } from '../../../types';
import { useServiceBookings } from '../hooks/useBookings';
import { Button } from '../../../components/common/Button';

export function MyBookingsPage() {
  const navigate = useNavigate();
  const [status, setStatus] = useState('all');
  const [search, setSearch] = useState('');
  const query = useServiceBookings(undefined, { status: status === 'all' ? undefined : status });
  const bookings = useMemo(() => (query.data?.data || []).filter((booking) => {
    const needle = search.trim().toLowerCase();
    return !needle || [booking.bookingNumber, booking.serviceName, booking.provider.name, booking.customerName]
      .some((value) => value.toLowerCase().includes(needle));
  }), [query.data, search]);

  return (
    <div className="my-bookings-page">
      <div className="bookings-header flex-between align-center">
        <div><h1>My Bookings</h1><p className="text-muted mt-1">View your appointments and booked services.</p></div>
        <Button variant="primary" onClick={() => navigate('/')}>Book another service</Button>
      </div>
      <div className="bookings-toolbar flex-between align-center mt-4">
        <div className="status-tabs flex-align">
          {['all', 'confirmed', 'completed', 'cancelled'].map((item) => (
            <Button
              key={item}
              size="sm"
              variant={status === item ? 'primary' : 'ghost'}
              className="booking-filter-button"
              aria-pressed={status === item}
              onClick={() => setStatus(item)}
            >
              {item[0].toUpperCase() + item.slice(1)}
            </Button>
          ))}
        </div>
        <div className="search-input-wrapper"><Search size={15} className="search-icon" /><input className="search-input" placeholder="Search booking, service or provider" value={search} onChange={(event) => setSearch(event.target.value)} /></div>
      </div>
      {query.isLoading && <div className="bookings-empty-state mt-4">Loading bookings…</div>}
      {query.isError && <div className="form-alert-error my-4"><AlertCircle size={20} /><span>Failed to load bookings.</span><Button size="sm" variant="ghost" leftIcon={<RefreshCw size={14} />} onClick={() => query.refetch()}>Retry</Button></div>}
      {!query.isLoading && !query.isError && bookings.length === 0 && <div className="bookings-empty-state text-center py-8"><Calendar size={32} className="text-primary-light" /><h3>No bookings found</h3><p className="text-muted mt-1">Try another filter or book your first service.</p></div>}
      <div className="bookings-grid mt-4">
        {bookings.map((booking) => <BookingCard key={booking.id} booking={booking} />)}
      </div>
    </div>
  );
}

function BookingCard({ booking }: { booking: Booking }) {
  return <article className="booking-card">
    <div className="booking-card-header flex-between align-center"><span className="booking-number">{booking.bookingNumber}</span><span className={`badge ${booking.status === 'confirmed' ? 'badge-success' : booking.status === 'completed' ? 'badge-info' : 'badge-neutral'}`}>{booking.status}</span></div>
    <div className="booking-card-body mt-3"><h3>{booking.serviceName}</h3>
      <div className="booking-meta-row flex-align mt-2 text-sm"><Building2 size={15} className="text-primary mr-2" />{booking.provider.name}</div>
      <div className="booking-meta-row flex-align mt-2 text-sm"><Calendar size={14} className="text-secondary mr-2" /><strong>{booking.scheduledDate}</strong><Clock size={14} className="text-secondary ml-3 mr-1" />{booking.startTime}–{booking.endTime}</div>
      <div className="booking-meta-row flex-align mt-2 text-sm text-muted"><MapPin size={14} className="mr-2" />{booking.serviceAddress}</div>
    </div>
    <div className="booking-card-footer my-booking-card-footer flex-between align-center mt-4 pt-3 border-t border-color">
      <strong className="text-primary">{booking.currency} {booking.price.toLocaleString()}</strong>
      <Link className="view-service-link" to={`/services/${booking.serviceId}`}>View service</Link>
    </div>
  </article>;
}
