import React from 'react';
import {
  Sliders,
  X,
  Palette,
  Move,
  Eye,
  Box,
  ChevronDown,
  Info,
} from 'lucide-react';
import { useUIStore } from '../../useUIStore';

export const InspectorPanel: React.FC = () => {
  const store = useUIStore();
  const { toolParams, setToolParams, isInspectorOpen, toggleInspector } = store;

  if (!isInspectorOpen) return null;

  const colorPresets = [
    '#3b82f6', // blue
    '#ef4444', // red
    '#10b981', // emerald
    '#f59e0b', // amber
    '#8b5cf6', // purple
    '#ec4899', // pink
    '#64748b', // slate
    '#ffffff', // white
  ];

  return (
    <div className="absolute top-3 right-3 z-20 w-72 bg-card/95 backdrop-blur-md border border-border/80 rounded-xl shadow-2xl flex flex-col max-h-[calc(100%-24px)] overflow-hidden text-xs text-foreground select-none animate-in fade-in slide-in-from-right-2 duration-200 pointer-events-auto">
      {/* Header del Inspector */}
      <div className="h-9 px-3 flex items-center justify-between border-b border-border/80 shrink-0 bg-secondary/30">
        <div className="flex items-center space-x-1.5">
          <Sliders className="w-3.5 h-3.5 text-amber-500" />
          <span className="font-bold uppercase tracking-wider text-[10.5px]">
            Cabecera de Inspector de Propiedades
          </span>
        </div>
        <button
          onClick={toggleInspector}
          className="p-1 hover:bg-secondary rounded text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
          title="Botón Cerrar Inspector de Propiedades"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Contenido scrolleable de Propiedades */}
      <div className="flex-1 overflow-y-auto custom-scrollbar p-3 space-y-4">
        {/* SECCIÓN 1: FORMA Y GEOMETRÍA */}
        <div className="space-y-2">
          <div className="flex items-center space-x-1 text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
            <Box className="w-3 h-3 text-sky-500" />
            <span>Sección 1 de Inspector (Geometría / Opciones)</span>
          </div>

          <div className="grid grid-cols-2 gap-1.5">
            {(['cube', 'sphere', 'cylinder', 'torus'] as const).map((shape) => (
              <button
                key={shape}
                onClick={() => setToolParams({ shape })}
                className={`px-2 py-1.5 rounded-lg font-semibold text-[10.5px] border transition-all cursor-pointer ${
                  toolParams.shape === shape
                    ? 'bg-foreground text-background border-foreground shadow-xs'
                    : 'bg-secondary/40 border-border/60 text-muted-foreground hover:text-foreground hover:bg-secondary'
                }`}
              >
                {shape === 'cube' && 'Opción 1.1 (Cubo)'}
                {shape === 'sphere' && 'Opción 1.2 (Esfera)'}
                {shape === 'cylinder' && 'Opción 1.3 (Cilindro)'}
                {shape === 'torus' && 'Opción 1.4 (Toroide)'}
              </button>
            ))}
          </div>
        </div>

        {/* SECCIÓN 2: TRANSFORMACIÓN */}
        <div className="space-y-2 pt-2 border-t border-border/60">
          <div className="flex items-center space-x-1 text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
            <Move className="w-3 h-3 text-emerald-500" />
            <span>Sección 2 de Inspector (Transformación / Posición)</span>
          </div>

          <div className="grid grid-cols-3 gap-1.5">
            <div>
              <label className="text-[9.5px] text-muted-foreground font-mono">Parámetro X</label>
              <input
                type="number"
                value={toolParams.posX}
                onChange={(e) => setToolParams({ posX: Number(e.target.value) || 0 })}
                className="w-full bg-secondary/60 border border-border/70 rounded px-1.5 py-1 text-center font-mono text-[11px] text-foreground outline-none focus:border-border"
              />
            </div>
            <div>
              <label className="text-[9.5px] text-muted-foreground font-mono">Parámetro Y</label>
              <input
                type="number"
                value={toolParams.posY}
                onChange={(e) => setToolParams({ posY: Number(e.target.value) || 0 })}
                className="w-full bg-secondary/60 border border-border/70 rounded px-1.5 py-1 text-center font-mono text-[11px] text-foreground outline-none focus:border-border"
              />
            </div>
            <div>
              <label className="text-[9.5px] text-muted-foreground font-mono">Parámetro Z</label>
              <input
                type="number"
                value={toolParams.posZ}
                onChange={(e) => setToolParams({ posZ: Number(e.target.value) || 0 })}
                className="w-full bg-secondary/60 border border-border/70 rounded px-1.5 py-1 text-center font-mono text-[11px] text-foreground outline-none focus:border-border"
              />
            </div>
          </div>

          {/* Slider de Escala */}
          <div className="space-y-1">
            <div className="flex justify-between text-[10px] text-muted-foreground">
              <span>Slider de Escala de Inspector</span>
              <span className="font-mono">{toolParams.scale.toFixed(1)}x</span>
            </div>
            <input
              type="range"
              min={0.2}
              max={3.0}
              step={0.1}
              value={toolParams.scale}
              onChange={(e) => setToolParams({ scale: Number(e.target.value) })}
              className="w-full accent-amber-500 cursor-pointer"
            />
          </div>
        </div>

        {/* SECCIÓN 3: COLOR Y MATERIAL */}
        <div className="space-y-2 pt-2 border-t border-border/60">
          <div className="flex items-center space-x-1 text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
            <Palette className="w-3 h-3 text-amber-500" />
            <span>Sección 3 de Inspector (Color y Aspecto)</span>
          </div>

          <div className="flex items-center space-x-2">
            <div className="flex flex-wrap gap-1.5 flex-1">
              {colorPresets.map((c) => (
                <button
                  key={c}
                  onClick={() => setToolParams({ color: c })}
                  style={{ backgroundColor: c }}
                  className={`w-5 h-5 rounded-full border transition-all cursor-pointer ${
                    toolParams.color === c
                      ? 'ring-2 ring-foreground scale-110'
                      : 'border-border/60 hover:scale-105'
                  }`}
                  title={`Color de Inspector: ${c}`}
                />
              ))}
            </div>
            <input
              type="color"
              value={toolParams.color}
              onChange={(e) => setToolParams({ color: e.target.value })}
              className="w-7 h-7 rounded border border-border/80 cursor-pointer bg-transparent"
              title="Selector de Color Personalizado de Inspector"
            />
          </div>

          {/* Opacidad */}
          <div className="space-y-1">
            <div className="flex justify-between text-[10px] text-muted-foreground">
              <span>Slider de Opacidad de Inspector</span>
              <span className="font-mono">{Math.round(toolParams.opacity * 100)}%</span>
            </div>
            <input
              type="range"
              min={0.1}
              max={1.0}
              step={0.05}
              value={toolParams.opacity}
              onChange={(e) => setToolParams({ opacity: Number(e.target.value) })}
              className="w-full accent-amber-500 cursor-pointer"
            />
          </div>

          {/* Switch Malla de Alambre */}
          <div className="flex items-center justify-between py-1">
            <span className="text-[11px] font-medium text-foreground">Switch de Malla (Wireframe)</span>
            <button
              onClick={() => setToolParams({ wireframe: !toolParams.wireframe })}
              className={`w-9 h-5 rounded-full p-0.5 transition-colors cursor-pointer ${
                toolParams.wireframe ? 'bg-amber-500' : 'bg-secondary border border-border'
              }`}
            >
              <div
                className={`w-4 h-4 rounded-full bg-white transition-transform ${
                  toolParams.wireframe ? 'translate-x-4' : 'translate-x-0'
                }`}
              />
            </button>
          </div>
        </div>

        {/* SECCIÓN 4: INFORMACIÓN DE ELEMENTO SELECCIONADO */}
        <div className="p-2.5 bg-secondary/30 rounded-lg border border-border/50 space-y-1">
          <div className="flex items-center space-x-1 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
            <Info className="w-3 h-3" />
            <span>Sección 4: Elemento Seleccionado</span>
          </div>
          <p className="text-[11px] font-mono text-foreground truncate">
            {store.selectedItemId || 'Ningún elemento seleccionado'}
          </p>
        </div>
      </div>
    </div>
  );
};
