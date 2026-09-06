export type WorkspaceId = 'model-3d' | 'sketch-2d' | 'render' | 'drafting';

export type AppView = 'dashboard' | 'workspace';

export type CameraPreset = 'home' | 'top' | 'bottom' | 'front' | 'back' | 'left' | 'right' | 'isometric';

export type RenderStyle = 'shaded' | 'wireframe' | 'xray' | 'studio' | 'clay';

export type TransformMode = 'none' | 'translate' | 'rotate' | 'scale';

export interface SceneObject {
  id: string;
  name: string;
  type: 'box' | 'cylinder' | 'sphere' | 'torus' | 'group' | 'plane';
  visible: boolean;
  locked: boolean;
  color: string;
  position: [number, number, number];
  rotation: [number, number, number];
  scale: [number, number, number];
  parentId?: string | null;
}

export interface LibraryItem {
  id: string;
  name: string;
  category: 'Básicos' | 'Mecánicos' | 'Arquitectura' | 'Plantillas';
  description: string;
  iconType: 'box' | 'cylinder' | 'sphere' | 'gear' | 'bracket';
  defaultColor: string;
}

export interface ProjectItem {
  id: string;
  name: string;
  updatedAt: string;
  size: string;
  itemCount: number;
  thumbnail?: string;
  isFavorite?: boolean;
}

export type WorkspaceNoticeType = 'general' | 'save' | 'build' | 'import' | 'export';

export interface WorkspaceNoticeState {
  isOpen: boolean;
  type: WorkspaceNoticeType;
  title: string;
  detail?: string;
  isComplete?: boolean;
}
