import React, { useState, useRef, useEffect } from 'react';
import {
  Play, Pause, Volume2, VolumeX, Maximize, Minimize, RotateCcw,
  RotateCw, FastForward, Settings, ListVideo, X, Check, SkipForward,
  Pipette, PictureInPicture, MonitorPlay
} from 'lucide-react';
import { Anime, Episode } from '../types/anime';
import { api } from '../services/api';

interface VideoPlayerModalProps {
  anime: Anime;
  initialEpisodeIndex?: number;
  initialProgressSeconds?: number;
  onClose: () => void;
  userId?: string;
  onProgressSaved?: () => void;
}

export const VideoPlayerModal: React.FC<VideoPlayerModalProps> = ({
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
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [showControls, setShowControls] = useState(true);
  const [showSettingsMenu, setShowSettingsMenu] = useState(false);
  const [showEpisodeDrawer, setShowEpisodeDrawer] = useState(false);
  const [quality, setQuality] = useState('1080p HD');
  const [selectedSubtitles, setSelectedSubtitles] = useState('Română (Sub)');
  const [selectedAudio, setSelectedAudio] = useState('Japoneză (Original)');
  const [autoNext, setAutoNext] = useState(true);
  const [hoverTime, setHoverTime] = useState<number | null>(null);
  const [hoverPosition, setHoverPosition] = useState(0);

  const videoRef = useRef<HTMLVideoElement>(null);
  const playerContainerRef = useRef<HTMLDivElement>(null);
  const controlsTimeoutRef = useRef<any>(null);
  const progressSaveIntervalRef = useRef<any>(null);

  const currentEpisode = anime.episodes[currentEpisodeIndex] || anime.episodes[0];

  // Initialize playback time if resuming
  useEffect(() => {
    if (videoRef.current && initialProgressSeconds > 0) {
      videoRef.current.currentTime = initialProgressSeconds;
      setCurrentTime(initialProgressSeconds);
    }
  }, [initialProgressSeconds]);

  // When episode changes, reset and play
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.currentTime = 0;
      setCurrentTime(0);
      videoRef.current.play().then(() => setIsPlaying(true)).catch(() => setIsPlaying(false));
    }
  }, [currentEpisodeIndex]);

  // Periodic watch progress saver (every 4 seconds)
  useEffect(() => {
    progressSaveIntervalRef.current = setInterval(() => {
      if (videoRef.current && !videoRef.current.paused && currentEpisode) {
        saveProgress(false);
      }
    }, 4000);

    return () => {
      if (progressSaveIntervalRef.current) clearInterval(progressSaveIntervalRef.current);
      // Save on unmount
      saveProgress(false);
    };
  }, [currentEpisodeIndex, anime.id]);

  const saveProgress = async (completed = false) => {
    if (!videoRef.current || !currentEpisode) return;
    const currSec = Math.floor(videoRef.current.currentTime);
    const durSec = Math.floor(videoRef.current.duration) || currentEpisode.durationSeconds || 1440;

    try {
      await api.saveProgress({
        userId,
        animeId: anime.id,
        episodeId: currentEpisode.id,
        progressSeconds: currSec,
        durationSeconds: durSec,
        completed: completed || (currSec / durSec > 0.92),
      });
      if (onProgressSaved) onProgressSaved();
    } catch (err) {
      console.error('Eroare la salvarea progresului:', err);
    }
  };

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement)?.tagName)) return;

      switch (e.key.toLowerCase()) {
        case ' ':
        case 'k':
          e.preventDefault();
          togglePlay();
          break;
        case 'f':
          e.preventDefault();
          toggleFullscreen();
          break;
        case 'm':
          e.preventDefault();
          toggleMute();
          break;
        case 'j':
        case 'arrowleft':
          e.preventDefault();
          skip(-10);
          break;
        case 'l':
        case 'arrowright':
          e.preventDefault();
          skip(10);
          break;
        case 'escape':
          if (!document.fullscreenElement) {
            onClose();
          }
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isPlaying, isMuted]);

  // Auto-hide controls
  const handleMouseMove = () => {
    setShowControls(true);
    if (controlsTimeoutRef.current) clearTimeout(controlsTimeoutRef.current);
    controlsTimeoutRef.current = setTimeout(() => {
      if (isPlaying) {
        setShowControls(false);
        setShowSettingsMenu(false);
      }
    }, 3500);
  };

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

  const skipIntro = () => {
    if (!videoRef.current || !currentEpisode.introEnd) return;
    videoRef.current.currentTime = currentEpisode.introEnd;
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTime = parseFloat(e.target.value);
    if (videoRef.current) {
      videoRef.current.currentTime = newTime;
      setCurrentTime(newTime);
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVol = parseFloat(e.target.value);
    setVolume(newVol);
    if (videoRef.current) {
      videoRef.current.volume = newVol;
      setIsMuted(newVol === 0);
    }
  };

  const toggleMute = () => {
    if (!videoRef.current) return;
    if (isMuted) {
      videoRef.current.volume = volume || 0.5;
      setIsMuted(false);
    } else {
      videoRef.current.volume = 0;
      setIsMuted(true);
    }
  };

  const toggleFullscreen = () => {
    if (!playerContainerRef.current) return;
    if (!document.fullscreenElement) {
      playerContainerRef.current.requestFullscreen().catch(console.error);
    } else {
      document.exitFullscreen().catch(console.error);
    }
  };

  const togglePip = async () => {
    if (!videoRef.current) return;
    try {
      if (document.pictureInPictureElement) {
        await document.exitPictureInPicture();
      } else {
        await videoRef.current.requestPictureInPicture();
      }
    } catch (err) {
      console.error('Picture-in-picture error:', err);
    }
  };

  const handleSpeedChange = (speed: number) => {
    setPlaybackSpeed(speed);
    if (videoRef.current) {
      videoRef.current.playbackRate = speed;
    }
    setShowSettingsMenu(false);
  };

  const handleVideoEnded = () => {
    setIsPlaying(false);
    saveProgress(true);
    if (autoNext && currentEpisodeIndex < anime.episodes.length - 1) {
      setCurrentEpisodeIndex((prev) => prev + 1);
    }
  };

  const formatTime = (seconds: number) => {
    if (isNaN(seconds)) return '00:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const isInsideIntro =
    currentEpisode.introStart !== undefined &&
    currentEpisode.introEnd !== undefined &&
    currentTime >= currentEpisode.introStart &&
    currentTime <= currentEpisode.introEnd;

  return (
    <div
      ref={playerContainerRef}
      onMouseMove={handleMouseMove}
      className="fixed inset-0 z-50 bg-black flex items-center justify-center select-none overflow-hidden"
    >
      {/* Video Element */}
      <video
        ref={videoRef}
        src={currentEpisode.videoUrl}
        className="w-full h-full object-contain cursor-pointer"
        onClick={togglePlay}
        onTimeUpdate={() => {
          if (videoRef.current) setCurrentTime(videoRef.current.currentTime);
        }}
        onLoadedMetadata={() => {
          if (videoRef.current) setDuration(videoRef.current.duration);
        }}
        onEnded={handleVideoEnded}
        playsInline
      />

      {/* Top Overlay: Title, Episode, and Close Button */}
      <div
        className={`absolute top-0 left-0 right-0 p-4 sm:p-6 bg-gradient-to-b from-black/80 via-black/40 to-transparent flex items-center justify-between transition-opacity duration-300 z-30 ${
          showControls ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
      >
        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              saveProgress(false);
              onClose();
            }}
            className="w-10 h-10 rounded-full bg-neutral-900/80 hover:bg-neutral-800 text-white flex items-center justify-center border border-neutral-700/80 transition cursor-pointer"
            title="Închide playerul"
          >
            <X className="w-5 h-5" />
          </button>
          <div>
            <h2 className="text-sm sm:text-base font-bold text-white tracking-wide">
              {anime.title}
            </h2>
            <p className="text-xs text-rose-400 font-medium">
              Sezonul {currentEpisode.seasonNumber} · Episodul {currentEpisode.episodeNumber}: {currentEpisode.title}
            </p>
          </div>
        </div>

        {/* Quick Episode Drawer Toggle */}
        <button
          onClick={() => setShowEpisodeDrawer(!showEpisodeDrawer)}
          className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-neutral-900/80 hover:bg-neutral-800 text-xs font-semibold text-neutral-200 border border-neutral-700 transition cursor-pointer"
        >
          <ListVideo className="w-4 h-4 text-rose-400" />
          <span className="hidden sm:inline">Listă Episoade</span>
        </button>
      </div>

      {/* Skip Intro Floating Button */}
      {isInsideIntro && (
        <button
          onClick={skipIntro}
          className="absolute bottom-24 right-8 z-30 flex items-center gap-2 px-4 py-2.5 rounded-xl bg-neutral-900/90 hover:bg-rose-600 text-white font-bold text-xs border border-neutral-700 shadow-2xl transition-all cursor-pointer animate-bounce"
        >
          <FastForward className="w-4 h-4" />
          <span>Sari peste Intro</span>
        </button>
      )}

      {/* Episode Drawer Sidebar */}
      {showEpisodeDrawer && (
        <div className="absolute top-0 right-0 bottom-0 w-80 bg-neutral-950/95 border-l border-neutral-800 p-4 z-40 overflow-y-auto backdrop-blur-md shadow-2xl">
          <div className="flex items-center justify-between pb-3 border-b border-neutral-800">
            <h3 className="font-bold text-sm text-white">Episoade ({anime.episodes.length})</h3>
            <button
              onClick={() => setShowEpisodeDrawer(false)}
              className="w-7 h-7 rounded-full bg-neutral-900 text-neutral-400 hover:text-white flex items-center justify-center"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="mt-3 space-y-2">
            {anime.episodes.map((ep, idx) => (
              <button
                key={ep.id}
                onClick={() => {
                  setCurrentEpisodeIndex(idx);
                  setShowEpisodeDrawer(false);
                }}
                className={`w-full flex items-center gap-3 p-2.5 rounded-xl text-left transition cursor-pointer ${
                  idx === currentEpisodeIndex
                    ? 'bg-rose-500/15 border border-rose-500/40 text-white'
                    : 'bg-neutral-900/60 hover:bg-neutral-850 text-neutral-300'
                }`}
              >
                <div className="relative w-20 aspect-video rounded-md overflow-hidden bg-neutral-800 shrink-0">
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
                  <p className="text-xs font-bold text-rose-400">Episodul {ep.episodeNumber}</p>
                  <p className="text-xs font-medium text-white truncate">{ep.title}</p>
                  <p className="text-[10px] text-neutral-500 font-mono mt-0.5">{ep.duration}</p>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Bottom Controls Bar */}
      <div
        className={`absolute bottom-0 left-0 right-0 p-4 sm:p-6 bg-gradient-to-t from-black/90 via-black/60 to-transparent transition-opacity duration-300 z-30 ${
          showControls ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
      >
        {/* Progress Scrubber */}
        <div className="relative mb-3 group/scrub">
          <input
            type="range"
            min={0}
            max={duration || 100}
            step={0.1}
            value={currentTime}
            onChange={handleSeek}
            className="w-full h-1.5 hover:h-2.5 bg-neutral-800/80 rounded-lg appearance-none cursor-pointer accent-rose-500 transition-all duration-150"
          />
        </div>

        {/* Buttons Row */}
        <div className="flex items-center justify-between gap-4">
          {/* Left Controls: Play/Pause, Skip 10s, Volume, Time */}
          <div className="flex items-center gap-3">
            <button
              onClick={togglePlay}
              className="w-10 h-10 rounded-full bg-rose-600 hover:bg-rose-500 text-white flex items-center justify-center transition cursor-pointer"
            >
              {isPlaying ? <Pause className="w-5 h-5 fill-white" /> : <Play className="w-5 h-5 fill-white translate-x-0.5" />}
            </button>

            {/* Skip -10s */}
            <button
              onClick={() => skip(-10)}
              className="p-2 text-neutral-400 hover:text-white transition cursor-pointer"
              title="Înapoi 10s (J)"
            >
              <RotateCcw className="w-4 h-4" />
            </button>

            {/* Skip +10s */}
            <button
              onClick={() => skip(10)}
              className="p-2 text-neutral-400 hover:text-white transition cursor-pointer"
              title="Înainte 10s (L)"
            >
              <RotateCw className="w-4 h-4" />
            </button>

            {/* Next Episode Button */}
            {currentEpisodeIndex < anime.episodes.length - 1 && (
              <button
                onClick={() => setCurrentEpisodeIndex((prev) => prev + 1)}
                className="p-2 text-neutral-400 hover:text-white transition cursor-pointer"
                title="Episodul următor"
              >
                <SkipForward className="w-4 h-4" />
              </button>
            )}

            {/* Volume */}
            <div className="flex items-center gap-2 group/vol">
              <button
                onClick={toggleMute}
                className="p-2 text-neutral-400 hover:text-white transition cursor-pointer"
              >
                {isMuted || volume === 0 ? <VolumeX className="w-4 h-4 text-rose-400" /> : <Volume2 className="w-4 h-4" />}
              </button>
              <input
                type="range"
                min={0}
                max={1}
                step={0.05}
                value={isMuted ? 0 : volume}
                onChange={handleVolumeChange}
                className="w-16 h-1 bg-neutral-800 rounded appearance-none accent-rose-500 cursor-pointer hidden sm:block"
              />
            </div>

            {/* Time display */}
            <div className="text-xs font-mono text-neutral-400">
              <span className="text-neutral-200">{formatTime(currentTime)}</span> / {formatTime(duration)}
            </div>
          </div>

          {/* Right Controls: Settings, PiP, Fullscreen */}
          <div className="flex items-center gap-3">
            {/* Playback speed indicator */}
            <div className="relative">
              <button
                onClick={() => setShowSettingsMenu(!showSettingsMenu)}
                className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-neutral-900/80 hover:bg-neutral-800 text-xs font-semibold text-neutral-300 border border-neutral-700/80 transition cursor-pointer"
              >
                <Settings className="w-3.5 h-3.5 text-neutral-400" />
                <span>{playbackSpeed}x</span>
              </button>

              {/* Settings Dropdown Popover */}
              {showSettingsMenu && (
                <div className="absolute bottom-12 right-0 w-60 bg-neutral-900 rounded-2xl border border-neutral-800 shadow-2xl p-3 space-y-3 z-50 text-xs">
                  {/* Speed */}
                  <div>
                    <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider block mb-1.5">
                      Viteză de redare
                    </span>
                    <div className="grid grid-cols-3 gap-1">
                      {[0.75, 1, 1.25, 1.5, 2].map((s) => (
                        <button
                          key={s}
                          onClick={() => handleSpeedChange(s)}
                          className={`py-1 rounded text-center font-medium transition cursor-pointer ${
                            playbackSpeed === s
                              ? 'bg-rose-600 text-white'
                              : 'bg-neutral-800 text-neutral-300 hover:bg-neutral-700'
                          }`}
                        >
                          {s}x
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Quality */}
                  <div>
                    <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider block mb-1.5">
                      Calitate Video
                    </span>
                    <div className="space-y-1">
                      {['1080p Ultra HD', '720p HD', '480p SD'].map((q) => (
                        <button
                          key={q}
                          onClick={() => {
                            setQuality(q);
                            setShowSettingsMenu(false);
                          }}
                          className={`w-full flex items-center justify-between px-2 py-1 rounded text-left transition cursor-pointer ${
                            quality === q ? 'text-rose-400 font-bold' : 'text-neutral-400 hover:text-white'
                          }`}
                        >
                          <span>{q}</span>
                          {quality === q && <Check className="w-3 h-3 text-rose-400" />}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Subtitles */}
                  <div>
                    <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider block mb-1.5">
                      Subtitrare
                    </span>
                    <div className="space-y-1">
                      {['Română (Sub)', 'English (Sub)', 'Japoneză (Kanji)', 'Oprit'].map((sub) => (
                        <button
                          key={sub}
                          onClick={() => {
                            setSelectedSubtitles(sub);
                            setShowSettingsMenu(false);
                          }}
                          className={`w-full flex items-center justify-between px-2 py-1 rounded text-left transition cursor-pointer ${
                            selectedSubtitles === sub ? 'text-rose-400 font-bold' : 'text-neutral-400 hover:text-white'
                          }`}
                        >
                          <span>{sub}</span>
                          {selectedSubtitles === sub && <Check className="w-3 h-3 text-rose-400" />}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* PiP */}
            <button
              onClick={togglePip}
              className="p-2 text-neutral-400 hover:text-white transition cursor-pointer"
              title="Picture in Picture (P)"
            >
              <PictureInPicture className="w-4 h-4" />
            </button>

            {/* Fullscreen */}
            <button
              onClick={toggleFullscreen}
              className="p-2 text-neutral-400 hover:text-white transition cursor-pointer"
              title="Ecran complet (F)"
            >
              <Maximize className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
