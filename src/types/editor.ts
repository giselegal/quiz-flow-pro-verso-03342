import { LucideIcon } from "lucide-react";
import { SimpleComponent } from "./quiz";

export interface ComponentType {
  type: SimpleComponent["type"];
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

export interface PropertySchema {
  type: 'string' | 'number' | 'boolean' | 'array' | 'object' | 'text' | 'textarea' | 'select';
  default?: any;
  defaultValue?: any;
  description?: string;
  label?: string;
  enum?: string[];
  options?: Array<string | { value: string; label: string }>;
  properties?: { [key: string]: PropertySchema };
}

// Core editor types that were missing
export interface EditorBlock {
  id: string;
  type: string;
  content: Record<string, any>;
  order: number;
  properties: Record<string, any>; // Make properties required to match Block interface
}

export interface Block {
  id: string;
  type: string;
  content: Record<string, any>;
  order: number;
  properties: Record<string, any>;
}

export interface EditableContent {
  title?: string;
  subtitle?: string;
  text?: string;
  imageUrl?: string;
  imageAlt?: string;
  caption?: string;
  buttonText?: string;
  buttonUrl?: string;
  logo?: string;
  logoAlt?: string;
  logoWidth?: number;
  logoHeight?: number;
  showProgress?: boolean;
  currentStep?: number;
  totalSteps?: number;
  progressBar?: boolean;
  // Additional properties for quiz questions
  question?: string;
  options?: any[];
  multipleSelection?: boolean;
  progressPercent?: number;
  showImages?: boolean;
  optionLayout?: string;
  logoUrl?: string;
  showBackButton?: boolean;
  // Additional properties for buttons
  action?: string;
  url?: string;
  // Additional properties for spacers
  height?: number | string; // Allow both number and string for flexibility
  // Additional properties for text styling
  textColor?: string;
  alignment?: 'left' | 'center' | 'right';
  // Additional properties for hero blocks
  heroImage?: string;
  heroImageAlt?: string;
  quote?: string;
  quoteAuthor?: string;
  // Additional properties for pricing
  salePrice?: string;
  regularPrice?: string;
  style?: {
    backgroundColor?: string;
    color?: string;
    fontSize?: string;
    fontWeight?: string;
    fontFamily?: string;
    textAlign?: string;
    padding?: string;
    margin?: string;
    width?: string;
    height?: string;
    borderRadius?: string;
    boxShadow?: string;
    objectFit?: string;
    lineHeight?: string;
    letterSpacing?: string;
    display?: string;
    flexDirection?: string;
    justifyContent?: string;
    alignItems?: string;
    gap?: string;
    borderWidth?: string;
    borderStyle?: string;
    borderColor?: string;
    type?: string;
  };
}

export interface BlockDefinition {
  type: string;
  name: string;
  description: string;
  category: string;
  icon: string;
  component: React.ComponentType<any>;
  properties: Record<string, PropertySchema>;
  label: string;
  defaultProps: Record<string, any>;
  tags?: string[];
}

export interface BlockType {
  id: string;
  name: string;
  icon: LucideIcon;
  description: string;
  category: string;
  defaultProps: Record<string, any>;
}
