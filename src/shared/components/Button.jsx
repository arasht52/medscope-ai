import "./Button.css";

/**
 * Shared Button component.
 * variant: "primary" | "secondary" | "ghost"
 */
export default function Button({
  children,
  onClick,
  variant = "primary",
  disabled = false,
  type = "button",
  fullWidth = false,
}) {
  return (
    <button
      type={type}
      className={`ms-btn ms-btn--${variant} ${fullWidth ? "ms-btn--full" : ""}`.trim()}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
}
