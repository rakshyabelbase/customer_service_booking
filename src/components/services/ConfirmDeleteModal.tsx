import type { Service, ApiError } from '../../types';
import { AlertTriangle, Trash2, Loader2, X, ShieldAlert } from 'lucide-react';

type ConfirmDeleteModalProps = {
  isOpen: boolean;
  service: Service | null;
  onClose: () => void;
  onConfirm: () => Promise<void>;
  isPending: boolean;
  deleteError?: ApiError | null;
};

export function ConfirmDeleteModal({
  isOpen,
  service,
  onClose,
  onConfirm,
  isPending,
  deleteError,
}: ConfirmDeleteModalProps) {
  if (!isOpen || !service) return null;

  const isConflictError = deleteError?.statusCode === 409 || deleteError?.code === 'ACTIVE_BOOKINGS_CONFLICT';

  return (
    <div className="modal-backdrop" onClick={onClose} role="dialog" aria-modal="true">
      <div className="modal-container modal-small" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header header-danger">
          <div className="modal-title text-danger">
            <AlertTriangle size={22} />
            <span>Confirm Delete Service</span>
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

        <div className="modal-body-padded">
          {isConflictError ? (
            <div className="conflict-alert-box">
              <div className="conflict-icon-wrapper">
                <ShieldAlert size={32} className="text-danger" />
              </div>
              <div className="conflict-content">
                <h4 className="conflict-title">HTTP 409 Conflict: Cannot Delete Service</h4>
                <p className="conflict-message">{deleteError.message}</p>
                <div className="conflict-hint">
                  <strong>Business Rule Enforced:</strong> Services with active customer bookings cannot be deleted from the database until all related bookings are cancelled or fulfilled.
                </div>
              </div>
            </div>
          ) : (
            <>
              <p className="confirm-text">
                Are you sure you want to permanently delete <strong>"{service.name}"</strong>?
              </p>
              <p className="confirm-subtext">
                This action will remove the service from customer listings. This operation cannot be undone.
              </p>

              {deleteError && (
                <div className="form-alert-error">
                  <strong>Error ({deleteError.statusCode}):</strong> {deleteError.message}
                </div>
              )}
            </>
          )}
        </div>

        <div className="modal-footer">
          <button
            type="button"
            className="btn-cancel"
            onClick={onClose}
            disabled={isPending}
          >
            {isConflictError ? 'Close' : 'Cancel'}
          </button>
          {!isConflictError && (
            <button
              type="button"
              className="btn-delete-confirm"
              onClick={onConfirm}
              disabled={isPending}
            >
              {isPending ? (
                <>
                  <Loader2 size={16} className="spin-icon" />
                  <span>Deleting...</span>
                </>
              ) : (
                <>
                  <Trash2 size={16} />
                  <span>Yes, Delete Service</span>
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
