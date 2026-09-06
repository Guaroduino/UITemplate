import React from 'react';
import { FloatingActionBar } from '../contextual/FloatingActionBar';
import { InspectorPanel } from '../inspector/InspectorPanel';
import { useUIStore } from '../../useUIStore';
import { CheckCircle2, AlertTriangle, Info } from 'lucide-react';

interface ViewportContainerProps {
  children?: React.ReactNode;
}

export const ViewportContainer: React.FC<ViewportContainerProps> = ({ children }) => {
  const store = useUIStore();
  const { notification } = store;

  return (
    <main className="flex-1 h-full w-full relative overflow-hidden bg-background select-none">
      {/* Barra Contextual Flotante Superior */}
      <FloatingActionBar />

      {/* Inspector de Propiedades Desplegable */}
      <InspectorPanel />

      {/* Toasts de Notificación en Tiempo Real */}
      {notification?.show && (
        <div className="absolute bottom-4 left-4 z-30 flex items-center space-x-2 px-3.5 py-2 rounded-xl bg-card border border-border shadow-2xl text-xs text-foreground animate-in fade-in slide-in-from-bottom-2 duration-150">
          {notification.type === 'success' && (
            <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
          )}
          {notification.type === 'warning' && (
            <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0" />
          )}
          {notification.type === 'info' && (
            <Info className="w-4 h-4 text-sky-500 shrink-0" />
          )}
          <span className="font-semibold">{notification.message}</span>
        </div>
      )}

      {/* Etiqueta identificadora del Viewport */}
      <div className="absolute top-3 left-3 z-10 pointer-events-none select-none">
        <span className="px-2 py-1 bg-card/80 backdrop-blur-xs border border-border/80 rounded-md text-[10px] font-mono text-muted-foreground font-semibold shadow-xs">
          Viewport Central (Área de Trabajo Principal)
        </span>
      </div>

      {/* Contenido Principal (Canvas 3D / 2D o Slot personalizable) */}
      <div className="w-full h-full relative">
        {children}
      </div>
    </main>
  );
};
