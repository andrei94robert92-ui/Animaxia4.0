import React, { useState, useEffect } from 'react';
import { Search, Film, Tv, Play, Bookmark, X, ArrowRight, Sparkles } from 'lucide-react';
import { Anime } from '../types/anime';

interface CommandPaletteModalProps {
  isOpen: boolean;
  onClose: () => void;
  animes: Anime[];
  onSelectAnime: (anime: Anime) => void;
  onSelectCategory: (category: string) => void;
}

export const CommandPaletteModal: React.FC<CommandPaletteModalProps> = ({
  isOpen,
  onClose,
  animes,
  onSelectAnime,
  onSelectCategory,
}) => {
  const [query, setQuery] = useState('');

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
      } else if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const filtered = query.trim()
    ? animes.filter(
        (a) =>
          a.title.toLowerCase().includes(query.toLowerCase()) ||
          a.romajiTitle?.toLowerCase().includes(query.toLowerCase()) ||
          a.genres.some((g) => g.toLowerCase().includes(query.toLowerCase())) ||
          a.franchise?.toLowerCase().includes(query.toLowerCase())
      )
    : animes.slice(0, 6);

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4 bg-neutral-950/80 backdrop-blur-md animate-in fade-in duration-150">
      <div className="w-full max-w-2xl bg-neutral-900 border border-neutral-800 rounded-2xl shadow-2xl overflow-hidden">
        {/* Search Input Bar */}
        <div className="p-4 border-b border-neutral-800 flex items-center gap-3">
          <Search className="w-5 h-5 text-rose-500 shrink-0" />
          <input
            autoFocus
            type="text"
            placeholder="Caută titluri, anime, filme, universuri (ex: Titan, Sintel, Frieren)..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full bg-transparent text-sm sm:text-base text-white placeholder-neutral-500 focus:outline-none"
          />
          <kbd className="hidden sm:inline-block px-2 py-0.5 text-[10px] font-mono text-neutral-400 bg-neutral-800 rounded border border-neutral-700">
            ESC
          </kbd>
          <button onClick={onClose} className="text-neutral-400 hover:text-white sm:hidden">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Categories Quick Access */}
        <div className="px-4 py-2.5 bg-neutral-950/50 border-b border-neutral-800 flex items-center gap-2 overflow-x-auto text-xs text-neutral-400">
          <span className="text-[11px] font-bold text-neutral-500 uppercase tracking-wider shrink-0">
            Sari la:
          </span>
          {['all', 'movie', 'series', 'anime', 'sport', 'mined'].map((cat) => (
            <button
              key={cat}
              onClick={() => {
                onSelectCategory(cat);
                onClose();
              }}
              className="px-2.5 py-1 rounded-md bg-neutral-900 hover:bg-neutral-800 hover:text-white border border-neutral-800 transition cursor-pointer capitalize shrink-0"
            >
              {cat === 'all'
                ? 'Toate'
                : cat === 'movie'
                ? 'Filme'
                : cat === 'series'
                ? 'Seriale'
                : cat === 'anime'
                ? 'Anime'
                : cat === 'sport'
                ? 'Sport'
                : 'Minate'}
            </button>
          ))}
        </div>

        {/* Search Results */}
        <div className="max-h-80 overflow-y-auto p-2 divide-y divide-neutral-800/40">
          {filtered.length === 0 ? (
            <div className="py-12 text-center text-xs text-neutral-500">
              Niciun rezultat găsit pentru "{query}". Încearcă un alt termen sau adaugă un link nou!
            </div>
          ) : (
            filtered.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  onSelectAnime(item);
                  onClose();
                }}
                className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-neutral-800/80 transition text-left cursor-pointer group"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <img
                    src={item.coverImage}
                    alt={item.title}
                    className="w-9 h-12 rounded-lg object-cover shrink-0"
                  />
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-white group-hover:text-rose-400 transition truncate">
                      {item.title}
                    </p>
                    <p className="text-[11px] text-neutral-400 truncate">
                      {item.releaseYear} · {item.category.toUpperCase()} · {item.genres.slice(0, 2).join(', ')}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <span className="text-[11px] font-bold text-amber-400 bg-amber-400/10 px-2 py-0.5 rounded border border-amber-400/20">
                    ★ {item.rating.toFixed(1)}
                  </span>
                  <ArrowRight className="w-4 h-4 text-neutral-600 group-hover:text-rose-400 group-hover:translate-x-0.5 transition-all" />
                </div>
              </button>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
