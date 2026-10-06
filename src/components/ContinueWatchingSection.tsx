import React from 'react';
import { Play, Clock, X, CheckCircle2 } from 'lucide-react';
import { WatchHistoryItem, Anime } from '../types/anime';

interface ContinueWatchingSectionProps {
  history: WatchHistoryItem[];
  animes: Anime[];
  onPlayResume: (animeId: string, episodeId: string, progressSeconds: number) => void;
  onRemoveHistory: (animeId: string) => void;
}

export const ContinueWatchingSection: React.FC<ContinueWatchingSectionProps> = ({
  history,
  animes,
  onPlayResume,
  onRemoveHistory,
}) => {
  if (!history.length) return null;

  return (
    <section className="mb-10">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Clock className="w-5 h-5 text-rose-500" />
          <h2 className="text-xl font-bold text-white tracking-tight">Continuă Vizionarea</h2>
          <span className="text-xs text-neutral-400 font-mono bg-neutral-900 px-2 py-0.5 rounded border border-neutral-800">
            {history.length} active
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {history.map((item) => {
          const anime = animes.find((a) => a.id === item.animeId);
          const percent = item.progressPercent || 0;
          const mins = Math.floor(item.progressSeconds / 60);
          const remainingMins = Math.max(0, Math.floor((item.durationSeconds - item.progressSeconds) / 60));

          return (
            <div
              key={`${item.animeId}-${item.episodeId}`}
              className="group relative bg-neutral-900/90 rounded-2xl border border-neutral-800/80 overflow-hidden hover:border-neutral-700 transition shadow-lg flex flex-col justify-between"
            >
              {/* Thumbnail Container */}
              <div className="relative aspect-video w-full overflow-hidden bg-neutral-950">
                <img
                  src={item.episodeThumbnail || item.animeCover}
                  alt={item.animeTitle}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-neutral-950/40 group-hover:bg-neutral-950/20 transition-colors" />

                {/* Play Button Overlay */}
                <button
                  onClick={() => onPlayResume(item.animeId, item.episodeId, item.progressSeconds)}
                  className="absolute inset-0 m-auto w-12 h-12 rounded-full bg-rose-600/90 hover:bg-rose-500 text-white flex items-center justify-center shadow-xl group-hover:scale-110 active:scale-95 transition-all cursor-pointer"
                  title="Reia redarea"
                >
                  <Play className="w-5 h-5 fill-white translate-x-0.5" />
                </button>

                {/* Remove button */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onRemoveHistory(item.animeId);
                  }}
                  className="absolute top-2 right-2 w-7 h-7 rounded-full bg-neutral-950/80 hover:bg-rose-600 text-neutral-400 hover:text-white flex items-center justify-center transition cursor-pointer"
                  title="Elimină din istoric"
                >
                  <X className="w-3.5 h-3.5" />
                </button>

                {/* Episode Badge */}
                <div className="absolute bottom-2 left-2 bg-neutral-950/80 backdrop-blur-md px-2 py-0.5 rounded text-[11px] font-semibold text-neutral-200 border border-neutral-800">
                  Ep. {item.episodeNumber || 1}
                </div>

                {/* Duration remaining */}
                <div className="absolute bottom-2 right-2 bg-neutral-950/80 backdrop-blur-md px-2 py-0.5 rounded text-[11px] font-mono text-neutral-300">
                  {remainingMins > 0 ? `${remainingMins} min rămase` : 'Finalizat'}
                </div>
              </div>

              {/* Progress Bar */}
              <div className="w-full bg-neutral-800 h-1.5 overflow-hidden">
                <div
                  className="bg-rose-500 h-full transition-all duration-300"
                  style={{ width: `${percent}%` }}
                />
              </div>

              {/* Details & Info */}
              <div className="p-3.5">
                <h3 className="font-bold text-sm text-white truncate group-hover:text-rose-400 transition">
                  {item.animeTitle}
                </h3>
                <p className="text-xs text-neutral-400 truncate mt-0.5">
                  {item.episodeTitle || `Episodul ${item.episodeNumber}`}
                </p>

                <div className="mt-3 pt-2 border-t border-neutral-800/80 flex items-center justify-between text-xs">
                  <span className="text-neutral-500">Progres: {percent}%</span>
                  <button
                    onClick={() => onPlayResume(item.animeId, item.episodeId, item.progressSeconds)}
                    className="text-rose-400 hover:text-rose-300 font-semibold cursor-pointer"
                  >
                    Reia acum →
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
