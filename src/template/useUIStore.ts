import { useState, useEffect, useCallback, useSyncExternalStore } from 'react';
import type {
  TreeItem,
  AssetItem,
  ContextualBarState,
  WorkspaceMode,
  RibbonTab
} from './types';

export interface UIState {
  theme: 'light' | 'dark';
  activeWorkspace: string;
  activeRibbonTab: string;
  activeTool: string | null;
  toolParams: {
    color: string;
    opacity: number;
    wireframe: boolean;
    scale: number;
    shape: 'cube' | 'sphere' | 'cylinder' | 'torus';
    posX: number;
    posY: number;
    posZ: number;
  };
  documentName: string;
  isSidebarOpen: boolean;
  sidebarSplitRatio: number;
  isInspectorOpen: boolean;
  isFullscreen: boolean;
  isSettingsOpen: boolean;
  gridVisible: boolean;
  snapEnabled: boolean;
  viewPreset: 'iso' | 'top' | 'front' | 'right';
  selectedItemId: string | null;
  treeItems: TreeItem[];
  assetItems: AssetItem[];
  contextualBar: ContextualBarState;
  statusInfo: {
    cursorPos: { x: number; y: number; z: number };
    zoom: number;
    message: string;
  };
  notification: {
    show: boolean;
    message: string;
    type: 'info' | 'success' | 'warning';
  } | null;
}

const STORAGE_THEME_KEY = 'uitemplate_theme';
const STORAGE_SPLIT_KEY = 'uitemplate_sidebar_split';

const initialTreeItems: TreeItem[] = [
  {
    id: 'group_scene',
    label: 'Carpeta 1 de Outliner (Escena)',
    type: 'folder',
    isVisible: true,
    isLocked: false,
    children: [
      {
        id: 'node_origin',
        label: 'Elemento 1.1 de Outliner (Origen)',
        type: 'layer',
        isVisible: true,
        isLocked: true,
      },
      {
        id: 'node_primary_object',
        label: 'Elemento 1.2 de Outliner (Objeto Central)',
        type: 'component',
        isVisible: true,
        isLocked: false,
        color: '#3b82f6',
      },
      {
        id: 'node_lights',
        label: 'Elemento 1.3 de Outliner (Luces)',
        type: 'item',
        isVisible: true,
        isLocked: false,
      },
    ],
  },
  {
    id: 'group_assets',
    label: 'Carpeta 2 de Outliner (Recursos)',
    type: 'folder',
    isVisible: true,
    isLocked: false,
    children: [
      {
        id: 'node_mesh_1',
        label: 'Elemento 2.1 de Outliner (Malla)',
        type: 'item',
        isVisible: true,
        isLocked: false,
      },
      {
        id: 'node_plane_ref',
        label: 'Elemento 2.2 de Outliner (Plano)',
        type: 'layer',
        isVisible: false,
        isLocked: true,
      },
    ],
  },
];

const initialAssetItems: AssetItem[] = [
  {
    id: 'asset_cube',
    name: 'Recurso 1 de Librería (Cubo)',
    category: 'Categoría Librería 1',
    description: 'Item de muestra en panel inferior',
    icon: 'Box',
    tags: ['Muestra', '3D'],
  },
  {
    id: 'asset_sphere',
    name: 'Recurso 2 de Librería (Esfera)',
    category: 'Categoría Librería 1',
    description: 'Item de muestra en panel inferior',
    icon: 'Circle',
    tags: ['Muestra', 'Curvo'],
  },
  {
    id: 'asset_cylinder',
    name: 'Recurso 3 de Librería (Cilindro)',
    category: 'Categoría Librería 1',
    description: 'Item de muestra en panel inferior',
    icon: 'Cylinder',
    tags: ['Muestra', 'Eje'],
  },
  {
    id: 'asset_torus',
    name: 'Recurso 4 de Librería (Toroide)',
    category: 'Categoría Librería 1',
    description: 'Item de muestra en panel inferior',
    icon: 'Disc',
    tags: ['Muestra', 'Toro'],
  },
  {
    id: 'asset_grid',
    name: 'Recurso 5 de Librería (Guía)',
    category: 'Categoría Librería 2',
    description: 'Item de muestra en panel inferior',
    icon: 'Grid',
    tags: ['Guías', '2D'],
  },
  {
    id: 'asset_camera',
    name: 'Recurso 6 de Librería (Cámara)',
    category: 'Categoría Librería 3',
    description: 'Item de muestra en panel inferior',
    icon: 'Camera',
    tags: ['Vista', 'Óptica'],
  },
];

