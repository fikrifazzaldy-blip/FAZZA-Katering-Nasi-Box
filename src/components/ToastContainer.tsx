import React from 'react';
import { useApp } from '../context/AppContext';
import { CheckCircle2, AlertCircle, Info, XCircle } from 'lucide-react';

export const ToastContainer: React.FC = () => {
  const { toasts } = useApp();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none px-4 sm:px-0">
      {toasts.map((toast) => {
        let bgClass = 'bg-[#291811] text-white border-orange-500/30';
        let Icon = Info;

        if (toast.type === 'success') {
          bgClass = 'bg-stone-900 text-white border-emerald-500/40';
          Icon = CheckCircle2;
        } else if (toast.type === 'error') {
          bgClass = 'bg-rose-950 text-white border-rose-500/40';
          Icon = XCircle;
        } else if (toast.type === 'warning') {
          bgClass = 'bg-amber-950 text-white border-amber-500/40';
          Icon = AlertCircle;
        }

        return (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-start gap-3 p-3.5 rounded-xl border shadow-xl transition-all duration-200 text-sm ${bgClass}`}
          >
            <Icon className="w-5 h-5 shrink-0 text-orange-400 mt-0.5" />
            <p className="flex-1 leading-snug">{toast.message}</p>
          </div>
        );
      })}
    </div>
  );
};
