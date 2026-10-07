import React, { useMemo } from 'react';
import { Compass, Sparkles, Film } from 'lucide-react';
import { Anime } from '../types/anime';

interface FranchisesSectionProps {
  onSelectFranchise: (franchise: string) => void;
  selectedFranchise: string;
  animes?: Anime[];
}

export const FranchisesSection: React.FC<FranchisesSectionProps> = ({
  onSelectFranchise,
  selectedFranchise,
  animes = [],
}) => {
  // Extract distinct franchises from actual loaded animes
  const franchiseList = useMemo(() => {
    const map = new Map<string, number>();

    animes.forEach((a) => {
      if (a.franchise && a.franchise.trim()) {
        map.set(a.franchise, (map.get(a.franchise) || 0) + 1);
      }
    });

    // Fallbacks if empty
    if (map.size === 0) {
      return [
        { name: 'Attack on Titan', count: 1 },
        { name: 'Demon Slayer', count: 1 },
        { name: 'Jujutsu Kaisen', count: 1 },
        { name: 'Frieren Universe', count: 1 },
        { name: 'Open Movies', count: 3 },
      ];
    }

    return Array.from(map.entries())
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count);
  }, [animes]);

  return (
    <section className="mb-12">
      <div className="flex items-center justify-between mb-4">
        <div>
          <div className="flex items-center gap-2">
            <Compass className="w-5 h-5 text-rose-500" />
            <h3 className="text-xl font-bold text-white tracking-tight">
              Francize & Universuri Conexe
            </h3>
          </div>
          <p className="text-xs text-neutral-400 mt-0.5">
            Explorează universuri complete din catalogul Animaxia
          </p>
        </div>

        {selectedFranchise !== 'Toate' && (
          <button
            onClick={() => onSelectFranchise('Toate')}
            className="text-xs text-rose-400 hover:text-rose-300 font-semibold cursor-pointer flex items-center gap-1"
          >
            <span>Resetează filtru</span>
            <span className="font-mono bg-rose-500/20 px-1.5 py-0.5 rounded text-[10px]">
              {selectedFranchise}
            </span>
          </button>
        )}
      </div>

      <div className="flex items-center gap-2.5 overflow-x-auto pb-2 scrollbar-none">
        <button
          onClick={() => onSelectFranchise('Toate')}
          className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer border ${
            selectedFranchise === 'Toate'
              ? 'bg-rose-600 text-white border-rose-500 shadow-lg shadow-rose-600/30'
              : 'bg-neutral-900/80 hover:bg-neutral-800 text-neutral-300 hover:text-white border-neutral-800'
          }`}
        >
          Toate Universurile ({animes.length})
        </button>

        {franchiseList.map((fr) => {
          const isSelected = selectedFranchise.toLowerCase() === fr.name.toLowerCase();

          return (
            <button
              key={fr.name}
              onClick={() => onSelectFranchise(isSelected ? 'Toate' : fr.name)}
              className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer border flex items-center gap-2 ${
                isSelected
                  ? 'bg-rose-600 text-white border-rose-500 shadow-lg shadow-rose-600/30 scale-105'
                  : 'bg-neutral-900/80 hover:bg-neutral-800 text-neutral-300 hover:text-white border-neutral-800'
              }`}
            >
              <span>{fr.name}</span>
              <span
                className={`text-[10px] font-mono px-1.5 py-0.2 rounded-md ${
                  isSelected ? 'bg-black/30 text-white' : 'bg-neutral-800 text-neutral-400'
                }`}
              >
                {fr.count}
              </span>
            </button>
          );
        })}
      </div>
    </section>
  );
};
