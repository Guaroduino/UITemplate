import React, { useState } from 'react';
import {
  Library,
  Search,
  Plus,
  Box,
  Circle,
  Cylinder,
  Disc,
  Grid,
  Camera,
  Layers,
} from 'lucide-react';
import { useUIStore } from '../../useUIStore';
import type { AssetItem } from '../../types';

export const AssetLibrary: React.FC = () => {
  const store = useUIStore();
  const [selectedCategory, setSelectedCategory] = useState<string>('Todos');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const categories = ['Todos', 'Categoría Librería 1', 'Categoría Librería 2', 'Categoría Librería 3'];

  const filteredAssets = store.assetItems.filter((asset) => {
    const matchesCategory =
      selectedCategory === 'Todos' || asset.category === selectedCategory;
    const matchesSearch =
      !searchQuery ||
      asset.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      asset.tags?.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));

    return matchesCategory && matchesSearch;
  });

  const renderAssetIcon = (iconName?: string) => {
    switch (iconName) {
      case 'Box':
        return <Box className="w-5 h-5" />;
      case 'Circle':
        return <Circle className="w-5 h-5" />;
      case 'Cylinder':
        return <Cylinder className="w-5 h-5" />;
      case 'Disc':
        return <Disc className="w-5 h-5" />;
      case 'Grid':
        return <Grid className="w-5 h-5" />;
      case 'Camera':
        return <Camera className="w-5 h-5" />;
      default:
        return <Layers className="w-5 h-5" />;
    }
  };

  const handleInsertAsset = (asset: AssetItem) => {
    store.showNotification(`Elemento "${asset.name}" insertado en Viewport Central`, 'success');
  };

  return (
    <div className="flex flex-col h-full w-full overflow-hidden bg-card">
      {/* Header de la Librería */}
      <div className="h-8 px-3 flex items-center justify-between border-b border-border/80 shrink-0 bg-secondary/20">
        <div className="flex items-center space-x-1.5">
          <Library className="w-3.5 h-3.5 text-muted-foreground" />
          <span className="text-[11px] font-bold uppercase tracking-wider text-foreground">
            Cabecera de Librería (Panel Inferior)
          </span>
        </div>
        <button
          onClick={() => store.showNotification('Acción: Agregar en Librería (Panel Inferior)', 'info')}
          className="p-1 hover:bg-secondary text-muted-foreground hover:text-foreground rounded transition-colors cursor-pointer"
          title="Botón Agregar en Librería (Panel Inferior)"
        >
          <Plus className="w-3 h-3" />
        </button>
      </div>

      {/* Buscador de Recursos */}
      <div className="p-2 border-b border-border/60 shrink-0 space-y-1.5">
        <div className="relative flex items-center">
          <Search className="w-3 h-3 absolute left-2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Buscar en Librería (Panel Inferior)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-secondary/60 border border-border/70 rounded-md text-[11px] pl-6 pr-2 py-1 text-foreground placeholder:text-muted-foreground/60 outline-none focus:border-border focus:bg-secondary"
          />
        </div>

        {/* Píldoras de Categorías */}
        <div className="flex items-center space-x-1 overflow-x-auto no-scrollbar pt-0.5">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-2 py-0.5 rounded text-[10px] font-medium whitespace-nowrap transition-colors cursor-pointer ${
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

      {/* Grid de Tarjetas de Recursos */}
      <div className="flex-1 overflow-y-auto custom-scrollbar p-2">
        <div className="grid grid-cols-2 gap-2">
          {filteredAssets.map((asset) => (
            <div
              key={asset.id}
              onClick={() => handleInsertAsset(asset)}
              className="flex flex-col p-2 bg-secondary/30 hover:bg-secondary/70 border border-border/60 hover:border-border rounded-lg transition-all group cursor-pointer"
            >
              {/* Contenedor del Icono / Preview */}
              <div className="w-full h-14 rounded-md bg-background/60 border border-border/40 flex items-center justify-center text-muted-foreground group-hover:text-foreground group-hover:scale-105 transition-all">
                {renderAssetIcon(asset.icon)}
              </div>

              {/* Título y Categoría */}
              <div className="mt-1.5 min-w-0">
                <span className="block text-[11px] font-bold text-foreground truncate group-hover:text-amber-500 transition-colors">
                  {asset.name}
                </span>
                <span className="block text-[9.5px] text-muted-foreground/80 truncate">
                  {asset.category}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
