import React, { useState, useEffect } from 'react';
import { Play, Plus, Check, Info, Star, Flame, Sparkles, ChevronLeft, ChevronRight } from 'lucide-react';
import { Anime } from '../types/anime';

interface HeroBannerProps {
  featuredAnimes: Anime[];
  onPlayEpisode: (anime: Anime, episodeIndex?: number) => void;
  onOpenDetails: (anime: Anime) => void;
  onToggleWatchlist: (anime: Anime) => void;
  isInWatchlist: (animeId: string) => boolean;
}

export const HeroBanner: React.FC<HeroBannerProps> = ({
  featuredAnimes,
  onPlayEpisode,
  onOpenDetails,
  onToggleWatchlist,
  isInWatchlist,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (featuredAnimes.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % featuredAnimes.length);
    }, 8000);
    return () => clearInterval(interval);
  }, [featuredAnimes.length]);

  if (!featuredAnimes.length) return null;

  const currentAnime = featuredAnimes[currentIndex] || featuredAnimes[0];
  const inList = isInWatchlist(currentAnime.id);

  return (
    <div className="relative w-full h-[520px] md:h-[600px] overflow-hidden rounded-3xl mb-10 group border border-neutral-800/80 shadow-2xl">
      {/* Background Image with Cinematic Vignette */}
      <div className="absolute inset-0">
        <img
          src={currentAnime.bannerImage || currentAnime.coverImage}
          alt={currentAnime.title}
          className="w-full h-full object-cover object-center scale-105 transition-all duration-1000 ease-out group-hover:scale-100"
        />
        {/* Gradients */}
        <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/60 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-neutral-950 via-neutral-950/80 to-transparent" />
        <div className="absolute inset-0 bg-radial-at-c from-transparent via-neutral-950/40 to-neutral-950/90" />
      </div>

      {/* Hero Content */}
      <div className="relative h-full max-w-7xl mx-auto px-6 md:px-12 flex flex-col justify-end pb-12 z-10">
        <div className="max-w-2xl space-y-4">
          {/* Metadata Row */}
          <div className="flex flex-wrap items-center gap-3 text-xs">
            <span className="flex items-center gap-1 font-bold text-amber-400 bg-amber-400/10 px-2 py-0.5 rounded border border-amber-400/20">
              <Star className="w-3.5 h-3.5 fill-amber-400" />
              {currentAnime.rating.toFixed(1)}
            </span>
            <span className="text-neutral-400 font-medium">·</span>
            <span className="text-rose-400 font-semibold uppercase tracking-wider flex items-center gap-1">
              <Flame className="w-3.5 h-3.5" />
              Top #{currentAnime.trendingRank || 1} Trend
            </span>
            <span className="text-neutral-400 font-medium">·</span>
            <span className="text-neutral-300 font-medium">{currentAnime.releaseYear}</span>
            <span className="text-neutral-400 font-medium">·</span>
            <span className="text-neutral-300 font-medium">{currentAnime.episodes.length} Episoade HD</span>
            <span className="text-neutral-400 font-medium">·</span>
            <span className="text-neutral-400 text-[11px] border border-neutral-700 px-1.5 py-0.2 rounded font-mono">
              {currentAnime.ageRating}
            </span>
          </div>

          {/* Titles */}
          <div>
            <p className="text-sm font-semibold tracking-wide text-rose-400/90 font-['Space_Grotesk']">
              {currentAnime.romajiTitle}
            </p>
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-none mt-1">
              {currentAnime.title}
            </h1>
          </div>

          {/* Genres */}
          <div className="flex flex-wrap items-center gap-2">
            {currentAnime.genres.map((genre) => (
              <span
                key={genre}
                className="text-xs text-neutral-300 bg-neutral-900/80 px-2.5 py-1 rounded-md border border-neutral-800"
              >
                {genre}
              </span>
            ))}
          </div>

          {/* Synopsis */}
          <p className="text-neutral-300 text-sm md:text-base line-clamp-3 leading-relaxed font-normal">
            {currentAnime.description}
          </p>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button
              onClick={() => onPlayEpisode(currentAnime, 0)}
              className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-rose-600 to-rose-500 hover:from-rose-500 hover:to-rose-600 text-white font-bold text-sm tracking-wide shadow-lg shadow-rose-600/30 hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer"
            >
              <Play className="w-4 h-4 fill-white" />
              <span>Vizionează Acum</span>
            </button>

            <button
              onClick={() => onToggleWatchlist(currentAnime)}
              className={`flex items-center gap-2 px-4 py-3 rounded-xl font-semibold text-sm border transition-all cursor-pointer ${
                inList
                  ? 'bg-neutral-800/90 text-rose-400 border-rose-500/40 shadow-sm'
                  : 'bg-neutral-900/80 hover:bg-neutral-800 text-white border-neutral-700/80'
              }`}
            >
              {inList ? <Check className="w-4 h-4 text-rose-400" /> : <Plus className="w-4 h-4" />}
              <span>{inList ? 'În Listă' : 'Adaugă în Listă'}</span>
            </button>

            <button
              onClick={() => onOpenDetails(currentAnime)}
              className="flex items-center gap-2 px-4 py-3 rounded-xl bg-neutral-900/80 hover:bg-neutral-800 text-neutral-200 hover:text-white font-semibold text-sm border border-neutral-700/80 transition-all cursor-pointer"
            >
              <Info className="w-4 h-4" />
              <span>Detalii</span>
            </button>
          </div>
        </div>
      </div>

      {/* Slider Carousel Controls */}
      {featuredAnimes.length > 1 && (
        <div className="absolute bottom-6 right-6 md:right-12 z-20 flex items-center gap-2">
          <button
            onClick={() =>
              setCurrentIndex((prev) => (prev - 1 + featuredAnimes.length) % featuredAnimes.length)
            }
            className="w-9 h-9 rounded-full bg-neutral-900/80 hover:bg-neutral-800 text-white border border-neutral-800 flex items-center justify-center transition cursor-pointer"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <div className="flex items-center gap-1.5 px-2">
            {featuredAnimes.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentIndex(i)}
                className={`h-1.5 rounded-full transition-all cursor-pointer ${
                  i === currentIndex ? 'w-6 bg-rose-500' : 'w-1.5 bg-neutral-600 hover:bg-neutral-400'
                }`}
              />
            ))}
          </div>
          <button
            onClick={() => setCurrentIndex((prev) => (prev + 1) % featuredAnimes.length)}
            className="w-9 h-9 rounded-full bg-neutral-900/80 hover:bg-neutral-800 text-white border border-neutral-800 flex items-center justify-center transition cursor-pointer"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
};
