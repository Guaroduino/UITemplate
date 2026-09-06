import React from 'react';
import { Check, X, Sparkles, ChevronRight } from 'lucide-react';
import { useUIStore } from '../../useUIStore';

export const FloatingActionBar: React.FC = () => {
  const store = useUIStore();
  const { contextualBar } = store;

  if (!contextualBar.isOpen) return null;

  return (
    <div className="absolute top-3 left-1/2 -translate-x-1/2 z-20 max-w-xl w-[92%] sm:w-auto animate-in fade-in slide-in-from-top-2 duration-200 pointer-events-auto">
      <div className="flex items-center space-x-3 px-3.5 py-2 bg-card/95 backdrop-blur-md border border-border/90 rounded-xl shadow-2xl text-foreground text-xs">
        {/* Ícono de Estado Pulsante */}
        <div className="flex items-center space-x-1.5 shrink-0">
          <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
          <span className="font-bold text-[11px] tracking-tight">{contextualBar.title}</span>
        </div>

        {/* Separador vertical */}
        <div className="h-4 w-[1px] bg-border shrink-0" />

        {/* Texto de Instrucción / Paso */}
        <div className="flex items-center space-x-1.5 min-w-0 flex-1 text-muted-foreground">
          <Sparkles className="w-3.5 h-3.5 text-amber-500 shrink-0" />
          <span className="truncate font-medium">{contextualBar.stepText}</span>
        </div>

        {/* Acciones Adicionales si existen */}
        {contextualBar.actions?.map((action) => (
          <button
            key={action.id}
            onClick={action.onClick}
            className="px-2 py-1 bg-secondary hover:bg-secondary/80 text-foreground rounded-md font-semibold transition-colors cursor-pointer shrink-0"
          >
            {action.label}
          </button>
        ))}

        {/* Botones Aceptar / Cancelar */}
        <div className="flex items-center space-x-1.5 shrink-0 pl-1 border-l border-border">
          <button
            onClick={() => contextualBar.onAccept?.()}
            className="flex items-center space-x-1 px-2.5 py-1 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-lg transition-all shadow-xs active:scale-95 cursor-pointer"
            title="Botón Aceptar (Barra Contextual Superior)"
          >
            <Check className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">{contextualBar.acceptLabel || 'Aceptar (Barra Contextual)'}</span>
          </button>

          <button
            onClick={() => contextualBar.onCancel?.()}
            className="flex items-center space-x-1 px-2.5 py-1 bg-secondary hover:bg-destructive hover:text-white text-muted-foreground font-semibold rounded-lg transition-all active:scale-95 cursor-pointer"
            title="Botón Cancelar (Barra Contextual Superior)"
          >
            <X className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">{contextualBar.cancelLabel || 'Cancelar (Barra Contextual)'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
