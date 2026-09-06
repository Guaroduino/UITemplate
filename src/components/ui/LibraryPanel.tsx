import React, { useState, useMemo } from 'react';
import {
  Boxes,
  Plus,
  Search,
  Box,
  Cylinder,
  CircleDot,
  Layers,
  Sparkles,
  ArrowDownToLine,
  Check,
} from 'lucide-react';
import { INITIAL_LIBRARY_ITEMS } from '../../data/mockData';
import { useProjectStore } from '../../store/useProjectStore';
import { useUiStore } from '../../store/useUiStore';
import type { LibraryItem } from '../../types/ui';

export const LibraryPanel: React.FC = () => {
  const { insertFromLibrary } = useProjectStore();
  const { showNotice } = useUiStore();
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('Todas');
  const [justInsertedId, setJustInsertedId] = useState<string | null>(null);

  const categories = ['Todas', 'Básicos', 'Mecánicos', 'Arquitectura'];

  const filteredItems = useMemo(() => {
    return INITIAL_LIBRARY_ITEMS.filter((item) => {
      const matchesCat = selectedCategory === 'Todas' || item.category === selectedCategory;
      const matchesSearch =
        item.name.toLowerCase().includes(search.toLowerCase()) ||
        item.description.toLowerCase().includes(search.toLowerCase());
      return matchesCat && matchesSearch;
    });
  }, [search, selectedCategory]);

  const handleInsert = (item: LibraryItem) => {
    insertFromLibrary(item);
    setJustInsertedId(item.id);
    showNotice('build', `Insertado: "${item.name}"`, 'Añadido a la escena 3D en el origen.');
    setTimeout(() => setJustInsertedId(null), 1500);
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'cylinder':
        return <Cylinder className="w-5 h-5" />;
      case 'sphere':
        return <CircleDot className="w-5 h-5" />;
      case 'gear':
      case 'bracket':
        return <Layers className="w-5 h-5" />;
      case 'box':
      default:
        return <Box className="w-5 h-5" />;
    }
  };

  return (
    <div className="flex flex-col h-full bg-card text-foreground select-none text-xs">
      {/* Buscador Superior */}
      <div className="p-2 border-b border-border space-y-1.5 bg-card shrink-0">
        <div className="relative">
          <Search className="w-3 h-3 absolute left-2 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Buscar componentes..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-secondary text-foreground pl-7 pr-2 py-1 rounded-md border border-border outline-none focus:border-blue-500 text-[11px] transition-colors"
          />
        </div>

        {/* Filtros de Categoría */}
        <div className="flex items-center space-x-1 overflow-x-auto no-scrollbar py-0.5">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-2 py-0.5 rounded-md text-[10px] font-medium whitespace-nowrap transition-colors cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-foreground text-background font-bold'
                  : 'bg-secondary text-muted-foreground hover:text-foreground'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Lista de Componentes */}
      <div className="flex-1 overflow-y-auto p-2 space-y-2 custom-scrollbar">
        {filteredItems.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-48 text-center text-muted-foreground p-4">
            <Boxes className="w-8 h-8 mb-2 stroke-1" />
            <p className="font-medium text-xs">No se encontraron piezas</p>
            <p className="text-[10px] mt-0.5">Prueba con otro término de búsqueda</p>
          </div>
        ) : (
          filteredItems.map((item) => {
            const isInserted = justInsertedId === item.id;
            return (
              <div
                key={item.id}
                className="group p-2.5 rounded-xl border border-border bg-secondary/30 hover:bg-secondary/70 hover:border-foreground/30 transition-all flex flex-col space-y-2"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-2.5">
                    <div
                      className="w-8 h-8 rounded-lg flex items-center justify-center text-white shadow-xs"
                      style={{ backgroundColor: item.defaultColor }}
                    >
                      {getIcon(item.iconType)}
                    </div>
                    <div>
                      <h4 className="font-semibold text-xs text-foreground group-hover:text-blue-400 transition-colors">
                        {item.name}
                      </h4>
                      <span className="text-[10px] text-muted-foreground">
                        {item.category}
                      </span>
                    </div>
                  </div>
                </div>

                <p className="text-[11px] text-muted-foreground line-clamp-2 leading-relaxed">
                  {item.description}
                </p>

                <button
                  onClick={() => handleInsert(item)}
                  className={`w-full py-1.5 px-3 rounded-lg text-xs font-semibold flex items-center justify-center space-x-1.5 transition-all cursor-pointer shadow-xs ${
                    isInserted
                      ? 'bg-emerald-600 text-white'
                      : 'bg-secondary hover:bg-foreground hover:text-background text-foreground border border-border'
                  }`}
                >
                  {isInserted ? (
                    <>
                      <Check className="w-3.5 h-3.5" />
                      <span>¡Añadido!</span>
                    </>
                  ) : (
                    <>
                      <ArrowDownToLine className="w-3.5 h-3.5" />
                      <span>Insertar en Escena</span>
                    </>
                  )}
                </button>
              </div>
            );
          })
        )}
      </div>

      {/* Pie de Panel: Añadir componente personalizado */}
      <div className="p-2 border-t border-border bg-secondary/20 shrink-0">
        <button
          onClick={() => showNotice('build', 'Crear Componente', 'Selecciona objetos en escena para guardarlos como componente.')}
          className="w-full py-1.5 px-2.5 border border-dashed border-border hover:border-foreground/40 rounded-lg text-xs text-muted-foreground hover:text-foreground flex items-center justify-center space-x-1.5 transition-colors cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Guardar selección como pieza</span>
        </button>
      </div>
    </div>
  );
};
