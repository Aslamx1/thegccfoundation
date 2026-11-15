/**
 * Converts a campaign title into a clean, URL-safe slug with unique random entropy.
 */
export function generateSlug(title: string): string {
  const cleanTitle = title
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // Remove diacritics
    .replace(/[^a-z0-9\s-]/g, "") // Keep alphanumeric, spaces, and hyphens
    .trim()
    .replace(/\s+/g, "-") // Replace spaces with hyphens
    .replace(/-+/g, "-") // Collapse consecutive hyphens
    .slice(0, 50); // Keep reasonable length

  const randomSuffix = Math.random().toString(36).substring(2, 8);
  return `${cleanTitle || "campaign"}-${randomSuffix}`;
}
