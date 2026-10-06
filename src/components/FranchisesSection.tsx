import React from 'react';
import { Sparkles, Compass } from 'lucide-react';

interface FranchisesSectionProps {
  onSelectFranchise: (franchise: string) => void;
  selectedFranchise: string;
}

const FRANCHISES = [
  'Naruto',
  'One Piece',
  'Dragon Ball',
  'Demon Slayer',
  'Jujutsu Kaisen',
  'Attack on Titan',
  'My Hero Academia',
  'Spy x Family',
  'Marvel',
  'Star Wars',
  'Harry Potter',
  'Lord of the Rings',
  'DC Universe',
  'James Bond',
  'Fast & Furious',
  'Mission: Impossible',
];

export const FranchisesSection: React.FC<FranchisesSectionProps> = ({
  onSelectFranchise,
  selectedFranchise,
}) => {
  return (
    <section className="mb-12">
      <div className="flex items-center justify-between mb-4">
        <div>
          <div className="flex items-center gap-2">
            <Compass className="w-5 h-5 text-rose-500" />
            <h3 className="text-xl font-bold text-white tracking-tight">
              Francize populare
            </h3>
          </div>
          <p className="text-xs text-neutral-400 mt-0.5">
            Sari direct într-un univers care îți place
          </p>
        </div>

        {selectedFranchise !== 'Toate' && (
          <button
            onClick={() => onSelectFranchise('Toate')}
            className="text-xs text-rose-400 hover:text-rose-300 font-semibold cursor-pointer"
          >
            Resetează selecția ({selectedFranchise})
          </button>
        )}
      </div>

      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {FRANCHISES.map((fr) => {
          const isSelected = selectedFranchise.toLowerCase() === fr.toLowerCase();

          return (
            <button
              key={fr}
              onClick={() => onSelectFranchise(isSelected ? 'Toate' : fr)}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer border ${
                isSelected
                  ? 'bg-rose-600 text-white border-rose-500 shadow-lg shadow-rose-600/30 scale-105'
                  : 'bg-neutral-900/80 hover:bg-neutral-800 text-neutral-300 hover:text-white border-neutral-800'
              }`}
            >
              {fr}
            </button>
          );
        })}
      </div>
    </section>
  );
};
