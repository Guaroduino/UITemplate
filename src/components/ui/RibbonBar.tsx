import React, { useState } from 'react';
import {
  Box,
  Cylinder,
  CircleDot,
  PenTool,
  ArrowUpFromLine,
  RotateCw,
  Scissors,
  Layers,
  Compass,
  Download,
  Upload,
  Sparkles,
  ChevronDown,
  Pin,
  PinOff,
  Move,
  MousePointer,
  Scale,
  Camera,
  Boxes,
  Maximize2,
} from 'lucide-react';
import { useUiStore } from '../../store/useUiStore';
import { useProjectStore } from '../../store/useProjectStore';

export const RibbonBar: React.FC = () => {
  const {
    activeRibbonTab,
    setActiveRibbonTab,
    activeTool,
    setActiveTool,
    activeWorkspace,
    setActiveWorkspace,
    showNotice,
  } = useUiStore();

  const { addObject } = useProjectStore();
  const [isRibbonCollapsed, setIsRibbonCollapsed] = useState(false);

  // Pestañas temáticas según el espacio de trabajo activo
  const tabs =
    activeWorkspace === 'render'
      ? [
          { id: 'studio', label: 'Estudio & Luces' },
          { id: 'materials', label: 'Materiales & PBR' },
          { id: 'capture', label: 'Captura & Render' },
        ]
      : activeWorkspace === 'sketch-2d'
      ? [
          { id: 'draw', label: 'Dibujo 2D' },
          { id: 'constraints', label: 'Restricciones' },
          { id: 'finish_sketch', label: 'Finalizar Boceto' },
        ]
      : activeWorkspace === 'drafting'
      ? [
          { id: 'views', label: 'Vistas Ortogonales' },
          { id: 'dimensions', label: 'Cotas & Anotaciones' },
          { id: 'export_sheet', label: 'Plano & Exportar' },
        ]
      : [
          { id: 'create', label: 'Sólido' },
          { id: 'modify', label: 'Modificar' },
          { id: 'assemble', label: 'Ensamblar' },
          { id: 'construct', label: 'Construir' },
          { id: 'inspect', label: 'Inspeccionar' },
        ];

  const handleToolClick = (toolId: string, label: string) => {
    setActiveTool(toolId);

    // Acciones de creación rápida
    if (toolId === 'create_box') {
      addObject({
        name: 'Caja Nueva',
        type: 'box',
        visible: true,
        locked: false,
        color: '#007acc',
        position: [0, 0.5, 0],
        rotation: [0, 0, 0],
        scale: [1.5, 1, 1],
      });
      showNotice('build', 'Caja Creada', 'Primitiva 3D añadida a la escena.');
    } else if (toolId === 'create_cylinder') {
      addObject({
        name: 'Cilindro Nuevo',
        type: 'cylinder',
        visible: true,
        locked: false,
        color: '#38bdf8',
        position: [0, 1, 0],
        rotation: [0, 0, 0],
        scale: [0.8, 1.2, 0.8],
      });
      showNotice('build', 'Cilindro Creado', 'Primitiva 3D añadida a la escena.');
    } else if (toolId === 'create_sphere') {
      addObject({
        name: 'Esfera Nueva',
        type: 'sphere',
        visible: true,
        locked: false,
        color: '#a855f7',
        position: [0, 0.7, 0],
        rotation: [0, 0, 0],
        scale: [0.7, 0.7, 0.7],
      });
      showNotice('build', 'Esfera Creada', 'Primitiva 3D añadida a la escena.');
    } else if (toolId === 'sketch_mode') {
      setActiveWorkspace('sketch-2d');
      showNotice('general', 'Modo Boceto 2D', 'Plano de trabajo activo.');
    } else {
      showNotice('general', label, `Herramienta "${label}" seleccionada.`);
    }
  };

  return (
    <nav className="flex flex-col w-full bg-card border-b border-border select-none z-20 transition-colors">
      {/* Pestañas de Secciones */}
      <div className="flex items-center justify-between px-3 pt-1 border-b border-border/60 bg-secondary/20">
        <div className="flex items-center space-x-1 overflow-x-auto no-scrollbar">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveRibbonTab(tab.id)}
              className={`px-3 py-1.5 rounded-t-lg text-xs font-semibold uppercase tracking-wider transition-colors cursor-pointer border-b-2 ${
                activeRibbonTab === tab.id
                  ? 'border-blue-500 text-foreground bg-card'
                  : 'border-transparent text-muted-foreground hover:text-foreground hover:bg-card/50'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Botón Plegar / Desplegar Cinta */}
        <button
          onClick={() => setIsRibbonCollapsed(!isRibbonCollapsed)}
          className="p-1 text-muted-foreground hover:text-foreground hover:bg-secondary rounded transition-colors cursor-pointer"
          title={isRibbonCollapsed ? 'Expandir cinta de herramientas' : 'Plegar cinta de herramientas'}
        >
          <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${isRibbonCollapsed ? '-rotate-90' : ''}`} />
        </button>
      </div>

      {/* Contenido de Herramientas de la Cinta */}
      {!isRibbonCollapsed && (
        <div className="flex items-center space-x-2 px-3 py-2 overflow-x-auto custom-scrollbar bg-card">
          {/* Grupo 1: Selección y Navegación */}
          <div className="flex items-center space-x-1 pr-2 border-r border-border shrink-0">
            <button
              onClick={() => handleToolClick('select', 'Selección')}
              className={`flex flex-col items-center justify-center w-12 h-14 rounded-xl transition-all cursor-pointer ${
                activeTool === 'select'
                  ? 'bg-blue-500/10 text-blue-500 border border-blue-500/40 font-bold'
                  : 'hover:bg-secondary text-muted-foreground hover:text-foreground'
              }`}
              title="Puntero de selección"
            >
              <MousePointer className="w-4 h-4 mb-1" />
              <span className="text-[10px] leading-tight">Elegir</span>
            </button>

            <button
              onClick={() => handleToolClick('sketch_mode', 'Crear Boceto 2D')}
              className={`flex flex-col items-center justify-center w-14 h-14 rounded-xl transition-all cursor-pointer ${
                activeWorkspace === 'sketch-2d'
                  ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/40 font-bold'
                  : 'hover:bg-secondary text-muted-foreground hover:text-foreground'
              }`}
              title="Crear boceto en un plano 2D"
            >
              <PenTool className="w-4 h-4 mb-1 text-emerald-500" />
              <span className="text-[10px] leading-tight">Boceto</span>
            </button>
          </div>

          {/* Grupo 2: Primitivas Sólidas */}
          <div className="flex items-center space-x-1 pr-2 border-r border-border shrink-0">
            <button
              onClick={() => handleToolClick('create_box', 'Caja Sólida')}
              className="flex flex-col items-center justify-center w-12 h-14 rounded-xl hover:bg-secondary text-muted-foreground hover:text-foreground transition-all cursor-pointer group"
              title="Crear un cubo o paralelepípedo paramétrico"
            >
              <Box className="w-4 h-4 mb-1 text-blue-500 group-hover:scale-110 transition-transform" />
              <span className="text-[10px] leading-tight">Caja</span>
            </button>

            <button
              onClick={() => handleToolClick('create_cylinder', 'Cilindro')}
              className="flex flex-col items-center justify-center w-12 h-14 rounded-xl hover:bg-secondary text-muted-foreground hover:text-foreground transition-all cursor-pointer group"
              title="Crear cilindro"
            >
              <Cylinder className="w-4 h-4 mb-1 text-sky-500 group-hover:scale-110 transition-transform" />
              <span className="text-[10px] leading-tight">Cilindro</span>
            </button>

            <button
              onClick={() => handleToolClick('create_sphere', 'Esfera')}
              className="flex flex-col items-center justify-center w-12 h-14 rounded-xl hover:bg-secondary text-muted-foreground hover:text-foreground transition-all cursor-pointer group"
              title="Crear esfera suave"
            >
              <CircleDot className="w-4 h-4 mb-1 text-purple-500 group-hover:scale-110 transition-transform" />
              <span className="text-[10px] leading-tight">Esfera</span>
            </button>
          </div>

          {/* Grupo 3: Operaciones CAD (Extruir, Revolución, Boleana) */}
          <div className="flex items-center space-x-1 pr-2 border-r border-border shrink-0">
            <button
              onClick={() => handleToolClick('extrude', 'Extruir')}
              className="flex flex-col items-center justify-center w-12 h-14 rounded-xl hover:bg-secondary text-muted-foreground hover:text-foreground transition-all cursor-pointer group"
              title="Extruir perfil 2D"
            >
              <ArrowUpFromLine className="w-4 h-4 mb-1 text-amber-500 group-hover:scale-110 transition-transform" />
              <span className="text-[10px] leading-tight">Extruir</span>
            </button>

            <button
              onClick={() => handleToolClick('revolve', 'Revolución')}
              className="flex flex-col items-center justify-center w-14 h-14 rounded-xl hover:bg-secondary text-muted-foreground hover:text-foreground transition-all cursor-pointer group"
              title="Revolucionar alrededor de un eje"
            >
              <RotateCw className="w-4 h-4 mb-1 text-amber-500 group-hover:scale-110 transition-transform" />
              <span className="text-[10px] leading-tight">Revolución</span>
            </button>

            <button
              onClick={() => handleToolClick('boolean', 'Boleana (Unir/Cortar)')}
              className="flex flex-col items-center justify-center w-14 h-14 rounded-xl hover:bg-secondary text-muted-foreground hover:text-foreground transition-all cursor-pointer group"
              title="Combinar o sustraer sólidos"
            >
              <Scissors className="w-4 h-4 mb-1 text-rose-500 group-hover:scale-110 transition-transform" />
              <span className="text-[10px] leading-tight">Boleana</span>
            </button>
          </div>

          {/* Grupo 4: Medir & Documentar */}
          <div className="flex items-center space-x-1 shrink-0">
            <button
              onClick={() => handleToolClick('measure', 'Medición')}
              className="flex flex-col items-center justify-center w-12 h-14 rounded-xl hover:bg-secondary text-muted-foreground hover:text-foreground transition-all cursor-pointer group"
              title="Medir distancias entre entidades"
            >
              <Compass className="w-4 h-4 mb-1 text-indigo-500 group-hover:scale-110 transition-transform" />
              <span className="text-[10px] leading-tight">Medir</span>
            </button>

            <button
              onClick={() => {
                setActiveWorkspace('drafting');
                showNotice('general', 'Plano Técnico', 'Espacio de documentación 2D abierto.');
              }}
              className="flex flex-col items-center justify-center w-14 h-14 rounded-xl hover:bg-secondary text-muted-foreground hover:text-foreground transition-all cursor-pointer group"
              title="Crear plano técnico 2D"
            >
              <Download className="w-4 h-4 mb-1 text-emerald-500 group-hover:scale-110 transition-transform" />
              <span className="text-[10px] leading-tight">Planos</span>
            </button>
          </div>
        </div>
      )}
    </nav>
  );
};
