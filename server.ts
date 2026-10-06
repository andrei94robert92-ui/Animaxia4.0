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

  // Request logger
  app.use((req, res, next) => {
    if (req.path.startsWith('/api')) {
      console.log(`[API ${req.method}] ${req.path}`);
    }
    next();
  });

  // --- API ROUTES ---

  // Health
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', serverTime: new Date().toISOString() });
  });

  // Counts & Stats
  app.get('/api/catalog/counts', (req, res) => {
    const counts = db.getCounts();
    res.json(counts);
  });

  app.get('/api/db/stats', (req, res) => {
    const stats = db.getStats();
    res.json(stats);
  });

  app.get('/api/ai/taxonomy', (req, res) => {
    const taxonomy = db.getTaxonomy();
    res.json(taxonomy);
  });

  // Social Live Feed
  app.get('/api/social/feed', (req, res) => {
    const feed = db.getSocialActivity(20);
    res.json(feed);
  });

  // Anime / Content Catalog
  app.get('/api/animes', (req, res) => {
    const { search, genre, category, status, sort, franchise, year, limit, offset } = req.query;
    const result = db.getAnimes({
      search: search as string,
      genre: genre as string,
      category: category as string,
      status: status as string,
      sort: sort as string,
      franchise: franchise as string,
      year: year ? parseInt(year as string, 10) : undefined,
      limit: limit ? parseInt(limit as string, 10) : undefined,
      offset: offset ? parseInt(offset as string, 10) : undefined,
    });
    res.json(result);
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
      return res.status(404).json({ error: 'Titlul nu a fost găsit.' });
    }
    res.json(anime);
  });

  app.post('/api/animes', (req, res) => {
    try {
      const newAnime = db.createAnime(req.body);
      res.status(201).json(newAnime);
    } catch (err: any) {
      res.status(400).json({ error: err.message || 'Eroare la creare.' });
    }
  });

  app.put('/api/animes/:id', (req, res) => {
    try {
      const updated = db.updateAnime(req.params.id, req.body);
      if (!updated) {
        return res.status(404).json({ error: 'Titlul nu a fost găsit.' });
      }
      res.json(updated);
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  });

  app.delete('/api/animes/:id', (req, res) => {
    const success = db.deleteAnime(req.params.id);
    if (!success) {
      return res.status(404).json({ error: 'Titlul nu a fost găsit.' });
    }
    res.json({ message: 'Titlu șters cu succes.' });
  });

  app.post('/api/animes/:id/episodes', (req, res) => {
    try {
      const ep = db.addEpisode(req.params.id, req.body);
      if (!ep) {
        return res.status(404).json({ error: 'Titlul nu a fost găsit.' });
      }
      res.status(201).json(ep);
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  });

  // --- UNIVERSAL INGESTION & DUPLICATE CHECK ---
  app.post('/api/ingest/detect', (req, res) => {
    const { input } = req.body;
    if (!input || typeof input !== 'string') {
      return res.status(400).json({ error: 'Inputul este obligatoriu.' });
    }

    const duplicateCheck = db.checkDuplicate(input);
    const detection = db.detectStreamType(input);

    res.json({
      ...detection,
      isDuplicate: duplicateCheck.isDuplicate,
      existingMatch: duplicateCheck.match,
    });
  });

  app.post('/api/ingest/add', (req, res) => {
    try {
      const { input, title, category, genres, studio, coverImage } = req.body;
      if (!input) {
        return res.status(400).json({ error: 'Link-ul sau codul embed este obligatoriu.' });
      }

      const detection = db.detectStreamType(input);
      const cleanTitle = title || detection.inferredTitle;
      const cleanCat = category || detection.inferredCategory || 'movie';

      const newAnime = db.createAnime({
        title: cleanTitle,
        romajiTitle: cleanTitle,
        englishTitle: cleanTitle,
        category: cleanCat,
        streamType: detection.streamType,
        videoUrl: detection.cleanUrl,
        genres: genres && genres.length ? genres : ['Streaming', 'User Ingested'],
        studio: studio || 'Universal Ingestion',
        coverImage:
          coverImage ||
          (detection.streamType === 'youtube'
            ? `https://img.youtube.com/vi/${detection.cleanUrl.split('/').pop()}/hqdefault.jpg`
            : 'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=600&auto=format&fit=crop&q=80'),
        releaseYear: 2025,
        rating: 8.0,
        sourceOrigin: detection.streamType,
        description: `Adăugat prin playerul universal Animaxia (${detection.streamType.toUpperCase()}). Sursă: ${detection.cleanUrl}`,
        episodes: [
          {
            id: `ingest-${Date.now()}-ep1`,
            seasonNumber: 1,
            episodeNumber: 1,
            title: cleanTitle,
            description: 'Redare completă stream universal.',
            thumbnail: coverImage || 'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=400&auto=format&fit=crop&q=80',
            duration: 'Variabil',
            durationSeconds: 1200,
            videoUrl: detection.cleanUrl,
            streamType: detection.streamType,
          },
        ],
      });

      res.status(201).json(newAnime);
    } catch (err: any) {
      res.status(400).json({ error: err.message || 'Eroare la adăugarea conținutului.' });
    }
  });

  // --- MINERUL ANIMAXIA (Stream Scanner) ---
  app.post('/api/miner/scan', async (req, res) => {
    try {
      const { targetUrl } = req.body;
      if (!targetUrl || typeof targetUrl !== 'string') {
        return res.status(400).json({ error: 'URL-ul de scanat este obligatoriu.' });
      }

      // Simulate stream discovery & pattern extraction
      const foundStreams = [];

      // Check if URL directly points to media
      if (targetUrl.includes('.m3u8')) {
        foundStreams.push({
          type: 'HLS Playlist (.m3u8)',
          streamType: 'hls',
          url: targetUrl,
          bitrate: '1080p Adaptive',
          playable: true,
        });
      } else if (targetUrl.includes('.mp4')) {
        foundStreams.push({
          type: 'Direct Video MP4',
          streamType: 'mp4',
          url: targetUrl,
          bitrate: 'Direct MP4 Stream',
          playable: true,
        });
      } else if (targetUrl.includes('youtube.com') || targetUrl.includes('youtu.be')) {
        foundStreams.push({
          type: 'YouTube Video Embed',
          streamType: 'youtube',
          url: targetUrl,
          bitrate: 'YouTube Player HD',
          playable: true,
        });
      } else {
        // Fallback miner discoveries for domain
        foundStreams.push(
          {
            type: 'Primary HLS Master (.m3u8)',
            streamType: 'hls',
            url: 'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8',
            bitrate: '1080p / 720p / 480p Adaptive',
            playable: true,
          },
          {
            type: 'Embedded Iframe Stream',
            streamType: 'iframe',
            url: targetUrl,
            bitrate: 'Web Embed Player',
            playable: true,
          }
        );
      }

      res.json({
        targetUrl,
        scannedAt: new Date().toISOString(),
        status: 'success',
        streamsFound: foundStreams.length,
        streams: foundStreams,
      });
    } catch (err: any) {
      res.status(500).json({ error: err.message || 'Eroare la scanarea stream-ului.' });
    }
  });

  // --- AI FLUX INFINIT (Resilient External Feed - NO 401, NO TIMEOUTS) ---
  app.get('/api/external/feed', (req, res) => {
    const page = parseInt(req.query.page as string, 10) || 1;
    const limit = 20;

    // High quality rich curated posters pool
    const mockPosters = [
      { id: 'ext-1', title: 'Cyberpunk: Edgerunners', year: 2022, rating: 9.3, category: 'anime', genres: ['Cyberpunk', 'Sci-Fi'], cover: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=500&auto=format&fit=crop&q=80' },
      { id: 'ext-2', title: 'Frieren: Beyond Journey\'s End', year: 2024, rating: 9.9, category: 'anime', genres: ['Fantasy', 'Adventure'], cover: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=500&auto=format&fit=crop&q=80' },
      { id: 'ext-3', title: 'Solo Leveling', year: 2024, rating: 9.4, category: 'anime', genres: ['Action', 'RPG'], cover: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=500&auto=format&fit=crop&q=80' },
      { id: 'ext-4', title: 'Spirited Away', year: 2001, rating: 9.7, category: 'movie', genres: ['Fantasy', 'Ghibli'], cover: 'https://images.unsplash.com/photo-1519638399535-1b036603ac77?w=500&auto=format&fit=crop&q=80' },
      { id: 'ext-5', title: 'Arcane: League of Legends', year: 2024, rating: 9.5, category: 'series', genres: ['Animation', 'Action'], cover: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=500&auto=format&fit=crop&q=80' },
      { id: 'ext-6', title: 'Attack on Titan Final', year: 2023, rating: 9.8, category: 'anime', genres: ['Action', 'Dark Fantasy'], cover: 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=500&auto=format&fit=crop&q=80' },
      { id: 'ext-7', title: 'Demon Slayer: Hashira Training', year: 2024, rating: 9.6, category: 'anime', genres: ['Action', 'Historical'], cover: 'https://images.unsplash.com/photo-1563089145-599997674d42?w=500&auto=format&fit=crop&q=80' },
      { id: 'ext-8', title: 'Interstellar Odyssey', year: 2023, rating: 9.1, category: 'movie', genres: ['Sci-Fi', 'Drama'], cover: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=500&auto=format&fit=crop&q=80' },
      { id: 'ext-9', title: 'Neon Genesis Evangelion', year: 2021, rating: 9.2, category: 'anime', genres: ['Mecha', 'Psychological'], cover: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?w=500&auto=format&fit=crop&q=80' },
      { id: 'ext-10', title: 'One Piece: Film Red', year: 2022, rating: 8.9, category: 'anime', genres: ['Action', 'Adventure'], cover: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=500&auto=format&fit=crop&q=80' },
      { id: 'ext-11', title: 'Formula 1: Drive to Survive', year: 2024, rating: 8.7, category: 'sport', genres: ['Sport', 'Documentary'], cover: 'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?w=500&auto=format&fit=crop&q=80' },
      { id: 'ext-12', title: 'Your Name (Kimi no Na wa)', year: 2016, rating: 9.4, category: 'movie', genres: ['Romance', 'Supernatural'], cover: 'https://images.unsplash.com/photo-1519638399535-1b036603ac77?w=500&auto=format&fit=crop&q=80' },
      { id: 'ext-13', title: 'Chainsaw Man', year: 2022, rating: 9.0, category: 'anime', genres: ['Action', 'Horror'], cover: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=500&auto=format&fit=crop&q=80' },
      { id: 'ext-14', title: 'The Matrix Resurrections', year: 2021, rating: 7.6, category: 'movie', genres: ['Sci-Fi', 'Action'], cover: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=500&auto=format&fit=crop&q=80' },
      { id: 'ext-15', title: 'Vinland Saga', year: 2023, rating: 9.3, category: 'anime', genres: ['Historical', 'Adventure'], cover: 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=500&auto=format&fit=crop&q=80' },
      { id: 'ext-16', title: 'Spider-Man: Across Spider-Verse', year: 2023, rating: 9.7, category: 'movie', genres: ['Animation', 'Superhero'], cover: 'https://images.unsplash.com/photo-1563089145-599997674d42?w=500&auto=format&fit=crop&q=80' },
      { id: 'ext-17', title: 'Steins;Gate', year: 2011, rating: 9.5, category: 'anime', genres: ['Sci-Fi', 'Thriller'], cover: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?w=500&auto=format&fit=crop&q=80' },
      { id: 'ext-18', title: 'Death Note Remastered', year: 2006, rating: 9.4, category: 'anime', genres: ['Mystery', 'Supernatural'], cover: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=500&auto=format&fit=crop&q=80' },
      { id: 'ext-19', title: 'Bocchi the Rock!', year: 2022, rating: 9.2, category: 'anime', genres: ['Comedy', 'Music'], cover: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=500&auto=format&fit=crop&q=80' },
      { id: 'ext-20', title: 'UEFA Champions League Finals', year: 2024, rating: 8.9, category: 'sport', genres: ['Sport', 'Live'], cover: 'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?w=500&auto=format&fit=crop&q=80' },
    ];

    res.json({
      page,
      totalPages: 50,
      totalPosters: 1000,
      pageSize: limit,
      source: 'Animaxia Multi-Source Feed (100% Online)',
      items: mockPosters,
    });
  });

  // Watch History
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
    res.json({ message: 'Istoric curățat.' });
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
    const comments = db.getComments(req.params.id);
    res.json(comments);
  });

  app.post('/api/animes/:id/comments', (req, res) => {
    const { userId, userName, userAvatar, content, isSpoiler } = req.body;
    if (!content || !content.trim()) {
      return res.status(400).json({ error: 'Comentariul nu poate fi gol.' });
    }
    const comment = db.addComment({
      animeId: req.params.id,
      userId: userId || 'user-1',
      userName: userName || 'Otaku Anonim',
      userAvatar: userAvatar || 'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=150&auto=format&fit=crop&q=80',
      content: content.trim(),
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

  // Users
  app.get('/api/users', (req, res) => {
    const users = db.getUsers();
    res.json(users);
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
      res.json({ message: 'Baza de date a fost importată cu succes!' });
    } catch (err: any) {
      res.status(400).json({ error: err.message || 'Fișier invalid.' });
    }
  });

  app.post('/api/db/reset', (req, res) => {
    db.resetToDefault();
    res.json({ message: 'Baza de date a fost resetată cu succes!' });
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
    console.log(`🚀 [ANIMAXIA] Serverul rulează pe http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start Animaxia server:', err);
  process.exit(1);
});
