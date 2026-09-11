import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Validates and sanitizes a URL string to ensure it uses safe HTTP or HTTPS protocols.
 * Neutralizes dangerous pseudo-schemes such as `javascript:`, `data:`, or `vbscript:` to prevent DOM XSS.
 *
 * @param url - Untrusted URL string to test.
 * @returns The trimmed sanitized URL string if valid, or null if dangerous, empty, or non-HTTP.
 */
export function SanitizeHttpUrl(url?: string | null): string | null {
  if (!url) {
    return null;
  }

  const trimmedUrl = url.trim();
  const isHttpOrHttps = /^https?:\/\//i.test(trimmedUrl);
  if (!isHttpOrHttps) {
    return null;
  }

  return trimmedUrl;
}
