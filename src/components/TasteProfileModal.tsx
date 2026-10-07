import React, { useState, useEffect } from 'react';
import {
  X, Sparkles, Heart, Bell, Check, Play, Star, Plus,
  Bookmark, Trash2, CheckCircle2, Clock
} from 'lucide-react';
import { Anime } from '../types/anime';

interface TasteProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  animes: Anime[];
  initialTab?: 'taste' | 'for_you' | 'reminders';
  onPlayAnime: (anime: Anime) => void;
}

const ALL_GENRES = [
  'Acțiune', 'Fantezie', 'Supranatural', 'Cyberpunk',
  'Dramă', 'Aventură', 'Comedie', 'Muzică', 'Sci-Fi', 'Shounen'
];

interface ReminderItem {
  id: string;
  animeTitle: string;
  note: string;
  day: string;
}

export const TasteProfileModal: React.FC<TasteProfileModalProps> = ({
  isOpen,
  onClose,
  animes,
  initialTab = 'taste',
  onPlayAnime,
}) => {
  const [activeTab, setActiveTab] = useState<'taste' | 'for_you' | 'reminders'>(initialTab);

  useEffect(() => {
    if (initialTab) {
      setActiveTab(initialTab);
    }
  }, [initialTab]);

  const [selectedGenres, setSelectedGenres] = useState<string[]>([
    'Acțiune', 'Fantezie', 'Cyberpunk'
  ]);

  const [minRating, setMinRating] = useState<number>(8.0);
  const [preferredStyle, setPreferredStyle] = useState('Cinematic HD Modern');

  // Reminders list
  const [reminders, setReminders] = useState<ReminderItem[]>([
    { id: 'rem-1', animeTitle: 'Attack on Titan', note: 'Reia de la minutul 14:20', day: 'Azi, 20:00' },
    { id: 'rem-2', animeTitle: 'Frieren: Beyond Journey\'s End', note: 'Episodul următor din sezon', day: 'Vineri, 19:30' },
    { id: 'rem-3', animeTitle: 'Cyberpunk: Edgerunners', note: 'Maraton cu prietenii', day: 'Sâmbătă, 21:00' },
  ]);

  const [newReminderAnime, setNewReminderAnime] = useState(animes[0]?.title || '');
  const [newReminderNote, setNewReminderNote] = useState('');

  if (!isOpen) return null;

  const toggleGenre = (genre: string) => {
    setSelectedGenres((prev) =>
      prev.includes(genre) ? prev.filter((g) => g !== genre) : [...prev, genre]
    );
  };

  // Recommended based on taste
  const recommendations = animes.filter((a) =>
    a.rating >= minRating &&
    (selectedGenres.length === 0 || a.genres.some((g) => selectedGenres.includes(g)))
  );

  const handleAddReminder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newReminderAnime) return;
    const item: ReminderItem = {
      id: `rem-${Date.now()}`,
      animeTitle: newReminderAnime,
      note: newReminderNote || 'Vizionare programată',
      day: 'În curând',
    };
    setReminders([...reminders, item]);
    setNewReminderNote('');
  };

  const handleRemoveReminder = (id: string) => {
    setReminders(reminders.filter((r) => r.id !== id));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-neutral-950/90 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-3xl bg-neutral-900 border border-neutral-800 rounded-3xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-5 bg-gradient-to-r from-rose-950 via-neutral-900 to-amber-950/70 border-b border-neutral-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-rose-600 to-pink-500 flex items-center justify-center shadow-lg shadow-rose-600/25">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-black text-white font-['Space_Grotesk'] tracking-wide">
                  PERSONALIZARE 2.0 &amp; PROFIL DE GUST
                </h2>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 border border-rose-500/30">
                  Preferințe Inteligente
                </span>
              </div>
              <p className="text-xs text-neutral-400">
                Configurează genurile favorite, recomandările dedicate și memento-urile de vizionare
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-neutral-800/80 hover:bg-neutral-700 text-neutral-400 hover:text-white flex items-center justify-center border border-neutral-700 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tabs Bar */}
        <div className="p-3 bg-neutral-950/80 border-b border-neutral-800 flex items-center gap-2">
          {[
            { id: 'taste', label: 'Profil de Gust', icon: Heart },
            { id: 'for_you', label: 'Pentru Tine (Feed Personalizat)', icon: Sparkles },
            { id: 'reminders', label: 'Memento-uri Episod', icon: Bell },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                  isActive
                    ? 'bg-rose-600 text-white shadow-md shadow-rose-600/30'
                    : 'bg-neutral-900 text-neutral-400 hover:text-white hover:bg-neutral-800 border border-neutral-800'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Content Body */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-6 flex-1 text-xs">
          {/* TAB 1: TASTE PROFILE */}
          {activeTab === 'taste' && (
            <div className="space-y-5">
              <div>
                <h3 className="text-sm font-bold text-white">Genurile Tale Favorite</h3>
                <p className="text-xs text-neutral-400 mt-0.5">
                  Alege genurile pe care le preferi cel mai mult pentru a personaliza fluxul
                </p>
              </div>

              <div className="flex flex-wrap gap-2">
                {ALL_GENRES.map((genre) => {
                  const isSelected = selectedGenres.includes(genre);
                  return (
                    <button
                      key={genre}
                      onClick={() => toggleGenre(genre)}
                      className={`px-3.5 py-2 rounded-xl font-semibold transition cursor-pointer flex items-center gap-1.5 ${
                        isSelected
                          ? 'bg-rose-600 text-white shadow-md shadow-rose-600/30 border border-rose-500'
                          : 'bg-neutral-950/70 text-neutral-400 hover:text-white hover:bg-neutral-800 border border-neutral-800'
                      }`}
                    >
                      {isSelected && <Check className="w-3.5 h-3.5 text-white" />}
                      <span>{genre}</span>
                    </button>
                  );
                })}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div className="p-4 bg-neutral-950/60 rounded-2xl border border-neutral-800 space-y-2">
                  <span className="font-bold text-white text-xs block">Stil Vizual &amp; Animație:</span>
                  {['Cinematic HD Modern', 'Clasic Nostalgic 90s', '3D CGI Avansat'].map((style) => (
                    <div
                      key={style}
                      onClick={() => setPreferredStyle(style)}
                      className={`p-2.5 rounded-xl border cursor-pointer transition text-xs flex items-center justify-between ${
                        preferredStyle === style
                          ? 'bg-rose-950/30 border-rose-500 text-white'
                          : 'bg-neutral-900 border-neutral-800 text-neutral-400 hover:text-white'
                      }`}
                    >
                      <span>{style}</span>
                      {preferredStyle === style && <Check className="w-3.5 h-3.5 text-rose-500" />}
                    </div>
                  ))}
                </div>

                <div className="p-4 bg-neutral-950/60 rounded-2xl border border-neutral-800 space-y-3">
                  <span className="font-bold text-white text-xs block">
                    Prag Minim de Rating: {minRating} ★
                  </span>
                  <input
                    type="range"
                    min="7.0"
                    max="9.5"
                    step="0.1"
                    value={minRating}
                    onChange={(e) => setMinRating(parseFloat(e.target.value))}
                    className="w-full accent-rose-600 cursor-pointer"
                  />
                  <p className="text-[11px] text-neutral-500">
                    Titlurile recomandate vor avea cel puțin nota {minRating}/10 în catalog.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: FOR YOU */}
          {activeTab === 'for_you' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-white">Recomandate Pentru Tine</h3>
                  <p className="text-xs text-neutral-400 mt-0.5">
                    Bazat pe genurile selectate: {selectedGenres.join(', ')} (Min. {minRating}★)
                  </p>
                </div>
                <span className="font-mono text-rose-400 font-bold">
                  {recommendations.length} potriviri
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {recommendations.slice(0, 6).map((anime) => (
                  <div
                    key={anime.id}
                    className="p-3 bg-neutral-950/70 hover:bg-neutral-850 rounded-2xl border border-neutral-800 flex items-center gap-3 transition group"
                  >
                    <img
                      src={anime.coverImage}
                      alt={anime.title}
                      className="w-16 aspect-[3/4] object-cover rounded-xl border border-neutral-800 shrink-0"
                    />
                    <div className="min-w-0 flex-1">
                      <span className="text-[10px] text-rose-400 font-semibold">{anime.studio}</span>
                      <h4 className="text-xs font-bold text-white truncate">{anime.title}</h4>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-[10px] text-amber-300 font-mono">★ {anime.rating.toFixed(1)}</span>
                        <span className="text-neutral-600">·</span>
                        <span className="text-[10px] text-neutral-400">{anime.releaseYear}</span>
                      </div>
                      <div className="flex items-center gap-1 mt-1.5 overflow-hidden">
                        {anime.genres.slice(0, 2).map((g) => (
                          <span key={g} className="text-[9px] px-1.5 py-0.2 rounded bg-neutral-900 text-neutral-400 border border-neutral-800">
                            {g}
                          </span>
                        ))}
                      </div>
                    </div>
                    <button
                      onClick={() => {
                        onPlayAnime(anime);
                        onClose();
                      }}
                      className="p-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white transition cursor-pointer shadow-md shadow-rose-600/30"
                      title="Redă acum"
                    >
                      <Play className="w-4 h-4 fill-white" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: REMINDERS */}
          {activeTab === 'reminders' && (
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-bold text-white">Memento-uri &amp; Alarme de Vizionare</h3>
                <p className="text-xs text-neutral-400 mt-0.5">
                  Programează alerte pentru serialele și episoadele tale preferate
                </p>
              </div>

              {/* Add Reminder Form */}
              <form onSubmit={handleAddReminder} className="p-3.5 bg-neutral-950/70 rounded-2xl border border-neutral-800 flex flex-col sm:flex-row gap-2 items-center">
                <select
                  value={newReminderAnime}
                  onChange={(e) => setNewReminderAnime(e.target.value)}
                  className="w-full sm:w-auto flex-1 bg-neutral-900 border border-neutral-800 text-xs text-white rounded-xl px-3 py-2 focus:outline-none"
                >
                  {animes.map((a) => (
                    <option key={a.id} value={a.title}>
                      {a.title}
                    </option>
                  ))}
                </select>

                <input
                  type="text"
                  placeholder="Notă (ex: Reia de la ep. 2)..."
                  value={newReminderNote}
                  onChange={(e) => setNewReminderNote(e.target.value)}
                  className="w-full sm:w-auto flex-1 bg-neutral-900 border border-neutral-800 text-xs text-white rounded-xl px-3 py-2 focus:outline-none"
                />

                <button
                  type="submit"
                  className="w-full sm:w-auto px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition cursor-pointer shrink-0 shadow-md shadow-rose-600/30"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Adaugă</span>
                </button>
              </form>

              {/* Reminders List */}
              <div className="space-y-2">
                {reminders.map((rem) => (
                  <div
                    key={rem.id}
                    className="p-3 bg-neutral-950/60 rounded-xl border border-neutral-800 flex items-center justify-between text-xs"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-rose-600/10 text-rose-400 flex items-center justify-center">
                        <Clock className="w-4 h-4" />
                      </div>
                      <div>
                        <h4 className="font-bold text-white">{rem.animeTitle}</h4>
                        <p className="text-[11px] text-neutral-400">{rem.note}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-mono text-amber-300 bg-amber-400/10 px-2 py-0.5 rounded border border-amber-400/20">
                        {rem.day}
                      </span>
                      <button
                        onClick={() => handleRemoveReminder(rem.id)}
                        className="p-1.5 rounded-lg text-neutral-500 hover:text-white hover:bg-neutral-800 transition"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
