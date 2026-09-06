import React from 'react';
import { Loader2, CheckCircle2, AlertCircle, Sparkles, X } from 'lucide-react';
import { useUiStore } from '../../store/useUiStore';

export const WorkspaceNotice: React.FC = () => {
  const { notice, closeNotice } = useUiStore();

  if (!notice.isOpen) return null;

  return (
    <div className="fixed top-24 left-1/2 -translate-x-1/2 z-50 pointer-events-auto animate-in fade-in slide-in-from-top-4 duration-200">
      <div className="flex items-center space-x-3 px-4 py-2.5 bg-card/95 backdrop-blur-md border border-border text-foreground rounded-2xl shadow-xl min-w-[280px] max-w-[480px]">
        {/* Icono de Estado */}
        <div className="shrink-0">
          {notice.isComplete ? (
            <CheckCircle2 className="w-5 h-5 text-emerald-500" />
          ) : notice.type === 'save' ? (
            <Loader2 className="w-5 h-5 text-blue-500 animate-spin" />
          ) : notice.type === 'build' ? (
            <Sparkles className="w-5 h-5 text-amber-500 animate-pulse" />
          ) : notice.type === 'import' ? (
            <Loader2 className="w-5 h-5 text-purple-500 animate-spin" />
          ) : (
            <AlertCircle className="w-5 h-5 text-blue-500" />
          )}
        </div>

        {/* Textos */}
        <div className="flex-1 min-w-0 pr-2">
          <p className="text-xs font-bold text-foreground truncate">{notice.title}</p>
          {notice.detail && (
            <p className="text-[11px] text-muted-foreground truncate">{notice.detail}</p>
          )}
        </div>

        {/* Botón Cerrar */}
        <button
          onClick={closeNotice}
          className="p-1 text-muted-foreground hover:text-foreground hover:bg-secondary rounded-lg transition-colors cursor-pointer"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
