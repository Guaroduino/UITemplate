import React, { useState } from 'react';
import {
  X,
  Sliders,
  Palette,
  Keyboard,
  Check,
  Sun,
  Moon,
  Monitor,
} from 'lucide-react';
import { useUIStore } from '../../useUIStore';

export const SettingsModal: React.FC = () => {
  const store = useUIStore();
  const [activeTab, setActiveTab] = useState<'general' | 'appearance' | 'shortcuts'>('general');
  const [localDocTitle, setLocalDocTitle] = useState(store.documentName);

  if (!store.isSettingsOpen) return null;

  const shortcuts = [
    { key: 'Ctrl + S', action: 'Guardar Proyecto' },
    { key: 'Ctrl + Z', action: 'Deshacer acción' },
    { key: 'Ctrl + Y', action: 'Rehacer acción' },
    { key: 'F', action: 'Encuadre de Vista (Fit View)' },
    { key: 'Q', action: 'Herramienta de Selección' },
    { key: 'C', action: 'Crear Cubo' },
    { key: 'S', action: 'Crear Esfera' },
    { key: 'M', action: 'Mover / Transformar' },
    { key: 'F11', action: 'Pantalla Completa' },
  ];

  const handleSave = () => {
    store.setDocumentName(localDocTitle);
    store.setSettingsOpen(false);
    store.showNotification('Configuración guardada correctamente', 'success');
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150 select-none">
      <div className="w-full max-w-xl bg-card border border-border rounded-2xl shadow-2xl overflow-hidden flex flex-col text-foreground text-xs animate-in zoom-in-95 duration-200">
        {/* Modal Header */}
        <div className="h-12 px-5 flex items-center justify-between border-b border-border bg-secondary/40 shrink-0">
          <div className="flex items-center space-x-2">
            <Sliders className="w-4 h-4 text-amber-500" />
            <h2 className="text-sm font-bold tracking-tight">Modal de Configuración (Ajustes de Sistema)</h2>
          </div>
          <button
            onClick={() => store.setSettingsOpen(false)}
            className="p-1 rounded-lg hover:bg-secondary text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
            title="Botón Cerrar (Modal Configuración)"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Tabs & Body */}
        <div className="flex flex-1 min-h-[320px]">
          {/* Tabs laterales */}
          <div className="w-44 border-r border-border bg-secondary/20 p-2 space-y-1 shrink-0">
            <button
              onClick={() => setActiveTab('general')}
              className={`w-full flex items-center space-x-2 px-3 py-2 rounded-xl font-semibold transition-all cursor-pointer ${
                activeTab === 'general'
                  ? 'bg-foreground text-background shadow-xs'
                  : 'text-muted-foreground hover:text-foreground hover:bg-secondary/60'
              }`}
            >
              <Sliders className="w-3.5 h-3.5" />
              <span>Pestaña 1 (General)</span>
            </button>

            <button
              onClick={() => setActiveTab('appearance')}
              className={`w-full flex items-center space-x-2 px-3 py-2 rounded-xl font-semibold transition-all cursor-pointer ${
                activeTab === 'appearance'
                  ? 'bg-foreground text-background shadow-xs'
                  : 'text-muted-foreground hover:text-foreground hover:bg-secondary/60'
              }`}
            >
              <Palette className="w-3.5 h-3.5" />
              <span>Pestaña 2 (Apariencia)</span>
            </button>

            <button
              onClick={() => setActiveTab('shortcuts')}
              className={`w-full flex items-center space-x-2 px-3 py-2 rounded-xl font-semibold transition-all cursor-pointer ${
                activeTab === 'shortcuts'
                  ? 'bg-foreground text-background shadow-xs'
                  : 'text-muted-foreground hover:text-foreground hover:bg-secondary/60'
              }`}
            >
              <Keyboard className="w-3.5 h-3.5" />
              <span>Pestaña 3 (Atajos)</span>
            </button>
          </div>

          {/* Panel de Contenido */}
          <div className="flex-1 p-5 overflow-y-auto custom-scrollbar">
            {activeTab === 'general' && (
              <div className="space-y-4">
                <div>
                  <label className="block text-[11px] font-bold text-foreground mb-1">
                    Campo: Nombre de Documento (Cabecera Superior)
                  </label>
                  <input
                    type="text"
                    value={localDocTitle}
                    onChange={(e) => setLocalDocTitle(e.target.value)}
                    className="w-full bg-secondary/60 border border-border rounded-lg px-3 py-1.5 text-xs text-foreground outline-none focus:border-foreground/40"
                  />
                  <p className="text-[10.5px] text-muted-foreground mt-1">
                    Texto vinculado al título en la barra superior.
                  </p>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-foreground mb-1">
                    Selector: Espacio de Trabajo por Defecto
                  </label>
                  <select
                    value={store.activeWorkspace}
                    onChange={(e) => store.setActiveWorkspace(e.target.value)}
                    className="w-full bg-secondary/60 border border-border rounded-lg px-3 py-1.5 text-xs text-foreground outline-none cursor-pointer"
                  >
                    <option value="ws_1">Espacio de Trabajo 1 (Viewport)</option>
                    <option value="ws_2">Espacio de Trabajo 2</option>
                    <option value="ws_3">Espacio de Trabajo 3</option>
                  </select>
                </div>
              </div>
            )}

            {activeTab === 'appearance' && (
              <div className="space-y-4">
                <div>
                  <label className="block text-[11px] font-bold text-foreground mb-2">
                    Tema Visual
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => store.setTheme('dark')}
                      className={`flex items-center justify-center space-x-2 p-3 rounded-xl border transition-all cursor-pointer ${
                        store.theme === 'dark'
                          ? 'border-foreground bg-secondary font-bold shadow-xs'
                          : 'border-border bg-secondary/40 text-muted-foreground hover:text-foreground'
                      }`}
                    >
                      <Moon className="w-4 h-4" />
                      <span>Modo Oscuro</span>
                    </button>

                    <button
                      onClick={() => store.setTheme('light')}
                      className={`flex items-center justify-center space-x-2 p-3 rounded-xl border transition-all cursor-pointer ${
                        store.theme === 'light'
                          ? 'border-foreground bg-secondary font-bold shadow-xs'
                          : 'border-border bg-secondary/40 text-muted-foreground hover:text-foreground'
                      }`}
                    >
                      <Sun className="w-4 h-4" />
                      <span>Modo Claro</span>
                    </button>
                  </div>
                </div>

                <div className="pt-2 border-t border-border/60">
                  <div className="flex items-center justify-between py-1">
                    <div>
                      <span className="font-bold block text-[11px]">Rejilla Métrica Activa</span>
                      <span className="text-[10px] text-muted-foreground">
                        Mostrar guías milimétricas en el viewport
                      </span>
                    </div>
                    <button
                      onClick={store.toggleGrid}
                      className={`w-9 h-5 rounded-full p-0.5 transition-colors cursor-pointer ${
                        store.gridVisible ? 'bg-amber-500' : 'bg-secondary border border-border'
                      }`}
                    >
                      <div
                        className={`w-4 h-4 rounded-full bg-white transition-transform ${
                          store.gridVisible ? 'translate-x-4' : 'translate-x-0'
                        }`}
                      />
                    </button>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'shortcuts' && (
              <div className="space-y-2">
                <p className="text-[11px] text-muted-foreground mb-2">
                  Atajos de teclado configurados en esta plantilla:
                </p>
                <div className="border border-border rounded-xl overflow-hidden divide-y divide-border/60">
                  {shortcuts.map((sc, i) => (
                    <div key={i} className="flex items-center justify-between px-3 py-1.5 bg-secondary/20">
                      <span className="text-[11px] text-foreground font-medium">{sc.action}</span>
                      <kbd className="px-2 py-0.5 bg-secondary border border-border rounded font-mono text-[10px] text-muted-foreground font-bold">
                        {sc.key}
                      </kbd>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Modal Footer */}
        <div className="h-12 px-5 flex items-center justify-end space-x-2 border-t border-border bg-secondary/30 shrink-0">
          <button
            onClick={() => store.setSettingsOpen(false)}
            className="px-3.5 py-1.5 rounded-xl text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors cursor-pointer font-semibold"
          >
            Cancelar
          </button>
          <button
            onClick={handleSave}
            className="flex items-center space-x-1.5 px-4 py-1.5 bg-foreground text-background font-bold rounded-xl shadow-xs hover:opacity-90 transition-opacity cursor-pointer"
          >
            <Check className="w-3.5 h-3.5" />
            <span>Guardar</span>
          </button>
        </div>
      </div>
    </div>
  );
};
