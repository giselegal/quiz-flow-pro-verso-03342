import { Block, BlockType } from '@/types/editor';

// Props do EditorToolbar
export interface EditorToolbarProps {
  currentStep: number;
  totalSteps: number;
  isLoading?: boolean;
  displayMode: 'edit' | 'preview' | 'interactive';
  onModeChange: (mode: 'edit' | 'preview' | 'interactive') => void;
}

// Props do FunnelStagesPanel
export interface FunnelStagesPanelProps {
  currentStepNumber: number;
  onStepSelect: (step: number) => void;
  stepsData: Record<string, Block[]>;
}

// Props do EnhancedComponentsSidebar
export interface EnhancedComponentsSidebarProps {
  onAddComponent: (type: BlockType) => Promise<void>;
  currentStepNumber: number;
  isLoading?: boolean;
}

// Props do CanvasDropZone
export interface CanvasDropZoneProps {
  blocks: Block[];
  selectedId?: string | null;
  onSelectBlock: (id: string | null) => void;
  onUpdateBlock: (id: string, updates: Partial<Block>) => Promise<void>;
  onRemoveBlock: (id: string) => Promise<void>;
  currentStepNumber: number;
}

// Props do PropertiesPanel
export interface PropertiesPanelProps {
  block?: Block | null;
  onUpdateBlock: (updates: Partial<Block>) => Promise<void>;
  currentStepNumber: number;
}

// Props do QuizMainDemo
export interface QuizMainDemoProps {
  userName?: string;
  className?: string;
}

// Props do DndProvider
export interface DndProviderProps {
  children: React.ReactNode;
  stepKey: string;
  blocks: Block[];
}
