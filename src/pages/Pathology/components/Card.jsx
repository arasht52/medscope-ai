import "./Card.css";

/**
 * Card — generic content card used across Pathology's list/detail screens.
 * Props:
 *  - as: element type to render (default "div")
 *  - interactive: adds hover/press affordance (for clickable cards / links)
 */
export default function Card({ as: As = "div", interactive = false, className = "", children, ...rest }) {
  return (
    <As className={`path-card ${interactive ? "path-card--interactive" : ""} ${className}`} {...rest}>
      {children}
    </As>
  );
}
