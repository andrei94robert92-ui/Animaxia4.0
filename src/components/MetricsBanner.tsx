import React from 'react';
import { Film, Tv, Play, Trophy } from 'lucide-react';
import { CatalogCounts } from '../types/anime';

interface MetricsBannerProps {
  counts: CatalogCounts;
  selectedCategory: string;
  onSelectCategory: (category: string) => void;
}

export const MetricsBanner: React.FC<MetricsBannerProps> = ({
  counts,
  selectedCategory,
  onSelectCategory,
}) => {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mb-8">
      {/* Total titluri */}
      <button
        onClick={() => onSelectCategory('all')}
        className={`p-4 rounded-2xl text-left transition-all border cursor-pointer ${
          selectedCategory === 'all'
            ? 'bg-rose-600/15 border-rose-500/50 shadow-lg shadow-rose-950/20'
            : 'bg-neutral-900/60 hover:bg-neutral-850 border-neutral-800'
        }`}
      >
        <div className="flex items-center justify-between">
          <span className="text-2xl sm:text-3xl font-black text-white font-mono">
            {counts.totalTitles}
          </span>
          <span className="w-2 h-2 rounded-full bg-rose-500" />
        </div>
        <p className="text-xs font-semibold text-neutral-400 mt-1">
          Total titluri
        </p>
      </button>

      {/* Filme */}
      <button
        onClick={() => onSelectCategory('movie')}
        className={`p-4 rounded-2xl text-left transition-all border cursor-pointer ${
          selectedCategory === 'movie'
            ? 'bg-rose-600/15 border-rose-500/50 shadow-lg shadow-rose-950/20'
            : 'bg-neutral-900/60 hover:bg-neutral-850 border-neutral-800'
        }`}
      >
        <div className="flex items-center justify-between">
          <span className="text-2xl sm:text-3xl font-black text-white font-mono">
            {counts.totalMovies}
          </span>
          <Film className="w-4 h-4 text-neutral-500" />
        </div>
        <p className="text-xs font-semibold text-neutral-400 mt-1">
          Filme
        </p>
      </button>

      {/* Seriale */}
      <button
        onClick={() => onSelectCategory('series')}
        className={`p-4 rounded-2xl text-left transition-all border cursor-pointer ${
          selectedCategory === 'series'
            ? 'bg-rose-600/15 border-rose-500/50 shadow-lg shadow-rose-950/20'
            : 'bg-neutral-900/60 hover:bg-neutral-850 border-neutral-800'
        }`}
      >
        <div className="flex items-center justify-between">
          <span className="text-2xl sm:text-3xl font-black text-white font-mono">
            {counts.totalSeries}
          </span>
          <Tv className="w-4 h-4 text-neutral-500" />
        </div>
        <p className="text-xs font-semibold text-neutral-400 mt-1">
          Seriale
        </p>
      </button>

      {/* Anime */}
      <button
        onClick={() => onSelectCategory('anime')}
        className={`p-4 rounded-2xl text-left transition-all border cursor-pointer ${
          selectedCategory === 'anime'
            ? 'bg-rose-600/15 border-rose-500/50 shadow-lg shadow-rose-950/20'
            : 'bg-neutral-900/60 hover:bg-neutral-850 border-neutral-800'
        }`}
      >
        <div className="flex items-center justify-between">
          <span className="text-2xl sm:text-3xl font-black text-white font-mono">
            {counts.totalAnime}
          </span>
          <Play className="w-4 h-4 text-neutral-500" />
        </div>
        <p className="text-xs font-semibold text-neutral-400 mt-1">
          Anime
        </p>
      </button>
    </div>
  );
};
