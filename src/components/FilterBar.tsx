import React from 'react';
import { Filter, SlidersHorizontal } from 'lucide-react';

interface FilterBarProps {
  selectedGenre: string;
  setSelectedGenre: (genre: string) => void;
  selectedStatus: string;
  setSelectedStatus: (status: string) => void;
  sortBy: string;
  setSortBy: (sort: string) => void;
  totalResults: number;
}

const GENRES = [
  'Toate',
  'Acțiune',
  'Fantezie',
  'Supranatural',
  'Cyberpunk',
  'Dramă',
  'Aventură',
  'Comedie',
  'Muzică',
  'Sci-Fi',
];

const STATUSES = ['Toate', 'În difuzare', 'Finalizat'];

export const FilterBar: React.FC<FilterBarProps> = ({
  selectedGenre,
  setSelectedGenre,
  selectedStatus,
  setSelectedStatus,
  sortBy,
  setSortBy,
  totalResults,
}) => {
  return (
    <div className="mb-8 space-y-4 bg-neutral-900/40 p-4 rounded-2xl border border-neutral-800/80">
      {/* Top row: Genre Segmented Bar */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 max-w-full scrollbar-none">
          {GENRES.map((g) => (
            <button
              key={g}
              onClick={() => setSelectedGenre(g)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition cursor-pointer ${
                selectedGenre === g
                  ? 'bg-rose-600 text-white shadow-md shadow-rose-600/30'
                  : 'bg-neutral-900 text-neutral-400 hover:text-neutral-200 hover:bg-neutral-800 border border-neutral-800/80'
              }`}
            >
              {g}
            </button>
          ))}
        </div>

        {/* Counter */}
        <div className="text-xs text-neutral-400 font-mono">
          <span className="text-neutral-200 font-bold">{totalResults}</span> anime găsite
        </div>
      </div>

      {/* Second row: Status & Sorting */}
      <div className="flex items-center justify-between gap-4 flex-wrap pt-2 border-t border-neutral-800/60">
        {/* Status filter */}
        <div className="flex items-center gap-1">
          <span className="text-xs text-neutral-500 mr-2 flex items-center gap-1">
            <Filter className="w-3 h-3" />
            Status:
          </span>
          {STATUSES.map((s) => (
            <button
              key={s}
              onClick={() => setSelectedStatus(s)}
              className={`px-2.5 py-1 rounded-md text-xs font-medium transition cursor-pointer ${
                selectedStatus === s
                  ? 'bg-neutral-800 text-white border border-neutral-700 font-semibold'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              {s}
            </button>
          ))}
        </div>

        {/* Sort selector */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-neutral-500 flex items-center gap-1">
            <SlidersHorizontal className="w-3 h-3" />
            Sortează după:
          </span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="bg-neutral-900 text-neutral-200 text-xs font-medium px-3 py-1.5 rounded-lg border border-neutral-800 focus:outline-none focus:border-rose-500 cursor-pointer"
          >
            <option value="trending">Popularitate & Trending</option>
            <option value="rating">Cele mai bune note (Rating)</option>
            <option value="year_desc">Cele mai noi (An lansare)</option>
            <option value="title">Alfabetic (A-Z)</option>
            <option value="episodes">Număr episoade</option>
          </select>
        </div>
      </div>
    </div>
  );
};
