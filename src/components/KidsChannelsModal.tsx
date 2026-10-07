import React, { useState, useEffect } from 'react';
import {
  X, Tv, Play, Radio, Sparkles, Volume2, Maximize,
  Clock, Shield, Star, RefreshCw, CheckCircle2, Film
} from 'lucide-react';
import { Anime } from '../types/anime';

interface KidsChannelsModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedChannelName?: string;
  onPlayStream: (anime: Anime) => void;
}

interface KidsChannel {
  id: string;
  name: string;
  category: string;
  badge: string;
  color: string;
  currentShow: string;
  nextShow: string;
  description: string;
  streamUrl: string;
  streamType: 'hls' | 'mp4' | 'youtube';
  thumbnail: string;
  ageRating: string;
}

const KIDS_CHANNELS: KidsChannel[] = [
  {
    id: 'jetix',
    name: 'Jetix',
    category: 'Acțiune & Nostalgie',
    badge: '⚡ Jetix Retro',
    color: 'from-amber-600 to-red-600',
    currentShow: 'Galactik Football — Finala Cupa Genesis',
    nextShow: 'Shaman King — Turneul Șamanilor',
    description: 'Canalul legendar de acțiune și animație retro. Eroi cosmici, mecha și aventuri clasice non-stop.',
    streamUrl: 'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8',
    streamType: 'hls',
    thumbnail: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?w=600&auto=format&fit=crop&q=80',
    ageRating: '7+',
  },
  {
    id: 'fox-kids',
    name: 'Fox Kids',
    category: 'Clasici Anii 90/2000',
    badge: '🦊 Fox Kids Classic',
    color: 'from-orange-600 to-amber-600',
    currentShow: 'X-Men Animated Series — Saga Phoenix',
    nextShow: 'Viața cu Louie — Episodul de Crăciun',
    description: 'Generația de aur a desenelor animate. Supereroi Marvel clasici și comedii de neuitat.',
    streamUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
    streamType: 'mp4',
    thumbnail: 'https://images.unsplash.com/photo-1563089145-599997674d42?w=600&auto=format&fit=crop&q=80',
    ageRating: 'Toate vârstele',
  },
  {
    id: 'cartoon-network',
    name: 'Cartoon Network',
    category: 'Animație & Umor',
    badge: '📺 Cartoon Network',
    color: 'from-neutral-900 to-cyan-700',
    currentShow: 'Laboratorul lui Dexter — Mașina Timpului',
    nextShow: 'Samurai Jack — Înfruntarea cu Aku',
    description: 'Cele mai inventive și celebre animații internaționale. De la Dexter la Ben 10 și Curaj Câinele Fricos.',
    streamUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4',
    streamType: 'mp4',
    thumbnail: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=600&auto=format&fit=crop&q=80',
    ageRating: '6+',
  },
  {
    id: 'disney-channel',
    name: 'Disney Channel',
    category: 'Disney Magic',
    badge: '🪄 Disney Channel',
    color: 'from-blue-600 to-indigo-600',
    currentShow: 'Phineas și Ferb — Cea mai lungă zi de vară',
    nextShow: 'Kim Possible — Misiunea Finală',
    description: 'Magia desenelor clasice Disney, aventuri inteligente și muzică de neuitat pentru întreaga familie.',
    streamUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4',
    streamType: 'mp4',
    thumbnail: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=600&auto=format&fit=crop&q=80',
    ageRating: 'Toate vârstele',
  },
  {
    id: 'boomerang',
    name: 'Boomerang',
    category: 'Epoca de Aur Hanna-Barbera',
    badge: '🪃 Boomerang HD',
    color: 'from-emerald-600 to-teal-700',
    currentShow: 'Tom și Jerry — Cursa spre Marte',
    nextShow: 'Scooby-Doo — Misterul de pe Insula Morților',
    description: 'Desenele animate nemuritoare care nu se demodează niciodată. Tom & Jerry, Pantera Roz și Scooby-Doo.',
    streamUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
    streamType: 'mp4',
    thumbnail: 'https://images.unsplash.com/photo-1519638399535-1b036603ac77?w=600&auto=format&fit=crop&q=80',
    ageRating: 'Toate vârstele',
  },
  {
    id: 'minimax',
    name: 'Minimax',
    category: 'Educație & Povești',
    badge: '🎈 Minimax Kids',
    color: 'from-green-600 to-emerald-700',
    currentShow: 'Babar — Regele Elefanților',
    nextShow: 'Franklin și Prietenii Săi',
    description: 'Povești calde, pline de învățături frumoase și prietenie, ideale pentru cei mici și nostalgici.',
    streamUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    streamType: 'mp4',
    thumbnail: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=600&auto=format&fit=crop&q=80',
    ageRating: '0+',
  },
  {
    id: 'nickelodeon',
    name: 'Nickelodeon',
    category: 'Aventură & Slime',
    badge: '🧽 Nickelodeon HD',
    color: 'from-orange-500 to-amber-600',
    currentShow: 'Avatar: Legenda lui Aang — Asediul Nordului',
    nextShow: 'SpongeBob Pantaloni Pătrați — Krabby Patty Secret',
    description: 'Unul dintre cele mai iubite posturi TV pentru copii și tineri, cu hituri legendare precum Avatar și SpongeBob.',
    streamUrl: 'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8',
    streamType: 'hls',
    thumbnail: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=600&auto=format&fit=crop&q=80',
    ageRating: '6+',
  },
  {
    id: 'nicktoons',
    name: 'Nicktoons',
    category: 'Animație Dinamică',
    badge: '🛸 Nicktoons 24/7',
    color: 'from-purple-600 to-pink-600',
    currentShow: 'Danny Phantom — Tărâmul Fantomelor',
    nextShow: 'Țestoasele Ninja — Mutagen Mayhem',
    description: 'Non-stop animații din universul Nickelodeon, meciuri spectaculoase și aventuri de noapte.',
    streamUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
    streamType: 'mp4',
    thumbnail: 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=600&auto=format&fit=crop&q=80',
    ageRating: '7+',
  },
];

