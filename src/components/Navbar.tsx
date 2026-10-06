import React, { useState } from 'react';
import {
  Play, Search, Bookmark, History, Database, Tv, Sparkles,
  Command, Film, Trophy, Compass, User, Menu
} from 'lucide-react';
import { UserProfile } from '../types/anime';

interface NavbarProps {
  currentTab: string;
  setCurrentTab: (tab: any) => void;
  selectedCategory: string;
  setSelectedCategory: (cat: string) => void;
  currentUser: UserProfile;
  users: UserProfile[];
  onSelectUser: (user: UserProfile) => void;
  onOpenStudio: () => void;
  onOpenCommandPalette: () => void;
  onOpenRightSidebar: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  setCurrentTab,
  selectedCategory,
  setSelectedCategory,
  currentUser,
  users,
  onSelectUser,
  onOpenStudio,
  onOpenCommandPalette,
  onOpenRightSidebar,
}) => {
  const [showUserMenu, setShowUserMenu] = useState(false);

  return (
    <header className="sticky top-0 z-40 w-full bg-neutral-950/90 backdrop-blur-md border-b border-neutral-800/80 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-3">
        {/* Brand Logo & Tagline */}
        <div className="flex items-center gap-6">
          <button
            onClick={() => {
              setCurrentTab('home');
              setSelectedCategory('all');
            }}
            className="flex items-center gap-2.5 group text-left cursor-pointer focus:outline-none"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-rose-600 via-rose-500 to-amber-500 flex items-center justify-center shadow-lg shadow-rose-600/25 group-hover:scale-105 transition-transform duration-200">
              <Play className="w-5 h-5 text-white fill-white translate-x-0.5" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-xl font-black tracking-tight bg-gradient-to-r from-white via-neutral-100 to-rose-200 bg-clip-text text-transparent font-['Space_Grotesk']">
                  ANIMAXIA
                </span>
                <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-rose-500/20 text-rose-400 border border-rose-500/30">
                  Universal
                </span>
              </div>
              <p className="text-[10px] text-neutral-400 font-medium tracking-wide">
                Vizionează totul
              </p>
            </div>
          </button>

          {/* Nav Categories */}
          <nav className="hidden lg:flex items-center gap-1 text-xs font-semibold">
            <button
              onClick={() => {
                setCurrentTab('home');
                setSelectedCategory('all');
              }}
              className={`px-3 py-1.5 rounded-lg transition cursor-pointer ${
                currentTab === 'home' && selectedCategory === 'all'
                  ? 'bg-neutral-800 text-white shadow-sm'
                  : 'text-neutral-400 hover:text-white hover:bg-neutral-900'
              }`}
            >
              Acasă
            </button>
            <button
              onClick={() => {
                setCurrentTab('home');
                setSelectedCategory('movie');
              }}
              className={`px-3 py-1.5 rounded-lg transition cursor-pointer ${
                selectedCategory === 'movie'
                  ? 'bg-neutral-800 text-white shadow-sm'
                  : 'text-neutral-400 hover:text-white hover:bg-neutral-900'
              }`}
            >
              Filme
            </button>
            <button
              onClick={() => {
                setCurrentTab('home');
                setSelectedCategory('series');
              }}
              className={`px-3 py-1.5 rounded-lg transition cursor-pointer ${
                selectedCategory === 'series'
                  ? 'bg-neutral-800 text-white shadow-sm'
                  : 'text-neutral-400 hover:text-white hover:bg-neutral-900'
              }`}
            >
              Seriale
            </button>
            <button
              onClick={() => {
                setCurrentTab('home');
                setSelectedCategory('anime');
              }}
              className={`px-3 py-1.5 rounded-lg transition cursor-pointer ${
                selectedCategory === 'anime'
                  ? 'bg-neutral-800 text-white shadow-sm'
                  : 'text-neutral-400 hover:text-white hover:bg-neutral-900'
              }`}
            >
              Anime
            </button>
            <button
              onClick={() => {
                setCurrentTab('home');
                setSelectedCategory('sport');
              }}
              className={`px-3 py-1.5 rounded-lg transition cursor-pointer ${
                selectedCategory === 'sport'
                  ? 'bg-neutral-800 text-white shadow-sm'
                  : 'text-neutral-400 hover:text-white hover:bg-neutral-900'
              }`}
            >
              Sport
            </button>
            <button
              onClick={() => {
                setCurrentTab('home');
                setSelectedCategory('mined');
              }}
              className={`px-3 py-1.5 rounded-lg transition cursor-pointer ${
                selectedCategory === 'mined'
                  ? 'bg-neutral-800 text-white shadow-sm'
                  : 'text-neutral-400 hover:text-white hover:bg-neutral-900'
              }`}
            >
              Minate
            </button>
            <button
              onClick={() => setCurrentTab('watchlist')}
              className={`px-3 py-1.5 rounded-lg transition flex items-center gap-1.5 cursor-pointer ${
                currentTab === 'watchlist'
                  ? 'bg-neutral-800 text-white shadow-sm'
                  : 'text-neutral-400 hover:text-white hover:bg-neutral-900'
              }`}
            >
              <Bookmark className="w-3.5 h-3.5" />
              Lista Mea
            </button>
            <button
              onClick={() => setCurrentTab('history')}
              className={`px-3 py-1.5 rounded-lg transition flex items-center gap-1.5 cursor-pointer ${
                currentTab === 'history'
                  ? 'bg-neutral-800 text-white shadow-sm'
                  : 'text-neutral-400 hover:text-white hover:bg-neutral-900'
              }`}
            >
              <History className="w-3.5 h-3.5" />
              Istoric
            </button>
          </nav>
        </div>

        {/* Right Tools: CMD+K Search trigger, Studio, Profile */}
        <div className="flex items-center gap-2.5">
          {/* CMD+K Search Button */}
          <button
            onClick={onOpenCommandPalette}
            className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-neutral-900/90 hover:bg-neutral-800 text-neutral-400 hover:text-white border border-neutral-800 text-xs transition cursor-pointer"
          >
            <Search className="w-3.5 h-3.5 text-neutral-400" />
            <span className="hidden sm:inline">Caută titluri, anime, filme…</span>
            <span className="sm:hidden">Caută...</span>
            <kbd className="hidden md:inline-flex items-center gap-0.5 text-[10px] font-mono px-1.5 py-0.5 bg-neutral-800 rounded border border-neutral-700 text-neutral-300">
              ⌘K
            </kbd>
          </button>

          {/* Admin Studio Local DB */}
          <button
            onClick={onOpenStudio}
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-neutral-300 text-xs font-semibold border border-neutral-800 transition cursor-pointer"
            title="Panou Admin & Bază de date"
          >
            <Database className="w-3.5 h-3.5 text-rose-400" />
            <span className="hidden xl:inline">Panou Admin</span>
          </button>

          {/* Profile / Conectare */}
          <div className="relative">
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center gap-2 p-1.5 bg-neutral-900 hover:bg-neutral-800 rounded-xl border border-neutral-800 transition cursor-pointer"
            >
              <img
                src={currentUser.avatar}
                alt={currentUser.name}
                className="w-7 h-7 rounded-lg object-cover ring-1 ring-neutral-700"
              />
              <span className="text-xs font-semibold text-white hidden md:inline">
                {currentUser.name}
              </span>
            </button>

            {showUserMenu && (
              <div className="absolute right-0 mt-2 w-56 bg-neutral-900 rounded-xl border border-neutral-800 shadow-2xl py-2 z-50">
                <div className="px-3 py-2 border-b border-neutral-800 text-xs">
                  <p className="text-neutral-400">Autentificat ca:</p>
                  <p className="font-bold text-white mt-0.5">{currentUser.name}</p>
                  <p className="text-[11px] text-neutral-500">{currentUser.tag}</p>
                </div>

                <div className="px-2 py-1.5">
                  <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider px-2 py-1">
                    Schimbă Profilul
                  </p>
                  {users.map((u) => (
                    <button
                      key={u.id}
                      onClick={() => {
                        onSelectUser(u);
                        setShowUserMenu(false);
                      }}
                      className={`w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs font-medium text-left transition cursor-pointer ${
                        u.id === currentUser.id
                          ? 'bg-rose-500/10 text-rose-300 font-semibold'
                          : 'text-neutral-300 hover:bg-neutral-800'
                      }`}
                    >
                      <img
                        src={u.avatar}
                        alt={u.name}
                        className="w-5 h-5 rounded-md object-cover"
                      />
                      <span className="truncate flex-1">{u.name}</span>
                    </button>
                  ))}
                </div>

                <div className="border-t border-neutral-800 mt-1 pt-1 px-2">
                  <button
                    onClick={() => {
                      onOpenStudio();
                      setShowUserMenu(false);
                    }}
                    className="w-full flex items-center gap-2 px-2.5 py-1.5 text-xs text-neutral-300 hover:text-white hover:bg-neutral-800 rounded-lg transition"
                  >
                    <Database className="w-3.5 h-3.5 text-rose-400" />
                    <span>Panou Bază de Date</span>
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Top Right Sidebar Drawer Button */}
          <button
            onClick={onOpenRightSidebar}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-rose-600 via-rose-500 to-amber-500 hover:from-rose-500 hover:to-rose-600 text-white font-bold text-xs shadow-md shadow-rose-600/30 hover:scale-105 active:scale-95 transition-all cursor-pointer"
            title="Deschide Meniul Sidebar Complet (AI Suite, Canale Kids, Universuri, Lumea)"
          >
            <Menu className="w-4 h-4" />
            <span className="hidden sm:inline">Meniu</span>
          </button>
        </div>
      </div>
    </header>
  );
};
