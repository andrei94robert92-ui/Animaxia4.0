import React, { useState } from 'react';
import { Sparkles, X, Search, Check, Play, Plus, AlertCircle, Globe, ExternalLink, ShieldCheck, Video, Tv } from 'lucide-react';
import { api } from '../services/api';
import { Anime, ContentCategory } from '../types/anime';

interface MinerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onStreamIngested: (anime: Anime) => void;
  onTestPlay?: (anime: Anime) => void;
}

const PRESET_STREAMS = [
  {
    name: 'HLS Master Adaptive (.m3u8)',
    url: 'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8',
    category: 'movie' as ContentCategory,
    format: 'HLS',
  },
  {
    name: 'Sintel HD Animation (.mp4)',
    url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4',
    category: 'movie' as ContentCategory,
    format: 'MP4',
  },
  {
    name: 'Big Buck Bunny Full (.mp4)',
    url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
    category: 'movie' as ContentCategory,
    format: 'MP4',
  },
  {
    name: 'Tears of Steel Sci-Fi (.mp4)',
    url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4',
    category: 'movie' as ContentCategory,
    format: 'MP4',
  },
  {
    name: 'YouTube Stream Embed',
    url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    category: 'anime' as ContentCategory,
    format: 'YOUTUBE',
  },
];

export const MinerModal: React.FC<MinerModalProps> = ({
  isOpen,
  onClose,
  onStreamIngested,
  onTestPlay,
}) => {
  const [scanUrl, setScanUrl] = useState('');
  const [isScanning, setIsScanning] = useState(false);
  const [results, setResults] = useState<any | null>(null);
  const [ingestedUrls, setIngestedUrls] = useState<Record<string, boolean>>({});
  const [customTitle, setCustomTitle] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<ContentCategory>('mined');

  if (!isOpen) return null;

  const handleScan = async (e?: React.FormEvent, urlOverride?: string) => {
    if (e) e.preventDefault();
    const target = (urlOverride || scanUrl).trim();
    if (!target || isScanning) return;

    setIsScanning(true);
    setResults(null);
    try {
      const data = await api.scanMiner(target);
      setResults(data);
      if (data.detectedTitle) {
        setCustomTitle(data.detectedTitle);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsScanning(false);
    }
  };

  const handleIngestStream = async (stream: any) => {
    try {
      const finalTitle = customTitle.trim() || results?.detectedTitle || `Mined: ${stream.type}`;
      const newAnime = await api.ingestContent({
        input: stream.url,
        title: finalTitle,
        category: selectedCategory,
        genres: ['Mined Stream', 'Universal Ingest', stream.streamType.toUpperCase()],
        studio: 'Animaxia Miner',
        coverImage: results?.detectedCover,
      });
      setIngestedUrls((prev) => ({ ...prev, [stream.url]: true }));
      onStreamIngested(newAnime);
    } catch (err) {
      console.error(err);
    }
  };

  const handleQuickPlayPreview = (stream: any) => {
    if (!onTestPlay) return;
    const tempAnime: Anime = {
      id: `preview-${Date.now()}`,
      title: customTitle.trim() || results?.detectedTitle || stream.type,
      romajiTitle: 'Preview Miner Stream',
      englishTitle: stream.type,
      description: `Stream scanat și testat prin Minerul Animaxia (${stream.streamType.toUpperCase()}).`,
      coverImage: results?.detectedCover || 'https://images.unsplash.com/photo-1578632767115-351597cf2477?w=600&auto=format&fit=crop&q=80',
      bannerImage: results?.detectedCover || 'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=1600&auto=format&fit=crop&q=80',
      genres: ['Mined Preview', stream.streamType.toUpperCase()],
      category: selectedCategory,
      streamType: stream.streamType,
      videoUrl: stream.url,
      rating: 9.0,
      totalRatings: 1,
      releaseYear: 2025,
      status: 'Finalizat',
      studio: 'Miner Test Player',
      ageRating: 'Toate vârstele',
      featured: false,
      totalEpisodes: 1,
      createdAt: new Date().toISOString(),
      episodes: [
        {
          id: `preview-ep1`,
          seasonNumber: 1,
          episodeNumber: 1,
          title: customTitle.trim() || stream.type,
          description: 'Previzualizare directă a stream-ului.',
          thumbnail: results?.detectedCover || 'https://images.unsplash.com/photo-1578632767115-351597cf2477?w=400&auto=format&fit=crop&q=80',
          duration: 'Direct Stream',
          durationSeconds: 1200,
          videoUrl: stream.url,
          streamType: stream.streamType,
        },
      ],
    };
    onTestPlay(tempAnime);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-950/85 backdrop-blur-md animate-in fade-in duration-150">
      <div className="w-full max-w-2xl bg-neutral-900 border border-neutral-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-6 border-b border-neutral-800 flex items-center justify-between bg-neutral-950/60 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-rose-500" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white tracking-tight">
                Minerul Animaxia & Sniffer Video
              </h2>
              <p className="text-xs text-neutral-400">
                Scanare automată după stream-uri MP4, HLS (.m3u8), DASH și player embed
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-neutral-800 text-neutral-400 hover:text-white flex items-center justify-center transition cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-5 overflow-y-auto">
          {/* Quick Preset Buttons */}
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-400 mb-2 block">
              Testare Rapidă (Stream-uri Verificate):
            </span>
            <div className="flex flex-wrap gap-2">
              {PRESET_STREAMS.map((preset) => (
                <button
                  key={preset.url}
                  onClick={() => {
                    setScanUrl(preset.url);
                    handleScan(undefined, preset.url);
                  }}
                  className="px-2.5 py-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-xs text-neutral-300 hover:text-white border border-neutral-700 transition cursor-pointer flex items-center gap-1.5"
                >
                  <span className="text-[10px] font-bold text-rose-400 bg-neutral-900 px-1 py-0.5 rounded">
                    {preset.format}
                  </span>
                  <span>{preset.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* URL Input Form */}
          <form onSubmit={handleScan} className="flex gap-2">
            <div className="relative flex-1">
              <Globe className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-500 pointer-events-none" />
              <input
                type="text"
                placeholder="Lipește link .m3u8, video .mp4 sau pagină web cu player video..."
                value={scanUrl}
                onChange={(e) => setScanUrl(e.target.value)}
                className="w-full bg-neutral-950 text-xs sm:text-sm text-white placeholder-neutral-500 pl-10 pr-4 py-3 rounded-xl border border-neutral-800 focus:outline-none focus:border-rose-500 transition font-mono"
              />
            </div>
            <button
              type="submit"
              disabled={!scanUrl.trim() || isScanning}
              className="px-5 py-3 rounded-xl bg-rose-600 hover:bg-rose-500 disabled:opacity-50 text-xs font-bold uppercase tracking-wider text-white shadow-lg shadow-rose-600/30 transition cursor-pointer shrink-0"
            >
              {isScanning ? 'Scanare...' : 'Scanează'}
            </button>
          </form>

          {/* Title and Category Settings */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            <div>
              <label className="text-[11px] font-bold text-neutral-400 uppercase mb-1 block">
                Titlu Personalizat (Opțional)
              </label>
              <input
                type="text"
                placeholder="Ex: Titlu Video Extras..."
                value={customTitle}
                onChange={(e) => setCustomTitle(e.target.value)}
                className="w-full bg-neutral-950 text-xs text-white placeholder-neutral-600 px-3 py-2 rounded-xl border border-neutral-800 focus:outline-none focus:border-rose-500 transition"
              />
            </div>

            <div>
              <label className="text-[11px] font-bold text-neutral-400 uppercase mb-1 block">
                Categorie Salvare
              </label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value as ContentCategory)}
                className="w-full bg-neutral-950 text-xs text-white px-3 py-2 rounded-xl border border-neutral-800 focus:outline-none focus:border-rose-500 transition"
              >
                <option value="mined">Minat (Universal Stream)</option>
                <option value="anime">Anime</option>
                <option value="movie">Film</option>
                <option value="series">Serial</option>
                <option value="sport">Sport</option>
              </select>
            </div>
          </div>

          {/* Results List */}
          {results && (
            <div className="space-y-3 pt-2">
              <div className="flex items-center justify-between text-xs text-neutral-400">
                <span>
                  Stream-uri identificate:{' '}
                  <strong className="text-white">{results.streamsFound}</strong>
                </span>
                <span className="font-mono text-[11px] text-emerald-400 flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  Verificare finalizată
                </span>
              </div>

              <div className="space-y-2">
                {results.streams.map((stream: any, idx: number) => {
                  const isIngested = ingestedUrls[stream.url];

                  return (
                    <div
                      key={idx}
                      className="p-3 bg-neutral-950/70 rounded-xl border border-neutral-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                    >
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-rose-400 text-[10px] bg-rose-500/10 px-2 py-0.5 rounded border border-rose-500/20">
                            {stream.streamType.toUpperCase()}
                          </span>
                          <span className="font-semibold text-white truncate">
                            {stream.type}
                          </span>
                          {stream.status && (
                            <span className="text-[10px] text-emerald-400 bg-emerald-950/60 px-1.5 py-0.2 rounded border border-emerald-800/80 font-mono">
                              {stream.status.toUpperCase()}
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] font-mono text-neutral-500 truncate mt-1">
                          {stream.url}
                        </p>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        {onTestPlay && (
                          <button
                            onClick={() => handleQuickPlayPreview(stream)}
                            className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-200 text-xs font-semibold transition cursor-pointer"
                            title="Testează stream-ul direct în player"
                          >
                            <Play className="w-3 h-3 fill-white" />
                            <span>Testează</span>
                          </button>
                        )}

                        <button
                          onClick={() => handleIngestStream(stream)}
                          disabled={isIngested}
                          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer ${
                            isIngested
                              ? 'bg-neutral-800 text-emerald-400 border border-emerald-500/30'
                              : 'bg-rose-600 hover:bg-rose-500 text-white shadow-md shadow-rose-600/30'
                          }`}
                        >
                          {isIngested ? <Check className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5" />}
                          <span>{isIngested ? 'Adăugat' : 'Adaugă'}</span>
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
