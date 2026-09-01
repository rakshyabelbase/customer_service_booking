import React, { useState, useEffect } from 'react';
import type { Service, CreateServiceDto, FieldErrors, ApiError } from '../../types';
import { X, Loader2, PlusCircle, Save } from 'lucide-react';

interface ServiceFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (formData: CreateServiceDto) => Promise<void>;
  initialData?: Service | null;
  isPending: boolean;
  serverError?: ApiError | null;
}

const CATEGORIES = [
  'Home Cleaning',
  'Electrical',
  'Plumbing',
  'Appliance',
  'Auto Care',
  'Beauty & Wellness',
  'Carpentry',
  'Pest Control',
];

export const ServiceFormModal: React.FC<ServiceFormModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  initialData,
  isPending,
  serverError,
}) => {
  const isEditMode = Boolean(initialData);

  const [formData, setFormData] = useState<CreateServiceDto>({
    name: '',
    description: '',
    category: 'Home Cleaning',
    providerName: '',
    price: 1500,
    currency: 'NPR',
    durationMinutes: 60,
    imageUrl: '',
  });

  const [clientErrors, setClientErrors] = useState<FieldErrors>({});

  // Reset or populate form when modal opens or initialData changes
  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name,
        description: initialData.description,
        category: initialData.category,
        providerName: initialData.provider.name,
        price: initialData.price,
        currency: initialData.currency || 'NPR',
        durationMinutes: initialData.durationMinutes,
        imageUrl: initialData.imageUrl || '',
      });
    } else {
      setFormData({
        name: '',
        description: '',
        category: 'Home Cleaning',
        providerName: '',
        price: 1500,
        currency: 'NPR',
        durationMinutes: 60,
        imageUrl: '',
      });
    }
    setClientErrors({});
  }, [initialData, isOpen]);

  // Combine client-side errors and server-returned field errors
  const activeErrors: FieldErrors = {
    ...clientErrors,
    ...(serverError?.fieldErrors || {}),
  };

  if (!isOpen) return null;

  const validateForm = (): boolean => {
    const errors: FieldErrors = {};

    if (!formData.name.trim()) {
      errors.name = 'Service name is required.';
    } else if (formData.name.trim().length < 3) {
      errors.name = 'Service name must be at least 3 characters.';
    }

    if (!formData.description.trim()) {
      errors.description = 'Description is required.';
    }

    if (!formData.category.trim()) {
      errors.category = 'Category is required.';
    }

    if (!formData.providerName.trim()) {
      errors.providerName = 'Provider name is required.';
    }

    if (formData.price === undefined || formData.price === null || isNaN(formData.price)) {
      errors.price = 'Price is required.';
    } else if (formData.price <= 0) {
      errors.price = 'Price must be a positive number greater than 0.';
    }

    if (
      formData.durationMinutes === undefined ||
      formData.durationMinutes === null ||
      isNaN(formData.durationMinutes)
    ) {
      errors.durationMinutes = 'Duration is required.';
    } else if (formData.durationMinutes < 15) {
      errors.durationMinutes = 'Duration must be at least 15 minutes.';
    }

    setClientErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    try {
      await onSubmit(formData);
    } catch {
      // Error handled by mutation hook
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'number' ? (value === '' ? 0 : Number(value)) : value,
    }));

    if (clientErrors[name]) {
      setClientErrors((prev) => {
        const next = { ...prev };
        delete next[name];
        return next;
      });
    }
  };

  return (
    <div className="modal-backdrop" onClick={onClose} role="dialog" aria-modal="true">
      <div className="modal-container" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-title">
            {isEditMode ? (
              <>
                <Save size={20} className="text-primary" />
                <span>Edit Service Specifications</span>
              </>
            ) : (
              <>
                <PlusCircle size={20} className="text-primary" />
                <span>Add New Service Offering</span>
              </>
            )}
          </div>
          <button
            type="button"
            className="modal-close-btn"
            onClick={onClose}
            aria-label="Close modal"
            disabled={isPending}
          >
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="modal-form">
          {serverError && !serverError.fieldErrors && (
            <div className="form-alert-error">
              <strong>Error ({serverError.statusCode}):</strong> {serverError.message}
            </div>
          )}

          <div className="form-group">
            <label htmlFor="name" className="form-label">
              Service Name <span className="text-required">*</span>
            </label>
            <input
              type="text"
              id="name"
              name="name"
              className={`form-input ${activeErrors.name ? 'input-error' : ''}`}
              placeholder="e.g. Home Deep Cleaning"
              value={formData.name}
              onChange={handleChange}
              disabled={isPending}
            />
            {activeErrors.name && <span className="field-error">{activeErrors.name}</span>}
          </div>

          <div className="form-row">
            <div className="form-group col-half">
              <label htmlFor="category" className="form-label">
                Category <span className="text-required">*</span>
              </label>
              <select
                id="category"
                name="category"
                className={`form-select ${activeErrors.category ? 'input-error' : ''}`}
                value={formData.category}
                onChange={handleChange}
                disabled={isPending}
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
              {activeErrors.category && <span className="field-error">{activeErrors.category}</span>}
            </div>

            <div className="form-group col-half">
              <label htmlFor="providerName" className="form-label">
                Provider Name <span className="text-required">*</span>
              </label>
              <input
                type="text"
                id="providerName"
                name="providerName"
                className={`form-input ${activeErrors.providerName ? 'input-error' : ''}`}
                placeholder="e.g. CleanCare Services"
                value={formData.providerName}
                onChange={handleChange}
                disabled={isPending}
              />
              {activeErrors.providerName && (
                <span className="field-error">{activeErrors.providerName}</span>
              )}
            </div>
          </div>

          <div className="form-row">
            <div className="form-group col-half">
              <label htmlFor="price" className="form-label">
                Price (NPR) <span className="text-required">*</span>
              </label>
              <input
                type="number"
                id="price"
                name="price"
                min="1"
                step="50"
                className={`form-input ${activeErrors.price ? 'input-error' : ''}`}
                value={formData.price || ''}
                onChange={handleChange}
                disabled={isPending}
              />
              {activeErrors.price && <span className="field-error">{activeErrors.price}</span>}
            </div>

            <div className="form-group col-half">
              <label htmlFor="durationMinutes" className="form-label">
                Duration (Minutes) <span className="text-required">*</span>
              </label>
              <input
                type="number"
                id="durationMinutes"
                name="durationMinutes"
                min="15"
                step="15"
                className={`form-input ${activeErrors.durationMinutes ? 'input-error' : ''}`}
                value={formData.durationMinutes || ''}
                onChange={handleChange}
                disabled={isPending}
              />
              {activeErrors.durationMinutes && (
                <span className="field-error">{activeErrors.durationMinutes}</span>
              )}
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="imageUrl" className="form-label">
              Cover Image URL (Optional)
            </label>
            <input
              type="url"
              id="imageUrl"
              name="imageUrl"
              className="form-input"
              placeholder="https://images.unsplash.com/..."
              value={formData.imageUrl}
              onChange={handleChange}
              disabled={isPending}
            />
          </div>

          <div className="form-group">
            <label htmlFor="description" className="form-label">
              Description <span className="text-required">*</span>
            </label>
            <textarea
              id="description"
              name="description"
              rows={3}
              className={`form-textarea ${activeErrors.description ? 'input-error' : ''}`}
              placeholder="Provide detailed description of what is included..."
              value={formData.description}
              onChange={handleChange}
              disabled={isPending}
            />
            {activeErrors.description && (
              <span className="field-error">{activeErrors.description}</span>
            )}
          </div>

          <div className="modal-footer">
            <button
              type="button"
              className="btn-cancel"
              onClick={onClose}
              disabled={isPending}
            >
              Cancel
            </button>
            <button type="submit" className="btn-submit" disabled={isPending}>
              {isPending ? (
                <>
                  <Loader2 size={16} className="spin-icon" />
                  <span>{isEditMode ? 'Saving Changes...' : 'Creating Service...'}</span>
                </>
              ) : (
                <span>{isEditMode ? 'Update Service' : 'Create Service'}</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