let state: UIState = {
  theme: (typeof window !== 'undefined' && localStorage.getItem(STORAGE_THEME_KEY) === 'light') ? 'light' : 'dark',
  activeWorkspace: 'ws_1',
  activeRibbonTab: 'tab_ribbon_1',
  activeTool: null,
  toolParams: {
    color: '#3b82f6',
    opacity: 1.0,
    wireframe: false,
    scale: 1.0,
    shape: 'cube',
    posX: 0,
    posY: 0,
    posZ: 0,
  },
  documentName: 'Documento en Viewport Central',
  isSidebarOpen: true,
  sidebarSplitRatio: typeof window !== 'undefined' ? Number(localStorage.getItem(STORAGE_SPLIT_KEY)) || 0.5 : 0.5,
  isInspectorOpen: true,
  isFullscreen: false,
  isSettingsOpen: false,
  gridVisible: true,
  snapEnabled: true,
  viewPreset: 'iso',
  selectedItemId: 'node_primary_object',
  treeItems: initialTreeItems,
  assetItems: initialAssetItems,
  contextualBar: {
    isOpen: false,
    title: 'Título de Barra Contextual Superior',
    stepText: 'Descripción de Paso en Barra Contextual Superior',
  },
  statusInfo: {
    cursorPos: { x: 0, y: 0, z: 0 },
    zoom: 100,
    message: 'Estado de Barra Inferior: Listo',
  },
  notification: null,
};

// Simple event listeners for reactive store updates
const listeners = new Set<() => void>();

function emitChange() {
  listeners.forEach((listener) => listener());
}

export const uiStore = {
  getState: () => state,
  subscribe: (listener: () => void) => {
    listeners.add(listener);
    return () => listeners.delete(listener);
  },

  setTheme: (theme: 'light' | 'dark') => {
    state = { ...state, theme };
    localStorage.setItem(STORAGE_THEME_KEY, theme);
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    emitChange();
  },

  toggleTheme: () => {
    const next = state.theme === 'dark' ? 'light' : 'dark';
    uiStore.setTheme(next);
  },

  setActiveWorkspace: (activeWorkspace: string) => {
    state = { ...state, activeWorkspace };
    emitChange();
  },

  setActiveRibbonTab: (activeRibbonTab: string) => {
    state = { ...state, activeRibbonTab };
    emitChange();
  },

  setActiveTool: (toolId: string | null, contextualNotice?: { title: string; stepText: string }) => {
    state = {
      ...state,
      activeTool: toolId,
      contextualBar: contextualNotice
        ? {
            isOpen: true,
            title: contextualNotice.title,
            stepText: contextualNotice.stepText,
            onAccept: () => {
              uiStore.showNotification(`Herramienta "${contextualNotice.title}" ejecutada con éxito`, 'success');
              uiStore.closeContextualBar();
            },
            onCancel: () => {
              uiStore.closeContextualBar();
            },
          }
        : state.contextualBar,
    };
    emitChange();
  },

  closeContextualBar: () => {
    state = {
      ...state,
      activeTool: null,
      contextualBar: { ...state.contextualBar, isOpen: false },
    };
    emitChange();
  },

  setToolParams: (params: Partial<UIState['toolParams']>) => {
    state = {
      ...state,
      toolParams: { ...state.toolParams, ...params },
    };
    emitChange();
  },

  setDocumentName: (documentName: string) => {
    state = { ...state, documentName };
    emitChange();
  },

  toggleSidebar: () => {
    state = { ...state, isSidebarOpen: !state.isSidebarOpen };
    emitChange();
  },

  setSidebarOpen: (isOpen: boolean) => {
    state = { ...state, isSidebarOpen: isOpen };
    emitChange();
  },

  setSidebarSplitRatio: (ratio: number) => {
    const clamped = Math.max(0.2, Math.min(0.8, ratio));
    state = { ...state, sidebarSplitRatio: clamped };
    localStorage.setItem(STORAGE_SPLIT_KEY, clamped.toString());
    emitChange();
  },

  toggleInspector: () => {
    state = { ...state, isInspectorOpen: !state.isInspectorOpen };
    emitChange();
  },

  setInspectorOpen: (isOpen: boolean) => {
    state = { ...state, isInspectorOpen: isOpen };
    emitChange();
  },

  toggleFullscreen: () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
      state = { ...state, isFullscreen: true };
    } else {
      document.exitFullscreen().catch(() => {});
      state = { ...state, isFullscreen: false };
    }
    emitChange();
  },

  setSettingsOpen: (isOpen: boolean) => {
    state = { ...state, isSettingsOpen: isOpen };
    emitChange();
  },

  toggleGrid: () => {
    state = { ...state, gridVisible: !state.gridVisible };
    emitChange();
  },

  toggleSnap: () => {
    state = { ...state, snapEnabled: !state.snapEnabled };
    emitChange();
  },

  setViewPreset: (preset: 'iso' | 'top' | 'front' | 'right') => {
    state = { ...state, viewPreset: preset };
    emitChange();
  },

  selectTreeItem: (id: string | null) => {
    state = { ...state, selectedItemId: id };
    emitChange();
  },

  toggleTreeItemVisibility: (id: string) => {
    const updateVisibility = (items: TreeItem[]): TreeItem[] =>
      items.map((item) => {
        if (item.id === id) {
          return { ...item, isVisible: !item.isVisible };
        }
        if (item.children) {
          return { ...item, children: updateVisibility(item.children) };
        }
        return item;
      });

    state = { ...state, treeItems: updateVisibility(state.treeItems) };
    emitChange();
  },

  toggleTreeItemLock: (id: string) => {
    const updateLock = (items: TreeItem[]): TreeItem[] =>
      items.map((item) => {
        if (item.id === id) {
          return { ...item, isLocked: !item.isLocked };
        }
        if (item.children) {
          return { ...item, children: updateLock(item.children) };
        }
        return item;
      });

    state = { ...state, treeItems: updateLock(state.treeItems) };
    emitChange();
  },

  deleteTreeItem: (id: string) => {
    const removeItem = (items: TreeItem[]): TreeItem[] =>
      items
        .filter((item) => item.id !== id)
        .map((item) => (item.children ? { ...item, children: removeItem(item.children) } : item));

    state = {
      ...state,
      treeItems: removeItem(state.treeItems),
      selectedItemId: state.selectedItemId === id ? null : state.selectedItemId,
    };
    emitChange();
  },

  setStatusMessage: (message: string) => {
    state = {
      ...state,
      statusInfo: { ...state.statusInfo, message },
    };
    emitChange();
  },

  setCursorPos: (pos: { x: number; y: number; z: number }) => {
    state = {
      ...state,
      statusInfo: { ...state.statusInfo, cursorPos: pos },
    };
    emitChange();
  },

  setZoom: (zoom: number) => {
    state = {
      ...state,
      statusInfo: { ...state.statusInfo, zoom },
    };
    emitChange();
  },

  showNotification: (message: string, type: 'info' | 'success' | 'warning' = 'info') => {
    state = {
      ...state,
      notification: { show: true, message, type },
    };
    emitChange();
    setTimeout(() => {
      if (state.notification?.message === message) {
        state = { ...state, notification: null };
        emitChange();
      }
    }, 3500);
  },
};

