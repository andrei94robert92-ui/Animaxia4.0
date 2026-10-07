import React, { useState, useEffect } from 'react';
import {
  X, Layers, Play, Star, Calendar, Clock, Film,
  Sparkles, Check, ArrowRight
} from 'lucide-react';
import { Anime } from '../types/anime';

interface UniversesModalProps {
  isOpen: boolean;
  onClose: () => void;
  animes: Anime[];
  selectedUniverseName?: string;
  onPlayAnime: (anime: Anime) => void;
}

interface UniverseCategory {
  id: string;
  name: string;
  badge: string;
  icon: string;
  description: string;
  titles: string[];
}

const UNIVERSES: UniverseCategory[] = [
  {
    id: 'francise',
    name: 'Francize Anime de Top',
    badge: '👑 Shounen & Seinen',
    icon: '⚔️',
    description: 'Saga-uri masive cu continuitate extinsă, lore adânc și bătălii legendare.',
    titles: ['Attack on Titan', 'Steins;Gate', 'Chainsaw Man', 'Frieren: Beyond Journey\'s End'],
  },
  {
    id: 'trilogii',
    name: 'Trilogii & Open Movies',
    badge: '🎞️ Blender Classics',
    icon: '🎬',
    description: 'Filmele open source premiate realizate de Blender Institute și comunitatea globală.',
    titles: ['Sintel', 'Big Buck Bunny', 'Tears of Steel', 'Elephants Dream'],
  },
  {
    id: 'marvel',
    name: 'Universul Marvel Animat',
    badge: '🦸 Supereroi',
    icon: '⚡',
    description: 'Animațiile de aur Marvel din anii 90 și blockbusterele moderne din multivers.',
    titles: ['Spider-Man: Across the Spider-Verse', 'Fox Kids Classic'],
  },
  {
    id: 'dc',
    name: 'Universul Cyberpunk & Sci-Fi',
    badge: '🌃 Neon & Dystopia',
    icon: '🤖',
    description: 'Lumi futuriste întunecate, tehnologie avansată și lupte psihologice.',
    titles: ['Cyberpunk: Edgerunners', 'The Matrix Resurrections'],
  },
  {
    id: 'blockbustere',
    name: 'Blockbustere Animate Mondiale',
    badge: '💥 Recorduri de Box Office',
    icon: '🏆',
    description: 'Cele mai premiate și vizual impresionante producții din ultimii ani.',
    titles: ['Arcane: League of Legends', 'Solo Leveling', 'Your Name (Kimi no Na wa)'],
  },
];