export const KidsChannelsModal: React.FC<KidsChannelsModalProps> = ({
  isOpen,
  onClose,
  selectedChannelName,
  onPlayStream,
}) => {
  const [activeChannelId, setActiveChannelId] = useState<string>(() => {
    if (selectedChannelName) {
      const match = KIDS_CHANNELS.find((c) =>
        c.name.toLowerCase().includes(selectedChannelName.toLowerCase())
      );
      if (match) return match.id;
    }
    return KIDS_CHANNELS[0].id;
  });

  useEffect(() => {
    if (selectedChannelName) {
      const match = KIDS_CHANNELS.find((c) =>
        c.name.toLowerCase().includes(selectedChannelName.toLowerCase())
      );
      if (match) setActiveChannelId(match.id);
    }
  }, [selectedChannelName]);

  const [crtEffect, setCrtEffect] = useState(false);

  if (!isOpen) return null;

  const currentChannel = KIDS_CHANNELS.find((c) => c.id === activeChannelId) || KIDS_CHANNELS[0];

  const handleLaunchChannelInPlayer = () => {
    const syntheticAnime: Anime = {
      id: `live-channel-${currentChannel.id}`,
      title: `${currentChannel.name} HD Live`,
      romajiTitle: currentChannel.currentShow,
      englishTitle: `${currentChannel.name} Universal Live Stream`,
      description: currentChannel.description,
      coverImage: currentChannel.thumbnail,
      bannerImage: currentChannel.thumbnail,
      genres: ['Canale Live', 'Kids', 'Animație Clasică', currentChannel.category],
      category: 'series',
      rating: 9.8,
      totalRatings: 3400,
      releaseYear: 2025,
      season: 'Iarnă',
      status: 'În difuzare',
      studio: currentChannel.name,
      ageRating: currentChannel.ageRating,
      featured: true,
      totalEpisodes: 1,
      streamType: currentChannel.streamType,
      videoUrl: currentChannel.streamUrl,
      episodes: [
        {
          id: `ep-${currentChannel.id}-live`,
          seasonNumber: 1,
          episodeNumber: 1,
          title: currentChannel.currentShow,
          description: `Emisiune curentă pe ${currentChannel.name}. Urmează: ${currentChannel.nextShow}`,
          thumbnail: currentChannel.thumbnail,
          duration: 'Live TV',
          durationSeconds: 3600,
          videoUrl: currentChannel.streamUrl,
          streamType: currentChannel.streamType,
        },
      ],
      createdAt: new Date().toISOString(),
    };

    onPlayStream(syntheticAnime);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-neutral-950/90 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl bg-neutral-900 border border-neutral-800 rounded-3xl overflow-hidden shadow-2xl flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="p-4 sm:p-5 bg-gradient-to-r from-rose-950 via-neutral-900 to-amber-950/80 border-b border-neutral-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-rose-600 to-amber-500 flex items-center justify-center shadow-lg shadow-rose-600/30">
              <Tv className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-black text-white font-['Space_Grotesk'] tracking-wide">
                  CANALE TV KIDS &amp; ANIMAȚIE CLASICĂ
                </h2>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 animate-pulse">
                  ● LIVE
                </span>
              </div>
              <p className="text-xs text-neutral-400">
                Jetix, Fox Kids, Cartoon Network, Disney, Boomerang, Minimax &amp; Nickelodeon
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setCrtEffect(!crtEffect)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition cursor-pointer hidden sm:flex items-center gap-1.5 ${
                crtEffect
                  ? 'bg-amber-500/20 border-amber-500/40 text-amber-300'
                  : 'bg-neutral-800 border-neutral-700 text-neutral-400 hover:text-white'
              }`}
              title="Comută efect nostalgic retro TV CRT"
            >
              <span>📺 Retro CRT</span>
            </button>
            <button
              onClick={onClose}
              className="w-9 h-9 rounded-full bg-neutral-800/80 hover:bg-neutral-700 text-neutral-400 hover:text-white flex items-center justify-center border border-neutral-700 transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Channels Selector Pills */}
        <div className="p-3 bg-neutral-950/70 border-b border-neutral-800 overflow-x-auto flex items-center gap-2 scrollbar-none">
          {KIDS_CHANNELS.map((ch) => {
            const isSelected = ch.id === currentChannel.id;
            return (
              <button
                key={ch.id}
                onClick={() => setActiveChannelId(ch.id)}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition cursor-pointer flex items-center gap-2 ${
                  isSelected
                    ? 'bg-rose-600 text-white shadow-lg shadow-rose-600/30 border border-rose-500'
                    : 'bg-neutral-900 text-neutral-400 hover:text-white hover:bg-neutral-800 border border-neutral-800'
                }`}
              >
                <span>{ch.name}</span>
                <span className="text-[10px] opacity-75 font-mono">({ch.ageRating})</span>
              </button>
            );
          })}
        </div>

        {/* Content Body: Video Screen & Schedule */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-6 flex-1">
          {/* Virtual TV Screen */}
          <div className="relative aspect-video w-full rounded-2xl overflow-hidden bg-black border-2 border-neutral-800 shadow-2xl group">
            {/* CRT scanline simulation if enabled */}
            {crtEffect && (
              <div
                className="absolute inset-0 pointer-events-none z-20 opacity-30 mix-blend-overlay"
                style={{
                  backgroundImage:
                    'repeating-linear-gradient(0deg, rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.4) 1px, transparent 1px, transparent 3px)',
                }}
              />
            )}

            <video
              src={currentChannel.streamUrl}
              autoPlay
              muted
              loop
              playsInline
              className="w-full h-full object-cover"
              poster={currentChannel.thumbnail}
            />

            {/* Top On-Screen Overlay Bar */}
            <div className="absolute top-4 left-4 right-4 z-30 flex items-center justify-between pointer-events-none">
              <div className="flex items-center gap-2">
                <span className={`px-2.5 py-1 rounded-lg text-xs font-black uppercase text-white shadow bg-gradient-to-r ${currentChannel.color}`}>
                  {currentChannel.name}
                </span>
                <span className="bg-red-600 text-white font-mono text-[10px] font-bold px-2 py-0.5 rounded shadow flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-white animate-ping" />
                  LIVE
                </span>
              </div>

              <span className="bg-black/80 backdrop-blur-md text-amber-300 font-mono text-xs px-2.5 py-1 rounded-lg border border-neutral-800">
                HD 1080p · 60 FPS
              </span>
            </div>

            {/* Bottom Play Action Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-transparent to-transparent flex items-end p-6 z-25">
              <div className="w-full flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4">
                <div>
                  <span className="text-[11px] font-bold text-rose-400 uppercase tracking-wider">
                    În acest moment la TV:
                  </span>
                  <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight drop-shadow">
                    {currentChannel.currentShow}
                  </h3>
                  <p className="text-xs text-neutral-300 mt-0.5 flex items-center gap-2">
                    <Clock className="w-3.5 h-3.5 text-neutral-400" />
                    <span>Urmează la emisie: {currentChannel.nextShow}</span>
                  </p>
                </div>

                <button
                  onClick={handleLaunchChannelInPlayer}
                  className="px-6 py-3 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs uppercase tracking-wider flex items-center gap-2 shadow-xl shadow-rose-600/40 hover:scale-105 active:scale-95 transition cursor-pointer shrink-0"
                >
                  <Play className="w-4 h-4 fill-white" />
                  <span>Deschide în Player Universal</span>
                </button>
              </div>
            </div>
          </div>

          {/* Channel Guide & Details Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-neutral-950/60 rounded-2xl border border-neutral-800 space-y-1">
              <span className="text-[10px] font-bold text-neutral-500 uppercase">Categorie canal</span>
              <p className="text-sm font-bold text-white">{currentChannel.category}</p>
              <p className="text-xs text-neutral-400">{currentChannel.description}</p>
            </div>

            <div className="p-4 bg-neutral-950/60 rounded-2xl border border-neutral-800 space-y-1">
              <span className="text-[10px] font-bold text-neutral-500 uppercase">Ghid Emisie Curent</span>
              <p className="text-xs font-semibold text-rose-300">● {currentChannel.currentShow}</p>
              <p className="text-xs text-neutral-400">⏭️ {currentChannel.nextShow}</p>
            </div>

            <div className="p-4 bg-neutral-950/60 rounded-2xl border border-neutral-800 space-y-2 flex flex-col justify-between">
              <div>
                <span className="text-[10px] font-bold text-neutral-500 uppercase">Calitate &amp; Vârstă</span>
                <p className="text-xs font-semibold text-white">Stream adaptiv HLS / MP4 Direct</p>
                <p className="text-xs text-amber-300 font-mono">Recomandat: {currentChannel.ageRating}</p>
              </div>
              <button
                onClick={handleLaunchChannelInPlayer}
                className="w-full py-2 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-200 text-xs font-bold transition cursor-pointer"
              >
                Urmărește pe tot ecranul
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