// React hook to use the store
export function useUIStore() {
  const current = useSyncExternalStore(uiStore.subscribe, uiStore.getState);

  useEffect(() => {
    // Sync initial theme with DOM
    if (current.theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }

    const onFullscreenChange = () => {
      if (document.fullscreenElement && !current.isFullscreen) {
        uiStore.getState().isFullscreen = true;
        emitChange();
      } else if (!document.fullscreenElement && current.isFullscreen) {
        uiStore.getState().isFullscreen = false;
        emitChange();
      }
    };

    document.addEventListener('fullscreenchange', onFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', onFullscreenChange);
  }, []);

  return {
    ...current,
    setTheme: uiStore.setTheme,
    toggleTheme: uiStore.toggleTheme,
    setActiveWorkspace: uiStore.setActiveWorkspace,
    setActiveRibbonTab: uiStore.setActiveRibbonTab,
    setActiveTool: uiStore.setActiveTool,
    closeContextualBar: uiStore.closeContextualBar,
    setToolParams: uiStore.setToolParams,
    setDocumentName: uiStore.setDocumentName,
    toggleSidebar: uiStore.toggleSidebar,
    setSidebarOpen: uiStore.setSidebarOpen,
    setSidebarSplitRatio: uiStore.setSidebarSplitRatio,
    toggleInspector: uiStore.toggleInspector,
    setInspectorOpen: uiStore.setInspectorOpen,
    toggleFullscreen: uiStore.toggleFullscreen,
    setSettingsOpen: uiStore.setSettingsOpen,
    toggleGrid: uiStore.toggleGrid,
    toggleSnap: uiStore.toggleSnap,
    setViewPreset: uiStore.setViewPreset,
    selectTreeItem: uiStore.selectTreeItem,
    toggleTreeItemVisibility: uiStore.toggleTreeItemVisibility,
    toggleTreeItemLock: uiStore.toggleTreeItemLock,
    deleteTreeItem: uiStore.deleteTreeItem,
    setStatusMessage: uiStore.setStatusMessage,
    setCursorPos: uiStore.setCursorPos,
    setZoom: uiStore.setZoom,
    showNotification: uiStore.showNotification,
  };
}