export const UniversesModal: React.FC<UniversesModalProps> = ({
  isOpen,
  onClose,
  animes,
  selectedUniverseName,
  onPlayAnime,
}) => {
  const [activeUniverseId, setActiveUniverseId] = useState<string>(() => {
    if (selectedUniverseName) {
      const match = UNIVERSES.find((u) =>
        u.name.toLowerCase().includes(selectedUniverseName.toLowerCase()) ||
        selectedUniverseName.toLowerCase().includes(u.id)
      );
      if (match) return match.id;
    }
    return 'francise';
  });

  useEffect(() => {
    if (selectedUniverseName) {
      const match = UNIVERSES.find((u) =>
        u.name.toLowerCase().includes(selectedUniverseName.toLowerCase()) ||
        selectedUniverseName.toLowerCase().includes(u.id)
      );
      if (match) setActiveUniverseId(match.id);
    }
  }, [selectedUniverseName]);

  if (!isOpen) return null;

  const currentUniverse = UNIVERSES.find((u) => u.id === activeUniverseId) || UNIVERSES[0];

  // Match real animes
  const matchingAnimes = animes.filter((a) => {
    return (
      currentUniverse.titles.some((t) => a.title.toLowerCase().includes(t.toLowerCase())) ||
      (currentUniverse.id === 'trilogii' && a.franchise?.includes('Open Movies')) ||
      (currentUniverse.id === 'francise' && a.category === 'anime')
    );
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-neutral-950/90 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl bg-neutral-900 border border-neutral-800 rounded-3xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-5 bg-gradient-to-r from-purple-950 via-neutral-900 to-rose-950/70 border-b border-neutral-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-purple-600 to-rose-500 flex items-center justify-center shadow-lg shadow-purple-600/25">
              <Layers className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-black text-white font-['Space_Grotesk'] tracking-wide">
                  UNIVERSURI CINEMATOGRAFICE &amp; FRANCIZE
                </h2>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 border border-purple-500/30">
                  Timeline Complet
                </span>
              </div>
              <p className="text-xs text-neutral-400">
                Ordinea cronologică de vizionare a marilor francize, trilogii și producții de cult
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-neutral-800/80 hover:bg-neutral-700 text-neutral-400 hover:text-white flex items-center justify-center border border-neutral-700 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Universes Tabs Bar */}
        <div className="p-3 bg-neutral-950/80 border-b border-neutral-800 flex items-center gap-2 overflow-x-auto scrollbar-none">
          {UNIVERSES.map((u) => {
            const isSelected = u.id === currentUniverse.id;
            return (
              <button
                key={u.id}
                onClick={() => setActiveUniverseId(u.id)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-2 whitespace-nowrap cursor-pointer ${
                  isSelected
                    ? 'bg-purple-600 text-white shadow-md shadow-purple-600/30 border border-purple-500'
                    : 'bg-neutral-900 text-neutral-400 hover:text-white hover:bg-neutral-800 border border-neutral-800'
                }`}
              >
                <span>{u.icon}</span>
                <span>{u.name}</span>
              </button>
            );
          })}
        </div>

        {/* Content Body */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-6 flex-1 text-xs">
          {/* Banner Description */}
          <div className="p-4 bg-neutral-950/70 rounded-2xl border border-neutral-800 space-y-1">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <span>{currentUniverse.icon}</span>
                <span>{currentUniverse.name}</span>
              </h3>
              <span className="text-[10px] font-mono text-purple-400 bg-purple-400/10 px-2 py-0.5 rounded border border-purple-400/20 font-bold">
                {currentUniverse.badge}
              </span>
            </div>
            <p className="text-xs text-neutral-300">{currentUniverse.description}</p>
          </div>

          {/* Timeline of Titles */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-neutral-400 uppercase tracking-wider">
              Cronologie &amp; Episoade Recomandate
            </h4>

            <div className="space-y-3">
              {matchingAnimes.map((anime, idx) => (
                <div
                  key={anime.id}
                  className="p-3.5 bg-neutral-950/60 hover:bg-neutral-850 rounded-2xl border border-neutral-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 transition group"
                >
                  <div className="flex items-center gap-3">
                    <span className="w-6 h-6 rounded-full bg-neutral-900 text-neutral-500 font-mono text-xs flex items-center justify-center shrink-0 border border-neutral-800">
                      {idx + 1}
                    </span>
                    <img
                      src={anime.coverImage}
                      alt={anime.title}
                      className="w-14 aspect-[3/4] object-cover rounded-xl border border-neutral-800 shrink-0"
                    />
                    <div>
                      <span className="text-[10px] font-semibold text-purple-400">{anime.studio}</span>
                      <h5 className="text-sm font-bold text-white">{anime.title}</h5>
                      <div className="flex items-center gap-2 text-neutral-400 text-[11px] mt-0.5">
                        <span className="text-amber-300 font-mono">★ {anime.rating.toFixed(1)}</span>
                        <span>·</span>
                        <span>{anime.releaseYear}</span>
                        <span>·</span>
                        <span>{anime.episodes?.length || anime.totalEpisodes} Ep.</span>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      onPlayAnime(anime);
                      onClose();
                    }}
                    className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs flex items-center gap-1.5 transition cursor-pointer shrink-0 shadow-md shadow-purple-600/30"
                  >
                    <Play className="w-3.5 h-3.5 fill-white" />
                    <span>Redă acum</span>
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
