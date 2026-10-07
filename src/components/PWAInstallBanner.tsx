import React, { useState } from 'react';
import { Download, X, Share, PlusSquare, Sparkles, Smartphone, Check } from 'lucide-react';
import { usePWAInstall } from '../hooks/usePWAInstall';

interface PWAInstallBannerProps {
  forceShowModal?: boolean;
  onCloseModal?: () => void;
}

export const PWAInstallBanner: React.FC<PWAInstallBannerProps> = ({
  forceShowModal = false,
  onCloseModal,
}) => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [dismissed, setDismissed] = useState(false);
  const [showIOSModal, setShowIOSModal] = useState(false);

  // If already installed, hide banner
  if (isInstalled && !forceShowModal) return null;

  const handleInstallClick = async () => {
    if (isInstallable) {
      await install();
    } else if (isIOS) {
      setShowIOSModal(true);
    }
  };

  // Full Screen Guided Modal for iOS or Forced Modal
  if (showIOSModal || forceShowModal) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-950/85 backdrop-blur-md animate-in fade-in duration-200">
        <div className="relative w-full max-w-md bg-neutral-900 border border-neutral-800 rounded-3xl p-6 shadow-2xl text-center space-y-5">
          <button
            onClick={() => {
              setShowIOSModal(false);
              if (onCloseModal) onCloseModal();
            }}
            className="absolute top-4 right-4 w-8 h-8 rounded-full bg-neutral-800 text-neutral-400 hover:text-white flex items-center justify-center transition cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-rose-600 to-rose-400 mx-auto flex items-center justify-center shadow-xl shadow-rose-600/30">
            <Smartphone className="w-8 h-8 text-white" />
          </div>

          <div>
            <h3 className="text-lg font-black text-white font-['Space_Grotesk']">
              Instalează Aplicația Animaxia
            </h3>
            <p className="text-xs text-neutral-400 mt-1">
              Bucură-te de experiență nativă pe ecranul tău, fără bara browserului, cu pornire instantă și mod autonom.
            </p>
          </div>

          {isInstallable ? (
            <button
              onClick={async () => {
                await install();
                if (onCloseModal) onCloseModal();
              }}
              className="w-full py-3 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-rose-600/30 transition cursor-pointer"
            >
              <Download className="w-4 h-4" />
              <span>Instalează pe Dispozitiv Acum</span>
            </button>
          ) : isIOS ? (
            <div className="text-left bg-neutral-950/70 p-4 rounded-2xl border border-neutral-800 space-y-3 text-xs text-neutral-300">
              <p className="font-bold text-rose-400">Instrucțiuni Safari iOS:</p>
              <div className="flex items-center gap-3">
                <span className="w-6 h-6 rounded-full bg-neutral-800 flex items-center justify-center text-rose-400 font-bold shrink-0">1</span>
                <span>Apasă butonul <strong>Partajare</strong> (<Share className="w-3.5 h-3.5 inline mx-1 text-sky-400" />) în bara Safari.</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="w-6 h-6 rounded-full bg-neutral-800 flex items-center justify-center text-rose-400 font-bold shrink-0">2</span>
                <span>Selectează <strong>Adaugă pe ecranul principal</strong> (<PlusSquare className="w-3.5 h-3.5 inline mx-1 text-emerald-400" />).</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="w-6 h-6 rounded-full bg-neutral-800 flex items-center justify-center text-rose-400 font-bold shrink-0">3</span>
                <span>Apasă <strong>Adăugare</strong> în colțul din dreapta sus.</span>
              </div>
            </div>
          ) : (
            <div className="p-4 bg-neutral-950/70 rounded-2xl border border-neutral-800 text-xs text-neutral-400">
              Aplicația rulează deja ca PWA standalone sau browserul tău permite instalarea direct din meniul de setări al browserului (cele trei puncte ⋮).
            </div>
          )}
        </div>
      </div>
    );
  }

  // Floating bottom-left non-intrusive prompt if installable
  if (!isInstallable || dismissed) return null;

  return (
    <div className="fixed bottom-5 left-5 z-40 max-w-sm p-4 bg-neutral-900/95 border border-rose-500/40 rounded-2xl shadow-2xl backdrop-blur-md flex items-center gap-3.5 animate-in slide-in-from-bottom-5">
      <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-rose-600 to-rose-400 flex items-center justify-center shrink-0 shadow-md shadow-rose-600/30">
        <Smartphone className="w-5 h-5 text-white" />
      </div>

      <div className="min-w-0 flex-1">
        <h4 className="text-xs font-bold text-white truncate">Instalează Animaxia PWA</h4>
        <p className="text-[11px] text-neutral-400 truncate">Ecran complet &amp; pornire rapidă</p>
      </div>

      <div className="flex items-center gap-1.5 shrink-0">
        <button
          onClick={handleInstallClick}
          className="px-3 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs shadow transition cursor-pointer"
        >
          Instalează
        </button>
        <button
          onClick={() => setDismissed(true)}
          className="w-7 h-7 rounded-lg text-neutral-400 hover:text-white flex items-center justify-center transition cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
