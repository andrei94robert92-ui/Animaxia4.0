import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export type ContentCategory = 'movie' | 'series' | 'anime' | 'sport' | 'mined';
export type StreamType = 'mp4' | 'hls' | 'dash' | 'youtube' | 'vimeo' | 'twitch' | 'iframe' | 'embed';

export interface Episode {
  id: string;
  seasonNumber: number;
  episodeNumber: number;
  title: string;
  romajiTitle?: string;
  description: string;
  thumbnail: string;
  duration: string;
  durationSeconds: number;
  videoUrl: string;
  streamType?: StreamType;
  subtitlesUrl?: string;
  introStart?: number;
  introEnd?: number;
  outroStart?: number;
}

export interface Anime {
  id: string;
  title: string;
  romajiTitle: string;
  englishTitle: string;
  description: string;
  coverImage: string;
  bannerImage: string;
  genres: string[];
  category: ContentCategory;
  streamType?: StreamType;
  videoUrl?: string;
  rating: number;
  totalRatings: number;
  releaseYear: number;
  season?: 'Iarnă' | 'Primăvară' | 'Vară' | 'Toamnă';
  status: 'În difuzare' | 'Finalizat' | 'În curând';
  studio: string;
  ageRating: string;
  featured: boolean;
  trendingRank?: number;
  franchise?: string;
  collection?: string;
  actors?: string[];
  directors?: string[];
  sourceOrigin?: string; // 'local' | 'youtube' | 'miner' | 'embed' | 'tmdb' | 'jikan'
  totalEpisodes: number;
  episodes: Episode[];
  createdAt: string;
}

export interface WatchHistoryItem {
  userId: string;
  animeId: string;
  episodeId: string;
  progressSeconds: number;
  durationSeconds: number;
  completed: boolean;
  updatedAt: string;
}

export interface WatchlistItem {
  userId: string;
  animeId: string;
  status: 'watching' | 'plan_to_watch' | 'completed' | 'on_hold' | 'dropped';
  favorite: boolean;
  updatedAt: string;
}

export interface CommentItem {
  id: string;
  animeId: string;
  episodeId?: string;
  userId: string;
  userName: string;
  userAvatar: string;
  content: string;
  timestampVideo?: number;
  isSpoiler: boolean;
  likes: number;
  likedBy: string[];
  createdAt: string;
}

export interface SocialActivityItem {
  id: string;
  type: 'watch' | 'comment' | 'rate' | 'add';
  userId: string;
  userName: string;
  userAvatar: string;
  animeId: string;
  animeTitle: string;
  text?: string;
  score?: number;
  createdAt: string;
}

export interface UserRating {
  userId: string;
  animeId: string;
  score: number;
  updatedAt: string;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  avatar: string;
  tag: string;
  role: 'admin' | 'user' | 'vip';
  joinedDate: string;
}

export interface DatabaseSchema {
  animes: Anime[];
  watchHistory: WatchHistoryItem[];
  watchlist: WatchlistItem[];
  comments: CommentItem[];
  socialActivity: SocialActivityItem[];
  userRatings: UserRating[];
  users: UserProfile[];
  settings: {
    siteName: string;
    announcement: string;
    version: string;
    lastBackup: string;
  };
}

const SAMPLE_VIDEOS = {
  hlsDemo: 'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8',
  sintel: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4',
  bigBuckBunny: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
  tearsOfSteel: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4',
  elephantsDream: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
  forBiggerBlazes: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
  weAreGoingOnBullrun: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/WeAreGoingOnBullrun.mp4',
  youtubeSample: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
};

