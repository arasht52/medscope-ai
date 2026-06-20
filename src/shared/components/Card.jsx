import "./Card.css";

/**
 * Shared Card component.
 * Used by Histology, Pharmacology, and Quiz modules for consistent
 * card-based layout per DESIGN_SYSTEM.md.
 */
export default function Card({ children, className = "", onClick, as = "div" }) {
  const Tag = as;
  return (
    <Tag
      className={`ms-card ${className}`.trim()}
      onClick={onClick}
      role={onClick ? "button" : undefined}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={
        onClick
          ? (e) => {
              if (e.key === "Enter" || e.key === " ") onClick(e);
            }
          : undefined
      }
    >
      {children}
    </Tag>
  );
}
