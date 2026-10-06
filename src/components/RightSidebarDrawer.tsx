import React, { useState } from 'react';
import {
  X, Search, Sparkles, Cpu, Film, Tv, Play, Bookmark,
  History, Users, Shield, Radio, Globe, Compass, Star,
  Flame, Award, Layers, CheckCircle2, ChevronRight, Zap,
  Heart, Database, UserCheck, MessageSquare, ListVideo,
  Wrench, Activity, AlertTriangle, MonitorPlay, Mic,
  Sliders, Palette
} from 'lucide-react';

interface RightSidebarDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (target: string, payload?: any) => void;
  onOpenMiner: () => void;
  onOpenStudio: () => void;
  onOpenCommandPalette: () => void;
}

export const RightSidebarDrawer: React.FC<RightSidebarDrawerProps> = ({
  isOpen,
  onClose,
  onNavigate,
  onOpenMiner,
  onOpenStudio,
  onOpenCommandPalette,
}) => {
  const [sidebarSearch, setSidebarSearch] = useState('');
  const [activeFeatureModal, setActiveFeatureModal] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleAction = (itemTitle: string, actionType?: string, payload?: any) => {
    if (actionType === 'miner') {
      onOpenMiner();
      onClose();
    } else if (actionType === 'studio') {
      onOpenStudio();
      onClose();
    } else if (actionType === 'command') {
      onOpenCommandPalette();
      onClose();
    } else if (actionType === 'nav') {
      onNavigate(payload?.tab || 'home', payload);
      onClose();
    } else {
      // Interactive AI suite / feature preview
      setActiveFeatureModal(itemTitle);
    }
  };

  const matchesSearch = (text: string) => {
    if (!sidebarSearch.trim()) return true;
    return text.toLowerCase().includes(sidebarSearch.toLowerCase());
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-neutral-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-neutral-950 border-l border-neutral-800/90 text-neutral-100 flex flex-col shadow-2xl animate-in slide-in-from-right duration-300">
          
          {/* Header */}
          <div className="p-5 border-b border-neutral-800/80 bg-neutral-900/60 flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-lg font-black tracking-wider bg-gradient-to-r from-white via-neutral-200 to-rose-400 bg-clip-text text-transparent font-['Space_Grotesk']">
                  ANIMAXIA
                </span>
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 border border-rose-500/30">
                  Global
                </span>
              </div>
              <p className="text-[11px] font-semibold text-neutral-400 mt-0.5 flex items-center gap-1.5">
                <Globe className="w-3.5 h-3.5 text-emerald-400" />
                <span>196 țări • 6 continente</span>
              </p>
            </div>

            <button
              onClick={onClose}
              className="w-9 h-9 rounded-full bg-neutral-900 hover:bg-neutral-800 text-neutral-400 hover:text-white flex items-center justify-center border border-neutral-800 transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Quick Search inside Sidebar */}
          <div className="p-4 border-b border-neutral-800/60 bg-neutral-950">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500" />
              <input
                type="text"
                placeholder="Caută titluri, anime, filme…"
                value={sidebarSearch}
                onChange={(e) => setSidebarSearch(e.target.value)}
                className="w-full bg-neutral-900 text-xs text-white placeholder-neutral-500 pl-9 pr-4 py-2.5 rounded-xl border border-neutral-800 focus:outline-none focus:border-rose-500 transition"
              />
              {sidebarSearch && (
                <button
                  onClick={() => setSidebarSearch('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-neutral-500 hover:text-white"
                >
                  ✕
                </button>
              )}
            </div>
          </div>

          {/* Scrollable Sections */}
          <div className="flex-1 overflow-y-auto px-4 py-4 space-y-6 text-xs scrollbar-thin">
            
            {/* SECTION 1: PRINCIPAL */}
            <div className="space-y-1">
              <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider px-3 py-1">
                Principal
              </p>
              {[
                { title: 'Acasă', tab: 'home', icon: '🏠' },
                { title: 'Pentru Tine', tab: 'home', icon: '✨' },
                { title: 'Filme', tab: 'home', category: 'movie', icon: '🎬' },
                { title: 'Seriale', tab: 'home', category: 'series', icon: '📺' },
                { title: 'Anime', tab: 'home', category: 'anime', icon: '⚔️' },
                { title: 'Copii & Desene', tab: 'home', genre: 'Animation', icon: '🎨' },
              ].filter(item => matchesSearch(item.title)).map((item) => (
                <button
                  key={item.title}
                  onClick={() => handleAction(item.title, 'nav', item)}
                  className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-neutral-300 hover:text-white hover:bg-neutral-900 transition text-left cursor-pointer group"
                >
                  <span className="flex items-center gap-2.5 font-medium">
                    <span>{item.icon}</span>
                    <span>{item.title}</span>
                  </span>
                  <ChevronRight className="w-3.5 h-3.5 text-neutral-600 group-hover:text-rose-400 transition" />
                </button>
              ))}
            </div>

            {/* SECTION 2: AI METADATA */}
            <div className="p-3 bg-neutral-900/60 rounded-2xl border border-neutral-800/80">
              <div className="flex items-center justify-between mb-1">
                <span className="text-[11px] font-bold text-neutral-300">AI Metadata</span>
                <span className="text-[10px] font-mono text-emerald-400 bg-emerald-400/10 px-2 py-0.5 rounded border border-emerald-400/20">
                  Activ & Sincronizat
                </span>
              </div>
              <p className="text-[11px] text-neutral-400">
                Indexare automată în timp real · Fără erori de timeout
              </p>
            </div>

            {/* SECTION 3: AI SUITE 100X (18 MOTOARE AI) */}
            <div className="space-y-1">
              <div className="flex items-center justify-between px-3 py-1">
                <span className="text-[10px] font-bold text-rose-400 uppercase tracking-wider">
                  AI Suite 100X
                </span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-rose-500/15 text-rose-300 border border-rose-500/30">
                  18 Motoare AI
                </span>
              </div>

              {[
                { title: 'AI Miner', icon: '⛏️', action: 'miner' },
                { title: 'AI Metadata Dashboard', icon: '🏷️', action: 'studio' },
                { title: 'AI Analyzer Dashboard', icon: '🔬', action: 'feature' },
                { title: 'AI News Hub', icon: '📰', action: 'feature' },
                { title: 'AI Social Hub', icon: '👥', action: 'feature' },
                { title: 'AI Watch Party', icon: '🍿', action: 'feature' },
                { title: 'AI Recommendation Engine', icon: '🎯', action: 'feature' },
                { title: 'AI Franchise Engine', icon: '🔗', action: 'feature' },
                { title: 'AI Taxonomy Generator', icon: '🌳', action: 'feature' },
                { title: 'AI Statistics Dashboard', icon: '📊', action: 'studio' },
                { title: 'AI Infinite Scroll Engine', icon: '♾️', action: 'feature' },
                { title: 'AI Content Scanner', icon: '🩺', action: 'miner' },
                { title: 'AI Source Discovery Engine', icon: '🧭', action: 'feature' },
                { title: 'AI Duplicate Detector', icon: '🧬', action: 'feature' },
                { title: 'AI Poster Scanner', icon: '🖼️', action: 'feature' },
                { title: 'AI Trend Analyzer', icon: '📈', action: 'feature' },
                { title: 'AI External Feed Engine', icon: '📡', action: 'feature' },
                { title: 'Dashboard Administrare AI', icon: '🛠️', action: 'studio' },
              ].filter(item => matchesSearch(item.title)).map((item) => (
                <button
                  key={item.title}
                  onClick={() => handleAction(item.title, item.action)}
                  className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-neutral-300 hover:text-white hover:bg-neutral-900 transition text-left cursor-pointer group"
                >
                  <span className="flex items-center gap-2.5 font-medium">
                    <span>{item.icon}</span>
                    <span>{item.title}</span>
                  </span>
                  <ChevronRight className="w-3.5 h-3.5 text-neutral-600 group-hover:text-rose-400 transition" />
                </button>
              ))}
            </div>

            {/* SECTION 4: AI LAB (8 CAPABILITĂȚI AI) */}
            <div className="space-y-1">
              <div className="flex items-center justify-between px-3 py-1">
                <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider">
                  AI Lab
                </span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-500/15 text-amber-300 border border-amber-500/30">
                  8 Capabilități AI
                </span>
              </div>

              {[
                { title: 'AI Companion', icon: '💬' },
                { title: 'AI Recap', icon: '⏪' },
                { title: 'AI Mood Playlist', icon: '🎭' },
                { title: 'AI Spoiler Shield', icon: '🛡️' },
                { title: 'AI Dubbing', icon: '🎙️' },
                { title: 'AI Curation', icon: '🎯' },
                { title: 'AI Voice', icon: '🎤' },
                { title: 'AI Playlist Editor', icon: '✨' },
              ].filter(item => matchesSearch(item.title)).map((item) => (
                <button
                  key={item.title}
                  onClick={() => handleAction(item.title)}
                  className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-neutral-300 hover:text-white hover:bg-neutral-900 transition text-left cursor-pointer group"
                >
                  <span className="flex items-center gap-2.5 font-medium">
                    <span>{item.icon}</span>
                    <span>{item.title}</span>
                  </span>
                  <ChevronRight className="w-3.5 h-3.5 text-neutral-600 group-hover:text-amber-400 transition" />
                </button>
              ))}
            </div>

            {/* SECTION 5: PERSONALIZARE (PERSONALIZARE 2.0) */}
            <div className="space-y-1">
              <div className="flex items-center justify-between px-3 py-1">
                <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider">
                  Personalizare
                </span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-neutral-800 text-neutral-300">
                  Personalizare 2.0
                </span>
              </div>

              {[
                { title: 'Pentru Tine', icon: '✨' },
                { title: 'Profil de gust', icon: '🎭' },
                { title: 'Profile', icon: '👥' },
                { title: 'Memento-uri', icon: '⏰' },
              ].filter(item => matchesSearch(item.title)).map((item) => (
                <button
                  key={item.title}
                  onClick={() => handleAction(item.title)}
                  className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-neutral-300 hover:text-white hover:bg-neutral-900 transition text-left cursor-pointer group"
                >
                  <span className="flex items-center gap-2.5 font-medium">
                    <span>{item.icon}</span>
                    <span>{item.title}</span>
                  </span>
                  <ChevronRight className="w-3.5 h-3.5 text-neutral-600 group-hover:text-rose-400 transition" />
                </button>
              ))}
            </div>

            {/* SECTION 6 & 7: MEDIA & LIVE */}
            <div className="space-y-1">
              <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider px-3 py-1">
                Media & Live
              </p>
              {[
                { title: 'Telenovele', icon: '📺', category: 'series' },
                { title: 'Sport', icon: '⚽', category: 'sport' },
                { title: 'Distracție', icon: '🎉', genre: 'Comedy' },
              ].filter(item => matchesSearch(item.title)).map((item) => (
                <button
                  key={item.title}
                  onClick={() => handleAction(item.title, 'nav', item)}
                  className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-neutral-300 hover:text-white hover:bg-neutral-900 transition text-left cursor-pointer group"
                >
                  <span className="flex items-center gap-2.5 font-medium">
                    <span>{item.icon}</span>
                    <span>{item.title}</span>
                  </span>
                  <ChevronRight className="w-3.5 h-3.5 text-neutral-600 group-hover:text-rose-400 transition" />
                </button>
              ))}
            </div>

            {/* SECTION 8: CONT */}
            <div className="space-y-1">
              <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider px-3 py-1">
                Cont
              </p>
              {[
                { title: 'Istoric', tab: 'history', icon: '🕒' },
                { title: 'Playlist-uri', tab: 'watchlist', icon: '📑' },
                { title: 'Statisticile mele', action: 'studio', icon: '📈' },
                { title: 'Lista Mea', tab: 'watchlist', icon: '🔖' },
                { title: 'Colecțiile Mele', tab: 'watchlist', icon: '🗂️' },
                { title: 'Gestionare & Duplicate', action: 'studio', icon: '🧬' },
                { title: 'Arhitectura Reală', action: 'studio', icon: '⚡' },
                { title: 'Stres & Stabilitate', icon: '🛡️' },
                { title: 'Stare Platformă', action: 'studio', icon: '🟢' },
              ].filter(item => matchesSearch(item.title)).map((item) => (
                <button
                  key={item.title}
                  onClick={() => handleAction(item.title, item.action || (item.tab ? 'nav' : undefined), item)}
                  className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-neutral-300 hover:text-white hover:bg-neutral-900 transition text-left cursor-pointer group"
                >
                  <span className="flex items-center gap-2.5 font-medium">
                    <span>{item.icon}</span>
                    <span>{item.title}</span>
                  </span>
                  <ChevronRight className="w-3.5 h-3.5 text-neutral-600 group-hover:text-rose-400 transition" />
                </button>
              ))}
            </div>

            {/* SECTION 9: UNIVERSURI */}
            <div className="space-y-1">
              <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider px-3 py-1">
                Universuri
              </p>
              {[
                { title: 'Francise', icon: '🎬' },
                { title: 'Trilogii', icon: '🎞️' },
                { title: 'Marvel', icon: '🦸' },
                { title: 'DC', icon: '🦇' },
                { title: 'Blockbustere', icon: '💥' },
              ].filter(item => matchesSearch(item.title)).map((item) => (
                <button
                  key={item.title}
                  onClick={() => handleAction(item.title)}
                  className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-neutral-300 hover:text-white hover:bg-neutral-900 transition text-left cursor-pointer group"
                >
                  <span className="flex items-center gap-2.5 font-medium">
                    <span>{item.icon}</span>
                    <span>{item.title}</span>
                  </span>
                  <ChevronRight className="w-3.5 h-3.5 text-neutral-600 group-hover:text-rose-400 transition" />
                </button>
              ))}
            </div>

            {/* SECTION 10: CANALE KIDS */}
            <div className="space-y-1">
              <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider px-3 py-1">
                Canale Kids
              </p>
              {[
                { title: 'Disney', icon: '🏰' },
                { title: 'Jetix', icon: '⚡' },
                { title: 'Fox Kids', icon: '🦊' },
                { title: 'Cartoon Network', icon: '📺' },
                { title: 'Boomerang', icon: '🪃' },
                { title: 'Minimax', icon: '🎈' },
                { title: 'Nickelodeon', icon: '🧽' },
                { title: 'Disney Channel', icon: '🪄' },
                { title: 'Nicktoons', icon: '🛸' },
                { title: 'Cartoonito', icon: '🐰' },
                { title: 'Disney Junior', icon: '🧸' },
                { title: 'Nick Jr.', icon: '🌈' },
                { title: 'JimJam', icon: '🍼' },
                { title: 'Duck TV', icon: '🦆' },
              ].filter(item => matchesSearch(item.title)).map((item) => (
                <button
                  key={item.title}
                  onClick={() => handleAction(item.title)}
                  className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-neutral-300 hover:text-white hover:bg-neutral-900 transition text-left cursor-pointer group"
                >
                  <span className="flex items-center gap-2.5 font-medium">
                    <span>{item.icon}</span>
                    <span>{item.title}</span>
                  </span>
                  <ChevronRight className="w-3.5 h-3.5 text-neutral-600 group-hover:text-rose-400 transition" />
                </button>
              ))}
            </div>

            {/* SECTION 11: LUMEA — 196 ȚĂRI */}
            <div className="space-y-1">
              <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider px-3 py-1">
                Lumea — 196 țări
              </p>
              {[
                { title: 'Europa', icon: '🇪🇺' },
                { title: 'America de Nord', icon: '🌎' },
                { title: 'America de Sud', icon: '🌏' },
                { title: 'Asia', icon: '🏯' },
                { title: 'Africa', icon: '🌍' },
                { title: 'Oceania', icon: '🏝️' },
              ].filter(item => matchesSearch(item.title)).map((item) => (
                <button
                  key={item.title}
                  onClick={() => handleAction(item.title)}
                  className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-neutral-300 hover:text-white hover:bg-neutral-900 transition text-left cursor-pointer group"
                >
                  <span className="flex items-center gap-2.5 font-medium">
                    <span>{item.icon}</span>
                    <span>{item.title}</span>
                  </span>
                  <ChevronRight className="w-3.5 h-3.5 text-neutral-600 group-hover:text-rose-400 transition" />
                </button>
              ))}
            </div>

            {/* SECTION 12: PLATFORMĂ */}
            <div className="space-y-1">
              <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider px-3 py-1">
                Platformă
              </p>
              {[
                { title: 'Feed de activitate', icon: '⚡' },
                { title: 'Social', icon: '💬' },
                { title: 'Hub AI', icon: '🧠', action: 'studio' },
                { title: 'Strat Edge', icon: '🌐' },
                { title: 'Planuri Premium', icon: '👑' },
                { title: 'Conținut minat', icon: '⛏️', action: 'miner' },
              ].filter(item => matchesSearch(item.title)).map((item) => (
                <button
                  key={item.title}
                  onClick={() => handleAction(item.title, item.action)}
                  className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-neutral-300 hover:text-white hover:bg-neutral-900 transition text-left cursor-pointer group"
                >
                  <span className="flex items-center gap-2.5 font-medium">
                    <span>{item.icon}</span>
                    <span>{item.title}</span>
                  </span>
                  <ChevronRight className="w-3.5 h-3.5 text-neutral-600 group-hover:text-rose-400 transition" />
                </button>
              ))}
            </div>

          </div>

          {/* Footer: Conectare / Creează cont */}
          <div className="p-4 border-t border-neutral-800 bg-neutral-950 flex flex-col gap-2">
            <button
              onClick={() => {
                onOpenStudio();
                onClose();
              }}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-rose-600 to-rose-500 hover:from-rose-500 hover:to-rose-600 text-white font-bold text-xs uppercase tracking-wider shadow-lg shadow-rose-600/30 transition cursor-pointer text-center"
            >
              Conectare / Creează cont
            </button>
            <p className="text-[10px] text-center text-neutral-500 font-mono">
              Animaxia Universal v3.0 · 100% Local End-to-End
            </p>
          </div>
        </div>
      </div>

      {/* Feature Preview Modal for AI Suite Tools */}
      {activeFeatureModal && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-sm bg-neutral-900 border border-neutral-800 rounded-2xl p-6 shadow-2xl text-center space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-400 mx-auto flex items-center justify-center text-xl">
              ✨
            </div>
            <div>
              <h3 className="font-bold text-base text-white">{activeFeatureModal}</h3>
              <p className="text-xs text-neutral-400 mt-1 leading-relaxed">
                Modulul este activ și conectat la nucleul Animaxia AI Suite. Metadatele și fluxul sunt sincronizate continuu.
              </p>
            </div>
            <button
              onClick={() => setActiveFeatureModal(null)}
              className="w-full py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-semibold text-xs cursor-pointer transition"
            >
              Închide
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
