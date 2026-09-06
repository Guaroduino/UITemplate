import React from 'react';
import { PenTool, Camera, Ruler, Sparkles, Plus, ArrowRight } from 'lucide-react';
import { useUiStore } from '../../store/useUiStore';

export const Canvas2DPlaceholder: React.FC = () => {
  const { activeWorkspace, setActiveWorkspace, showNotice } = useUiStore();

  const getWorkspaceDetails = () => {
    switch (activeWorkspace) {
      case 'sketch-2d':
        return {
          title: 'Espacio de Boceto 2D',
          desc: 'Lienzo paramétrico 2D con detección de restricciones (horizontal, vertical, tangencia, acotado).',
          icon: PenTool,
          badge: 'Canvas 2D Activo',
          action: 'Finalizar Boceto',
          hint: 'Dibuja líneas, círculos, arcos y splines para extruir o revolucionar en 3D.',
        };
      case 'render':
        return {
          title: 'Estudio de Render Fotorealista',
          desc: 'Visualización fotorrealista con iluminación por HDRI, trazador de rayos (Path Tracer) y materiales PBR.',
          icon: Camera,
          badge: 'Raytracing Engine',
          action: 'Capturar Render HD',
          hint: 'Configura entornos de iluminación, texturas de materiales e intensidad lumínica.',
        };
      case 'drafting':
      default:
        return {
          title: 'Espacio de Planos Técnicos (Drafting)',
          desc: 'Generación automatizada de proyecciones ortogonales (alzado, planta, perfil) y hojas de fabricación normalizadas ISO/ANSI.',
          icon: Ruler,
          badge: 'Lámina 2D',
          action: 'Exportar a SVG / PDF',
          hint: 'Inserta cotas milimétricas, listas de piezas (BOM) y cuadros de rotulación.',
        };
    }
  };

  const details = getWorkspaceDetails();
  const Icon = details.icon;

  return (
    <div className="w-full h-full relative bg-[#0f1117] flex flex-col items-center justify-center p-6 text-foreground select-none overflow-hidden">
      {/* Fondo con rejilla técnica de plano */}
      <div
        className="absolute inset-0 opacity-15 pointer-events-none"
        style={{
          backgroundImage:
            'radial-gradient(circle, #38bdf8 1px, transparent 1px), linear-gradient(to right, #1e293b 1px, transparent 1px), linear-gradient(to bottom, #1e293b 1px, transparent 1px)',
          backgroundSize: '24px 24px, 48px 48px, 48px 48px',
        }}
      />

      {/* Tarjeta Central del Workspace Placeholder */}
      <div className="relative z-10 max-w-lg w-full bg-card/90 backdrop-blur-md border border-border p-8 rounded-3xl shadow-2xl text-center flex flex-col items-center animate-in fade-in zoom-in-95 duration-200">
        <div className="p-4 rounded-2xl bg-blue-500/10 text-blue-500 border border-blue-500/20 mb-4 shadow-xs">
          <Icon className="w-8 h-8" />
        </div>

        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold tracking-wide uppercase bg-secondary border border-border text-muted-foreground mb-2">
          {details.badge}
        </span>

        <h2 className="text-xl font-bold tracking-tight text-foreground">
          {details.title}
        </h2>

        <p className="text-xs text-muted-foreground mt-2 leading-relaxed max-w-md">
          {details.desc}
        </p>

        <div className="w-full p-3 my-4 bg-secondary/50 rounded-xl border border-border text-[11px] text-muted-foreground flex items-center justify-center space-x-2">
          <Sparkles className="w-3.5 h-3.5 text-amber-500 shrink-0" />
          <span>{details.hint}</span>
        </div>

        <div className="flex items-center space-x-3 w-full mt-2">
          <button
            onClick={() => setActiveWorkspace('model-3d')}
            className="flex-1 py-2 px-4 rounded-xl border border-border bg-secondary hover:bg-secondary/80 text-xs font-semibold text-foreground transition-colors cursor-pointer"
          >
            Volver a 3D
          </button>

          <button
            onClick={() => showNotice('general', details.action, 'Acción ejecutada en el workspace.')}
            className="flex-1 py-2 px-4 rounded-xl bg-foreground text-background text-xs font-bold hover:opacity-90 transition-opacity flex items-center justify-center space-x-1.5 cursor-pointer shadow-xs"
          >
            <span>{details.action}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
