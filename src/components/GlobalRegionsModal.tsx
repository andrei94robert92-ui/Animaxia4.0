import React, { useState, useEffect } from 'react';
import {
  X, Globe, MapPin, Play, Star, Sparkles, Film,
  Compass, ArrowRight, Building, Check
} from 'lucide-react';
import { Anime } from '../types/anime';

interface GlobalRegionsModalProps {
  isOpen: boolean;
  onClose: () => void;
  animes: Anime[];
  selectedContinentName?: string;
  onPlayAnime: (anime: Anime) => void;
}

interface RegionInfo {
  id: string;
  name: string;
  icon: string;
  countries: string;
  description: string;
  studios: string[];
  sampleTitles: string[];
}

const REGIONS: RegionInfo[] = [
  {
    id: 'asia',
    name: 'Asia',
    icon: '🏯',
    countries: '🇯🇵 Japonia • 🇰🇷 Coreea de Sud • 🇨🇳 China',
    description: 'Inima culturii anime mondiale. De la capodopere shounen la seriale psihologice și filme Ghibli de patrimoniu.',
    studios: ['MAPPA', 'Wit Studio', 'Studio Ghibli', 'Bones', 'Madhouse', 'CloverWorks'],
    sampleTitles: ['Attack on Titan', 'Steins;Gate', 'Chainsaw Man', 'Frieren', 'Solo Leveling'],
  },
  {
    id: 'europa',
    name: 'Europa',
    icon: '🇪🇺',
    countries: '🇳🇱 Olanda • 🇫🇷 Franța • 🇩🇪 Germania • 🇷🇴 România • 🇬🇧 UK',
    description: 'Pionierat în animația open-source 3D (Blender Foundation), coproducții artistice europene și animație indie.',
    studios: ['Blender Foundation (Amsterdam)', 'Fortiche (Paris)', 'Aardman (UK)'],
    sampleTitles: ['Sintel', 'Big Buck Bunny', 'Tears of Steel', 'Elephants Dream'],
  },
  {
    id: 'nord-america',
    name: 'America de Nord',
    icon: '🌎',
    countries: '🇺🇸 Statele Unite ale Americii • 🇨🇦 Canada',
    description: 'Blockbustere internaționale, universuri animate de benzi desenate și seriale de acțiune cu distribuție globală.',
    studios: ['Riot Games Animation', 'Warner Bros Animation', 'Disney Feature'],
    sampleTitles: ['Arcane', 'Spider-Man: Across the Spider-Verse', 'The Matrix Resurrections'],
  },
  {
    id: 'sud-america',
    name: 'America de Sud',
    icon: '🌏',
    countries: '🇧🇷 Brazilia • 🇦🇷 Argentina • 🇨🇱 Chile • 🇨🇴 Columbia',
    description: 'Comunitate pasionată otaku și animații independente inspirate din miturile indigene și realismul magic.',
    studios: ['Animaxia Latin Studios', 'Albatros Indie'],
    sampleTitles: ['Animaxia HLS Master Demo'],
  },
  {
    id: 'africa',
    name: 'Africa',
    icon: '🌍',
    countries: '🇳🇬 Nigeria • 🇿🇦 Africa de Sud • 🇪🇬 Egipt • 🇰🇪 Kenya',
    description: 'Noua generație de animatori și benzi desenate afrofuturiste, mitologia continentului și premiere de festival.',
    studios: ['Triggerfish Animation', 'Kugali Media'],
    sampleTitles: ['Animaxia Global Feed'],
  },
  {
    id: 'oceania',
    name: 'Oceania',
    icon: '🏝️',
    countries: '🇦🇺 Australia • 🇳🇿 Noua Zeelandă',
    description: 'Efecte speciale vizuale de clasă mondială, studiouri de post-producție și animații de autor premiate.',
    studios: ['Animal Logic (Sydney)', 'Wētā FX (Wellington)'],
    sampleTitles: ['Animaxia Universal Stream'],
  },
];

