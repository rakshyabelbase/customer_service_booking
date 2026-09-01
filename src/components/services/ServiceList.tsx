import { useState } from 'react';
import { useServicesQuery, useCreateServiceMutation, useUpdateServiceMutation, useDeleteServiceMutation } from '../../features/services/hooks/useServices';
import { ApiError, type Service, type CreateServiceDto, type ServiceQueryParams } from '../../types';
import { ServiceCard } from './ServiceCard';
import { ServiceFormModal } from './ServiceFormModal';
import { ConfirmDeleteModal } from './ConfirmDeleteModal';
import { AvailabilityModal } from './AvailabilityModal';
import { Search, Plus, Filter, RotateCcw, AlertOctagon, Layers, Frown } from 'lucide-react';

const CATEGORIES = [
  'All',
  'Home Cleaning',
  'Electrical',
  'Plumbing',
  'Appliance',
  'Auto Care',
];

export function ServiceList() {
  const [params, setParams] = useState<ServiceQueryParams>({
    search: '',
    category: 'All',
  });

  // Modal State
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [editingService, setEditingService] = useState<Service | null>(null);

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deletingService, setDeletingService] = useState<Service | null>(null);

  const [isAvailabilityModalOpen, setIsAvailabilityModalOpen] = useState(false);
  const [availabilityService, setAvailabilityService] = useState<Service | null>(null);

  // TanStack Query Hooks
  const servicesQuery = useServicesQuery(params);
  const createMutation = useCreateServiceMutation();
  const updateMutation = useUpdateServiceMutation();
  const deleteMutation = useDeleteServiceMutation();

  const services = servicesQuery.data?.data || [];
  const queryError = servicesQuery.error instanceof ApiError ? servicesQuery.error : null;

  // Event Handlers for Add/Edit Form
  const handleOpenAddModal = () => {
    setEditingService(null);
    createMutation.reset();
    updateMutation.reset();
    setIsFormModalOpen(true);
  };

  const handleOpenEditModal = (service: Service) => {
    setEditingService(service);
    createMutation.reset();
    updateMutation.reset();
    setIsFormModalOpen(true);
  };

  const handleFormSubmit = async (formData: CreateServiceDto) => {
    if (editingService) {
      await updateMutation.mutateAsync({ id: editingService.id, dto: formData });
    } else {
      await createMutation.mutateAsync(formData);
    }
    setIsFormModalOpen(false);
  };

  // Event Handlers for Delete Confirmation
  const handleOpenDeleteModal = (service: Service) => {
    setDeletingService(service);
    deleteMutation.reset();
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!deletingService) return;
    try {
      await deleteMutation.mutateAsync(deletingService.id);
      setIsDeleteModalOpen(false);
    } catch {
      // Error kept in deleteMutation for 409 conflict display inside modal
    }
  };

  // Event Handlers for Availability Modal
  const handleOpenAvailabilityModal = (service: Service) => {
    setAvailabilityService(service);
    setIsAvailabilityModalOpen(true);
  };

  return (
    <section className="service-list-section">
      {/* Top Header & Search Bar */}
      <div className="section-header-bar">
        <div className="section-title-group">
          <div className="icon-badge">
            <Layers size={20} />
          </div>
          <div>
            <h1 className="section-main-title">Bookable Service Directory</h1>
            <p className="section-subtitle">
              Manage, edit, and explore available customer service offerings in real-time.
            </p>
          </div>
        </div>

        <button
          type="button"
          className="btn-primary-add"
          onClick={handleOpenAddModal}
        >
          <Plus size={18} />
          <span>Add New Service</span>
        </button>
      </div>

      {/* Filter & Search Bar */}
      <div className="filter-toolbar">
        <div className="search-input-wrapper">
          <Search size={18} className="search-icon" />
          <input
            type="text"
            className="search-input"
            placeholder="Search services by title, provider, or keyword..."
            value={params.search || ''}
            onChange={(e) => setParams((prev) => ({ ...prev, search: e.target.value }))}
          />
          {params.search && (
            <button
              type="button"
              className="clear-search-btn"
              onClick={() => setParams((prev) => ({ ...prev, search: '' }))}
            >
              &times;
            </button>
          )}
        </div>

        <div className="category-pills-bar">
          <Filter size={16} className="filter-label-icon" />
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              type="button"
              className={`category-pill ${params.category === cat ? 'active' : ''}`}
              onClick={() => setParams((prev) => ({ ...prev, category: cat }))}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* 1. LOADING STATE: SKELETON CARDS */}
      {servicesQuery.isLoading && (
        <div className="services-grid" aria-label="Loading services">
          {[1, 2, 3, 4, 5, 6].map((idx) => (
            <div key={idx} className="skeleton-card">
              <div className="skeleton-media pulse-anim" />
              <div className="skeleton-body">
                <div className="skeleton-title pulse-anim" />
                <div className="skeleton-text pulse-anim" />
                <div className="skeleton-text short pulse-anim" />
                <div className="skeleton-meta-row pulse-anim" />
                <div className="skeleton-divider" />
                <div className="skeleton-price-row">
                  <div className="skeleton-price pulse-anim" />
                  <div className="skeleton-icons-group pulse-anim" />
                </div>
                <div className="skeleton-primary-btn pulse-anim" />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 2. ERROR STATE: ERROR CARD WITH RETRY ACTION */}
      {servicesQuery.isError && !servicesQuery.isLoading && (
        <div className="error-state-card">
          <div className="error-icon-box">
            <AlertOctagon size={48} className="icon-error-main" />
          </div>
          <h2 className="error-state-title">
            HTTP {queryError?.statusCode || 500} — Data Fetch Failed
          </h2>
          <p className="error-state-message">
            {queryError?.message || 'Failed to retrieve service listing from backend server.'}
          </p>
          <div className="error-state-actions">
            <button
              type="button"
              className="btn-retry-main"
              onClick={() => servicesQuery.refetch()}
            >
              <RotateCcw size={16} />
              <span>Retry Request</span>
            </button>
          </div>
        </div>
      )}

      {/* 3. EMPTY STATE */}
      {!servicesQuery.isLoading && !servicesQuery.isError && services.length === 0 && (
        <div className="empty-state-card">
          <div className="empty-icon-box">
            <Frown size={48} />
          </div>
          <h2 className="empty-state-title">No Services Found</h2>
          <p className="empty-state-message">
            {params.search || (params.category && params.category !== 'All')
              ? `No services matched your filter "${params.search || params.category}".`
              : 'There are currently no bookable services available in the system.'}
          </p>
          <div className="empty-state-actions">
            {(params.search || (params.category && params.category !== 'All')) && (
              <button
                type="button"
                className="btn-secondary-reset"
                onClick={() => setParams({ search: '', category: 'All' })}
              >
                <RotateCcw size={16} />
                <span>Reset Filters</span>
              </button>
            )}
            <button
              type="button"
              className="btn-primary-add"
              onClick={handleOpenAddModal}
            >
              <Plus size={16} />
              <span>Add Service Now</span>
            </button>
          </div>
        </div>
      )}

      {/* 4. SUCCESS STATE: SERVICES GRID */}
      {!servicesQuery.isLoading && !servicesQuery.isError && services.length > 0 && (
        <div className="services-grid">
          {services.map((service) => (
            <ServiceCard
              key={service.id}
              service={service}
              onEdit={handleOpenEditModal}
              onDelete={handleOpenDeleteModal}
              onCheckAvailability={handleOpenAvailabilityModal}
              isDeleting={deletingService?.id === service.id && deleteMutation.isPending}
            />
          ))}
        </div>
      )}

      {/* MODALS */}
      <ServiceFormModal
        isOpen={isFormModalOpen}
        onClose={() => setIsFormModalOpen(false)}
        onSubmit={handleFormSubmit}
        initialData={editingService}
        isPending={createMutation.isPending || updateMutation.isPending}
        serverError={createMutation.error || updateMutation.error}
      />

      <ConfirmDeleteModal
        isOpen={isDeleteModalOpen}
        service={deletingService}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
        isPending={deleteMutation.isPending}
        deleteError={deleteMutation.error}
      />

      <AvailabilityModal
        isOpen={isAvailabilityModalOpen}
        service={availabilityService}
        onClose={() => setIsAvailabilityModalOpen(false)}
      />
    </section>
  );
}
