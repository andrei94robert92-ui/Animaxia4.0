import express from 'express';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { db } from './server/db.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;
  const isProduction = process.env.NODE_ENV === 'production';

  app.use(express.json({ limit: '50mb' }));
  app.use(express.urlencoded({ extended: true, limit: '50mb' }));

  // Request logger for local debugging
  app.use((req, res, next) => {
    if (req.path.startsWith('/api')) {
      console.log(`[API ${req.method}] ${req.path}`);
    }
    next();
  });

  // --- API ROUTES ---

  // Health / Stats
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', serverTime: new Date().toISOString() });
  });

  app.get('/api/db/stats', (req, res) => {
    const stats = db.getStats();
    res.json(stats);
  });

  // Anime catalog
  app.get('/api/animes', (req, res) => {
    const { search, genre, status, sort, season, year } = req.query;
    const animes = db.getAnimes({
      search: search as string,
      genre: genre as string,
      status: status as string,
      sort: sort as string,
      season: season as string,
      year: year ? parseInt(year as string, 10) : undefined,
    });
    res.json(animes);
  });

  app.get('/api/animes/featured', (req, res) => {
    const featured = db.getFeaturedAnimes();
    res.json(featured);
  });

  app.get('/api/animes/trending', (req, res) => {
    const trending = db.getTrendingAnimes();
    res.json(trending);
  });

  app.get('/api/animes/:id', (req, res) => {
    const anime = db.getAnimeById(req.params.id);
    if (!anime) {
      return res.status(404).json({ error: 'Anime-ul nu a fost găsit.' });
    }
    res.json(anime);
  });

  app.post('/api/animes', (req, res) => {
    try {
      const newAnime = db.createAnime(req.body);
      res.status(201).json(newAnime);
    } catch (err: any) {
      res.status(400).json({ error: err.message || 'Eroare la crearea anime-ului.' });
    }
  });

  app.put('/api/animes/:id', (req, res) => {
    try {
      const updated = db.updateAnime(req.params.id, req.body);
      if (!updated) {
        return res.status(404).json({ error: 'Anime-ul nu a fost găsit.' });
      }
      res.json(updated);
    } catch (err: any) {
      res.status(400).json({ error: err.message || 'Eroare la actualizarea anime-ului.' });
    }
  });

  app.delete('/api/animes/:id', (req, res) => {
    const success = db.deleteAnime(req.params.id);
    if (!success) {
      return res.status(404).json({ error: 'Anime-ul nu a fost găsit.' });
    }
    res.json({ message: 'Anime șters cu succes.' });
  });

  // Episodes
  app.post('/api/animes/:id/episodes', (req, res) => {
    try {
      const episode = db.addEpisode(req.params.id, req.body);
      if (!episode) {
        return res.status(404).json({ error: 'Anime-ul nu a fost găsit.' });
      }
      res.status(201).json(episode);
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  });

  app.put('/api/animes/:id/episodes/:episodeId', (req, res) => {
    try {
      const updated = db.updateEpisode(req.params.id, req.params.episodeId, req.body);
      if (!updated) {
        return res.status(404).json({ error: 'Episodul nu a fost găsit.' });
      }
      res.json(updated);
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  });

  app.delete('/api/animes/:id/episodes/:episodeId', (req, res) => {
    const success = db.deleteEpisode(req.params.id, req.params.episodeId);
    if (!success) {
      return res.status(404).json({ error: 'Episodul nu a fost găsit.' });
    }
    res.json({ message: 'Episod șters cu succes.' });
  });

  // Watch History & Progress
  app.get('/api/history', (req, res) => {
    const userId = (req.query.userId as string) || 'user-1';
    const history = db.getWatchHistory(userId);
    res.json(history);
  });

  app.post('/api/history', (req, res) => {
    const { userId, animeId, episodeId, progressSeconds, durationSeconds, completed } = req.body;
    if (!animeId || !episodeId) {
      return res.status(400).json({ error: 'animeId și episodeId sunt obligatorii.' });
    }
    const item = db.saveWatchProgress({
      userId: userId || 'user-1',
      animeId,
      episodeId,
      progressSeconds: progressSeconds || 0,
      durationSeconds: durationSeconds || 0,
      completed: !!completed,
    });
    res.json(item);
  });

  app.delete('/api/history/:animeId', (req, res) => {
    const userId = (req.query.userId as string) || 'user-1';
    db.removeWatchHistory(userId, req.params.animeId);
    res.json({ message: 'Istoric eliminat.' });
  });

  app.delete('/api/history', (req, res) => {
    const userId = (req.query.userId as string) || 'user-1';
    db.clearWatchHistory(userId);
    res.json({ message: 'Tot istoricul a fost curățat.' });
  });

  // Watchlist
  app.get('/api/watchlist', (req, res) => {
    const userId = (req.query.userId as string) || 'user-1';
    const list = db.getWatchlist(userId);
    res.json(list);
  });

  app.post('/api/watchlist', (req, res) => {
    const { userId, animeId, status, favorite } = req.body;
    if (!animeId) {
      return res.status(400).json({ error: 'animeId este obligatoriu.' });
    }
    const item = db.updateWatchlist({
      userId: userId || 'user-1',
      animeId,
      status,
      favorite,
    });
    res.json(item);
  });

  app.delete('/api/watchlist/:animeId', (req, res) => {
    const userId = (req.query.userId as string) || 'user-1';
    db.removeFromWatchlist(userId, req.params.animeId);
    res.json({ message: 'Eliminat din listă.' });
  });

  // Ratings
  app.post('/api/animes/:id/rate', (req, res) => {
    const userId = (req.body.userId as string) || 'user-1';
    const score = Number(req.body.score);
    if (!score || score < 1 || score > 10) {
      return res.status(400).json({ error: 'Scorul trebuie să fie între 1 și 10.' });
    }
    const result = db.rateAnime(userId, req.params.id, score);
    res.json(result);
  });

  app.get('/api/animes/:id/my-rating', (req, res) => {
    const userId = (req.query.userId as string) || 'user-1';
    const rating = db.getUserRating(userId, req.params.id);
    res.json({ rating });
  });

  // Comments
  app.get('/api/animes/:id/comments', (req, res) => {
    const episodeId = req.query.episodeId as string | undefined;
    const comments = db.getComments(req.params.id, episodeId);
    res.json(comments);
  });

  app.post('/api/animes/:id/comments', (req, res) => {
    const { userId, userName, userAvatar, content, episodeId, timestampVideo, isSpoiler } = req.body;
    if (!content || !content.trim()) {
      return res.status(400).json({ error: 'Comentariul nu poate fi gol.' });
    }
    const comment = db.addComment({
      animeId: req.params.id,
      episodeId,
      userId: userId || 'user-1',
      userName: userName || 'Otaku Anonim',
      userAvatar: userAvatar || 'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=150&auto=format&fit=crop&q=80',
      content: content.trim(),
      timestampVideo,
      isSpoiler: !!isSpoiler,
    });
    res.status(201).json(comment);
  });

  app.post('/api/comments/:commentId/like', (req, res) => {
    const userId = (req.body.userId as string) || 'user-1';
    const updated = db.toggleLikeComment(req.params.commentId, userId);
    if (!updated) {
      return res.status(404).json({ error: 'Comentariul nu a fost găsit.' });
    }
    res.json(updated);
  });

  app.delete('/api/comments/:commentId', (req, res) => {
    const success = db.deleteComment(req.params.commentId);
    if (!success) {
      return res.status(404).json({ error: 'Comentariul nu a fost găsit.' });
    }
    res.json({ message: 'Comentariu șters.' });
  });

  // Users / Profiles
  app.get('/api/users', (req, res) => {
    const users = db.getUsers();
    res.json(users);
  });

  app.post('/api/users', (req, res) => {
    const newUser = db.createUser(req.body);
    res.status(201).json(newUser);
  });

  // DB Backup & Reset
  app.get('/api/db/export', (req, res) => {
    const rawData = db.exportDatabase();
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Content-Disposition', 'attachment; filename="animaxia-database-backup.json"');
    res.send(rawData);
  });

  app.post('/api/db/import', (req, res) => {
    try {
      db.importDatabase(req.body);
      res.json({ message: 'Baza de date locală a fost importată cu succes!' });
    } catch (err: any) {
      res.status(400).json({ error: err.message || 'Fișier JSON invalid.' });
    }
  });

  app.post('/api/db/reset', (req, res) => {
    db.resetToDefault();
    res.json({ message: 'Baza de date a fost resetată la starea inițială cu succes!' });
  });

  // --- VITE MIDDLEWARE OR STATIC SERVING ---
  if (!isProduction) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    if (fs.existsSync(distPath)) {
      app.use(express.static(distPath));
      app.get('*', (req, res) => {
        res.sendFile(path.resolve(distPath, 'index.html'));
      });
    }
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 [Animaxia Backend] Serverul rulează pe http://0.0.0.0:${PORT}`);
    console.log(`📁 [Animaxia DB] Baza de date locală este activă în ./data/animaxia-db.json`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start Animaxia server:', err);
  process.exit(1);
});
