import React from 'react';
import {
  Compass,
  Maximize,
  Grid,
  Magnet,
  RotateCw,
  Hand,
  ZoomIn,
  ZoomOut,
  Crosshair,
} from 'lucide-react';
import { useUIStore } from '../../useUIStore';

export const BottomBar: React.FC = () => {
  const store = useUIStore();
  const {
    viewPreset,
    setViewPreset,
    gridVisible,
    toggleGrid,
    snapEnabled,
    toggleSnap,
    statusInfo,
    activeTool,
  } = store;

  return (
    <footer className="h-8 w-full border-t border-border bg-card text-foreground px-3 flex items-center justify-between select-none z-20 shrink-0 text-xs">
      {/* LADO IZQUIERDO: Vistas y Navegación de Cámara */}
      <div className="flex items-center space-x-1">
        {/* Selector de Vistas Rápidas */}
        <div className="flex items-center bg-secondary/80 p-0.5 rounded-md border border-border/60">
          {[
            { id: 'iso', label: 'V1 (ISO)' },
            { id: 'top', label: 'V2 (TOP)' },
            { id: 'front', label: 'V3 (FRONT)' },
            { id: 'right', label: 'V4 (RIGHT)' },
          ].map((preset) => (
            <button
              key={preset.id}
              onClick={() => {
                setViewPreset(preset.id as any);
                store.showNotification(`Vista cambiada a: ${preset.label} (Barra Inferior)`, 'info');
              }}
              className={`px-1.5 py-0.5 text-[9.5px] font-bold uppercase rounded transition-colors cursor-pointer ${
                viewPreset === preset.id
                  ? 'bg-card text-foreground shadow-xs'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
              title={`Orientar cámara a ${preset.label} (Barra Inferior)`}
            >
              {preset.label}
            </button>
          ))}
        </div>

        {/* Separador */}
        <div className="h-3.5 w-[1px] bg-border mx-1" />

        {/* Encuadre Total (Fit View) */}
        <button
          onClick={() => store.showNotification('Acción: Botón Encuadre (Barra Inferior)', 'info')}
          className="p-1 hover:bg-secondary text-muted-foreground hover:text-foreground rounded transition-colors cursor-pointer"
          title="Botón Encuadre Total (Barra Inferior)"
        >
          <Maximize className="w-3.5 h-3.5" />
        </button>

        {/* Órbita / Pan */}
        <div className="flex items-center space-x-0.5 text-muted-foreground">
          <span className="p-1 cursor-help" title="Órbita de Cámara (Barra Inferior)">
            <RotateCw className="w-3.5 h-3.5" />
          </span>
          <span className="p-1 cursor-help" title="Panorámica de Cámara (Barra Inferior)">
            <Hand className="w-3.5 h-3.5" />
          </span>
        </div>
      </div>

      {/* CENTRO: Coordenadas y Mensaje de Estado */}
      <div className="hidden sm:flex items-center space-x-3 text-[11px] text-muted-foreground">
        {/* Coordenadas en tiempo real */}
        <div
          className="flex items-center space-x-2 font-mono bg-secondary/50 px-2 py-0.5 rounded border border-border/50"
          title="Coordenadas en Tiempo Real (Barra Inferior)"
        >
          <Crosshair className="w-3 h-3 text-amber-500" />
          <span>
            X: {statusInfo.cursorPos.x.toFixed(1)}
          </span>
          <span>
            Y: {statusInfo.cursorPos.y.toFixed(1)}
          </span>
          <span>
            Z: {statusInfo.cursorPos.z.toFixed(1)}
          </span>
        </div>

        {/* Herramienta Activa o Mensaje */}
        <div className="flex items-center space-x-1.5" title="Estado de Operación (Barra Inferior)">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
          <span className="font-medium text-foreground truncate max-w-[200px]">
            {activeTool ? `Herramienta Activa: ${activeTool}` : statusInfo.message}
          </span>
        </div>
      </div>

      {/* LADO DERECHO: Rejilla, Magnetismo y Nivel de Zoom */}
      <div className="flex items-center space-x-1.5">
        {/* Toggle Rejilla (Grid) */}
        <button
          onClick={toggleGrid}
          className={`flex items-center space-x-1 px-2 py-0.5 rounded font-semibold text-[10.5px] transition-colors cursor-pointer ${
            gridVisible
              ? 'bg-secondary text-foreground font-bold border border-border/80'
              : 'text-muted-foreground hover:bg-secondary/60'
          }`}
          title="Botón Rejilla Métrica (Barra Inferior)"
        >
          <Grid className="w-3 h-3" />
          <span className="hidden md:inline">Rejilla</span>
        </button>

        {/* Toggle Snapping (Magnetismo) */}
        <button
          onClick={toggleSnap}
          className={`flex items-center space-x-1 px-2 py-0.5 rounded font-semibold text-[10.5px] transition-colors cursor-pointer ${
            snapEnabled
              ? 'bg-amber-500 text-slate-950 font-black shadow-xs'
              : 'text-muted-foreground hover:bg-secondary/60'
          }`}
          title="Botón Snap Magnético (Barra Inferior)"
        >
          <Magnet className="w-3 h-3" />
          <span className="hidden md:inline">Snap</span>
        </button>

        {/* Separador */}
        <div className="h-3.5 w-[1px] bg-border mx-1" />

        {/* Nivel de Zoom */}
        <div
          className="flex items-center space-x-1 text-[11px] font-mono text-muted-foreground"
          title="Nivel de Zoom (Barra Inferior)"
        >
          <span>Zoom: {statusInfo.zoom}%</span>
        </div>
      </div>
    </footer>
  );
};
