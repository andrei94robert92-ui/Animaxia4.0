import React, { useState, useEffect } from 'react';
import { Sparkles, ChevronLeft, ChevronRight, Play, Star, Film, Tv } from 'lucide-react';
import { ExternalPoster, Anime } from '../types/anime';
import { api } from '../services/api';

interface AIFluxInfinitSectionProps {
  animes?: Anime[];
  onPlayAnime: (anime: Anime) => void;
  onOpenDetails: (anime: Anime) => void;
}

export const AIFluxInfinitSection: React.FC<AIFluxInfinitSectionProps> = ({
  animes = [],
  onPlayAnime,
  onOpenDetails,
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [posters, setPosters] = useState<ExternalPoster[]>([]);
  const [totalPages, setTotalPages] = useState(50);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    loadPosters(currentPage);
  }, [currentPage]);

  const loadPosters = async (page: number) => {
    setIsLoading(true);
    try {
      const data = await api.getExternalFeed(page);
      setPosters(data.items);
      setTotalPages(data.totalPages || 50);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePosterClick = (p: ExternalPoster) => {
    // Check if we have an exact or close match in our database
    const matched = animes.find(
      (a) =>
        a.id === p.id ||
        a.title.toLowerCase() === p.title.toLowerCase() ||
        a.romajiTitle?.toLowerCase() === p.title.toLowerCase() ||
        a.englishTitle?.toLowerCase() === p.title.toLowerCase() ||
        p.title.toLowerCase().includes(a.title.toLowerCase())
    );

    if (matched) {
      onOpenDetails(matched);
      return;
    }

    const syntheticAnime: Anime = {
      id: p.id,
      title: p.title,
      romajiTitle: p.title,
      englishTitle: p.title,
      description: `Titlu din fluxul universal Animaxia. Lansat în ${p.year}, notă ${p.rating}/10.`,
      coverImage: p.cover,
      bannerImage: p.cover,
      genres: p.genres,
      category: (p.category as any) || 'movie',
      rating: p.rating,
      totalRatings: 840,
      releaseYear: p.year,
      status: 'Finalizat',
      studio: 'Animaxia Global',
      ageRating: '13+',
      featured: false,
      totalEpisodes: 1,
      episodes: [
        {
          id: `${p.id}-ep1`,
          seasonNumber: 1,
          episodeNumber: 1,
          title: `${p.title} - Stream HD`,
          description: 'Redare completă stream adaptiv.',
          thumbnail: p.cover,
          duration: '1h 45m',
          durationSeconds: 6300,
          videoUrl: 'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8',
          streamType: 'hls',
        },
      ],
      createdAt: new Date().toISOString(),
    };

    onOpenDetails(syntheticAnime);
  };

  return (
    <section className="mb-12">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xl">🧠</span>
            <h3 className="text-xl font-bold text-white tracking-tight">
              AI Flux Infinit — 20 de postere pe pagină
            </h3>
          </div>
          <p className="text-xs text-neutral-400 mt-0.5">
            Pagini numerotate create automat · next / prev · scroll infinit activat de AI
          </p>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-xs font-mono text-neutral-400 bg-neutral-900 px-3 py-1 rounded-lg border border-neutral-800">
            {totalPages} pagini · 1.000 postere
          </span>
        </div>
      </div>

      {/* 20 Posters Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 gap-3.5">
        {posters.map((poster) => (
          <div
            key={poster.id}
            onClick={() => handlePosterClick(poster)}
            className="group relative rounded-xl bg-neutral-900 border border-neutral-800/80 hover:border-neutral-700 overflow-hidden cursor-pointer transition-all hover:-translate-y-1 hover:shadow-xl hover:shadow-rose-950/20"
          >
            <div className="relative aspect-[3/4] w-full overflow-hidden bg-neutral-950">
              <img
                src={poster.cover}
                alt={poster.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-transparent to-transparent opacity-80 group-hover:opacity-60 transition-opacity" />

              {/* Rating */}
              <div className="absolute top-2 left-2 flex items-center gap-1 font-bold text-[10px] text-amber-300 bg-neutral-950/80 px-2 py-0.5 rounded border border-neutral-800">
                <Star className="w-3 h-3 fill-amber-300" />
                {poster.rating}
              </div>

              {/* Play Hover */}
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-neutral-950/40">
                <div className="w-10 h-10 rounded-full bg-rose-600 text-white flex items-center justify-center shadow-lg">
                  <Play className="w-4 h-4 fill-white translate-x-0.5" />
                </div>
              </div>

              {/* Bottom year */}
              <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between text-[11px] text-neutral-300 font-medium">
                <span>{poster.year}</span>
                <span className="text-[10px] uppercase font-bold text-rose-400 bg-neutral-950/80 px-1.5 py-0.2 rounded border border-neutral-800">
                  {poster.category}
                </span>
              </div>
            </div>

            <div className="p-2.5">
              <h4 className="font-bold text-xs text-white truncate group-hover:text-rose-300 transition">
                {poster.title}
              </h4>
              <p className="text-[10px] text-neutral-400 truncate mt-0.5">
                {poster.genres.join(' · ')}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination Controls */}
      <div className="flex items-center justify-center gap-2 mt-6 pt-4 border-t border-neutral-800/80">
        <button
          onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
          disabled={currentPage === 1}
          className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-neutral-900 hover:bg-neutral-800 disabled:opacity-40 text-xs font-semibold text-neutral-300 border border-neutral-800 cursor-pointer"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Prev</span>
        </button>

        <div className="flex items-center gap-1">
          {[1, 2, 3, 4, 5].map((pg) => (
            <button
              key={pg}
              onClick={() => setCurrentPage(pg)}
              className={`w-8 h-8 rounded-lg text-xs font-bold transition cursor-pointer ${
                currentPage === pg
                  ? 'bg-rose-600 text-white shadow'
                  : 'bg-neutral-900 hover:bg-neutral-800 text-neutral-400 hover:text-white border border-neutral-800'
              }`}
            >
              {pg}
            </button>
          ))}
          <span className="text-xs text-neutral-600 px-1">...</span>
          <button
            onClick={() => setCurrentPage(totalPages)}
            className={`w-8 h-8 rounded-lg text-xs font-bold transition cursor-pointer ${
              currentPage === totalPages
                ? 'bg-rose-600 text-white shadow'
                : 'bg-neutral-900 hover:bg-neutral-800 text-neutral-400 hover:text-white border border-neutral-800'
            }`}
          >
            {totalPages}
          </button>
        </div>

        <button
          onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
          disabled={currentPage === totalPages}
          className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-neutral-900 hover:bg-neutral-800 disabled:opacity-40 text-xs font-semibold text-neutral-300 border border-neutral-800 cursor-pointer"
        >
          <span>Next</span>
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </section>
  );
};
