/**
 * 🎯 EDITOR STATE ENTITY - Core Business Object
 * 
 * Representa o estado completo do editor no domínio Editor.
 * Contém todas as regras de negócio relacionadas ao estado do editor.
 */

import { Block } from '../../funnel/entities/Block';

export interface EditorSession {
  id: string;
  userId: string;
  startedAt: Date;
  lastActiveAt: Date;
  actionsCount: number;
  device: {
    type: 'desktop' | 'tablet' | 'mobile';
    browser: string;
    os: string;
  };
}

export interface EditorValidation {
  isValid: boolean;
  errors: {
    id: string;
    type: 'error' | 'warning' | 'info';
    message: string;
    blockId?: string;
    stepId?: string;
  }[];
  warnings: string[];
}

export interface EditorSettings {
  autoSave: boolean;
  autoSaveInterval: number; // em segundos
  showGrid: boolean;
  showGuidelines: boolean;
  snapToGrid: boolean;
  gridSize: number;
  previewMode: 'desktop' | 'tablet' | 'mobile';
  isDarkMode: boolean;
  showBlockIds: boolean;
  enableAnalytics: boolean;
}

export interface EditorHistory {
  past: EditorStateSnapshot[];
  present: EditorStateSnapshot;
  future: EditorStateSnapshot[];
  maxHistorySize: number;
}

export interface EditorStateSnapshot {
  timestamp: Date;
  action: string;
  stepBlocks: Record<string, Block[]>;
  currentStep: number;
  selectedBlockId: string | null;
}

export class EditorState {
  constructor(
    public readonly sessionId: string,
    public stepBlocks: Record<string, Block[]> = {},
    public currentStep: number = 1,
    public selectedBlockId: string | null = null,
    public clipboard: Block[] = [],
    public settings: EditorSettings = {
      autoSave: true,
      autoSaveInterval: 30,
      showGrid: false,
      showGuidelines: true,
      snapToGrid: false,
      gridSize: 8,
      previewMode: 'desktop',
      isDarkMode: false,
      showBlockIds: false,
      enableAnalytics: true
    },
    public validation: EditorValidation = {
      isValid: true,
      errors: [],
      warnings: []
    },
    public session: EditorSession,
    public metadata: {
      funnelId?: string;
      templateId?: string;
      version: number;
      isAutoSaved: boolean;
      lastSavedAt?: Date;
      createdAt: Date;
      updatedAt: Date;
    } = {
      version: 1,
      isAutoSaved: false,
      createdAt: new Date(),
      updatedAt: new Date()
    }
  ) {}

  // 🔍 Business Rules - State Validation
  isValid(): boolean {
    return (
      this.currentStep > 0 &&
      this.sessionId.trim().length > 0 &&
      this.validation.errors.filter(e => e.type === 'error').length === 0
    );
  }

  hasUnsavedChanges(): boolean {
    return !this.metadata.isAutoSaved || 
           (!!this.metadata.lastSavedAt && 
            this.metadata.updatedAt > this.metadata.lastSavedAt);
  }

  // 🔍 Business Rules - Step Management
  canNavigateToStep(stepNumber: number): boolean {
    return stepNumber > 0 && stepNumber <= this.getTotalSteps();
  }

  navigateToStep(stepNumber: number): EditorState {
    if (!this.canNavigateToStep(stepNumber)) {
      throw new Error(`Não é possível navegar para a etapa ${stepNumber}`);
    }

    return new EditorState(
      this.sessionId,
      this.stepBlocks,
      stepNumber,
      null, // Limpar seleção ao mudar de etapa
      this.clipboard,
      this.settings,
      this.validation,
      {
        ...this.session,
        lastActiveAt: new Date(),
        actionsCount: this.session.actionsCount + 1
      },
      { ...this.metadata, updatedAt: new Date() }
    );
  }

  getTotalSteps(): number {
    return Math.max(...Object.keys(this.stepBlocks).map(key => 
      parseInt(key.replace('step-', '')) || 0
    ), 0);
  }

  getCurrentStepBlocks(): Block[] {
    const stepKey = `step-${this.currentStep}`;
    return this.stepBlocks[stepKey] || [];
  }

  getStepBlocks(stepNumber: number): Block[] {
    const stepKey = `step-${stepNumber}`;
    return this.stepBlocks[stepKey] || [];
  }

  // 🔍 Business Rules - Block Management
  addBlock(stepNumber: number, block: Block, position?: number): EditorState {
    const stepKey = `step-${stepNumber}`;
    const currentBlocks = this.stepBlocks[stepKey] || [];
    
    // Verificar se o bloco já existe
    if (currentBlocks.some(b => b.id === block.id)) {
      throw new Error('Bloco já existe nesta etapa');
    }

    let newBlocks: Block[];
    if (position !== undefined && position >= 0 && position <= currentBlocks.length) {
      newBlocks = [...currentBlocks];
      newBlocks.splice(position, 0, block);
    } else {
      newBlocks = [...currentBlocks, block];
    }

    return new EditorState(
      this.sessionId,
      { ...this.stepBlocks, [stepKey]: newBlocks },
      this.currentStep,
      block.id, // Selecionar o bloco adicionado
      this.clipboard,
      this.settings,
      this.validation,
      {
        ...this.session,
        lastActiveAt: new Date(),
        actionsCount: this.session.actionsCount + 1
      },
      { 
        ...this.metadata, 
        updatedAt: new Date(),
        isAutoSaved: false 
      }
    );
  }

