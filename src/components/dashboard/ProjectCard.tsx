import React from 'react';
import { Box, Layers, Clock, Trash2, ArrowUpRight, Star } from 'lucide-react';
import type { ProjectItem } from '../../types/ui';

interface ProjectCardProps {
  project: ProjectItem;
  onOpen: (project: ProjectItem) => void;
  onDelete: (id: string) => void;
}

export const ProjectCard: React.FC<ProjectCardProps> = ({
  project,
  onOpen,
  onDelete,
}) => {
  return (
    <div
      onClick={() => onOpen(project)}
      className="group relative bg-card hover:bg-secondary/40 border border-border hover:border-foreground/40 rounded-2xl p-4 transition-all duration-200 cursor-pointer shadow-xs hover:shadow-md flex flex-col justify-between select-none"
    >
      {/* Miniatura Gráfica Técnica */}
      <div className="w-full h-36 bg-secondary/30 rounded-xl border border-border flex items-center justify-center relative overflow-hidden mb-3 group-hover:border-foreground/20 transition-colors">
        {/* Patrón de fondo tipo rejilla milimétrica */}
        <div
          className="absolute inset-0 opacity-10 pointer-events-none"
          style={{
            backgroundImage:
              'linear-gradient(currentColor 1px, transparent 1px), linear-gradient(90deg, currentColor 1px, transparent 1px)',
            backgroundSize: '16px 16px',
          }}
        />

        <div className="relative p-3.5 bg-secondary text-foreground rounded-2xl border border-border group-hover:scale-105 transition-transform duration-200 shadow-xs">
          <Box className="w-8 h-8 text-blue-500" />
        </div>

        {/* Badge de sólidos */}
        <div className="absolute bottom-2 left-2 z-20 flex items-center space-x-1 px-2 py-0.5 bg-card/90 backdrop-blur-md rounded-md text-[10px] font-medium text-foreground border border-border shadow-xs">
          <Layers className="w-3 h-3 text-muted-foreground" />
          <span>{project.itemCount} entidades</span>
        </div>

        {/* Botón Abrir flotante */}
        <div className="absolute top-2 right-2 z-20 p-1.5 bg-foreground text-background rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 shadow-xs">
          <ArrowUpRight className="w-4 h-4" />
        </div>
      </div>

      {/* Datos del Proyecto */}
      <div>
        <div className="flex items-center justify-between mb-1">
          <h3 className="font-bold text-sm text-foreground group-hover:text-blue-500 transition-colors truncate">
            {project.name}
          </h3>
          {project.isFavorite && (
            <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500 shrink-0 ml-1" />
          )}
        </div>

        <div className="flex items-center justify-between text-[11px] text-muted-foreground mt-2 pt-2 border-t border-border">
          <div className="flex items-center space-x-1">
            <Clock className="w-3 h-3" />
            <span>{project.updatedAt}</span>
          </div>

          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete(project.id);
            }}
            className="p-1 hover:text-rose-500 hover:bg-rose-500/10 rounded transition-colors"
            title="Eliminar proyecto"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
