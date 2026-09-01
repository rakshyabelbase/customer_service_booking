import type { Booking, Service } from '../../types';
import { useBookingQuery } from '../../features/bookings/hooks/useBookings';
import {
  X,
  Calendar,
  Clock,
  User,
  Mail,
  Phone,
  FileText,
  Edit3,
  Trash2,
  Loader2,
  AlertCircle,
  CheckCircle2,
  Clock3,
  XCircle,
  Tag,
  MapPin,
  Building2,
} from 'lucide-react';

type BookingDetailModalProps = {
  bookingId: string | null;
  service: Service | null;
  onClose: () => void;
  onEdit: (booking: Booking) => void;
  onCancel: (booking: Booking) => void;
};

export function BookingDetailModal({
  bookingId,
  service,
  onClose,
  onEdit,
  onCancel,
}: BookingDetailModalProps) {
  const bookingQuery = useBookingQuery(bookingId || '', Boolean(bookingId));

  if (!bookingId) return null;

  const booking = bookingQuery.data?.data;
  const isLoading = bookingQuery.isLoading || bookingQuery.isFetching;

  const renderStatusBadge = (status?: Booking['status']) => {
    switch (status) {
      case 'confirmed':
        return (
          <span className="badge badge-success flex-align">
            <CheckCircle2 size={14} className="mr-1" /> Confirmed
          </span>
        );
      case 'completed':
        return (
          <span className="badge badge-info flex-align">
            <Clock3 size={14} className="mr-1" /> Completed
          </span>
        );
      case 'cancelled':
        return (
          <span className="badge badge-neutral flex-align">
            <XCircle size={14} className="mr-1" /> Cancelled
          </span>
        );
      default:
        return <span className="badge">{status}</span>;
    }
  };

  return (
    <div className="modal-backdrop" onClick={onClose} role="dialog" aria-modal="true">
      <div className="modal-container modal-medium" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-title">
            <Calendar size={20} className="text-primary" />
            <span>Booking Details {booking ? `#${booking.bookingNumber}` : ''}</span>
          </div>
          <button
            type="button"
            className="modal-close-btn"
            onClick={onClose}
            aria-label="Close modal"
          >
            <X size={18} />
          </button>
        </div>

        <div className="modal-body-padded">
          {isLoading && (
            <div className="py-12 text-center">
              <Loader2 size={32} className="spin-icon text-primary mx-auto" />
              <p className="mt-3 text-muted">Loading booking details...</p>
            </div>
          )}

          {bookingQuery.isError && (
            <div className="form-alert-error my-4">
              <AlertCircle size={20} />
              <div>
                <strong>Error loading booking:</strong> {bookingQuery.error?.message}
              </div>
              <button
                type="button"
                className="btn-retry-inline ml-auto"
                onClick={() => bookingQuery.refetch()}
              >
                Retry
              </button>
            </div>
          )}

          {!isLoading && !bookingQuery.isError && booking && (
            <div className="booking-detail-view">
              {/* Header card summary */}
              <div className="detail-summary-card flex-between align-center">
                <div>
                  <div className="flex-align gap-2">
                    <span className="booking-ref-tag">{booking.bookingNumber}</span>
                    {renderStatusBadge(booking.status)}
                  </div>
                  <h3 className="mt-2 text-lg font-bold">{booking.serviceName}</h3>
                  <p className="text-xs text-muted mt-1 flex-align"><Building2 size={12} className="mr-1" /> Provider: {booking.provider.name}{service ? <><Tag size={12} className="ml-2 mr-1" /> Category: {service.category}</> : null}</p>
                </div>

                <div className="text-right">
                  <span className="text-xs text-muted block">Total Price</span>
                  <span className="text-xl font-extrabold text-primary">
                    {booking.currency} {booking.price.toLocaleString()}
                  </span>
                </div>
              </div>

              {/* Grid information */}
              <div className="detail-grid mt-4">
                {/* Schedule Info */}
                <div className="detail-info-block">
                  <h4 className="info-block-title flex-align">
                    <Clock size={16} className="text-primary mr-2" />
                    <span>Reservation Schedule</span>
                  </h4>
                  <div className="info-rows mt-2">
                    <div className="info-row">
                      <span className="label">Scheduled Date:</span>
                      <span className="value font-semibold">{booking.scheduledDate}</span>
                    </div>
                    <div className="info-row"><span className="label flex-align"><MapPin size={13} className="mr-1" /> Address:</span><span className="value">{booking.serviceAddress}</span></div>
                    <div className="info-row">
                      <span className="label">Time Slot:</span>
                      <span className="value font-semibold">
                        {booking.startTime} - {booking.endTime}
                      </span>
                    </div>
                    <div className="info-row">
                      <span className="label">Booked On:</span>
                      <span className="value text-muted">
                        {new Date(booking.createdAt).toLocaleString()}
                      </span>
                    </div>
                    {booking.updatedAt && (
                      <div className="info-row">
                        <span className="label">Last Modified:</span>
                        <span className="value text-muted">
                          {new Date(booking.updatedAt).toLocaleString()}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Customer Info */}
                <div className="detail-info-block">
                  <h4 className="info-block-title flex-align">
                    <User size={16} className="text-primary mr-2" />
                    <span>Customer Details</span>
                  </h4>
                  <div className="info-rows mt-2">
                    <div className="info-row">
                      <span className="label">Customer Name:</span>
                      <span className="value font-semibold">{booking.customerName}</span>
                    </div>
                    <div className="info-row">
                      <span className="label flex-align">
                        <Mail size={13} className="mr-1" /> Email:
                      </span>
                      <span className="value">{booking.customerEmail}</span>
                    </div>
                    <div className="info-row">
                      <span className="label flex-align">
                        <Phone size={13} className="mr-1" /> Phone:
                      </span>
                      <span className="value">
                        {booking.customerPhone || 'Not provided'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Notes */}
              {booking.notes && (
                <div className="detail-notes-block mt-4">
                  <h4 className="info-block-title flex-align">
                    <FileText size={16} className="text-primary mr-2" />
                    <span>Special Notes & Instructions</span>
                  </h4>
                  <p className="notes-content mt-2">{booking.notes}</p>
                </div>
              )}

              {/* Action buttons */}
              <div className="modal-actions-bar mt-6 flex-between align-center">
                <button
                  type="button"
                  className="btn-danger-outline flex-align"
                  onClick={() => {
                    onClose();
                    onCancel(booking);
                  }}
                >
                  <Trash2 size={16} className="mr-1" />
                  <span>Cancel Booking</span>
                </button>

                <div className="flex-align gap-2">
                  <button type="button" className="btn-modal-cancel" onClick={onClose}>
                    Close
                  </button>
                  <button
                    type="button"
                    className="btn-primary flex-align"
                    onClick={() => {
                      onClose();
                      onEdit(booking);
                    }}
                  >
                    <Edit3 size={16} className="mr-1" />
                    <span>Edit / Reschedule</span>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
