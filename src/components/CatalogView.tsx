import React, { useState, useMemo } from 'react';
import {
  Search, Filter, SlidersHorizontal, Grid, List, Play,
  Star, Plus, Check, Info, ArrowUpDown, X, Film, Tv,
  RotateCcw, Sparkles, Building, Calendar, Layers
} from 'lucide-react';
import { Anime, WatchlistItem } from '../types/anime';
import { AnimeCard } from './AnimeCard';

interface CatalogViewProps {
  animes: Anime[];
  selectedCategory: string;
  onSelectCategory: (category: string) => void;
  selectedGenre: string;
  onSelectGenre: (genre: string) => void;
  selectedStatus: string;
  onSelectStatus: (status: string) => void;
  sortBy: string;
  onSortBy: (sort: string) => void;
  watchlist: WatchlistItem[];
  onPlayAnime: (anime: Anime) => void;
  onOpenDetails: (anime: Anime) => void;
  onToggleWatchlist: (anime: Anime) => void;
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
  'Shounen',
  'Psihologic',
  'Sport',
];

const CATEGORIES = [
  { id: 'all', label: 'Toate', icon: Layers },
  { id: 'anime', label: 'Anime', icon: Sparkles },
  { id: 'movie', label: 'Filme', icon: Film },
  { id: 'series', label: 'Seriale', icon: Tv },
  { id: 'sport', label: 'Sport', icon: Play },
  { id: 'mined', label: 'Minate', icon: Sparkles },
];