export const GlobalRegionsModal: React.FC<GlobalRegionsModalProps> = ({
  isOpen,
  onClose,
  animes,
  selectedContinentName,
  onPlayAnime,
}) => {
  const [activeRegionId, setActiveRegionId] = useState<string>(() => {
    if (selectedContinentName) {
      const match = REGIONS.find((r) =>
        r.name.toLowerCase().includes(selectedContinentName.toLowerCase()) ||
        selectedContinentName.toLowerCase().includes(r.id)
      );
      if (match) return match.id;
    }
    return 'asia';
  });

  useEffect(() => {
    if (selectedContinentName) {
      const match = REGIONS.find((r) =>
        r.name.toLowerCase().includes(selectedContinentName.toLowerCase()) ||
        selectedContinentName.toLowerCase().includes(r.id)
      );
      if (match) setActiveRegionId(match.id);
    }
  }, [selectedContinentName]);

  if (!isOpen) return null;

  const currentRegion = REGIONS.find((r) => r.id === activeRegionId) || REGIONS[0];

  // Match real animes from DB
  const matchingAnimes = animes.filter((a) => {
    if (currentRegion.id === 'asia') {
      return !a.studio?.includes('Blender') && !a.studio?.includes('Riot');
    }
    if (currentRegion.id === 'europa') {
      return a.studio?.includes('Blender') || a.franchise?.includes('Open Movies');
    }
    if (currentRegion.id === 'nord-america') {
      return a.studio?.includes('Riot') || a.category === 'movie';
    }
    return true;
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-neutral-950/90 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl bg-neutral-900 border border-neutral-800 rounded-3xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-5 bg-gradient-to-r from-blue-950 via-neutral-900 to-indigo-950/70 border-b border-neutral-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-blue-500 to-indigo-500 flex items-center justify-center shadow-lg shadow-blue-500/25">
              <Globe className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-black text-white font-['Space_Grotesk'] tracking-wide">
                  LUMEA — 196 DE ȚĂRI &amp; 6 CONTINENTE
                </h2>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-500/20 text-blue-300 border border-blue-500/30">
                  Global Streaming
                </span>
              </div>
              <p className="text-xs text-neutral-400">
                Explorează producțiile de animație și studiourile internaționale grupate pe regiuni
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

        {/* Continents Selector Pills */}
        <div className="p-3 bg-neutral-950/80 border-b border-neutral-800 flex items-center gap-2 overflow-x-auto scrollbar-none">
          {REGIONS.map((reg) => {
            const isSelected = reg.id === currentRegion.id;
            return (
              <button
                key={reg.id}
                onClick={() => setActiveRegionId(reg.id)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-2 whitespace-nowrap cursor-pointer ${
                  isSelected
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30 border border-blue-500'
                    : 'bg-neutral-900 text-neutral-400 hover:text-white hover:bg-neutral-800 border border-neutral-800'
                }`}
              >
                <span>{reg.icon}</span>
                <span>{reg.name}</span>
              </button>
            );
          })}
        </div>

        {/* Region Content Body */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-6 flex-1 text-xs">
          {/* Banner info */}
          <div className="p-5 bg-neutral-950/70 rounded-2xl border border-neutral-800 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-2xl">{currentRegion.icon}</span>
                <h3 className="text-base font-black text-white">{currentRegion.name}</h3>
              </div>
              <span className="text-xs text-blue-400 font-mono font-semibold">
                {currentRegion.countries}
              </span>
            </div>
            <p className="text-xs text-neutral-300 leading-relaxed">{currentRegion.description}</p>

            <div className="pt-2 border-t border-neutral-800 flex flex-wrap gap-2 items-center">
              <span className="text-[11px] font-bold text-neutral-400">Studiouri principale:</span>
              {currentRegion.studios.map((s) => (
                <span
                  key={s}
                  className="px-2 py-0.5 rounded bg-neutral-900 text-neutral-300 border border-neutral-800 font-mono text-[10px]"
                >
                  {s}
                </span>
              ))}
            </div>
          </div>

          {/* Titles produced in this region */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                Titluri Disponibile în Baza de Date ({matchingAnimes.length})
              </h4>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {matchingAnimes.map((anime) => (
                <div
                  key={anime.id}
                  onClick={() => {
                    onPlayAnime(anime);
                    onClose();
                  }}
                  className="p-3 bg-neutral-950/60 hover:bg-neutral-850 rounded-2xl border border-neutral-800 flex items-center gap-3 transition cursor-pointer group"
                >
                  <img
                    src={anime.coverImage}
                    alt={anime.title}
                    className="w-14 aspect-[3/4] object-cover rounded-xl border border-neutral-800 shrink-0"
                  />
                  <div className="min-w-0 flex-1">
                    <span className="text-[10px] text-blue-400 font-semibold">{anime.studio}</span>
                    <h5 className="text-xs font-bold text-white truncate group-hover:text-blue-300 transition-colors">
                      {anime.title}
                    </h5>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-[10px] text-amber-300 font-mono">★ {anime.rating.toFixed(1)}</span>
                      <span className="text-neutral-600">·</span>
                      <span className="text-[10px] text-neutral-400">{anime.releaseYear}</span>
                    </div>
                  </div>
                  <Play className="w-4 h-4 text-blue-500 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
