/**
 * 🎯 EDITOR SERVICE - Application Layer
 * 
 * Orchestrates editor operations, managing state and interactions.
 * Provides high-level operations for the visual editor interface.
 */

import { EditorState } from '@/core/domains/editor/entities/EditorState';
import type { Block } from '@/core/domains/funnel/entities/Block';

export interface EditorHistory {
  states: EditorState[];
  currentIndex: number;
  maxStates: number;
}

export interface EditorSession {
  id: string;
  entityId: string; // Quiz or Funnel ID
  entityType: 'quiz' | 'funnel';
  userId?: string;
  currentState: EditorState;
  history: EditorHistory;
  startedAt: Date;
  lastSavedAt?: Date;
  isAutoSaving: boolean;
}

export class EditorService {
  private storageAdapter: {
    get?: <T>(key: string) => Promise<T | null> | T | null;
    set?: <T>(key: string, value: T) => Promise<void> | void;
    remove?: (key: string) => Promise<void> | void;
  };

  constructor() {
    this.storageAdapter = {};
  }

  private readonly AUTO_SAVE_INTERVAL = 30000; // 30 seconds
  private readonly MAX_HISTORY_STATES = 50;

  async createEditorSession(
    entityId: string,
    entityType: 'quiz' | 'funnel',
    userId?: string,
  ): Promise<EditorSession> {
    const sessionId = crypto.randomUUID();
    const now = new Date();
    const initialState = new EditorState(
      sessionId,
      {},
      1,
      null,
      [],
      undefined,
      undefined,
      {
        id: sessionId,
        userId: userId ?? 'anonymous',
        startedAt: now,
        lastActiveAt: now,
        actionsCount: 0,
        device: {
          type: 'desktop',
          browser: 'unknown',
          os: 'unknown',
        },
      },
    );

    const session: EditorSession = {
      id: sessionId,
      entityId,
      entityType,
      userId,
      currentState: initialState,
      history: {
        states: [initialState],
        currentIndex: 0,
        maxStates: this.MAX_HISTORY_STATES,
      },
      startedAt: new Date(),
      isAutoSaving: false,
    };

    await this.storageAdapter.set?.(`editor_session_${session.id}`, session);
    return session;
  }

  async getEditorSession(sessionId: string): Promise<EditorSession | null> {
    return this.storageAdapter.get?.<EditorSession>(`editor_session_${sessionId}`) ?? null;
  }

  async updateEditorSession(sessionId: string, updates: Partial<EditorSession>): Promise<EditorSession> {
    const session = await this.getEditorSession(sessionId);
    if (!session) throw new Error('Editor session not found');

    const updatedSession = { ...session, ...updates };
    await this.storageAdapter.set?.(`editor_session_${sessionId}`, updatedSession);

    return updatedSession;
  }

  async closeEditorSession(sessionId: string): Promise<boolean> {
    await this.storageAdapter.remove?.(`editor_session_${sessionId}`);
    return true;
  }

  async addBlock(sessionId: string, stepNumber: number, block: Block, position?: number): Promise<EditorSession> {
    const session = await this.getEditorSession(sessionId);
    if (!session) throw new Error('Editor session not found');

    const newState = session.currentState.addBlock(stepNumber, block, position);
    return this.updateEditorSession(sessionId, { currentState: newState });
  }

  async updateBlock(sessionId: string, stepNumber: number, blockId: string, updatedBlock: Block): Promise<EditorSession> {
    const session = await this.getEditorSession(sessionId);
    if (!session) throw new Error('Editor session not found');

    const newState = session.currentState.updateBlock(stepNumber, blockId, updatedBlock);
    return this.updateEditorSession(sessionId, { currentState: newState });
  }

  async deleteBlock(sessionId: string, stepNumber: number, blockId: string): Promise<EditorSession> {
    const session = await this.getEditorSession(sessionId);
    if (!session) throw new Error('Editor session not found');

    const newState = session.currentState.removeBlock(stepNumber, blockId);
    return this.updateEditorSession(sessionId, { currentState: newState });
  }

  async duplicateBlock(sessionId: string, blockId: string): Promise<EditorSession> {
    const session = await this.getEditorSession(sessionId);
    if (!session) throw new Error('Editor session not found');

    return session;
  }

  async moveBlock(sessionId: string, blockId: string, newPosition: any): Promise<EditorSession> {
    const session = await this.getEditorSession(sessionId);
    if (!session) throw new Error('Editor session not found');

    return session;
  }

  async selectBlocks(sessionId: string, blockIds: string[]): Promise<EditorSession> {
    const session = await this.getEditorSession(sessionId);
    if (!session) throw new Error('Editor session not found');

    return session;
  }

  async copyBlocks(sessionId: string, blockIds: string[]): Promise<EditorSession> {
    const session = await this.getEditorSession(sessionId);
    if (!session) throw new Error('Editor session not found');

    return session;
  }

  async cutBlocks(sessionId: string, blockIds: string[]): Promise<EditorSession> {
    const session = await this.getEditorSession(sessionId);
    if (!session) throw new Error('Editor session not found');

    return session;
  }

  async pasteBlocks(sessionId: string, position?: any): Promise<EditorSession> {
    const session = await this.getEditorSession(sessionId);
    if (!session) throw new Error('Editor session not found');

    return session;
  }

  async undo(sessionId: string): Promise<EditorSession | null> {
    const session = await this.getEditorSession(sessionId);
    return session;
  }

  async redo(sessionId: string): Promise<EditorSession | null> {
    const session = await this.getEditorSession(sessionId);
    return session;
  }

  async saveEditorState(sessionId: string): Promise<boolean> {
    return true;
  }

  async loadEditorState(entityId: string, entityType: string): Promise<EditorState | null> {
    return null;
  }

  async exportEditorState(sessionId: string): Promise<string> {
    const session = await this.getEditorSession(sessionId);
    return JSON.stringify(session?.currentState || {});
  }

  async importEditorState(sessionId: string, stateJson: string): Promise<EditorSession> {
    const session = await this.getEditorSession(sessionId);
    if (!session) throw new Error('Editor session not found');
    return session;
  }

  async validateEditorSession(sessionId: string): Promise<{ isValid: boolean; errors: string[] }> {
    return { isValid: true, errors: [] };
  }
}