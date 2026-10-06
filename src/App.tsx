import React, { useState, useEffect } from 'react';
import {
  Sparkles, Flame, Bookmark, History, Database, Film,
  Tv, Layers, RefreshCw, AlertCircle, Heart, Star
} from 'lucide-react';
import { Anime, WatchHistoryItem, WatchlistItem, UserProfile } from './types/anime';
import { api } from './services/api';
import { Navbar } from './components/Navbar';
import { HeroBanner } from './components/HeroBanner';
import { ContinueWatchingSection } from './components/ContinueWatchingSection';
import { AnimeCard } from './components/AnimeCard';
import { FilterBar } from './components/FilterBar';
import { AnimeDetailModal } from './components/AnimeDetailModal';
import { VideoPlayerModal } from './components/VideoPlayerModal';
import { AdminStudioModal } from './components/AdminStudioModal';

export default function App() {
  const [animes, setAnimes] = useState<Anime[]>([]);
  const [featuredAnimes, setFeaturedAnimes] = useState<Anime[]>([]);
  const [history, setHistory] = useState<WatchHistoryItem[]>([]);
  const [watchlist, setWatchlist] = useState<WatchlistItem[]>([]);
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [currentUser, setCurrentUser] = useState<UserProfile>({
    id: 'user-1',
    name: 'Alexandru Otaku',
    email: 'alex@animaxia.local',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
    tag: '@alex_otaku',
    role: 'admin',
    joinedDate: '2024-01-15',
  });

  // Navigation & Filtering
  const [currentTab, setCurrentTab] = useState<'home' | 'catalog' | 'watchlist' | 'history'>('home');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGenre, setSelectedGenre] = useState('Toate');
  const [selectedStatus, setSelectedStatus] = useState('Toate');
  const [sortBy, setSortBy] = useState('trending');
  const [watchlistFilter, setWatchlistFilter] = useState<'all' | 'watching' | 'plan_to_watch' | 'completed'>('all');

  // Modals
  const [selectedAnimeForDetails, setSelectedAnimeForDetails] = useState<Anime | null>(null);
  const [activePlayer, setActivePlayer] = useState<{
    anime: Anime;
    episodeIndex: number;
    progressSeconds: number;
  } | null>(null);
  const [isStudioOpen, setIsStudioOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadAllData();
  }, [currentUser.id]);

  useEffect(() => {
    loadAnimes();
  }, [searchQuery, selectedGenre, selectedStatus, sortBy]);

  const loadAllData = async () => {
    setIsLoading(true);
    try {
      const [animesData, featuredData, historyData, watchlistData, usersData] = await Promise.all([
        api.getAnimes({ search: searchQuery, genre: selectedGenre, status: selectedStatus, sort: sortBy }),
        api.getFeaturedAnimes(),
        api.getHistory(currentUser.id),
        api.getWatchlist(currentUser.id),
        api.getUsers(),
      ]);

      setAnimes(animesData);
      setFeaturedAnimes(featuredData.length ? featuredData : animesData.slice(0, 3));
      setHistory(historyData);
      setWatchlist(watchlistData);
      if (usersData?.length) setUsers(usersData);
    } catch (err) {
      console.error('Eroare la încărcarea datelor:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const loadAnimes = async () => {
    try {
      const data = await api.getAnimes({
        search: searchQuery,
        genre: selectedGenre,
        status: selectedStatus,
        sort: sortBy,
      });
      setAnimes(data);
    } catch (err) {
      console.error('Eroare la filtrarea anime-urilor:', err);
    }
  };

  const refreshHistory = async () => {
    try {
      const h = await api.getHistory(currentUser.id);
      setHistory(h);
    } catch (err) {
      console.error(err);
    }
  };

  const refreshWatchlist = async () => {
    try {
      const w = await api.getWatchlist(currentUser.id);
      setWatchlist(w);
    } catch (err) {
      console.error(err);
    }
  };

  // Watchlist Actions
  const isInWatchlist = (animeId: string) => {
    return watchlist.some((w) => w.animeId === animeId);
  };

  const handleToggleWatchlist = async (anime: Anime) => {
    const exists = isInWatchlist(anime.id);
    try {
      if (exists) {
        await api.removeFromWatchlist(anime.id, currentUser.id);
      } else {
        await api.updateWatchlist({
          userId: currentUser.id,
          animeId: anime.id,
          status: 'plan_to_watch',
          favorite: true,
        });
      }
      refreshWatchlist();
    } catch (err) {
      console.error(err);
    }
  };

  // History Actions
  const handleRemoveHistory = async (animeId: string) => {
    try {
      await api.removeHistoryItem(animeId, currentUser.id);
      refreshHistory();
    } catch (err) {
      console.error(err);
    }
  };

  const handleClearAllHistory = async () => {
    if (!confirm('Sigur dorești să ștergi tot istoricul de vizionare?')) return;
    try {
      await api.clearHistory(currentUser.id);
      refreshHistory();
    } catch (err) {
      console.error(err);
    }
  };

  // Play Actions
  const handlePlayAnime = (anime: Anime, episodeIndex = 0, resumeSeconds = 0) => {
    setActivePlayer({
      anime,
      episodeIndex,
      progressSeconds: resumeSeconds,
    });
  };

  const handleResumeHistory = (animeId: string, episodeId: string, progressSeconds: number) => {
    const anime = animes.find((a) => a.id === animeId);
    if (!anime) return;
    const epIdx = anime.episodes.findIndex((e) => e.id === episodeId);
    handlePlayAnime(anime, epIdx >= 0 ? epIdx : 0, progressSeconds);
  };

  // Filtered Watchlist items
  const filteredWatchlist = watchlist.filter((item) => {
    if (watchlistFilter === 'all') return true;
    return item.status === watchlistFilter;
  });

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 flex flex-col font-['Plus_Jakarta_Sans',sans-serif]">
      {/* Top Navbar */}
      <Navbar
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        currentUser={currentUser}
        users={users}
        onSelectUser={setCurrentUser}
        onOpenStudio={() => setIsStudioOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* VIEW 1: HOME (ACASĂ) */}
        {currentTab === 'home' && (
          <div>
            {/* Cinematic Featured Hero */}
            <HeroBanner
              featuredAnimes={featuredAnimes}
              onPlayEpisode={(anime, idx) => handlePlayAnime(anime, idx || 0)}
              onOpenDetails={(anime) => setSelectedAnimeForDetails(anime)}
              onToggleWatchlist={handleToggleWatchlist}
              isInWatchlist={isInWatchlist}
            />

            {/* Continue Watching Section (From Local DB) */}
            <ContinueWatchingSection
              history={history}
              animes={animes}
              onPlayResume={handleResumeHistory}
              onRemoveHistory={handleRemoveHistory}
            />

            {/* Trending Now Section */}
            <section className="mb-10">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Flame className="w-5 h-5 text-rose-500" />
                  <h2 className="text-xl font-bold text-white tracking-tight">În Trending pe Animaxia</h2>
                  <span className="text-xs text-neutral-400 font-mono bg-neutral-900 px-2 py-0.5 rounded border border-neutral-800">
                    Cele mai vizionate
                  </span>
                </div>
                <button
                  onClick={() => {
                    setSortBy('trending');
                    setCurrentTab('catalog');
                  }}
                  className="text-xs text-rose-400 hover:text-rose-300 font-semibold cursor-pointer"
                >
                  Vezi tot catalogul →
                </button>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 gap-4">
                {animes.slice(0, 4).map((anime) => (
                  <AnimeCard
                    key={anime.id}
                    anime={anime}
                    onPlay={(a) => handlePlayAnime(a, 0)}
                    onOpenDetails={(a) => setSelectedAnimeForDetails(a)}
                    onToggleWatchlist={handleToggleWatchlist}
                    isInWatchlist={isInWatchlist(anime.id)}
                  />
                ))}
              </div>
            </section>

            {/* Curated Catalog with Fast Genre Filters */}
            <section>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Film className="w-5 h-5 text-amber-500" />
                  <h2 className="text-xl font-bold text-white tracking-tight">Catalog Anime Disponibil</h2>
                </div>
              </div>

              <FilterBar
                selectedGenre={selectedGenre}
                setSelectedGenre={setSelectedGenre}
                selectedStatus={selectedStatus}
                setSelectedStatus={setSelectedStatus}
                sortBy={sortBy}
                setSortBy={setSortBy}
                totalResults={animes.length}
              />

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 gap-4">
                {animes.map((anime) => (
                  <AnimeCard
                    key={anime.id}
                    anime={anime}
                    onPlay={(a) => handlePlayAnime(a, 0)}
                    onOpenDetails={(a) => setSelectedAnimeForDetails(a)}
                    onToggleWatchlist={handleToggleWatchlist}
                    isInWatchlist={isInWatchlist(anime.id)}
                  />
                ))}
              </div>
            </section>
          </div>
        )}

        {/* VIEW 2: CATALOG COMPLET */}
        {currentTab === 'catalog' && (
          <div>
            <div className="mb-6">
              <h1 className="text-2xl font-black text-white tracking-tight">Catalog Anime</h1>
              <p className="text-xs text-neutral-400 mt-1">
                Explorează întreaga colecție locală, filtrează după gen, status de difuzare sau sortează după popularitate și rating.
              </p>
            </div>

            <FilterBar
              selectedGenre={selectedGenre}
              setSelectedGenre={setSelectedGenre}
              selectedStatus={selectedStatus}
              setSelectedStatus={setSelectedStatus}
              sortBy={sortBy}
              setSortBy={setSortBy}
              totalResults={animes.length}
            />

            {animes.length === 0 ? (
              <div className="py-16 text-center bg-neutral-900/40 rounded-2xl border border-neutral-800">
                <p className="text-sm text-neutral-400 font-medium">Niciun anime nu corespunde filtrelor selectate.</p>
                <button
                  onClick={() => {
                    setSelectedGenre('Toate');
                    setSelectedStatus('Toate');
                    setSearchQuery('');
                  }}
                  className="mt-3 px-4 py-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-xs text-white font-semibold cursor-pointer"
                >
                  Resetează filtrele
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 gap-4">
                {animes.map((anime) => (
                  <AnimeCard
                    key={anime.id}
                    anime={anime}
                    onPlay={(a) => handlePlayAnime(a, 0)}
                    onOpenDetails={(a) => setSelectedAnimeForDetails(a)}
                    onToggleWatchlist={handleToggleWatchlist}
                    isInWatchlist={isInWatchlist(anime.id)}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {/* VIEW 3: LISTA MEA (WATCHLIST) */}
        {currentTab === 'watchlist' && (
          <div>
            <div className="flex items-center justify-between flex-wrap gap-4 mb-6">
              <div>
                <h1 className="text-2xl font-black text-white tracking-tight">Lista Mea de Anime-uri</h1>
                <p className="text-xs text-neutral-400 mt-1">
                  Titlurile salvate local în profilul tău ({currentUser.name})
                </p>
              </div>

              {/* Status Segmented Buttons */}
              <div className="flex items-center gap-1 p-1 bg-neutral-900 rounded-xl border border-neutral-800 text-xs">
                {(['all', 'watching', 'plan_to_watch', 'completed'] as const).map((filterKey) => (
                  <button
                    key={filterKey}
                    onClick={() => setWatchlistFilter(filterKey)}
                    className={`px-3 py-1.5 rounded-lg font-medium transition cursor-pointer capitalize ${
                      watchlistFilter === filterKey
                        ? 'bg-rose-600 text-white font-bold shadow'
                        : 'text-neutral-400 hover:text-white'
                    }`}
                  >
                    {filterKey === 'all'
                      ? 'Toate'
                      : filterKey === 'watching'
                      ? 'În vizionare'
                      : filterKey === 'plan_to_watch'
                      ? 'De văzut'
                      : 'Finalizate'}
                  </button>
                ))}
              </div>
            </div>

            {filteredWatchlist.length === 0 ? (
              <div className="py-16 text-center bg-neutral-900/40 rounded-3xl border border-neutral-800 space-y-3">
                <Bookmark className="w-10 h-10 text-neutral-600 mx-auto" />
                <p className="text-sm text-neutral-300 font-semibold">Lista ta este goală în această categorie.</p>
                <p className="text-xs text-neutral-500 max-w-sm mx-auto">
                  Adaugă anime-uri în listă apăsând pe pictograma "+" de pe coperți sau din pagina de detalii.
                </p>
                <button
                  onClick={() => setCurrentTab('catalog')}
                  className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-xs text-white font-bold tracking-wide cursor-pointer"
                >
                  Explorează Catalogul
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 gap-4">
                {filteredWatchlist.map((item) => {
                  if (!item.anime) return null;
                  return (
                    <AnimeCard
                      key={item.animeId}
                      anime={item.anime}
                      onPlay={(a) => handlePlayAnime(a, 0)}
                      onOpenDetails={(a) => setSelectedAnimeForDetails(a)}
                      onToggleWatchlist={handleToggleWatchlist}
                      isInWatchlist={true}
                    />
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* VIEW 4: ISTORIC VIZIONARE */}
        {currentTab === 'history' && (
          <div>
            <div className="flex items-center justify-between flex-wrap gap-4 mb-6">
              <div>
                <h1 className="text-2xl font-black text-white tracking-tight">Istoric de Vizionare</h1>
                <p className="text-xs text-neutral-400 mt-1">
                  Progresul episoadelor urmărite este salvat automat în baza de date locală
                </p>
              </div>

              {history.length > 0 && (
                <button
                  onClick={handleClearAllHistory}
                  className="px-3.5 py-1.5 rounded-xl bg-neutral-900 hover:bg-rose-600/20 text-xs font-semibold text-rose-400 border border-neutral-800 hover:border-rose-500/40 transition cursor-pointer"
                >
                  Curăță tot istoricul
                </button>
              )}
            </div>

            {history.length === 0 ? (
              <div className="py-16 text-center bg-neutral-900/40 rounded-3xl border border-neutral-800 space-y-3">
                <History className="w-10 h-10 text-neutral-600 mx-auto" />
                <p className="text-sm text-neutral-300 font-semibold">Nu ai vizionat niciun episod încă.</p>
                <p className="text-xs text-neutral-500">
                  Episoadele pe care le începi vor apărea aici cu minutul exact unde ai rămas.
                </p>
                <button
                  onClick={() => setCurrentTab('home')}
                  className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-xs text-white font-bold tracking-wide cursor-pointer"
                >
                  Vezi Recomandări
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                {history.map((item) => {
                  const anime = animes.find((a) => a.id === item.animeId);
                  const mins = Math.floor(item.progressSeconds / 60);
                  const totalMins = Math.floor(item.durationSeconds / 60);

                  return (
                    <div
                      key={`${item.animeId}-${item.episodeId}`}
                      className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-3 bg-neutral-900/70 hover:bg-neutral-850 rounded-2xl border border-neutral-800 transition"
                    >
                      <div className="flex items-center gap-3">
                        <img
                          src={item.episodeThumbnail || item.animeCover}
                          alt={item.animeTitle}
                          className="w-24 aspect-video rounded-xl object-cover"
                        />
                        <div>
                          <h4 className="font-bold text-sm text-white">{item.animeTitle}</h4>
                          <p className="text-xs text-neutral-400">
                            {item.episodeTitle || `Episodul ${item.episodeNumber}`} · {mins}/{totalMins} min ({item.progressPercent}%)
                          </p>
                          <span className="text-[10px] text-neutral-500 font-mono">
                            Ultima vizionare: {new Date(item.updatedAt).toLocaleString('ro-RO')}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 self-end sm:self-center">
                        <button
                          onClick={() => handleResumeHistory(item.animeId, item.episodeId, item.progressSeconds)}
                          className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs transition cursor-pointer"
                        >
                          Reia redarea
                        </button>
                        <button
                          onClick={() => handleRemoveHistory(item.animeId)}
                          className="p-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-400 hover:text-white transition cursor-pointer"
                          title="Șterge din istoric"
                        >
                          ✕
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-neutral-900 bg-neutral-950 py-8 px-4 text-center text-xs text-neutral-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-bold text-neutral-300">ANIMAXIA</span>
            <span>·</span>
            <span>Platformă Fullstack Anime cu Bază de Date 100% Locală End-to-End</span>
          </div>

          <div className="flex items-center gap-3">
            <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[11px] font-mono">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
              Local Server Online (Port 3000)
            </span>
            <button
              onClick={() => setIsStudioOpen(true)}
              className="text-neutral-400 hover:text-white transition cursor-pointer flex items-center gap-1"
            >
              <Database className="w-3.5 h-3.5" />
              <span>Studio DB</span>
            </button>
          </div>
        </div>
      </footer>

      {/* MODALS */}

      {/* Anime Details Modal */}
      {selectedAnimeForDetails && (
        <AnimeDetailModal
          anime={selectedAnimeForDetails}
          onClose={() => setSelectedAnimeForDetails(null)}
          onPlayEpisode={(anime, idx) => {
            setSelectedAnimeForDetails(null);
            handlePlayAnime(anime, idx);
          }}
          currentUser={currentUser}
          isInWatchlist={isInWatchlist(selectedAnimeForDetails.id)}
          onToggleWatchlist={handleToggleWatchlist}
          onAnimeUpdated={(updated) => {
            setAnimes(animes.map((a) => (a.id === updated.id ? updated : a)));
            setSelectedAnimeForDetails(updated);
          }}
        />
      )}

      {/* Video Player Modal */}
      {activePlayer && (
        <VideoPlayerModal
          anime={activePlayer.anime}
          initialEpisodeIndex={activePlayer.episodeIndex}
          initialProgressSeconds={activePlayer.progressSeconds}
          onClose={() => {
            setActivePlayer(null);
            refreshHistory();
          }}
          userId={currentUser.id}
          onProgressSaved={refreshHistory}
        />
      )}

      {/* Admin Studio Local DB Modal */}
      {isStudioOpen && (
        <AdminStudioModal
          onClose={() => setIsStudioOpen(false)}
          animes={animes}
          onCatalogChanged={loadAllData}
        />
      )}
    </div>
  );
}
