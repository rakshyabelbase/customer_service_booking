import type { Service } from '../../types';
import { Clock, Star, Edit3, Trash2, Calendar, Tag, Building2 } from 'lucide-react';

type ServiceCardProps = {
  service: Service;
  onEdit: (service: Service) => void;
  onDelete: (service: Service) => void;
  onCheckAvailability: (service: Service) => void;
};

export function ServiceCard({
  service,
  onEdit,
  onDelete,
  onCheckAvailability,
}: ServiceCardProps) {
  return (
    <article className="service-card">
      <div className="service-card-media">
        <img
          src={service.imageUrl || 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=600&q=80'}
          alt={service.name}
          className="service-card-image"
          loading="lazy"
        />
        <div className="service-badge-category">
          <Tag size={12} />
          <span>{service.category}</span>
        </div>
        <div className="service-badge-rating">
          <Star size={12} className="star-filled" />
          <span>{service.rating.toFixed(1)}</span>
        </div>
      </div>

      <div className="service-card-body">
        <h3 className="service-card-title">{service.name}</h3>
        <p className="service-card-desc">{service.description}</p>

        <div className="service-meta-grid">
          <div className="service-meta-item">
            <Building2 size={14} className="meta-icon" />
            <span className="meta-text">{service.provider.name}</span>
          </div>

          <div className="service-meta-item">
            <Clock size={14} className="meta-icon" />
            <span className="meta-text">{service.durationMinutes} mins</span>
          </div>
        </div>

        <div className="service-card-divider" />

        <div className="service-card-footer">
          <div className="service-price-block">
            <span className="price-label">Price</span>
            <span className="price-value">
              {service.currency} {service.price.toLocaleString()}
            </span>
          </div>

          <div className="service-card-actions">
            <button
              type="button"
              className="btn-action btn-action-edit"
              onClick={() => onEdit(service)}
              title="Edit service details"
            >
              <Edit3 size={15} />
              <span>Edit</span>
            </button>

            <button
              type="button"
              className="btn-action btn-action-delete"
              onClick={() => onDelete(service)}
              title="Delete service"
            >
              <Trash2 size={15} />
              <span>Delete</span>
            </button>

            <button
              type="button"
              className="btn-action btn-action-slots"
              onClick={() => onCheckAvailability(service)}
              title="Check slot availability"
            >
              <Calendar size={15} />
              <span>Slots</span>
            </button>
          </div>
        </div>
      </div>
    </article>
  );
}
