import React, { useState, useEffect } from 'react';
import { Search, Film, Tv, Play, Bookmark, X, ArrowRight, Sparkles, Database, History, Cpu } from 'lucide-react';
import { Anime } from '../types/anime';

interface CommandPaletteModalProps {
  isOpen: boolean;
  onClose: () => void;
  animes: Anime[];
  onSelectAnime: (anime: Anime) => void;
  onSelectCategory: (category: string) => void;
  onOpenStudio?: () => void;
  onOpenMiner?: () => void;
  onSelectTab?: (tab: 'home' | 'catalog' | 'watchlist' | 'history') => void;
}

export const CommandPaletteModal: React.FC<CommandPaletteModalProps> = ({
  isOpen,
  onClose,
  animes,
  onSelectAnime,
  onSelectCategory,
  onOpenStudio,
  onOpenMiner,
  onSelectTab,
}) => {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);

  const filtered = query.trim()
    ? animes.filter(
        (a) =>
          a.title.toLowerCase().includes(query.toLowerCase()) ||
          a.romajiTitle?.toLowerCase().includes(query.toLowerCase()) ||
          a.genres.some((g) => g.toLowerCase().includes(query.toLowerCase())) ||
          a.franchise?.toLowerCase().includes(query.toLowerCase()) ||
          a.studio?.toLowerCase().includes(query.toLowerCase())
      )
    : animes.slice(0, 8);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
      } else if (e.key === 'Escape' && isOpen) {
        onClose();
      } else if (e.key === 'ArrowDown' && isOpen) {
        e.preventDefault();
        setSelectedIndex((prev) => (filtered.length ? Math.min(prev + 1, filtered.length - 1) : 0));
      } else if (e.key === 'ArrowUp' && isOpen) {
        e.preventDefault();
        setSelectedIndex((prev) => Math.max(prev - 1, 0));
      } else if (e.key === 'Enter' && isOpen && filtered.length > 0) {
        e.preventDefault();
        const selected = filtered[selectedIndex] || filtered[0];
        if (selected) {
          onSelectAnime(selected);
          onClose();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose, filtered, selectedIndex, onSelectAnime]);

  if (!isOpen) return null;

  const quickActions = [
    {
      id: 'action-miner',
      title: 'Miner Video Stream & Sniffer',
      subtitle: 'Scanează stream-uri MP4, playlist-uri HLS (.m3u8) și embed-uri',
      icon: '⛏️',
      action: () => {
        if (onOpenMiner) onOpenMiner();
        onClose();
      },
    },
    {
      id: 'action-studio',
      title: 'Panou Admin & Bază de Date',
      subtitle: 'Adaugă titluri, gestionează episoade, backup & reset DB local',
      icon: '🎬',
      action: () => {
        if (onOpenStudio) onOpenStudio();
        onClose();
      },
    },
    {
      id: 'action-watchlist',
      title: 'Lista Mea de Conținut',
      subtitle: 'Vezi titlurile salvate, cele în curs de vizionare și finalizate',
      icon: '🍿',
      action: () => {
        if (onSelectTab) onSelectTab('watchlist');
        onClose();
      },
    },
    {
      id: 'action-history',
      title: 'Istoric de Vizionare',
      subtitle: 'Reia episoadele de la secunda exactă salvată în baza de date',
      icon: '⏱️',
      action: () => {
        if (onSelectTab) onSelectTab('history');
        onClose();
      },
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-20 px-4 bg-neutral-950/80 backdrop-blur-md animate-in fade-in duration-150">
      <div className="w-full max-w-2xl bg-neutral-900 border border-neutral-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
        {/* Search Input Bar */}
        <div className="p-4 border-b border-neutral-800 flex items-center gap-3 bg-neutral-950/60 shrink-0">
          <Search className="w-5 h-5 text-rose-500 shrink-0" />
          <input
            autoFocus
            type="text"
            placeholder="Caută titluri, anime, studio, francize (ex: Titan, Frieren, MAPPA)..."
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
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
        <div className="px-4 py-2.5 bg-neutral-950/40 border-b border-neutral-800 flex items-center gap-2 overflow-x-auto text-xs text-neutral-400 shrink-0">
          <span className="text-[11px] font-bold text-neutral-500 uppercase tracking-wider shrink-0">
            Filtrează:
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

        {/* Quick Actions (when no query or query matches action) */}
        {!query.trim() && (
          <div className="p-3 border-b border-neutral-800/80 bg-neutral-950/20 shrink-0">
            <p className="text-[10px] font-bold text-neutral-500 uppercase tracking-wider mb-2 px-2">
              Comenzi & Comenzi Rapide
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
              {quickActions.map((act) => (
                <button
                  key={act.id}
                  onClick={act.action}
                  className="flex items-center gap-2.5 p-2 rounded-xl bg-neutral-900/60 hover:bg-neutral-800 border border-neutral-800/60 text-left transition cursor-pointer group"
                >
                  <span className="text-base">{act.icon}</span>
                  <div className="min-w-0">
                    <p className="text-xs font-semibold text-white group-hover:text-rose-400 transition truncate">
                      {act.title}
                    </p>
                    <p className="text-[10px] text-neutral-400 truncate">{act.subtitle}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Search Results List */}
        <div className="overflow-y-auto p-2 divide-y divide-neutral-800/40 flex-1">
          {filtered.length === 0 ? (
            <div className="py-12 text-center text-xs text-neutral-500">
              Niciun rezultat găsit pentru „{query}”. Poți adăuga link-ul direct prin Minerul Video!
            </div>
          ) : (
            filtered.map((item, index) => (
              <button
                key={item.id}
                onClick={() => {
                  onSelectAnime(item);
                  onClose();
                }}
                className={`w-full flex items-center justify-between p-2.5 rounded-xl transition text-left cursor-pointer group ${
                  selectedIndex === index
                    ? 'bg-neutral-800 text-white ring-1 ring-rose-500/50'
                    : 'hover:bg-neutral-800/80'
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <img
                    src={item.coverImage}
                    alt={item.title}
                    className="w-9 h-12 rounded-lg object-cover shrink-0 border border-neutral-800 shadow"
                  />
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-white group-hover:text-rose-400 transition truncate">
                      {item.title}
                    </p>
                    <p className="text-[11px] text-neutral-400 truncate">
                      {item.releaseYear} · {item.studio} · {item.genres.slice(0, 2).join(', ')}
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
