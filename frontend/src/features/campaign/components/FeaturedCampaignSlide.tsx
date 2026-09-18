import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import type { FeaturedCampaignSlideProps } from '../types';
import { FormatCpmDisplay, GetCampaignCategoryBadgeLabel } from '../utils';

/**
 * Individual slide inside the featured campaign hero carousel.
 * Renders dark cinematic canvas with a background image on the right,
 * horizontal and vertical legibility gradients, and a vertically centered content stack on the left.
 *
 * @param props - Slide properties including campaign data, active state, and selection callback.
 * @returns The rendered carousel slide element.
 */
export function FeaturedCampaignSlide({ campaign, isActive, onSelect, className }: FeaturedCampaignSlideProps) {
  const [imageError, setImageError] = useState(false);

  const bannerUrl = campaign.featuredBannerUrl || campaign.thumbnailUrl;
  const title = campaign.title?.trim() || 'Kampanye Tanpa Judul';
  const brandName = campaign.brand?.companyName || 'Brand';
  const brandInitial = brandName.charAt(0).toUpperCase();
  const cpmDisplay = FormatCpmDisplay(campaign.cpm);
  const categoryBadge = GetCampaignCategoryBadgeLabel(campaign.campaignCategory);

  /**
   * Handles user selection of the featured campaign and triggers navigation.
   */
  const HandleSelect = () => {
    onSelect?.(campaign);
  };

  /**
   * Handles image loading errors by falling back to the dark background placeholder.
   */
  const HandleImageError = () => {
    setImageError(true);
  };

  return (
    <div
      aria-hidden={!isActive}
      className={cn(
        'relative flex h-full min-w-full w-full shrink-0 select-none flex-col justify-center overflow-hidden',
        className
      )}>
      {/* Background Banner Image on the right (Vibrant Full-Color, Not Grayscale) */}
      {bannerUrl && !imageError ? (
        <img
          src={bannerUrl}
          alt={title}
          onError={HandleImageError}
          className="absolute inset-0 h-full w-full object-cover object-center sm:object-right transition-transform duration-700 ease-out"
          loading="eager"
        />
      ) : (
        <div className="absolute inset-0 bg-gradient-to-br from-background via-card/50 to-background" />
      )}

      {/* Directional Gradient from Left for Typography Legibility without obscuring artwork (Seamless Multi-Stop Ease) */}
      <div
        className="pointer-events-none absolute inset-0 z-1"
        style={{
          background:
            'linear-gradient(90deg, #09090b 0%, rgba(9, 9, 11, 0.98) 28%, rgba(9, 9, 11, 0.85) 42%, rgba(9, 9, 11, 0.5) 58%, rgba(9, 9, 11, 0.18) 75%, transparent 92%)',
        }}
      />

      {/* Smooth, Gentle Bottom Platform Fade (Tall, soft cubic ease with zero dark horizontal bars) */}
      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 h-32 sm:h-40 z-1"
        style={{
          background:
            'linear-gradient(0deg, #09090b 0%, rgba(9, 9, 11, 0.5) 30%, rgba(9, 9, 11, 0.15) 60%, transparent 100%)',
        }}
      />

      {/* Left-Aligned Cohesive Content Stack (Vertically Centered, aligned with page container padding) */}
      <div className="relative z-10 flex max-w-xl flex-col justify-center space-y-3.5 px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-10">
        {/* "FEATURED" primary tag */}
        <span className="inline-block text-xs font-black uppercase tracking-widest text-primary">
          FEATURED
        </span>

        {/* Campaign Title */}
        <h2
          onClick={HandleSelect}
          className="line-clamp-2 cursor-pointer text-2xl font-bold tracking-tight text-white transition-colors hover:text-white/90 sm:text-3xl lg:text-4xl drop-shadow-xs">
          {title}
        </h2>

        {/* Brand row: Avatar circle, Brand name, Category badge */}
        <div className="flex items-center gap-2.5 pt-0.5">
          <div className="flex size-7 shrink-0 items-center justify-center rounded-full bg-primary/20 border border-white/20 text-xs font-bold text-white uppercase backdrop-blur-xs">
            {brandInitial}
          </div>
          <span className="text-sm font-semibold text-white/95 truncate">{brandName}</span>
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold text-white/90 bg-white/10 backdrop-blur-md border border-white/15 uppercase tracking-wider shadow-xs sm:text-[11px]">
            {categoryBadge}
          </span>
        </div>

        {/* CPM Rate Display */}
        <div className="flex items-baseline gap-1.5 pt-1">
          <span className="text-2xl font-extrabold tracking-tight text-white sm:text-3xl">
            {cpmDisplay}
          </span>
          <span className="text-xs font-medium text-zinc-400 sm:text-sm">/ 1K Views</span>
        </div>

        {/* Primary Theme CTA Button */}
        <div className="pt-2">
          <Button
            type="button"
            tabIndex={isActive ? 0 : -1}
            onClick={HandleSelect}
            className="w-fit cursor-pointer rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground font-bold px-6 py-2.5 shadow-lg shadow-primary/25 transition-all active:scale-98 sm:h-11 sm:px-8 sm:text-sm">
            Ikuti Kampanye
          </Button>
        </div>
      </div>
    </div>
  );
}
