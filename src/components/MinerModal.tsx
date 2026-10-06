import React, { useState } from 'react';
import { Sparkles, X, Search, Check, Play, Plus, AlertCircle, Globe } from 'lucide-react';
import { api } from '../services/api';
import { Anime } from '../types/anime';

interface MinerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onStreamIngested: (anime: Anime) => void;
}

export const MinerModal: React.FC<MinerModalProps> = ({
  isOpen,
  onClose,
  onStreamIngested,
}) => {
  const [scanUrl, setScanUrl] = useState('');
  const [isScanning, setIsScanning] = useState(false);
  const [results, setResults] = useState<any | null>(null);
  const [ingestedUrls, setIngestedUrls] = useState<Record<string, boolean>>({});

  if (!isOpen) return null;

  const handleScan = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!scanUrl.trim() || isScanning) return;
    setIsScanning(true);
    setResults(null);
    try {
      const data = await api.scanMiner(scanUrl.trim());
      setResults(data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsScanning(false);
    }
  };

  const handleIngestStream = async (stream: any) => {
    try {
      const newAnime = await api.ingestContent({
        input: stream.url,
        title: `Mined: ${stream.type}`,
        category: 'mined',
        genres: ['Mined Stream', 'Universal Ingest'],
        studio: 'Animaxia Miner',
      });
      setIngestedUrls((prev) => ({ ...prev, [stream.url]: true }));
      onStreamIngested(newAnime);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-950/85 backdrop-blur-md animate-in fade-in duration-150">
      <div className="w-full max-w-2xl bg-neutral-900 border border-neutral-800 rounded-3xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="p-6 border-b border-neutral-800 flex items-center justify-between bg-neutral-950/60">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-rose-500" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white tracking-tight">
                Minerul Animaxia
              </h2>
              <p className="text-xs text-neutral-400">
                Scaner de stream-uri MP4, HLS (.m3u8), DASH și embed-uri video
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

        {/* Content */}
        <div className="p-6 space-y-5">
          <p className="text-xs text-neutral-300 leading-relaxed">
            Lipește un link către orice pagină video sau stream direct, iar Minerul Animaxia îl va scana după stream-uri <strong className="text-white">MP4</strong>, playlist-uri <strong className="text-white">HLS</strong>, iframe-uri și embed-uri <strong className="text-white">YouTube / Vimeo</strong> — apoi va salva titluri redabile direct în biblioteca ta.
          </p>

          <form onSubmit={handleScan} className="flex gap-2">
            <div className="relative flex-1">
              <Globe className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-500 pointer-events-none" />
              <input
                type="text"
                placeholder="https://exemplu.com/video sau https://stream.m3u8..."
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

          {/* Results List */}
          {results && (
            <div className="space-y-3 pt-2">
              <div className="flex items-center justify-between text-xs text-neutral-400">
                <span>Stream-uri detectate: <strong className="text-white">{results.streamsFound}</strong></span>
                <span className="font-mono text-[11px] text-emerald-400">Scanare completă</span>
              </div>

              <div className="space-y-2 max-h-60 overflow-y-auto">
                {results.streams.map((stream: any, idx: number) => {
                  const isIngested = ingestedUrls[stream.url];

                  return (
                    <div
                      key={idx}
                      className="p-3 bg-neutral-950/70 rounded-xl border border-neutral-800 flex items-center justify-between gap-3 text-xs"
                    >
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-rose-400 text-[10px] bg-rose-500/10 px-2 py-0.5 rounded border border-rose-500/20">
                            {stream.streamType.toUpperCase()}
                          </span>
                          <span className="font-semibold text-white truncate">{stream.type}</span>
                        </div>
                        <p className="text-[11px] font-mono text-neutral-500 truncate mt-1">
                          {stream.url}
                        </p>
                      </div>

                      <button
                        onClick={() => handleIngestStream(stream)}
                        disabled={isIngested}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer shrink-0 ${
                          isIngested
                            ? 'bg-neutral-800 text-emerald-400 border border-emerald-500/30'
                            : 'bg-rose-600 hover:bg-rose-500 text-white'
                        }`}
                      >
                        {isIngested ? <Check className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5" />}
                        <span>{isIngested ? 'Salvat' : 'Salvează'}</span>
                      </button>
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
