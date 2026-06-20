import "./Card.css";

/**
 * Shared Card — generic content card used across list/detail screens.
 * Props:
 *  - as: element type to render (default "div")
 *  - interactive: adds hover/press affordance (for clickable cards / links)
 */
export default function Card({ as: As = "div", interactive = false, className = "", children, ...rest }) {
  return (
    <As className={`card ${interactive ? "card--interactive" : ""} ${className}`} {...rest}>
      {children}
    </As>
  );
}
