/**
 * 🎯 USE FUNNEL HOOK - Presentation Layer
 * 
 * Custom hook for funnel state management and operations.
 * Provides reactive interface to FunnelService operations.
 */

import { useState, useEffect, useCallback } from 'react';
import { Funnel, Page, Block } from '@/core/domains';
import { FunnelService, FunnelSession, FunnelAnalytics } from '@/application/services/FunnelService';

const funnelService = new FunnelService();

export interface UseFunnelState {
  funnel: Funnel | null;
  pages: Page[];
  currentPage: Page | null;
  blocks: Block[];
  session: FunnelSession | null;
  analytics: FunnelAnalytics | null;
  isLoading: boolean;
  error: string | null;
}

export interface UseFunnelActions {
  // Funnel management
  createFunnel: (name: string, description: string, options?: any) => Promise<void>;
  loadFunnel: (id: string) => Promise<void>;
  updateFunnel: (updates: Partial<Funnel>) => Promise<void>;
  deleteFunnel: () => Promise<void>;
  cloneFunnel: (newName?: string) => Promise<Funnel | null>;
  publishFunnel: () => Promise<void>;
  unpublishFunnel: () => Promise<void>;
  
  // Page management
  addPage: (type: string, title: string, description?: string) => Promise<void>;
  updatePage: (pageId: string, updates: Partial<Page>) => Promise<void>;
  deletePage: (pageId: string) => Promise<void>;
  loadPages: () => Promise<void>;
  setCurrentPage: (pageId: string) => void;
  
  // Block management
  addBlock: (type: string, content: any, position?: number) => Promise<void>;
  updateBlock: (blockId: string, updates: Partial<Block>) => Promise<void>;
  deleteBlock: (blockId: string) => Promise<void>;
  loadBlocks: (pageId: string) => Promise<void>;
  
  // Session management
  startSession: (userId?: string) => Promise<void>;
  navigateToPage: (pageId: string) => Promise<void>;
  completeSession: (conversionData?: any) => Promise<void>;
  loadSession: (sessionId: string) => Promise<void>;
  
  // Template management
  createTemplate: (templateName: string) => Promise<void>;
  createFromTemplate: (templateId: string, newName: string) => Promise<void>;
  
  // Analytics
  loadAnalytics: () => Promise<void>;
  
  // Utility
  clearError: () => void;
  reset: () => void;
}

