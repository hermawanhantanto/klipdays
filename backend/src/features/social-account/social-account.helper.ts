/**
 * Generates a random uppercase verification code in the format KD-XXXX.
 * Uses an alphanumeric character pool excluding ambiguous characters (I, O, 0, 1).
 *
 * @returns Formatted 7-character verification code string (e.g. 'KD-AB3X').
 */
export function GenerateVerificationCode(): string {
  // cspell:disable-next-line
  const characters = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let randomSegment = '';

  for (let i = 0; i < 4; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    randomSegment += characters[randomIndex];
  }

  return `KD-${randomSegment}`;
}