  removeBlock(stepNumber: number, blockId: string): EditorState {
    const stepKey = `step-${stepNumber}`;
    const currentBlocks = this.stepBlocks[stepKey] || [];
    
    const newBlocks = currentBlocks.filter(b => b.id !== blockId);
    
    if (newBlocks.length === currentBlocks.length) {
      throw new Error('Bloco não encontrado nesta etapa');
    }

    return new EditorState(
      this.sessionId,
      { ...this.stepBlocks, [stepKey]: newBlocks },
      this.currentStep,
      this.selectedBlockId === blockId ? null : this.selectedBlockId,
      this.clipboard,
      this.settings,
      this.validation,
      {
        ...this.session,
        lastActiveAt: new Date(),
        actionsCount: this.session.actionsCount + 1
      },
      { 
        ...this.metadata, 
        updatedAt: new Date(),
        isAutoSaved: false 
      }
    );
  }

  updateBlock(stepNumber: number, blockId: string, updatedBlock: Block): EditorState {
    const stepKey = `step-${stepNumber}`;
    const currentBlocks = this.stepBlocks[stepKey] || [];
    
    const blockIndex = currentBlocks.findIndex(b => b.id === blockId);
    if (blockIndex === -1) {
      throw new Error('Bloco não encontrado nesta etapa');
    }

    const newBlocks = [...currentBlocks];
    newBlocks[blockIndex] = updatedBlock;

    return new EditorState(
      this.sessionId,
      { ...this.stepBlocks, [stepKey]: newBlocks },
      this.currentStep,
      this.selectedBlockId,
      this.clipboard,
      this.settings,
      this.validation,
      {
        ...this.session,
        lastActiveAt: new Date(),
        actionsCount: this.session.actionsCount + 1
      },
      { 
        ...this.metadata, 
        updatedAt: new Date(),
        isAutoSaved: false 
      }
    );
  }

  reorderBlocks(stepNumber: number, blockIds: string[]): EditorState {
    const stepKey = `step-${stepNumber}`;
    const currentBlocks = this.stepBlocks[stepKey] || [];
    
    // Validar que todos os IDs existem
    if (blockIds.length !== currentBlocks.length) {
      throw new Error('Lista de blocos deve ter o mesmo tamanho');
    }

    const blockMap = new Map(currentBlocks.map(block => [block.id, block]));
    const reorderedBlocks = blockIds.map(id => {
      const block = blockMap.get(id);
      if (!block) {
        throw new Error(`Bloco ${id} não encontrado`);
      }
      return block;
    });

    return new EditorState(
      this.sessionId,
      { ...this.stepBlocks, [stepKey]: reorderedBlocks },
      this.currentStep,
      this.selectedBlockId,
      this.clipboard,
      this.settings,
      this.validation,
      {
        ...this.session,
        lastActiveAt: new Date(),
        actionsCount: this.session.actionsCount + 1
      },
      { 
        ...this.metadata, 
        updatedAt: new Date(),
        isAutoSaved: false 
      }
    );
  }

  // 🔍 Business Rules - Selection Management
  selectBlock(blockId: string | null): EditorState {
    // Verificar se o bloco existe na etapa atual
    if (blockId && !this.getCurrentStepBlocks().some(b => b.id === blockId)) {
      throw new Error('Bloco não encontrado na etapa atual');
    }

    return new EditorState(
      this.sessionId,
      this.stepBlocks,
      this.currentStep,
      blockId,
      this.clipboard,
      this.settings,
      this.validation,
      {
        ...this.session,
        lastActiveAt: new Date()
      },
      this.metadata
    );
  }

  getSelectedBlock(): Block | null {
    if (!this.selectedBlockId) return null;
    return this.getCurrentStepBlocks().find(b => b.id === this.selectedBlockId) || null;
  }

  // 🔍 Business Rules - Clipboard Operations
  copyBlocks(blockIds: string[]): EditorState {
    const currentBlocks = this.getCurrentStepBlocks();
    const blocksToCopy = currentBlocks.filter(b => blockIds.includes(b.id));
    
    if (blocksToCopy.length === 0) {
      throw new Error('Nenhum bloco válido para copiar');
    }

    return new EditorState(
      this.sessionId,
      this.stepBlocks,
      this.currentStep,
      this.selectedBlockId,
      blocksToCopy.map(block => block.clone()),
      this.settings,
      this.validation,
      {
        ...this.session,
        lastActiveAt: new Date(),
        actionsCount: this.session.actionsCount + 1
      },
      this.metadata
    );
  }

