import React, { useState } from 'react';
import {
  Box,
  FolderKanban,
  Boxes,
  Plus,
  ArrowRight,
  Settings as SettingsIcon,
  Maximize2,
  Minimize2,
  Sparkles,
  Layers,
} from 'lucide-react';
import { useProjectStore } from '../../store/useProjectStore';
import { useUiStore } from '../../store/useUiStore';
import { INITIAL_LIBRARY_ITEMS } from '../../data/mockData';
import { ProjectCard } from './ProjectCard';
import type { ProjectItem } from '../../types/ui';

export const Dashboard: React.FC = () => {
  const {
    projects,
    openProject,
    deleteProject,
    createNewProject,
    insertFromLibrary,
  } = useProjectStore();

  const { setView, setSettingsOpen, showNotice } = useUiStore();
  const [isFullscreen, setIsFullscreen] = useState(false);

  const toggleFullscreen = async () => {
    try {
      if (!document.fullscreenElement) {
        await document.documentElement.requestFullscreen?.();
        setIsFullscreen(true);
      } else {
        await document.exitFullscreen?.();
        setIsFullscreen(false);
      }
    } catch (e) {
      console.warn('Fullscreen error:', e);
    }
  };

  const handleCreateNew = () => {
    createNewProject('Nuevo Modelo Paramétrico');
    setView('workspace');
    showNotice('general', 'Nuevo Proyecto', 'Espacio de trabajo listo para diseñar.');
  };

  const handleOpenProject = (proj: ProjectItem) => {
    openProject(proj);
    setView('workspace');
    showNotice('general', `Abierto: ${proj.name}`, 'Geometrías cargadas en la escena.');
  };

  return (
    <div className="flex flex-col h-[100dvh] max-h-[100dvh] w-screen bg-background text-foreground overflow-y-auto custom-scrollbar p-6 md:p-8 select-none transition-colors duration-200">
      {/* Barra Superior del Dashboard */}
      <header className="flex items-center justify-between pb-6 mb-6 border-b border-border shrink-0 max-w-7xl w-full mx-auto">
        <div className="flex items-center space-x-3.5">
          <div className="p-2.5 bg-foreground text-background rounded-2xl shadow-xs">
            <Box className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-xl font-bold tracking-tight text-foreground">
                EasyCAD
              </h1>
              <span className="px-2 py-0.5 bg-secondary border border-border text-foreground rounded-full text-[10px] font-mono font-medium">
                UI TEMPLATE
              </span>
              <span className="px-2 py-0.5 bg-blue-600 text-white rounded-full text-[10px] font-mono font-bold shadow-xs">
                v1.0.0
              </span>
            </div>
            <p className="text-[11px] text-muted-foreground">
              Plantilla de Interfaz Profesional para Aplicaciones CAD / 3D
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          {/* Botón de Configuración */}
          <button
            onClick={() => setSettingsOpen(true)}
            className="p-2 bg-card hover:bg-secondary border border-border rounded-xl text-muted-foreground hover:text-foreground transition-all shadow-xs cursor-pointer active:scale-95"
            title="Configuración"
          >
            <SettingsIcon className="w-4 h-4" />
          </button>

          {/* Botón Pantalla Completa */}
          <button
            onClick={toggleFullscreen}
            className="p-2 bg-card hover:bg-secondary border border-border rounded-xl text-muted-foreground hover:text-foreground transition-all shadow-xs cursor-pointer active:scale-95"
            title={isFullscreen ? 'Salir de Pantalla Completa' : 'Pantalla Completa'}
          >
            {isFullscreen ? (
              <Minimize2 className="w-4 h-4" />
            ) : (
              <Maximize2 className="w-4 h-4" />
            )}
          </button>
        </div>
      </header>

      {/* Contenido Principal */}
      <div className="flex-1 flex flex-col space-y-8 max-w-7xl w-full mx-auto pb-12">
        {/* SECCIÓN 1: Mis Proyectos */}
        <section className="bg-card border border-border rounded-2xl p-6 shadow-xs">
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center space-x-2.5">
              <FolderKanban className="w-5 h-5 text-foreground" />
              <h2 className="text-base font-bold text-foreground">
                Mis Proyectos Recientes
              </h2>
              <span className="px-2 py-0.5 bg-secondary text-muted-foreground rounded-md text-xs font-mono font-medium">
                {projects.length}
              </span>
            </div>

            <button
              onClick={handleCreateNew}
              className="text-xs text-foreground hover:underline flex items-center space-x-1 font-semibold cursor-pointer"
            >
              <span>Crear nuevo</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {/* Tarjeta rápida para crear proyecto */}
            <div
              onClick={handleCreateNew}
              className="border-2 border-dashed border-border hover:border-foreground/50 rounded-2xl p-6 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-secondary/40 transition-all group min-h-[220px]"
            >
              <div className="w-12 h-12 rounded-2xl bg-secondary text-foreground group-hover:scale-105 flex items-center justify-center transition-transform mb-3 shadow-xs">
                <Plus className="w-6 h-6" />
              </div>
              <h3 className="text-sm font-bold text-foreground">
                Nuevo Modelo en Blanco
              </h3>
              <p className="text-xs text-muted-foreground mt-1 max-w-[180px]">
                Inicia un diseño 3D con espacio de trabajo vacío y rejilla milimétrica.
              </p>
            </div>

            {/* Tarjetas de Proyectos Guardados */}
            {projects.map((proj) => (
              <ProjectCard
                key={proj.id}
                project={proj}
                onOpen={handleOpenProject}
                onDelete={deleteProject}
              />
            ))}
          </div>
        </section>

        {/* SECCIÓN 2: Librería de Componentes */}
        <section className="bg-card border border-border rounded-2xl p-6 shadow-xs">
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center space-x-2.5">
              <Boxes className="w-5 h-5 text-foreground" />
              <h2 className="text-base font-bold text-foreground">
                Catálogo de Piezas & Plantillas
              </h2>
              <span className="px-2 py-0.5 bg-secondary text-muted-foreground rounded-md text-xs font-mono font-medium">
                {INITIAL_LIBRARY_ITEMS.length} piezas
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {INITIAL_LIBRARY_ITEMS.map((comp) => (
              <div
                key={comp.id}
                className="p-4 rounded-xl border border-border bg-secondary/30 hover:bg-secondary/70 transition-all flex flex-col justify-between space-y-3"
              >
                <div className="flex items-start space-x-3">
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center text-white shrink-0 shadow-xs"
                    style={{ backgroundColor: comp.defaultColor }}
                  >
                    <Box className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-foreground">{comp.name}</h4>
                    <span className="text-[10px] text-muted-foreground">{comp.category}</span>
                    <p className="text-[11px] text-muted-foreground mt-1 line-clamp-2">
                      {comp.description}
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => {
                    handleCreateNew();
                    insertFromLibrary(comp);
                  }}
                  className="w-full py-1.5 px-3 rounded-lg bg-secondary hover:bg-foreground hover:text-background text-foreground text-xs font-semibold border border-border transition-all cursor-pointer"
                >
                  Abrir en Estudio
                </button>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};
