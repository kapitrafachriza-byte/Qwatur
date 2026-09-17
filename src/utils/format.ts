/**
 * Currency and value formatting utilities.
 */

/**
 * Bulletproof, platform-independent Indonesian Rupiah number formatter.
 * Formats a number with thousands separators (dots), e.g. 15000 -> "15.000".
 */
export function formatRupiah(amount: number): string {
  if (!Number.isFinite(amount)) return '0';
  const abs = Math.abs(Math.round(amount));
  const str = abs.toString();
  const parts: string[] = [];
  for (let i = str.length; i > 0; i -= 3) {
    parts.unshift(str.substring(Math.max(0, i - 3), i));
  }
  return parts.join('.');
}
