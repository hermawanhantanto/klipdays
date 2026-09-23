import { MockSocialScraperProvider } from './mock-scraper.provider.js';
import { ScrapeCreatorsProvider } from './scrape-creators.provider.js';
import type { ISocialScraperProvider } from './social-scraper.interface.js';

let cachedProvider: ISocialScraperProvider | null = null;

/**
 * Returns the active ISocialScraperProvider instance.
 * Automatically selects ScrapeCreatorsProvider when SCRAPECREATORS_API_KEY is configured;
 * otherwise defaults to MockSocialScraperProvider for zero-cost local development and testing.
 *
 * @returns Configured ISocialScraperProvider instance.
 */
export function GetScraperProvider(): ISocialScraperProvider {
  if (cachedProvider) {
    return cachedProvider;
  }

  const apiKey = process.env.SCRAPECREATORS_API_KEY;

  if (apiKey && apiKey.trim().length > 0) {
    cachedProvider = new ScrapeCreatorsProvider(apiKey);
  } else {
    cachedProvider = new MockSocialScraperProvider();
  }

  return cachedProvider;
}
