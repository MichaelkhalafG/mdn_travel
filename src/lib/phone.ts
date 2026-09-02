// Phone normalization for COMPARISON only (never stored or displayed):
// keep digits, drop the Egypt country code / international zeros / trunk
// zero, so "+20 100 555 7788", "0100-555-7788" and "00201005557788" all
// compare equal. Applied to BOTH sides at lookup time, which keeps
// comparisons consistent for every ticket regardless of how it was typed.
export function normalizePhone(phone: string): string {
  const digits = phone.replace(/\D/g, "");
  return digits.replace(/^0{0,2}20/, "").replace(/^0/, "");
}