  pasteBlocks(position?: number): EditorState {
    if (this.clipboard.length === 0) {
      throw new Error('Clipboard está vazio');
    }

    let newState: EditorState = this;
    
    this.clipboard.forEach((block, index) => {
      const newBlock = block.clone(
        `${block.id}-paste-${Date.now()}-${index}`,
        `step-${this.currentStep}`
      );
      
      const insertPosition = position !== undefined ? position + index : undefined;
      newState = newState.addBlock(this.currentStep, newBlock, insertPosition);
    });

    return newState;
  }

  clearClipboard(): EditorState {
    return new EditorState(
      this.sessionId,
      this.stepBlocks,
      this.currentStep,
      this.selectedBlockId,
      [],
      this.settings,
      this.validation,
      this.session,
      this.metadata
    );
  }

  // 🔍 Business Rules - Settings Management
  updateSettings(settingsUpdates: Partial<EditorSettings>): EditorState {
    return new EditorState(
      this.sessionId,
      this.stepBlocks,
      this.currentStep,
      this.selectedBlockId,
      this.clipboard,
      { ...this.settings, ...settingsUpdates },
      this.validation,
      {
        ...this.session,
        lastActiveAt: new Date()
      },
      { ...this.metadata, updatedAt: new Date() }
    );
  }

  // 🔍 Business Rules - Validation
  validate(): EditorState {
    const errors: EditorValidation['errors'] = [];
    const warnings: string[] = [];

    // Validar cada etapa
    Object.entries(this.stepBlocks).forEach(([stepKey, blocks]) => {
      blocks.forEach(block => {
        if (!block.isValid()) {
          errors.push({
            id: `invalid-block-${block.id}`,
            type: 'error',
            message: `Bloco ${block.type} inválido`,
            blockId: block.id,
            stepId: stepKey
          });
        }
      });

      // Avisos para etapas vazias
      if (blocks.length === 0) {
        warnings.push(`Etapa ${stepKey} está vazia`);
      }
    });

    const validation: EditorValidation = {
      isValid: errors.filter(e => e.type === 'error').length === 0,
      errors,
      warnings
    };

    return new EditorState(
      this.sessionId,
      this.stepBlocks,
      this.currentStep,
      this.selectedBlockId,
      this.clipboard,
      this.settings,
      validation,
      this.session,
      this.metadata
    );
  }

  // 🔍 Business Rules - Save Management
  markAsSaved(): EditorState {
    return new EditorState(
      this.sessionId,
      this.stepBlocks,
      this.currentStep,
      this.selectedBlockId,
      this.clipboard,
      this.settings,
      this.validation,
      this.session,
      {
        ...this.metadata,
        isAutoSaved: true,
        lastSavedAt: new Date()
      }
    );
  }

  // 🔍 Business Rules - Statistics
  getStatistics(): {
    totalBlocks: number;
    blocksByType: Record<string, number>;
    blocksByStep: Record<string, number>;
    averageBlocksPerStep: number;
    sessionDuration: number;
    actionsPerMinute: number;
  } {
    const totalBlocks = Object.values(this.stepBlocks)
      .flat()
      .length;

    const blocksByType: Record<string, number> = {};
    const blocksByStep: Record<string, number> = {};

    Object.entries(this.stepBlocks).forEach(([stepKey, blocks]) => {
      blocksByStep[stepKey] = blocks.length;
      
      blocks.forEach(block => {
        blocksByType[block.type] = (blocksByType[block.type] || 0) + 1;
      });
    });

    const sessionDuration = Date.now() - this.session.startedAt.getTime();
    const sessionMinutes = sessionDuration / (1000 * 60);
    const actionsPerMinute = sessionMinutes > 0 ? this.session.actionsCount / sessionMinutes : 0;

    return {
      totalBlocks,
      blocksByType,
      blocksByStep,
      averageBlocksPerStep: totalBlocks / Math.max(Object.keys(this.stepBlocks).length, 1),
      sessionDuration,
      actionsPerMinute
    };
  }

  // 🔍 Utility Methods
  toJSON(): Record<string, any> {
    return {
      sessionId: this.sessionId,
      stepBlocks: Object.fromEntries(
        Object.entries(this.stepBlocks).map(([key, blocks]) => [
          key, 
          blocks.map(block => block.toJSON())
        ])
      ),
      currentStep: this.currentStep,
      selectedBlockId: this.selectedBlockId,
      clipboard: this.clipboard.map(block => block.toJSON()),
      settings: this.settings,
      validation: this.validation,
      session: this.session,
      metadata: this.metadata
    };
  }

  static fromJSON(data: Record<string, any>): EditorState {
    const stepBlocks: Record<string, Block[]> = {};
    
    Object.entries(data.stepBlocks || {}).forEach(([key, blocks]) => {
      stepBlocks[key] = (blocks as any[]).map(blockData => Block.fromJSON(blockData));
    });

    return new EditorState(
      data.sessionId,
      stepBlocks,
      data.currentStep || 1,
      data.selectedBlockId || null,
      (data.clipboard || []).map((blockData: any) => Block.fromJSON(blockData)),
      data.settings,
      data.validation,
      data.session,
      data.metadata
    );
  }
}