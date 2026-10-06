import React, { useState } from 'react';
import {
  Link, Check, AlertCircle, Plus, Sparkles, Globe,
  ShieldCheck, Film, Video, Play, RefreshCw
} from 'lucide-react';
import { api } from '../services/api';
import { Anime } from '../types/anime';

interface UniversalAddContentProps {
  onContentAdded: (anime: Anime) => void;
  onOpenMiner: () => void;
}

export const UniversalAddContent: React.FC<UniversalAddContentProps> = ({
  onContentAdded,
  onOpenMiner,
}) => {
  const [inputUrl, setInputUrl] = useState('');
  const [isChecking, setIsChecking] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [checkResult, setCheckResult] = useState<{
    isDuplicate: boolean;
    streamType: string;
    inferredTitle: string;
    inferredCategory: string;
    existingMatch?: Anime;
  } | null>(null);
  const [customTitle, setCustomTitle] = useState('');
  const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null);

  const handleCheckDuplicate = async () => {
    if (!inputUrl.trim()) return;
    setIsChecking(true);
    setFeedbackMessage(null);
    try {
      const res = await api.detectStream(inputUrl.trim());
      setCheckResult(res);
      setCustomTitle(res.inferredTitle);
      if (res.isDuplicate) {
        setFeedbackMessage(`Titlul sau linkul există deja în bibliotecă: "${res.existingMatch?.title}"`);
      } else {
        setFeedbackMessage(`Detectat format: ${res.streamType.toUpperCase()} · Fără duplicate.`);
      }
    } catch (err: any) {
      setFeedbackMessage('Eroare la verificarea link-ului.');
    } finally {
      setIsChecking(false);
    }
  };

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputUrl.trim() || isAdding) return;

    setIsAdding(true);
    setFeedbackMessage(null);
    try {
      const newAnime = await api.ingestContent({
        input: inputUrl.trim(),
        title: customTitle.trim() || undefined,
        category: checkResult?.inferredCategory || 'movie',
      });
      onContentAdded(newAnime);
      setFeedbackMessage(`"${newAnime.title}" a fost adăugat cu succes în bibliotecă!`);
      setInputUrl('');
      setCheckResult(null);
      setCustomTitle('');
    } catch (err: any) {
      setFeedbackMessage(err.message || 'Eroare la adăugarea conținutului.');
    } finally {
      setIsAdding(false);
    }
  };

  return (
    <section className="mb-12 relative overflow-hidden rounded-3xl bg-gradient-to-b from-neutral-900/90 to-neutral-950 border border-neutral-800 p-6 sm:p-8 shadow-2xl">
      {/* Glow highlight */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-rose-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 max-w-4xl">
        {/* Section Header */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-rose-400 bg-rose-500/10 px-2.5 py-1 rounded-md border border-rose-500/20">
              Platformă alimentată de tine
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight mt-2">
              Încarcă orice conținut. Arhitectură pregătită pentru până la 10.000.000 de titluri.
            </h2>
          </div>
          <button
            onClick={onOpenMiner}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-xs font-semibold text-rose-300 border border-neutral-700 transition cursor-pointer"
          >
            <Sparkles className="w-4 h-4 text-rose-400" />
            <span>Deschide Minerul Video</span>
          </button>
        </div>

        <p className="text-xs sm:text-sm text-neutral-400 leading-relaxed mb-6">
          Adaugă tu conținutul prin link direct (<span className="text-neutral-200 font-mono">MP4 / HLS / DASH</span>), iframe, cod embed sau JavaScript din{' '}
          <strong className="text-neutral-300">YouTube, OK.ru, Vimeo, TikTok, Dailymotion, Rumble, Twitch</strong> sau orice altă sursă — inclusiv surse necunoscute. Playerul universal îl redă, motorul de căutare îl indexează instant, fără să pice nimic.
        </p>

        {/* Badge Strip */}
        <div className="flex flex-wrap items-center gap-4 text-xs text-neutral-400 mb-6">
          <span className="flex items-center gap-1.5 text-neutral-300 font-semibold">
            <Globe className="w-4 h-4 text-emerald-400" />
            196 țări
          </span>
          <span>·</span>
          <span className="flex items-center gap-1.5 text-neutral-300 font-semibold">
            <ShieldCheck className="w-4 h-4 text-rose-400" />
            100% End-to-End
          </span>
          <span>·</span>
          <span className="flex items-center gap-1.5 text-neutral-300 font-semibold">
            <Sparkles className="w-4 h-4 text-amber-400" />
            AI clasificare automată
          </span>
        </div>

        {/* Ingestion Input Form */}
        <form onSubmit={handleAdd} className="space-y-3">
          <div className="flex flex-col sm:flex-row gap-2">
            <div className="relative flex-1">
              <Link className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-500 pointer-events-none" />
              <input
                type="text"
                placeholder="Lipește un link: MP4 / HLS / DASH, iframe, embed sau YouTube…"
                value={inputUrl}
                onChange={(e) => {
                  setInputUrl(e.target.value);
                  setCheckResult(null);
                  setFeedbackMessage(null);
                }}
                className="w-full bg-neutral-950 text-xs sm:text-sm text-white placeholder-neutral-500 pl-10 pr-4 py-3 rounded-xl border border-neutral-800 focus:outline-none focus:border-rose-500 transition font-mono"
              />
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleCheckDuplicate}
                disabled={!inputUrl.trim() || isChecking}
                className="px-4 py-3 rounded-xl bg-neutral-800 hover:bg-neutral-700 disabled:opacity-50 text-xs font-semibold text-neutral-200 border border-neutral-700 transition cursor-pointer shrink-0"
              >
                {isChecking ? 'Verific...' : 'Verifică duplicat'}
              </button>

              <button
                type="submit"
                disabled={!inputUrl.trim() || isAdding}
                className="flex items-center gap-1.5 px-6 py-3 rounded-xl bg-rose-600 hover:bg-rose-500 disabled:opacity-50 text-xs font-bold uppercase tracking-wider text-white shadow-lg shadow-rose-600/30 transition cursor-pointer shrink-0"
              >
                <Plus className="w-4 h-4" />
                <span>{isAdding ? 'Se adaugă...' : 'Adaugă'}</span>
              </button>
            </div>
          </div>

          {/* Title Override & Duplicate Details if verified */}
          {checkResult && (
            <div className="p-3 bg-neutral-950/70 rounded-xl border border-neutral-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-rose-400 uppercase tracking-wider text-[10px] bg-rose-500/10 px-2 py-0.5 rounded border border-rose-500/20">
                    Format: {checkResult.streamType.toUpperCase()}
                  </span>
                  <span className="text-neutral-400">
                    Categorie sugerată: <strong className="text-white capitalize">{checkResult.inferredCategory}</strong>
                  </span>
                </div>
                <div className="flex items-center gap-2 pt-1">
                  <span className="text-neutral-400 text-[11px]">Titlu detectat:</span>
                  <input
                    type="text"
                    value={customTitle}
                    onChange={(e) => setCustomTitle(e.target.value)}
                    placeholder="Nume titlu..."
                    className="bg-neutral-900 text-xs text-white px-2 py-1 rounded border border-neutral-800 focus:outline-none focus:border-rose-500"
                  />
                </div>
              </div>

              {checkResult.isDuplicate ? (
                <span className="flex items-center gap-1 text-amber-400 font-bold text-[11px] bg-amber-400/10 px-2.5 py-1 rounded border border-amber-400/20 shrink-0">
                  <AlertCircle className="w-3.5 h-3.5" />
                  Duplicat existent
                </span>
              ) : (
                <span className="flex items-center gap-1 text-emerald-400 font-bold text-[11px] bg-emerald-400/10 px-2.5 py-1 rounded border border-emerald-400/20 shrink-0">
                  <Check className="w-3.5 h-3.5" />
                  Gata de salvare
                </span>
              )}
            </div>
          )}

          {/* Feedback message */}
          {feedbackMessage && (
            <p className="text-xs text-rose-300 font-medium pt-1">
              {feedbackMessage}
            </p>
          )}
        </form>
      </div>
    </section>
  );
};
