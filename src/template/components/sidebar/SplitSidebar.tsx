import React, { useRef, useState, useCallback, useEffect } from 'react';
import { TreeOutliner } from './TreeOutliner';
import { AssetLibrary } from './AssetLibrary';
import { useUIStore } from '../../useUIStore';

export const SplitSidebar: React.FC = () => {
  const store = useUIStore();
  const sidebarRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  useEffect(() => {
    if (!isDragging) return;

    const handleMouseMove = (e: MouseEvent) => {
      if (!sidebarRef.current) return;
      const rect = sidebarRef.current.getBoundingClientRect();
      const relativeY = e.clientY - rect.top;
      const newRatio = relativeY / rect.height;
      store.setSidebarSplitRatio(newRatio);
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, store]);

  if (!store.isSidebarOpen) return null;

  const topHeightPercent = `${store.sidebarSplitRatio * 100}%`;

  return (
    <aside
      ref={sidebarRef}
      className={`w-72 lg:w-80 h-full border-l border-border bg-card flex flex-col shrink-0 relative select-none transition-all z-20 ${
        isDragging ? 'cursor-row-resize select-none' : ''
      }`}
    >
      {/* SECCIÓN SUPERIOR: OUTLINER (Árbol de Escena) */}
      <div
        style={{ height: topHeightPercent }}
        className="w-full overflow-hidden flex flex-col min-h-[120px]"
      >
        <TreeOutliner />
      </div>

      {/* DIVISOR DESLIZABLE RESIZE SPLITTER */}
      <div
        onMouseDown={handleMouseDown}
        className={`h-2 w-full bg-secondary/50 hover:bg-amber-500/80 border-t border-b border-border/60 transition-colors cursor-row-resize flex items-center justify-center shrink-0 z-30 group ${
          isDragging ? 'bg-amber-500' : ''
        }`}
        title="Divisor Deslizable (Resize Splitter) entre Outliner y Librería"
      >
        {/* Pastilla de agarre visual */}
        <div className="w-8 h-1 rounded-full bg-border group-hover:bg-slate-950 transition-colors" />
      </div>

      {/* SECCIÓN INFERIOR: LIBRERÍA DE COMPONENTES */}
      <div className="flex-1 w-full overflow-hidden min-h-[120px]">
        <AssetLibrary />
      </div>
    </aside>
  );
};
