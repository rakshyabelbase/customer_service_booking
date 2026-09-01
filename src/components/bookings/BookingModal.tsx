import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import type { Service, Booking, CreateBookingDto, UpdateBookingDto } from '../../types';
import { ApiError } from '../../types';
import { useAvailabilityQuery } from '../../features/services/hooks/useAvailability';
import {
  useCreateBookingMutation,
  useUpdateBookingMutation,
} from '../../features/bookings/hooks/useBookings';
import {
  Calendar,
  Clock,
  CheckCircle2,
  AlertCircle,
  Loader2,
  X,
  User,
  Mail,
  Phone,
  FileText,
  RefreshCw,
  Lock,
  Check,
  MapPin,
  Building2,
} from 'lucide-react';
import { Button } from '../common/Button';
import { ButtonGroup } from '../common/ButtonGroup';
import { getLocalDateString } from '../../utils/date';

type BookingModalProps = {
  isOpen: boolean;
  service: Service | null;
  booking?: Booking | null; // Present if editing
  onClose: () => void;
};

export function BookingModal({ isOpen, service, booking, onClose }: BookingModalProps) {
  const isEditMode = Boolean(booking);

  const [selectedDate, setSelectedDate] = useState<string>(
    getLocalDateString()
  );
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [customerName, setCustomerName] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [serviceAddress, setServiceAddress] = useState('');
  const [notes, setNotes] = useState('');
  const [status, setStatus] = useState<'confirmed' | 'cancelled' | 'completed'>('confirmed');
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [confirmedBooking, setConfirmedBooking] = useState<Booking | null>(null);

  // Availability Query
  const targetServiceId = service?.id || booking?.serviceId || '';
  const availabilityQuery = useAvailabilityQuery(
    targetServiceId,
    selectedDate,
    isOpen && Boolean(targetServiceId)
  );

  // Mutations
  const createMutation = useCreateBookingMutation();
  const updateMutation = useUpdateBookingMutation();
  const activeMutation = isEditMode ? updateMutation : createMutation;

  // Initialize or reset state when modal opens or booking changes
  useEffect(() => {
    if (isOpen) {
      setFieldErrors({});
      setFormError(null);
      setConfirmedBooking(null);
      if (booking) {
        setSelectedDate(booking.scheduledDate);
        setSelectedSlot(booking.startTime);
        setCustomerName(booking.customerName);
        setCustomerEmail(booking.customerEmail);
        setCustomerPhone(booking.customerPhone || '');
        setServiceAddress(booking.serviceAddress || '');
        setNotes(booking.notes || '');
        setStatus(booking.status);
      } else {
        setSelectedDate(getLocalDateString());
        setSelectedSlot(null);
        setCustomerName('Aarav Sharma');
        setCustomerEmail('aarav@example.com');
        setCustomerPhone('9841000001');
        setServiceAddress('Lazimpat Road, Kathmandu 44600');
        setNotes('');
        setStatus('confirmed');
      }
    }
  }, [isOpen, booking]);

  if (!isOpen || (!service && !booking)) return null;

  const displayService = service || {
    id: booking?.serviceId || '',
    name: booking?.serviceName || 'Service',
    description: '',
    category: 'Booking Service',
    price: booking?.price || 0,
    currency: booking?.currency || 'NPR',
    durationMinutes: 60,
  };

  const slots = availabilityQuery.data?.data.slots || [];
  const isLoadingSlots = availabilityQuery.isLoading || availabilityQuery.isFetching;

  const validateClientSide = (): boolean => {
    const errors: Record<string, string> = {};

    if (!customerName.trim()) {
      errors.customerName = 'Customer name is required.';
    } else if (customerName.trim().length < 2) {
      errors.customerName = 'Name must be at least 2 characters.';
    }

    if (!customerEmail.trim()) {
      errors.customerEmail = 'Customer email is required.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(customerEmail.trim())) {
      errors.customerEmail = 'Please provide a valid email address.';
    }

    if (!selectedDate) {
      errors.scheduledDate = 'Booking date is required.';
    }

    if (!selectedSlot) {
      errors.startTime = 'Please select an available time slot.';
    }
    if (serviceAddress.trim().length < 8) {
      errors.serviceAddress = 'Enter a complete service address (at least 8 characters).';
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    setFieldErrors({});

    if (!validateClientSide()) {
      return;
    }

    try {
      if (isEditMode && booking) {
        const dto: UpdateBookingDto = {
          customerName: customerName.trim(),
          customerEmail: customerEmail.trim(),
          customerPhone: customerPhone.trim() || undefined,
          serviceAddress: serviceAddress.trim(),
          scheduledDate: selectedDate,
          startTime: selectedSlot!,
          status,
          notes: notes.trim() || undefined,
        };
        await updateMutation.mutateAsync({ id: booking.id, dto });
      } else {
        const dto: CreateBookingDto = {
          serviceId: displayService.id,
          customerName: customerName.trim(),
          customerEmail: customerEmail.trim(),
          customerPhone: customerPhone.trim() || undefined,
          serviceAddress: serviceAddress.trim(),
          scheduledDate: selectedDate,
          startTime: selectedSlot!,
          notes: notes.trim() || undefined,
        };
        const response = await createMutation.mutateAsync(dto);
        setConfirmedBooking(response.data);
        return;
      }
      onClose();
    } catch (err: unknown) {
      if (err instanceof ApiError) {
        if (err.statusCode === 400 && err.fieldErrors) {
          setFieldErrors(err.fieldErrors);
          setFormError(err.message);
        } else if (err.statusCode === 409) {
          setFormError(err.message || 'This slot was just booked by another user. Please pick a different slot.');
          // Refresh slot data
          availabilityQuery.refetch();
        } else {
          setFormError(err.message || 'An error occurred during booking. Please try again.');
        }
      } else {
        setFormError('An unexpected network error occurred.');
      }
    }
  };

  return (
    <div className="modal-backdrop" onClick={onClose} role="dialog" aria-modal="true">
      <div className="modal-container modal-medium" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-title">
            <Calendar size={20} className="text-primary" />
            <span>{confirmedBooking ? 'Booking confirmed' : isEditMode ? `Edit Booking #${booking?.bookingNumber}` : `Book ${displayService.name}`}</span>
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
          {confirmedBooking ? (
            <div className="booking-confirmation-view text-center">
              <CheckCircle2 size={52} className="text-success mx-auto" />
              <h2 className="mt-3">Your booking is confirmed</h2>
              <p className="text-muted mt-1">Keep this booking number for your records.</p>
              <div className="booking-summary-card mt-4 text-left">
                <div className="summary-row"><span>Booking number</span><strong>{confirmedBooking.bookingNumber}</strong></div>
                <div className="summary-row"><span>Service</span><strong>{confirmedBooking.serviceName}</strong></div>
                <div className="summary-row"><span>Provider</span><strong>{confirmedBooking.provider.name}</strong></div>
                <div className="summary-row"><span>Date & time</span><strong>{confirmedBooking.scheduledDate}, {confirmedBooking.startTime}–{confirmedBooking.endTime}</strong></div>
                <div className="summary-row"><span>Customer</span><strong>{confirmedBooking.customerName}</strong></div>
                <div className="summary-row"><span>Address</span><strong>{confirmedBooking.serviceAddress}</strong></div>
                <div className="summary-row summary-total"><span>Total</span><strong>{confirmedBooking.currency} {confirmedBooking.price.toLocaleString()}</strong></div>
              </div>
              <ButtonGroup align="right" className="mt-4">
                <Button variant="secondary" onClick={onClose}>Close</Button>
                <Link to="/bookings" className="btn-primary" onClick={onClose}>View My Bookings</Link>
              </ButtonGroup>
            </div>
          ) : (<>
          {/* Service Banner */}
          <div className="availability-service-summary">
            <div className="flex-between align-center">
              <h3>{displayService.name}</h3>
              <span className="pill pill-price">
                {displayService.currency} {displayService.price.toLocaleString()}
              </span>
            </div>
            {displayService.description && <p className="mt-1">{displayService.description}</p>}
          </div>

          {/* Form Error Banner */}
          {formError && (
            <div className="form-alert-error my-3">
              <AlertCircle size={18} />
              <div className="alert-content">
                <strong>Booking Error:</strong> {formError}
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="booking-modal-form">
            {/* Step 1: Date & Time Selection */}
            <div className="form-section">
              <div className="section-label">
                <Calendar size={16} />
                <span>1. Select Date & Slot</span>
              </div>

              <div className="date-picker-row mt-2">
                <label htmlFor="modalBookingDate" className="date-picker-label">
                  Date:
                </label>
                <input
                  type="date"
                  id="modalBookingDate"
                  className={`date-picker-input ${fieldErrors.scheduledDate ? 'input-error' : ''}`}
                  value={selectedDate}
                  min={getLocalDateString()}
                  onChange={(e) => {
                    setSelectedDate(e.target.value);
                    if (selectedDate !== e.target.value) {
                      setSelectedSlot(null);
                    }
                  }}
                />
                {isLoadingSlots ? (
                  <Loader2 size={16} className="spin-icon text-primary ml-2" />
                ) : (
                  <button
                    type="button"
                    className="btn-icon-subtle ml-2"
                    title="Refresh availability slots"
                    onClick={() => availabilityQuery.refetch()}
                  >
                    <RefreshCw size={14} />
                  </button>
                )}
              </div>
              {fieldErrors.scheduledDate && (
                <span className="field-error-text">{fieldErrors.scheduledDate}</span>
              )}

              {/* Time Slots */}
              <div className="slots-section mt-3">
                <div className="flex-between align-center mb-2">
                  <span className="slots-subtitle">Available Time Slots ({selectedDate})</span>
                  {selectedSlot && (
                    <span className="selected-slot-pill">
                      Selected: <strong>{selectedSlot}</strong>
                    </span>
                  )}
                </div>

                {availabilityQuery.isError ? (
                  <div className="form-alert-error">
                    <span>Failed to load time slots.</span>
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
                    <AlertCircle size={18} />
                    <span>No time slots available for this date. Please choose another date.</span>
                  </div>
                ) : (
                  <div className="slots-grid">
                    {slots.map((slot) => {
                      const isSelected = selectedSlot === slot.startTime;
                      // If editing current booking and date matches booking date, allow current slot
                      const isCurrentBookingSlot =
                        isEditMode &&
                        booking?.scheduledDate === selectedDate &&
                        booking?.startTime === slot.startTime;
                      const isAvailable = slot.available || isCurrentBookingSlot;

                      return (
                        <button
                          key={slot.startTime}
                          type="button"
                          disabled={!isAvailable || activeMutation.isPending}
                          className={`slot-card ${
                            isAvailable ? 'slot-available' : 'slot-booked'
                          } ${isSelected ? 'slot-selected' : ''}`}
                          onClick={() => isAvailable && setSelectedSlot(slot.startTime)}
                        >
                          <span className="slot-time">
                            <Clock size={13} />
                            {slot.startTime} - {slot.endTime}
                          </span>
                          <span
                            className={`slot-status ${
                              isAvailable ? 'slot-status-available' : 'slot-status-booked'
                            }`}
                          >
                            {isSelected ? (
                              <>
                                <CheckCircle2 size={13} /> Selected
                              </>
                            ) : isAvailable ? (
                              <>
                                <Check size={13} /> Available
                              </>
                            ) : (
                              <>
                                <Lock size={13} /> Booked
                              </>
                            )}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                )}
                {fieldErrors.startTime && (
                  <span className="field-error-text mt-1 block">{fieldErrors.startTime}</span>
                )}
              </div>
            </div>

            {/* Step 2: Customer Info & Status */}
            <div className="form-section mt-4">
              <div className="section-label">
                <User size={16} />
                <span>2. Customer Information</span>
              </div>

              <div className="form-row mt-2">
                <div className="form-group col-half">
                  <label className="form-label">
                    Full Name <span className="text-danger">*</span>
                  </label>
                  <div className="input-with-icon">
                    <User size={15} className="input-icon" />
                    <input
                      type="text"
                      className={`form-input ${fieldErrors.customerName ? 'input-error' : ''}`}
                      placeholder="e.g. Aarav Sharma"
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                    />
                  </div>
                  {fieldErrors.customerName && (
                    <span className="field-error-text">{fieldErrors.customerName}</span>
                  )}
                </div>

                <div className="form-group col-half">
                  <label className="form-label">
                    Email Address <span className="text-danger">*</span>
                  </label>
                  <div className="input-with-icon">
                    <Mail size={15} className="input-icon" />
                    <input
                      type="email"
                      className={`form-input ${fieldErrors.customerEmail ? 'input-error' : ''}`}
                      placeholder="e.g. customer@example.com"
                      value={customerEmail}
                      onChange={(e) => setCustomerEmail(e.target.value)}
                    />
                  </div>
                  {fieldErrors.customerEmail && (
                    <span className="field-error-text">{fieldErrors.customerEmail}</span>
                  )}
                </div>
              </div>

              <div className="form-group mt-2">
                <label className="form-label">Service Address <span className="text-danger">*</span></label>
                <div className="input-with-icon">
                  <MapPin size={15} className="input-icon" />
                  <input type="text" className={`form-input ${fieldErrors.serviceAddress ? 'input-error' : ''}`} placeholder="Street, area, city and postal code" value={serviceAddress} onChange={(e) => setServiceAddress(e.target.value)} />
                </div>
                {fieldErrors.serviceAddress && <span className="field-error-text">{fieldErrors.serviceAddress}</span>}
              </div>

              <div className="form-row mt-2">
                <div className="form-group col-half">
                  <label className="form-label">Phone Number</label>
                  <div className="input-with-icon">
                    <Phone size={15} className="input-icon" />
                    <input
                      type="text"
                      className="form-input"
                      placeholder="e.g. 9841000001"
                      value={customerPhone}
                      onChange={(e) => setCustomerPhone(e.target.value)}
                    />
                  </div>
                </div>

                {isEditMode && (
                  <div className="form-group col-half">
                    <label className="form-label">Booking Status</label>
                    <select
                      className="form-select"
                      value={status}
                      onChange={(e) =>
                        setStatus(e.target.value as 'confirmed' | 'cancelled' | 'completed')
                      }
                    >
                      <option value="confirmed">Confirmed</option>
                      <option value="completed">Completed</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </div>
                )}
              </div>

              <div className="form-group mt-2">
                <label className="form-label flex-align">
                  <FileText size={14} className="mr-1" />
                  <span>Notes / Special Instructions</span>
                </label>
                <textarea
                  className="form-textarea"
                  rows={2}
                  placeholder="Add any specific requirements or notes..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                />
              </div>
            </div>

            <div className="form-section mt-4 booking-summary-card">
              <div className="section-label"><CheckCircle2 size={16} /><span>3. Review Booking Summary</span></div>
              <div className="summary-row mt-2"><span>Service</span><strong>{displayService.name}</strong></div>
              <div className="summary-row"><span>Provider</span><strong className="flex-align"><Building2 size={14} className="mr-1" />{'provider' in displayService ? displayService.provider?.name : booking?.provider.name}</strong></div>
              <div className="summary-row"><span>Date & time</span><strong>{selectedDate}{selectedSlot ? `, ${selectedSlot}` : ' — select a slot'}</strong></div>
              <div className="summary-row"><span>Duration</span><strong>{displayService.durationMinutes} minutes</strong></div>
              <div className="summary-row"><span>Customer</span><strong>{customerName || 'Not entered'}</strong></div>
              <div className="summary-row"><span>Address</span><strong>{serviceAddress || 'Not entered'}</strong></div>
              <div className="summary-row summary-total"><span>Total</span><strong>{displayService.currency} {displayService.price.toLocaleString()}</strong></div>
            </div>

            {/* Form Action Footer */}
            {!selectedSlot && (
              <div className="booking-action-hint mt-3" role="status">
                <AlertCircle size={16} />
                <span>Select an available time slot in step 1 to enable booking.</span>
              </div>
            )}
            <ButtonGroup align="right" className="mt-3 pt-3 border-t border-color">
              <Button
                type="button"
                variant="secondary"
                onClick={onClose}
                disabled={activeMutation.isPending}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="primary"
                isLoading={activeMutation.isPending}
                disabled={!selectedSlot}
                leftIcon={<CheckCircle2 size={16} />}
              >
                {isEditMode ? 'Save Booking Changes' : 'Confirm Booking'}
              </Button>
            </ButtonGroup>
          </form>
          </>)}
        </div>
      </div>
    </div>
  );
}