const SEED_DATA: DatabaseSchema = {
  animes: [
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
      videoUrl: SAMPLE_VIDEOS.hlsDemo,
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
      createdAt: new Date(Date.now() - 720000).toISOString(),
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
          videoUrl: SAMPLE_VIDEOS.hlsDemo,
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
      videoUrl: SAMPLE_VIDEOS.sintel,
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
      createdAt: new Date(Date.now() - 720000).toISOString(),
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
          videoUrl: SAMPLE_VIDEOS.sintel,
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
      videoUrl: SAMPLE_VIDEOS.bigBuckBunny,
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
      createdAt: new Date(Date.now() - 720000).toISOString(),
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
          videoUrl: SAMPLE_VIDEOS.bigBuckBunny,
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
      videoUrl: SAMPLE_VIDEOS.tearsOfSteel,
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
      totalEpisodes: 3,
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
          videoUrl: SAMPLE_VIDEOS.tearsOfSteel,
          streamType: 'mp4',
          introStart: 60,
          introEnd: 145,
        },
        {
          id: 'aot-ep2',
          seasonNumber: 1,
          episodeNumber: 2,
          title: 'Căderea Shiganshinei',
          description: 'Refugiații ajung la Zidul Rose.',
          thumbnail: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=400&auto=format&fit=crop&q=80',
          duration: '23m',
          durationSeconds: 1380,
          videoUrl: SAMPLE_VIDEOS.sintel,
          streamType: 'mp4',
          introStart: 70,
          introEnd: 155,
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
      videoUrl: SAMPLE_VIDEOS.bigBuckBunny,
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
      totalEpisodes: 2,
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
          videoUrl: SAMPLE_VIDEOS.bigBuckBunny,
          streamType: 'mp4',
          introStart: 70,
          introEnd: 155,
        },
      ],
    },
    {
      id: 'jujutsu-kaisen',
      title: 'Jujutsu Kaisen',
      romajiTitle: 'Jujutsu Kaisen',
      englishTitle: 'Jujutsu Kaisen',
      description: 'Yuji Itadori înghite un deget blestemat legendar aparținând lui Sukuna și intră în lumea secretă a vrăjitorilor Jujutsu.',
      coverImage: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=600&auto=format&fit=crop&q=80',
      bannerImage: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?w=1600&auto=format&fit=crop&q=80',
      genres: ['Action', 'Supernatural', 'Shounen'],
      category: 'anime',
      streamType: 'mp4',
      videoUrl: SAMPLE_VIDEOS.forBiggerBlazes,
      rating: 9.5,
      totalRatings: 11200,
      releaseYear: 2023,
      season: 'Vară',
      status: 'În difuzare',
      studio: 'MAPPA',
      ageRating: '16+',
      featured: false,
      trendingRank: 6,
      franchise: 'Jujutsu Kaisen',
      totalEpisodes: 2,
      createdAt: new Date().toISOString(),
      episodes: [
        {
          id: 'jjk-ep1',
          seasonNumber: 1,
          episodeNumber: 1,
          title: 'Ryomen Sukuna',
          description: 'Clubul de ocultism desigilează degetul lui Sukuna.',
          thumbnail: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=400&auto=format&fit=crop&q=80',
          duration: '24m',
          durationSeconds: 1440,
          videoUrl: SAMPLE_VIDEOS.forBiggerBlazes,
          streamType: 'mp4',
          introStart: 65,
          introEnd: 150,
        },
      ],
    },
    {
      id: 'tears-of-steel',
      title: 'Tears of Steel',
      romajiTitle: 'Hagane no Namida',
      englishTitle: 'Tears of Steel',
      description: 'Într-un viitor distopic la Amsterdam, un grup de soldați și oameni de știință încearcă să salveze lumea de roboți distrugători printr-un ritual de memorie.',
      coverImage: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=600&auto=format&fit=crop&q=80',
      bannerImage: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=1600&auto=format&fit=crop&q=80',
      genres: ['Sci-Fi', 'Action', 'Cyberpunk'],
      category: 'movie',
      streamType: 'mp4',
      videoUrl: SAMPLE_VIDEOS.tearsOfSteel,
      rating: 7.2,
      totalRatings: 840,
      releaseYear: 2012,
      season: 'Vară',
      status: 'Finalizat',
      studio: 'Blender VFX',
      ageRating: '16+',
      featured: false,
      trendingRank: 7,
      sourceOrigin: 'demo',
      franchise: 'Open Movies',
      totalEpisodes: 1,
      createdAt: new Date().toISOString(),
      episodes: [
        {
          id: 'tos-film',
          seasonNumber: 1,
          episodeNumber: 1,
          title: 'Filmul Complet HD',
          description: 'Războiul împotriva inteligenței artificiale distructive.',
          thumbnail: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=400&auto=format&fit=crop&q=80',
          duration: '12m',
          durationSeconds: 720,
          videoUrl: SAMPLE_VIDEOS.tearsOfSteel,
          streamType: 'mp4',
          introStart: 0,
          introEnd: 20,
        },
      ],
    },
    {
      id: 'f1-grand-prix-demo',
      title: 'Grand Prix Racing Live Feed',
      romajiTitle: 'Supootsu Guranpuri',
      englishTitle: 'Formula Grand Prix Live Highlights',
      description: 'Cele mai spectaculoase momente din cursele auto de viteză transmise prin playerul universal Animaxia.',
      coverImage: 'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?w=600&auto=format&fit=crop&q=80',
      bannerImage: 'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?w=1600&auto=format&fit=crop&q=80',
      genres: ['Racing', 'Sport', 'Live'],
      category: 'sport',
      streamType: 'mp4',
      videoUrl: SAMPLE_VIDEOS.weAreGoingOnBullrun,
      rating: 8.8,
      totalRatings: 610,
      releaseYear: 2024,
      season: 'Primăvară',
      status: 'În difuzare',
      studio: 'Animaxia Sport',
      ageRating: 'Toate vârstele',
      featured: false,
      trendingRank: 8,
      sourceOrigin: 'demo',
      totalEpisodes: 1,
      createdAt: new Date().toISOString(),
      episodes: [
        {
          id: 'f1-ep1',
          seasonNumber: 1,
          episodeNumber: 1,
          title: 'Cursa de Calificare & Highlights',
          description: 'Depășiri spectaculoase și tururi de circuit.',
          thumbnail: 'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?w=400&auto=format&fit=crop&q=80',
          duration: '15m',
          durationSeconds: 900,
          videoUrl: SAMPLE_VIDEOS.weAreGoingOnBullrun,
          streamType: 'mp4',
          introStart: 0,
          introEnd: 15,
        },
      ],
    },
  ],
  watchHistory: [
    {
      userId: 'user-1',
      animeId: 'animaxia-hls-demo',
      episodeId: 'hls-demo-ep1',
      progressSeconds: 320,
      durationSeconds: 600,
      completed: false,
      updatedAt: new Date(Date.now() - 600000).toISOString(),
    },
    {
      userId: 'user-1',
      animeId: 'sintel',
      episodeId: 'sintel-film',
      progressSeconds: 450,
      durationSeconds: 900,
      completed: false,
      updatedAt: new Date(Date.now() - 1800000).toISOString(),
    },
  ],
  watchlist: [
    {
      userId: 'user-1',
      animeId: 'animaxia-hls-demo',
      status: 'watching',
      favorite: true,
      updatedAt: new Date().toISOString(),
    },
    {
      userId: 'user-1',
      animeId: 'sintel',
      status: 'watching',
      favorite: true,
      updatedAt: new Date().toISOString(),
    },
    {
      userId: 'user-1',
      animeId: 'big-buck-bunny',
      status: 'plan_to_watch',
      favorite: false,
      updatedAt: new Date().toISOString(),
    },
  ],
  comments: [
    {
      id: 'c-1',
      animeId: 'animaxia-hls-demo',
      userId: 'user-2',
      userName: 'Sakura_Yuki',
      userAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      content: 'Playerul HLS se mișcă incredibil de rapid! Fără buffering chiar și la 1080p.',
      isSpoiler: false,
      likes: 12,
      likedBy: ['user-1'],
      createdAt: new Date(Date.now() - 3600000).toISOString(),
    },
  ],
  socialActivity: [
    {
      id: 'act-1',
      type: 'watch',
      userId: 'user-1',
      userName: 'Alexandru Otaku',
      userAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
      animeId: 'animaxia-hls-demo',
      animeTitle: 'Animaxia HLS Demo',
      createdAt: new Date(Date.now() - 300000).toISOString(),
    },
    {
      id: 'act-2',
      type: 'comment',
      userId: 'user-2',
      userName: 'Sakura_Yuki',
      userAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      animeId: 'animaxia-hls-demo',
      animeTitle: 'Animaxia HLS Demo',
      text: 'Super rezoluție adaptivă!',
      createdAt: new Date(Date.now() - 600000).toISOString(),
    },
  ],
  userRatings: [
    {
      userId: 'user-1',
      animeId: 'animaxia-hls-demo',
      score: 8,
      updatedAt: new Date().toISOString(),
    },
  ],
  users: [
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
  ],
  settings: {
    siteName: 'Animaxia',
    announcement: 'Vizionează totul. Player universal: MP4, HLS, DASH, YouTube, iframe și miner integrat.',
    version: '3.0.0-universal',
    lastBackup: new Date().toISOString(),
  },
};

