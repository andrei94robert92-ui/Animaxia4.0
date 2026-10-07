import React, { useState, useEffect } from 'react';
import {
  X, Play, Star, Plus, Check, Heart, Calendar, Building,
  Clock, ShieldAlert, MessageSquare, ThumbsUp, Eye, EyeOff, Send
} from 'lucide-react';
import { Anime, Episode, CommentItem, UserProfile } from '../types/anime';
import { api } from '../services/api';

interface AnimeDetailModalProps {
  anime: Anime | null;
  onClose: () => void;
  onPlayEpisode: (anime: Anime, episodeIndex: number) => void;
  currentUser: UserProfile;
  isInWatchlist: boolean;
  watchlistStatus?: 'watching' | 'plan_to_watch' | 'completed' | 'on_hold' | 'dropped';
  onToggleWatchlist: (anime: Anime) => void;
  onUpdateWatchlistStatus?: (anime: Anime, status: 'watching' | 'plan_to_watch' | 'completed' | 'on_hold' | 'dropped') => void;
  onAnimeUpdated?: (updated: Anime) => void;
}

export const AnimeDetailModal: React.FC<AnimeDetailModalProps> = ({
  anime,
  onClose,
  onPlayEpisode,
  currentUser,
  isInWatchlist,
  watchlistStatus = 'plan_to_watch',
  onToggleWatchlist,
  onUpdateWatchlistStatus,
  onAnimeUpdated,
}) => {
  const [activeTab, setActiveTab] = useState<'episodes' | 'comments' | 'trailer'>('episodes');
  const [episodeSearch, setEpisodeSearch] = useState('');
  const [comments, setComments] = useState<CommentItem[]>([]);
  const [newCommentText, setNewCommentText] = useState('');
  const [isSpoilerComment, setIsSpoilerComment] = useState(false);
  const [userRating, setUserRating] = useState<number | null>(null);
  const [hoverRating, setHoverRating] = useState<number | null>(null);
  const [revealedSpoilers, setRevealedSpoilers] = useState<Record<string, boolean>>({});
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);

  useEffect(() => {
    if (!anime) return;
    loadComments();
    loadUserRating();
  }, [anime?.id]);

  const loadComments = async () => {
    if (!anime) return;
    try {
      const data = await api.getComments(anime.id);
      setComments(data);
    } catch (err) {
      console.error('Eroare la încărcarea comentariilor:', err);
    }
  };

  const loadUserRating = async () => {
    if (!anime) return;
    try {
      const rating = await api.getMyRating(anime.id, currentUser.id);
      setUserRating(rating);
    } catch (err) {
      console.error('Eroare la încărcarea notei:', err);
    }
  };

  const handleRate = async (score: number) => {
    if (!anime) return;
    try {
      const res = await api.rateAnime(anime.id, score, currentUser.id);
      setUserRating(score);
      if (onAnimeUpdated) {
        onAnimeUpdated({ ...anime, rating: res.newAverage, totalRatings: anime.totalRatings + 1 });
      }
    } catch (err) {
      console.error('Eroare la trimiterea notei:', err);
    }
  };

  const handleAddComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!anime || !newCommentText.trim() || isSubmittingComment) return;

    setIsSubmittingComment(true);
    try {
      const newComment = await api.addComment(anime.id, {
        userId: currentUser.id,
        userName: currentUser.name,
        userAvatar: currentUser.avatar,
        content: newCommentText.trim(),
        isSpoiler: isSpoilerComment,
      });
      setComments([newComment, ...comments]);
      setNewCommentText('');
      setIsSpoilerComment(false);
    } catch (err) {
      console.error('Eroare la adăugarea comentariului:', err);
    } finally {
      setIsSubmittingComment(false);
    }
  };

  const handleToggleLike = async (commentId: string) => {
    try {
      const updated = await api.toggleLikeComment(commentId, currentUser.id);
      setComments(comments.map((c) => (c.id === commentId ? updated : c)));
    } catch (err) {
      console.error('Eroare like comentariu:', err);
    }
  };

  const toggleSpoilerReveal = (commentId: string) => {
    setRevealedSpoilers((prev) => ({
      ...prev,
      [commentId]: !prev[commentId],
    }));
  };

  if (!anime) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto bg-neutral-950/85 backdrop-blur-md">
      <div className="relative w-full max-w-4xl bg-neutral-900 border border-neutral-800 rounded-3xl overflow-hidden shadow-2xl my-auto animate-in fade-in zoom-in-95 duration-200">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 w-10 h-10 rounded-full bg-neutral-950/80 hover:bg-neutral-800 text-neutral-400 hover:text-white flex items-center justify-center border border-neutral-700/80 transition cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header Banner */}
        <div className="relative h-64 sm:h-80 w-full overflow-hidden">
          <img
            src={anime.bannerImage || anime.coverImage}
            alt={anime.title}
            className="w-full h-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-neutral-900 via-neutral-900/60 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-neutral-900 via-transparent to-transparent" />

          {/* Floating poster and main header titles */}
          <div className="absolute bottom-4 left-6 right-6 flex items-end gap-5">
            <img
              src={anime.coverImage}
              alt={anime.title}
              className="w-24 sm:w-36 aspect-[3/4] object-cover rounded-xl border-2 border-neutral-800 shadow-2xl hidden xs:block"
            />
            <div className="flex-1 pb-1">
              <span className="text-xs font-semibold text-rose-400 font-['Space_Grotesk']">
                {anime.romajiTitle}
              </span>
              <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
                {anime.title}
              </h2>
              <p className="text-xs text-neutral-400 mt-0.5">{anime.englishTitle}</p>
            </div>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-6">
          {/* Metadata Row & Actions */}
          <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-neutral-800">
            {/* Quick stats unboxed */}
            <div className="flex flex-wrap items-center gap-3 text-xs text-neutral-400">
              <span className="flex items-center gap-1 font-bold text-amber-300 bg-amber-400/10 px-2.5 py-1 rounded-lg border border-amber-400/20">
                <Star className="w-3.5 h-3.5 fill-amber-300" />
                {anime.rating.toFixed(1)} / 10
              </span>
              <span>·</span>
              <span className="text-neutral-300 font-semibold">{anime.releaseYear}</span>
              <span>·</span>
              <span className="text-neutral-300 font-semibold">{anime.season}</span>
              <span>·</span>
              <span className="text-neutral-300 font-semibold">{anime.status}</span>
              <span>·</span>
              <span className="text-neutral-300 font-semibold">{anime.studio}</span>
              <span>·</span>
              <span className="border border-neutral-700 px-1.5 py-0.5 rounded font-mono text-neutral-400">
                {anime.ageRating}
              </span>
            </div>

            {/* Action buttons */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => onPlayEpisode(anime, 0)}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs uppercase tracking-wider shadow-lg shadow-rose-600/30 transition cursor-pointer"
              >
                <Play className="w-4 h-4 fill-white" />
                <span>Începe Ep. 1</span>
              </button>

              {isInWatchlist ? (
                <div className="flex items-center gap-1.5">
                  <select
                    value={watchlistStatus}
                    onChange={(e) =>
                      onUpdateWatchlistStatus &&
                      onUpdateWatchlistStatus(anime, e.target.value as any)
                    }
                    className="bg-neutral-800 text-rose-300 font-semibold text-xs border border-rose-500/40 rounded-xl px-3 py-2.5 focus:outline-none cursor-pointer"
                  >
                    <option value="watching">🍿 Vizionez acum</option>
                    <option value="plan_to_watch">📋 Planific să văd</option>
                    <option value="completed">✅ Finalizat</option>
                    <option value="on_hold">⏸️ În așteptare</option>
                    <option value="dropped">✕ Abandonat</option>
                  </select>

                  <button
                    onClick={() => onToggleWatchlist(anime)}
                    className="px-2.5 py-2.5 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-neutral-400 hover:text-white border border-neutral-700 text-xs transition cursor-pointer"
                    title="Elimină din listă"
                  >
                    ✕
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => onToggleWatchlist(anime)}
                  className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl font-semibold text-xs border border-neutral-700 bg-neutral-900 text-neutral-200 hover:bg-neutral-800 transition cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>Adaugă în Listă</span>
                </button>
              )}
            </div>
          </div>

          {/* Interactive User Rating Widget */}
          <div className="bg-neutral-950/60 p-3.5 rounded-2xl border border-neutral-800/80 flex items-center justify-between flex-wrap gap-3">
            <div>
              <span className="text-xs font-bold text-neutral-300">Notează acest anime:</span>
              <p className="text-[11px] text-neutral-500">
                {userRating ? `Ai acordat nota ${userRating}/10` : 'Apasă pe o stea pentru a vota'}
              </p>
            </div>
            <div className="flex items-center gap-1">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((star) => (
                <button
                  key={star}
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(null)}
                  onClick={() => handleRate(star)}
                  className="p-1 hover:scale-125 transition-transform cursor-pointer"
                  title={`Acordă nota ${star}`}
                >
                  <Star
                    className={`w-4 h-4 ${
                      (hoverRating !== null ? star <= hoverRating : userRating && star <= userRating)
                        ? 'fill-amber-400 text-amber-400'
                        : 'text-neutral-700'
                    }`}
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Synopsis */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-400 mb-1.5">
              Sinopsis
            </h4>
            <p className="text-sm text-neutral-300 leading-relaxed font-normal">
              {anime.description}
            </p>
          </div>

          {/* Tabs: Episoade vs Trailer vs Comentarii */}
          <div>
            <div className="flex items-center gap-2 border-b border-neutral-800 pb-2 overflow-x-auto scrollbar-none">
              <button
                onClick={() => setActiveTab('episodes')}
                className={`px-4 py-2 text-xs font-bold rounded-lg transition cursor-pointer whitespace-nowrap ${
                  activeTab === 'episodes'
                    ? 'bg-neutral-800 text-white shadow-sm'
                    : 'text-neutral-400 hover:text-white'
                }`}
              >
                Episoade ({anime.episodes.length})
              </button>
              <button
                onClick={() => setActiveTab('trailer')}
                className={`px-4 py-2 text-xs font-bold rounded-lg transition cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
                  activeTab === 'trailer'
                    ? 'bg-neutral-800 text-white shadow-sm'
                    : 'text-neutral-400 hover:text-white'
                }`}
              >
                <Play className="w-3.5 h-3.5 fill-rose-500 text-rose-500" />
                <span>Trailer &amp; Stream Preview</span>
              </button>
              <button
                onClick={() => setActiveTab('comments')}
                className={`px-4 py-2 text-xs font-bold rounded-lg transition cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
                  activeTab === 'comments'
                    ? 'bg-neutral-800 text-white shadow-sm'
                    : 'text-neutral-400 hover:text-white'
                }`}
              >
                <MessageSquare className="w-3.5 h-3.5" />
                <span>Discuții &amp; Comentarii ({comments.length})</span>
              </button>
            </div>

            {/* TAB: TRAILER & PREVIEW */}
            {activeTab === 'trailer' && (
              <div className="pt-4 space-y-3">
                <div className="relative aspect-video w-full rounded-2xl overflow-hidden bg-neutral-950 border border-neutral-800 shadow-2xl">
                  {anime.streamType === 'youtube' || (anime.videoUrl && (anime.videoUrl.includes('youtube.com') || anime.videoUrl.includes('youtu.be'))) ? (
                    <iframe
                      src={
                        anime.videoUrl?.includes('embed')
                          ? anime.videoUrl
                          : anime.videoUrl?.includes('watch?v=')
                          ? `https://www.youtube.com/embed/${anime.videoUrl.split('watch?v=')[1]?.split('&')[0]}?autoplay=1`
                          : anime.videoUrl?.includes('youtu.be/')
                          ? `https://www.youtube.com/embed/${anime.videoUrl.split('youtu.be/')[1]?.split('?')[0]}?autoplay=1`
                          : anime.videoUrl
                      }
                      title={`${anime.title} Trailer`}
                      className="w-full h-full border-0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  ) : anime.streamType === 'iframe' && anime.videoUrl ? (
                    <iframe
                      src={anime.videoUrl}
                      title={`${anime.title} Player`}
                      className="w-full h-full border-0"
                      allowFullScreen
                    />
                  ) : (
                    <video
                      src={anime.episodes[0]?.videoUrl || anime.videoUrl}
                      controls
                      autoPlay
                      className="w-full h-full object-cover"
                      poster={anime.bannerImage || anime.coverImage}
                    >
                      Browserul tău nu suportă redarea video HTML5.
                    </video>
                  )}
                </div>
                <div className="flex items-center justify-between p-3 bg-neutral-950/60 rounded-xl border border-neutral-800 text-xs">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-white">{anime.title}</span>
                    <span className="text-neutral-500">·</span>
                    <span className="text-neutral-400">Preview HD Stream ({anime.streamType?.toUpperCase() || 'HLS'})</span>
                  </div>
                  <button
                    onClick={() => onPlayEpisode(anime, 0)}
                    className="px-3.5 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs flex items-center gap-1.5 transition cursor-pointer"
                  >
                    <Play className="w-3.5 h-3.5 fill-white" />
                    <span>Lansează în Player Universal</span>
                  </button>
                </div>
              </div>
            )}

            {/* TAB: EPISODES */}
            {activeTab === 'episodes' && (
              <div className="pt-4 space-y-3">
                {anime.episodes.length > 3 && (
                  <div className="relative mb-2">
                    <input
                      type="text"
                      placeholder="Filtrează episoade după titlu sau număr..."
                      value={episodeSearch}
                      onChange={(e) => setEpisodeSearch(e.target.value)}
                      className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-rose-500"
                    />
                  </div>
                )}
                {anime.episodes.length === 0 ? (
                  <p className="text-xs text-neutral-500 py-6 text-center">
                    Nu există episoade adăugate încă. Poți adăuga din Studio Admin.
                  </p>
                ) : (
                  anime.episodes
                    .filter((ep) =>
                      !episodeSearch.trim() ||
                      ep.title.toLowerCase().includes(episodeSearch.toLowerCase()) ||
                      `ep ${ep.episodeNumber}`.includes(episodeSearch.toLowerCase())
                    )
                    .map((ep, idx) => (
                    <div
                      key={ep.id}
                      onClick={() => onPlayEpisode(anime, idx)}
                      className="group flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-3 bg-neutral-950/60 hover:bg-neutral-800/60 rounded-2xl border border-neutral-800/80 hover:border-neutral-700 transition cursor-pointer"
                    >
                      <div className="flex items-center gap-3 w-full sm:w-auto">
                        {/* Thumbnail */}
                        <div className="relative w-28 sm:w-36 aspect-video rounded-xl overflow-hidden bg-neutral-900 shrink-0">
                          <img
                            src={ep.thumbnail || anime.coverImage}
                            alt={ep.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                          />
                          <div className="absolute inset-0 bg-neutral-950/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                            <Play className="w-6 h-6 fill-white text-white" />
                          </div>
                          <span className="absolute bottom-1 right-1 bg-neutral-950/80 px-1.5 py-0.5 rounded text-[10px] font-mono text-neutral-300">
                            {ep.duration}
                          </span>
                        </div>

                        {/* Title & Desc */}
                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-bold text-rose-400">
                              Ep. {ep.episodeNumber}
                            </span>
                            <span className="text-xs font-semibold text-white truncate">
                              {ep.title}
                            </span>
                          </div>
                          <p className="text-xs text-neutral-400 line-clamp-2 mt-1">
                            {ep.description}
                          </p>
                          {ep.introEnd && ep.introEnd > 0 && (
                            <span className="inline-block mt-1 text-[10px] text-amber-400 bg-amber-400/10 px-2 py-0.5 rounded font-mono">
                              ⏭️ Skip intro: {Math.floor(ep.introStart || 0)}s - {Math.floor(ep.introEnd)}s
                            </span>
                          )}
                        </div>
                      </div>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onPlayEpisode(anime, idx);
                        }}
                        className="px-4 py-2 rounded-xl bg-neutral-800 hover:bg-rose-600 text-neutral-300 hover:text-white font-semibold text-xs transition shrink-0 hidden sm:block"
                      >
                        Redă
                      </button>
                    </div>
                  ))
                )}
              </div>
            )}

            {/* TAB: COMMENTS */}
            {activeTab === 'comments' && (
              <div className="pt-4 space-y-4">
                {/* Comment Input */}
                <form
                  onSubmit={handleAddComment}
                  className="bg-neutral-950/80 p-4 rounded-2xl border border-neutral-800 space-y-3"
                >
                  <div className="flex items-center gap-2">
                    <img
                      src={currentUser.avatar}
                      alt={currentUser.name}
                      className="w-7 h-7 rounded-full object-cover"
                    />
                    <span className="text-xs font-semibold text-neutral-300">
                      Comentează ca {currentUser.name}
                    </span>
                  </div>

                  <textarea
                    rows={2}
                    placeholder="Scrie părerea ta despre acest anime sau episod..."
                    value={newCommentText}
                    onChange={(e) => setNewCommentText(e.target.value)}
                    className="w-full bg-neutral-900 text-sm text-neutral-200 placeholder-neutral-500 p-3 rounded-xl border border-neutral-800 focus:outline-none focus:border-rose-500 transition resize-none"
                  />

                  <div className="flex items-center justify-between">
                    <label className="flex items-center gap-2 text-xs text-neutral-400 cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={isSpoilerComment}
                        onChange={(e) => setIsSpoilerComment(e.target.checked)}
                        className="rounded border-neutral-700 text-rose-600 focus:ring-rose-500"
                      />
                      <span>Marchează ca spoiler</span>
                    </label>

                    <button
                      type="submit"
                      disabled={!newCommentText.trim() || isSubmittingComment}
                      className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 disabled:opacity-50 text-white font-semibold text-xs transition cursor-pointer"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>Postează Comentariu</span>
                    </button>
                  </div>
                </form>

                {/* Comment List */}
                <div className="space-y-3">
                  {comments.length === 0 ? (
                    <p className="text-xs text-neutral-500 py-6 text-center">
                      Nu există comentarii încă. Fii primul care lasă o impresie!
                    </p>
                  ) : (
                    comments.map((comment) => {
                      const isSpoilerHidden = comment.isSpoiler && !revealedSpoilers[comment.id];

                      return (
                        <div
                          key={comment.id}
                          className="bg-neutral-950/60 p-3.5 rounded-2xl border border-neutral-800/80 space-y-2"
                        >
                          <div className="flex items-center justify-between text-xs">
                            <div className="flex items-center gap-2">
                              <img
                                src={comment.userAvatar}
                                alt={comment.userName}
                                className="w-6 h-6 rounded-full object-cover"
                              />
                              <span className="font-semibold text-neutral-200">
                                {comment.userName}
                              </span>
                              <span className="text-[10px] text-neutral-500">
                                {new Date(comment.createdAt).toLocaleDateString('ro-RO')}
                              </span>
                            </div>

                            {comment.isSpoiler && (
                              <span className="flex items-center gap-1 text-[10px] font-bold text-amber-400 bg-amber-400/10 px-2 py-0.5 rounded border border-amber-400/20">
                                <ShieldAlert className="w-3 h-3" />
                                SPOILER
                              </span>
                            )}
                          </div>

                          {/* Content or Spoiler Veil */}
                          {isSpoilerHidden ? (
                            <div
                              onClick={() => toggleSpoilerReveal(comment.id)}
                              className="p-3 bg-neutral-900 rounded-xl border border-dashed border-amber-500/30 text-center cursor-pointer hover:bg-neutral-850 transition"
                            >
                              <div className="flex items-center justify-center gap-1.5 text-xs text-amber-300 font-semibold">
                                <Eye className="w-3.5 h-3.5" />
                                <span>Apasă pentru a dezvălui spoilerul</span>
                              </div>
                            </div>
                          ) : (
                            <p className="text-xs text-neutral-300 leading-relaxed font-normal">
                              {comment.content}
                            </p>
                          )}

                          {/* Like button & footer */}
                          <div className="flex items-center justify-between pt-1">
                            <button
                              onClick={() => handleToggleLike(comment.id)}
                              className="flex items-center gap-1.5 text-xs text-neutral-400 hover:text-rose-400 transition cursor-pointer"
                            >
                              <ThumbsUp className="w-3.5 h-3.5" />
                              <span>{comment.likes}</span>
                            </button>

                            {comment.isSpoiler && !isSpoilerHidden && (
                              <button
                                onClick={() => toggleSpoilerReveal(comment.id)}
                                className="text-[10px] text-neutral-500 hover:text-neutral-400 flex items-center gap-1 cursor-pointer"
                              >
                                <EyeOff className="w-3 h-3" />
                                <span>Ascunde spoiler</span>
                              </button>
                            )}
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
