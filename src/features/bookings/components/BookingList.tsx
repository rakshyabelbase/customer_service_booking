import { useState } from 'react';
import type { Booking, Service } from '../../../types';
import { useServiceBookings, useDeleteBookingMutation } from '../hooks/useBookings';
import {
  Calendar,
  Clock,
  MapPin,
  User,
  Mail,
  AlertCircle,
  Eye,
  Edit3,
  Trash2,
  RefreshCw,
  Search,
  CheckCircle2,
  XCircle,
  Clock3,
} from 'lucide-react';
import { Button } from '../../../components/common/Button';
import { ButtonGroup } from '../../../components/common/ButtonGroup';

type BookingListProps = {
  serviceId: string;
  service: Service | null;
  onOpenBookingModal: (service?: Service, bookingToEdit?: Booking) => void;
  onSelectBooking: (booking: Booking) => void;
};

export function BookingList({
  serviceId,
  service,
  onOpenBookingModal,
  onSelectBooking,
}: BookingListProps) {
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [bookingToDelete, setBookingToDelete] = useState<Booking | null>(null);

  const bookingsQuery = useServiceBookings(serviceId, {
    status: statusFilter === 'all' ? undefined : statusFilter,
  });

  const deleteMutation = useDeleteBookingMutation();

  const handleConfirmCancel = async () => {
    if (!bookingToDelete) return;
    try {
      await deleteMutation.mutateAsync(bookingToDelete.id);
      setBookingToDelete(null);
    } catch {
      // Error handled by mutation toast
    }
  };

  const rawBookings = bookingsQuery.data?.data || [];

  // Filter client-side by search query (customer name, email, booking number)
  const bookings = rawBookings.filter((b) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      b.bookingNumber.toLowerCase().includes(q) ||
      b.customerName.toLowerCase().includes(q) ||
      b.customerEmail.toLowerCase().includes(q)
    );
  });

  const renderStatusBadge = (status: Booking['status']) => {
    switch (status) {
      case 'confirmed':
        return (
          <span className="badge badge-success flex-align">
            <CheckCircle2 size={12} className="mr-1" /> Confirmed
          </span>
        );
      case 'completed':
        return (
          <span className="badge badge-info flex-align">
            <Clock3 size={12} className="mr-1" /> Completed
          </span>
        );
      case 'cancelled':
        return (
          <span className="badge badge-neutral flex-align">
            <XCircle size={12} className="mr-1" /> Cancelled
          </span>
        );
      default:
        return <span className="badge">{status}</span>;
    }
  };

  return (
    <section className="bookings-section">
      <div className="bookings-header flex-between align-center">
        <div>
          <h2 className="bookings-title flex-align">
            <Calendar size={22} className="text-primary mr-2" />
            <span>Service Bookings</span>
            {bookingsQuery.data && (
              <span className="count-pill ml-2">{bookingsQuery.data.meta.total}</span>
            )}
          </h2>
          <p className="bookings-subtitle">
            Manage customer reservations, schedule updates, and cancellations.
          </p>
        </div>

        {/* <Button
          variant="primary"
          leftIcon={<Plus size={16} />}
          onClick={() => onOpenBookingModal(service || undefined)}
        >
          New Booking
        </Button> */}
      </div>

      {/* Filter and Search Bar */}
      <div className="bookings-toolbar flex-between align-center mt-4">
        <div className="status-tabs flex-align">
          {['all', 'confirmed', 'completed', 'cancelled'].map((st) => (
            <button
              key={st}
              type="button"
              className={`tab-btn ${statusFilter === st ? 'active' : ''}`}
              onClick={() => setStatusFilter(st)}
            >
              {st.charAt(0).toUpperCase() + st.slice(1)}
            </button>
          ))}
        </div>

        <div className="search-input-wrapper">
          <Search size={15} className="search-icon" />
          <input
            type="text"
            className="search-input"
            placeholder="Search booking # or customer..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Loading State */}
      {bookingsQuery.isLoading && (
        <div className="bookings-loading-grid mt-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="booking-card-skeleton animate-pulse">
              <div className="skeleton-line w-40 h-5" />
              <div className="skeleton-line w-60 h-4 mt-2" />
              <div className="skeleton-line w-80 h-4 mt-2" />
            </div>
          ))}
        </div>
      )}

      {/* Error State */}
      {bookingsQuery.isError && (
        <div className="form-alert-error my-4">
          <AlertCircle size={20} />
          <div>
            <strong>Failed to load bookings:</strong> {bookingsQuery.error?.message}
          </div>
          <Button
            size="sm"
            variant="ghost"
            className="ml-auto"
            leftIcon={<RefreshCw size={14} />}
            onClick={() => bookingsQuery.refetch()}
          >
            Retry
          </Button>
        </div>
      )}

      {/* Empty State */}
      {!bookingsQuery.isLoading && !bookingsQuery.isError && bookings.length === 0 && (
        <div className="bookings-empty-state text-center py-8">
          <div className="empty-icon-circle">
            <Calendar size={32} className="text-primary-light" />
          </div>
          <h3>No Bookings Found</h3>
          <p className="text-muted mt-1 max-w-md mx-auto">
            {searchQuery || statusFilter !== 'all'
              ? 'No bookings match your current filter criteria. Try resetting filters.'
              : 'There are no customer bookings registered for this service yet. Click below to create the first booking.'}
          </p>
          {/* <div className="mt-4">
            <Button
              variant="secondary"
              leftIcon={<Plus size={16} />}
              onClick={() => {
                setSearchQuery('');
                setStatusFilter('all');
                onOpenBookingModal(service || undefined);
              }}
            >
              Book Now
            </Button>
          </div> */}
        </div>
      )}

      {/* Bookings Grid / List */}
      {!bookingsQuery.isLoading && !bookingsQuery.isError && bookings.length > 0 && (
        <div className="bookings-grid mt-4">
          {bookings.map((booking) => (
            <div key={booking.id} className="booking-card">
              <div className="booking-card-header flex-between align-center">
                <span className="booking-number">{booking.bookingNumber}</span>
                {renderStatusBadge(booking.status)}
              </div>

              <div className="booking-card-body mt-3">
                <div className="booking-meta-row flex-align">
                  <User size={15} className="text-primary mr-2" />
                  <span className="font-medium text-main">{booking.customerName}</span>
                </div>

                <div className="booking-meta-row flex-align mt-1 text-sm text-muted">
                  <Mail size={14} className="mr-2" />
                  <span>{booking.customerEmail}</span>
                </div>

                <div className="booking-meta-row flex-align mt-2 text-sm">
                  <Calendar size={14} className="text-secondary mr-2" />
                  <span className="font-semibold text-main">{booking.scheduledDate}</span>
                  <Clock size={14} className="text-secondary ml-3 mr-1" />
                  <span>{booking.startTime} - {booking.endTime}</span>
                </div>
                <div className="booking-meta-row flex-align mt-2 text-sm text-muted"><MapPin size={14} className="mr-2" /><span>{booking.serviceAddress}</span></div>

                {booking.notes && (
                  <p className="booking-notes-preview mt-2 text-xs text-muted line-clamp-1">
                    Note: "{booking.notes}"
                  </p>
                )}
              </div>

              <div className="booking-card-footer flex-between align-center mt-4 pt-3 border-t border-color">
                <div className="booking-price">
                  <span className="text-xs text-muted">Amount</span>
                  <span className="price-tag font-bold block text-primary">
                    {booking.currency} {booking.price.toLocaleString()}
                  </span>
                </div>

                <div className="booking-actions flex-align gap-2">
                  <button
                    type="button"
                    className="btn-action-icon"
                    title="View Full Booking Details"
                    onClick={() => onSelectBooking(booking)}
                  >
                    <Eye size={15} />
                  </button>

                  <button
                    type="button"
                    className="btn-action-icon"
                    title="Edit Booking"
                    onClick={() => onOpenBookingModal(service || undefined, booking)}
                  >
                    <Edit3 size={15} />
                  </button>

                  <button
                    type="button"
                    className="btn-action-icon text-danger-hover"
                    title="Cancel Booking"
                    onClick={() => setBookingToDelete(booking)}
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Cancel Confirmation Modal */}
      {bookingToDelete && (
        <div className="modal-backdrop" onClick={() => setBookingToDelete(null)} role="dialog" aria-modal="true">
          <div className="modal-container modal-small" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header header-danger">
              <div className="modal-title text-danger">
                <AlertCircle size={20} />
                <span>Cancel & Delete Booking</span>
              </div>
              <button
                type="button"
                className="modal-close-btn"
                onClick={() => setBookingToDelete(null)}
                disabled={deleteMutation.isPending}
              >
                <XCircle size={18} />
              </button>
            </div>
            <div className="modal-body-padded">
              <p className="confirm-text">
                Are you sure you want to cancel booking <strong>#{bookingToDelete.bookingNumber}</strong> for <strong>{bookingToDelete.customerName}</strong>?
              </p>
              <p className="confirm-subtext mt-1 text-muted text-sm">
                This will release the slot ({bookingToDelete.scheduledDate} at {bookingToDelete.startTime}) back to service availability.
              </p>
            </div>
            <div className="modal-footer">
              <ButtonGroup align="right">
                <Button
                  variant="secondary"
                  onClick={() => setBookingToDelete(null)}
                  disabled={deleteMutation.isPending}
                >
                  Keep Booking
                </Button>
                <Button
                  variant="danger"
                  onClick={handleConfirmCancel}
                  isLoading={deleteMutation.isPending}
                >
                  Yes, Cancel Booking
                </Button>
              </ButtonGroup>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
