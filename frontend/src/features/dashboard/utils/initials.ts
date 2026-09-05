/**
 * Extracts a 2-character initials string from a person or company name.
 * For example:
 * - "Budi Santoso" -> "BS"
 * - "Budi Santoso Putra" -> "BS"
 * - "Klipday" -> "KL"
 * - "" / undefined -> "KD"
 *
 * @param name - The full name or company name to extract initials from.
 * @returns An uppercase string with up to 2 characters representing the initials.
 */
export function GetInitials(name?: string | null): string {
  if (!name || typeof name !== 'string') {
    return 'KD';
  }

  const cleanName = name.trim();
  if (cleanName.length === 0) {
    return 'KD';
  }

  const words = cleanName.split(/\s+/).filter(Boolean);

  if (words.length >= 2) {
    const firstInitial = words[0].charAt(0);
    const secondInitial = words[1].charAt(0);
    const initials = `${firstInitial}${secondInitial}`.toUpperCase();
    return initials;
  }

  const singleWord = words[0];
  if (singleWord.length >= 2) {
    const initials = singleWord.slice(0, 2).toUpperCase();
    return initials;
  }

  const initials = singleWord.charAt(0).toUpperCase();
  return initials;
}
