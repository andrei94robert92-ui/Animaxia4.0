import React, { useState, useEffect } from 'react';
import {
  Sparkles, Flame, Bookmark, History, Database, Film,
  Tv, Layers, RefreshCw, AlertCircle, Heart, Star,
  Compass, Users, Download, ArrowRight
} from 'lucide-react';
import {
  Anime, WatchHistoryItem, WatchlistItem, UserProfile,
  CatalogCounts, TaxonomyData
} from './types/anime';
import { api } from './services/api';
import { Navbar } from './components/Navbar';
import { HeroBanner } from './components/HeroBanner';
import { MetricsBanner } from './components/MetricsBanner';
import { UniversalAddContent } from './components/UniversalAddContent';
import { ContinueWatchingSection } from './components/ContinueWatchingSection';
import { AnimeCard } from './components/AnimeCard';
import { FilterBar } from './components/FilterBar';
import { FranchisesSection } from './components/FranchisesSection';
import { AITaxonomySection } from './components/AITaxonomySection';
import { AIFluxInfinitSection } from './components/AIFluxInfinitSection';
import { SocialHubSection } from './components/SocialHubSection';
import { AnimeDetailModal } from './components/AnimeDetailModal';
import { UniversalPlayerModal } from './components/UniversalPlayerModal';
import { MinerModal } from './components/MinerModal';
import { CommandPaletteModal } from './components/CommandPaletteModal';
import { AdminStudioModal } from './components/AdminStudioModal';
import { RightSidebarDrawer } from './components/RightSidebarDrawer';

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

  const [counts, setCounts] = useState<CatalogCounts>({
    totalTitles: 8,
    totalMovies: 4,
    totalSeries: 1,
    totalAnime: 3,
    totalSport: 1,
    totalMined: 0,
  });

  const [taxonomy, setTaxonomy] = useState<TaxonomyData | null>(null);

  // Navigation & Filtering
  const [currentTab, setCurrentTab] = useState<'home' | 'catalog' | 'watchlist' | 'history'>('home');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedFranchise, setSelectedFranchise] = useState<string>('Toate');
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
  const [isMinerOpen, setIsMinerOpen] = useState(false);
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);
  const [isRightSidebarOpen, setIsRightSidebarOpen] = useState(false);

  useEffect(() => {
    loadAllData();
  }, [currentUser.id]);

  useEffect(() => {
    loadFilteredCatalog();
  }, [selectedCategory, selectedFranchise, selectedGenre, selectedStatus, sortBy]);

  const loadAllData = async () => {
    try {
      const [animesRes, featuredData, historyData, watchlistData, usersData, countsData, taxData] = await Promise.allSettled([
        api.getAnimes({ category: selectedCategory === 'all' ? undefined : selectedCategory }),
        api.getFeaturedAnimes(),
        api.getHistory(currentUser.id),
        api.getWatchlist(currentUser.id),
        api.getUsers(),
        api.getCatalogCounts(),
        api.getTaxonomy(),
      ]);

      if (animesRes.status === 'fulfilled' && animesRes.value?.items) {
        setAnimes(animesRes.value.items);
      }
      if (featuredData.status === 'fulfilled' && featuredData.value?.length) {
        setFeaturedAnimes(featuredData.value);
      }
      if (historyData.status === 'fulfilled' && historyData.value) {
        setHistory(historyData.value);
      }
      if (watchlistData.status === 'fulfilled' && watchlistData.value) {
        setWatchlist(watchlistData.value);
      }
      if (usersData.status === 'fulfilled' && usersData.value?.length) {
        setUsers(usersData.value);
      }
      if (countsData.status === 'fulfilled' && countsData.value) {
        setCounts(countsData.value);
      }
      if (taxData.status === 'fulfilled' && taxData.value) {
        setTaxonomy(taxData.value);
      }
    } catch (err) {
      console.warn('Silent data load warning:', err);
    }
  };

  const loadFilteredCatalog = async () => {
    try {
      const res = await api.getAnimes({
        category: selectedCategory === 'all' ? undefined : selectedCategory,
        franchise: selectedFranchise === 'Toate' ? undefined : selectedFranchise,
        genre: selectedGenre === 'Toate' ? undefined : selectedGenre,
        status: selectedStatus === 'Toate' ? undefined : selectedStatus,
        sort: sortBy,
      });
      setAnimes(res.items);
    } catch (err) {
      console.error(err);
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

  const handleToggleWatchlist = async (anime: Anime) => {
    const exists = watchlist.some((w) => w.animeId === anime.id);
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

  const handlePlayAnime = (anime: Anime, episodeIndex = 0, resumeSeconds = 0) => {
    setActivePlayer({
      anime,
      episodeIndex,
      progressSeconds: resumeSeconds,
    });
  };

  const handleContentIngested = (newAnime: Anime) => {
    setAnimes((prev) => [newAnime, ...prev]);
    loadAllData();
  };

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 flex flex-col font-['Plus_Jakarta_Sans',sans-serif]">
      {/* Top Navbar with ⌘K Search */}
      <Navbar
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
        selectedCategory={selectedCategory}
        setSelectedCategory={(cat) => {
          setSelectedCategory(cat);
          setCurrentTab('home');
        }}
        currentUser={currentUser}
        users={users}
        onSelectUser={setCurrentUser}
        onOpenStudio={() => setIsStudioOpen(true)}
        onOpenCommandPalette={() => setIsCommandPaletteOpen(true)}
        onOpenRightSidebar={() => setIsRightSidebarOpen(true)}
      />

      {/* Main Content Body */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* VIEW 1: HOME (ACASĂ) */}
        {currentTab === 'home' && (
          <div>
            {/* Cinematic Hero */}
            <HeroBanner
              featuredAnimes={featuredAnimes}
              onPlayEpisode={(anime, idx) => handlePlayAnime(anime, idx || 0)}
              onOpenDetails={(anime) => setSelectedAnimeForDetails(anime)}
              onToggleWatchlist={handleToggleWatchlist}
              isInWatchlist={(id) => watchlist.some((w) => w.animeId === id)}
            />

            {/* Metrics Banner (Total titluri, Filme, Seriale, Anime) */}
            <MetricsBanner
              counts={counts}
              selectedCategory={selectedCategory}
              onSelectCategory={(cat) => setSelectedCategory(cat)}
            />

            {/* Platformă alimentată de tine (Universal Ingestion Bar) */}
            <UniversalAddContent
              onContentAdded={handleContentIngested}
              onOpenMiner={() => setIsMinerOpen(true)}
            />

            {/* Biblioteca ta Animaxia (Colecția ta salvată) */}
            <section className="mb-12">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-xl font-bold text-white tracking-tight">
                    Biblioteca ta Animaxia
                  </h3>
                  <p className="text-xs text-neutral-400 mt-0.5">
                    Titlurile salvate în colecția ta
                  </p>
                </div>
                <button
                  onClick={() => setCurrentTab('catalog')}
                  className="text-xs font-semibold text-rose-400 hover:text-rose-300 flex items-center gap-1 cursor-pointer"
                >
                  <span>See all</span>
                  <ArrowRight className="w-3.5 h-3.5" />
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
                    isInWatchlist={watchlist.some((w) => w.animeId === anime.id)}
                  />
                ))}
              </div>
            </section>

            {/* Continue Watching Section */}
            <ContinueWatchingSection
              history={history}
              animes={animes}
              onPlayResume={(animeId, epId, sec) => {
                const anime = animes.find((a) => a.id === animeId);
                if (anime) {
                  const epIdx = anime.episodes.findIndex((e) => e.id === epId);
                  handlePlayAnime(anime, epIdx >= 0 ? epIdx : 0, sec);
                }
              }}
              onRemoveHistory={async (id) => {
                await api.removeHistoryItem(id, currentUser.id);
                refreshHistory();
              }}
            />

            {/* 🧠 AI Flux Infinit — 20 de postere pe pagină (100% Online, zero timeout) */}
            <AIFluxInfinitSection
              onPlayAnime={(a) => handlePlayAnime(a, 0)}
              onOpenDetails={(a) => setSelectedAnimeForDetails(a)}
            />

            {/* Activitatea comunității (Live Hub) */}
            <SocialHubSection
              currentUser={currentUser}
              onOpenAnime={(animeId) => {
                const anime = animes.find((a) => a.id === animeId);
                if (anime) setSelectedAnimeForDetails(anime);
              }}
            />

            {/* AI Analiză conținut & Taxonomie */}
            <AITaxonomySection
              taxonomy={taxonomy}
              stats={null}
              onRefresh={loadAllData}
            />

            {/* Francize populare */}
            <FranchisesSection
              selectedFranchise={selectedFranchise}
              onSelectFranchise={(fr) => setSelectedFranchise(fr)}
            />

            {/* Ai un link de stream? Banner Miner */}
            <section className="mb-12 p-6 sm:p-8 rounded-3xl bg-neutral-900/80 border border-neutral-800 flex flex-col sm:flex-row items-center justify-between gap-6">
              <div className="space-y-1 max-w-xl text-center sm:text-left">
                <h3 className="text-xl font-bold text-white tracking-tight">
                  Ai un link de stream?
                </h3>
                <p className="text-xs text-neutral-400 leading-relaxed">
                  Lipește un link către orice pagină video, iar Minerul Animaxia îl va scana după stream-uri MP4, playlist-uri HLS, iframe-uri și embed-uri YouTube — apoi va salva titluri redabile direct în biblioteca ta.
                </p>
              </div>

              <button
                onClick={() => setIsMinerOpen(true)}
                className="px-6 py-3 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs uppercase tracking-wider shadow-lg shadow-rose-600/30 transition cursor-pointer shrink-0"
              >
                Deschide Minerul
              </button>
            </section>

            {/* Full Filterable Grid */}
            <section>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-white tracking-tight">
                  Catalog Complet Animaxia
                </h3>
                <span className="text-xs text-neutral-400 font-mono">
                  {animes.length} titluri
                </span>
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
                    isInWatchlist={watchlist.some((w) => w.animeId === anime.id)}
                  />
                ))}
              </div>
            </section>
          </div>
        )}

        {/* VIEW 2: WATCHLIST */}
        {currentTab === 'watchlist' && (
          <div>
            <div className="flex items-center justify-between flex-wrap gap-4 mb-6">
              <div>
                <h1 className="text-2xl font-black text-white tracking-tight">Lista Mea de Conținut</h1>
                <p className="text-xs text-neutral-400 mt-1">
                  Titlurile salvate local în profilul tău ({currentUser.name})
                </p>
              </div>
            </div>

            {watchlist.length === 0 ? (
              <div className="py-16 text-center bg-neutral-900/40 rounded-3xl border border-neutral-800 space-y-3">
                <Bookmark className="w-10 h-10 text-neutral-600 mx-auto" />
                <p className="text-sm text-neutral-300 font-semibold">Lista ta este goală.</p>
                <button
                  onClick={() => setCurrentTab('home')}
                  className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-xs text-white font-bold tracking-wide cursor-pointer"
                >
                  Explorează Catalogul
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {watchlist.map((item) => {
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

        {/* VIEW 3: HISTORY */}
        {currentTab === 'history' && (
          <div>
            <div className="flex items-center justify-between flex-wrap gap-4 mb-6">
              <div>
                <h1 className="text-2xl font-black text-white tracking-tight">Istoric de Vizionare</h1>
                <p className="text-xs text-neutral-400 mt-1">
                  Progresul episoadelor urmărite este salvat automat
                </p>
              </div>
              {history.length > 0 && (
                <button
                  onClick={async () => {
                    await api.clearHistory(currentUser.id);
                    refreshHistory();
                  }}
                  className="px-3 py-1.5 rounded-xl bg-neutral-900 text-xs font-semibold text-rose-400 border border-neutral-800 hover:bg-rose-600/20"
                >
                  Curăță istoricul
                </button>
              )}
            </div>

            <div className="space-y-3">
              {history.map((item) => (
                <div
                  key={`${item.animeId}-${item.episodeId}`}
                  className="flex items-center justify-between p-3.5 bg-neutral-900/70 rounded-2xl border border-neutral-800"
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={item.episodeThumbnail || item.animeCover}
                      alt={item.animeTitle}
                      className="w-20 aspect-video rounded-xl object-cover"
                    />
                    <div>
                      <h4 className="font-bold text-sm text-white">{item.animeTitle}</h4>
                      <p className="text-xs text-neutral-400">
                        {item.episodeTitle || 'Episod'} · Progres: {item.progressPercent}%
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      const a = animes.find((x) => x.id === item.animeId);
                      if (a) handlePlayAnime(a, 0, item.progressSeconds);
                    }}
                    className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs"
                  >
                    Reia
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-neutral-900 bg-neutral-950 py-12 px-4 text-xs text-neutral-500">
        <div className="max-w-7xl mx-auto space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <span className="text-base font-black text-white tracking-wider font-['Space_Grotesk']">
                ANIMAXIA
              </span>
              <p className="text-neutral-400 mt-1">
                O singură platformă pentru anime, filme, seriale, sport și știri. Conturi, recomandări AI, analytics, motor de căutare și redare universală end-to-end.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <a
                href={api.exportDbUrl()}
                download="animaxia-database-backup.json"
                className="px-3 py-1.5 rounded-lg bg-neutral-900 hover:bg-neutral-800 text-neutral-300 font-semibold border border-neutral-800 transition"
              >
                Descarcă backup JSON
              </a>
              <button
                onClick={() => setIsStudioOpen(true)}
                className="px-3 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-500 text-white font-semibold transition"
              >
                Panou Admin
              </button>
            </div>
          </div>

          <div className="pt-6 border-t border-neutral-900 flex flex-col sm:flex-row items-center justify-between gap-3 text-neutral-500">
            <span>© 2026 ANIMAXIA — Node.js + Express · Bază de date locală persistentă.</span>
            <div className="flex items-center gap-4 text-neutral-400">
              <button onClick={() => setCurrentTab('home')}>Acasă</button>
              <button onClick={() => setIsCommandPaletteOpen(true)}>Căutare (⌘K)</button>
              <button onClick={() => setIsMinerOpen(true)}>Miner</button>
            </div>
          </div>
        </div>
      </footer>

      {/* MODALS */}
      {selectedAnimeForDetails && (
        <AnimeDetailModal
          anime={selectedAnimeForDetails}
          onClose={() => setSelectedAnimeForDetails(null)}
          onPlayEpisode={(anime, idx) => {
            setSelectedAnimeForDetails(null);
            handlePlayAnime(anime, idx);
          }}
          currentUser={currentUser}
          isInWatchlist={watchlist.some((w) => w.animeId === selectedAnimeForDetails.id)}
          onToggleWatchlist={handleToggleWatchlist}
        />
      )}

      {activePlayer && (
        <UniversalPlayerModal
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

      {isMinerOpen && (
        <MinerModal
          isOpen={isMinerOpen}
          onClose={() => setIsMinerOpen(false)}
          onStreamIngested={handleContentIngested}
        />
      )}

      {isCommandPaletteOpen && (
        <CommandPaletteModal
          isOpen={isCommandPaletteOpen}
          onClose={() => setIsCommandPaletteOpen(false)}
          animes={animes}
          onSelectAnime={(a) => {
            setSelectedAnimeForDetails(a);
          }}
          onSelectCategory={(cat) => {
            setSelectedCategory(cat);
            setCurrentTab('home');
          }}
        />
      )}

      {isStudioOpen && (
        <AdminStudioModal
          onClose={() => setIsStudioOpen(false)}
          animes={animes}
          onCatalogChanged={loadAllData}
        />
      )}

      {/* Top Right Sidebar Drawer */}
      <RightSidebarDrawer
        isOpen={isRightSidebarOpen}
        onClose={() => setIsRightSidebarOpen(false)}
        onNavigate={(tab, payload) => {
          if (payload?.category) {
            setSelectedCategory(payload.category);
          }
          if (payload?.genre) {
            setSelectedGenre(payload.genre);
          }
          setCurrentTab(tab as any);
        }}
        onOpenMiner={() => setIsMinerOpen(true)}
        onOpenStudio={() => setIsStudioOpen(true)}
        onOpenCommandPalette={() => setIsCommandPaletteOpen(true)}
      />
    </div>
  );
}
