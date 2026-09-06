import { create } from 'zustand';
import type {
  AppView,
  WorkspaceId,
  CameraPreset,
  RenderStyle,
  TransformMode,
  WorkspaceNoticeState,
  WorkspaceNoticeType,
} from '../types/ui';

interface UiState {
  // Navigation & Workspace
  view: AppView;
  activeWorkspace: WorkspaceId;
  setView: (view: AppView) => void;
  setActiveWorkspace: (ws: WorkspaceId) => void;

  // Sidebar Panels
  isSidebarOpen: boolean;
  sidebarTab: 'outliner' | 'library';
  toggleSidebar: () => void;
  setSidebarOpen: (open: boolean) => void;
  setSidebarTab: (tab: 'outliner' | 'library') => void;

  // Ribbon & Tools
  activeRibbonTab: string;
  activeTool: string;
  transformMode: TransformMode;
  setActiveRibbonTab: (tab: string) => void;
  setActiveTool: (tool: string) => void;
  setTransformMode: (mode: TransformMode) => void;

  // Viewport Settings
  cameraPreset: CameraPreset;
  renderStyle: RenderStyle;
  showGrid: boolean;
  showAxes: boolean;
  snapEnabled: boolean;
  setCameraPreset: (preset: CameraPreset) => void;
  setRenderStyle: (style: RenderStyle) => void;
  toggleGrid: () => void;
  toggleAxes: () => void;
  toggleSnap: () => void;

  // Context Panels & Modals
  isContextPanelOpen: boolean;
  isSettingsOpen: boolean;
  setContextPanelOpen: (open: boolean) => void;
  setSettingsOpen: (open: boolean) => void;

  // Workspace Notices / Toasts
  notice: WorkspaceNoticeState;
  showNotice: (type: WorkspaceNoticeType, title: string, detail?: string) => void;
  completeNotice: (title?: string, detail?: string) => void;
  closeNotice: () => void;
}

export const useUiStore = create<UiState>((set) => ({
  view: 'workspace',
  activeWorkspace: 'model-3d',
  setView: (view) => set({ view }),
  setActiveWorkspace: (activeWorkspace) => set({ activeWorkspace }),

  isSidebarOpen: true,
  sidebarTab: 'outliner',
  toggleSidebar: () => set((state) => ({ isSidebarOpen: !state.isSidebarOpen })),
  setSidebarOpen: (isSidebarOpen) => set({ isSidebarOpen }),
  setSidebarTab: (sidebarTab) => set({ sidebarTab, isSidebarOpen: true }),

  activeRibbonTab: 'create',
  activeTool: 'select',
  transformMode: 'none',
  setActiveRibbonTab: (activeRibbonTab) => set({ activeRibbonTab }),
  setActiveTool: (activeTool) => set({ activeTool }),
  setTransformMode: (transformMode) => set({ transformMode }),

  cameraPreset: 'isometric',
  renderStyle: 'shaded',
  showGrid: true,
  showAxes: true,
  snapEnabled: true,
  setCameraPreset: (cameraPreset) => set({ cameraPreset }),
  setRenderStyle: (renderStyle) => set({ renderStyle }),
  toggleGrid: () => set((state) => ({ showGrid: !state.showGrid })),
  toggleAxes: () => set((state) => ({ showAxes: !state.showAxes })),
  toggleSnap: () => set((state) => ({ snapEnabled: !state.snapEnabled })),

  isContextPanelOpen: true,
  isSettingsOpen: false,
  setContextPanelOpen: (isContextPanelOpen) => set({ isContextPanelOpen }),
  setSettingsOpen: (isSettingsOpen) => set({ isSettingsOpen }),

  notice: {
    isOpen: false,
    type: 'general',
    title: '',
    detail: '',
    isComplete: false,
  },
  showNotice: (type, title, detail) =>
    set({
      notice: {
        isOpen: true,
        type,
        title,
        detail: detail || '',
        isComplete: false,
      },
    }),
  completeNotice: (title, detail) => {
    set((state) => ({
      notice: {
        ...state.notice,
        isOpen: true,
        title: title || state.notice.title,
        detail: detail !== undefined ? detail : state.notice.detail,
        isComplete: true,
      },
    }));
    setTimeout(() => {
      set((state) => ({
        notice: {
          ...state.notice,
          isOpen: false,
        },
      }));
    }, 1200);
  },
  closeNotice: () =>
    set((state) => ({
      notice: { ...state.notice, isOpen: false },
    })),
}));
