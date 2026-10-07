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
  onOpenKidsModal?: (channelName?: string) => void;
  onOpenAiLabModal?: (toolName?: string) => void;
  onOpenDiagnosticsModal?: (section?: 'all' | 'architecture' | 'cdn' | 'stress' | 'uptime') => void;
  onOpenTasteProfileModal?: (tab?: 'taste' | 'for_you' | 'reminders') => void;
  onOpenGlobalRegionsModal?: (continentName?: string) => void;
  onOpenUniversesModal?: (universeName?: string) => void;
  onOpenPremiumModal?: () => void;
  onOpenProfileModal?: () => void;
}

export const RightSidebarDrawer: React.FC<RightSidebarDrawerProps> = ({
  isOpen,
  onClose,
  onNavigate,
  onOpenMiner,
  onOpenStudio,
  onOpenCommandPalette,
  onOpenKidsModal,
  onOpenAiLabModal,
  onOpenDiagnosticsModal,
  onOpenTasteProfileModal,
  onOpenGlobalRegionsModal,
  onOpenUniversesModal,
  onOpenPremiumModal,
  onOpenProfileModal,
}) => {
  const [sidebarSearch, setSidebarSearch] = useState('');

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
    } else if (actionType === 'kids') {
      if (onOpenKidsModal) onOpenKidsModal(itemTitle);
      onClose();
    } else if (actionType === 'ailab') {
      if (onOpenAiLabModal) onOpenAiLabModal(itemTitle);
      onClose();
    } else if (actionType === 'universes') {
      if (onOpenUniversesModal) onOpenUniversesModal(itemTitle);
      onClose();
    } else if (actionType === 'regions') {
      if (onOpenGlobalRegionsModal) onOpenGlobalRegionsModal(itemTitle);
      onClose();
    } else if (actionType === 'profile') {
      if (onOpenProfileModal) onOpenProfileModal();
      onClose();
    } else if (actionType === 'taste' || actionType === 'for_you' || actionType === 'reminders') {
      if (onOpenTasteProfileModal) onOpenTasteProfileModal(actionType as any);
      onClose();
    } else if (actionType === 'diagnostics') {
      if (onOpenDiagnosticsModal) onOpenDiagnosticsModal(payload?.section || 'all');
      onClose();
    } else if (actionType === 'premium') {
      if (onOpenPremiumModal) onOpenPremiumModal();
      onClose();
    } else if (actionType === 'social') {
      onNavigate('home', { scrollTo: 'social-hub' });
      onClose();
    } else {
      if (onOpenAiLabModal) onOpenAiLabModal(itemTitle);
      onClose();
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
                placeholder="Caută în meniuri, canale, AI..."
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
                { title: 'Catalog Complet', tab: 'catalog', icon: '📚' },
                { title: 'Filme', tab: 'catalog', category: 'movie', icon: '🎬' },
                { title: 'Seriale', tab: 'catalog', category: 'series', icon: '📺' },
                { title: 'Anime', tab: 'catalog', category: 'anime', icon: '⚔️' },
                { title: 'Sport', tab: 'catalog', category: 'sport', icon: '⚽' },
                { title: 'Copii & Desene', tab: 'catalog', genre: 'Animation', icon: '🎨' },
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

            {/* SECTION 2: CANALE KIDS & ANIMAȚIE */}
            <div className="space-y-1">
              <div className="flex items-center justify-between px-3 py-1">
                <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider">
                  Canale Kids &amp; Animație
                </span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-500/15 text-amber-300 border border-amber-500/30">
                  Live 24/7
                </span>
              </div>
              {[
                { title: 'Jetix', icon: '⚡' },
                { title: 'Fox Kids', icon: '🦊' },
                { title: 'Cartoon Network', icon: '📺' },
                { title: 'Boomerang', icon: '🪃' },
                { title: 'Disney Channel', icon: '🪄' },
                { title: 'Minimax', icon: '🎈' },
                { title: 'Nickelodeon', icon: '🧽' },
                { title: 'Nicktoons', icon: '🛸' },
              ].filter(item => matchesSearch(item.title)).map((item) => (
                <button
                  key={item.title}
                  onClick={() => handleAction(item.title, 'kids')}
                  className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-neutral-300 hover:text-white hover:bg-neutral-900 transition text-left cursor-pointer group"
                >
                  <span className="flex items-center gap-2.5 font-medium">
                    <span>{item.icon}</span>
                    <span>{item.title}</span>
                  </span>
                  <span className="text-[10px] text-amber-400 font-mono font-bold group-hover:underline">
                    Emite Live &gt;
                  </span>
                </button>
              ))}
            </div>

            {/* SECTION 3: AI LAB (8 CAPABILITĂȚI AI) */}
            <div className="space-y-1">
              <div className="flex items-center justify-between px-3 py-1">
                <span className="text-[10px] font-bold text-rose-400 uppercase tracking-wider">
                  AI Lab Suite
                </span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-rose-500/15 text-rose-300 border border-rose-500/30">
                  8 Instrumente
                </span>
              </div>

              {[
                { title: 'AI Companion', icon: '💬', action: 'ailab' },
                { title: 'AI Recap', icon: '⏪', action: 'ailab' },
                { title: 'AI Mood Playlist', icon: '🎭', action: 'ailab' },
                { title: 'AI Spoiler Shield', icon: '🛡️', action: 'ailab' },
                { title: 'AI Dubbing & Audio', icon: '🎙️', action: 'ailab' },
                { title: 'AI Curation', icon: '🎯', action: 'ailab' },
                { title: 'AI Playlist Editor', icon: '✨', action: 'ailab' },
                { title: 'AI Miner Stream', icon: '⛏️', action: 'miner' },
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

            {/* SECTION 4: PERSONALIZARE (PERSONALIZARE 2.0) */}
            <div className="space-y-1">
              <div className="flex items-center justify-between px-3 py-1">
                <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider">
                  Personalizare 2.0
                </span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-neutral-800 text-neutral-300">
                  Preferințe
                </span>
              </div>

              {[
                { title: 'Profil de gust', icon: '🎭', action: 'taste' },
                { title: 'Pentru Tine', icon: '✨', action: 'for_you' },
                { title: 'Memento-uri Episod', icon: '⏰', action: 'reminders' },
                { title: 'Gestionare Profiluri', icon: '👥', action: 'profile' },
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

            {/* SECTION 5: UNIVERSURI */}
            <div className="space-y-1">
              <p className="text-[10px] font-bold text-purple-400 uppercase tracking-wider px-3 py-1">
                Universuri &amp; Francize
              </p>
              {[
                { title: 'Francize Anime de Top', icon: '⚔️' },
                { title: 'Trilogii & Open Movies', icon: '🎬' },
                { title: 'Universul Marvel Animat', icon: '🦸' },
                { title: 'Universul Cyberpunk & Sci-Fi', icon: '🌃' },
                { title: 'Blockbustere Animate Mondiale', icon: '💥' },
              ].filter(item => matchesSearch(item.title)).map((item) => (
                <button
                  key={item.title}
                  onClick={() => handleAction(item.title, 'universes')}
                  className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-neutral-300 hover:text-white hover:bg-neutral-900 transition text-left cursor-pointer group"
                >
                  <span className="flex items-center gap-2.5 font-medium">
                    <span>{item.icon}</span>
                    <span>{item.title}</span>
                  </span>
                  <ChevronRight className="w-3.5 h-3.5 text-neutral-600 group-hover:text-purple-400 transition" />
                </button>
              ))}
            </div>

            {/* SECTION 6: LUMEA — 196 ȚĂRI */}
            <div className="space-y-1">
              <p className="text-[10px] font-bold text-blue-400 uppercase tracking-wider px-3 py-1">
                Lumea — 196 țări
              </p>
              {[
                { title: 'Asia', icon: '🏯' },
                { title: 'Europa', icon: '🇪🇺' },
                { title: 'America de Nord', icon: '🌎' },
                { title: 'America de Sud', icon: '🌏' },
                { title: 'Africa', icon: '🌍' },
                { title: 'Oceania', icon: '🏝️' },
              ].filter(item => matchesSearch(item.title)).map((item) => (
                <button
                  key={item.title}
                  onClick={() => handleAction(item.title, 'regions')}
                  className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-neutral-300 hover:text-white hover:bg-neutral-900 transition text-left cursor-pointer group"
                >
                  <span className="flex items-center gap-2.5 font-medium">
                    <span>{item.icon}</span>
                    <span>{item.title}</span>
                  </span>
                  <ChevronRight className="w-3.5 h-3.5 text-neutral-600 group-hover:text-blue-400 transition" />
                </button>
              ))}
            </div>

            {/* SECTION 7: CONT & SISTEM */}
            <div className="space-y-1">
              <p className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider px-3 py-1">
                Cont &amp; Diagnosticare Sistem
              </p>
              {[
                { title: 'Istoric de Vizionare', tab: 'history', icon: '🕒' },
                { title: 'Lista Mea & Colecții', tab: 'watchlist', icon: '🔖' },
                { title: 'Arhitectura Reală & Strat Edge', action: 'diagnostics', section: 'architecture', icon: '⚡' },
                { title: 'Stres & Stabilitate Bază de Date', action: 'diagnostics', section: 'stress', icon: '🛡️' },
                { title: 'Stare Platformă & Uptime', action: 'diagnostics', section: 'uptime', icon: '🟢' },
                { title: 'Panou Administrare Studio', action: 'studio', icon: '🛠️' },
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
                  <ChevronRight className="w-3.5 h-3.5 text-neutral-600 group-hover:text-emerald-400 transition" />
                </button>
              ))}
            </div>

            {/* SECTION 8: PLATFORMĂ & VIP */}
            <div className="space-y-1">
              <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider px-3 py-1">
                Platformă &amp; Beneficii
              </p>
              {[
                { title: 'Planuri Premium & VIP Pass', icon: '👑', action: 'premium' },
                { title: 'Miner Video Stream & Sniffer', icon: '⛏️', action: 'miner' },
                { title: 'Strat Edge & Viteze CDN', icon: '🌐', action: 'diagnostics', section: 'cdn' },
                { title: 'Activitatea Comunității', icon: '⚡', action: 'social' },
              ].filter(item => matchesSearch(item.title)).map((item) => (
                <button
                  key={item.title}
                  onClick={() => handleAction(item.title, item.action, item)}
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
                if (onOpenProfileModal) onOpenProfileModal();
                onClose();
              }}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-rose-600 to-rose-500 hover:from-rose-500 hover:to-rose-600 text-white font-bold text-xs uppercase tracking-wider shadow-lg shadow-rose-600/30 transition cursor-pointer text-center"
            >
              Gestionează Cont / Profil
            </button>
            <p className="text-[10px] text-center text-neutral-500 font-mono">
              Animaxia Universal v3.0 · Toate meniurile sunt 100% reale
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
