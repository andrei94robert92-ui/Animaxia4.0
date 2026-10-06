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
  rating: number;
  totalRatings: number;
  releaseYear: number;
  season: 'Iarnă' | 'Primăvară' | 'Vară' | 'Toamnă';
  status: 'În difuzare' | 'Finalizat' | 'În curând';
  studio: string;
  ageRating: string;
  featured: boolean;
  trendingRank?: number;
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

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  avatar: string;
  tag: string;
  role: 'admin' | 'user' | 'vip';
  joinedDate: string;
}

export interface DatabaseStats {
  totalAnimes: number;
  totalEpisodes: number;
  totalMinutes: number;
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
