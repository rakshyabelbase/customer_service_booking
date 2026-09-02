import { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import type { Booking } from '../../types';
import {
  useServiceQuery,
  useUpdateServiceMutation,
  useDeleteServiceMutation,
} from '../../features/services/hooks/useServices';
import {
  ArrowLeft,
  Calendar,
  Clock,
  Star,
  Building2,
  Tag,
  Edit3,
  Trash2,
  AlertCircle,
  RefreshCw,
  Users,
  CheckCircle2,
} from 'lucide-react';
import { BookingList } from '../bookings/BookingList';
import { BookingModal } from '../bookings/BookingModal';
import { BookingDetailModal } from '../bookings/BookingDetailModal';
import { ServiceFormModal } from './ServiceFormModal';
import { ConfirmDeleteModal } from './ConfirmDeleteModal';
import { ApiError } from '../../types';
import { TodayAvailabilityPill } from './TodayAvailabilityPill';

export function ServiceDetailPage() {
  const { serviceId } = useParams<{ serviceId: string }>();
  const navigate = useNavigate();

  const serviceQuery = useServiceQuery(serviceId || '', Boolean(serviceId));
  const updateServiceMutation = useUpdateServiceMutation();
  const deleteServiceMutation = useDeleteServiceMutation();

  // Modal States
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [editingBooking, setEditingBooking] = useState<Booking | null>(null);
  const [viewingBookingId, setViewingBookingId] = useState<string | null>(null);

  const [isServiceEditOpen, setIsServiceEditOpen] = useState(false);
  const [isServiceDeleteOpen, setIsServiceDeleteOpen] = useState(false);

  const service = serviceQuery.data?.data;
  // Keep the rendered page and any open modal mounted during background refetches.
  // A full-page skeleton is only appropriate before the first service response.
  const isLoading = serviceQuery.isLoading;
  const serviceError = serviceQuery.error instanceof ApiError ? serviceQuery.error : null;
  const updateServiceError =
    updateServiceMutation.error instanceof ApiError ? updateServiceMutation.error : null;
  const deleteServiceError =
    deleteServiceMutation.error instanceof ApiError ? deleteServiceMutation.error : null;

  const handleOpenNewBooking = () => {
    setEditingBooking(null);
    setIsBookingModalOpen(true);
  };

  const handleOpenEditBooking = (bookingToEdit: Booking) => {
    setEditingBooking(bookingToEdit);
    setIsBookingModalOpen(true);
  };

  const handleConfirmDeleteService = async () => {
    if (!service) return;
    try {
      await deleteServiceMutation.mutateAsync(service.id);
      setIsServiceDeleteOpen(false);
      navigate('/');
    } catch {
      // Handled by mutation toast
    }
  };

  // 1. Loading State
  if (isLoading) {
    return (
      <div className="service-detail-container animate-pulse">
        <div className="skeleton-line w-32 h-6 mb-4" />
        <div className="service-detail-hero-skeleton">
          <div className="skeleton-media" />
          <div className="skeleton-content">
            <div className="skeleton-line w-3/4 h-8" />
            <div className="skeleton-line w-1/2 h-5 mt-3" />
            <div className="skeleton-line w-full h-16 mt-4" />
          </div>
        </div>
      </div>
    );
  }

  // 2. Error State (e.g. 500 or Network Failure)
  if (serviceQuery.isError && serviceError?.statusCode !== 404) {
    return (
      <div className="service-detail-container py-8">
        <div className="form-alert-error max-w-xl mx-auto">
          <AlertCircle size={24} />
          <div>
            <h3>Error Loading Service Details</h3>
            <p>{serviceQuery.error?.message || 'Unable to retrieve service details.'}</p>
          </div>
          <button
            type="button"
            className="btn-retry-inline ml-auto"
            onClick={() => serviceQuery.refetch()}
          >
            <RefreshCw size={16} className="mr-1" /> Retry
          </button>
        </div>
      </div>
    );
  }

  // 3. Not Found (404) State
  if (!service || serviceError?.statusCode === 404) {
    return (
      <div className="service-detail-container py-12 text-center">
        <div className="not-found-card max-w-md mx-auto card-glass p-8">
          <div className="not-found-icon-circle mx-auto mb-4">
            <AlertCircle size={40} className="text-warning" />
          </div>
          <h2 className="text-2xl font-bold">Service Not Found</h2>
          <p className="text-muted mt-2">
            The service with ID <code className="text-code">'{serviceId}'</code> could not be found or may have been deleted.
          </p>
          <div className="mt-6">
            <Link to="/" className="btn-primary flex-align inline-flex">
              <ArrowLeft size={16} className="mr-2" />
              <span>Back to Services List</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // 4. Success State Page Render
  return (
    <div className="service-detail-container">
      {/* Top Breadcrumb / Back Button */}
      <div className="detail-top-bar flex-between align-center mb-4">
        <Link to="/" className="btn-back flex-align">
          <ArrowLeft size={18} className="mr-1" />
          <span>Back to All Services</span>
        </Link>

        <div className="detail-actions-top flex-align gap-2">
          <button
            type="button"
            className="btn-secondary-sm flex-align"
            onClick={() => setIsServiceEditOpen(true)}
          >
            <Edit3 size={15} className="mr-1" />
            <span>Edit Service</span>
          </button>

          <button
            type="button"
            className="btn-danger-sm flex-align"
            onClick={() => setIsServiceDeleteOpen(true)}
          >
            <Trash2 size={15} className="mr-1" />
            <span>Delete Service</span>
          </button>
        </div>
      </div>

      {/* Hero Banner Section */}
      <div className="service-detail-hero card-glass">
        <div className="hero-grid">
          <div className="hero-media-wrapper">
            <img
              src={
                service.imageUrl ||
                'https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=600&q=80'
              }
              alt={service.name}
              className="hero-image"
            />
            <div className="hero-badges">
              <span className="pill pill-category">
                <Tag size={12} className="mr-1" />
                {service.category}
              </span>
              <span className="pill pill-rating">
                <Star size={12} className="star-filled mr-1" />
                {service.rating.toFixed(1)}
              </span>
            </div>
          </div>

          <div className="hero-content">
            <div className="flex-between align-start">
              <div>
                <h1 className="hero-title">{service.name}</h1>
                <div className="hero-provider flex-align mt-1">
                  <Building2 size={16} className="text-primary mr-1" />
                  <span>Provided by <strong>{service.provider.name}</strong></span>
                </div>
              </div>

              <div className="hero-price-tag">
                <span className="price-label block text-xs text-muted">Price</span>
                <span className="price-value text-2xl font-extrabold text-primary">
                  {service.currency} {service.price.toLocaleString()}
                </span>
              </div>
            </div>

            <p className="hero-description mt-3">{service.description}</p>

            <div className="hero-meta-strip mt-4 flex-align gap-4">
              <div className="meta-pill">
                <Clock size={15} className="text-secondary mr-1" />
                <span>Duration: <strong>{service.durationMinutes} mins</strong></span>
              </div>

              <div className="meta-pill">
                <Users size={15} className="text-secondary mr-1" />
                <span>Active Bookings: <strong>{service.activeBookingsCount || 0}</strong></span>
              </div>

              <TodayAvailabilityPill serviceId={service.id} onClick={handleOpenNewBooking} />
            </div>

            <div className="hero-cta-row mt-6 pt-4 border-t border-color flex-between align-center">
              <div className="hero-guarantee flex-align text-xs text-muted">
                <CheckCircle2 size={16} className="text-success mr-1" />
                <span>Instant Confirmation & Flexible Slot Selection</span>
              </div>

              <button
                type="button"
                className="btn-book-hero flex-align"
                onClick={handleOpenNewBooking}
              >
                <Calendar size={18} className="mr-2" />
                <span>Book This Service Now</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Bookings Section */}
      <div className="mt-8">
        <BookingList
          serviceId={service.id}
          service={service}
          onOpenBookingModal={(_svc, bookingToEdit) => {
            if (bookingToEdit) {
              handleOpenEditBooking(bookingToEdit);
            } else {
              handleOpenNewBooking();
            }
          }}
          onSelectBooking={(b) => setViewingBookingId(b.id)}
        />
      </div>

      {/* Booking Create/Edit Modal */}
      <BookingModal
        isOpen={isBookingModalOpen}
        service={service}
        booking={editingBooking}
        onClose={() => {
          setIsBookingModalOpen(false);
          setEditingBooking(null);
        }}
      />

      {/* Booking Detail View Modal */}
      <BookingDetailModal
        bookingId={viewingBookingId}
        service={service}
        onClose={() => setViewingBookingId(null)}
        onEdit={(bookingToEdit) => {
          setViewingBookingId(null);
          handleOpenEditBooking(bookingToEdit);
        }}
        onCancel={() => {
          setViewingBookingId(null);
        }}
      />

      {/* Service Edit Modal */}
      {isServiceEditOpen && (
        <ServiceFormModal
          isOpen={isServiceEditOpen}
          initialData={service}
          isPending={updateServiceMutation.isPending}
          serverError={updateServiceError}
          onClose={() => setIsServiceEditOpen(false)}
          onSubmit={async (dto) => {
            await updateServiceMutation.mutateAsync({ id: service.id, dto });
            setIsServiceEditOpen(false);
          }}
        />
      )}

      {/* Service Delete Confirm Modal */}
      <ConfirmDeleteModal
        isOpen={isServiceDeleteOpen}
        service={service}
        isPending={deleteServiceMutation.isPending}
        deleteError={deleteServiceError}
        onClose={() => setIsServiceDeleteOpen(false)}
        onConfirm={handleConfirmDeleteService}
      />
    </div>
  );
}
