const NOTCH_COLOR = {
  histology: "bg-histology",
  pharm: "bg-pharm",
  quiz: "bg-quiz",
  fav: "bg-fav",
};

/**
 * Die-cut "index card" notch used on every card in the app.
 * `variant` must be one of the keys in NOTCH_COLOR.
 */
export default function CardNotch({ variant }) {
  return (
    <span
      aria-hidden="true"
      className={`absolute top-0 start-[18px] w-[22px] h-2 rounded-b-md ${NOTCH_COLOR[variant]}`}
    />
  );
}
