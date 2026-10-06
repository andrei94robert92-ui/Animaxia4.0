import React, { useState, useEffect } from 'react';
import { Users, MessageSquare, Star, Eye, Send, Sparkles } from 'lucide-react';
import { SocialActivityItem, UserProfile } from '../types/anime';
import { api } from '../services/api';

interface SocialHubSectionProps {
  currentUser: UserProfile;
  onOpenAnime: (animeId: string) => void;
}

export const SocialHubSection: React.FC<SocialHubSectionProps> = ({
  currentUser,
  onOpenAnime,
}) => {
  const [feed, setFeed] = useState<SocialActivityItem[]>([]);
  const [quickThought, setQuickThought] = useState('');

  useEffect(() => {
    loadFeed();
    const interval = setInterval(loadFeed, 8000);
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
    if (!quickThought.trim()) return;

    try {
      await api.addComment('animaxia-hls-demo', {
        userId: currentUser.id,
        userName: currentUser.name,
        userAvatar: currentUser.avatar,
        content: quickThought.trim(),
      });
      setQuickThought('');
      loadFeed();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <section className="mb-12 bg-neutral-900/60 border border-neutral-800 rounded-3xl p-6 sm:p-8">
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2">
            <Users className="w-5 h-5 text-rose-500" />
            <h3 className="text-xl font-bold text-white tracking-tight">
              Activitatea comunității
            </h3>
          </div>
          <p className="text-xs text-neutral-400 mt-0.5">
            Live — comentarii, recenzii și watch parties
          </p>
        </div>

        <span className="text-[11px] font-mono text-emerald-400 bg-emerald-400/10 px-2.5 py-1 rounded-full border border-emerald-400/20">
          ● Hub social activ
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Activity Feed */}
        <div className="lg:col-span-2 space-y-3">
          {feed.length === 0 ? (
            <div className="py-8 text-center text-xs text-neutral-500 bg-neutral-950/60 rounded-2xl border border-neutral-800">
              Încă nimic — comentează sau vizionează ceva pentru a porni fluxul social. Orice acțiune apare aici în timp real!
            </div>
          ) : (
            feed.slice(0, 5).map((act) => (
              <div
                key={act.id}
                className="p-3 bg-neutral-950/60 rounded-2xl border border-neutral-800/80 flex items-center justify-between gap-3 text-xs"
              >
                <div className="flex items-center gap-3">
                  <img
                    src={act.userAvatar}
                    alt={act.userName}
                    className="w-8 h-8 rounded-full object-cover shrink-0"
                  />
                  <div>
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="font-bold text-white">{act.userName}</span>
                      <span className="text-neutral-500">
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
                        className="font-semibold text-rose-400 hover:underline cursor-pointer"
                      >
                        {act.animeTitle}
                      </button>
                    </div>

                    {act.text && (
                      <p className="text-neutral-300 mt-0.5 text-[11px] italic">
                        "{act.text}"
                      </p>
                    )}
                  </div>
                </div>

                <span className="text-[10px] text-neutral-500 font-mono shrink-0">
                  {new Date(act.createdAt).toLocaleTimeString('ro-RO', { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            ))
          )}
        </div>

        {/* Quick Post Box */}
        <div className="bg-neutral-950/70 p-4 rounded-2xl border border-neutral-800 flex flex-col justify-between">
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-300 mb-1">
              Transmite o impresie
            </h4>
            <p className="text-[11px] text-neutral-400 mb-3">
              Spune comunității ce urmărești chiar acum
            </p>
            <form onSubmit={handlePostThought} className="space-y-2">
              <textarea
                rows={3}
                placeholder="ex. Recomand cu drag Sintel sau noul episod HLS..."
                value={quickThought}
                onChange={(e) => setQuickThought(e.target.value)}
                className="w-full bg-neutral-900 text-xs text-white p-2.5 rounded-xl border border-neutral-800 focus:outline-none focus:border-rose-500 resize-none"
              />
              <button
                type="submit"
                disabled={!quickThought.trim()}
                className="w-full flex items-center justify-center gap-1.5 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 disabled:opacity-40 text-xs font-bold text-white transition cursor-pointer"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Trimite pe Hub</span>
              </button>
            </form>
          </div>
          <div className="pt-3 border-t border-neutral-800 text-[10px] text-neutral-500">
            Conectat local ca <strong className="text-neutral-400">{currentUser.name}</strong>
          </div>
        </div>
      </div>
    </section>
  );
};
