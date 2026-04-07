/**
 * Safe sessionStorage JSON read. Empty or invalid JSON returns null and removes corrupt keys.
 */
export function readSessionJson<T>(key: string): T | null {
  if (typeof window === "undefined") return null;
  const raw = sessionStorage.getItem(key);
  if (raw == null || !String(raw).trim()) return null;
  try {
    return JSON.parse(raw) as T;
  } catch {
    try {
      sessionStorage.removeItem(key);
    } catch {
      /* ignore */
    }
    return null;
  }
}
