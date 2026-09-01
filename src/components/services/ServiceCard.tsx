import type { Service } from '../../types';
import { Clock, Star, Edit3, Calendar, Tag, Building2, ArrowRight, Loader2 } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { CardActionsMenu } from '../common/CardActionsMenu';

export type ServiceCardProps = {
  service: Service;
  onEdit?: (service: Service) => void;
  onDelete?: (service: Service) => void;
  onCheckAvailability?: (service: Service) => void;
  onViewDetails?: (service: Service) => void;
  showManagementActions?: boolean;
  isDeleting?: boolean;
};

export function ServiceCard({
  service,
  onEdit,
  onDelete,
  onCheckAvailability,
  onViewDetails,
  showManagementActions = true,
  isDeleting = false,
}: ServiceCardProps) {
  const navigate = useNavigate();

  const handleCardClick = (e: React.MouseEvent) => {
    // If user clicked inside an action button or link, let it handle its own behavior
    if (
      e.target instanceof Element &&
      (e.target.closest('button') || e.target.closest('a'))
    ) {
      return;
    }
    if (onViewDetails) {
      onViewDetails(service);
    } else {
      navigate(`/services/${service.id}`);
    }
  };

  const handleEditClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onEdit?.(service);
  };

  const handleSlotsClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onCheckAvailability?.(service);
  };

  return (
    <article
      className={`service-card ${isDeleting ? 'service-card-deleting' : ''}`}
      onClick={handleCardClick}
    >
      {isDeleting && (
        <div className="service-card-deleting-overlay">
          <Loader2 size={24} className="spinner-anim" />
          <span>Deleting service...</span>
        </div>
      )}

      {/* Clickable Image Media Section */}
      <Link to={`/services/${service.id}`} className="service-card-media-link">
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
      </Link>

      {/* Main Content Area */}
      <div className="service-card-body">
        <Link to={`/services/${service.id}`} className="service-card-title-link">
          <h3 className="service-card-title">{service.name}</h3>
        </Link>

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

        {/* Card Footer with Price + Actions */}
        <div className="service-card-footer">
          <div className="service-price-row">
            <div className="service-price-block">
              <span className="price-label">Price</span>
              <span className="price-value">
                {service.currency} {service.price.toLocaleString()}
              </span>
            </div>

            {/* Secondary Admin Actions (Edit icon, Slots icon, Overflow Menu) */}
            {showManagementActions && (onEdit || onDelete || onCheckAvailability) && (
              <div className="service-card-secondary-actions">
                {onEdit && (
                  <button
                    type="button"
                    className="btn-icon-action btn-icon-edit"
                    onClick={handleEditClick}
                    aria-label="Edit service"
                    title="Edit service details"
                  >
                    <Edit3 size={15} />
                  </button>
                )}

                {onCheckAvailability && (
                  <button
                    type="button"
                    className="btn-icon-action btn-icon-slots"
                    onClick={handleSlotsClick}
                    aria-label="Manage slot availability"
                    title="Manage slots"
                  >
                    <Calendar size={15} />
                  </button>
                )}

                {onEdit && onDelete && onCheckAvailability && (
                  <CardActionsMenu
                    service={service}
                    onEdit={onEdit}
                    onDelete={onDelete}
                    onCheckAvailability={onCheckAvailability}
                  />
                )}
              </div>
            )}
          </div>

          {/* Primary Action Button (Full-width) */}
          <Link
            to={`/services/${service.id}`}
            className="btn-card-primary"
            onClick={(e) => {
              if (onViewDetails) {
                e.preventDefault();
                onViewDetails(service);
              }
            }}
          >
            <span>View Details</span>
            <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </article>
  );
}
