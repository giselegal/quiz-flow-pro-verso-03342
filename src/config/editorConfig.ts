import { EditorConfig } from '@/types/editor';

export const editorConfig: EditorConfig = {
  // Layout configuration
  layout: {
    sidebar: {
      width: 280,
      collapsible: true,
    },
    canvas: {
      width: 'auto',
      maxWidth: 1200,
    },
    properties: {
      width: 320,
      collapsible: true,
    },
  },

  // Block configuration
  blocks: {
    maxPerPage: 50,
    defaultSpacing: 16,
    gridColumns: 12,
  },

  // Editor features
  features: {
    autoSave: true,
    undoRedo: true,
    preview: true,
    dragAndDrop: true,
    validation: true,
  },

  // Validation rules
  validation: {
    debounceMs: 500,
    validateOnChange: true,
    validateOnBlur: true,
    showErrorsImmediately: false,
  },

  // Theme configuration
  theme: {
    colorScheme: 'light',
    radius: 'medium',
    spacing: 'comfortable',
  },

  // Performance settings
  performance: {
    lazyLoadBlocks: true,
    renderThrottle: 16,
    maxBlocksBeforePagination: 100,
  },
};

// Editor constants
export const EDITOR_CONSTANTS = {
  MIN_BLOCK_HEIGHT: 50,
  MAX_BLOCK_HEIGHT: 1000,
  AUTOSAVE_INTERVAL: 30000,
  MAX_UNDO_STEPS: 50,
};

// Default values for new blocks
export const DEFAULT_BLOCK_VALUES = {
  text: '',
  fontSize: '16px',
  color: '#000000',
  backgroundColor: 'transparent',
  padding: '16px',
  margin: '0px',
};

// Block categories for sidebar
export const BLOCK_CATEGORIES = [
  {
    id: 'content',
    label: 'Conteúdo',
    blocks: ['text', 'heading', 'image', 'video'],
  },
  {
    id: 'quiz',
    label: 'Quiz',
    blocks: ['question', 'options', 'result'],
  },
  {
    id: 'layout',
    label: 'Layout',
    blocks: ['container', 'grid', 'divider'],
  },
];
