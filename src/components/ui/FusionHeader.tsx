import React, { useState, useEffect, useRef } from 'react';
import {
  Box,
  Home,
  Save,
  Undo2,
  Redo2,
  ChevronDown,
  Settings as SettingsIcon,
  Maximize2,
  Minimize2,
  CheckCircle2,
  PanelRightClose,
  PanelRightOpen,
  Sparkles,
  Layers,
  FileCode,
  PenTool,
  Camera,
  Ruler,
} from 'lucide-react';
import { useUiStore } from '../../store/useUiStore';
import { useProjectStore } from '../../store/useProjectStore';
import { RibbonBar } from './RibbonBar';
import type { WorkspaceId } from '../../types/ui';

export const FusionHeader: React.FC = () => {
  const {
    setView,
    activeWorkspace,
    setActiveWorkspace,
    isSidebarOpen,
    toggleSidebar,
    setSettingsOpen,
    showNotice,
  } = useUiStore();

  const {
    projectName,
    setProjectName,
    isSaved,
    saveProject,
    canUndo,
    canRedo,
    undo,
    redo,
  } = useProjectStore();

  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isWorkspaceMenuOpen, setIsWorkspaceMenuOpen] = useState(false);
  const [isAppMenuOpen, setIsAppMenuOpen] = useState(false);

  const workspaces: { id: WorkspaceId; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
    { id: 'model-3d', label: 'Modelado 3D', icon: Box },
    { id: 'sketch-2d', label: 'Boceto 2D', icon: PenTool },
    { id: 'render', label: 'Render Estudio', icon: Camera },
    { id: 'drafting', label: 'Planos Técnicos', icon: Ruler },
  ];

  const currentWorkspaceInfo = workspaces.find((w) => w.id === activeWorkspace) || workspaces[0];
  const CurrentIcon = currentWorkspaceInfo.icon;

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

  const handleSave = () => {
    saveProject();
    showNotice('save', 'Guardado con éxito', `Proyecto "${projectName}" sincronizado.`);
  };

  return (
    <header className="flex flex-col w-full bg-card border-b border-border z-30 select-none transition-colors duration-200 shadow-xs">
      {/* ========================================================================= */}
      {/* NIVEL 1: BARRA DE APLICACIÓN SUPERIOR (Top Application Bar)               */}
      {/* ========================================================================= */}
      <div className="h-10 px-3 flex items-center justify-between border-b border-border bg-card text-xs relative select-none">
        {/* Izquierda: Logotipo, Home, Guardar, Deshacer/Rehacer */}
        <div className="flex items-center space-x-1.5 shrink-0">
          {/* Logo / Nombre de la Aplicación */}
          <div className="flex items-center space-x-1.5 px-2.5 py-1 bg-foreground text-background rounded-xl font-bold tracking-tight text-[11px] shadow-xs">
            <Box className="w-3.5 h-3.5" />
            <span>EasyCAD</span>
          </div>

          <span className="hidden sm:inline-flex items-center px-1.5 py-0.5 bg-secondary border border-border text-foreground font-mono text-[10px] font-bold rounded-md">
            TEMPLATE
          </span>

          {/* Botón Home / Ir al Dashboard */}
          <button
            onClick={() => setView('dashboard')}
            className="p-1.5 hover:bg-secondary text-muted-foreground hover:text-foreground rounded-lg transition-colors cursor-pointer"
            title="Ir a Inicio / Dashboard de Proyectos"
          >
            <Home className="w-4 h-4" />
          </button>

          {/* Botón Guardar */}
          <button
            onClick={handleSave}
            className="p-1.5 hover:bg-secondary text-muted-foreground hover:text-foreground rounded-lg transition-colors cursor-pointer"
            title="Guardar Proyecto (Ctrl+S)"
          >
            <Save className="w-4 h-4" />
          </button>

          {/* Deshacer / Rehacer */}
          <div className="flex items-center space-x-0.5 pl-1 border-l border-border">
            <button
              onClick={undo}
              disabled={!canUndo}
              className={`p-1.5 rounded-lg transition-colors ${
                canUndo
                  ? 'text-muted-foreground hover:text-foreground hover:bg-secondary cursor-pointer'
                  : 'text-muted-foreground/30 cursor-not-allowed'
              }`}
              title="Deshacer (Ctrl+Z)"
            >
              <Undo2 className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={redo}
              disabled={!canRedo}
              className={`p-1.5 rounded-lg transition-colors ${
                canRedo
                  ? 'text-muted-foreground hover:text-foreground hover:bg-secondary cursor-pointer'
                  : 'text-muted-foreground/30 cursor-not-allowed'
              }`}
              title="Rehacer (Ctrl+Y)"
            >
              <Redo2 className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Menú de Espacios de Trabajo (Workspace Switcher Dropdown) */}
          <div className="relative ml-2">
            <button
              onClick={() => setIsWorkspaceMenuOpen(!isWorkspaceMenuOpen)}
              className="flex items-center space-x-1.5 px-2.5 py-1 bg-secondary hover:bg-secondary/80 border border-border rounded-lg text-foreground font-semibold transition-colors cursor-pointer"
            >
              <CurrentIcon className="w-3.5 h-3.5 text-blue-500" />
              <span>{currentWorkspaceInfo.label}</span>
              <ChevronDown className="w-3 h-3 text-muted-foreground" />
            </button>

            {isWorkspaceMenuOpen && (
              <div className="absolute top-9 left-0 w-48 bg-card border border-border rounded-xl shadow-2xl p-1.5 z-50 animate-in fade-in zoom-in-95">
                <span className="text-[10px] text-muted-foreground px-2 py-1 font-semibold block uppercase">
                  Espacios de Trabajo
                </span>
                {workspaces.map((ws) => {
                  const Icon = ws.icon;
                  return (
                    <button
                      key={ws.id}
                      onClick={() => {
                        setActiveWorkspace(ws.id);
                        setIsWorkspaceMenuOpen(false);
                        showNotice('general', ws.label, `Cambiado al espacio de ${ws.label}.`);
                      }}
                      className={`w-full flex items-center space-x-2 px-2.5 py-1.5 rounded-lg text-left transition-colors cursor-pointer ${
                        activeWorkspace === ws.id
                          ? 'bg-secondary text-foreground font-bold'
                          : 'hover:bg-secondary/60 text-muted-foreground hover:text-foreground'
                      }`}
                    >
                      <Icon className="w-3.5 h-3.5 text-blue-500" />
                      <span>{ws.label}</span>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Centro: Nombre del Documento Activo */}
        <div className="hidden md:flex items-center justify-center flex-1 min-w-0 mx-4">
          <input
            type="text"
            value={projectName}
            onChange={(e) => setProjectName(e.target.value)}
            className="text-xs font-bold bg-transparent hover:bg-secondary/60 border border-transparent hover:border-border focus:border-blue-500 focus:bg-card px-3 py-1 rounded-lg text-foreground outline-none max-w-[280px] w-full text-center truncate transition-colors cursor-text"
            title="Haz clic para renombrar el archivo"
          />
          {!isSaved && (
            <span className="w-2 h-2 rounded-full bg-amber-500 ml-1.5 shrink-0" title="Cambios sin guardar" />
          )}
        </div>

        {/* Derecha: Pantalla Completa, Configuración, Toggle Panel Lateral */}
        <div className="flex items-center space-x-1.5 shrink-0">
          {/* Botón Pantalla Completa */}
          <button
            onClick={toggleFullscreen}
            className="p-1.5 hover:bg-secondary text-muted-foreground hover:text-foreground rounded-lg transition-colors cursor-pointer"
            title={isFullscreen ? 'Salir de pantalla completa' : 'Pantalla completa'}
          >
            {isFullscreen ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
          </button>

          {/* Botón Configuración */}
          <button
            onClick={() => setSettingsOpen(true)}
            className="p-1.5 hover:bg-secondary text-muted-foreground hover:text-foreground rounded-lg transition-colors cursor-pointer"
            title="Configuración de la aplicación"
          >
            <SettingsIcon className="w-3.5 h-3.5" />
          </button>

          <div className="h-4 w-px bg-border mx-1" />

          {/* Botón para Mostrar / Ocultar Outliner y Librería */}
          <button
            onClick={toggleSidebar}
            className={`flex items-center space-x-1.5 px-2.5 py-1 rounded-lg border transition-colors cursor-pointer ${
              isSidebarOpen
                ? 'bg-secondary border-border text-foreground font-semibold'
                : 'hover:bg-secondary text-muted-foreground border-transparent'
            }`}
            title={isSidebarOpen ? 'Plegar panel lateral' : 'Desplegar panel lateral'}
          >
            {isSidebarOpen ? (
              <PanelRightClose className="w-3.5 h-3.5" />
            ) : (
              <PanelRightOpen className="w-3.5 h-3.5" />
            )}
            <span className="hidden sm:inline text-[11px]">Panel</span>
          </button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* NIVEL 2: CINTA DE HERRAMIENTAS MODULAR (Ribbon Tool Bar)                  */}
      {/* ========================================================================= */}
      <RibbonBar />
    </header>
  );
};
