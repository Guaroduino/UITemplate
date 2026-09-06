import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  Layers,
  Boxes,
  Eye,
  EyeOff,
  Lock,
  Unlock,
  Trash2,
  Copy,
  Box,
  Cylinder,
  CircleDot,
  X,
  Plus,
  Search,
} from 'lucide-react';
import { useProjectStore } from '../../store/useProjectStore';
import { useUiStore } from '../../store/useUiStore';
import { LibraryPanel } from './LibraryPanel';
import type { SceneObject } from '../../types/ui';

export const SidebarRight: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [splitPercent, setSplitPercent] = useState<number>(50);
  const [isDragging, setIsDragging] = useState<boolean>(false);

  const {
    objects,
    selectedObjectId,
    selectObject,
    toggleVisibility,
    toggleLock,
    removeObject,
    duplicateObject,
    addObject,
    updateObject,
  } = useProjectStore();

  const { setSidebarOpen, showNotice } = useUiStore();

  const [filterText, setFilterText] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState('');

  const filteredObjects = objects.filter((o) =>
    o.name.toLowerCase().includes(filterText.toLowerCase())
  );

  const getObjectIcon = (type: SceneObject['type']) => {
    switch (type) {
      case 'cylinder':
        return <Cylinder className="w-3.5 h-3.5 text-sky-400" />;
      case 'sphere':
        return <CircleDot className="w-3.5 h-3.5 text-purple-400" />;
      case 'box':
      default:
        return <Box className="w-3.5 h-3.5 text-blue-400" />;
    }
  };

  const handleStartRename = (obj: SceneObject, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingId(obj.id);
    setEditingName(obj.name);
  };

  const handleFinishRename = (id: string) => {
    if (editingName.trim()) {
      updateObject(id, { name: editingName.trim() });
    }
    setEditingId(null);
  };

  // Manejo del control deslizable para redimensionar paneles
  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  useEffect(() => {
    if (!isDragging) return;

    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const relativeY = e.clientY - rect.top;
      const newPercent = (relativeY / rect.height) * 100;
      // Limitar entre 20% y 80%
      const clamped = Math.max(20, Math.min(80, newPercent));
      setSplitPercent(clamped);
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);

    document.body.style.cursor = 'row-resize';
    document.body.style.userSelect = 'none';

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
    };
  }, [isDragging]);

  return (
    <aside
      ref={containerRef}
      className="w-72 md:w-80 h-full bg-card border-l border-border flex flex-col z-20 select-none text-xs transition-colors duration-200 overflow-hidden"
    >
      {/* ========================================================================= */}
      {/* 1. SECCIÓN SUPERIOR: OUTLINER (Árbol de Escena)                            */}
      {/* ========================================================================= */}
      <div
        style={{ height: `calc(${splitPercent}% - 5px)` }}
        className="flex flex-col min-h-0 overflow-hidden bg-card"
      >
        {/* Cabecera del Outliner */}
        <div className="flex items-center justify-between px-3 py-2 border-b border-border bg-secondary/30 shrink-0">
          <div className="flex items-center space-x-2">
            <Layers className="w-3.5 h-3.5 text-blue-500" />
            <span className="font-bold text-foreground">Outliner</span>
            <span className="px-1.5 py-0.2 bg-secondary text-muted-foreground text-[10px] font-semibold rounded-full border border-border">
              {objects.length}
            </span>
          </div>

          <div className="flex items-center space-x-1">
            <button
              onClick={() => {
                addObject({
                  name: `Cubo ${objects.length + 1}`,
                  type: 'box',
                  visible: true,
                  locked: false,
                  color: '#3b82f6',
                  position: [0, 0.5, 0],
                  rotation: [0, 0, 0],
                  scale: [1, 1, 1],
                });
                showNotice('build', 'Cubo Creado', 'Añadido nuevo objeto primario.');
              }}
              className="p-1 hover:bg-secondary text-muted-foreground hover:text-foreground rounded-lg transition-colors cursor-pointer"
              title="Añadir sólido primitivo"
            >
              <Plus className="w-3.5 h-3.5" />
            </button>

            <button
              onClick={() => setSidebarOpen(false)}
              className="p-1 text-muted-foreground hover:text-foreground hover:bg-secondary rounded-lg transition-colors cursor-pointer"
              title="Ocultar panel lateral"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Buscador de Sólidos */}
        <div className="p-2 border-b border-border flex items-center shrink-0 bg-card">
          <div className="relative w-full">
            <Search className="w-3 h-3 absolute left-2 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              placeholder="Filtrar sólidos..."
              value={filterText}
              onChange={(e) => setFilterText(e.target.value)}
              className="w-full bg-secondary text-foreground pl-7 pr-2 py-1 rounded-md border border-border text-[11px] outline-none focus:border-blue-500 transition-colors"
            />
          </div>
        </div>

        {/* Lista de Objetos del Outliner */}
        <div className="flex-1 overflow-y-auto p-2 space-y-1 custom-scrollbar">
          {filteredObjects.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-32 text-center text-muted-foreground">
              <Layers className="w-7 h-7 mb-1.5 stroke-1 opacity-50" />
              <p className="font-semibold text-xs">Escena vacía</p>
              <p className="text-[10px] mt-0.5">Inserta sólidos desde la librería</p>
            </div>
          ) : (
            filteredObjects.map((obj) => {
              const isSelected = selectedObjectId === obj.id;
              return (
                <div
                  key={obj.id}
                  onClick={() => selectObject(obj.id)}
                  className={`group flex items-center justify-between px-2.5 py-1.5 rounded-lg border transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-blue-500/10 border-blue-500/40 text-foreground font-semibold shadow-xs'
                      : 'bg-secondary/30 hover:bg-secondary/70 border-transparent text-muted-foreground hover:text-foreground'
                  }`}
                >
                  <div className="flex items-center space-x-2 min-w-0 flex-1">
                    <div
                      className="w-2.5 h-2.5 rounded-full shrink-0 shadow-xs"
                      style={{ backgroundColor: obj.color }}
                    />
                    <div className="shrink-0">{getObjectIcon(obj.type)}</div>

                    {editingId === obj.id ? (
                      <input
                        type="text"
                        value={editingName}
                        autoFocus
                        onClick={(e) => e.stopPropagation()}
                        onChange={(e) => setEditingName(e.target.value)}
                        onBlur={() => handleFinishRename(obj.id)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') handleFinishRename(obj.id);
                          if (e.key === 'Escape') setEditingId(null);
                        }}
                        className="bg-card border border-blue-500 text-foreground text-xs px-1.5 py-0.5 rounded outline-none w-full"
                      />
                    ) : (
                      <span
                        onDoubleClick={(e) => handleStartRename(obj, e)}
                        className="truncate text-xs select-none"
                        title="Doble clic para renombrar"
                      >
                        {obj.name}
                      </span>
                    )}
                  </div>

                  <div className="flex items-center space-x-0.5 opacity-80 group-hover:opacity-100 shrink-0 ml-1">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleVisibility(obj.id);
                      }}
                      className="p-1 hover:bg-secondary text-muted-foreground hover:text-foreground rounded transition-colors"
                      title={obj.visible ? 'Ocultar objeto' : 'Mostrar objeto'}
                    >
                      {obj.visible ? (
                        <Eye className="w-3 h-3" />
                      ) : (
                        <EyeOff className="w-3 h-3 text-muted-foreground/50" />
                      )}
                    </button>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleLock(obj.id);
                      }}
                      className="p-1 hover:bg-secondary text-muted-foreground hover:text-foreground rounded transition-colors"
                      title={obj.locked ? 'Desbloquear objeto' : 'Bloquear objeto'}
                    >
                      {obj.locked ? (
                        <Lock className="w-3 h-3 text-amber-500" />
                      ) : (
                        <Unlock className="w-3 h-3 opacity-40 hover:opacity-100" />
                      )}
                    </button>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        duplicateObject(obj.id);
                        showNotice('build', 'Duplicado', `Copia de "${obj.name}" creada.`);
                      }}
                      className="p-1 hover:bg-secondary text-muted-foreground hover:text-foreground rounded transition-colors hidden group-hover:inline-flex"
                      title="Duplicar objeto"
                    >
                      <Copy className="w-3 h-3" />
                    </button>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        removeObject(obj.id);
                        showNotice('general', 'Eliminado', `"${obj.name}" se eliminó de la escena.`);
                      }}
                      className="p-1 hover:bg-rose-500/20 text-muted-foreground hover:text-rose-500 rounded transition-colors"
                      title="Eliminar objeto"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 2. CONTROL DESLIZABLE / RESIZE SPLITTER HANDLE                            */}
      {/* ========================================================================= */}
      <div
        onMouseDown={handleMouseDown}
        onDoubleClick={() => setSplitPercent(50)}
        className={`h-2.5 w-full shrink-0 flex items-center justify-center cursor-row-resize select-none transition-all group relative z-10 ${
          isDragging ? 'bg-blue-500/30 ring-1 ring-blue-500' : 'bg-secondary/60 hover:bg-blue-500/20'
        } border-y border-border`}
        title="Arrastra para redimensionar Outliner y Librería (Doble clic para 50/50)"
      >
        <div className="w-10 h-1 rounded-full bg-muted-foreground/40 group-hover:bg-blue-500 group-hover:w-14 transition-all flex items-center justify-center" />
      </div>

      {/* ========================================================================= */}
      {/* 3. SECCIÓN INFERIOR: LIBRERÍA DE COMPONENTES                              */}
      {/* ========================================================================= */}
      <div
        style={{ height: `calc(${100 - splitPercent}% - 5px)` }}
        className="flex flex-col min-h-0 overflow-hidden bg-card"
      >
        {/* Cabecera de la Librería */}
        <div className="flex items-center justify-between px-3 py-2 border-b border-border bg-secondary/30 shrink-0">
          <div className="flex items-center space-x-2">
            <Boxes className="w-3.5 h-3.5 text-purple-500" />
            <span className="font-bold text-foreground">Librería</span>
          </div>
        </div>

        <div className="flex-1 min-h-0 overflow-hidden">
          <LibraryPanel />
        </div>
      </div>
    </aside>
  );
};
