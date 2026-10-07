import React, { useState } from 'react';
import {
  X, User, Shield, Sparkles, Check, Edit3, Bookmark,
  History, Star, Camera, Plus, Award, CheckCircle2, UserCheck
} from 'lucide-react';
import { UserProfile, WatchlistItem, WatchHistoryItem } from '../types/anime';
import { api } from '../services/api';

interface UserProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: UserProfile;
  users: UserProfile[];
  watchlist: WatchlistItem[];
  history: WatchHistoryItem[];
  onUserUpdated: (user: UserProfile) => void;
  onSelectUser: (user: UserProfile) => void;
  onUserCreated: (user: UserProfile) => void;
}

const AVATAR_PRESETS = [
  'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=150&auto=format&fit=crop&q=80',
];

export const UserProfileModal: React.FC<UserProfileModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  users,
  watchlist,
  history,
  onUserUpdated,
  onSelectUser,
  onUserCreated,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [name, setName] = useState(currentUser.name);
  const [email, setEmail] = useState(currentUser.email);
  const [avatar, setAvatar] = useState(currentUser.avatar);
  const [tag, setTag] = useState(currentUser.tag);
  const [role, setRole] = useState<'admin' | 'user' | 'vip'>(currentUser.role);
  const [statusMsg, setStatusMsg] = useState<{ text: string; type: 'success' | 'error' } | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  // New user state
  const [newUserName, setNewUserName] = useState('');
  const [newUserEmail, setNewUserEmail] = useState('');
  const [newUserAvatar, setNewUserAvatar] = useState(AVATAR_PRESETS[2]);
  const [newUserRole, setNewUserRole] = useState<'admin' | 'user' | 'vip'>('user');

  if (!isOpen) return null;

  const completedCount = watchlist.filter((w) => w.status === 'completed').length;
  const watchingCount = watchlist.filter((w) => w.status === 'watching').length;
  const planCount = watchlist.filter((w) => w.status === 'plan_to_watch').length;

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    setIsSaving(true);
    try {
      const updated = await api.updateUser(currentUser.id, {
        name: name.trim(),
        email: email.trim(),
        avatar: avatar.trim(),
        tag: tag.trim() || `@${name.toLowerCase().replace(/\s+/g, '_')}`,
        role,
      });
      onUserUpdated(updated);
      setIsEditing(false);
      setStatusMsg({ text: 'Profilul a fost salvat cu succes!', type: 'success' });
      setTimeout(() => setStatusMsg(null), 3000);
    } catch (err: any) {
      setStatusMsg({ text: err.message || 'Eroare la salvare.', type: 'error' });
    } finally {
      setIsSaving(false);
    }
  };

  const handleCreateNewUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUserName.trim() || !newUserEmail.trim()) return;

    setIsSaving(true);
    try {
      const created = await api.createUser({
        name: newUserName.trim(),
        email: newUserEmail.trim(),
        avatar: newUserAvatar,
        tag: `@${newUserName.toLowerCase().replace(/\s+/g, '_')}`,
        role: newUserRole,
      });
      onUserCreated(created);
      onSelectUser(created);
      setIsCreating(false);
      setNewUserName('');
      setNewUserEmail('');
      setStatusMsg({ text: `Profilul "${created.name}" a fost creat cu succes!`, type: 'success' });
      setTimeout(() => setStatusMsg(null), 3000);
    } catch (err: any) {
      setStatusMsg({ text: err.message || 'Eroare la crearea contului.', type: 'error' });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-950/85 backdrop-blur-md animate-in fade-in duration-150">
      <div className="relative w-full max-w-xl bg-neutral-900 border border-neutral-800 rounded-3xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
        {/* Top Header Banner */}
        <div className="relative h-28 bg-gradient-to-r from-rose-900 via-neutral-900 to-amber-900/60 p-6 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xl font-black text-white font-['Space_Grotesk'] tracking-wider">
              PROFIL ANIMAXIA
            </span>
            <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 border border-rose-500/30">
              Cont Local
            </span>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-neutral-950/70 hover:bg-neutral-800 text-neutral-300 hover:text-white flex items-center justify-center border border-neutral-700 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Status notification */}
        {statusMsg && (
          <div
            className={`mx-6 mt-4 p-3 rounded-xl text-xs font-semibold flex items-center gap-2 ${
              statusMsg.type === 'success'
                ? 'bg-emerald-950/60 text-emerald-300 border border-emerald-800'
                : 'bg-rose-950/60 text-rose-300 border border-rose-800'
            }`}
          >
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{statusMsg.text}</span>
          </div>
        )}

        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          {/* Avatar and Main Info */}
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5 -mt-14 relative z-10">
            <div className="relative group">
              <img
                src={avatar}
                alt={name}
                className="w-24 h-24 rounded-2xl object-cover border-4 border-neutral-900 shadow-2xl bg-neutral-800"
              />
              {isEditing && (
                <div className="absolute inset-0 rounded-2xl bg-neutral-950/60 flex items-center justify-center">
                  <Camera className="w-6 h-6 text-white" />
                </div>
              )}
            </div>

            <div className="flex-1 text-center sm:text-left pt-2">
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                <h3 className="text-xl font-bold text-white tracking-tight">{currentUser.name}</h3>
                <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-rose-500/20 text-rose-400 border border-rose-500/30">
                  {currentUser.role === 'admin' ? '🛡️ Admin Studio' : currentUser.role === 'vip' ? '⭐ Otaku VIP' : '👤 Utilizator'}
                </span>
              </div>
              <p className="text-xs text-neutral-400 mt-0.5">{currentUser.tag} · {currentUser.email}</p>
              <p className="text-[11px] text-neutral-500 mt-1">Membru din: {currentUser.joinedDate}</p>
            </div>

            {!isEditing && !isCreating && (
              <button
                onClick={() => setIsEditing(true)}
                className="px-3.5 py-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-white text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer self-center sm:self-start mt-2"
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>Editează</span>
              </button>
            )}
          </div>

          {/* Quick Stats Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3 bg-neutral-950/60 rounded-2xl border border-neutral-800 text-center">
              <Bookmark className="w-4 h-4 text-rose-400 mx-auto mb-1" />
              <div className="text-lg font-black text-white">{watchlist.length}</div>
              <div className="text-[10px] text-neutral-400">Total în Listă</div>
            </div>
            <div className="p-3 bg-neutral-950/60 rounded-2xl border border-neutral-800 text-center">
              <span className="text-base block mb-0.5">🍿</span>
              <div className="text-lg font-black text-white">{watchingCount}</div>
              <div className="text-[10px] text-neutral-400">Vizionare curentă</div>
            </div>
            <div className="p-3 bg-neutral-950/60 rounded-2xl border border-neutral-800 text-center">
              <Check className="w-4 h-4 text-emerald-400 mx-auto mb-1" />
              <div className="text-lg font-black text-white">{completedCount}</div>
              <div className="text-[10px] text-neutral-400">Finalizate</div>
            </div>
            <div className="p-3 bg-neutral-950/60 rounded-2xl border border-neutral-800 text-center">
              <History className="w-4 h-4 text-amber-400 mx-auto mb-1" />
              <div className="text-lg font-black text-white">{history.length}</div>
              <div className="text-[10px] text-neutral-400">Episoade în istoric</div>
            </div>
          </div>

          {/* EDIT FORM */}
          {isEditing && (
            <form onSubmit={handleSaveProfile} className="p-4 bg-neutral-950/80 rounded-2xl border border-neutral-800 space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-bold text-white">Editează Profilul</h4>
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="text-xs text-neutral-400 hover:text-white"
                >
                  Anulează
                </button>
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-400 mb-1">Nume afișat</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-rose-500"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-400 mb-1">Tag utilizator (@)</label>
                <input
                  type="text"
                  value={tag}
                  onChange={(e) => setTag(e.target.value)}
                  className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-rose-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-400 mb-1">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-rose-500"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-400 mb-1.5">Alege Avatar Preset</label>
                <div className="flex items-center gap-2 overflow-x-auto pb-1">
                  {AVATAR_PRESETS.map((p, idx) => (
                    <img
                      key={idx}
                      src={p}
                      alt="Avatar preset"
                      onClick={() => setAvatar(p)}
                      className={`w-10 h-10 rounded-xl object-cover cursor-pointer border-2 transition ${
                        avatar === p ? 'border-rose-500 scale-105' : 'border-transparent hover:border-neutral-600'
                      }`}
                    />
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-400 mb-1">Sau URL Avatar personalizat</label>
                <input
                  type="url"
                  value={avatar}
                  onChange={(e) => setAvatar(e.target.value)}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-rose-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-400 mb-1">Rol Cont</label>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value as any)}
                  className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-rose-500"
                >
                  <option value="admin">Admin Studio (Acces complet baza de date)</option>
                  <option value="vip">Otaku VIP</option>
                  <option value="user">Utilizator Standard</option>
                </select>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="px-4 py-2 rounded-xl bg-neutral-900 text-xs font-semibold text-neutral-400 hover:text-white"
                >
                  Renunță
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="px-5 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold transition cursor-pointer"
                >
                  {isSaving ? 'Se salvează...' : 'Salvează Modificările'}
                </button>
              </div>
            </form>
          )}

          {/* CREATE NEW USER FORM */}
          {isCreating && (
            <form onSubmit={handleCreateNewUser} className="p-4 bg-neutral-950/80 rounded-2xl border border-rose-500/30 space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-bold text-white">Creează Profil Nou</h4>
                <button
                  type="button"
                  onClick={() => setIsCreating(false)}
                  className="text-xs text-neutral-400 hover:text-white"
                >
                  Anulează
                </button>
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-400 mb-1">Nume Profil</label>
                <input
                  type="text"
                  placeholder="ex: Mihai Senpai"
                  value={newUserName}
                  onChange={(e) => setNewUserName(e.target.value)}
                  className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-rose-500"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-400 mb-1">Email</label>
                <input
                  type="email"
                  placeholder="ex: mihai@animaxia.local"
                  value={newUserEmail}
                  onChange={(e) => setNewUserEmail(e.target.value)}
                  className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-rose-500"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-400 mb-1.5">Avatar</label>
                <div className="flex items-center gap-2 overflow-x-auto pb-1">
                  {AVATAR_PRESETS.map((p, idx) => (
                    <img
                      key={idx}
                      src={p}
                      alt="Preset"
                      onClick={() => setNewUserAvatar(p)}
                      className={`w-10 h-10 rounded-xl object-cover cursor-pointer border-2 transition ${
                        newUserAvatar === p ? 'border-rose-500 scale-105' : 'border-transparent hover:border-neutral-600'
                      }`}
                    />
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-400 mb-1">Rol</label>
                <select
                  value={newUserRole}
                  onChange={(e) => setNewUserRole(e.target.value as any)}
                  className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-rose-500"
                >
                  <option value="user">Utilizator Standard</option>
                  <option value="vip">Otaku VIP</option>
                  <option value="admin">Admin</option>
                </select>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsCreating(false)}
                  className="px-4 py-2 rounded-xl bg-neutral-900 text-xs font-semibold text-neutral-400 hover:text-white"
                >
                  Renunță
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="px-5 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold transition cursor-pointer"
                >
                  {isSaving ? 'Se creează...' : 'Creează Profilul'}
                </button>
              </div>
            </form>
          )}

          {/* Switch Users Section */}
          <div className="pt-4 border-t border-neutral-800">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-neutral-300">Schimbă utilizatorul ({users.length})</span>
              {!isCreating && (
                <button
                  onClick={() => setIsCreating(true)}
                  className="text-xs font-semibold text-rose-400 hover:text-rose-300 flex items-center gap-1 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Adaugă alt cont</span>
                </button>
              )}
            </div>

            <div className="space-y-2">
              {users.map((u) => (
                <div
                  key={u.id}
                  onClick={() => {
                    onSelectUser(u);
                    setName(u.name);
                    setEmail(u.email);
                    setAvatar(u.avatar);
                    setTag(u.tag);
                    setRole(u.role);
                  }}
                  className={`flex items-center justify-between p-2.5 rounded-xl border transition cursor-pointer ${
                    u.id === currentUser.id
                      ? 'bg-rose-950/30 border-rose-600/50 text-white'
                      : 'bg-neutral-950/40 hover:bg-neutral-800/60 border-neutral-800/80 text-neutral-300'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <img src={u.avatar} alt={u.name} className="w-9 h-9 rounded-xl object-cover" />
                    <div>
                      <div className="text-xs font-bold text-white flex items-center gap-1.5">
                        <span>{u.name}</span>
                        {u.id === currentUser.id && (
                          <span className="text-[10px] bg-rose-600 text-white px-1.5 py-0.2 rounded font-mono">
                            Activ
                          </span>
                        )}
                      </div>
                      <div className="text-[11px] text-neutral-500">{u.tag}</div>
                    </div>
                  </div>

                  <span className="text-[10px] font-semibold text-neutral-400 uppercase tracking-wider px-2 py-0.5 rounded bg-neutral-900 border border-neutral-800">
                    {u.role}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