class LocalDatabase {
  private filePath: string;
  private data: DatabaseSchema;

  constructor() {
    const dataDir = path.resolve(process.cwd(), 'data');
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }
    this.filePath = path.resolve(dataDir, 'animaxia-db.json');
    this.data = this.loadDatabase();
  }

  private loadDatabase(): DatabaseSchema {
    try {
      if (fs.existsSync(this.filePath)) {
        const fileContent = fs.readFileSync(this.filePath, 'utf-8');
        const parsed = JSON.parse(fileContent);
        if (parsed && Array.isArray(parsed.animes) && parsed.animes.length > 0) {
          // Normalize category if missing
          parsed.animes.forEach((a: Anime) => {
            if (!a.category) {
              if (a.genres?.includes('Sport')) a.category = 'sport';
              else if (a.totalEpisodes > 2) a.category = 'series';
              else a.category = 'anime';
            }
          });
          if (!parsed.socialActivity) parsed.socialActivity = SEED_DATA.socialActivity;
          return parsed;
        }
      }
    } catch (err) {
      console.error('[Animaxia DB] Eroare la citire:', err);
    }

    this.saveToDisk(SEED_DATA);
    return JSON.parse(JSON.stringify(SEED_DATA));
  }

  private saveToDisk(data: DatabaseSchema) {
    try {
      const json = JSON.stringify(data, null, 2);
      fs.writeFileSync(this.filePath, json, 'utf-8');
    } catch (err) {
      console.error('[Animaxia DB] Eroare la salvare pe disc:', err);
    }
  }

  private persist() {
    this.saveToDisk(this.data);
  }

  // --- STATS & COUNTS ---
  public getCounts() {
    const totalTitles = this.data.animes.length;
    const totalMovies = this.data.animes.filter((a) => a.category === 'movie').length;
    const totalSeries = this.data.animes.filter((a) => a.category === 'series').length;
    const totalAnime = this.data.animes.filter((a) => a.category === 'anime').length;
    const totalSport = this.data.animes.filter((a) => a.category === 'sport').length;
    const totalMined = this.data.animes.filter((a) => a.category === 'mined' || a.sourceOrigin === 'miner').length;

    return {
      totalTitles,
      totalMovies,
      totalSeries,
      totalAnime,
      totalSport,
      totalMined,
    };
  }

  public getStats() {
    const counts = this.getCounts();
    const totalEpisodes = this.data.animes.reduce((acc, a) => acc + (a.episodes?.length || 0), 0);
    const totalMinutes = this.data.animes.reduce((acc, a) => {
      return acc + (a.episodes || []).reduce((epAcc, ep) => epAcc + Math.floor(ep.durationSeconds / 60), 0);
    }, 0);

    const genresSet = new Set<string>();
    this.data.animes.forEach((a) => a.genres?.forEach((g) => genresSet.add(g)));

    return {
      ...counts,
      totalEpisodes,
      totalMinutes,
      totalGenres: genresSet.size,
      totalCategories: 5,
      totalComments: this.data.comments.length,
      totalUsers: this.data.users.length,
      activeWatchHistory: this.data.watchHistory.length,
      databaseFile: this.filePath,
      fileSizeBytes: fs.existsSync(this.filePath) ? fs.statSync(this.filePath).size : 0,
      settings: this.data.settings,
    };
  }

  public getTaxonomy() {
    const yearsMap: Record<number, number> = {};
    const genresMap: Record<string, number> = {};
    const categoriesMap: Record<string, number> = {};
    const studiosMap: Record<string, number> = {};
    const franchisesMap: Record<string, number> = {};

    this.data.animes.forEach((a) => {
      if (a.releaseYear) {
        yearsMap[a.releaseYear] = (yearsMap[a.releaseYear] || 0) + 1;
      }
      if (a.category) {
        categoriesMap[a.category] = (categoriesMap[a.category] || 0) + 1;
      }
      if (a.genres) {
        a.genres.forEach((g) => {
          genresMap[g] = (genresMap[g] || 0) + 1;
        });
      }
      if (a.studio && a.studio !== 'Necunoscut') {
        studiosMap[a.studio] = (studiosMap[a.studio] || 0) + 1;
      }
      if (a.franchise) {
        franchisesMap[a.franchise] = (franchisesMap[a.franchise] || 0) + 1;
      }
    });

    const years = Object.keys(yearsMap).map(Number).sort((a, b) => b - a);
    const decades = Array.from(new Set(years.map((y) => `${Math.floor(y / 10) * 10}s`)));

    return {
      years: yearsMap,
      decades,
      genres: genresMap,
      categories: categoriesMap,
      studios: studiosMap,
      franchises: franchisesMap,
      totalExtracted: {
        titles: this.data.animes.length,
        years: Object.keys(yearsMap).length,
        genres: Object.keys(genresMap).length,
        categories: Object.keys(categoriesMap).length,
        studios: Object.keys(studiosMap).length,
        franchises: Object.keys(franchisesMap).length,
      },
    };
  }

  // --- CONTENT INGESTION & DUPLICATE CHECK ---
  public checkDuplicate(urlOrTitle: string): { isDuplicate: boolean; match?: Anime } {
    const needle = urlOrTitle.trim().toLowerCase();
    const match = this.data.animes.find((a) => {
      if (a.title.toLowerCase() === needle) return true;
      if (a.videoUrl && a.videoUrl.toLowerCase() === needle) return true;
      if (a.episodes.some((e) => e.videoUrl.toLowerCase() === needle)) return true;
      return false;
    });

    return { isDuplicate: !!match, match };
  }

  public detectStreamType(input: string): {
    streamType: StreamType;
    cleanUrl: string;
    inferredTitle: string;
    inferredCategory: ContentCategory;
    embedCode?: string;
  } {
    const trimmed = input.trim();

    // Check if iframe
    if (trimmed.startsWith('<iframe') || trimmed.includes('<iframe')) {
      const srcMatch = trimmed.match(/src=["'](.*?)["']/);
      const cleanUrl = srcMatch ? srcMatch[1] : trimmed;
      return {
        streamType: 'iframe',
        cleanUrl,
        inferredTitle: 'Video Embed Importat',
        inferredCategory: 'movie',
        embedCode: trimmed,
      };
    }

    // YouTube check
    const ytMatch = trimmed.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([\w-]{11})/);
    if (ytMatch) {
      return {
        streamType: 'youtube',
        cleanUrl: `https://www.youtube.com/embed/${ytMatch[1]}`,
        inferredTitle: `YouTube Stream [${ytMatch[1]}]`,
        inferredCategory: 'anime',
      };
    }

    // HLS .m3u8
    if (trimmed.includes('.m3u8')) {
      return {
        streamType: 'hls',
        cleanUrl: trimmed,
        inferredTitle: 'Live HLS Stream',
        inferredCategory: 'movie',
      };
    }

    // DASH .mpd
    if (trimmed.includes('.mpd')) {
      return {
        streamType: 'dash',
        cleanUrl: trimmed,
        inferredTitle: 'DASH Stream',
        inferredCategory: 'movie',
      };
    }

    // Vimeo
    if (trimmed.includes('vimeo.com')) {
      const vimeoId = trimmed.split('/').pop()?.split('?')[0];
      return {
        streamType: 'vimeo',
        cleanUrl: `https://player.vimeo.com/video/${vimeoId}`,
        inferredTitle: `Vimeo Video ${vimeoId}`,
        inferredCategory: 'movie',
      };
    }

    // Direct MP4 / WebM
    if (trimmed.includes('.mp4') || trimmed.includes('.webm')) {
      const fileName = trimmed.split('/').pop()?.split('?')[0]?.replace(/\.(mp4|webm)/i, '') || 'Video MP4';
      return {
        streamType: 'mp4',
        cleanUrl: trimmed,
        inferredTitle: decodeURIComponent(fileName).replace(/[-_+]/g, ' '),
        inferredCategory: 'movie',
      };
    }

    // Fallback embed
    return {
      streamType: 'embed',
      cleanUrl: trimmed,
      inferredTitle: 'Conținut Video Universal',
      inferredCategory: 'movie',
    };
  }

  // --- ANIMES CATALOG ---
  public getAnimes(filters?: {
    search?: string;
    genre?: string;
    category?: string;
    status?: string;
    sort?: string;
    franchise?: string;
    year?: number;
    limit?: number;
    offset?: number;
  }): { items: Anime[]; total: number } {
    let result = [...this.data.animes];

    if (filters?.search) {
      const q = filters.search.toLowerCase().trim();
      result = result.filter(
        (a) =>
          a.title.toLowerCase().includes(q) ||
          a.romajiTitle?.toLowerCase().includes(q) ||
          a.englishTitle?.toLowerCase().includes(q) ||
          a.description?.toLowerCase().includes(q) ||
          a.studio?.toLowerCase().includes(q) ||
          a.franchise?.toLowerCase().includes(q) ||
          a.genres.some((g) => g.toLowerCase().includes(q))
      );
    }

    if (filters?.genre && filters.genre !== 'Toate') {
      result = result.filter((a) =>
        a.genres.some((g) => g.toLowerCase() === filters.genre!.toLowerCase())
      );
    }

    if (filters?.category && filters.category !== 'all' && filters.category !== 'Toate') {
      result = result.filter((a) => a.category === filters.category);
    }

    if (filters?.franchise && filters.franchise !== 'Toate') {
      result = result.filter((a) => a.franchise?.toLowerCase() === filters.franchise!.toLowerCase());
    }

    if (filters?.status && filters.status !== 'Toate') {
      result = result.filter((a) => a.status === filters.status);
    }

    if (filters?.year) {
      result = result.filter((a) => a.releaseYear === filters.year);
    }

    // Sort
    if (filters?.sort) {
      switch (filters.sort) {
        case 'rating':
          result.sort((a, b) => b.rating - a.rating);
          break;
        case 'year_desc':
          result.sort((a, b) => b.releaseYear - a.releaseYear);
          break;
        case 'year_asc':
          result.sort((a, b) => a.releaseYear - b.releaseYear);
          break;
        case 'title':
          result.sort((a, b) => a.title.localeCompare(b.title));
          break;
        default:
          result.sort((a, b) => (a.trendingRank || 99) - (b.trendingRank || 99));
      }
    }

    const total = result.length;
    if (filters?.offset !== undefined || filters?.limit !== undefined) {
      const offset = filters.offset || 0;
      const limit = filters.limit || 20;
      result = result.slice(offset, offset + limit);
    }

    return { items: result, total };
  }

  public getFeaturedAnimes(): Anime[] {
    return this.data.animes.filter((a) => a.featured);
  }

  public getTrendingAnimes(): Anime[] {
    return [...this.data.animes]
      .sort((a, b) => (a.trendingRank || 99) - (b.trendingRank || 99))
      .slice(0, 10);
  }

  public getAnimeById(id: string): Anime | undefined {
    return this.data.animes.find((a) => a.id === id);
  }

  public createAnime(animeData: Partial<Anime>): Anime {
    const id =
      animeData.id ||
      animeData.title
        ?.toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, '') ||
      `animaxia-${Date.now()}`;

    const streamType = animeData.streamType || 'mp4';
    const videoUrl = animeData.videoUrl || (animeData.episodes?.[0]?.videoUrl) || SAMPLE_VIDEOS.hlsDemo;

    const episodes: Episode[] = animeData.episodes?.length
      ? animeData.episodes
      : [
          {
            id: `${id}-ep1`,
            seasonNumber: 1,
            episodeNumber: 1,
            title: 'Episodul 1 / Video Principal',
            description: animeData.description || 'Redare completă.',
            thumbnail: animeData.coverImage || 'https://images.unsplash.com/photo-1578632767115-351597cf2477?w=400&auto=format&fit=crop&q=80',
            duration: '24m',
            durationSeconds: 1440,
            videoUrl,
            streamType,
            introStart: 0,
            introEnd: 0,
          },
        ];

    const newAnime: Anime = {
      id,
      title: animeData.title || 'Conținut Nou',
      romajiTitle: animeData.romajiTitle || animeData.title || '',
      englishTitle: animeData.englishTitle || animeData.title || '',
      description: animeData.description || 'Fără descriere.',
      coverImage:
        animeData.coverImage ||
        'https://images.unsplash.com/photo-1578632767115-351597cf2477?w=600&auto=format&fit=crop&q=80',
      bannerImage:
        animeData.bannerImage ||
        animeData.coverImage ||
        'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=1600&auto=format&fit=crop&q=80',
      genres: animeData.genres?.length ? animeData.genres : ['Animation'],
      category: animeData.category || 'movie',
      streamType,
      videoUrl,
      rating: animeData.rating || 7.5,
      totalRatings: animeData.totalRatings || 1,
      releaseYear: animeData.releaseYear || 2025,
      season: animeData.season || 'Iarnă',
      status: animeData.status || 'În difuzare',
      studio: animeData.studio || 'Animaxia Studio',
      ageRating: animeData.ageRating || '13+',
      featured: !!animeData.featured,
      trendingRank: animeData.trendingRank || this.data.animes.length + 1,
      franchise: animeData.franchise,
      collection: animeData.collection,
      actors: animeData.actors || [],
      directors: animeData.directors || [],
      sourceOrigin: animeData.sourceOrigin || 'local',
      totalEpisodes: episodes.length,
      episodes,
      createdAt: new Date().toISOString(),
    };

    this.data.animes.unshift(newAnime);

    // Add to social activity
    this.addSocialActivity({
      type: 'add',
      userId: 'user-1',
      userName: 'Alexandru Otaku',
      userAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
      animeId: newAnime.id,
      animeTitle: newAnime.title,
    });

    this.persist();
    return newAnime;
  }

  public updateAnime(id: string, update: Partial<Anime>): Anime | null {
    const idx = this.data.animes.findIndex((a) => a.id === id);
    if (idx === -1) return null;

    const current = this.data.animes[idx];
    const updated = {
      ...current,
      ...update,
      totalEpisodes: update.episodes ? update.episodes.length : current.episodes.length,
    };
    this.data.animes[idx] = updated;
    this.persist();
    return updated;
  }

  public deleteAnime(id: string): boolean {
    const initialLen = this.data.animes.length;
    this.data.animes = this.data.animes.filter((a) => a.id !== id);
    this.data.comments = this.data.comments.filter((c) => c.animeId !== id);
    this.data.watchHistory = this.data.watchHistory.filter((h) => h.animeId !== id);
    this.data.watchlist = this.data.watchlist.filter((w) => w.animeId !== id);
    this.data.userRatings = this.data.userRatings.filter((r) => r.animeId !== id);
    this.persist();
    return this.data.animes.length < initialLen;
  }

  // --- EPISODES ---
  public addEpisode(animeId: string, episodeData: Partial<Episode>): Episode | null {
    const anime = this.data.animes.find((a) => a.id === animeId);
    if (!anime) return null;

    const epNumber = episodeData.episodeNumber || anime.episodes.length + 1;
    const epId = episodeData.id || `${anime.id}-ep${epNumber}`;

    const newEpisode: Episode = {
      id: epId,
      seasonNumber: episodeData.seasonNumber || 1,
      episodeNumber: epNumber,
      title: episodeData.title || `Episodul ${epNumber}`,
      romajiTitle: episodeData.romajiTitle,
      description: episodeData.description || 'Descriere episod...',
      thumbnail: episodeData.thumbnail || anime.coverImage,
      duration: episodeData.duration || '24m',
      durationSeconds: episodeData.durationSeconds || 1440,
      videoUrl: episodeData.videoUrl || SAMPLE_VIDEOS.sintel,
      streamType: episodeData.streamType || anime.streamType || 'mp4',
      introStart: episodeData.introStart || 0,
      introEnd: episodeData.introEnd || 0,
      outroStart: episodeData.outroStart,
    };

    anime.episodes.push(newEpisode);
    anime.totalEpisodes = anime.episodes.length;
    this.persist();
    return newEpisode;
  }

  // --- WATCH HISTORY ---
  public getWatchHistory(userId: string) {
    const items = this.data.watchHistory
      .filter((h) => h.userId === userId)
      .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());

    return items
      .map((item) => {
        const anime = this.data.animes.find((a) => a.id === item.animeId);
        if (!anime) return null;
        const episode = anime.episodes.find((e) => e.id === item.episodeId);
        return {
          ...item,
          animeTitle: anime.title,
          animeCover: anime.coverImage,
          animeBanner: anime.bannerImage,
          category: anime.category,
          streamType: episode?.streamType || anime.streamType || 'mp4',
          episodeTitle: episode ? episode.title : `Episod`,
          episodeNumber: episode ? episode.episodeNumber : 1,
          episodeThumbnail: episode ? episode.thumbnail : anime.coverImage,
          progressPercent: item.durationSeconds
            ? Math.min(100, Math.round((item.progressSeconds / item.durationSeconds) * 100))
            : 0,
        };
      })
      .filter(Boolean);
  }

  public saveWatchProgress(item: {
    userId: string;
    animeId: string;
    episodeId: string;
    progressSeconds: number;
    durationSeconds: number;
    completed: boolean;
  }): WatchHistoryItem {
    const idx = this.data.watchHistory.findIndex(
      (h) => h.userId === item.userId && h.animeId === item.animeId
    );

    const historyItem: WatchHistoryItem = {
      userId: item.userId,
      animeId: item.animeId,
      episodeId: item.episodeId,
      progressSeconds: item.progressSeconds,
      durationSeconds: item.durationSeconds,
      completed: item.completed,
      updatedAt: new Date().toISOString(),
    };

    if (idx >= 0) {
      this.data.watchHistory[idx] = historyItem;
    } else {
      this.data.watchHistory.unshift(historyItem);
    }

    this.persist();
    return historyItem;
  }

  public removeWatchHistory(userId: string, animeId: string) {
    this.data.watchHistory = this.data.watchHistory.filter(
      (h) => !(h.userId === userId && h.animeId === animeId)
    );
    this.persist();
  }

  public clearWatchHistory(userId: string) {
    this.data.watchHistory = this.data.watchHistory.filter((h) => h.userId !== userId);
    this.persist();
  }

  // --- WATCHLIST ---
  public getWatchlist(userId: string) {
    const list = this.data.watchlist.filter((w) => w.userId === userId);
    return list
      .map((w) => {
        const anime = this.data.animes.find((a) => a.id === w.animeId);
        if (!anime) return null;
        return {
          ...w,
          anime,
        };
      })
      .filter(Boolean);
  }

  public updateWatchlist(params: {
    userId: string;
    animeId: string;
    status?: 'watching' | 'plan_to_watch' | 'completed' | 'on_hold' | 'dropped';
    favorite?: boolean;
  }): WatchlistItem {
    const idx = this.data.watchlist.findIndex(
      (w) => w.userId === params.userId && w.animeId === params.animeId
    );

    if (idx >= 0) {
      const existing = this.data.watchlist[idx];
      this.data.watchlist[idx] = {
        ...existing,
        status: params.status !== undefined ? params.status : existing.status,
        favorite: params.favorite !== undefined ? params.favorite : existing.favorite,
        updatedAt: new Date().toISOString(),
      };
      this.persist();
      return this.data.watchlist[idx];
    } else {
      const newItem: WatchlistItem = {
        userId: params.userId,
        animeId: params.animeId,
        status: params.status || 'plan_to_watch',
        favorite: !!params.favorite,
        updatedAt: new Date().toISOString(),
      };
      this.data.watchlist.unshift(newItem);
      this.persist();
      return newItem;
    }
  }

  public removeFromWatchlist(userId: string, animeId: string) {
    this.data.watchlist = this.data.watchlist.filter(
      (w) => !(w.userId === userId && w.animeId === animeId)
    );
    this.persist();
  }

  // --- SOCIAL ACTIVITY & COMMENTS ---
  public getSocialActivity(limit = 15): SocialActivityItem[] {
    return [...this.data.socialActivity].slice(0, limit);
  }

  public addSocialActivity(activity: Omit<SocialActivityItem, 'id' | 'createdAt'>) {
    const newAct: SocialActivityItem = {
      ...activity,
      id: `act-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      createdAt: new Date().toISOString(),
    };
    this.data.socialActivity.unshift(newAct);
    if (this.data.socialActivity.length > 50) {
      this.data.socialActivity = this.data.socialActivity.slice(0, 50);
    }
    this.persist();
    return newAct;
  }

  public getComments(animeId: string): CommentItem[] {
    return this.data.comments
      .filter((c) => c.animeId === animeId)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  public addComment(comment: Omit<CommentItem, 'id' | 'likes' | 'likedBy' | 'createdAt'>): CommentItem {
    const newComment: CommentItem = {
      ...comment,
      id: `c-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      likes: 0,
      likedBy: [],
      createdAt: new Date().toISOString(),
    };
    this.data.comments.unshift(newComment);

    const anime = this.data.animes.find((a) => a.id === comment.animeId);
    if (anime) {
      this.addSocialActivity({
        type: 'comment',
        userId: comment.userId,
        userName: comment.userName,
        userAvatar: comment.userAvatar,
        animeId: anime.id,
        animeTitle: anime.title,
        text: comment.content.slice(0, 60),
      });
    }

    this.persist();
    return newComment;
  }

  public toggleLikeComment(commentId: string, userId: string): CommentItem | null {
    const comment = this.data.comments.find((c) => c.id === commentId);
    if (!comment) return null;

    const likedIndex = comment.likedBy.indexOf(userId);
    if (likedIndex >= 0) {
      comment.likedBy.splice(likedIndex, 1);
      comment.likes = Math.max(0, comment.likes - 1);
    } else {
      comment.likedBy.push(userId);
      comment.likes += 1;
    }
    this.persist();
    return comment;
  }

  // --- RATINGS ---
  public rateAnime(userId: string, animeId: string, score: number) {
    const idx = this.data.userRatings.findIndex(
      (r) => r.userId === userId && r.animeId === animeId
    );

    if (idx >= 0) {
      this.data.userRatings[idx].score = score;
      this.data.userRatings[idx].updatedAt = new Date().toISOString();
    } else {
      this.data.userRatings.push({
        userId,
        animeId,
        score,
        updatedAt: new Date().toISOString(),
      });
    }

    const anime = this.data.animes.find((a) => a.id === animeId);
    if (anime) {
      const allRatings = this.data.userRatings.filter((r) => r.animeId === animeId);
      const sum = allRatings.reduce((acc, curr) => acc + curr.score, 0);
      anime.rating = parseFloat(((anime.rating * 10 + sum) / (10 + allRatings.length)).toFixed(1));
      anime.totalRatings += 1;

      this.addSocialActivity({
        type: 'rate',
        userId,
        userName: 'Alexandru Otaku',
        userAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
        animeId: anime.id,
        animeTitle: anime.title,
        score,
      });
    }

    this.persist();
    return { score, newAverage: anime?.rating || score };
  }

  public getUserRating(userId: string, animeId: string): number | null {
    const rating = this.data.userRatings.find(
      (r) => r.userId === userId && r.animeId === animeId
    );
    return rating ? rating.score : null;
  }

  // --- USERS ---
  public getUsers(): UserProfile[] {
    return this.data.users;
  }

  // --- BACKUP & RESET ---
  public exportDatabase(): string {
    return JSON.stringify(this.data, null, 2);
  }

  public importDatabase(newData: any) {
    if (!newData || !Array.isArray(newData.animes)) {
      throw new Error('Structura fișierului JSON este invalidă.');
    }
    this.data = newData;
    this.persist();
  }

  public resetToDefault() {
    this.data = JSON.parse(JSON.stringify(SEED_DATA));
    this.persist();
  }
}

export const db = new LocalDatabase();
