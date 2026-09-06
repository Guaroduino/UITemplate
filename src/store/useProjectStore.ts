import { create } from 'zustand';
import type { SceneObject, ProjectItem, LibraryItem } from '../types/ui';
import { INITIAL_OBJECTS, INITIAL_PROJECTS } from '../data/mockData';

interface ProjectState {
  projectName: string;
  isSaved: boolean;
  projects: ProjectItem[];
  objects: SceneObject[];
  selectedObjectId: string | null;
  history: SceneObject[][];
  historyIndex: number;

  // Actions
  setProjectName: (name: string) => void;
  selectObject: (id: string | null) => void;
  addObject: (object: Omit<SceneObject, 'id'>) => void;
  insertFromLibrary: (item: LibraryItem) => void;
  removeObject: (id: string) => void;
  duplicateObject: (id: string) => void;
  toggleVisibility: (id: string) => void;
  toggleLock: (id: string) => void;
  updateObject: (id: string, updates: Partial<SceneObject>) => void;
  clearScene: () => void;

  // Undo / Redo
  undo: () => void;
  redo: () => void;
  canUndo: boolean;
  canRedo: boolean;

  // Projects Management
  createNewProject: (name?: string) => void;
  openProject: (project: ProjectItem) => void;
  deleteProject: (id: string) => void;
  saveProject: () => void;
}

export const useProjectStore = create<ProjectState>((set, get) => {
  const pushHistory = (newObjects: SceneObject[]) => {
    const { history, historyIndex } = get();
    const nextHistory = history.slice(0, historyIndex + 1);
    nextHistory.push(newObjects);
    return {
      objects: newObjects,
      history: nextHistory,
      historyIndex: nextHistory.length - 1,
      canUndo: true,
      canRedo: false,
      isSaved: false,
    };
  };

  return {
    projectName: 'Nuevo Diseño 3D',
    isSaved: true,
    projects: INITIAL_PROJECTS,
    objects: INITIAL_OBJECTS,
    selectedObjectId: 'obj-1',
    history: [INITIAL_OBJECTS],
    historyIndex: 0,
    canUndo: false,
    canRedo: false,

    setProjectName: (projectName) => set({ projectName, isSaved: false }),

    selectObject: (id) => set({ selectedObjectId: id }),

    addObject: (objData) => {
      const id = `obj-${Date.now().toString(36)}`;
      const newObject: SceneObject = { ...objData, id };
      const newObjects = [...get().objects, newObject];
      set({
        ...pushHistory(newObjects),
        selectedObjectId: id,
      });
    },

    insertFromLibrary: (item) => {
      const id = `obj-${Date.now().toString(36)}`;
      const newObject: SceneObject = {
        id,
        name: item.name,
        type: item.iconType === 'box' ? 'box' : item.iconType === 'cylinder' ? 'cylinder' : item.iconType === 'sphere' ? 'sphere' : 'box',
        visible: true,
        locked: false,
        color: item.defaultColor,
        position: [(Math.random() - 0.5) * 2, 0.5, (Math.random() - 0.5) * 2],
        rotation: [0, 0, 0],
        scale: [1, 1, 1],
      };
      const newObjects = [...get().objects, newObject];
      set({
        ...pushHistory(newObjects),
        selectedObjectId: id,
      });
    },

    removeObject: (id) => {
      const newObjects = get().objects.filter((o) => o.id !== id);
      set({
        ...pushHistory(newObjects),
        selectedObjectId: get().selectedObjectId === id ? null : get().selectedObjectId,
      });
    },

    duplicateObject: (id) => {
      const original = get().objects.find((o) => o.id === id);
      if (!original) return;
      const newId = `obj-${Date.now().toString(36)}`;
      const duplicated: SceneObject = {
        ...original,
        id: newId,
        name: `${original.name} (Copia)`,
        position: [original.position[0] + 0.5, original.position[1], original.position[2] + 0.5],
      };
      const newObjects = [...get().objects, duplicated];
      set({
        ...pushHistory(newObjects),
        selectedObjectId: newId,
      });
    },

    toggleVisibility: (id) => {
      const newObjects = get().objects.map((o) =>
        o.id === id ? { ...o, visible: !o.visible } : o
      );
      set({ ...pushHistory(newObjects) });
    },

    toggleLock: (id) => {
      const newObjects = get().objects.map((o) =>
        o.id === id ? { ...o, locked: !o.locked } : o
      );
      set({ ...pushHistory(newObjects) });
    },

    updateObject: (id, updates) => {
      const newObjects = get().objects.map((o) =>
        o.id === id ? { ...o, ...updates } : o
      );
      set({ objects: newObjects, isSaved: false });
    },

    clearScene: () => {
      set({
        ...pushHistory([]),
        selectedObjectId: null,
      });
    },

    undo: () => {
      const { history, historyIndex } = get();
      if (historyIndex > 0) {
        const nextIndex = historyIndex - 1;
        set({
          objects: history[nextIndex],
          historyIndex: nextIndex,
          canUndo: nextIndex > 0,
          canRedo: true,
          isSaved: false,
        });
      }
    },

    redo: () => {
      const { history, historyIndex } = get();
      if (historyIndex < history.length - 1) {
        const nextIndex = historyIndex + 1;
        set({
          objects: history[nextIndex],
          historyIndex: nextIndex,
          canUndo: true,
          canRedo: nextIndex < history.length - 1,
          isSaved: false,
        });
      }
    },

    createNewProject: (name) => {
      set({
        projectName: name || 'Nuevo Proyecto',
        objects: [],
        selectedObjectId: null,
        history: [[]],
        historyIndex: 0,
        canUndo: false,
        canRedo: false,
        isSaved: true,
      });
    },

    openProject: (project) => {
      set({
        projectName: project.name,
        objects: INITIAL_OBJECTS,
        selectedObjectId: INITIAL_OBJECTS[0]?.id || null,
        history: [INITIAL_OBJECTS],
        historyIndex: 0,
        canUndo: false,
        canRedo: false,
        isSaved: true,
      });
    },

    deleteProject: (id) => {
      set((state) => ({
        projects: state.projects.filter((p) => p.id !== id),
      }));
    },

    saveProject: () => {
      set({ isSaved: true });
    },
  };
});
