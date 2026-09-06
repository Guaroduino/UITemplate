import React, { useState } from 'react';
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
  ChevronDown,
  ChevronRight,
} from 'lucide-react';
import { useProjectStore } from '../../store/useProjectStore';
import { useUiStore } from '../../store/useUiStore';
import { LibraryPanel } from './LibraryPanel';
import type { SceneObject } from '../../types/ui';

export const SidebarRight: React.FC = () => {
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

  const {
    sidebarTab,
    setSidebarTab,
    setSidebarOpen,
    showNotice,
  } = useUiStore();

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

  return (
    <aside className="w-72 md:w-80 h-full bg-card border-l border-border flex flex-col z-20 select-none text-xs transition-colors duration-200">
      {/* Selector de Pestañas Superior: Outliner vs Librería */}
      <div className="flex items-center justify-between px-2 pt-2 border-b border-border bg-card shrink-0">
        <div className="flex items-center space-x-1">
          <button
            onClick={() => setSidebarTab('outliner')}
            className={`flex items-center space-x-1.5 px-3 py-2 rounded-t-lg font-semibold transition-colors cursor-pointer text-xs border-b-2 ${
              sidebarTab === 'outliner'
                ? 'border-foreground text-foreground bg-secondary/60'
                : 'border-transparent text-muted-foreground hover:text-foreground hover:bg-secondary/30'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Outliner</span>
            <span className="ml-1 px-1.5 py-0.2 bg-secondary text-muted-foreground text-[10px] rounded-full">
              {objects.length}
            </span>
          </button>

          <button
            onClick={() => setSidebarTab('library')}
            className={`flex items-center space-x-1.5 px-3 py-2 rounded-t-lg font-semibold transition-colors cursor-pointer text-xs border-b-2 ${
              sidebarTab === 'library'
                ? 'border-foreground text-foreground bg-secondary/60'
                : 'border-transparent text-muted-foreground hover:text-foreground hover:bg-secondary/30'
            }`}
          >
            <Boxes className="w-3.5 h-3.5" />
            <span>Librería</span>
          </button>
        </div>

        {/* Botón para cerrar panel lateral */}
        <button
          onClick={() => setSidebarOpen(false)}
          className="p-1.5 text-muted-foreground hover:text-foreground hover:bg-secondary rounded-lg transition-colors cursor-pointer"
          title="Ocultar panel lateral"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Contenido según pestaña */}
      {sidebarTab === 'library' ? (
        <LibraryPanel />
      ) : (
        <div className="flex flex-col flex-1 min-h-0 overflow-hidden">
          {/* Barra de Búsqueda y Acciones Rápidas del Outliner */}
          <div className="p-2.5 border-b border-border flex items-center space-x-2 shrink-0 bg-secondary/20">
            <div className="relative flex-1">
              <Search className="w-3 h-3 absolute left-2 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input
                type="text"
                placeholder="Filtrar sólidos..."
                value={filterText}
                onChange={(e) => setFilterText(e.target.value)}
                className="w-full bg-secondary text-foreground pl-7 pr-2 py-1 rounded-md border border-border text-[11px] outline-none focus:border-blue-500"
              />
            </div>

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
              className="p-1.5 bg-foreground text-background hover:opacity-90 rounded-md transition-opacity cursor-pointer"
              title="Añadir nuevo sólido primitivo"
            >
              <Plus className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Árbol de Elementos */}
          <div className="flex-1 overflow-y-auto p-2 space-y-1 custom-scrollbar">
            {filteredObjects.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-48 text-center text-muted-foreground">
                <Layers className="w-8 h-8 mb-2 stroke-1 opacity-60" />
                <p className="font-semibold text-xs">Escena vacía</p>
                <p className="text-[10px] mt-0.5">Inserta sólidos desde la librería o el ribbon</p>
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
                      {/* Indicador de Color y Tipo */}
                      <div
                        className="w-2.5 h-2.5 rounded-full shrink-0"
                        style={{ backgroundColor: obj.color }}
                      />
                      <div className="shrink-0">{getObjectIcon(obj.type)}</div>

                      {/* Nombre editable */}
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

                    {/* Acciones del Elemento (Visibilidad, Candado, Opciones) */}
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
      )}
    </aside>
  );
};
