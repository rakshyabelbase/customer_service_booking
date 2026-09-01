import { useState, useRef, useEffect } from 'react';
import { MoreVertical, Edit3, Calendar, Trash2 } from 'lucide-react';
import type { Service } from '../../types';

type CardActionsMenuProps = {
  service: Service;
  onEdit: (service: Service) => void;
  onDelete: (service: Service) => void;
  onCheckAvailability: (service: Service) => void;
};

export function CardActionsMenu({
  service,
  onEdit,
  onDelete,
  onCheckAvailability,
}: CardActionsMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        menuRef.current &&
        event.target instanceof Node &&
        !menuRef.current.contains(event.target)
      ) {
        setIsOpen(false);
      }
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  const toggleMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsOpen((prev) => !prev);
  };

  const handleAction = (e: React.MouseEvent, action: () => void) => {
    e.preventDefault();
    e.stopPropagation();
    setIsOpen(false);
    action();
  };

  return (
    <div className="card-actions-menu-container" ref={menuRef}>
      <button
        type="button"
        className={`btn-icon-action btn-icon-overflow ${isOpen ? 'active' : ''}`}
        onClick={toggleMenu}
        aria-label="More management actions"
        title="More actions"
      >
        <MoreVertical size={16} />
      </button>

      {isOpen && (
        <div className="card-menu-dropdown" role="menu">
          <button
            type="button"
            className="card-menu-item"
            onClick={(e) => handleAction(e, () => onEdit(service))}
            role="menuitem"
          >
            <Edit3 size={14} />
            <span>Edit Service</span>
          </button>

          <button
            type="button"
            className="card-menu-item"
            onClick={(e) => handleAction(e, () => onCheckAvailability(service))}
            role="menuitem"
          >
            <Calendar size={14} />
            <span>Manage Slots</span>
          </button>

          <div className="card-menu-divider" />

          <button
            type="button"
            className="card-menu-item card-menu-item-danger"
            onClick={(e) => handleAction(e, () => onDelete(service))}
            role="menuitem"
          >
            <Trash2 size={14} />
            <span>Delete Service</span>
          </button>
        </div>
      )}
    </div>
  );
}
