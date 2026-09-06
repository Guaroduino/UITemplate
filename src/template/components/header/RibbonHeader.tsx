import React, { useState, useRef } from 'react';
import {
  Box,
  Save,
  Undo2,
  Redo2,
  Home,
  Sun,
  Moon,
  Maximize2,
  Minimize2,
  PanelRightClose,
  PanelRightOpen,
  Settings,
  Layers,
  ChevronDown,
  BoxSelect,
  Circle,
  Cylinder,
  Disc,
  Combine,
  Scissors,
  Move,
  Ruler,
  Eye,
  Camera,
  Download,
  FolderOpen,
  Sliders,
} from 'lucide-react';
import { useUIStore } from '../../useUIStore';
import type { RibbonTab, RibbonGroup, RibbonTool } from '../../types';

interface RibbonHeaderProps {
  appTitle?: string;
  appBadge?: string;
  workspaces?: { id: string; name: string }[];
  tabs?: RibbonTab[];
}

export const RibbonHeader: React.FC<RibbonHeaderProps> = ({
  appTitle = 'LOGO / MARCA (CABECERA SUPERIOR)',
  appBadge = 'BADGE SUPERIOR',
  workspaces = [
    { id: 'ws_1', name: 'Espacio de Trabajo 1 (Viewport)' },
    { id: 'ws_2', name: 'Espacio de Trabajo 2' },
    { id: 'ws_3', name: 'Espacio de Trabajo 3' },
  ],
  tabs,
}) => {
  const store = useUIStore();
  const [activeDropdownId, setActiveDropdownId] = useState<string | null>(null);
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [titleInput, setTitleInput] = useState(store.documentName);
  const ribbonRef = useRef<HTMLDivElement>(null);

  // Default ribbon tabs if none provided
  const defaultTabs: RibbonTab[] = [
    {
      id: 'tab_ribbon_1',
      label: 'Pestaña Ribbon 1',
      groups: [
        {
          id: 'grp_1',
          title: 'Grupo 1 de Pestaña 1',
          tools: [
            {
              id: 'tool_1_1',
              label: 'Herramienta 1.1',
              icon: 'Box',
              shortcut: 'C',
              tooltip: 'Herramienta 1 de Grupo 1 (Cubo)',
              onClick: () => {
                store.setActiveTool('tool_1_1', {
                  title: 'Título de Barra Contextual Superior (Herramienta 1.1)',
                  stepText: 'Paso activo / Contenido de Barra Contextual Superior',
                });
                store.setToolParams({ shape: 'cube' });
              },
            },
            {
              id: 'tool_1_2',
              label: 'Herramienta 1.2',
              icon: 'Circle',
              shortcut: 'S',
              tooltip: 'Herramienta 2 de Grupo 1 (Esfera)',
              onClick: () => {
                store.setActiveTool('tool_1_2', {
                  title: 'Título de Barra Contextual Superior (Herramienta 1.2)',
                  stepText: 'Ajusta las propiedades en el Inspector de Propiedades',
                });
                store.setToolParams({ shape: 'sphere' });
              },
            },
            {
              id: 'tool_1_3',
              label: 'Herramienta 1.3',
              icon: 'Cylinder',
              shortcut: 'Y',
              tooltip: 'Herramienta 3 de Grupo 1 (Cilindro)',
              onClick: () => {
                store.setActiveTool('tool_1_3', {
                  title: 'Título de Barra Contextual Superior (Herramienta 1.3)',
                  stepText: 'Configura valores en el panel lateral derecho',
                });
                store.setToolParams({ shape: 'cylinder' });
              },
            },
            {
              id: 'tool_1_4',
              label: 'Herramienta 1.4',
              icon: 'Disc',
              shortcut: 'T',
              tooltip: 'Herramienta 4 de Grupo 1 (Toroide)',
              onClick: () => {
                store.setActiveTool('tool_1_4', {
                  title: 'Título de Barra Contextual Superior (Herramienta 1.4)',
                  stepText: 'Valores editables en Inspector de Propiedades',
                });
                store.setToolParams({ shape: 'torus' });
              },
            },
          ],
        },
        {
          id: 'grp_2',
          title: 'Grupo 2 de Pestaña 1',
          tools: [
            {
              id: 'tool_2_1',
              label: 'Herramienta 2.1',
              icon: 'Layers',
              shortcut: 'E',
              tooltip: 'Herramienta 1 de Grupo 2',
              onClick: () => {
                store.setActiveTool('tool_2_1', {
                  title: 'Título de Barra Contextual Superior (Herramienta 2.1)',
                  stepText: 'Paso 1/2 en Barra Contextual: Selecciona elemento en Viewport Central',
                });
              },
            },
            {
              id: 'tool_2_2',
              label: 'Herramienta 2.2',
              icon: 'Combine',
              shortcut: 'B',
              tooltip: 'Herramienta 2 de Grupo 2',
              onClick: () => {
                store.setActiveTool('tool_2_2', {
                  title: 'Título de Barra Contextual Superior (Herramienta 2.2)',
                  stepText: 'Paso 2/2 en Barra Contextual: Confirma con Aceptar o Cancelar',
                });
              },
            },
            {
              id: 'tool_2_3',
              label: 'Herramienta 2.3',
              icon: 'Scissors',
              tooltip: 'Herramienta 3 de Grupo 2',
              onClick: () => {
                store.setActiveTool('tool_2_3', {
                  title: 'Título de Barra Contextual Superior (Herramienta 2.3)',
                  stepText: 'Paso activo de corte en Barra Contextual Superior',
                });
              },
            },
          ],
        },
        {
          id: 'grp_3',
          title: 'Grupo 3 de Pestaña 1',
          tools: [
            {
              id: 'tool_3_1',
              label: 'Herramienta 3.1',
              icon: 'Move',
              shortcut: 'M',
              tooltip: 'Herramienta 1 de Grupo 3 (Mover)',
              onClick: () => {
                store.setActiveTool('tool_3_1', {
                  title: 'Título de Barra Contextual Superior (Herramienta 3.1)',
                  stepText: 'Desplaza el elemento o ingresa valores en Inspector',
                });
              },
            },
            {
              id: 'tool_3_2',
              label: 'Herramienta 3.2',
              icon: 'BoxSelect',
              shortcut: 'Q',
              tooltip: 'Herramienta 2 de Grupo 3 (Seleccionar)',
              onClick: () => {
                store.setActiveTool('tool_3_2');
                store.closeContextualBar();
              },
            },
          ],
        },
      ],
    },
    {
      id: 'tab_ribbon_2',
      label: 'Pestaña Ribbon 2',
      groups: [
        {
          id: 'grp_p2_1',
          title: 'Grupo 1 de Pestaña 2',
          tools: [
            {
              id: 'tool_p2_1',
              label: 'Herramienta 1',
              icon: 'Ruler',
              shortcut: 'I',
              tooltip: 'Herramienta 1 de Pestaña 2 (Medir)',
              onClick: () => {
                store.setActiveTool('tool_p2_1', {
                  title: 'Título de Barra Contextual Superior (Herramienta 1 de Pestaña 2)',
                  stepText: 'Haz clic en el Viewport Central para registrar datos',
                });
              },
            },
          ],
        },
      ],
    },
    {
      id: 'tab_ribbon_3',
      label: 'Pestaña Ribbon 3',
      groups: [
        {
          id: 'grp_p3_1',
          title: 'Grupo 1 de Pestaña 3',
          tools: [
            {
              id: 'tool_p3_1',
              label: 'Herramienta 1',
              icon: 'FolderOpen',
              tooltip: 'Herramienta 1 de Pestaña 3 (Importar)',
              onClick: () => store.showNotification('Acción de Herramienta 1 de Pestaña 3', 'info'),
            },
            {
              id: 'tool_p3_2',
              label: 'Herramienta 2',
              icon: 'Download',
              tooltip: 'Herramienta 2 de Pestaña 3 (Exportar)',
              onClick: () => store.showNotification('Acción de Herramienta 2 de Pestaña 3', 'success'),
            },
            {
              id: 'tool_p3_3',
              label: 'Herramienta 3',
              icon: 'Camera',
              tooltip: 'Herramienta 3 de Pestaña 3 (Captura)',
              onClick: () => store.showNotification('Acción de Herramienta 3 de Pestaña 3', 'info'),
            },
          ],
        },
      ],
    },
  ];

  const currentTabs = tabs || defaultTabs;
  const currentTabObj = currentTabs.find((t) => t.id === store.activeRibbonTab) || currentTabs[0];

  const renderToolIcon = (iconName: string) => {
    switch (iconName) {
      case 'Box':
        return <Box className="w-5 h-5" />;
      case 'Circle':
        return <Circle className="w-5 h-5" />;
      case 'Cylinder':
        return <Cylinder className="w-5 h-5" />;
      case 'Disc':
        return <Disc className="w-5 h-5" />;
      case 'Layers':
        return <Layers className="w-5 h-5" />;
      case 'Combine':
        return <Combine className="w-5 h-5" />;
      case 'Scissors':
        return <Scissors className="w-5 h-5" />;
      case 'Move':
        return <Move className="w-5 h-5" />;
      case 'BoxSelect':
        return <BoxSelect className="w-5 h-5" />;
      case 'Ruler':
        return <Ruler className="w-5 h-5" />;
      case 'FolderOpen':
        return <FolderOpen className="w-5 h-5" />;
      case 'Download':
        return <Download className="w-5 h-5" />;
      case 'Camera':
        return <Camera className="w-5 h-5" />;
      default:
        return <Box className="w-5 h-5" />;
    }
  };

  return (
    <header className="flex flex-col w-full border-b border-border bg-card select-none z-30 shrink-0">
      {/* ========================================================================= */}
      {/* NIVEL 1: BARRA SUPERIOR (Marca, Título, Atajos, Workspaces, Toggle Tema)   */}
      {/* ========================================================================= */}
      <div className="h-10 px-3 flex items-center justify-between border-b border-border/80 bg-card text-foreground">
        {/* LADO IZQUIERDO: Logo, Badge, Acciones Rápidas */}
        <div className="flex items-center space-x-1.5">
          {/* Logo / Badge */}
          <div className="flex items-center space-x-1.5 px-2 py-0.5 mr-1 bg-foreground text-background rounded-md font-bold tracking-tight text-[11px] shadow-xs">
            <Box className="w-3.5 h-3.5" />
            <span>{appTitle}</span>
          </div>

          <span className="inline-flex items-center px-2 py-0.5 bg-amber-500 text-slate-950 font-black text-[10px] tracking-wider rounded-md mr-1 select-none shadow-xs">
            {appBadge}
          </span>

          {/* Botón Home */}
          <button
            onClick={() => store.showNotification('Acción: Botón Inicio (Cabecera Superior)', 'info')}
            className="p-1.5 hover:bg-secondary text-muted-foreground hover:text-foreground rounded-lg transition-colors cursor-pointer"
            title="Botón Inicio (Cabecera Superior)"
          >
            <Home className="w-3.5 h-3.5" />
          </button>

          {/* Botón Guardar */}
          <button
            onClick={() => store.showNotification('Acción: Botón Guardar (Cabecera Superior)', 'success')}
            className="p-1.5 hover:bg-secondary text-muted-foreground hover:text-foreground rounded-lg transition-colors cursor-pointer"
            title="Botón Guardar (Cabecera Superior)"
          >
            <Save className="w-3.5 h-3.5" />
          </button>

          {/* Deshacer / Rehacer */}
          <div className="flex items-center space-x-0.5 pl-1 border-l border-border">
            <button
              onClick={() => store.showNotification('Acción: Botón Deshacer (Cabecera Superior)', 'info')}
              className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary cursor-pointer"
              title="Botón Deshacer (Cabecera Superior)"
            >
              <Undo2 className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => store.showNotification('Acción: Botón Rehacer (Cabecera Superior)', 'info')}
              className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary cursor-pointer"
              title="Botón Rehacer (Cabecera Superior)"
            >
              <Redo2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* CENTRO: Nombre del Documento Editable */}
        <div className="hidden md:flex items-center justify-center flex-1 min-w-0 mx-4">
          {isEditingTitle ? (
            <input
              type="text"
              autoFocus
              value={titleInput}
              onChange={(e) => setTitleInput(e.target.value)}
              onBlur={() => {
                store.setDocumentName(titleInput || 'Sin Título');
                setIsEditingTitle(false);
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  store.setDocumentName(titleInput || 'Sin Título');
                  setIsEditingTitle(false);
                } else if (e.key === 'Escape') {
                  setTitleInput(store.documentName);
                  setIsEditingTitle(false);
                }
              }}
              className="text-xs font-bold bg-secondary border border-border px-2.5 py-0.5 rounded text-foreground outline-none text-center max-w-[280px]"
            />
          ) : (
            <button
              onClick={() => {
                setTitleInput(store.documentName);
                setIsEditingTitle(true);
              }}
              className="text-xs font-semibold text-foreground/90 hover:text-foreground px-2 py-0.5 rounded hover:bg-secondary transition-colors truncate max-w-[280px] cursor-text"
              title="Título Editable de Documento (Cabecera Superior)"
            >
              {store.documentName}
            </button>
          )}
        </div>

        {/* LADO DERECHO: Selector de Espacios, Tema, Inspector y Paneles */}
        <div className="flex items-center space-x-1.5">
          {/* Workspaces Pills */}
          <div className="hidden lg:flex items-center bg-secondary/80 p-0.5 rounded-lg border border-border/60">
            {workspaces.map((ws) => (
              <button
                key={ws.id}
                onClick={() => {
                  store.setActiveWorkspace(ws.id);
                  store.showNotification(`Espacio cambiado a: ${ws.name}`, 'info');
                }}
                className={`px-2.5 py-0.5 text-[11px] font-medium rounded-md transition-all cursor-pointer ${
                  store.activeWorkspace === ws.id
                    ? 'bg-card text-foreground font-bold shadow-xs'
                    : 'text-muted-foreground hover:text-foreground hover:bg-card/50'
                }`}
              >
                {ws.name}
              </button>
            ))}
          </div>

          {/* Toggle Inspector de Propiedades */}
          <button
            onClick={store.toggleInspector}
            className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
              store.isInspectorOpen
                ? 'bg-foreground text-background font-bold shadow-xs'
                : 'hover:bg-secondary text-muted-foreground hover:text-foreground'
            }`}
            title="Botón Toggle Inspector de Propiedades (Cabecera Superior)"
          >
            <Sliders className="w-3.5 h-3.5" />
          </button>

          {/* Toggle Modo Oscuro / Claro */}
          <button
            onClick={store.toggleTheme}
            className="p-1.5 hover:bg-secondary text-muted-foreground hover:text-foreground rounded-lg transition-colors cursor-pointer"
            title="Botón Toggle Tema Claro/Oscuro (Cabecera Superior)"
          >
            {store.theme === 'dark' ? <Sun className="w-3.5 h-3.5" /> : <Moon className="w-3.5 h-3.5" />}
          </button>

          {/* Configuración */}
          <button
            onClick={() => store.setSettingsOpen(true)}
            className="p-1.5 hover:bg-secondary text-muted-foreground hover:text-foreground rounded-lg transition-colors cursor-pointer"
            title="Botón Configuración / Ajustes (Cabecera Superior)"
          >
            <Settings className="w-3.5 h-3.5" />
          </button>

          {/* Pantalla Completa */}
          <button
            onClick={store.toggleFullscreen}
            className="p-1.5 hover:bg-secondary text-muted-foreground hover:text-foreground rounded-lg transition-colors cursor-pointer"
            title="Botón Pantalla Completa (Cabecera Superior)"
          >
            {store.isFullscreen ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
          </button>

          {/* Toggle Sidebar Derecho */}
          <button
            onClick={store.toggleSidebar}
            className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
              store.isSidebarOpen
                ? 'bg-foreground text-background font-bold shadow-xs'
                : 'hover:bg-secondary text-muted-foreground hover:text-foreground'
            }`}
            title="Botón Toggle Sidebar Derecho (Cabecera Superior)"
          >
            {store.isSidebarOpen ? <PanelRightClose className="w-3.5 h-3.5" /> : <PanelRightOpen className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* NIVEL 2: PESTAÑAS DEL RIBBON (Crear, Modificar, Ensamblar, etc.)           */}
      {/* ========================================================================= */}
      <div className="h-8 px-3 flex items-end space-x-1.5 bg-secondary/30 border-b border-border/80 text-xs">
        {currentTabs.map((tab) => {
          const isActive = store.activeRibbonTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => store.setActiveRibbonTab(tab.id)}
              className={`relative px-3.5 h-[30px] flex items-center justify-center font-bold text-[11px] uppercase tracking-wider transition-all select-none cursor-pointer ${
                isActive
                  ? 'z-10 translate-y-[1px] bg-card text-foreground border-t-2 border-l border-r border-t-foreground border-l-border border-r-border rounded-t-md shadow-[0_-1px_2px_rgba(0,0,0,0.02)]'
                  : 'mb-[1px] text-muted-foreground hover:text-foreground hover:bg-secondary/60 rounded-t-md'
              }`}
            >
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* ========================================================================= */}
      {/* NIVEL 3: CINTA DE HERRAMIENTAS AGRUPADAS (H-[68px])                        */}
      {/* ========================================================================= */}
      <div
        ref={ribbonRef}
        className="h-[68px] px-4 bg-card flex items-center space-x-4 overflow-x-auto no-scrollbar relative w-full select-none"
      >
        {currentTabObj.groups.map((group, groupIdx) => (
          <React.Fragment key={group.id}>
            {groupIdx > 0 && <div className="h-9 w-[1px] bg-border shrink-0 my-auto" />}

            <div className="flex flex-col items-center justify-between h-full pt-1 pb-1 shrink-0">
              {/* FILA DE BOTONES DE HERRAMIENTAS */}
              <div className="flex items-center space-x-1 min-h-[38px]">
                {group.tools.map((tool) => {
                  const isToolActive = store.activeTool === tool.id;

                  return (
                    <button
                      key={tool.id}
                      onClick={() => tool.onClick?.()}
                      className={`flex flex-col items-center justify-center p-1.5 rounded-lg transition-all group shrink-0 cursor-pointer min-w-[46px] ${
                        isToolActive
                          ? 'bg-foreground text-background font-bold shadow-xs'
                          : 'hover:bg-secondary text-muted-foreground hover:text-foreground'
                      }`}
                      title={tool.tooltip || tool.label}
                    >
                      <div className="group-hover:scale-110 transition-transform">
                        {renderToolIcon(tool.icon)}
                      </div>
                      <span className="text-[10px] font-medium mt-0.5 whitespace-nowrap">
                        {tool.label}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* TÍTULO INFERIOR DEL GRUPO */}
              <span className="text-[9.5px] font-bold uppercase tracking-wider text-muted-foreground/70">
                {group.title}
              </span>
            </div>
          </React.Fragment>
        ))}
      </div>
    </header>
  );
};
