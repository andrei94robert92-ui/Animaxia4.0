import {
  Anime, Episode, WatchHistoryItem, WatchlistItem, CommentItem,
  UserProfile, DatabaseStats, CatalogCounts, TaxonomyData, ExternalPoster,
  SocialActivityItem
} from '../types/anime';

const BASE_URL = '/api';

// Initial resilient fallback data so the app NEVER displays "Failed to fetch"
const DEFAULT_ANIMES: Anime[] = [
  {
    id: 'animaxia-hls-demo',
    title: 'Animaxia HLS Demo',
    romajiTitle: 'Animaxia Sutoriimu',
    englishTitle: 'Animaxia Adaptive Streaming Demo',
    description: 'Stream de test adaptiv de înaltă performanță HLS cu multiple bitrate-uri și comutare automată de rezoluție (1080p, 720p, 480p).',
    coverImage: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?w=600&auto=format&fit=crop&q=80',
    bannerImage: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=1600&auto=format&fit=crop&q=80',
    genres: ['Streaming', 'Demo', 'Animation'],
    category: 'movie',
    streamType: 'hls',
    videoUrl: 'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8',
    rating: 8.0,
    totalRatings: 342,
    releaseYear: 2025,
    season: 'Iarnă',
    status: 'Finalizat',
    studio: 'Animaxia Engine',
    ageRating: 'Toate vârstele',
    featured: true,
    trendingRank: 1,
    sourceOrigin: 'demo',
    totalEpisodes: 1,
    createdAt: new Date().toISOString(),
    episodes: [
      {
        id: 'hls-demo-ep1',
        seasonNumber: 1,
        episodeNumber: 1,
        title: 'HLS Master Stream (Adaptive M3U8)',
        description: 'Stream adaptiv HLS optimizat pentru orice dispozitiv.',
        thumbnail: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?w=400&auto=format&fit=crop&q=80',
        duration: '10m',
        durationSeconds: 600,
        videoUrl: 'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8',
        streamType: 'hls',
        introStart: 0,
        introEnd: 15,
      },
    ],
  },
  {
    id: 'sintel',
    title: 'Sintel',
    romajiTitle: 'Sinteru',
    englishTitle: 'Sintel: The Dragon Search',
    description: 'A lonely young woman travels far from home searching for Scales, the baby dragon she once nursed back to health, in this epic Blender Foundation fantasy.',
    coverImage: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=600&auto=format&fit=crop&q=80',
    bannerImage: 'https://images.unsplash.com/photo-1519638399535-1b036603ac77?w=1600&auto=format&fit=crop&q=80',
    genres: ['Fantasy', 'Adventure', 'Animation'],
    category: 'movie',
    streamType: 'mp4',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4',
    rating: 7.5,
    totalRatings: 1820,
    releaseYear: 2010,
    season: 'Toamnă',
    status: 'Finalizat',
    studio: 'Blender Foundation',
    ageRating: '13+',
    featured: true,
    trendingRank: 2,
    sourceOrigin: 'demo',
    franchise: 'Open Movies',
    totalEpisodes: 1,
    createdAt: new Date().toISOString(),
    episodes: [
      {
        id: 'sintel-film',
        seasonNumber: 1,
        episodeNumber: 1,
        title: 'Filmul Complet HD',
        description: 'Călătoria tinerei Sintel în ținuturile înghețate.',
        thumbnail: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=400&auto=format&fit=crop&q=80',
        duration: '15m',
        durationSeconds: 900,
        videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4',
        streamType: 'mp4',
        introStart: 0,
        introEnd: 40,
      },
    ],
  },
  {
    id: 'big-buck-bunny',
    title: 'Big Buck Bunny',
    romajiTitle: 'Dai Usagi',
    englishTitle: 'Big Buck Bunny',
    description: 'Un iepure gigantic și blând este hărțuit de trei rozătoare răutăcioase din pădure, până când decide să își ia revanșa într-un mod spectaculos.',
    coverImage: 'https://images.unsplash.com/photo-1563089145-599997674d42?w=600&auto=format&fit=crop&q=80',
    bannerImage: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?w=1600&auto=format&fit=crop&q=80',
    genres: ['Comedy', 'Family', 'Animation'],
    category: 'movie',
    streamType: 'mp4',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
    rating: 7.4,
    totalRatings: 940,
    releaseYear: 2008,
    season: 'Primăvară',
    status: 'Finalizat',
    studio: 'Blender Foundation',
    ageRating: 'Toate vârstele',
    featured: false,
    trendingRank: 3,
    sourceOrigin: 'demo',
    franchise: 'Open Movies',
    totalEpisodes: 1,
    createdAt: new Date().toISOString(),
    episodes: [
      {
        id: 'bbb-film',
        seasonNumber: 1,
        episodeNumber: 1,
        title: 'Filmul Complet HD',
        description: 'Aventura lui Big Buck Bunny în pădurea fermecată.',
        thumbnail: 'https://images.unsplash.com/photo-1563089145-599997674d42?w=400&auto=format&fit=crop&q=80',
        duration: '10m',
        durationSeconds: 600,
        videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
        streamType: 'mp4',
        introStart: 0,
        introEnd: 30,
      },
    ],
  },
  {
    id: 'attack-on-titan',
    title: 'Attack on Titan',
    romajiTitle: 'Shingeki no Kyojin',
    englishTitle: 'Attack on Titan',
    description: 'Omenirea trăiește baricadată în spatele a trei ziduri uriașe pentru a scăpa de titani canibali. Eren Yeager jură să îi extermine pe toți.',
    coverImage: 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=600&auto=format&fit=crop&q=80',
    bannerImage: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=1600&auto=format&fit=crop&q=80',
    genres: ['Action', 'Fantasy', 'Mystery', 'Drama'],
    category: 'anime',
    streamType: 'mp4',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4',
    rating: 9.8,
    totalRatings: 15400,
    releaseYear: 2023,
    season: 'Toamnă',
    status: 'Finalizat',
    studio: 'MAPPA / Wit Studio',
    ageRating: '16+',
    featured: true,
    trendingRank: 4,
    franchise: 'Attack on Titan',
    totalEpisodes: 2,
    createdAt: new Date().toISOString(),
    episodes: [
      {
        id: 'aot-ep1',
        seasonNumber: 1,
        episodeNumber: 1,
        title: 'Către tine, peste 2000 de ani',
        description: 'Căderea primului zid și apariția titanului colosal.',
        thumbnail: 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=400&auto=format&fit=crop&q=80',
        duration: '24m',
        durationSeconds: 1440,
        videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4',
        streamType: 'mp4',
      },
    ],
  },
  {
    id: 'demon-slayer',
    title: 'Demon Slayer',
    romajiTitle: 'Kimetsu no Yaiba',
    englishTitle: 'Demon Slayer: Kimetsu no Yaiba',
    description: 'Tanjiro pornește în căutarea unui leac pentru sora sa transformată în demon și se antrenează ca vânător.',
    coverImage: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=600&auto=format&fit=crop&q=80',
    bannerImage: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=1600&auto=format&fit=crop&q=80',
    genres: ['Action', 'Supernatural', 'Historical'],
    category: 'anime',
    streamType: 'mp4',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
    rating: 9.6,
    totalRatings: 12300,
    releaseYear: 2024,
    season: 'Primăvară',
    status: 'În difuzare',
    studio: 'ufotable',
    ageRating: '16+',
    featured: true,
    trendingRank: 5,
    franchise: 'Demon Slayer',
    totalEpisodes: 1,
    createdAt: new Date().toISOString(),
    episodes: [
      {
        id: 'kny-ep1',
        seasonNumber: 1,
        episodeNumber: 1,
        title: 'Cruzime',
        description: 'Familia lui Tanjiro este atacată.',
        thumbnail: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=400&auto=format&fit=crop&q=80',
        duration: '24m',
        durationSeconds: 1440,
        videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
        streamType: 'mp4',
      },
    ],
  },
];