export const CatalogView: React.FC<CatalogViewProps> = ({
  animes,
  selectedCategory,
  onSelectCategory,
  selectedGenre,
  onSelectGenre,
  selectedStatus,
  onSelectStatus,
  sortBy,
  onSortBy,
  watchlist,
  onPlayAnime,
  onOpenDetails,
  onToggleWatchlist,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedYear, setSelectedYear] = useState<string>('Toate');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  // Filter & Search
  const filteredAnimes = useMemo(() => {
    let result = [...animes];

    // Search query filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(
        (a) =>
          a.title.toLowerCase().includes(q) ||
          a.romajiTitle?.toLowerCase().includes(q) ||
          a.englishTitle?.toLowerCase().includes(q) ||
          a.studio?.toLowerCase().includes(q) ||
          a.franchise?.toLowerCase().includes(q) ||
          a.genres.some((g) => g.toLowerCase().includes(q))
      );
    }

    // Category filter
    if (selectedCategory !== 'all') {
      result = result.filter((a) => a.category === selectedCategory);
    }

    // Genre filter
    if (selectedGenre !== 'Toate') {
      result = result.filter((a) =>
        a.genres.some((g) => g.toLowerCase() === selectedGenre.toLowerCase())
      );
    }

    // Status filter
    if (selectedStatus !== 'Toate') {
      result = result.filter((a) => a.status === selectedStatus);
    }

    // Year filter
    if (selectedYear !== 'Toate') {
      if (selectedYear === '<2020') {
        result = result.filter((a) => a.releaseYear < 2020);
      } else {
        const y = Number(selectedYear);
        result = result.filter((a) => a.releaseYear === y);
      }
    }

    // Sort
    switch (sortBy) {
      case 'rating':
        result.sort((a, b) => b.rating - a.rating);
        break;
      case 'year_desc':
        result.sort((a, b) => b.releaseYear - a.releaseYear);
        break;
      case 'title':
        result.sort((a, b) => a.title.localeCompare(b.title));
        break;
      default:
        result.sort((a, b) => (a.trendingRank || 99) - (b.trendingRank || 99));
    }

    return result;
  }, [animes, searchQuery, selectedCategory, selectedGenre, selectedStatus, selectedYear, sortBy]);

  const hasActiveFilters =
    searchQuery.trim() !== '' ||
    selectedCategory !== 'all' ||
    selectedGenre !== 'Toate' ||
    selectedStatus !== 'Toate' ||
    selectedYear !== 'Toate';

  const resetAllFilters = () => {
    setSearchQuery('');
    onSelectCategory('all');
    onSelectGenre('Toate');
    onSelectStatus('Toate');
    setSelectedYear('Toate');
    onSortBy('trending');
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Top Header & Search Bar */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-6 border-b border-neutral-800">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              Catalog Complet Animaxia
            </h1>
            <span className="text-xs font-mono font-bold px-2 py-0.5 rounded-full bg-rose-600/20 text-rose-400 border border-rose-500/30">
              {filteredAnimes.length} titluri
            </span>
          </div>
          <p className="text-xs text-neutral-400 mt-1">
            Explorează întreaga bază de date cu anime, filme cinematografice, seriale și stream-uri universale
          </p>
        </div>

        {/* Live Search Input & View Mode */}
        <div className="flex items-center gap-2.5 w-full md:w-auto">
          <div className="relative flex-1 md:w-72">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500" />
            <input
              type="text"
              placeholder="Caută în catalog..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-neutral-900 border border-neutral-800 rounded-xl pl-9 pr-8 py-2 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-rose-500"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-white"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Grid / List Mode Toggle */}
          <div className="flex items-center gap-1 bg-neutral-900 p-1 rounded-xl border border-neutral-800">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded-lg transition cursor-pointer ${
                viewMode === 'grid'
                  ? 'bg-neutral-800 text-white shadow-sm'
                  : 'text-neutral-500 hover:text-neutral-300'
              }`}
              title="Afișare Grilă Postere"
            >
              <Grid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-1.5 rounded-lg transition cursor-pointer ${
                viewMode === 'list'
                  ? 'bg-neutral-800 text-white shadow-sm'
                  : 'text-neutral-500 hover:text-neutral-300'
              }`}
              title="Afișare Listă Detaliată"
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Categories Selector Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        {CATEGORIES.map((cat) => {
          const IconComponent = cat.icon;
          const isActive = selectedCategory === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => onSelectCategory(cat.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap cursor-pointer ${
                isActive
                  ? 'bg-rose-600 text-white shadow-md shadow-rose-600/30'
                  : 'bg-neutral-900/90 text-neutral-400 hover:text-white hover:bg-neutral-800 border border-neutral-800'
              }`}
            >
              <IconComponent className="w-3.5 h-3.5" />
              <span>{cat.label}</span>
            </button>
          );
        })}
      </div>

      {/* Filter Bar: Genres, Status, Year, Sort */}
      <div className="bg-neutral-900/50 p-4 rounded-2xl border border-neutral-800/80 space-y-3">
        {/* Genres Pill Bar */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          <span className="text-[11px] font-semibold text-neutral-500 shrink-0 mr-1">Genuri:</span>
          {GENRES.map((g) => (
            <button
              key={g}
              onClick={() => onSelectGenre(g)}
              className={`px-3 py-1 rounded-lg text-xs font-medium whitespace-nowrap transition cursor-pointer ${
                selectedGenre === g
                  ? 'bg-rose-600 text-white shadow-sm font-semibold'
                  : 'bg-neutral-900 text-neutral-400 hover:text-neutral-200 hover:bg-neutral-800 border border-neutral-800'
              }`}
            >
              {g}
            </button>
          ))}
        </div>

        {/* Second Row: Status, Year, Sort dropdowns */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-neutral-800/60">
          <div className="flex flex-wrap items-center gap-4 text-xs">
            {/* Status */}
            <div className="flex items-center gap-1.5">
              <span className="text-neutral-500">Status:</span>
              {['Toate', 'În difuzare', 'Finalizat'].map((s) => (
                <button
                  key={s}
                  onClick={() => onSelectStatus(s)}
                  className={`px-2.5 py-1 rounded-lg transition cursor-pointer ${
                    selectedStatus === s
                      ? 'bg-neutral-800 text-white font-semibold border border-neutral-700'
                      : 'text-neutral-400 hover:text-white'
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>

            {/* Year Selector */}
            <div className="flex items-center gap-1.5">
              <span className="text-neutral-500">An:</span>
              <select
                value={selectedYear}
                onChange={(e) => setSelectedYear(e.target.value)}
                className="bg-neutral-900 text-neutral-300 text-xs px-2.5 py-1 rounded-lg border border-neutral-800 focus:outline-none focus:border-rose-500 cursor-pointer"
              >
                <option value="Toate">Toate anii</option>
                <option value="2025">2025</option>
                <option value="2024">2024</option>
                <option value="2023">2023</option>
                <option value="2022">2022</option>
                <option value="2021">2021</option>
                <option value="2020">2020</option>
                <option value="<2020">Clasice (&lt; 2020)</option>
              </select>
            </div>
          </div>

          {/* Sort Selector */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-neutral-500 flex items-center gap-1">
              <SlidersHorizontal className="w-3 h-3" />
              Sortează:
            </span>
            <select
              value={sortBy}
              onChange={(e) => onSortBy(e.target.value)}
              className="bg-neutral-900 text-neutral-200 text-xs font-medium px-3 py-1.5 rounded-lg border border-neutral-800 focus:outline-none focus:border-rose-500 cursor-pointer"
            >
              <option value="trending">Popularitate &amp; Trending</option>
              <option value="rating">Notă maximă (Rating)</option>
              <option value="year_desc">Cele mai noi (An lansare)</option>
              <option value="title">Alfabetic (A-Z)</option>
            </select>
          </div>
        </div>

        {/* Active Filters Summary & Reset */}
        {hasActiveFilters && (
          <div className="flex items-center justify-between pt-2 border-t border-neutral-800/40 text-xs">
            <div className="flex items-center gap-1.5 flex-wrap text-neutral-400">
              <span>Filtre active:</span>
              {selectedCategory !== 'all' && (
                <span className="px-2 py-0.5 rounded bg-neutral-800 text-white font-mono text-[10px]">
                  Categorie: {selectedCategory}
                </span>
              )}
              {selectedGenre !== 'Toate' && (
                <span className="px-2 py-0.5 rounded bg-neutral-800 text-white font-mono text-[10px]">
                  Gen: {selectedGenre}
                </span>
              )}
              {selectedStatus !== 'Toate' && (
                <span className="px-2 py-0.5 rounded bg-neutral-800 text-white font-mono text-[10px]">
                  Status: {selectedStatus}
                </span>
              )}
              {selectedYear !== 'Toate' && (
                <span className="px-2 py-0.5 rounded bg-neutral-800 text-white font-mono text-[10px]">
                  An: {selectedYear}
                </span>
              )}
              {searchQuery && (
                <span className="px-2 py-0.5 rounded bg-neutral-800 text-white font-mono text-[10px]">
                  Căutare: "{searchQuery}"
                </span>
              )}
            </div>

            <button
              onClick={resetAllFilters}
              className="text-xs text-rose-400 hover:text-rose-300 font-semibold flex items-center gap-1 cursor-pointer shrink-0"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Resetează filtrele</span>
            </button>
          </div>
        )}
      </div>

      {/* Catalog Results Grid or Detailed List */}
      {filteredAnimes.length === 0 ? (
        <div className="py-20 text-center bg-neutral-900/30 rounded-3xl border border-neutral-800/80 space-y-4">
          <Film className="w-12 h-12 text-neutral-600 mx-auto" />
          <div>
            <h3 className="text-base font-bold text-white">Niciun titlu găsit</h3>
            <p className="text-xs text-neutral-400 mt-1 max-w-md mx-auto">
              Niciun rezultat nu corespunde criteriilor tale de filtrare. Încearcă să resetezi filtrele sau să cauți alt cuvânt cheie.
            </p>
          </div>
          <button
            onClick={resetAllFilters}
            className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold transition cursor-pointer"
          >
            Resetează toate filtrele
          </button>
        </div>
      ) : viewMode === 'grid' ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 gap-4">
          {filteredAnimes.map((anime) => (
            <AnimeCard
              key={anime.id}
              anime={anime}
              onPlay={(a) => onPlayAnime(a)}
              onOpenDetails={(a) => onOpenDetails(a)}
              onToggleWatchlist={onToggleWatchlist}
              isInWatchlist={watchlist.some((w) => w.animeId === anime.id)}
            />
          ))}
        </div>
      ) : (
        /* Detailed List View Mode */
        <div className="space-y-3">
          {filteredAnimes.map((anime) => {
            const inWatchlist = watchlist.some((w) => w.animeId === anime.id);
            return (
              <div
                key={anime.id}
                className="group p-4 bg-neutral-900/60 hover:bg-neutral-900/90 rounded-2xl border border-neutral-800/80 hover:border-neutral-700 transition flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
              >
                <div
                  onClick={() => onOpenDetails(anime)}
                  className="flex items-start sm:items-center gap-4 flex-1 cursor-pointer min-w-0"
                >
                  <img
                    src={anime.coverImage}
                    alt={anime.title}
                    className="w-20 sm:w-24 aspect-[3/4] object-cover rounded-xl border border-neutral-800 shadow shrink-0 group-hover:scale-105 transition-transform"
                  />
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      <span className="text-[11px] font-semibold text-rose-400">
                        {anime.studio}
                      </span>
                      <span className="text-neutral-600">·</span>
                      <span className="text-[11px] text-neutral-400">{anime.releaseYear}</span>
                      <span className="text-neutral-600">·</span>
                      <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-neutral-800 text-neutral-300">
                        {anime.category?.toUpperCase() || 'ANIME'}
                      </span>
                    </div>

                    <h3 className="text-base font-bold text-white group-hover:text-rose-300 transition-colors truncate">
                      {anime.title}
                    </h3>

                    {anime.englishTitle && anime.englishTitle !== anime.title && (
                      <p className="text-xs text-neutral-400 truncate">{anime.englishTitle}</p>
                    )}

                    <p className="text-xs text-neutral-400 line-clamp-2 mt-1.5 leading-relaxed font-normal">
                      {anime.description}
                    </p>

                    <div className="flex flex-wrap items-center gap-1.5 mt-2">
                      <span className="flex items-center gap-1 text-[11px] font-bold text-amber-300 bg-amber-400/10 px-2 py-0.5 rounded border border-amber-400/20">
                        <Star className="w-3 h-3 fill-amber-300" />
                        {anime.rating.toFixed(1)}
                      </span>
                      {anime.genres.slice(0, 3).map((g) => (
                        <span
                          key={g}
                          className="text-[10px] px-2 py-0.5 rounded bg-neutral-950 text-neutral-300 border border-neutral-800"
                        >
                          {g}
                        </span>
                      ))}
                      <span className="text-[10px] px-2 py-0.5 rounded bg-neutral-950 text-neutral-400 border border-neutral-800">
                        {anime.episodes?.length || anime.totalEpisodes} Ep.
                      </span>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 shrink-0 self-end sm:self-center w-full sm:w-auto justify-end pt-2 sm:pt-0 border-t sm:border-t-0 border-neutral-800">
                  <button
                    onClick={() => onPlayAnime(anime)}
                    className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-md shadow-rose-600/30 transition cursor-pointer"
                  >
                    <Play className="w-3.5 h-3.5 fill-white" />
                    <span>Redă Ep. 1</span>
                  </button>

                  <button
                    onClick={() => onToggleWatchlist(anime)}
                    className={`p-2 rounded-xl border text-xs font-semibold transition cursor-pointer ${
                      inWatchlist
                        ? 'bg-rose-500/20 text-rose-400 border-rose-500/40'
                        : 'bg-neutral-800 hover:bg-neutral-700 text-white border-neutral-700'
                    }`}
                    title={inWatchlist ? 'În Lista Ta' : 'Adaugă în Listă'}
                  >
                    {inWatchlist ? <Check className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                  </button>

                  <button
                    onClick={() => onOpenDetails(anime)}
                    className="p-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-300 hover:text-white transition cursor-pointer"
                    title="Detalii complete"
                  >
                    <Info className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
