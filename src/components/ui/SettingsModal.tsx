import React, { useState, useEffect } from 'react';
import {
  X,
  Sun,
  Moon,
  Sliders,
  Check,
  Palette,
  Layers,
  Monitor,
  RotateCcw,
} from 'lucide-react';
import { useUiStore } from '../../store/useUiStore';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose }) => {
  const { showNotice } = useUiStore();
  const [isDark, setIsDark] = useState(true);
  const [units, setUnits] = useState<'mm' | 'cm' | 'm' | 'in'>('mm');
  const [antialiasing, setAntialiasing] = useState(true);
  const [shadows, setShadows] = useState(true);

  useEffect(() => {
    const isCurrentlyDark = document.documentElement.classList.contains('dark');
    setIsDark(isCurrentlyDark);
  }, [isOpen]);

  const toggleTheme = (dark: boolean) => {
    setIsDark(dark);
    if (dark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  const handleResetDefaults = () => {
    toggleTheme(true);
    setUnits('mm');
    setAntialiasing(true);
    setShadows(true);
    showNotice('general', 'Ajustes restaurados', 'Se aplicaron los valores por defecto.');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        className="w-full max-w-lg bg-card border border-border rounded-2xl shadow-2xl overflow-hidden flex flex-col text-foreground transition-colors"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Cabecera del Modal */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border bg-card">
          <div className="flex items-center space-x-2.5">
            <div className="p-2 bg-secondary text-foreground border border-border rounded-xl">
              <Sliders className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold tracking-tight">
                Configuración del Sistema
              </h2>
              <p className="text-[11px] text-muted-foreground">
                Personaliza la apariencia y preferencias del entorno
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-muted-foreground hover:text-foreground rounded-lg hover:bg-secondary transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Cuerpo del Modal */}
        <div className="p-6 space-y-6 max-h-[70vh] overflow-y-auto custom-scrollbar text-xs">
          {/* 1. Tema Visual */}
          <div className="space-y-3">
            <div className="flex items-center space-x-2 text-foreground font-semibold">
              <Palette className="w-4 h-4 text-blue-500" />
              <span>Tema de Interfaz</span>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => toggleTheme(false)}
                className={`flex items-center justify-center space-x-2 p-3 rounded-xl border transition-all cursor-pointer ${
                  !isDark
                    ? 'border-blue-500 bg-blue-500/10 text-blue-600 font-semibold'
                    : 'border-border bg-secondary hover:bg-secondary/80 text-muted-foreground'
                }`}
              >
                <Sun className="w-4 h-4" />
                <span>Modo Claro</span>
                {!isDark && <Check className="w-3.5 h-3.5 ml-1" />}
              </button>
              <button
                type="button"
                onClick={() => toggleTheme(true)}
                className={`flex items-center justify-center space-x-2 p-3 rounded-xl border transition-all cursor-pointer ${
                  isDark
                    ? 'border-blue-500 bg-blue-500/10 text-blue-400 font-semibold'
                    : 'border-border bg-secondary hover:bg-secondary/80 text-muted-foreground'
                }`}
              >
                <Moon className="w-4 h-4" />
                <span>Modo Oscuro</span>
                {isDark && <Check className="w-3.5 h-3.5 ml-1" />}
              </button>
            </div>
          </div>

          {/* 2. Unidades de Medida */}
          <div className="space-y-3 pt-4 border-t border-border">
            <div className="flex items-center space-x-2 text-foreground font-semibold">
              <Layers className="w-4 h-4 text-emerald-500" />
              <span>Unidades del Documento</span>
            </div>
            <div className="grid grid-cols-4 gap-2">
              {(['mm', 'cm', 'm', 'in'] as const).map((unit) => (
                <button
                  key={unit}
                  type="button"
                  onClick={() => setUnits(unit)}
                  className={`p-2 rounded-xl border text-center font-mono font-medium transition-all cursor-pointer ${
                    units === unit
                      ? 'border-emerald-500 bg-emerald-500/10 text-emerald-500 font-bold'
                      : 'border-border bg-secondary hover:bg-secondary/80 text-muted-foreground'
                  }`}
                >
                  {unit}
                </button>
              ))}
            </div>
          </div>

          {/* 3. Renderizado y Rendimiento */}
          <div className="space-y-3 pt-4 border-t border-border">
            <div className="flex items-center space-x-2 text-foreground font-semibold">
              <Monitor className="w-4 h-4 text-purple-500" />
              <span>Gráficos y Rendimiento</span>
            </div>
            <div className="space-y-2">
              <label className="flex items-center justify-between p-2.5 rounded-xl bg-secondary/50 border border-border cursor-pointer">
                <div>
                  <p className="font-semibold text-foreground">Suavizado de Aristas (Antialiasing)</p>
                  <p className="text-[10px] text-muted-foreground">Mejora la calidad visual de las líneas 3D</p>
                </div>
                <input
                  type="checkbox"
                  checked={antialiasing}
                  onChange={(e) => setAntialiasing(e.target.checked)}
                  className="rounded border-border text-blue-600 focus:ring-blue-500"
                />
              </label>
              <label className="flex items-center justify-between p-2.5 rounded-xl bg-secondary/50 border border-border cursor-pointer">
                <div>
                  <p className="font-semibold text-foreground">Sombras en Tiempo Real</p>
                  <p className="text-[10px] text-muted-foreground">Proyección de sombras sobre el plano de trabajo</p>
                </div>
                <input
                  type="checkbox"
                  checked={shadows}
                  onChange={(e) => setShadows(e.target.checked)}
                  className="rounded border-border text-blue-600 focus:ring-blue-500"
                />
              </label>
            </div>
          </div>
        </div>

        {/* Pie del Modal */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-border bg-secondary/30">
          <button
            type="button"
            onClick={handleResetDefaults}
            className="flex items-center space-x-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Restaurar por defecto</span>
          </button>

          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-foreground text-background text-xs font-semibold rounded-xl hover:opacity-90 transition-opacity cursor-pointer"
          >
            Aceptar
          </button>
        </div>
      </div>
    </div>
  );
};
