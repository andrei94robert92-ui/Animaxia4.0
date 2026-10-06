import React, { useState, useRef, useEffect } from 'react';
import {
  Play, Pause, Volume2, VolumeX, Maximize, RotateCcw,
  RotateCw, FastForward, Settings, ListVideo, X, Check,
  SkipForward, PictureInPicture, ExternalLink
} from 'lucide-react';
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
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [showControls, setShowControls] = useState(true);
  const [showSettingsMenu, setShowSettingsMenu] = useState(false);
  const [showEpisodeDrawer, setShowEpisodeDrawer] = useState(false);

  const videoRef = useRef<HTMLVideoElement>(null);
  const playerContainerRef = useRef<HTMLDivElement>(null);
  const controlsTimeoutRef = useRef<any>(null);
  const progressSaveIntervalRef = useRef<any>(null);

  const currentEpisode = anime.episodes[currentEpisodeIndex] || anime.episodes[0];
  const streamType = currentEpisode.streamType || anime.streamType || 'mp4';
  const isEmbedPlayer = streamType === 'youtube' || streamType === 'vimeo' || streamType === 'iframe' || streamType === 'embed';

  // Initialize playback time if resuming HTML5
  useEffect(() => {
    if (videoRef.current && initialProgressSeconds > 0) {
      videoRef.current.currentTime = initialProgressSeconds;
      setCurrentTime(initialProgressSeconds);
    }
  }, [initialProgressSeconds]);

  // Handle episode change
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.currentTime = 0;
      setCurrentTime(0);
      videoRef.current.play().then(() => setIsPlaying(true)).catch(() => setIsPlaying(false));
    }
  }, [currentEpisodeIndex]);

  // Save progress periodically for HTML5
  useEffect(() => {
    progressSaveIntervalRef.current = setInterval(() => {
      if (videoRef.current && !videoRef.current.paused && currentEpisode) {
        saveProgress(false);
      }
    }, 4000);

    return () => {
      if (progressSaveIntervalRef.current) clearInterval(progressSaveIntervalRef.current);
      saveProgress(false);
    };
  }, [currentEpisodeIndex, anime.id]);

  const saveProgress = async (completed = false) => {
    const currSec = videoRef.current ? Math.floor(videoRef.current.currentTime) : 60;
    const durSec = videoRef.current ? Math.floor(videoRef.current.duration) || 1200 : 1200;

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
      console.error(err);
    }
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

  const toggleFullscreen = () => {
    if (!playerContainerRef.current) return;
    if (!document.fullscreenElement) {
      playerContainerRef.current.requestFullscreen().catch(console.error);
    } else {
      document.exitFullscreen().catch(console.error);
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
    currentEpisode.introEnd > currentEpisode.introStart &&
    currentTime >= currentEpisode.introStart &&
    currentTime <= currentEpisode.introEnd;

  return (
    <div
      ref={playerContainerRef}
      onMouseMove={() => {
        setShowControls(true);
        if (controlsTimeoutRef.current) clearTimeout(controlsTimeoutRef.current);
        controlsTimeoutRef.current = setTimeout(() => {
          if (isPlaying && !isEmbedPlayer) setShowControls(false);
        }, 3500);
      }}
      className="fixed inset-0 z-50 bg-black flex items-center justify-center select-none overflow-hidden"
    >
      {/* Top Header Overlay */}
      <div
        className={`absolute top-0 left-0 right-0 p-4 sm:p-6 bg-gradient-to-b from-black/90 via-black/50 to-transparent flex items-center justify-between transition-opacity duration-300 z-30 ${
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
          >
            <X className="w-5 h-5" />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-sm sm:text-base font-bold text-white tracking-wide">
                {anime.title}
              </h2>
              <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 border border-rose-500/30">
                {streamType.toUpperCase()}
              </span>
            </div>
            <p className="text-xs text-neutral-400 font-medium">
              {currentEpisode.title}
            </p>
          </div>
        </div>

        {/* Episode drawer button */}
        {anime.episodes.length > 1 && (
          <button
            onClick={() => setShowEpisodeDrawer(!showEpisodeDrawer)}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-neutral-900/90 hover:bg-neutral-800 text-xs font-semibold text-neutral-200 border border-neutral-700 transition cursor-pointer"
          >
            <ListVideo className="w-4 h-4 text-rose-400" />
            <span className="hidden sm:inline">Episoade ({anime.episodes.length})</span>
          </button>
        )}
      </div>

      {/* Media Rendering: Direct HTML5 or Universal Embed */}
      {isEmbedPlayer ? (
        <div className="w-full h-full pt-16 pb-4 px-4 flex items-center justify-center">
          <iframe
            src={currentEpisode.videoUrl}
            title={anime.title}
            className="w-full max-w-5xl aspect-video rounded-2xl shadow-2xl border border-neutral-800"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
      ) : (
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
          playsInline
        />
      )}

      {/* Skip Intro Floating Button */}
      {isInsideIntro && !isEmbedPlayer && (
        <button
          onClick={skipIntro}
          className="absolute bottom-24 right-8 z-30 flex items-center gap-2 px-4 py-2.5 rounded-xl bg-neutral-900/95 hover:bg-rose-600 text-white font-bold text-xs border border-neutral-700 shadow-2xl transition cursor-pointer animate-bounce"
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
                <img
                  src={ep.thumbnail || anime.coverImage}
                  alt={ep.title}
                  className="w-16 aspect-video rounded-md object-cover shrink-0"
                />
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-bold text-rose-400">Episodul {ep.episodeNumber}</p>
                  <p className="text-xs font-medium text-white truncate">{ep.title}</p>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Bottom Controls Bar for Native Streams */}
      {!isEmbedPlayer && (
        <div
          className={`absolute bottom-0 left-0 right-0 p-4 sm:p-6 bg-gradient-to-t from-black/95 via-black/60 to-transparent transition-opacity duration-300 z-30 ${
            showControls ? 'opacity-100' : 'opacity-0 pointer-events-none'
          }`}
        >
          {/* Progress Scrubber */}
          <div className="relative mb-3">
            <input
              type="range"
              min={0}
              max={duration || 100}
              step={0.1}
              value={currentTime}
              onChange={handleSeek}
              className="w-full h-1.5 hover:h-2 bg-neutral-800 rounded-lg appearance-none cursor-pointer accent-rose-500 transition-all"
            />
          </div>

          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <button
                onClick={togglePlay}
                className="w-10 h-10 rounded-full bg-rose-600 hover:bg-rose-500 text-white flex items-center justify-center transition cursor-pointer"
              >
                {isPlaying ? <Pause className="w-5 h-5 fill-white" /> : <Play className="w-5 h-5 fill-white translate-x-0.5" />}
              </button>

              <button
                onClick={() => skip(-10)}
                className="p-2 text-neutral-400 hover:text-white transition cursor-pointer"
                title="Înapoi 10s"
              >
                <RotateCcw className="w-4 h-4" />
              </button>

              <button
                onClick={() => skip(10)}
                className="p-2 text-neutral-400 hover:text-white transition cursor-pointer"
                title="Înainte 10s"
              >
                <RotateCw className="w-4 h-4" />
              </button>

              <div className="text-xs font-mono text-neutral-400">
                <span className="text-neutral-200">{formatTime(currentTime)}</span> / {formatTime(duration)}
              </div>
            </div>

            <div className="flex items-center gap-3">
              <span className="text-xs font-bold font-mono text-neutral-400 bg-neutral-900 px-2 py-1 rounded border border-neutral-800">
                {streamType.toUpperCase()}
              </span>

              <button
                onClick={toggleFullscreen}
                className="p-2 text-neutral-400 hover:text-white transition cursor-pointer"
              >
                <Maximize className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
