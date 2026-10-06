import { Anime, Episode, WatchHistoryItem, WatchlistItem, CommentItem, UserProfile, DatabaseStats } from '../types/anime';

const BASE_URL = '/api';

export const api = {
  // Stats & Health
  async getHealth() {
    const res = await fetch(`${BASE_URL}/health`);
    return res.json();
  },

  async getDbStats(): Promise<DatabaseStats> {
    const res = await fetch(`${BASE_URL}/db/stats`);
    if (!res.ok) throw new Error('Nu s-au putut obține statisticile bazei de date.');
    return res.json();
  },

  // Animes
  async getAnimes(params?: {
    search?: string;
    genre?: string;
    status?: string;
    sort?: string;
    season?: string;
    year?: number;
  }): Promise<Anime[]> {
    const url = new URL(`${window.location.origin}${BASE_URL}/animes`);
    if (params) {
      Object.entries(params).forEach(([key, val]) => {
        if (val !== undefined && val !== null && val !== '') {
          url.searchParams.append(key, String(val));
        }
      });
    }
    const res = await fetch(url.toString());
    if (!res.ok) throw new Error('Eroare la încărcarea anime-urilor.');
    return res.json();
  },

  async getFeaturedAnimes(): Promise<Anime[]> {
    const res = await fetch(`${BASE_URL}/animes/featured`);
    if (!res.ok) throw new Error('Eroare la obținerea titlurilor recomandate.');
    return res.json();
  },

  async getTrendingAnimes(): Promise<Anime[]> {
    const res = await fetch(`${BASE_URL}/animes/trending`);
    if (!res.ok) throw new Error('Eroare la obținerea anime-urilor populare.');
    return res.json();
  },

  async getAnimeById(id: string): Promise<Anime> {
    const res = await fetch(`${BASE_URL}/animes/${id}`);
    if (!res.ok) throw new Error('Anime-ul nu a fost găsit.');
    return res.json();
  },

  async createAnime(anime: Partial<Anime>): Promise<Anime> {
    const res = await fetch(`${BASE_URL}/animes`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(anime),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || 'Eroare la adăugarea anime-ului.');
    }
    return res.json();
  },

  async updateAnime(id: string, anime: Partial<Anime>): Promise<Anime> {
    const res = await fetch(`${BASE_URL}/animes/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(anime),
    });
    if (!res.ok) throw new Error('Eroare la actualizarea anime-ului.');
    return res.json();
  },

  async deleteAnime(id: string): Promise<void> {
    const res = await fetch(`${BASE_URL}/animes/${id}`, {
      method: 'DELETE',
    });
    if (!res.ok) throw new Error('Eroare la ștergerea anime-ului.');
  },

  // Episodes
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

  async updateEpisode(animeId: string, episodeId: string, episode: Partial<Episode>): Promise<Episode> {
    const res = await fetch(`${BASE_URL}/animes/${animeId}/episodes/${episodeId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(episode),
    });
    if (!res.ok) throw new Error('Eroare la actualizarea episodului.');
    return res.json();
  },

  async deleteEpisode(animeId: string, episodeId: string): Promise<void> {
    const res = await fetch(`${BASE_URL}/animes/${animeId}/episodes/${episodeId}`, {
      method: 'DELETE',
    });
    if (!res.ok) throw new Error('Eroare la ștergerea episodului.');
  },

  // Watch History
  async getHistory(userId = 'user-1'): Promise<WatchHistoryItem[]> {
    const res = await fetch(`${BASE_URL}/history?userId=${encodeURIComponent(userId)}`);
    if (!res.ok) throw new Error('Eroare la încărcarea istoricului.');
    return res.json();
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
    });
    if (!res.ok) throw new Error('Eroare la salvarea progresului.');
    return res.json();
  },

  async removeHistoryItem(animeId: string, userId = 'user-1'): Promise<void> {
    const res = await fetch(`${BASE_URL}/history/${animeId}?userId=${encodeURIComponent(userId)}`, {
      method: 'DELETE',
    });
    if (!res.ok) throw new Error('Eroare la ștergerea din istoric.');
  },

  async clearHistory(userId = 'user-1'): Promise<void> {
    const res = await fetch(`${BASE_URL}/history?userId=${encodeURIComponent(userId)}`, {
      method: 'DELETE',
    });
    if (!res.ok) throw new Error('Eroare la curățarea istoricului.');
  },

  // Watchlist
  async getWatchlist(userId = 'user-1'): Promise<WatchlistItem[]> {
    const res = await fetch(`${BASE_URL}/watchlist?userId=${encodeURIComponent(userId)}`);
    if (!res.ok) throw new Error('Eroare la încărcarea listei de vizionare.');
    return res.json();
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
    });
    if (!res.ok) throw new Error('Eroare la actualizarea listei.');
    return res.json();
  },

  async removeFromWatchlist(animeId: string, userId = 'user-1'): Promise<void> {
    const res = await fetch(`${BASE_URL}/watchlist/${animeId}?userId=${encodeURIComponent(userId)}`, {
      method: 'DELETE',
    });
    if (!res.ok) throw new Error('Eroare la eliminarea din listă.');
  },

  // Ratings
  async rateAnime(animeId: string, score: number, userId = 'user-1'): Promise<{ score: number; newAverage: number }> {
    const res = await fetch(`${BASE_URL}/animes/${animeId}/rate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ score, userId }),
    });
    if (!res.ok) throw new Error('Eroare la salvarea notei.');
    return res.json();
  },

  async getMyRating(animeId: string, userId = 'user-1'): Promise<number | null> {
    const res = await fetch(`${BASE_URL}/animes/${animeId}/my-rating?userId=${encodeURIComponent(userId)}`);
    if (!res.ok) return null;
    const data = await res.json();
    return data.rating;
  },

  // Comments
  async getComments(animeId: string, episodeId?: string): Promise<CommentItem[]> {
    const url = new URL(`${window.location.origin}${BASE_URL}/animes/${animeId}/comments`);
    if (episodeId) url.searchParams.append('episodeId', episodeId);
    const res = await fetch(url.toString());
    if (!res.ok) throw new Error('Eroare la încărcarea comentariilor.');
    return res.json();
  },

  async addComment(
    animeId: string,
    comment: {
      userId: string;
      userName: string;
      userAvatar: string;
      content: string;
      episodeId?: string;
      timestampVideo?: number;
      isSpoiler?: boolean;
    }
  ): Promise<CommentItem> {
    const res = await fetch(`${BASE_URL}/animes/${animeId}/comments`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(comment),
    });
    if (!res.ok) throw new Error('Eroare la adăugarea comentariului.');
    return res.json();
  },

  async toggleLikeComment(commentId: string, userId = 'user-1'): Promise<CommentItem> {
    const res = await fetch(`${BASE_URL}/comments/${commentId}/like`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId }),
    });
    if (!res.ok) throw new Error('Eroare la aprecierea comentariului.');
    return res.json();
  },

  async deleteComment(commentId: string): Promise<void> {
    const res = await fetch(`${BASE_URL}/comments/${commentId}`, {
      method: 'DELETE',
    });
    if (!res.ok) throw new Error('Eroare la ștergerea comentariului.');
  },

  // Users
  async getUsers(): Promise<UserProfile[]> {
    const res = await fetch(`${BASE_URL}/users`);
    if (!res.ok) throw new Error('Eroare la obținerea utilizatorilor.');
    return res.json();
  },

  // DB Backup & Reset
  exportDbUrl(): string {
    return `${BASE_URL}/db/export`;
  },

  async importDb(data: any): Promise<void> {
    const res = await fetch(`${BASE_URL}/db/import`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || 'Eroare la importarea bazei de date.');
    }
  },

  async resetDb(): Promise<void> {
    const res = await fetch(`${BASE_URL}/db/reset`, {
      method: 'POST',
    });
    if (!res.ok) throw new Error('Eroare la resetarea bazei de date.');
  },
};
