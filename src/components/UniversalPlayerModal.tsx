import React, { useState, useRef, useEffect, useMemo, useCallback } from 'react';
import {
  Play, Pause, Volume2, VolumeX, Maximize, Minimize, RotateCcw,
  RotateCw, FastForward, Settings, ListVideo, X, Check,
  SkipForward, SkipBack, PictureInPicture, ExternalLink, ShieldCheck,
  Sparkles, SlidersHorizontal, Info, Tv, Download
} from 'lucide-react';
import Hls from 'hls.js';
import { Anime, Episode } from '../types/anime';
import { api } from '../services/api';

interface UniversalPlayerModalProps {
  anime: Anime;
  initialEpisodeIndex?: number;
  initialProgressSeconds?: number;
  onClose: () => void;
  userId?: string;
  onProgressSaved?: () => void;
}

interface StreamQuality {
  index: number;
  label: string;
  height?: number;
  bitrate?: number;
}

export const UniversalPlayerModal: React.FC<UniversalPlayerModalProps> = ({
  anime,
  initialEpisodeIndex = 0,
  initialProgressSeconds = 0,
  onClose,
  userId = 'user-1',
  onProgressSaved,
}) => {
  const [currentEpisodeIndex, setCurrentEpisodeIndex] = useState(initialEpisodeIndex);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [bufferedPercent, setBufferedPercent] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [showControls, setShowControls] = useState(true);
  const [showSettingsMenu, setShowSettingsMenu] = useState(false);
  const [showEpisodeDrawer, setShowEpisodeDrawer] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // HLS states
  const [availableQualities, setAvailableQualities] = useState<StreamQuality[]>([]);
  const [currentQualityIndex, setCurrentQualityIndex] = useState<number>(-1); // -1 = Auto
  const [currentResolution, setCurrentResolution] = useState<string>('Auto (Adaptiv)');
  const [subtitleLanguage, setSubtitleLanguage] = useState<'ro' | 'en' | 'off'>('ro');
  const [streamError, setStreamError] = useState<string | null>(null);
  const [isBuffering, setIsBuffering] = useState(false);

  // Auto-next countdown
  const [autoNextCountdown, setAutoNextCountdown] = useState<number | null>(null);

  const videoRef = useRef<HTMLVideoElement>(null);
  const playerContainerRef = useRef<HTMLDivElement>(null);
  const hlsRef = useRef<Hls | null>(null);
  const controlsTimeoutRef = useRef<any>(null);
  const progressSaveIntervalRef = useRef<any>(null);
  const autoNextTimerRef = useRef<any>(null);

  const currentEpisode: Episode = anime.episodes[currentEpisodeIndex] || anime.episodes[0] || {
    id: 'ep-fallback',
    seasonNumber: 1,
    episodeNumber: 1,
    title: anime.title,
    description: anime.description,
    thumbnail: anime.coverImage,
    duration: '24m',
    durationSeconds: 1440,
    videoUrl: anime.videoUrl || 'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8',
    streamType: anime.streamType || 'hls',
  };

  const rawUrl = currentEpisode.videoUrl || anime.videoUrl || '';
  const isM3U8 = rawUrl.includes('.m3u8') || currentEpisode.streamType === 'hls' || anime.streamType === 'hls';
  const isYouTube = rawUrl.includes('youtube.com') || rawUrl.includes('youtu.be') || currentEpisode.streamType === 'youtube';
  const isVimeo = rawUrl.includes('vimeo.com') || currentEpisode.streamType === 'vimeo';
  const isEmbedPlayer = isYouTube || isVimeo || currentEpisode.streamType === 'iframe' || currentEpisode.streamType === 'embed';

  // Normalize embed URL for iframe
  const normalizedEmbedUrl = useMemo(() => {
    if (!isEmbedPlayer) return rawUrl;
    if (rawUrl.includes('youtube.com/watch?v=')) {
      const vid = rawUrl.split('watch?v=')[1]?.split('&')[0];
      return `https://www.youtube.com/embed/${vid}?autoplay=1&enablejsapi=1`;
    }
    if (rawUrl.includes('youtu.be/')) {
      const vid = rawUrl.split('youtu.be/')[1]?.split('?')[0];
      return `https://www.youtube.com/embed/${vid}?autoplay=1&enablejsapi=1`;
    }
    if (rawUrl.includes('vimeo.com/') && !rawUrl.includes('player.vimeo.com')) {
      const vid = rawUrl.split('vimeo.com/').pop();
      return `https://player.vimeo.com/video/${vid}?autoplay=1`;
    }
    return rawUrl;
  }, [rawUrl, isEmbedPlayer]);

  // Save Progress
  const saveProgress = useCallback(async (completed = false) => {
    if (!videoRef.current && isEmbedPlayer) return;
    const currSec = videoRef.current ? Math.floor(videoRef.current.currentTime) : Math.floor(currentTime);
    const durSec = videoRef.current ? Math.floor(videoRef.current.duration) || 1440 : 1440;

    if (currSec <= 0) return;

    try {
      await api.saveProgress({
        userId,
        animeId: anime.id,
        episodeId: currentEpisode.id,
        progressSeconds: currSec,
        durationSeconds: durSec,
        completed: completed || (durSec > 0 && currSec / durSec > 0.92),
      });
      if (onProgressSaved) onProgressSaved();
    } catch (err) {
      console.warn('Progress save warning:', err);
    }
  }, [userId, anime.id, currentEpisode.id, currentTime, isEmbedPlayer, onProgressSaved]);

  // Setup HLS / Video source whenever episode changes
  useEffect(() => {
    setStreamError(null);
    setAutoNextCountdown(null);
    if (autoNextTimerRef.current) clearInterval(autoNextTimerRef.current);

    const video = videoRef.current;
    if (!video || isEmbedPlayer) return;

    // Clean up previous HLS instance
    if (hlsRef.current) {
      hlsRef.current.destroy();
      hlsRef.current = null;
    }

    if (isM3U8) {
      if (Hls.isSupported()) {
        const hls = new Hls({
          enableWorker: true,
          lowLatencyMode: true,
          backBufferLength: 90,
          manifestLoadingTimeOut: 10000,
          levelLoadingTimeOut: 10000,
        });

        hls.loadSource(rawUrl);
        hls.attachMedia(video);

        hls.on(Hls.Events.MANIFEST_PARSED, (event, data) => {
          const qualities: StreamQuality[] = [
            { index: -1, label: 'Auto (Adaptiv)' },
            ...data.levels.map((lvl, index) => ({
              index,
              label: lvl.height ? `${lvl.height}p` : `${Math.round(lvl.bitrate / 1000)}k`,
              height: lvl.height,
              bitrate: lvl.bitrate,
            })),
          ];
          setAvailableQualities(qualities);
          setCurrentQualityIndex(-1);

          // Resume position if provided
          if (initialProgressSeconds > 0) {
            video.currentTime = initialProgressSeconds;
          }
          video.play().then(() => setIsPlaying(true)).catch(() => setIsPlaying(false));
        });

        hls.on(Hls.Events.LEVEL_SWITCHED, (event, data) => {
          const lvl = hls.levels[data.level];
          if (lvl) {
            setCurrentResolution(`${lvl.height}p (${Math.round(lvl.bitrate / 1000)} kbps)`);
          }
        });

        hls.on(Hls.Events.ERROR, (event, data) => {
          if (data.fatal) {
            switch (data.type) {
              case Hls.ErrorTypes.NETWORK_ERROR:
                hls.startLoad();
                break;
              case Hls.ErrorTypes.MEDIA_ERROR:
                hls.recoverMediaError();
                break;
              default:
                hls.destroy();
                setStreamError('Eroare la redarea stream-ului adaptiv HLS.');
                break;
            }
          }
        });

        hlsRef.current = hls;
      } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
        // Native Safari HLS
        video.src = rawUrl;
        if (initialProgressSeconds > 0) video.currentTime = initialProgressSeconds;
        video.play().then(() => setIsPlaying(true)).catch(() => setIsPlaying(false));
      } else {
        setStreamError('Formatul HLS nu este suportat direct în acest browser.');
      }
    } else {
      // Standard MP4 / WebM
      video.src = rawUrl;
      setAvailableQualities([
        { index: 0, label: 'HD Direct (MP4)' }
      ]);
      setCurrentResolution('1080p MP4');
      if (initialProgressSeconds > 0) video.currentTime = initialProgressSeconds;
      video.play().then(() => setIsPlaying(true)).catch(() => setIsPlaying(false));
    }

    return () => {
      if (hlsRef.current) {
        hlsRef.current.destroy();
        hlsRef.current = null;
      }
    };
  }, [currentEpisodeIndex, rawUrl, isM3U8, isEmbedPlayer]);

  // Interval to save progress
  useEffect(() => {
    progressSaveIntervalRef.current = setInterval(() => {
      if (videoRef.current && !videoRef.current.paused) {
        saveProgress(false);
      }
    }, 5000);

    return () => {
      if (progressSaveIntervalRef.current) clearInterval(progressSaveIntervalRef.current);
      saveProgress(false);
    };
  }, [saveProgress]);

  // Fullscreen listener
  useEffect(() => {
    const handleFsChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFsChange);
    return () => document.removeEventListener('fullscreenchange', handleFsChange);
  }, []);

  // Keyboard controls
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isEmbedPlayer) return;
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;

      switch (e.code) {
        case 'Space':
        case 'KeyK':
          e.preventDefault();
          togglePlay();
          break;
        case 'ArrowLeft':
        case 'KeyJ':
          e.preventDefault();
          skip(-10);
          break;
        case 'ArrowRight':
        case 'KeyL':
          e.preventDefault();
          skip(10);
          break;
        case 'ArrowUp':
          e.preventDefault();
          changeVolume(Math.min(1, volume + 0.1));
          break;
        case 'ArrowDown':
          e.preventDefault();
          changeVolume(Math.max(0, volume - 0.1));
          break;
        case 'KeyM':
          e.preventDefault();
          toggleMute();
          break;
        case 'KeyF':
          e.preventDefault();
          toggleFullscreen();
          break;
        case 'KeyS':
          e.preventDefault();
          if (currentEpisode.introEnd) {
            skipIntro();
          } else {
            skip(85);
          }
          break;
        case 'KeyN':
          e.preventDefault();
          handleNextEpisode();
          break;
        case 'KeyP':
          e.preventDefault();
          handlePrevEpisode();
          break;
        case 'KeyI':
          e.preventDefault();
          togglePiP();
          break;
        case 'Escape':
          if (!document.fullscreenElement) {
            saveProgress(false);
            onClose();
          }
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isPlaying, volume, isMuted, isEmbedPlayer]);

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (videoRef.current.paused) {
      videoRef.current.play();
      setIsPlaying(true);
    } else {
      videoRef.current.pause();
      setIsPlaying(false);
      saveProgress(false);
    }
  };

  const skip = (seconds: number) => {
    if (!videoRef.current) return;
    videoRef.current.currentTime = Math.max(0, Math.min(videoRef.current.duration || 9999, videoRef.current.currentTime + seconds));
  };

  const changeVolume = (newVol: number) => {
    if (!videoRef.current) return;
    videoRef.current.volume = newVol;
    setVolume(newVol);
    setIsMuted(newVol === 0);
  };

  const toggleMute = () => {
    if (!videoRef.current) return;
    if (isMuted) {
      videoRef.current.muted = false;
      setIsMuted(false);
      videoRef.current.volume = volume || 0.5;
    } else {
      videoRef.current.muted = true;
      setIsMuted(true);
    }
  };

  const setSpeed = (spd: number) => {
    if (!videoRef.current) return;
    videoRef.current.playbackRate = spd;
    setPlaybackSpeed(spd);
    setShowSettingsMenu(false);
  };

  const setQuality = (qualityIndex: number) => {
    setCurrentQualityIndex(qualityIndex);
    if (hlsRef.current) {
      hlsRef.current.currentLevel = qualityIndex;
      if (qualityIndex === -1) {
        setCurrentResolution('Auto (Adaptiv)');
      } else {
        const lvl = hlsRef.current.levels[qualityIndex];
        if (lvl) setCurrentResolution(`${lvl.height}p`);
      }
    }
    setShowSettingsMenu(false);
  };

  const skipIntro = () => {
    if (!videoRef.current || !currentEpisode.introEnd) return;
    videoRef.current.currentTime = currentEpisode.introEnd;
  };

  const toggleFullscreen = () => {
    if (!playerContainerRef.current) return;
    if (!document.fullscreenElement) {
      playerContainerRef.current.requestFullscreen().catch(console.error);
    } else {
      document.exitFullscreen().catch(console.error);
    }
  };

  const togglePiP = async () => {
    if (!videoRef.current) return;
    try {
      if (document.pictureInPictureElement) {
        await document.exitPictureInPicture();
      } else if (document.pictureInPictureEnabled) {
        await videoRef.current.requestPictureInPicture();
      }
    } catch (err) {
      console.warn('PiP error:', err);
    }
  };

  const handleNextEpisode = () => {
    if (currentEpisodeIndex < anime.episodes.length - 1) {
      saveProgress(true);
      setCurrentEpisodeIndex((prev) => prev + 1);
    }
  };

  const handlePrevEpisode = () => {
    if (currentEpisodeIndex > 0) {
      saveProgress(false);
      setCurrentEpisodeIndex((prev) => prev - 1);
    }
  };

  const handleVideoEnded = () => {
    setIsPlaying(false);
    saveProgress(true);
    if (currentEpisodeIndex < anime.episodes.length - 1) {
      setAutoNextCountdown(5);
      autoNextTimerRef.current = setInterval(() => {
        setAutoNextCountdown((prev) => {
          if (prev === null || prev <= 1) {
            clearInterval(autoNextTimerRef.current);
            handleNextEpisode();
            return null;
          }
          return prev - 1;
        });
      }, 1000);
    }
  };

  const formatTime = (seconds: number) => {
    if (isNaN(seconds) || seconds < 0) return '00:00';
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);
    if (hrs > 0) {
      return `${hrs}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const isInsideIntro =
    currentEpisode.introStart !== undefined &&
    currentEpisode.introEnd !== undefined &&
    currentEpisode.introEnd > currentEpisode.introStart &&
    currentTime >= currentEpisode.introStart &&
    currentTime <= currentEpisode.introEnd;

  const introWidthPercent =
    duration > 0 && currentEpisode.introStart !== undefined && currentEpisode.introEnd !== undefined
      ? ((currentEpisode.introEnd - currentEpisode.introStart) / duration) * 100
      : 0;

  const introLeftPercent =
    duration > 0 && currentEpisode.introStart !== undefined
      ? (currentEpisode.introStart / duration) * 100
      : 0;

  return (
    <div
      ref={playerContainerRef}
      onMouseMove={() => {
        setShowControls(true);
        if (controlsTimeoutRef.current) clearTimeout(controlsTimeoutRef.current);
        controlsTimeoutRef.current = setTimeout(() => {
          if (isPlaying && !isEmbedPlayer) {
            setShowControls(false);
            setShowSettingsMenu(false);
          }
        }, 3500);
      }}
      className="fixed inset-0 z-50 bg-black flex items-center justify-center select-none overflow-hidden font-sans"
    >
      {/* Top Header Overlay */}
      <div
        className={`absolute top-0 left-0 right-0 p-4 sm:p-6 bg-gradient-to-b from-black/95 via-black/60 to-transparent flex items-center justify-between transition-opacity duration-300 z-30 ${
          showControls ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
      >
        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              saveProgress(false);
              onClose();
            }}
            className="w-10 h-10 rounded-full bg-neutral-900/90 hover:bg-neutral-800 text-white flex items-center justify-center border border-neutral-700 transition cursor-pointer"
            title="Închide playerul"
          >
            <X className="w-5 h-5" />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-sm sm:text-base font-bold text-white tracking-wide truncate max-w-xs sm:max-w-md">
                {anime.title}
              </h2>
              <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 border border-rose-500/30">
                {isM3U8 ? 'HLS ADAPTIV' : (currentEpisode.streamType || 'MP4').toUpperCase()}
              </span>
              <span className="hidden sm:inline-block text-[10px] font-mono text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-800/80">
                ● LIVE
              </span>
            </div>
            <p className="text-xs text-neutral-400 font-medium truncate max-w-sm">
              Episodul {currentEpisode.episodeNumber}: {currentEpisode.title}
            </p>
          </div>
        </div>

        {/* Right side drawer and info */}
        <div className="flex items-center gap-2">
          {anime.episodes.length > 1 && (
            <button
              onClick={() => setShowEpisodeDrawer(!showEpisodeDrawer)}
              className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-neutral-900/90 hover:bg-neutral-800 text-xs font-semibold text-neutral-200 border border-neutral-700 transition cursor-pointer shadow-lg"
            >
              <ListVideo className="w-4 h-4 text-rose-400" />
              <span className="hidden sm:inline">Episoade ({currentEpisodeIndex + 1}/{anime.episodes.length})</span>
            </button>
          )}
        </div>
      </div>

      {/* Main Video Viewport */}
      {isEmbedPlayer ? (
        <div className="w-full h-full pt-16 pb-4 px-4 flex items-center justify-center">
          <iframe
            src={normalizedEmbedUrl}
            title={anime.title}
            className="w-full max-w-5xl aspect-video rounded-2xl shadow-2xl border border-neutral-800"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
      ) : (
        <div className="relative w-full h-full flex items-center justify-center bg-black">
          <video
            ref={videoRef}
            className="w-full h-full object-contain cursor-pointer"
            onClick={togglePlay}
            onTimeUpdate={() => {
              if (videoRef.current) {
                setCurrentTime(videoRef.current.currentTime);
                // Update buffer
                if (videoRef.current.buffered.length > 0 && videoRef.current.duration > 0) {
                  const end = videoRef.current.buffered.end(videoRef.current.buffered.length - 1);
                  setBufferedPercent((end / videoRef.current.duration) * 100);
                }
              }
            }}
            onLoadedMetadata={() => {
              if (videoRef.current) {
                setDuration(videoRef.current.duration);
              }
            }}
            onWaiting={() => setIsBuffering(true)}
            onPlaying={() => {
              setIsBuffering(false);
              setIsPlaying(true);
            }}
            onPause={() => setIsPlaying(false)}
            onEnded={handleVideoEnded}
            playsInline
          />

          {/* Buffering Spinner */}
          {isBuffering && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/40 pointer-events-none">
              <div className="w-14 h-14 border-4 border-rose-500/30 border-t-rose-500 rounded-full animate-spin" />
            </div>
          )}

          {/* Stream Error Notice */}
          {streamError && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-neutral-950/90 p-6 text-center z-20">
              <div className="w-12 h-12 rounded-full bg-rose-500/20 text-rose-400 flex items-center justify-center mb-3">
                <Info className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white mb-1">Eroare redare stream</h3>
              <p className="text-sm text-neutral-400 max-w-md mb-4">{streamError}</p>
              <button
                onClick={() => {
                  setStreamError(null);
                  if (videoRef.current) videoRef.current.load();
                }}
                className="px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white rounded-xl text-xs font-bold transition cursor-pointer"
              >
                Reîncearcă conexiunea
              </button>
            </div>
          )}
        </div>
      )}

      {/* Auto Next Countdown Overlay */}
      {autoNextCountdown !== null && currentEpisodeIndex < anime.episodes.length - 1 && (
        <div className="absolute bottom-28 right-8 z-40 bg-neutral-900/95 border border-rose-500/50 p-4 rounded-2xl shadow-2xl flex items-center gap-4 animate-in slide-in-from-bottom-5">
          <div>
            <p className="text-xs text-rose-400 font-bold uppercase tracking-wider">Următorul episod</p>
            <p className="text-sm font-bold text-white">{anime.episodes[currentEpisodeIndex + 1]?.title}</p>
            <p className="text-xs text-neutral-400">Pornire automată în {autoNextCountdown} secunde...</p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                if (autoNextTimerRef.current) clearInterval(autoNextTimerRef.current);
                setAutoNextCountdown(null);
              }}
              className="px-3 py-1.5 rounded-lg bg-neutral-800 text-neutral-300 hover:text-white text-xs font-semibold"
            >
              Anulează
            </button>
            <button
              onClick={handleNextEpisode}
              className="px-3 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold flex items-center gap-1"
            >
              <Play className="w-3.5 h-3.5 fill-white" />
              <span>Redă acum</span>
            </button>
          </div>
        </div>
      )}

      {/* Skip Intro Floating Button */}
      {isInsideIntro && !isEmbedPlayer && (
        <button
          onClick={skipIntro}
          className="absolute bottom-24 right-8 z-30 flex items-center gap-2 px-4 py-2.5 rounded-xl bg-neutral-900/95 hover:bg-rose-600 text-white font-bold text-xs border border-neutral-700 shadow-2xl transition cursor-pointer animate-pulse"
        >
          <FastForward className="w-4 h-4" />
          <span>Sari peste Intro</span>
        </button>
      )}

      {/* Episode Drawer Sidebar */}
      {showEpisodeDrawer && (
        <div className="absolute top-0 right-0 bottom-0 w-80 sm:w-96 bg-neutral-950/95 border-l border-neutral-800 p-4 z-40 overflow-y-auto backdrop-blur-md shadow-2xl">
          <div className="flex items-center justify-between pb-3 border-b border-neutral-800">
            <div>
              <h3 className="font-bold text-sm text-white">Listă Episoade</h3>
              <p className="text-xs text-neutral-400">{anime.title}</p>
            </div>
            <button
              onClick={() => setShowEpisodeDrawer(false)}
              className="w-8 h-8 rounded-full bg-neutral-900 text-neutral-400 hover:text-white flex items-center justify-center transition"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="mt-3 space-y-2">
            {anime.episodes.map((ep, idx) => (
              <button
                key={ep.id || idx}
                onClick={() => {
                  saveProgress(false);
                  setCurrentEpisodeIndex(idx);
                  setShowEpisodeDrawer(false);
                }}
                className={`w-full flex items-center gap-3 p-2.5 rounded-xl text-left transition cursor-pointer border ${
                  idx === currentEpisodeIndex
                    ? 'bg-rose-500/20 border-rose-500/50 text-white shadow-lg shadow-rose-950/40'
                    : 'bg-neutral-900/60 hover:bg-neutral-850 border-neutral-800/80 text-neutral-300'
                }`}
              >
                <div className="relative w-20 aspect-video rounded-md overflow-hidden bg-neutral-900 shrink-0">
                  <img
                    src={ep.thumbnail || anime.coverImage}
                    alt={ep.title}
                    className="w-full h-full object-cover"
                  />
                  {idx === currentEpisodeIndex && (
                    <div className="absolute inset-0 bg-rose-600/40 flex items-center justify-center">
                      <Play className="w-4 h-4 fill-white text-white" />
                    </div>
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <span className="text-[10px] font-bold text-rose-400 uppercase tracking-wider">
                    Episodul {ep.episodeNumber}
                  </span>
                  <p className="text-xs font-semibold text-white truncate">{ep.title}</p>
                  <span className="text-[10px] text-neutral-400 font-mono">{ep.duration}</span>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Settings Popup Menu */}
      {showSettingsMenu && (
        <div className="absolute bottom-24 right-8 z-40 w-64 bg-neutral-900/95 border border-neutral-700/80 rounded-2xl p-4 shadow-2xl backdrop-blur-md text-xs space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-neutral-800">
            <span className="font-bold text-white flex items-center gap-1.5">
              <Settings className="w-3.5 h-3.5 text-rose-400" />
              Setări Redare
            </span>
            <button onClick={() => setShowSettingsMenu(false)} className="text-neutral-400 hover:text-white">
              <X className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Speed Selector */}
          <div>
            <label className="text-[11px] font-bold text-neutral-400 uppercase mb-1.5 block">Viteză de Redare</label>
            <div className="grid grid-cols-4 gap-1">
              {[0.75, 1, 1.25, 1.5].map((spd) => (
                <button
                  key={spd}
                  onClick={() => setSpeed(spd)}
                  className={`py-1.5 rounded-lg font-bold text-center transition cursor-pointer ${
                    playbackSpeed === spd
                      ? 'bg-rose-600 text-white'
                      : 'bg-neutral-800 hover:bg-neutral-700 text-neutral-300'
                  }`}
                >
                  {spd}x
                </button>
              ))}
            </div>
          </div>

          {/* Quality Selector */}
          {availableQualities.length > 0 && (
            <div>
              <label className="text-[11px] font-bold text-neutral-400 uppercase mb-1.5 block">
                Rezoluție / Calitate
              </label>
              <div className="space-y-1 max-h-36 overflow-y-auto">
                {availableQualities.map((q) => (
                  <button
                    key={q.index}
                    onClick={() => setQuality(q.index)}
                    className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg font-medium transition cursor-pointer text-left ${
                      currentQualityIndex === q.index
                        ? 'bg-rose-600/30 text-rose-300 font-bold border border-rose-500/40'
                        : 'bg-neutral-800/60 hover:bg-neutral-800 text-neutral-300'
                    }`}
                  >
                    <span>{q.label}</span>
                    {currentQualityIndex === q.index && <Check className="w-3.5 h-3.5 text-rose-400" />}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Subtitles Selector */}
          <div>
            <label className="text-[11px] font-bold text-neutral-400 uppercase mb-1.5 block">Subtitrări</label>
            <div className="grid grid-cols-3 gap-1">
              {[
                { id: 'ro', label: '🇷🇴 Română' },
                { id: 'en', label: '🇬🇧 Engleză' },
                { id: 'off', label: 'Oprit' },
              ].map((sub) => (
                <button
                  key={sub.id}
                  onClick={() => setSubtitleLanguage(sub.id as any)}
                  className={`py-1.5 rounded-lg font-medium text-center transition cursor-pointer text-[11px] ${
                    subtitleLanguage === sub.id
                      ? 'bg-rose-600 text-white font-bold'
                      : 'bg-neutral-800 hover:bg-neutral-700 text-neutral-300'
                  }`}
                >
                  {sub.label}
                </button>
              ))}
            </div>
          </div>

          {/* Diagnostics */}
          <div className="pt-2 border-t border-neutral-800 text-[10px] text-neutral-400 space-y-0.5 font-mono">
            <div>Format: {isM3U8 ? 'HLS Master' : 'Direct MP4'}</div>
            <div>Rezoluție curentă: {currentResolution}</div>
          </div>

          {/* Download for offline */}
          <div className="pt-2 border-t border-neutral-800">
            <a
              href={rawUrl}
              download={`${anime.title}-${currentEpisode.title}.mp4`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-2 px-3 rounded-xl bg-neutral-800/90 hover:bg-neutral-700 text-neutral-200 hover:text-white text-xs font-semibold flex items-center justify-center gap-2 transition"
            >
              <Download className="w-3.5 h-3.5 text-rose-400" />
              <span>Descarcă Episod Offline</span>
            </a>
          </div>
        </div>
      )}

      {/* Bottom Controls Bar for Native HTML5 / HLS Streams */}
      {!isEmbedPlayer && (
        <div
          className={`absolute bottom-0 left-0 right-0 p-4 sm:p-6 bg-gradient-to-t from-black/95 via-black/70 to-transparent transition-opacity duration-300 z-30 ${
            showControls ? 'opacity-100' : 'opacity-0 pointer-events-none'
          }`}
        >
          {/* Progress Timeline Scrubber with intro marker & buffer bar */}
          <div className="relative mb-3 group">
            <div className="relative w-full h-1.5 group-hover:h-2.5 bg-neutral-800 rounded-lg overflow-hidden transition-all">
              {/* Buffer progress bar */}
              <div
                className="absolute top-0 bottom-0 left-0 bg-neutral-700/70 transition-all duration-200"
                style={{ width: `${bufferedPercent}%` }}
              />

              {/* Intro highlight marker */}
              {introWidthPercent > 0 && (
                <div
                  className="absolute top-0 bottom-0 bg-amber-400/50 z-10"
                  style={{
                    left: `${introLeftPercent}%`,
                    width: `${introWidthPercent}%`,
                  }}
                  title="Intro"
                />
              )}

              {/* Played bar */}
              <div
                className="absolute top-0 bottom-0 left-0 bg-rose-600 z-20"
                style={{ width: `${duration > 0 ? (currentTime / duration) * 100 : 0}%` }}
              />
            </div>

            {/* Invisible Range Input for scrubbing */}
            <input
              type="range"
              min={0}
              max={duration || 100}
              step={0.1}
              value={currentTime}
              onChange={(e) => {
                const newTime = parseFloat(e.target.value);
                if (videoRef.current) {
                  videoRef.current.currentTime = newTime;
                  setCurrentTime(newTime);
                }
              }}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />
          </div>

          {/* Control Buttons Row */}
          <div className="flex items-center justify-between gap-4">
            {/* Left Controls */}
            <div className="flex items-center gap-2 sm:gap-3">
              <button
                onClick={togglePlay}
                className="w-10 h-10 rounded-full bg-rose-600 hover:bg-rose-500 text-white flex items-center justify-center transition cursor-pointer shadow-lg shadow-rose-600/30"
                title={isPlaying ? 'Pauză (Space)' : 'Redă (Space)'}
              >
                {isPlaying ? <Pause className="w-5 h-5 fill-white" /> : <Play className="w-5 h-5 fill-white translate-x-0.5" />}
              </button>

              {/* Prev Episode */}
              {currentEpisodeIndex > 0 && (
                <button
                  onClick={handlePrevEpisode}
                  className="p-2 text-neutral-400 hover:text-white transition cursor-pointer"
                  title="Episodul anterior"
                >
                  <SkipBack className="w-4 h-4" />
                </button>
              )}

              {/* Skip Back 10s */}
              <button
                onClick={() => skip(-10)}
                className="p-2 text-neutral-400 hover:text-white transition cursor-pointer"
                title="Înapoi 10s (J)"
              >
                <RotateCcw className="w-4 h-4" />
              </button>

              {/* Skip Forward 10s */}
              <button
                onClick={() => skip(10)}
                className="p-2 text-neutral-400 hover:text-white transition cursor-pointer"
                title="Înainte 10s (L)"
              >
                <RotateCw className="w-4 h-4" />
              </button>

              {/* Next Episode */}
              {currentEpisodeIndex < anime.episodes.length - 1 && (
                <button
                  onClick={handleNextEpisode}
                  className="p-2 text-neutral-400 hover:text-white transition cursor-pointer"
                  title="Episodul următor"
                >
                  <SkipForward className="w-4 h-4" />
                </button>
              )}

              {/* Volume Slider with Mute Button */}
              <div className="flex items-center gap-2 ml-1 group">
                <button
                  onClick={toggleMute}
                  className="p-1.5 text-neutral-400 hover:text-white transition cursor-pointer"
                  title="Sunet (M)"
                >
                  {isMuted || volume === 0 ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                </button>
                <input
                  type="range"
                  min={0}
                  max={1}
                  step={0.05}
                  value={isMuted ? 0 : volume}
                  onChange={(e) => changeVolume(parseFloat(e.target.value))}
                  className="w-16 sm:w-20 h-1 bg-neutral-800 rounded-lg appearance-none cursor-pointer accent-rose-500 opacity-70 group-hover:opacity-100 transition"
                />
              </div>

              {/* Time display */}
              <div className="text-xs font-mono text-neutral-400 hidden xs:inline-block ml-2">
                <span className="text-neutral-200">{formatTime(currentTime)}</span> / {formatTime(duration)}
              </div>
            </div>

            {/* Right Controls */}
            <div className="flex items-center gap-2 sm:gap-3">
              {/* CC Subtitle Toggle */}
              <button
                onClick={() => setSubtitleLanguage((prev) => (prev === 'off' ? 'ro' : 'off'))}
                className={`px-2 py-1 rounded-lg text-[10px] font-bold font-mono transition cursor-pointer border ${
                  subtitleLanguage !== 'off'
                    ? 'bg-rose-600/30 text-rose-300 border-rose-500/50 shadow-sm'
                    : 'bg-neutral-900/90 text-neutral-500 border-neutral-800 hover:text-neutral-300'
                }`}
                title={`Subtitrări: ${subtitleLanguage === 'off' ? 'Oprit' : subtitleLanguage.toUpperCase()}`}
              >
                CC {subtitleLanguage !== 'off' && `[${subtitleLanguage.toUpperCase()}]`}
              </button>

              {/* Quality resolution tag */}
              <button
                onClick={() => setShowSettingsMenu(!showSettingsMenu)}
                className="px-2.5 py-1 rounded-lg bg-neutral-900/90 hover:bg-neutral-800 text-[11px] font-mono font-bold text-neutral-300 border border-neutral-800 transition cursor-pointer flex items-center gap-1.5"
                title="Calitate & Viteze"
              >
                <SlidersHorizontal className="w-3.5 h-3.5 text-rose-400" />
                <span className="hidden sm:inline">{currentResolution}</span>
              </button>

              {/* Picture in Picture */}
              <button
                onClick={togglePiP}
                className="p-2 text-neutral-400 hover:text-white transition cursor-pointer hidden sm:block"
                title="Picture-in-Picture"
              >
                <PictureInPicture className="w-4 h-4" />
              </button>

              {/* Settings Toggle */}
              <button
                onClick={() => setShowSettingsMenu(!showSettingsMenu)}
                className="p-2 text-neutral-400 hover:text-white transition cursor-pointer"
                title="Setări (Viteză & Calitate)"
              >
                <Settings className="w-4 h-4" />
              </button>

              {/* Fullscreen */}
              <button
                onClick={toggleFullscreen}
                className="p-2 text-neutral-400 hover:text-white transition cursor-pointer"
                title="Ecran complet (F)"
              >
                {isFullscreen ? <Minimize className="w-4 h-4" /> : <Maximize className="w-4 h-4" />}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
