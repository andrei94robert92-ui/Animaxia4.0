import React, { useState, useEffect } from 'react';
import { Users, MessageSquare, Star, Eye, Send, Sparkles, Film, Heart } from 'lucide-react';
import { SocialActivityItem, UserProfile, Anime } from '../types/anime';
import { api } from '../services/api';

interface SocialHubSectionProps {
  currentUser: UserProfile;
  animes: Anime[];
  onOpenAnime: (animeId: string) => void;
}

export const SocialHubSection: React.FC<SocialHubSectionProps> = ({
  currentUser,
  animes,
  onOpenAnime,
}) => {
  const [feed, setFeed] = useState<SocialActivityItem[]>([]);
  const [quickThought, setQuickThought] = useState('');
  const [selectedAnimeId, setSelectedAnimeId] = useState<string>(animes[0]?.id || 'frieren-journey');
  const [givenScore, setGivenScore] = useState<number>(10);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    loadFeed();
    const interval = setInterval(loadFeed, 6000);
    return () => clearInterval(interval);
  }, []);

  const loadFeed = async () => {
    try {
      const data = await api.getSocialFeed();
      setFeed(data);
    } catch (err) {
      console.error(err);
    }
  };

  const handlePostThought = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!quickThought.trim() || isSubmitting) return;

    setIsSubmitting(true);
    try {
      const targetAnime = animes.find((a) => a.id === selectedAnimeId) || animes[0];
      if (targetAnime) {
        // Also rate if user set a score
        if (givenScore) {
          await api.rateAnime(targetAnime.id, givenScore, currentUser.id).catch(() => {});
        }
        await api.addComment(targetAnime.id, {
          userId: currentUser.id,
          userName: currentUser.name,
          userAvatar: currentUser.avatar,
          content: quickThought.trim(),
        });
      }
      setQuickThought('');
      loadFeed();
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="social-hub" className="mb-12 bg-neutral-900/60 border border-neutral-800 rounded-3xl p-6 sm:p-8 scroll-mt-24">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2">
            <Users className="w-5 h-5 text-rose-500" />
            <h3 className="text-xl font-bold text-white tracking-tight">
              Activitatea Comunității & Feed Live
            </h3>
          </div>
          <p className="text-xs text-neutral-400 mt-0.5">
            Interacțiuni în timp real — comentarii, note și vizionări ale membrilor comunității Animaxia
          </p>
        </div>

        <span className="text-[11px] font-mono text-emerald-400 bg-emerald-400/10 px-2.5 py-1 rounded-full border border-emerald-400/20 flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
          Feed Live Sincronizat
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Activity Feed */}
        <div className="lg:col-span-2 space-y-3">
          {feed.length === 0 ? (
            <div className="py-8 text-center text-xs text-neutral-500 bg-neutral-950/60 rounded-2xl border border-neutral-800">
              Încă nu există activități recente. Fii primul care postează o impresie sau vizionează un episod!
            </div>
          ) : (
            feed.slice(0, 6).map((act) => (
              <div
                key={act.id}
                className="p-3.5 bg-neutral-950/60 hover:bg-neutral-950/90 rounded-2xl border border-neutral-800/80 transition flex items-center justify-between gap-3 text-xs"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <img
                    src={act.userAvatar}
                    alt={act.userName}
                    className="w-9 h-9 rounded-full object-cover shrink-0 border border-neutral-800 shadow"
                  />
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="font-bold text-white">{act.userName}</span>
                      <span className="text-neutral-500 text-[11px]">
                        {act.type === 'watch'
                          ? 'a vizionat'
                          : act.type === 'comment'
                          ? 'a comentat la'
                          : act.type === 'rate'
                          ? 'a acordat nota'
                          : 'a adăugat'}
                      </span>
                      <button
                        onClick={() => onOpenAnime(act.animeId)}
                        className="font-semibold text-rose-400 hover:text-rose-300 hover:underline cursor-pointer truncate max-w-xs"
                      >
                        {act.animeTitle}
                      </button>

                      {act.score && (
                        <span className="flex items-center gap-0.5 text-[10px] font-bold text-amber-300 bg-amber-400/10 px-1.5 py-0.2 rounded border border-amber-400/20">
                          <Star className="w-2.5 h-2.5 fill-amber-300" />
                          {act.score}/10
                        </span>
                      )}
                    </div>

                    {act.text && (
                      <p className="text-neutral-300 mt-1 text-[11px] italic bg-neutral-900/60 px-2.5 py-1 rounded-lg border border-neutral-800/50">
                        „{act.text}”
                      </p>
                    )}
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <span className="text-[10px] text-neutral-500 font-mono block">
                    {new Date(act.createdAt).toLocaleTimeString('ro-RO', { hour: '2-digit', minute: '2-digit' })}
                  </span>
                  <button
                    onClick={() => onOpenAnime(act.animeId)}
                    className="text-[10px] text-rose-400 hover:text-white mt-1 font-semibold cursor-pointer"
                  >
                    Vezi titlu →
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Quick Post Box */}
        <div className="bg-neutral-950/70 p-5 rounded-2xl border border-neutral-800 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <MessageSquare className="w-4 h-4 text-rose-400" />
              <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-200">
                Postează o Recenzie Live
              </h4>
            </div>
            <p className="text-[11px] text-neutral-400 mb-4">
              Împărtășește opinia ta cu comunitatea Animaxia
            </p>

            <form onSubmit={handlePostThought} className="space-y-3">
              {/* Anime Selection */}
              <div>
                <label className="text-[10px] font-bold uppercase text-neutral-500 block mb-1">
                  Alege Anime-ul:
                </label>
                <select
                  value={selectedAnimeId}
                  onChange={(e) => setSelectedAnimeId(e.target.value)}
                  className="w-full bg-neutral-900 text-xs text-white p-2 rounded-xl border border-neutral-800 focus:outline-none focus:border-rose-500"
                >
                  {animes.map((a) => (
                    <option key={a.id} value={a.id}>
                      {a.title} ({a.releaseYear})
                    </option>
                  ))}
                </select>
              </div>

              {/* Rating Star selector */}
              <div>
                <label className="text-[10px] font-bold uppercase text-neutral-500 block mb-1">
                  Notă acordată: {givenScore}/10
                </label>
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((star) => (
                    <button
                      type="button"
                      key={star}
                      onClick={() => setGivenScore(star)}
                      className="p-0.5 hover:scale-125 transition-transform cursor-pointer"
                    >
                      <Star
                        className={`w-3.5 h-3.5 ${
                          star <= givenScore ? 'fill-amber-400 text-amber-400' : 'text-neutral-700'
                        }`}
                      />
                    </button>
                  ))}
                </div>
              </div>

              {/* Thought Input */}
              <div>
                <textarea
                  rows={3}
                  placeholder="Scrie părerea ta despre animație, coloana sonoră, momente cheie..."
                  value={quickThought}
                  onChange={(e) => setQuickThought(e.target.value)}
                  className="w-full bg-neutral-900 text-xs text-white p-2.5 rounded-xl border border-neutral-800 focus:outline-none focus:border-rose-500 resize-none"
                />
              </div>

              <button
                type="submit"
                disabled={!quickThought.trim() || isSubmitting}
                className="w-full flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 disabled:opacity-40 text-xs font-bold text-white transition cursor-pointer shadow-lg shadow-rose-600/25"
              >
                <Send className="w-3.5 h-3.5" />
                <span>{isSubmitting ? 'Se publică...' : 'Publică pe Hub'}</span>
              </button>
            </form>
          </div>

          <div className="pt-4 mt-3 border-t border-neutral-800 text-[10px] text-neutral-500 flex items-center justify-between">
            <span>Conectat ca <strong className="text-neutral-300">{currentUser.name}</strong></span>
            <span className="text-[10px] font-mono text-rose-400 uppercase">{currentUser.role}</span>
          </div>
        </div>
      </div>
    </section>
  );
};
