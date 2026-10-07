import React, { useState } from 'react';
import {
  X, Crown, Check, Sparkles, Zap, ShieldCheck,
  Star, Film, Tv, Play, CheckCircle2
} from 'lucide-react';
import { UserProfile } from '../types/anime';
import { api } from '../services/api';

interface PremiumPlansModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: UserProfile;
  onUpgradeToVip: (updatedUser: UserProfile) => void;
}

export const PremiumPlansModal: React.FC<PremiumPlansModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  onUpgradeToVip,
}) => {
  const [isUpgrading, setIsUpgrading] = useState(false);
  const [successMsg, setSuccessMsg] = useState(false);

  if (!isOpen) return null;

  const handleActivateVip = async () => {
    setIsUpgrading(true);
    try {
      const updated = await api.updateUser(currentUser.id, {
        role: 'vip',
      });
      onUpgradeToVip(updated);
      setSuccessMsg(true);
      setTimeout(() => {
        setSuccessMsg(false);
        onClose();
      }, 2000);
    } catch (err) {
      console.error(err);
    } finally {
      setIsUpgrading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-neutral-950/90 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-neutral-900 border border-neutral-800 rounded-3xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-6 bg-gradient-to-r from-amber-950 via-neutral-900 to-rose-950/70 border-b border-neutral-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-500 via-amber-400 to-rose-500 flex items-center justify-center shadow-lg shadow-amber-500/25">
              <Crown className="w-6 h-6 text-black fill-black" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-black text-white font-['Space_Grotesk'] tracking-wide">
                  ANIMAXIA VIP PASS
                </h2>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  Planuri Premium
                </span>
              </div>
              <p className="text-xs text-neutral-400">
                Experiență cinematografică supremă, fără limite și cu acces prioritar
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-neutral-800/80 hover:bg-neutral-700 text-neutral-400 hover:text-white flex items-center justify-center border border-neutral-700 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-xs">
          {successMsg && (
            <div className="p-4 bg-emerald-950/60 border border-emerald-800 text-emerald-300 rounded-2xl flex items-center gap-3">
              <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
              <div>
                <h4 className="font-bold text-sm">Felicitări! Contul tău este acum Otaku VIP!</h4>
                <p className="text-xs text-neutral-400">Toate beneficiile premium au fost activate pe profilul tău local.</p>
              </div>
            </div>
          )}

          {/* Perks Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {[
              {
                title: 'Stream Adaptiv 4K HDR',
                desc: 'Bitrate maxim fără comprimare video suplimentară',
                icon: '📺',
              },
              {
                title: 'Omitere Automată Intro & Outro',
                desc: 'Sari peste intro fără niciun click la următorul episod',
                icon: '⚡',
              },
              {
                title: 'Miner Video Nelimitat',
                desc: 'Scanează și extrage playlist-uri HLS din surse nelimitate',
                icon: '⛏️',
              },
              {
                title: 'Badge Otaku VIP pe Profil',
                desc: 'Recunoaștere în comentarii și comunitatea Animaxia',
                icon: '⭐',
              },
              {
                title: 'Backup & Export JSON Instant',
                desc: 'Descarcă baza de date locală cu un singur click',
                icon: '💾',
              },
              {
                title: 'Zero Așteptare & Buffer Ultra-Rapid',
                desc: 'Streaming prioritar pe nodurile Edge CDN',
                icon: '🚀',
              },
            ].map((perk, idx) => (
              <div
                key={idx}
                className="p-3.5 bg-neutral-950/60 rounded-2xl border border-neutral-800 flex items-start gap-3"
              >
                <span className="text-xl shrink-0 mt-0.5">{perk.icon}</span>
                <div>
                  <h4 className="font-bold text-white text-xs">{perk.title}</h4>
                  <p className="text-[11px] text-neutral-400 mt-0.5">{perk.desc}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Current Status and Activation */}
          <div className="p-5 bg-gradient-to-br from-neutral-950 to-neutral-900 rounded-2xl border border-neutral-800 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <span className="text-[10px] font-bold text-neutral-500 uppercase">Profil Curent</span>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="font-bold text-white text-sm">{currentUser.name}</span>
                <span className="px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 font-mono text-[10px] font-bold uppercase">
                  {currentUser.role}
                </span>
              </div>
              <p className="text-[11px] text-neutral-400 mt-1">
                {currentUser.role === 'vip'
                  ? 'Ai deja acces deplin la toate beneficiile VIP!'
                  : 'Activează statutul VIP gratuit în instanța ta locală Animaxia.'}
              </p>
            </div>

            {currentUser.role !== 'vip' && (
              <button
                onClick={handleActivateVip}
                disabled={isUpgrading}
                className="px-6 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-rose-600 hover:from-amber-400 hover:to-rose-500 text-black font-black text-xs uppercase tracking-wider shadow-xl shadow-amber-500/20 transition cursor-pointer shrink-0"
              >
                {isUpgrading ? 'Se activează...' : 'Activează VIP Gratuit'}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
