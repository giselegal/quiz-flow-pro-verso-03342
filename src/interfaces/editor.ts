import { LucideIcon } from 'lucide-react';
import { SimpleComponent } from './quiz';

export interface ComponentType {
  type: SimpleComponent['type'];
  name: string;
  icon: LucideIcon;
  description: string;
  category?: string;
  defaultData?: any;
}

export interface ComponentCategory {
  title: string;
  color: string;
  components: ComponentType[];
  description?: string;
}

export interface ComponentCategories {
  [key: string]: ComponentCategory;
}

export interface ComponentInstance {
  id: string;
  componentId: string;
  props: Record<string, any>;
  order: number;
}

export interface EditorComponent {
  id: string;
  name: string;
  icon: LucideIcon;
  description: string;
  category: string;
  defaultProps: Record<string, any>;
}

export interface EditorState {
  isDragging: boolean;
  dragOverIndex: number | null;
  selectedComponentId: string | null;
  currentPageIndex: number;
  deviceView: 'mobile' | 'tablet' | 'desktop';
  activeTab: 'editor' | 'funis' | 'historico' | 'config';
  activeConfigSection: string;
  isPreviewMode: boolean;
}

export interface Version {
  id: string;
  timestamp: number;
  version: number;
  description: string;
  isAutoSave: boolean;
  changes: VersionChange[];
}

export interface VersionChange {
  type: 'add' | 'remove' | 'edit';
  component?: string;
  page?: string;
  description: string;
}

export interface VersionMetadata {
  currentVersion: number;
  totalVersions: number;
  lastSavedAt: string;
  autoSaveInterval: number;
}
// Interfaces adicionais que estavam faltando
export interface FunnelManagerState {
  isLoading: boolean;
  error: string | null;
  funnels: any[];
  activeFunnelId: string | null;
}

export interface EditorStateExtended extends EditorState {
  blocks: any[];
  selectedBlockId: string | null;
  isPreviewing: boolean;
  isGlobalStylesOpen: boolean;
}
