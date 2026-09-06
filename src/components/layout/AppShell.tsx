import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useUiStore } from '../../store/useUiStore';
import { FusionHeader } from '../ui/FusionHeader';
import { SidebarRight } from '../ui/SidebarRight';
import { BottomBar } from '../ui/BottomBar';
import { ToolContextPanel } from '../ui/ToolContextPanel';
import { WorkspaceNotice } from '../ui/WorkspaceNotice';
import { SettingsModal } from '../ui/SettingsModal';
import { CanvasViewport3D } from '../viewport/CanvasViewport3D';
import { Canvas2DPlaceholder } from '../viewport/Canvas2DPlaceholder';

export const AppShell: React.FC = () => {
  const {
    activeWorkspace,
    isSidebarOpen,
    setSidebarOpen,
    isSettingsOpen,
    setSettingsOpen,
  } = useUiStore();

  return (
    <div className="flex flex-col h-full w-full bg-background text-foreground overflow-hidden select-none">
      {/* 1. Barra Superior con Menús y Ribbon */}
      <FusionHeader />

      {/* 2. Área Central (Viewport + Paneles Flotantes + Columna Derecha) */}
      <div className="flex flex-1 relative overflow-hidden">
        {/* Main Viewport */}
        <main className="flex-1 h-full relative overflow-hidden z-0">
          {activeWorkspace === 'model-3d' ? (
            <CanvasViewport3D />
          ) : (
            <Canvas2DPlaceholder />
          )}

          {/* Panel Contextual Flotante de Propiedades del Objeto Seleccionado */}
          <ToolContextPanel />

          {/* Tirador pequeño en el borde derecho cuando el panel lateral está plegado */}
          {!isSidebarOpen && (
            <button
              onClick={() => setSidebarOpen(true)}
              className="absolute top-1/2 -translate-y-1/2 right-0 z-30 flex items-center justify-center w-4 h-12 bg-card hover:bg-secondary text-muted-foreground hover:text-foreground border border-border border-r-0 rounded-l-lg shadow-md transition-colors cursor-pointer"
              title="Desplegar panel lateral (Outliner & Librería)"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
            </button>
          )}
        </main>

        {/* Columna Derecha: Outliner + Librería con tirador para plegar */}
        {isSidebarOpen && (
          <div className="relative h-full shrink-0 z-10">
            {/* Botón tirador para plegar */}
            <button
              onClick={() => setSidebarOpen(false)}
              className="absolute top-1/2 -translate-y-1/2 -left-4 z-30 flex items-center justify-center w-4 h-12 bg-card hover:bg-secondary text-muted-foreground hover:text-foreground border border-border border-r-0 rounded-l-lg shadow-md transition-colors cursor-pointer"
              title="Plegar panel lateral"
            >
              <ChevronRight className="w-3.5 h-3.5" />
            </button>

            <SidebarRight />
          </div>
        )}
      </div>

      {/* 3. Barra Inferior */}
      <BottomBar />

      {/* 4. Notificaciones y Modales Globales */}
      <WorkspaceNotice />
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setSettingsOpen(false)}
      />
    </div>
  );
};
