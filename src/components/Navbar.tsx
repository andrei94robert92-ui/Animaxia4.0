import React from 'react';
import { Play, Search, Bookmark, History, Database, Tv, Sparkles, User, ShieldCheck } from 'lucide-react';
import { UserProfile } from '../types/anime';

interface NavbarProps {
  currentTab: 'home' | 'catalog' | 'watchlist' | 'history';
  setCurrentTab: (tab: 'home' | 'catalog' | 'watchlist' | 'history') => void;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  currentUser: UserProfile;
  users: UserProfile[];
  onSelectUser: (user: UserProfile) => void;
  onOpenStudio: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  setCurrentTab,
  searchQuery,
  setSearchQuery,
  currentUser,
  users,
  onSelectUser,
  onOpenStudio,
}) => {
  const [showUserMenu, setShowUserMenu] = React.useState(false);

  return (
    <header className="sticky top-0 z-40 w-full bg-neutral-950/90 backdrop-blur-md border-b border-neutral-800/80 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Brand Logo */}
        <div className="flex items-center gap-8">
          <button
            onClick={() => setCurrentTab('home')}
            className="flex items-center gap-2 group text-left cursor-pointer focus:outline-none"
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
                  Local
                </span>
              </div>
              <p className="text-[10px] text-neutral-400 font-medium tracking-wide">
                Streaming 100% End-to-End
              </p>
            </div>
          </button>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center gap-1">
            <button
              onClick={() => setCurrentTab('home')}
              className={`px-3 py-1.5 text-sm font-semibold rounded-lg transition-colors cursor-pointer ${
                currentTab === 'home'
                  ? 'bg-neutral-800 text-white shadow-sm'
                  : 'text-neutral-400 hover:text-white hover:bg-neutral-900'
              }`}
            >
              Acasă
            </button>
            <button
              onClick={() => setCurrentTab('catalog')}
              className={`px-3 py-1.5 text-sm font-semibold rounded-lg transition-colors cursor-pointer ${
                currentTab === 'catalog'
                  ? 'bg-neutral-800 text-white shadow-sm'
                  : 'text-neutral-400 hover:text-white hover:bg-neutral-900'
              }`}
            >
              Catalog Anime
            </button>
            <button
              onClick={() => setCurrentTab('watchlist')}
              className={`px-3 py-1.5 text-sm font-semibold rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer ${
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
              className={`px-3 py-1.5 text-sm font-semibold rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer ${
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

        {/* Center / Right tools: Search, Admin Studio, Profile */}
        <div className="flex items-center gap-3">
          {/* Quick Search */}
          <div className="relative w-44 sm:w-64">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400 pointer-events-none" />
            <input
              type="text"
              placeholder="Caută anime, gen..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-neutral-900/90 text-sm text-neutral-100 placeholder-neutral-500 pl-9 pr-3 py-1.5 rounded-lg border border-neutral-800 focus:outline-none focus:border-rose-500 focus:ring-1 focus:ring-rose-500/30 transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs text-neutral-400 hover:text-neutral-200"
              >
                ✕
              </button>
            )}
          </div>

          {/* Local DB / Studio Button */}
          <button
            onClick={onOpenStudio}
            className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold bg-neutral-900 hover:bg-neutral-800 text-neutral-200 border border-neutral-800 hover:border-neutral-700 transition cursor-pointer shadow-sm"
            title="Deschide panoul de administrare a bazei de date locale"
          >
            <Database className="w-3.5 h-3.5 text-rose-400" />
            <span>Studio Local</span>
          </button>

          {/* User Profile Switcher */}
          <div className="relative">
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center gap-2 p-1 pl-2 bg-neutral-900/90 hover:bg-neutral-850 rounded-xl border border-neutral-800 transition cursor-pointer focus:outline-none"
            >
              <div className="text-right hidden md:block">
                <div className="text-xs font-semibold text-neutral-200 leading-tight">
                  {currentUser.name}
                </div>
                <div className="text-[10px] text-rose-400 font-medium">
                  {currentUser.role.toUpperCase()}
                </div>
              </div>
              <img
                src={currentUser.avatar}
                alt={currentUser.name}
                className="w-8 h-8 rounded-lg object-cover ring-1 ring-neutral-700"
              />
            </button>

            {showUserMenu && (
              <div className="absolute right-0 mt-2 w-56 bg-neutral-900 rounded-xl border border-neutral-800 shadow-2xl py-2 z-50">
                <div className="px-3 py-2 border-b border-neutral-800 text-xs">
                  <p className="text-neutral-400">Autentificat local ca:</p>
                  <p className="font-bold text-white mt-0.5">{currentUser.name}</p>
                  <p className="text-[11px] text-neutral-500">{currentUser.tag}</p>
                </div>

                <div className="px-2 py-1.5">
                  <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider px-2 py-1">
                    Schimbă Profilul (Local)
                  </p>
                  {users.map((u) => (
                    <button
                      key={u.id}
                      onClick={() => {
                        onSelectUser(u);
                        setShowUserMenu(false);
                      }}
                      className={`w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-xs font-medium text-left transition cursor-pointer ${
                        u.id === currentUser.id
                          ? 'bg-rose-500/10 text-rose-300 font-semibold'
                          : 'text-neutral-300 hover:bg-neutral-800'
                      }`}
                    >
                      <img
                        src={u.avatar}
                        alt={u.name}
                        className="w-6 h-6 rounded-md object-cover"
                      />
                      <div className="truncate flex-1">
                        <div>{u.name}</div>
                        <span className="text-[10px] text-neutral-500 capitalize">{u.role}</span>
                      </div>
                      {u.id === currentUser.id && (
                        <span className="w-1.5 h-1.5 rounded-full bg-rose-500"></span>
                      )}
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
                    <span>Administrare Bază de Date</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
