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
  sourceOrigin?: string;
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
  animeTitle?: string;
  animeCover?: string;
  animeBanner?: string;
  category?: ContentCategory;
  streamType?: StreamType;
  episodeTitle?: string;
  episodeNumber?: number;
  episodeThumbnail?: string;
  progressPercent?: number;
}

export interface WatchlistItem {
  userId: string;
  animeId: string;
  status: 'watching' | 'plan_to_watch' | 'completed' | 'on_hold' | 'dropped';
  favorite: boolean;
  updatedAt: string;
  anime?: Anime;
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

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  avatar: string;
  tag: string;
  role: 'admin' | 'user' | 'vip';
  joinedDate: string;
}

export interface CatalogCounts {
  totalTitles: number;
  totalMovies: number;
  totalSeries: number;
  totalAnime: number;
  totalSport: number;
  totalMined: number;
}

export interface DatabaseStats extends CatalogCounts {
  totalEpisodes: number;
  totalMinutes: number;
  totalGenres: number;
  totalCategories: number;
  totalComments: number;
  totalUsers: number;
  activeWatchHistory: number;
  databaseFile: string;
  fileSizeBytes: number;
  settings: {
    siteName: string;
    announcement: string;
    version: string;
    lastBackup: string;
  };
}

export interface TaxonomyData {
  years: Record<number, number>;
  decades: string[];
  genres: Record<string, number>;
  categories: Record<string, number>;
  studios: Record<string, number>;
  franchises: Record<string, number>;
  totalExtracted: {
    titles: number;
    years: number;
    genres: number;
    categories: number;
    studios: number;
    franchises: number;
  };
}

export interface ExternalPoster {
  id: string;
  title: string;
  year: number;
  rating: number;
  category: string;
  genres: string[];
  cover: string;
}
