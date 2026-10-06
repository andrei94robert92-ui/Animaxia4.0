import React from 'react';
import { Play, Star, Plus, Check, Info } from 'lucide-react';
import { Anime } from '../types/anime';

interface AnimeCardProps {
  anime: Anime;
  onPlay: (anime: Anime) => void;
  onOpenDetails: (anime: Anime) => void;
  onToggleWatchlist: (anime: Anime) => void;
  isInWatchlist: boolean;
}

export const AnimeCard: React.FC<AnimeCardProps> = ({
  anime,
  onPlay,
  onOpenDetails,
  onToggleWatchlist,
  isInWatchlist,
}) => {
  return (
    <div className="group relative flex flex-col rounded-2xl bg-neutral-900/60 border border-neutral-800/80 hover:border-neutral-700/80 overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-rose-950/20">
      {/* Poster Image Container */}
      <div
        onClick={() => onOpenDetails(anime)}
        className="relative aspect-[3/4] w-full overflow-hidden bg-neutral-950 cursor-pointer"
      >
        <img
          src={anime.coverImage}
          alt={anime.title}
          className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
          loading="lazy"
        />

        {/* Gradient vignette */}
        <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/20 to-transparent opacity-80 group-hover:opacity-60 transition-opacity" />

        {/* Top Floating Badges */}
        <div className="absolute top-2.5 left-2.5 right-2.5 flex items-center justify-between pointer-events-none">
          <span className="flex items-center gap-1 font-bold text-[11px] text-amber-300 bg-neutral-950/80 backdrop-blur-md px-2 py-0.5 rounded-md border border-neutral-800">
            <Star className="w-3 h-3 fill-amber-300" />
            {anime.rating.toFixed(1)}
          </span>

          <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-300 bg-neutral-950/80 backdrop-blur-md px-1.5 py-0.5 rounded border border-neutral-800">
            HD
          </span>
        </div>

        {/* Hover Action Overlay */}
        <div className="absolute inset-0 flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-neutral-950/60 backdrop-blur-[2px]">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onPlay(anime);
            }}
            className="w-12 h-12 rounded-full bg-rose-600 hover:bg-rose-500 text-white flex items-center justify-center shadow-lg shadow-rose-600/40 hover:scale-110 active:scale-95 transition-all cursor-pointer"
            title="Redă acum"
          >
            <Play className="w-5 h-5 fill-white translate-x-0.5" />
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggleWatchlist(anime);
            }}
            className={`w-10 h-10 rounded-full flex items-center justify-center border transition-all cursor-pointer ${
              isInWatchlist
                ? 'bg-rose-500/20 text-rose-400 border-rose-500/50'
                : 'bg-neutral-900/90 hover:bg-neutral-800 text-white border-neutral-700'
            }`}
            title={isInWatchlist ? 'În listă' : 'Adaugă la favorite'}
          >
            {isInWatchlist ? <Check className="w-4 h-4 text-rose-400" /> : <Plus className="w-4 h-4" />}
          </button>
        </div>

        {/* Bottom episode pill */}
        <div className="absolute bottom-2.5 left-2.5">
          <span className="text-[11px] font-semibold text-neutral-200 bg-neutral-950/85 backdrop-blur-md px-2 py-0.5 rounded-md border border-neutral-800">
            {anime.episodes?.length || anime.totalEpisodes} Ep.
          </span>
        </div>
      </div>

      {/* Anime Info & Unboxed Metadata */}
      <div className="p-3.5 flex flex-col flex-1 justify-between">
        <div>
          <p className="text-[11px] font-medium text-rose-400 truncate">
            {anime.romajiTitle || anime.studio}
          </p>
          <h3
            onClick={() => onOpenDetails(anime)}
            className="font-bold text-sm text-white line-clamp-1 group-hover:text-rose-300 transition-colors cursor-pointer mt-0.5"
            title={anime.title}
          >
            {anime.title}
          </h3>

          {/* Clean Unboxed Metadata with Typographic Separators */}
          <div className="flex items-center gap-1.5 text-xs text-neutral-400 mt-1.5">
            <span>{anime.releaseYear}</span>
            <span aria-hidden="true">·</span>
            <span>{anime.status}</span>
            <span aria-hidden="true">·</span>
            <span className="text-neutral-500">{anime.studio}</span>
          </div>
        </div>

        {/* Primary Genre tags */}
        <div className="flex flex-wrap gap-1 mt-2.5 pt-2 border-t border-neutral-800/80">
          {anime.genres.slice(0, 2).map((g) => (
            <span key={g} className="text-[10px] text-neutral-400 font-medium">
              {g}
            </span>
          ))}
          {anime.genres.length > 2 && (
            <span className="text-[10px] text-neutral-500 font-mono">
              +{anime.genres.length - 2}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
