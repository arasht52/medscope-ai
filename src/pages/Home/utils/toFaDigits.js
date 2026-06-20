const FA_DIGITS = ["۰", "۱", "۲", "۳", "۴", "۵", "۶", "۷", "۸", "۹"];

/** Converts an integer's Arabic-numeral string into Persian digits. */
export function toFaDigits(value) {
  return String(value)
    .split("")
    .map((ch) => (FA_DIGITS[ch] !== undefined ? FA_DIGITS[ch] : ch))
    .join("");
}
