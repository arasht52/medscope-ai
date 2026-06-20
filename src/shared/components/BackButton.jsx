export default function BackButton({
  onClick
}) {
  return (
    <button
      className="back-button"
      onClick={onClick}
    >
      بازگشت
    </button>
  );
}