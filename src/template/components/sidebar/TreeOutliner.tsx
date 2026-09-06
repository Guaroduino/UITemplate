import React, { useState } from 'react';
import {
  Folder,
  FolderOpen,
  Eye,
  EyeOff,
  Lock,
  Unlock,
  Trash2,
  ChevronRight,
  ChevronDown,
  Layers,
  Box,
  Search,
  Plus,
} from 'lucide-react';
import { useUIStore } from '../../useUIStore';
import type { TreeItem } from '../../types';

export const TreeOutliner: React.FC = () => {
  const store = useUIStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedFolders, setExpandedFolders] = useState<Record<string, boolean>>({
    group_scene: true,
    group_assets: true,
  });

  const toggleFolder = (folderId: string) => {
    setExpandedFolders((prev) => ({
      ...prev,
      [folderId]: !prev[folderId],
    }));
  };

  const renderItemIcon = (item: TreeItem) => {
    if (item.type === 'folder') {
      const isExpanded = expandedFolders[item.id];
      return isExpanded ? (
        <FolderOpen className="w-3.5 h-3.5 text-amber-500 shrink-0" />
      ) : (
        <Folder className="w-3.5 h-3.5 text-amber-500 shrink-0" />
      );
    }
    if (item.type === 'layer') {
      return <Layers className="w-3.5 h-3.5 text-sky-500 shrink-0" />;
    }
    return <Box className="w-3.5 h-3.5 text-muted-foreground shrink-0" />;
  };

  const renderTreeNodes = (items: TreeItem[], depth = 0): React.ReactNode => {
    return items
      .filter((item) => {
        if (!searchQuery) return true;
        return (
          item.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.children?.some((c) => c.label.toLowerCase().includes(searchQuery.toLowerCase()))
        );
      })
      .map((item) => {
        const isFolder = item.type === 'folder';
        const isExpanded = expandedFolders[item.id];
        const isSelected = store.selectedItemId === item.id;

        return (
          <div key={item.id} className="flex flex-col">
            <div
              onClick={() => store.selectTreeItem(item.id)}
              style={{ paddingLeft: `${depth * 14 + 8}px` }}
              className={`flex items-center justify-between py-1 pr-2 rounded-md transition-colors group select-none cursor-pointer text-xs ${
                isSelected
                  ? 'bg-secondary font-semibold text-foreground'
                  : 'hover:bg-secondary/60 text-muted-foreground hover:text-foreground'
              }`}
            >
              {/* Lado Izquierdo: Expansor + Icono + Nombre */}
              <div className="flex items-center space-x-1.5 min-w-0 flex-1">
                {isFolder ? (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleFolder(item.id);
                    }}
                    className="p-0.5 hover:text-foreground text-muted-foreground/80 rounded transition-transform cursor-pointer"
                  >
                    {isExpanded ? (
                      <ChevronDown className="w-3 h-3" />
                    ) : (
                      <ChevronRight className="w-3 h-3" />
                    )}
                  </button>
                ) : (
                  <div className="w-4" />
                )}

                {renderItemIcon(item)}
                <span className="truncate text-[11.5px]">{item.label}</span>
              </div>

              {/* Lado Derecho: Acciones (Visibilidad, Bloqueo, Eliminar) */}
              <div className="flex items-center space-x-1 opacity-60 group-hover:opacity-100 transition-opacity">
                {/* Visibilidad */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    store.toggleTreeItemVisibility(item.id);
                  }}
                  className={`p-1 rounded hover:bg-secondary transition-colors cursor-pointer ${
                    item.isVisible ? 'text-foreground' : 'text-muted-foreground/40'
                  }`}
                  title={item.isVisible ? 'Ocultar elemento' : 'Mostrar elemento'}
                >
                  {item.isVisible ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                </button>

                {/* Bloqueo */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    store.toggleTreeItemLock(item.id);
                  }}
                  className={`p-1 rounded hover:bg-secondary transition-colors cursor-pointer ${
                    item.isLocked ? 'text-amber-500' : 'text-muted-foreground/40'
                  }`}
                  title={item.isLocked ? 'Desbloquear elemento' : 'Bloquear elemento'}
                >
                  {item.isLocked ? <Lock className="w-3 h-3" /> : <Unlock className="w-3 h-3" />}
                </button>

                {/* Eliminar */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    store.deleteTreeItem(item.id);
                  }}
                  className="p-1 rounded hover:bg-destructive hover:text-white text-muted-foreground/40 transition-colors cursor-pointer"
                  title="Eliminar elemento"
                >
                  <Trash2 className="w-3 h-3" />
                </button>
              </div>
            </div>

            {/* Hijos si está expandido */}
            {isFolder && isExpanded && item.children && item.children.length > 0 && (
              <div className="flex flex-col">
                {renderTreeNodes(item.children, depth + 1)}
              </div>
            )}
          </div>
        );
      });
  };

  return (
    <div className="flex flex-col h-full w-full overflow-hidden bg-card">
      {/* Header del Outliner */}
      <div className="h-8 px-3 flex items-center justify-between border-b border-border/80 shrink-0 bg-secondary/20">
        <div className="flex items-center space-x-1.5">
          <Layers className="w-3.5 h-3.5 text-muted-foreground" />
          <span className="text-[11px] font-bold uppercase tracking-wider text-foreground">
            Cabecera de Outliner (Árbol Superior)
          </span>
        </div>
        <button
          onClick={() => store.showNotification('Acción: Agregar Carpeta en Outliner', 'info')}
          className="p-1 hover:bg-secondary text-muted-foreground hover:text-foreground rounded transition-colors cursor-pointer"
          title="Botón Agregar Carpeta (Outliner)"
        >
          <Plus className="w-3 h-3" />
        </button>
      </div>

      {/* Buscador Rápido */}
      <div className="p-2 border-b border-border/60 shrink-0">
        <div className="relative flex items-center">
          <Search className="w-3 h-3 absolute left-2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Buscar en Outliner (Árbol Superior)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-secondary/60 border border-border/70 rounded-md text-[11px] pl-6 pr-2 py-1 text-foreground placeholder:text-muted-foreground/60 outline-none focus:border-border focus:bg-secondary"
          />
        </div>
      </div>

      {/* Lista Jerárquica */}
      <div className="flex-1 overflow-y-auto custom-scrollbar p-1.5 space-y-0.5">
        {renderTreeNodes(store.treeItems)}
      </div>
    </div>
  );
};
