import Button from "./Button";
import "./settingsComponents.css";

/**
 * Shared confirmation modal for destructive actions.
 * Reusable by any module (e.g. "remove all favorites", "delete entry").
 */
export default function ConfirmModal({
  open,
  title,
  message,
  confirmLabel = "تایید",
  cancelLabel = "انصراف",
  onConfirm,
  onCancel,
}) {
  if (!open) return null;

  return (
    <div className="set-modal-overlay" onClick={onCancel}>
      <div
        className="set-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="set-modal-title"
        aria-describedby="set-modal-message"
        onClick={(e) => e.stopPropagation()}
      >
        <h3 id="set-modal-title" className="set-modal__title">{title}</h3>
        <p id="set-modal-message" className="set-modal__message">{message}</p>
        <div className="set-modal__actions">
          <Button variant="secondary" onClick={onCancel}>
            {cancelLabel}
          </Button>
          <Button variant="danger" onClick={onConfirm}>
            {confirmLabel}
          </Button>
        </div>
      </div>
    </div>
  );
}
