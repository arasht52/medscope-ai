import "./settingsComponents.css";

/**
 * Shared Button. variant: "primary" | "secondary" | "danger"
 */
export default function Button({
  children,
  onClick,
  variant = "primary",
  disabled = false,
  type = "button",
}) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`set-btn set-btn--${variant}`}
    >
      {children}
    </button>
  );
}
