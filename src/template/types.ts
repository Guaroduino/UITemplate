export interface WorkspaceMode {
  id: string;
  name: string;
  icon?: string;
  badge?: string;
}

export interface RibbonTool {
  id: string;
  label: string;
  icon: string; // Lucide icon name or component
  shortcut?: string;
  tooltip?: string;
  badge?: string;
  isActive?: boolean;
  disabled?: boolean;
  dropdownTools?: RibbonTool[];
  onClick?: () => void;
}

export interface RibbonGroup {
  id: string;
  title: string;
  tools: RibbonTool[];
}

export interface RibbonTab {
  id: string;
  label: string;
  groups: RibbonGroup[];
}

export interface TreeItem {
  id: string;
  label: string;
  type: 'folder' | 'item' | 'layer' | 'group' | 'component';
  isVisible?: boolean;
  isLocked?: boolean;
  children?: TreeItem[];
  color?: string;
  metadata?: Record<string, any>;
}

export interface AssetItem {
  id: string;
  name: string;
  category: string;
  description?: string;
  icon?: string;
  badge?: string;
  tags?: string[];
  previewUrl?: string;
  metadata?: Record<string, any>;
}

export interface ContextAction {
  id: string;
  label: string;
  icon?: string;
  variant?: 'default' | 'primary' | 'danger' | 'ghost';
  onClick: () => void;
}

export interface ContextualBarState {
  isOpen: boolean;
  title: string;
  stepText?: string;
  currentStep?: number;
  totalSteps?: number;
  actions?: ContextAction[];
  onAccept?: () => void;
  onCancel?: () => void;
  acceptLabel?: string;
  cancelLabel?: string;
}

export interface InspectorProperty {
  id: string;
  label: string;
  type: 'text' | 'number' | 'slider' | 'switch' | 'select' | 'color';
  value: any;
  min?: number;
  max?: number;
  step?: number;
  unit?: string;
  options?: { label: string; value: any }[];
  onChange: (value: any) => void;
}

export interface InspectorSection {
  id: string;
  title: string;
  defaultExpanded?: boolean;
  properties: InspectorProperty[];
}