export function useFunnel(funnelId?: string): UseFunnelState & UseFunnelActions {
  const [state, setState] = useState<UseFunnelState>({
    funnel: null,
    pages: [],
    currentPage: null,
    blocks: [],
    session: null,
    analytics: null,
    isLoading: false,
    error: null
  });

  // 🔍 Internal state updaters
  const setLoading = useCallback((isLoading: boolean) => {
    setState(prev => ({ ...prev, isLoading }));
  }, []);

  const setError = useCallback((error: string | null) => {
    setState(prev => ({ ...prev, error, isLoading: false }));
  }, []);

  const updateState = useCallback((updates: Partial<UseFunnelState>) => {
    setState(prev => ({ ...prev, ...updates, isLoading: false }));
  }, []);

  // 🔍 Funnel Management
  const createFunnel = useCallback(async (
    name: string,
    description: string,
    options: any = {}
  ) => {
    try {
      setLoading(true);
      const funnel = await funnelService.createFunnel(name, description, options);
      updateState({ funnel, error: null });
    } catch (error) {
      setError(`Failed to create funnel: ${error}`);
    }
  }, [setLoading, updateState, setError]);

  const loadFunnel = useCallback(async (id: string) => {
    try {
      setLoading(true);
      const funnel = await funnelService.getFunnel(id);
      if (!funnel) {
        setError('Funnel not found');
        return;
      }
      updateState({ funnel, error: null });
    } catch (error) {
      setError(`Failed to load funnel: ${error}`);
    }
  }, [setLoading, updateState, setError]);

  const updateFunnel = useCallback(async (updates: Partial<Funnel>) => {
    if (!state.funnel) {
      setError('No funnel loaded');
      return;
    }

    try {
      setLoading(true);
      const updatedFunnel = await funnelService.updateFunnel(state.funnel.id, updates);
      updateState({ funnel: updatedFunnel, error: null });
    } catch (error) {
      setError(`Failed to update funnel: ${error}`);
    }
  }, [state.funnel, setLoading, updateState, setError]);

  const deleteFunnel = useCallback(async () => {
    if (!state.funnel) {
      setError('No funnel loaded');
      return;
    }

    try {
      setLoading(true);
      const success = await funnelService.deleteFunnel(state.funnel.id);
      if (success) {
        updateState({ 
          funnel: null, 
          pages: [], 
          currentPage: null,
          blocks: [],
          error: null 
        });
      } else {
        setError('Failed to delete funnel');
      }
    } catch (error) {
      setError(`Failed to delete funnel: ${error}`);
    }
  }, [state.funnel, setLoading, updateState, setError]);

  const cloneFunnel = useCallback(async (newName?: string): Promise<Funnel | null> => {
    if (!state.funnel) {
      setError('No funnel loaded');
      return null;
    }

    try {
      setLoading(true);
      const clonedFunnel = await funnelService.cloneFunnel(state.funnel.id, newName);
      updateState({ error: null });
      return clonedFunnel;
    } catch (error) {
      setError(`Failed to clone funnel: ${error}`);
      return null;
    }
  }, [state.funnel, setLoading, updateState, setError]);

  const publishFunnel = useCallback(async () => {
    if (!state.funnel) {
      setError('No funnel loaded');
      return;
    }

    try {
      setLoading(true);
      const publishedFunnel = await funnelService.publishFunnel(state.funnel.id);
      updateState({ funnel: publishedFunnel, error: null });
    } catch (error) {
      setError(`Failed to publish funnel: ${error}`);
    }
  }, [state.funnel, setLoading, updateState, setError]);

  const unpublishFunnel = useCallback(async () => {
    if (!state.funnel) {
      setError('No funnel loaded');
      return;
    }

    try {
      setLoading(true);
      const unpublishedFunnel = await funnelService.unpublishFunnel(state.funnel.id);
      updateState({ funnel: unpublishedFunnel, error: null });
    } catch (error) {
      setError(`Failed to unpublish funnel: ${error}`);
    }
  }, [state.funnel, setLoading, updateState, setError]);

  // 🔍 Page Management
  const addPage = useCallback(async (
    type: string,
    title: string,
    description?: string
  ) => {
    if (!state.funnel) {
      setError('No funnel loaded');
      return;
    }

    try {
      setLoading(true);
      const page = await funnelService.addPage(
        state.funnel.id,
        type,
        title,
        description
      );
      updateState({ 
        pages: [...state.pages, page],
        error: null 
      });
    } catch (error) {
      setError(`Failed to add page: ${error}`);
    }
  }, [state.funnel, state.pages, setLoading, updateState, setError]);

  const updatePage = useCallback(async (
    pageId: string,
    updates: Partial<Page>
  ) => {
    try {
      setLoading(true);
      const updatedPage = await funnelService.updatePage(pageId, updates);
      
      const updatedPages = state.pages.map(p => 
        p.id === pageId ? updatedPage : p
      );
      
      updateState({ 
        pages: updatedPages,
        currentPage: state.currentPage?.id === pageId ? updatedPage : state.currentPage,
        error: null 
      });
    } catch (error) {
      setError(`Failed to update page: ${error}`);
    }
  }, [state.pages, state.currentPage, setLoading, updateState, setError]);

  const deletePage = useCallback(async (pageId: string) => {
    if (!state.funnel) {
      setError('No funnel loaded');
      return;
    }

    try {
      setLoading(true);
      const success = await funnelService.deletePage(state.funnel.id, pageId);
      if (success) {
        const filteredPages = state.pages.filter(p => p.id !== pageId);
        updateState({ 
          pages: filteredPages,
          currentPage: state.currentPage?.id === pageId ? null : state.currentPage,
          blocks: state.currentPage?.id === pageId ? [] : state.blocks,
          error: null 
        });
      } else {
        setError('Failed to delete page');
      }
    } catch (error) {
      setError(`Failed to delete page: ${error}`);
    }
  }, [state.funnel, state.pages, state.currentPage, state.blocks, setLoading, updateState, setError]);

  const loadPages = useCallback(async () => {
    if (!state.funnel) return;

    try {
      setLoading(true);
      const pages = await funnelService.getPages(state.funnel.id);
      updateState({ pages, error: null });
    } catch (error) {
      setError(`Failed to load pages: ${error}`);
    }
  }, [state.funnel, setLoading, updateState, setError]);

  const setCurrentPage = useCallback((pageId: string) => {
    const page = state.pages.find(p => p.id === pageId);
    if (page) {
      setState(prev => ({ 
        ...prev, 
        currentPage: page,
        blocks: [] // Clear blocks, will be loaded separately
      }));
    }
  }, [state.pages]);

  // 🔍 Block Management
  const addBlock = useCallback(async (
    type: string,
    content: any,
    position?: number
  ) => {
    if (!state.currentPage) {
      setError('No page selected');
      return;
    }

    try {
      setLoading(true);
      const block = await funnelService.addBlock(
        state.currentPage.id,
        type,
        content,
        position
      );
      updateState({ 
        blocks: [...state.blocks, block],
        error: null 
      });
    } catch (error) {
      setError(`Failed to add block: ${error}`);
    }
  }, [state.currentPage, state.blocks, setLoading, updateState, setError]);

  const updateBlock = useCallback(async (
    blockId: string,
    updates: Partial<Block>
  ) => {
    try {
      setLoading(true);
      const updatedBlock = await funnelService.updateBlock(blockId, updates);
      
      const updatedBlocks = state.blocks.map(b => 
        b.id === blockId ? updatedBlock : b
      );
      
      updateState({ blocks: updatedBlocks, error: null });
    } catch (error) {
      setError(`Failed to update block: ${error}`);
    }
  }, [state.blocks, setLoading, updateState, setError]);

  const deleteBlock = useCallback(async (blockId: string) => {
    if (!state.currentPage) {
      setError('No page selected');
      return;
    }

    try {
      setLoading(true);
      const success = await funnelService.deleteBlock(state.currentPage.id, blockId);
      if (success) {
        const filteredBlocks = state.blocks.filter(b => b.id !== blockId);
        updateState({ blocks: filteredBlocks, error: null });
      } else {
        setError('Failed to delete block');
      }
    } catch (error) {
      setError(`Failed to delete block: ${error}`);
    }
  }, [state.currentPage, state.blocks, setLoading, updateState, setError]);

  const loadBlocks = useCallback(async (pageId: string) => {
    try {
      setLoading(true);
      const blocks = await funnelService.getBlocks(pageId);
      updateState({ blocks, error: null });
    } catch (error) {
      setError(`Failed to load blocks: ${error}`);
    }
  }, [setLoading, updateState, setError]);

  // 🔍 Session Management
  const startSession = useCallback(async (userId?: string) => {
    if (!state.funnel) {
      setError('No funnel loaded');
      return;
    }

    try {
      setLoading(true);
      const session = await funnelService.startFunnelSession(state.funnel.id, userId);
      updateState({ session, error: null });
    } catch (error) {
      setError(`Failed to start session: ${error}`);
    }
  }, [state.funnel, setLoading, updateState, setError]);

  const navigateToPage = useCallback(async (pageId: string) => {
    if (!state.session) {
      setError('No active session');
      return;
    }

    try {
      setLoading(true);
      const updatedSession = await funnelService.navigateToPage(state.session.id, pageId);
      updateState({ session: updatedSession, error: null });
    } catch (error) {
      setError(`Failed to navigate to page: ${error}`);
    }
  }, [state.session, setLoading, updateState, setError]);

  const completeSession = useCallback(async (conversionData?: any) => {
    if (!state.session) {
      setError('No active session');
      return;
    }

    try {
      setLoading(true);
      const completedSession = await funnelService.completeFunnelSession(
        state.session.id,
        conversionData
      );
      updateState({ session: completedSession, error: null });
    } catch (error) {
      setError(`Failed to complete session: ${error}`);
    }
  }, [state.session, setLoading, updateState, setError]);

  const loadSession = useCallback(async (sessionId: string) => {
    try {
      setLoading(true);
      const session = await funnelService.getFunnelSession(sessionId);
      if (!session) {
        setError('Session not found');
        return;
      }
      updateState({ session, error: null });
    } catch (error) {
      setError(`Failed to load session: ${error}`);
    }
  }, [setLoading, updateState, setError]);

  // 🔍 Template Management
  const createTemplate = useCallback(async (templateName: string) => {
    if (!state.funnel) {
      setError('No funnel loaded');
      return;
    }

    try {
      setLoading(true);
      await funnelService.createTemplate(state.funnel.id, templateName);
      updateState({ error: null });
    } catch (error) {
      setError(`Failed to create template: ${error}`);
    }
  }, [state.funnel, setLoading, updateState, setError]);

  const createFromTemplate = useCallback(async (templateId: string, newName: string) => {
    try {
      setLoading(true);
      const newFunnel = await funnelService.createFromTemplate(templateId, newName);
      updateState({ funnel: newFunnel, error: null });
    } catch (error) {
      setError(`Failed to create from template: ${error}`);
    }
  }, [setLoading, updateState, setError]);

  // 🔍 Analytics
  const loadAnalytics = useCallback(async () => {
    if (!state.funnel) return;

    try {
      setLoading(true);
      const analytics = await funnelService.getFunnelAnalytics(state.funnel.id);
      updateState({ analytics, error: null });
    } catch (error) {
      setError(`Failed to load analytics: ${error}`);
    }
  }, [state.funnel, setLoading, updateState, setError]);

  // 🔍 Utility functions
  const clearError = useCallback(() => {
    setState(prev => ({ ...prev, error: null }));
  }, []);

  const reset = useCallback(() => {
    setState({
      funnel: null,
      pages: [],
      currentPage: null,
      blocks: [],
      session: null,
      analytics: null,
      isLoading: false,
      error: null
    });
  }, []);

  // 🔍 Auto-load funnel if ID provided
  useEffect(() => {
    if (funnelId && !state.funnel) {
      loadFunnel(funnelId);
    }
  }, [funnelId, state.funnel, loadFunnel]);

  // 🔍 Auto-load related data when funnel changes
  useEffect(() => {
    if (state.funnel) {
      loadPages();
    }
  }, [state.funnel, loadPages]);

  // 🔍 Auto-load blocks when current page changes
  useEffect(() => {
    if (state.currentPage) {
      loadBlocks(state.currentPage.id);
    }
  }, [state.currentPage, loadBlocks]);

  return {
    // State
    ...state,
    
    // Actions
    createFunnel,
    loadFunnel,
    updateFunnel,
    deleteFunnel,
    cloneFunnel,
    publishFunnel,
    unpublishFunnel,
    
    addPage,
    updatePage,
    deletePage,
    loadPages,
    setCurrentPage,
    
    addBlock,
    updateBlock,
    deleteBlock,
    loadBlocks,
    
    startSession,
    navigateToPage,
    completeSession,
    loadSession,
    
    createTemplate,
    createFromTemplate,
    
    loadAnalytics,
    
    clearError,
    reset
  };
}