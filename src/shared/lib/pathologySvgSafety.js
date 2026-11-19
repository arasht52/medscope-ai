// Scientific review is independent of copyright/open-license verification.
// Add exact public URLs only after explicit scientific approval.
export const scientificallyApprovedPathologySvgs = Object.freeze([]);

export function isPathologySvgScientificallyAllowed(value) {
  if (typeof value !== "string") return false;
  try {
    const path = decodeURIComponent(new URL(value, "https://medscope.invalid").pathname);
    if (!/^\/images\/pathology\/.*\.svg$/i.test(path)) return true;
    return scientificallyApprovedPathologySvgs.includes(path);
  } catch { return false; }
}
