/**
 * Formats minor currency units (cents) into formatted localized strings.
 */
export function formatMinorUnits(amountInCents: number, currency = "USD"): string {
  const units = amountInCents / 100;
  try {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency.toUpperCase(),
      maximumFractionDigits: units % 1 === 0 ? 0 : 2,
    }).format(units);
  } catch {
    return `${currency.toUpperCase()} ${units.toLocaleString("en-US", {
      maximumFractionDigits: units % 1 === 0 ? 0 : 2,
    })}`;
  }
}

/**
 * Calculates percentage progress towards a goal.
 */
export function calculateProgress(raised: number, goal: number): number {
  if (!goal || goal <= 0) return 0;
  return Math.min(Math.round((raised / goal) * 100), 100);
}

/**
 * Formats ISO date into human-readable relative or standard string.
 */
export function formatRelativeDate(dateInput: string | Date | null | undefined): string {
  if (!dateInput) return "Recently";
  const date = typeof dateInput === "string" ? new Date(dateInput) : dateInput;
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffInSeconds < 60) return "Just now";
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
  if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d ago`;

  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: date.getFullYear() !== now.getFullYear() ? "numeric" : undefined,
  });
}
