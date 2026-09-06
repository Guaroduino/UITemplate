import React from 'react';
import {
  Move,
  RotateCw,
  Maximize2,
  Trash2,
  Copy,
  Eye,
  EyeOff,
  Palette,
  X,
  Sliders,
  Check,
} from 'lucide-react';
import { useProjectStore } from '../../store/useProjectStore';
import { useUiStore } from '../../store/useUiStore';

export const ToolContextPanel: React.FC = () => {
  const {
    objects,
    selectedObjectId,
    selectObject,
    updateObject,
    duplicateObject,
    removeObject,
    toggleVisibility,
  } = useProjectStore();

  const {
    transformMode,
    setTransformMode,
    isContextPanelOpen,
    setContextPanelOpen,
    showNotice,
  } = useUiStore();

  const selectedObject = objects.find((o) => o.id === selectedObjectId);

  if (!selectedObject || !isContextPanelOpen) return null;

  const handlePositionChange = (axis: 0 | 1 | 2, val: number) => {
    const pos = [...selectedObject.position] as [number, number, number];
    pos[axis] = isNaN(val) ? 0 : val;
    updateObject(selectedObject.id, { position: pos });
  };

  const handleScaleChange = (axis: 0 | 1 | 2, val: number) => {
    const scale = [...selectedObject.scale] as [number, number, number];
    scale[axis] = isNaN(val) || val <= 0 ? 0.1 : val;
    updateObject(selectedObject.id, { scale: scale });
  };

  const colors = [
    '#007acc',
    '#38bdf8',
    '#10b981',
    '#eab308',
    '#f97316',
    '#ef4444',
    '#a855f7',
    '#64748b',
  ];

  return (
    <div className="absolute top-4 right-4 z-20 w-72 bg-card/95 backdrop-blur-md border border-border rounded-2xl shadow-2xl p-4 text-xs select-none transition-colors animate-in fade-in slide-in-from-right-2 duration-150">
      {/* Cabecera del Panel */}
      <div className="flex items-center justify-between pb-3 border-b border-border">
        <div className="flex items-center space-x-2">
          <div
            className="w-3 h-3 rounded-full shrink-0 shadow-xs"
            style={{ backgroundColor: selectedObject.color }}
          />
          <span className="font-bold text-foreground truncate max-w-[170px]">
            {selectedObject.name}
          </span>
        </div>

        <button
          onClick={() => setContextPanelOpen(false)}
          className="p-1 text-muted-foreground hover:text-foreground hover:bg-secondary rounded-lg transition-colors cursor-pointer"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Selector de Modo de Manipulación */}
      <div className="py-3 border-b border-border">
        <span className="text-[10px] text-muted-foreground font-semibold uppercase tracking-wider block mb-2">
          Manipulador 3D
        </span>
        <div className="grid grid-cols-3 gap-1.5 bg-secondary/50 p-1 rounded-xl border border-border">
          <button
            onClick={() => setTransformMode(transformMode === 'translate' ? 'none' : 'translate')}
            className={`flex items-center justify-center space-x-1 py-1.5 rounded-lg font-medium transition-colors cursor-pointer ${
              transformMode === 'translate'
                ? 'bg-foreground text-background font-bold shadow-xs'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <Move className="w-3.5 h-3.5" />
            <span className="text-[10px]">Mover</span>
          </button>

          <button
            onClick={() => setTransformMode(transformMode === 'rotate' ? 'none' : 'rotate')}
            className={`flex items-center justify-center space-x-1 py-1.5 rounded-lg font-medium transition-colors cursor-pointer ${
              transformMode === 'rotate'
                ? 'bg-foreground text-background font-bold shadow-xs'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <RotateCw className="w-3.5 h-3.5" />
            <span className="text-[10px]">Girar</span>
          </button>

          <button
            onClick={() => setTransformMode(transformMode === 'scale' ? 'none' : 'scale')}
            className={`flex items-center justify-center space-x-1 py-1.5 rounded-lg font-medium transition-colors cursor-pointer ${
              transformMode === 'scale'
                ? 'bg-foreground text-background font-bold shadow-xs'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <Maximize2 className="w-3.5 h-3.5" />
            <span className="text-[10px]">Escala</span>
          </button>
        </div>
      </div>

      {/* Coordenadas de Posición (X, Y, Z) */}
      <div className="py-3 border-b border-border space-y-2">
        <span className="text-[10px] text-muted-foreground font-semibold uppercase tracking-wider block">
          Posición (mm)
        </span>
        <div className="grid grid-cols-3 gap-2">
          {(['X', 'Y', 'Z'] as const).map((axis, i) => (
            <div key={axis} className="flex items-center space-x-1 bg-secondary rounded-lg px-2 py-1 border border-border">
              <span className={`text-[10px] font-mono font-bold ${
                axis === 'X' ? 'text-rose-500' : axis === 'Y' ? 'text-emerald-500' : 'text-blue-500'
              }`}>
                {axis}
              </span>
              <input
                type="number"
                step="0.1"
                value={selectedObject.position[i as 0 | 1 | 2]}
                onChange={(e) => handlePositionChange(i as 0 | 1 | 2, parseFloat(e.target.value))}
                className="w-full bg-transparent text-foreground text-right outline-none text-[11px] font-mono"
              />
            </div>
          ))}
        </div>
      </div>

      {/* Dimensiones / Escala */}
      <div className="py-3 border-b border-border space-y-2">
        <span className="text-[10px] text-muted-foreground font-semibold uppercase tracking-wider block">
          Dimensiones (Escala)
        </span>
        <div className="grid grid-cols-3 gap-2">
          {(['L', 'A', 'H'] as const).map((dim, i) => (
            <div key={dim} className="flex items-center space-x-1 bg-secondary rounded-lg px-2 py-1 border border-border">
              <span className="text-[10px] font-mono font-bold text-muted-foreground">
                {dim}
              </span>
              <input
                type="number"
                step="0.1"
                min="0.1"
                value={selectedObject.scale[i as 0 | 1 | 2]}
                onChange={(e) => handleScaleChange(i as 0 | 1 | 2, parseFloat(e.target.value))}
                className="w-full bg-transparent text-foreground text-right outline-none text-[11px] font-mono"
              />
            </div>
          ))}
        </div>
      </div>

      {/* Selector de Color Rápido */}
      <div className="py-3 border-b border-border space-y-2">
        <span className="text-[10px] text-muted-foreground font-semibold uppercase tracking-wider block">
          Color del Material
        </span>
        <div className="flex items-center justify-between">
          {colors.map((c) => (
            <button
              key={c}
              onClick={() => updateObject(selectedObject.id, { color: c })}
              className="w-5 h-5 rounded-full border border-black/20 hover:scale-110 transition-transform cursor-pointer flex items-center justify-center"
              style={{ backgroundColor: c }}
            >
              {selectedObject.color === c && <Check className="w-3 h-3 text-white drop-shadow" />}
            </button>
          ))}
        </div>
      </div>

      {/* Acciones Rápidas */}
      <div className="pt-3 flex items-center space-x-2">
        <button
          onClick={() => {
            duplicateObject(selectedObject.id);
            showNotice('build', 'Duplicado', `Copia de "${selectedObject.name}" creada.`);
          }}
          className="flex-1 py-1.5 px-2.5 bg-secondary hover:bg-secondary/80 border border-border rounded-xl text-foreground font-semibold flex items-center justify-center space-x-1.5 transition-colors cursor-pointer"
        >
          <Copy className="w-3.5 h-3.5" />
          <span>Duplicar</span>
        </button>

        <button
          onClick={() => {
            removeObject(selectedObject.id);
            showNotice('general', 'Eliminado', 'Objeto removido de la escena.');
          }}
          className="py-1.5 px-2.5 bg-rose-500/10 hover:bg-rose-500/20 text-rose-500 border border-rose-500/30 rounded-xl font-semibold flex items-center justify-center transition-colors cursor-pointer"
          title="Eliminar objeto"
        >
          <Trash2 className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
