import React, { useState } from 'react';
import type { Service, CreateBookingDto } from '../../types';
import { useAvailabilityQuery, useCreateBookingMutation } from '../../features/services/hooks/useAvailability';
import { Calendar, Clock, CheckCircle2, AlertCircle, Loader2, X, User } from 'lucide-react';

interface AvailabilityModalProps {
  isOpen: boolean;
  service: Service | null;
  onClose: () => void;
}

export const AvailabilityModal: React.FC<AvailabilityModalProps> = ({
  isOpen,
  service,
  onClose,
}) => {
  const [selectedDate, setSelectedDate] = useState<string>(
    new Date().toISOString().split('T')[0]
  );
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [customerName, setCustomerName] = useState('Anish Adhikari');
  const [customerEmail, setCustomerEmail] = useState('anish@example.com');
  const [customerPhone, setCustomerPhone] = useState('9841999888');

  const availabilityQuery = useAvailabilityQuery(
    service?.id || '',
    selectedDate,
    isOpen && Boolean(service)
  );

  const bookingMutation = useCreateBookingMutation();

  if (!isOpen || !service) return null;

  const slots = availabilityQuery.data?.data.slots || [];
  const isLoadingSlots = availabilityQuery.isLoading || availabilityQuery.isFetching;

  const handleBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSlot) return;

    const dto: CreateBookingDto = {
      serviceId: service.id,
      customerName,
      customerEmail,
      customerPhone,
      scheduledDate: selectedDate,
      startTime: selectedSlot,
    };

    try {
      await bookingMutation.mutateAsync(dto);
      setSelectedSlot(null);
    } catch {
      // Error handled by mutation hook & toast
    }
  };

  return (
    <div className="modal-backdrop" onClick={onClose} role="dialog" aria-modal="true">
      <div className="modal-container modal-medium" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-title">
            <Calendar size={20} className="text-primary" />
            <span>Service Availability & Test Booking</span>
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
          <div className="availability-service-summary">
            <h3>{service.name}</h3>
            <p>{service.description}</p>
            <div className="summary-pills">
              <span className="pill">{service.category}</span>
              <span className="pill">{service.durationMinutes} minutes</span>
              <span className="pill pill-price">{service.currency} {service.price}</span>
            </div>
          </div>

          <div className="date-picker-row">
            <label htmlFor="bookingDate" className="date-picker-label">
              <Calendar size={16} />
              <span>Select Date:</span>
            </label>
            <input
              type="date"
              id="bookingDate"
              className="date-picker-input"
              value={selectedDate}
              min={new Date().toISOString().split('T')[0]}
              onChange={(e) => {
                setSelectedDate(e.target.value);
                setSelectedSlot(null);
              }}
            />
            {isLoadingSlots && <Loader2 size={16} className="spin-icon text-primary" />}
          </div>

          {/* Slots list */}
          <div className="slots-section">
            <h4 className="slots-title">Available Time Slots for {selectedDate}</h4>
            {availabilityQuery.isError ? (
              <div className="form-alert-error">
                Failed to load time slots: {availabilityQuery.error?.message}
                <button
                  type="button"
                  className="btn-retry-inline"
                  onClick={() => availabilityQuery.refetch()}
                >
                  Retry
                </button>
              </div>
            ) : slots.length === 0 && !isLoadingSlots ? (
              <div className="empty-slots-msg">
                <AlertCircle size={20} />
                <span>No available slots for this date. Please pick another date.</span>
              </div>
            ) : (
              <div className="slots-grid">
                {slots.map((slot) => {
                  const isSelected = selectedSlot === slot.startTime;
                  return (
                    <button
                      key={slot.startTime}
                      type="button"
                      disabled={!slot.available || bookingMutation.isPending}
                      className={`slot-card ${
                        slot.available ? 'slot-available' : 'slot-booked'
                      } ${isSelected ? 'slot-selected' : ''}`}
                      onClick={() => slot.available && setSelectedSlot(slot.startTime)}
                    >
                      <Clock size={14} />
                      <span className="slot-time">
                        {slot.startTime} - {slot.endTime}
                      </span>
                      <span className="slot-status">
                        {slot.available ? (isSelected ? 'Selected' : 'Available') : 'Booked'}
                      </span>
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Booking Form if slot selected */}
          {selectedSlot && (
            <form onSubmit={handleBooking} className="booking-subform">
              <h4 className="subform-title">
                <User size={16} />
                <span>Customer Booking Details for {selectedSlot}</span>
              </h4>

              {bookingMutation.isError && (
                <div className="form-alert-error">
                  <strong>HTTP 409 / Error:</strong> {bookingMutation.error?.message}
                </div>
              )}

              <div className="form-row">
                <div className="form-group col-third">
                  <label className="form-label">Full Name *</label>
                  <input
                    type="text"
                    required
                    className="form-input"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                  />
                </div>
                <div className="form-group col-third">
                  <label className="form-label">Email *</label>
                  <input
                    type="email"
                    required
                    className="form-input"
                    value={customerEmail}
                    onChange={(e) => setCustomerEmail(e.target.value)}
                  />
                </div>
                <div className="form-group col-third">
                  <label className="form-label">Phone</label>
                  <input
                    type="text"
                    className="form-input"
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                  />
                </div>
              </div>

              <div className="booking-submit-row">
                <button
                  type="submit"
                  className="btn-book-now"
                  disabled={bookingMutation.isPending}
                >
                  {bookingMutation.isPending ? (
                    <>
                      <Loader2 size={16} className="spin-icon" />
                      <span>Creating Booking...</span>
                    </>
                  ) : (
                    <>
                      <CheckCircle2 size={16} />
                      <span>Confirm Booking ({selectedSlot})</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
