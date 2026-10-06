import React, { useState, useEffect } from 'react';
import {
  X, Database, Plus, Trash2, Download, Upload, RotateCcw,
  Film, Video, Server, HardDrive, CheckCircle2, AlertCircle, FileJson
} from 'lucide-react';
import { Anime, DatabaseStats } from '../types/anime';
import { api } from '../services/api';

interface AdminStudioModalProps {
  onClose: () => void;
  animes: Anime[];
  onCatalogChanged: () => void;
}

export const AdminStudioModal: React.FC<AdminStudioModalProps> = ({
  onClose,
  animes,
  onCatalogChanged,
}) => {
  const [stats, setStats] = useState<DatabaseStats | null>(null);
  const [activeTab, setActiveTab] = useState<'stats' | 'new_anime' | 'new_episode' | 'manage_catalog' | 'backup'>('stats');
  const [statusMessage, setStatusMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  // New Anime Form State
  const [newTitle, setNewTitle] = useState('');
  const [newRomaji, setNewRomaji] = useState('');
  const [newEnglish, setNewEnglish] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [newCover, setNewCover] = useState('');
  const [newBanner, setNewBanner] = useState('');
  const [newGenres, setNewGenres] = useState('Acțiune, Fantezie');
  const [newStudio, setNewStudio] = useState('MAPPA');
  const [newYear, setNewYear] = useState(2024);
  const [newSeason, setNewSeason] = useState<'Iarnă' | 'Primăvară' | 'Vară' | 'Toamnă'>('Iarnă');
  const [newStatus, setNewStatus] = useState<'În difuzare' | 'Finalizat' | 'În curând'>('În difuzare');
  const [newAge, setNewAge] = useState('16+');
  const [isFeatured, setIsFeatured] = useState(false);

  // New Episode Form State
  const [selectedAnimeId, setSelectedAnimeId] = useState<string>(animes[0]?.id || '');
  const [epNumber, setEpNumber] = useState(1);
  const [epTitle, setEpTitle] = useState('');
  const [epDescription, setEpDescription] = useState('');
  const [epVideoUrl, setEpVideoUrl] = useState('https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4');
  const [epThumbnail, setEpThumbnail] = useState('');
  const [epDuration, setEpDuration] = useState('24m');
  const [epIntroStart, setEpIntroStart] = useState(75);
  const [epIntroEnd, setEpIntroEnd] = useState(160);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const data = await api.getDbStats();
      setStats(data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleCreateAnime = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    try {
      const genresArray = newGenres.split(',').map((g) => g.trim()).filter(Boolean);
      await api.createAnime({
        title: newTitle.trim(),
        romajiTitle: newRomaji.trim() || newTitle.trim(),
        englishTitle: newEnglish.trim() || newTitle.trim(),
        description: newDescription.trim() || 'Fără descriere.',
        coverImage: newCover.trim() || 'https://images.unsplash.com/photo-1578632767115-351597cf2477?w=600&auto=format&fit=crop&q=80',
        bannerImage: newBanner.trim() || newCover.trim() || 'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=1600&auto=format&fit=crop&q=80',
        genres: genresArray.length ? genresArray : ['Acțiune'],
        studio: newStudio.trim() || 'Studio Animație',
        releaseYear: Number(newYear) || 2024,
        season: newSeason,
        status: newStatus,
        ageRating: newAge,
        featured: isFeatured,
        rating: 9.0,
        totalRatings: 1,
        episodes: [],
      });

      setStatusMessage({ text: `Anime-ul "${newTitle}" a fost salvat cu succes în baza de date locală!`, type: 'success' });
      setNewTitle('');
      setNewRomaji('');
      setNewEnglish('');
      setNewDescription('');
      setNewCover('');
      setNewBanner('');
      onCatalogChanged();
      loadStats();
    } catch (err: any) {
      setStatusMessage({ text: err.message || 'Eroare la adăugarea anime-ului.', type: 'error' });
    }
  };

  const handleCreateEpisode = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedAnimeId || !epTitle.trim()) return;

    try {
      await api.addEpisode(selectedAnimeId, {
        episodeNumber: Number(epNumber),
        seasonNumber: 1,
        title: epTitle.trim(),
        description: epDescription.trim() || 'Descrierea episodului...',
        videoUrl: epVideoUrl.trim(),
        thumbnail: epThumbnail.trim(),
        duration: epDuration.trim(),
        durationSeconds: 1440,
        introStart: Number(epIntroStart),
        introEnd: Number(epIntroEnd),
      });

      setStatusMessage({ text: `Episodul "${epTitle}" a fost adăugat cu succes!`, type: 'success' });
      setEpTitle('');
      setEpDescription('');
      setEpNumber((prev) => prev + 1);
      onCatalogChanged();
      loadStats();
    } catch (err: any) {
      setStatusMessage({ text: err.message || 'Eroare la adăugarea episodului.', type: 'error' });
    }
  };

  const handleDeleteAnime = async (animeId: string, title: string) => {
    if (!confirm(`Sigur dorești să ștergi anime-ul "${title}" din baza de date locală?`)) return;
    try {
      await api.deleteAnime(animeId);
      setStatusMessage({ text: `Anime-ul "${title}" a fost șters din baza de date.`, type: 'success' });
      onCatalogChanged();
      loadStats();
    } catch (err: any) {
      setStatusMessage({ text: err.message, type: 'error' });
    }
  };

  const handleResetDb = async () => {
    if (!confirm('Ești sigur că vrei să resetezi baza de date locală la colecția inițială cu toate anime-urile?')) return;
    try {
      await api.resetDb();
      setStatusMessage({ text: 'Baza de date locală a fost restaurată cu succes la starea inițială!', type: 'success' });
      onCatalogChanged();
      loadStats();
    } catch (err: any) {
      setStatusMessage({ text: err.message, type: 'error' });
    }
  };

  const handleImportJson = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (evt) => {
      try {
        const parsed = JSON.parse(evt.target?.result as string);
        await api.importDb(parsed);
        setStatusMessage({ text: 'Baza de date a fost importată cu succes din fișierul JSON!', type: 'success' });
        onCatalogChanged();
        loadStats();
      } catch (err: any) {
        setStatusMessage({ text: 'Fișier JSON corupt sau invalid.', type: 'error' });
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto bg-neutral-950/85 backdrop-blur-md">
      <div className="relative w-full max-w-4xl bg-neutral-900 border border-neutral-800 rounded-3xl overflow-hidden shadow-2xl my-auto animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="p-6 border-b border-neutral-800 flex items-center justify-between bg-neutral-950/60">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center">
              <Database className="w-5 h-5 text-rose-500" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-white tracking-tight">
                  Animaxia Studio
                </h2>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  100% LOCAL END-TO-END
                </span>
              </div>
              <p className="text-xs text-neutral-400">
                Administrare directă a catalogului, streaming-ului și persistenței locale JSON
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

        {/* Status Alert */}
        {statusMessage && (
          <div
            className={`px-6 py-2.5 flex items-center justify-between text-xs font-medium ${
              statusMessage.type === 'success'
                ? 'bg-emerald-500/10 text-emerald-300 border-b border-emerald-500/20'
                : 'bg-rose-500/10 text-rose-300 border-b border-rose-500/20'
            }`}
          >
            <div className="flex items-center gap-2">
              {statusMessage.type === 'success' ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              ) : (
                <AlertCircle className="w-4 h-4 text-rose-400" />
              )}
              <span>{statusMessage.text}</span>
            </div>
            <button onClick={() => setStatusMessage(null)} className="text-neutral-400 hover:text-white">
              ✕
            </button>
          </div>
        )}

        {/* Navigation Tabs */}
        <div className="px-6 border-b border-neutral-800 flex items-center gap-2 overflow-x-auto py-2 bg-neutral-950/40">
          <button
            onClick={() => setActiveTab('stats')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'stats' ? 'bg-neutral-800 text-white shadow-sm' : 'text-neutral-400 hover:text-white'
            }`}
          >
            <Server className="w-3.5 h-3.5" />
            Statistici Bază Date
          </button>
          <button
            onClick={() => setActiveTab('new_anime')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'new_anime' ? 'bg-neutral-800 text-white shadow-sm' : 'text-neutral-400 hover:text-white'
            }`}
          >
            <Film className="w-3.5 h-3.5" />
            Adaugă Anime
          </button>
          <button
            onClick={() => setActiveTab('new_episode')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'new_episode' ? 'bg-neutral-800 text-white shadow-sm' : 'text-neutral-400 hover:text-white'
            }`}
          >
            <Video className="w-3.5 h-3.5" />
            Adaugă Episod
          </button>
          <button
            onClick={() => setActiveTab('manage_catalog')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'manage_catalog' ? 'bg-neutral-800 text-white shadow-sm' : 'text-neutral-400 hover:text-white'
            }`}
          >
            <Database className="w-3.5 h-3.5" />
            Gestionează Catalog ({animes.length})
          </button>
          <button
            onClick={() => setActiveTab('backup')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'backup' ? 'bg-neutral-800 text-white shadow-sm' : 'text-neutral-400 hover:text-white'
            }`}
          >
            <HardDrive className="w-3.5 h-3.5" />
            Backup & Reset
          </button>
        </div>

        {/* Tab Content */}
        <div className="p-6 max-h-[60vh] overflow-y-auto">
          {/* TAB 1: STATS */}
          {activeTab === 'stats' && stats && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="p-4 rounded-2xl bg-neutral-950/60 border border-neutral-800">
                  <span className="text-[11px] text-neutral-400 font-semibold uppercase tracking-wider">
                    Total Anime-uri
                  </span>
                  <div className="text-2xl font-black text-white mt-1">{stats.totalAnimes}</div>
                  <span className="text-[10px] text-emerald-400">Stocate local</span>
                </div>

                <div className="p-4 rounded-2xl bg-neutral-950/60 border border-neutral-800">
                  <span className="text-[11px] text-neutral-400 font-semibold uppercase tracking-wider">
                    Episoade Streaming
                  </span>
                  <div className="text-2xl font-black text-white mt-1">{stats.totalEpisodes}</div>
                  <span className="text-[10px] text-rose-400">{stats.totalMinutes} min stream</span>
                </div>

                <div className="p-4 rounded-2xl bg-neutral-950/60 border border-neutral-800">
                  <span className="text-[11px] text-neutral-400 font-semibold uppercase tracking-wider">
                    Comentarii Locale
                  </span>
                  <div className="text-2xl font-black text-white mt-1">{stats.totalComments}</div>
                  <span className="text-[10px] text-neutral-500">Discuții comunitate</span>
                </div>

                <div className="p-4 rounded-2xl bg-neutral-950/60 border border-neutral-800">
                  <span className="text-[11px] text-neutral-400 font-semibold uppercase tracking-wider">
                    Dimensiune Bază
                  </span>
                  <div className="text-2xl font-black text-white mt-1 font-mono">
                    {(stats.fileSizeBytes / 1024).toFixed(1)} KB
                  </div>
                  <span className="text-[10px] text-amber-400">animaxia-db.json</span>
                </div>
              </div>

              {/* Local File Location Box */}
              <div className="p-4 rounded-2xl bg-neutral-950/80 border border-neutral-800 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-neutral-300">Locație fișier fizic pe disc:</span>
                  <span className="text-[11px] font-mono text-emerald-400">Status: Citire / Scriere activă</span>
                </div>
                <div className="p-2.5 bg-neutral-900 rounded-xl font-mono text-xs text-neutral-300 break-all border border-neutral-800">
                  {stats.databaseFile}
                </div>
                <p className="text-[11px] text-neutral-400">
                  Fiecare adăugare de anime, episod, comentariu, notă sau progres este salvată atomic în acest fișier JSON pe serverul local fără nicio dependență cloud.
                </p>
              </div>
            </div>
          )}

          {/* TAB 2: NEW ANIME */}
          {activeTab === 'new_anime' && (
            <form onSubmit={handleCreateAnime} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-neutral-300 block mb-1">
                    Titlu Română *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="ex. Dragon Ball Z"
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    className="w-full bg-neutral-950 text-xs text-white p-2.5 rounded-xl border border-neutral-800 focus:border-rose-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-neutral-300 block mb-1">
                    Titlu Romaji (Japoneză)
                  </label>
                  <input
                    type="text"
                    placeholder="ex. Doragon Bōru Zetto"
                    value={newRomaji}
                    onChange={(e) => setNewRomaji(e.target.value)}
                    className="w-full bg-neutral-950 text-xs text-white p-2.5 rounded-xl border border-neutral-800 focus:border-rose-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-neutral-300 block mb-1">
                  Sinopsis / Descriere
                </label>
                <textarea
                  rows={3}
                  placeholder="Descrierea poveștii..."
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  className="w-full bg-neutral-950 text-xs text-white p-2.5 rounded-xl border border-neutral-800 focus:border-rose-500 focus:outline-none resize-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-neutral-300 block mb-1">
                    Poster URL (Copertă verticală)
                  </label>
                  <input
                    type="url"
                    placeholder="https://..."
                    value={newCover}
                    onChange={(e) => setNewCover(e.target.value)}
                    className="w-full bg-neutral-950 text-xs text-white p-2.5 rounded-xl border border-neutral-800 focus:border-rose-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-neutral-300 block mb-1">
                    Banner Orizontal URL
                  </label>
                  <input
                    type="url"
                    placeholder="https://..."
                    value={newBanner}
                    onChange={(e) => setNewBanner(e.target.value)}
                    className="w-full bg-neutral-950 text-xs text-white p-2.5 rounded-xl border border-neutral-800 focus:border-rose-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div>
                  <label className="text-xs font-semibold text-neutral-300 block mb-1">Genuri (virgulă)</label>
                  <input
                    type="text"
                    value={newGenres}
                    onChange={(e) => setNewGenres(e.target.value)}
                    className="w-full bg-neutral-950 text-xs text-white p-2.5 rounded-xl border border-neutral-800"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-neutral-300 block mb-1">Studio</label>
                  <input
                    type="text"
                    value={newStudio}
                    onChange={(e) => setNewStudio(e.target.value)}
                    className="w-full bg-neutral-950 text-xs text-white p-2.5 rounded-xl border border-neutral-800"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-neutral-300 block mb-1">An Lansare</label>
                  <input
                    type="number"
                    value={newYear}
                    onChange={(e) => setNewYear(Number(e.target.value))}
                    className="w-full bg-neutral-950 text-xs text-white p-2.5 rounded-xl border border-neutral-800"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-neutral-300 block mb-1">Status</label>
                  <select
                    value={newStatus}
                    onChange={(e: any) => setNewStatus(e.target.value)}
                    className="w-full bg-neutral-950 text-xs text-white p-2.5 rounded-xl border border-neutral-800"
                  >
                    <option value="În difuzare">În difuzare</option>
                    <option value="Finalizat">Finalizat</option>
                    <option value="În curând">În curând</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="feat"
                  checked={isFeatured}
                  onChange={(e) => setIsFeatured(e.target.checked)}
                  className="rounded text-rose-600 focus:ring-rose-500"
                />
                <label htmlFor="feat" className="text-xs text-neutral-300 cursor-pointer">
                  Afișează în caruselul principal (Recomandate / Banner de top)
                </label>
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs uppercase tracking-wider transition cursor-pointer shadow-lg shadow-rose-600/20"
              >
                Salvează Anime în Baza de Date Locală
              </button>
            </form>
          )}

          {/* TAB 3: NEW EPISODE */}
          {activeTab === 'new_episode' && (
            <form onSubmit={handleCreateEpisode} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-neutral-300 block mb-1">
                  Selectează Anime-ul *
                </label>
                <select
                  value={selectedAnimeId}
                  onChange={(e) => setSelectedAnimeId(e.target.value)}
                  className="w-full bg-neutral-950 text-xs text-white p-2.5 rounded-xl border border-neutral-800 focus:border-rose-500"
                >
                  {animes.map((a) => (
                    <option key={a.id} value={a.id}>
                      {a.title} ({a.episodes.length} episoade existente)
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="text-xs font-semibold text-neutral-300 block mb-1">
                    Număr Episod
                  </label>
                  <input
                    type="number"
                    min={1}
                    value={epNumber}
                    onChange={(e) => setEpNumber(Number(e.target.value))}
                    className="w-full bg-neutral-950 text-xs text-white p-2.5 rounded-xl border border-neutral-800"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="text-xs font-semibold text-neutral-300 block mb-1">
                    Titlu Episod *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="ex. Bătălia pentru Trost"
                    value={epTitle}
                    onChange={(e) => setEpTitle(e.target.value)}
                    className="w-full bg-neutral-950 text-xs text-white p-2.5 rounded-xl border border-neutral-800"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-neutral-300 block mb-1">
                  URL Sursă Video (Direct MP4, WebM sau stream) *
                </label>
                <input
                  type="url"
                  required
                  value={epVideoUrl}
                  onChange={(e) => setEpVideoUrl(e.target.value)}
                  className="w-full bg-neutral-950 text-xs text-white p-2.5 rounded-xl border border-neutral-800 font-mono"
                />
                <p className="text-[10px] text-neutral-500 mt-1">
                  Poți adăuga orice URL direct de fișier video MP4/WebM compatibil cu HTML5.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-neutral-300 block mb-1">
                    Intro Început (secunde)
                  </label>
                  <input
                    type="number"
                    value={epIntroStart}
                    onChange={(e) => setEpIntroStart(Number(e.target.value))}
                    className="w-full bg-neutral-950 text-xs text-white p-2.5 rounded-xl border border-neutral-800"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-neutral-300 block mb-1">
                    Intro Sfârșit (secunde - Skip)
                  </label>
                  <input
                    type="number"
                    value={epIntroEnd}
                    onChange={(e) => setEpIntroEnd(Number(e.target.value))}
                    className="w-full bg-neutral-950 text-xs text-white p-2.5 rounded-xl border border-neutral-800"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs uppercase tracking-wider transition cursor-pointer shadow-lg shadow-rose-600/20"
              >
                Adaugă Episod la Anime
              </button>
            </form>
          )}

          {/* TAB 4: MANAGE CATALOG */}
          {activeTab === 'manage_catalog' && (
            <div className="space-y-3">
              {animes.map((anime) => (
                <div
                  key={anime.id}
                  className="flex items-center justify-between gap-3 p-3 bg-neutral-950/60 rounded-xl border border-neutral-800 hover:border-neutral-700 transition"
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={anime.coverImage}
                      alt={anime.title}
                      className="w-10 h-14 object-cover rounded-md"
                    />
                    <div>
                      <h4 className="text-xs font-bold text-white">{anime.title}</h4>
                      <p className="text-[11px] text-neutral-400">
                        {anime.episodes.length} episoade · {anime.studio} · {anime.releaseYear}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => {
                        setSelectedAnimeId(anime.id);
                        setActiveTab('new_episode');
                      }}
                      className="px-2.5 py-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-xs font-medium text-neutral-300 cursor-pointer"
                    >
                      + Episod
                    </button>
                    <button
                      onClick={() => handleDeleteAnime(anime.id, anime.title)}
                      className="p-1.5 rounded-lg bg-rose-600/10 hover:bg-rose-600 text-rose-400 hover:text-white transition cursor-pointer"
                      title="Șterge anime"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* TAB 5: BACKUP & RESTORE */}
          {activeTab === 'backup' && (
            <div className="space-y-6">
              <div className="p-4 rounded-2xl bg-neutral-950/60 border border-neutral-800 space-y-3">
                <div className="flex items-center gap-3">
                  <Download className="w-5 h-5 text-rose-400" />
                  <div>
                    <h4 className="text-xs font-bold text-white">Descarcă Backup Bază de Date</h4>
                    <p className="text-[11px] text-neutral-400">
                      Salvează o copie completă JSON a întregii colecții de anime, episoade, istoric și comentarii.
                    </p>
                  </div>
                </div>
                <a
                  href={api.exportDbUrl()}
                  download="animaxia-database-backup.json"
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-xs font-semibold text-white transition"
                >
                  <FileJson className="w-4 h-4 text-amber-400" />
                  <span>Descarcă animaxia-db.json</span>
                </a>
              </div>

              <div className="p-4 rounded-2xl bg-neutral-950/60 border border-neutral-800 space-y-3">
                <div className="flex items-center gap-3">
                  <Upload className="w-5 h-5 text-rose-400" />
                  <div>
                    <h4 className="text-xs font-bold text-white">Restaurează din Fișier JSON</h4>
                    <p className="text-[11px] text-neutral-400">
                      Încarcă un fișier JSON de backup pentru a restaura baza de date locală.
                    </p>
                  </div>
                </div>
                <label className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-xs font-semibold text-white cursor-pointer transition">
                  <Upload className="w-4 h-4" />
                  <span>Alege fișier JSON...</span>
                  <input
                    type="file"
                    accept=".json"
                    onChange={handleImportJson}
                    className="hidden"
                  />
                </label>
              </div>

              <div className="p-4 rounded-2xl bg-rose-950/20 border border-rose-500/20 space-y-3">
                <div className="flex items-center gap-3">
                  <RotateCcw className="w-5 h-5 text-rose-400" />
                  <div>
                    <h4 className="text-xs font-bold text-white">Resetare la Setul Implicit</h4>
                    <p className="text-[11px] text-neutral-400">
                      Reîncarcă anime-urile predefinite (Attack on Titan, Demon Slayer, Frieren, Cyberpunk, etc.).
                    </p>
                  </div>
                </div>
                <button
                  onClick={handleResetDb}
                  className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-xs font-semibold text-white transition cursor-pointer"
                >
                  Resetează Baza de Date la Setul Inițial
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