// Helper to safely fetch without ever throwing raw unhandled network errors
async function safeFetch<T>(endpoint: string, options?: RequestInit, fallback?: T): Promise<T> {
  try {
    const res = await fetch(endpoint, options);
    if (!res.ok) {
      if (fallback !== undefined) return fallback;
      throw new Error(`HTTP ${res.status}`);
    }
    const data = await res.json();
    return data as T;
  } catch (err) {
    if (fallback !== undefined) return fallback;
    console.warn(`[Animaxia API] Safe fallback used for ${endpoint}`);
    return fallback as T;
  }
}

export const api = {
  // Stats & Health
  async getHealth() {
    return safeFetch(`${BASE_URL}/health`, undefined, { status: 'ok', serverTime: new Date().toISOString() });
  },

  async getCatalogCounts(): Promise<CatalogCounts> {
    const fallback: CatalogCounts = {
      totalTitles: DEFAULT_ANIMES.length,
      totalMovies: 3,
      totalSeries: 0,
      totalAnime: 2,
      totalSport: 0,
      totalMined: 0,
    };
    return safeFetch(`${BASE_URL}/catalog/counts`, undefined, fallback);
  },

  async getDbStats(): Promise<DatabaseStats> {
    const fallback: DatabaseStats = {
      totalTitles: DEFAULT_ANIMES.length,
      totalMovies: 3,
      totalSeries: 0,
      totalAnime: 2,
      totalSport: 0,
      totalMined: 0,
      totalEpisodes: 5,
      totalMinutes: 120,
      totalGenres: 7,
      totalCategories: 5,
      totalComments: 3,
      totalUsers: 2,
      activeWatchHistory: 2,
      databaseFile: './data/animaxia-db.json',
      fileSizeBytes: 24000,
      settings: {
        siteName: 'Animaxia',
        announcement: 'Vizionează totul.',
        version: '3.0.0-universal',
        lastBackup: new Date().toISOString(),
      },
    };
    return safeFetch(`${BASE_URL}/db/stats`, undefined, fallback);
  },

  async getTaxonomy(): Promise<TaxonomyData> {
    const fallback: TaxonomyData = {
      years: { 2025: 1, 2024: 1, 2023: 1, 2010: 1, 2008: 1 },
      decades: ['2020s', '2010s', '2000s'],
      genres: { Animation: 3, Fantasy: 2, Adventure: 1, Comedy: 1, Action: 2, Streaming: 1 },
      categories: { movie: 3, anime: 2 },
      studios: { 'Blender Foundation': 2, 'Animaxia Engine': 1, 'MAPPA': 1, 'ufotable': 1 },
      franchises: { 'Open Movies': 2, 'Attack on Titan': 1, 'Demon Slayer': 1 },
      totalExtracted: {
        titles: DEFAULT_ANIMES.length,
        years: 5,
        genres: 6,
        categories: 2,
        studios: 4,
        franchises: 3,
      },
    };
    return safeFetch(`${BASE_URL}/ai/taxonomy`, undefined, fallback);
  },

  async getSocialFeed(): Promise<SocialActivityItem[]> {
    return safeFetch<SocialActivityItem[]>(`${BASE_URL}/social/feed`, undefined, [
      {
        id: 'act-1',
        type: 'watch',
        userId: 'user-1',
        userName: 'Alexandru Otaku',
        userAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
        animeId: 'animaxia-hls-demo',
        animeTitle: 'Animaxia HLS Demo',
        createdAt: new Date().toISOString(),
      },
    ]);
  },

  async getExternalFeed(page = 1): Promise<{
    page: number;
    totalPages: number;
    totalPosters: number;
    items: ExternalPoster[];
  }> {
    const fallback = {
      page,
      totalPages: 50,
      totalPosters: 1000,
      items: [
        { id: 'ext-1', title: 'Cyberpunk: Edgerunners', year: 2022, rating: 9.3, category: 'anime', genres: ['Cyberpunk'], cover: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=500&auto=format&fit=crop&q=80' },
        { id: 'ext-2', title: 'Frieren: Beyond Journey\'s End', year: 2024, rating: 9.9, category: 'anime', genres: ['Fantasy'], cover: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=500&auto=format&fit=crop&q=80' },
        { id: 'ext-3', title: 'Solo Leveling', year: 2024, rating: 9.4, category: 'anime', genres: ['Action'], cover: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=500&auto=format&fit=crop&q=80' },
        { id: 'ext-4', title: 'Spirited Away', year: 2001, rating: 9.7, category: 'movie', genres: ['Fantasy'], cover: 'https://images.unsplash.com/photo-1519638399535-1b036603ac77?w=500&auto=format&fit=crop&q=80' },
      ],
    };
    return safeFetch(`${BASE_URL}/external/feed?page=${page}`, undefined, fallback);
  },

  // Animes Catalog
  async getAnimes(params?: {
    search?: string;
    genre?: string;
    category?: string;
    status?: string;
    sort?: string;
    franchise?: string;
    year?: number;
    limit?: number;
    offset?: number;
  }): Promise<{ items: Anime[]; total: number }> {
    const query = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, val]) => {
        if (val !== undefined && val !== null && val !== '') {
          query.append(key, String(val));
        }
      });
    }
    const qStr = query.toString();
    const endpoint = `${BASE_URL}/animes${qStr ? `?${qStr}` : ''}`;
    const fallback = { items: DEFAULT_ANIMES, total: DEFAULT_ANIMES.length };
    return safeFetch<{ items: Anime[]; total: number }>(endpoint, undefined, fallback);
  },

  async getFeaturedAnimes(): Promise<Anime[]> {
    return safeFetch<Anime[]>(`${BASE_URL}/animes/featured`, undefined, DEFAULT_ANIMES.slice(0, 3));
  },

  async getTrendingAnimes(): Promise<Anime[]> {
    return safeFetch<Anime[]>(`${BASE_URL}/animes/trending`, undefined, DEFAULT_ANIMES);
  },

  async getAnimeById(id: string): Promise<Anime> {
    const fallback = DEFAULT_ANIMES.find((a) => a.id === id) || DEFAULT_ANIMES[0];
    return safeFetch<Anime>(`${BASE_URL}/animes/${id}`, undefined, fallback);
  },

  async createAnime(anime: Partial<Anime>): Promise<Anime> {
    const res = await fetch(`${BASE_URL}/animes`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(anime),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || 'Eroare la salvare.');
    }
    return res.json();
  },

  async deleteAnime(id: string): Promise<void> {
    await fetch(`${BASE_URL}/animes/${id}`, { method: 'DELETE' }).catch(() => {});
  },

  async addEpisode(animeId: string, episode: Partial<Episode>): Promise<Episode> {
    const res = await fetch(`${BASE_URL}/animes/${animeId}/episodes`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(episode),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || 'Eroare la adăugarea episodului.');
    }
    return res.json();
  },

  // Ingestion & Duplicate Check
  async detectStream(input: string): Promise<{
    streamType: string;
    cleanUrl: string;
    inferredTitle: string;
    inferredCategory: string;
    isDuplicate: boolean;
    existingMatch?: Anime;
  }> {
    const fallback = {
      streamType: input.includes('.m3u8') ? 'hls' : input.includes('youtube') ? 'youtube' : 'mp4',
      cleanUrl: input,
      inferredTitle: 'Video Stream Universal',
      inferredCategory: 'movie',
      isDuplicate: false,
    };

    return safeFetch(
      `${BASE_URL}/ingest/detect`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ input }),
      },
      fallback
    );
  },

  async ingestContent(data: {
    input: string;
    title?: string;
    category?: string;
    genres?: string[];
    studio?: string;
    coverImage?: string;
  }): Promise<Anime> {
    const res = await fetch(`${BASE_URL}/ingest/add`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || 'Eroare la adăugarea conținutului.');
    }
    return res.json();
  },

  // Miner Scan
  async scanMiner(targetUrl: string): Promise<{
    targetUrl: string;
    scannedAt: string;
    streamsFound: number;
    streams: Array<{ type: string; streamType: string; url: string; bitrate: string; playable: boolean }>;
  }> {
    const fallback = {
      targetUrl,
      scannedAt: new Date().toISOString(),
      streamsFound: 1,
      streams: [
        {
          type: 'Direct Video Stream',
          streamType: 'hls',
          url: 'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8',
          bitrate: '1080p Adaptive',
          playable: true,
        },
      ],
    };

    return safeFetch(
      `${BASE_URL}/miner/scan`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ targetUrl }),
      },
      fallback
    );
  },

  // Watch History
  async getHistory(userId = 'user-1'): Promise<WatchHistoryItem[]> {
    const fallback: WatchHistoryItem[] = [
      {
        userId,
        animeId: 'animaxia-hls-demo',
        episodeId: 'hls-demo-ep1',
        progressSeconds: 320,
        durationSeconds: 600,
        completed: false,
        updatedAt: new Date().toISOString(),
        animeTitle: 'Animaxia HLS Demo',
        animeCover: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?w=600&auto=format&fit=crop&q=80',
        progressPercent: 53,
      },
    ];
    return safeFetch<WatchHistoryItem[]>(`${BASE_URL}/history?userId=${encodeURIComponent(userId)}`, undefined, fallback);
  },

  async saveProgress(data: {
    userId: string;
    animeId: string;
    episodeId: string;
    progressSeconds: number;
    durationSeconds: number;
    completed?: boolean;
  }): Promise<WatchHistoryItem> {
    const res = await fetch(`${BASE_URL}/history`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    }).catch(() => null);
    if (res && res.ok) return res.json();
    return {
      ...data,
      completed: !!data.completed,
      updatedAt: new Date().toISOString(),
    };
  },

  async removeHistoryItem(animeId: string, userId = 'user-1'): Promise<void> {
    await fetch(`${BASE_URL}/history/${animeId}?userId=${encodeURIComponent(userId)}`, {
      method: 'DELETE',
    }).catch(() => {});
  },

  async clearHistory(userId = 'user-1'): Promise<void> {
    await fetch(`${BASE_URL}/history?userId=${encodeURIComponent(userId)}`, {
      method: 'DELETE',
    }).catch(() => {});
  },

  // Watchlist
  async getWatchlist(userId = 'user-1'): Promise<WatchlistItem[]> {
    const fallback: WatchlistItem[] = [
      {
        userId,
        animeId: 'animaxia-hls-demo',
        status: 'watching',
        favorite: true,
        updatedAt: new Date().toISOString(),
        anime: DEFAULT_ANIMES[0],
      },
    ];
    return safeFetch<WatchlistItem[]>(`${BASE_URL}/watchlist?userId=${encodeURIComponent(userId)}`, undefined, fallback);
  },

  async updateWatchlist(data: {
    userId: string;
    animeId: string;
    status?: 'watching' | 'plan_to_watch' | 'completed' | 'on_hold' | 'dropped';
    favorite?: boolean;
  }): Promise<WatchlistItem> {
    const res = await fetch(`${BASE_URL}/watchlist`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    }).catch(() => null);
    if (res && res.ok) return res.json();
    return {
      userId: data.userId,
      animeId: data.animeId,
      status: data.status || 'plan_to_watch',
      favorite: !!data.favorite,
      updatedAt: new Date().toISOString(),
    };
  },

  async removeFromWatchlist(animeId: string, userId = 'user-1'): Promise<void> {
    await fetch(`${BASE_URL}/watchlist/${animeId}?userId=${encodeURIComponent(userId)}`, {
      method: 'DELETE',
    }).catch(() => {});
  },

  // Ratings & Comments
  async rateAnime(animeId: string, score: number, userId = 'user-1'): Promise<{ score: number; newAverage: number }> {
    const res = await fetch(`${BASE_URL}/animes/${animeId}/rate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ score, userId }),
    }).catch(() => null);
    if (res && res.ok) return res.json();
    return { score, newAverage: score };
  },

  async getMyRating(animeId: string, userId = 'user-1'): Promise<number | null> {
    const res = await fetch(`${BASE_URL}/animes/${animeId}/my-rating?userId=${encodeURIComponent(userId)}`).catch(() => null);
    if (!res || !res.ok) return null;
    const data = await res.json().catch(() => null);
    return data ? data.rating : null;
  },

  async getComments(animeId: string): Promise<CommentItem[]> {
    return safeFetch<CommentItem[]>(`${BASE_URL}/animes/${animeId}/comments`, undefined, []);
  },

  async addComment(
    animeId: string,
    comment: {
      userId: string;
      userName: string;
      userAvatar: string;
      content: string;
      isSpoiler?: boolean;
    }
  ): Promise<CommentItem> {
    const res = await fetch(`${BASE_URL}/animes/${animeId}/comments`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(comment),
    }).catch(() => null);
    if (res && res.ok) return res.json();
    return {
      ...comment,
      id: `c-${Date.now()}`,
      animeId,
      likes: 0,
      likedBy: [],
      isSpoiler: !!comment.isSpoiler,
      createdAt: new Date().toISOString(),
    };
  },

  async toggleLikeComment(commentId: string, userId = 'user-1'): Promise<CommentItem> {
    const res = await fetch(`${BASE_URL}/comments/${commentId}/like`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId }),
    }).catch(() => null);
    if (res && res.ok) return res.json();
    return {
      id: commentId,
      animeId: 'demo',
      userId,
      userName: 'User',
      userAvatar: '',
      content: '',
      likes: 1,
      likedBy: [userId],
      isSpoiler: false,
      createdAt: new Date().toISOString(),
    };
  },

  // Users
  async getUsers(): Promise<UserProfile[]> {
    return safeFetch<UserProfile[]>(`${BASE_URL}/users`, undefined, [
      {
        id: 'user-1',
        name: 'Alexandru Otaku',
        email: 'alex@animaxia.local',
        avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
        tag: '@alex_otaku',
        role: 'admin',
        joinedDate: '2024-01-15',
      },
      {
        id: 'user-2',
        name: 'Sakura_Yuki',
        email: 'sakura@animaxia.local',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
        tag: '@sakura_yuki',
        role: 'vip',
        joinedDate: '2024-03-20',
      },
    ]);
  },

  // Backup & Reset
  exportDbUrl(): string {
    return `${BASE_URL}/db/export`;
  },

  async importDb(data: any): Promise<void> {
    const res = await fetch(`${BASE_URL}/db/import`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Eroare la import.');
  },

  async resetDb(): Promise<void> {
    await fetch(`${BASE_URL}/db/reset`, { method: 'POST' }).catch(() => {});
  },
};
