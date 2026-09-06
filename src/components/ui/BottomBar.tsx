import React, { useState } from 'react';
import {
  Orbit,
  Hand,
  Home,
  Focus,
  Grid as GridIcon,
  Crosshair,
  Magnet,
  Palette,
  ChevronUp,
  ChevronDown,
  Check,
  Camera,
  Layers,
} from 'lucide-react';
import { useUiStore } from '../../store/useUiStore';
import type { CameraPreset, RenderStyle } from '../../types/ui';

export const BottomBar: React.FC = () => {
  const {
    cameraPreset,
    setCameraPreset,
    renderStyle,
    setRenderStyle,
    showGrid,
    toggleGrid,
    showAxes,
    toggleAxes,
    snapEnabled,
    toggleSnap,
    showNotice,
  } = useUiStore();

  const [isPresetMenuOpen, setIsPresetMenuOpen] = useState(false);
  const [isRenderMenuOpen, setIsRenderMenuOpen] = useState(false);

  const presets: { id: CameraPreset; label: string }[] = [
    { id: 'isometric', label: 'Isométrica (Home)' },
    { id: 'top', label: 'Superior (Top)' },
    { id: 'bottom', label: 'Inferior (Bottom)' },
    { id: 'front', label: 'Frontal (Front)' },
    { id: 'back', label: 'Posterior (Back)' },
    { id: 'left', label: 'Izquierda (Left)' },
    { id: 'right', label: 'Derecha (Right)' },
  ];

  const renderStyles: { id: RenderStyle; label: string; desc: string }[] = [
    { id: 'shaded', label: 'Sombreado Sólido', desc: 'Material físico con aristas acentuadas' },
    { id: 'wireframe', label: 'Malla de Alambre', desc: 'Líneas y aristas sin relleno' },
    { id: 'xray', label: 'Rayos X', desc: 'Geometría translúcida para ver cavidades' },
    { id: 'clay', label: 'Arcilla / Estudio', desc: 'Sombreado mate neutral sin brillos' },
  ];

  return (
    <footer className="h-10 bg-card border-t border-border px-3 flex items-center justify-between text-xs text-muted-foreground select-none z-30 transition-colors">
      {/* Controles de Vista de Cámara a la Izquierda */}
      <div className="flex items-center space-x-1">
        {/* Reset / Home */}
        <button
          onClick={() => {
            setCameraPreset('isometric');
            showNotice('general', 'Vista Isométrica', 'Cámara centrada en el origen.');
          }}
          className="p-1.5 hover:bg-secondary hover:text-foreground rounded-lg transition-colors cursor-pointer"
          title="Vista Isométrica por defecto (Home)"
        >
          <Home className="w-4 h-4" />
        </button>

        {/* Ajustar a la pantalla (Fit View) */}
        <button
          onClick={() => {
            showNotice('general', 'Ajustar Vista', 'Encuadrando todos los objetos visibles.');
          }}
          className="p-1.5 hover:bg-secondary hover:text-foreground rounded-lg transition-colors cursor-pointer"
          title="Ajustar todos los objetos en pantalla"
        >
          <Focus className="w-4 h-4" />
        </button>

        <div className="h-4 w-px bg-border mx-1" />

        {/* Desplegable de Vistas Predefinidas */}
        <div className="relative">
          <button
            onClick={() => {
              setIsPresetMenuOpen(!isPresetMenuOpen);
              setIsRenderMenuOpen(false);
            }}
            className="flex items-center space-x-1 px-2 py-1 hover:bg-secondary hover:text-foreground rounded-lg text-xs font-semibold transition-colors cursor-pointer"
          >
            <Camera className="w-3.5 h-3.5" />
            <span className="capitalize">{cameraPreset}</span>
            <ChevronUp className="w-3 h-3" />
          </button>

          {isPresetMenuOpen && (
            <div className="absolute bottom-10 left-0 w-44 bg-card border border-border rounded-xl shadow-2xl p-1.5 z-50 text-xs">
              <span className="text-[10px] text-muted-foreground px-2 py-1 font-semibold block uppercase">
                Proyecciones
              </span>
              {presets.map((p) => (
                <button
                  key={p.id}
                  onClick={() => {
                    setCameraPreset(p.id);
                    setIsPresetMenuOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-left transition-colors cursor-pointer ${
                    cameraPreset === p.id
                      ? 'bg-secondary text-foreground font-bold'
                      : 'hover:bg-secondary/60 text-muted-foreground hover:text-foreground'
                  }`}
                >
                  <span>{p.label}</span>
                  {cameraPreset === p.id && <Check className="w-3.5 h-3.5 ml-1" />}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Desplegable de Estilo de Renderizado */}
        <div className="relative">
          <button
            onClick={() => {
              setIsRenderMenuOpen(!isRenderMenuOpen);
              setIsPresetMenuOpen(false);
            }}
            className="flex items-center space-x-1 px-2 py-1 hover:bg-secondary hover:text-foreground rounded-lg text-xs font-semibold transition-colors cursor-pointer"
          >
            <Palette className="w-3.5 h-3.5" />
            <span className="capitalize">{renderStyle}</span>
            <ChevronUp className="w-3 h-3" />
          </button>

          {isRenderMenuOpen && (
            <div className="absolute bottom-10 left-0 w-52 bg-card border border-border rounded-xl shadow-2xl p-1.5 z-50 text-xs">
              <span className="text-[10px] text-muted-foreground px-2 py-1 font-semibold block uppercase">
                Estilo Visual
              </span>
              {renderStyles.map((s) => (
                <button
                  key={s.id}
                  onClick={() => {
                    setRenderStyle(s.id);
                    setIsRenderMenuOpen(false);
                  }}
                  className={`w-full flex flex-col px-2.5 py-1.5 rounded-lg text-left transition-colors cursor-pointer ${
                    renderStyle === s.id
                      ? 'bg-secondary text-foreground font-bold'
                      : 'hover:bg-secondary/60 text-muted-foreground hover:text-foreground'
                  }`}
                >
                  <div className="flex items-center justify-between w-full">
                    <span>{s.label}</span>
                    {renderStyle === s.id && <Check className="w-3.5 h-3.5" />}
                  </div>
                  <span className="text-[10px] text-muted-foreground font-normal">
                    {s.desc}
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Controles de Rejilla / Ejes / Imanes al Centro */}
      <div className="flex items-center space-x-1">
        <button
          onClick={toggleGrid}
          className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
            showGrid ? 'bg-secondary text-foreground font-bold' : 'hover:bg-secondary text-muted-foreground'
          }`}
          title={showGrid ? 'Ocultar Rejilla' : 'Mostrar Rejilla'}
        >
          <GridIcon className="w-4 h-4" />
        </button>

        <button
          onClick={toggleAxes}
          className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
            showAxes ? 'bg-secondary text-foreground font-bold' : 'hover:bg-secondary text-muted-foreground'
          }`}
          title={showAxes ? 'Ocultar Ejes Cartesiano (X/Y/Z)' : 'Mostrar Ejes'}
        >
          <Crosshair className="w-4 h-4" />
        </button>

        <button
          onClick={toggleSnap}
          className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
            snapEnabled ? 'bg-secondary text-blue-500 font-bold' : 'hover:bg-secondary text-muted-foreground'
          }`}
          title={snapEnabled ? 'Snap Magnético Activo' : 'Snap Magnético Inactivo'}
        >
          <Magnet className="w-4 h-4" />
        </button>
      </div>

      {/* Coordenadas del Cursor y Estado a la Derecha */}
      <div className="hidden sm:flex items-center space-x-3 text-[11px] font-mono">
        <div className="flex items-center space-x-2">
          <span>X: <strong className="text-foreground">0.00</strong></span>
          <span>Y: <strong className="text-foreground">0.00</strong></span>
          <span>Z: <strong className="text-foreground">0.00</strong></span>
        </div>
        <span className="px-1.5 py-0.5 bg-secondary text-muted-foreground rounded text-[10px]">
          mm
        </span>
      </div>
    </footer>
  );
};
