import React, { useEffect } from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export interface ToastMessage {
  id: string;
  type: 'success' | 'info' | 'error';
  text: string;
}

interface ToastContainerProps {
  toasts: ToastMessage[];
  onDismiss: (id: string) => void;
}

export const ToastContainer: React.FC<ToastContainerProps> = ({ toasts, onDismiss }) => {
  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none">
      {toasts.map((toast) => (
        <ToastItem key={toast.id} toast={toast} onDismiss={onDismiss} />
      ))}
    </div>
  );
};

const ToastItem: React.FC<{ toast: ToastMessage; onDismiss: (id: string) => void }> = ({
  toast,
  onDismiss,
}) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onDismiss(toast.id);
    }, 3500);
    return () => clearTimeout(timer);
  }, [toast.id, onDismiss]);

  const icons = {
    success: <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />,
    info: <Info className="w-4 h-4 text-rose-400 shrink-0" />,
    error: <AlertCircle className="w-4 h-4 text-amber-400 shrink-0" />,
  };

  const borders = {
    success: 'border-emerald-500/30 bg-neutral-900/95 text-emerald-200',
    info: 'border-rose-500/30 bg-neutral-900/95 text-rose-200',
    error: 'border-amber-500/30 bg-neutral-900/95 text-amber-200',
  };

  return (
    <div
      className={`pointer-events-auto flex items-center justify-between gap-3 p-3.5 rounded-2xl border shadow-2xl backdrop-blur-md animate-in slide-in-from-bottom-5 duration-200 ${borders[toast.type]}`}
    >
      <div className="flex items-center gap-2.5 text-xs font-semibold">
        {icons[toast.type]}
        <span className="text-white">{toast.text}</span>
      </div>

      <button
        onClick={() => onDismiss(toast.id)}
        className="text-neutral-400 hover:text-white transition p-0.5 rounded cursor-pointer"
      >
        <X className="w-3.5 h-3.5" />
      </button>
    </div>
  );
};
