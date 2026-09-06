import React from 'react';
import {
  MousePointer2,
  Move,
  RotateCw,
  Maximize2,
  Trash2,
  Copy,
  X,
} from 'lucide-react';
import { useProjectStore } from '../../store/useProjectStore';
import { useUiStore } from '../../store/useUiStore';

export const SelectionContextBar: React.FC = () => {
  const {
    objects,
    selectedObjectId,
    selectObject,
    updateObject,
    duplicateObject,
    removeObject,
  } = useProjectStore();

  const {
    transformMode,
    setTransformMode,
    showNotice,
  } = useUiStore();

  const selectedObject = objects.find((o) => o.id === selectedObjectId);

  if (!selectedObject) return null;

  const handlePositionChange = (axis: 0 | 1 | 2, val: number) => {
    const pos = [...selectedObject.position] as [number, number, number];
    pos[axis] = isNaN(val) ? 0 : val;
    updateObject(selectedObject.id, { position: pos });
  };

  const handleRotate90 = () => {
    const rot = [...selectedObject.rotation] as [number, number, number];
    rot[1] += Math.PI / 2;
    updateObject(selectedObject.id, { rotation: rot });
    showNotice('general', 'Rotado 90°', `"${selectedObject.name}" rotado 90 grados.`);
  };

  return (
    <div className="absolute top-3 left-1/2 -translate-x-1/2 z-20 animate-in fade-in slide-in-from-top-3 duration-200 pointer-events-auto max-w-[calc(100vw-2rem)]">
      <div className="bg-card/95 backdrop-blur-xl border border-border shadow-2xl rounded-full px-3.5 py-1.5 flex items-center gap-2.5 w-max max-w-full flex-wrap justify-center text-xs select-none">
        {/* Chip de Objeto Seleccionado */}
        <div className="flex items-center gap-1.5 font-bold text-foreground pl-1 shrink-0">
          <div
            className="w-2.5 h-2.5 rounded-full shadow-xs"
            style={{ backgroundColor: selectedObject.color }}
          />
          <MousePointer2 className="w-3.5 h-3.5 text-blue-500" />
          <span className="truncate max-w-[120px] sm:max-w-[160px]">
            {selectedObject.name}
          </span>
        </div>

        <div className="h-4 w-px bg-border shrink-0" />

        {/* Modos de Manipulador 3D */}
        <div className="flex items-center bg-secondary/80 rounded-full p-0.5 border border-border shrink-0">
          <button
            onClick={() => setTransformMode(transformMode === 'translate' ? 'none' : 'translate')}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold transition-all cursor-pointer ${
              transformMode === 'translate'
                ? 'bg-foreground text-background font-bold shadow-xs'
                : 'text-muted-foreground hover:text-foreground'
            }`}
            title="Manipulador: Mover"
          >
            <Move className="w-3 h-3" />
            <span className="hidden sm:inline">Mover</span>
          </button>

          <button
            onClick={() => setTransformMode(transformMode === 'rotate' ? 'none' : 'rotate')}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold transition-all cursor-pointer ${
              transformMode === 'rotate'
                ? 'bg-foreground text-background font-bold shadow-xs'
                : 'text-muted-foreground hover:text-foreground'
            }`}
            title="Manipulador: Girar"
          >
            <RotateCw className="w-3 h-3" />
            <span className="hidden sm:inline">Girar</span>
          </button>

          <button
            onClick={() => setTransformMode(transformMode === 'scale' ? 'none' : 'scale')}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold transition-all cursor-pointer ${
              transformMode === 'scale'
                ? 'bg-foreground text-background font-bold shadow-xs'
                : 'text-muted-foreground hover:text-foreground'
            }`}
            title="Manipulador: Escala"
          >
            <Maximize2 className="w-3 h-3" />
            <span className="hidden sm:inline">Escala</span>
          </button>
        </div>

        {/* Botón Rotar 90° */}
        <button
          onClick={handleRotate90}
          className="flex items-center gap-1 px-2.5 py-1 bg-secondary hover:bg-secondary/70 text-foreground rounded-full text-[11px] font-semibold transition-colors cursor-pointer shrink-0"
          title="Rotar 90° alrededor del eje vertical"
        >
          <RotateCw className="w-3 h-3 text-blue-500" />
          <span className="hidden md:inline">90°</span>
        </button>

        <div className="h-4 w-px bg-border shrink-0" />

        {/* Coordenadas X, Y, Z directas */}
        <div className="flex items-center gap-1.5 bg-secondary/80 rounded-full px-2.5 py-0.5 border border-border text-[11px] font-mono shrink-0">
          {(['X', 'Y', 'Z'] as const).map((axis, i) => (
            <div key={axis} className="flex items-center gap-0.5">
              <span className={`text-[10px] font-bold ${
                axis === 'X' ? 'text-rose-500' : axis === 'Y' ? 'text-emerald-500' : 'text-blue-500'
              }`}>
                {axis}:
              </span>
              <input
                type="number"
                step="0.5"
                value={selectedObject.position[i as 0 | 1 | 2]}
                onChange={(e) => handlePositionChange(i as 0 | 1 | 2, parseFloat(e.target.value))}
                className="w-12 bg-card text-foreground px-1 py-0.5 rounded text-[11px] font-mono text-right outline-none focus:ring-1 focus:ring-blue-500 border border-border"
              />
            </div>
          ))}
          <span className="text-[9px] text-muted-foreground ml-0.5">mm</span>
        </div>

        <div className="h-4 w-px bg-border shrink-0" />

        {/* Duplicar */}
        <button
          onClick={() => {
            duplicateObject(selectedObject.id);
            showNotice('build', 'Duplicado', `Copia de "${selectedObject.name}" creada.`);
          }}
          className="flex items-center gap-1 px-2.5 py-1 hover:bg-secondary text-muted-foreground hover:text-foreground rounded-full text-[11px] font-semibold transition-colors cursor-pointer shrink-0"
          title="Duplicar objeto"
        >
          <Copy className="w-3 h-3" />
          <span className="hidden lg:inline">Duplicar</span>
        </button>

        {/* Deseleccionar */}
        <button
          onClick={() => selectObject(null)}
          className="flex items-center gap-1 px-2 py-1 text-muted-foreground hover:text-foreground hover:bg-secondary rounded-full text-[11px] transition-colors cursor-pointer shrink-0"
          title="Deseleccionar objeto (Escape)"
        >
          <X className="w-3 h-3" />
          <span className="hidden sm:inline">Deseleccionar</span>
        </button>

        {/* Eliminar */}
        <button
          onClick={() => {
            removeObject(selectedObject.id);
            showNotice('general', 'Eliminado', 'Objeto removido.');
          }}
          className="flex items-center gap-1 px-2.5 py-1 bg-rose-500/10 hover:bg-rose-500/20 text-rose-500 border border-rose-500/30 rounded-full text-[11px] font-semibold transition-colors cursor-pointer shrink-0"
          title="Eliminar objeto seleccionado"
        >
          <Trash2 className="w-3 h-3" />
          <span className="hidden sm:inline">Eliminar</span>
        </button>
      </div>
    </div>
  );
};
