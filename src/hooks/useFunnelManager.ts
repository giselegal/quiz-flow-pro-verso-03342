import { useState, useCallback, useEffect } from 'react';
import { QuizFunnel, QuizVersion } from '../interfaces/quiz';
import { FunnelManagerState } from '../interfaces/editor';
import { useToast } from '@/components/ui/use-toast';
import { schemaDrivenFunnelService } from '@/services/schemaDrivenFunnelService';

const STORAGE_KEY = 'quiz-funnels';
const VERSIONS_STORAGE_KEY = 'quiz-versions';

export const useFunnelManager = () => {
  const { toast } = useToast();
  const [state, setState] = useState<FunnelManagerState>({
    funnels: [],
    versions: {},
    activeFunnelId: null,
    activeVersionId: null,
    isLoading: false,
    error: null,
  });

  // Carregar funnels do localStorage
  const loadFunnels = useCallback(() => {
    try {
      setState(prev => ({ ...prev, isLoading: true, error: null }));
      
      const storedFunnels = localStorage.getItem(STORAGE_KEY);
      const storedVersions = localStorage.getItem(VERSIONS_STORAGE_KEY);
      
      const funnels = storedFunnels ? JSON.parse(storedFunnels) : [];
      const versions = storedVersions ? JSON.parse(storedVersions) : {};
      
      setState(prev => ({
        ...prev,
        funnels,
        versions,
        isLoading: false,
      }));
    } catch (error) {
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: 'Erro ao carregar funnels',
      }));
    }
  }, []);

  // Salvar funnels no localStorage
  const saveFunnels = useCallback((funnels: QuizFunnel[]) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(funnels));
    } catch (error) {
      console.error('Erro ao salvar funnels:', error);
    }
  }, []);

  // Salvar versões no localStorage
  const saveVersions = useCallback((versions: Record<string, QuizVersion[]>) => {
    try {
      localStorage.setItem(VERSIONS_STORAGE_KEY, JSON.stringify(versions));
    } catch (error) {
      console.error('Erro ao salvar versões:', error);
    }
  }, []);

  // Criar novo funil
  const createFunnel = useCallback((name: string, description: string) => {
    const newFunnel: QuizFunnel = {
      id: `funnel_${Date.now()}`,
      name,
      description,
      theme: {
        colors: {
          primary: '#b89b7a',
          secondary: '#432818',
          accent: '#d4c4a0',
          background: '#fefefe',
          text: '#432818',
          textSecondary: '#6b4f43',
          border: '#e5e7eb',
          success: '#059669',
          warning: '#dc2626',
        },
        typography: {
          fontFamily: 'Inter, sans-serif',
          fontDisplay: 'Playfair Display, serif',
          titleSize: '1.875rem',
          subtitleSize: '1.25rem',
          bodySize: '1rem',
          smallSize: '0.875rem',
        },
        layout: {
          borderRadius: '0.75rem',
          shadow: {
            subtle: '0 1px 3px rgba(0, 0, 0, 0.1)',
            medium: '0 4px 12px rgba(0, 0, 0, 0.15)',
            strong: '0 8px 24px rgba(0, 0, 0, 0.2)',
          },
          spacing: {
            compact: '0.5rem',
            normal: '1rem',
            spacious: '1.5rem',
          },
        },
        transitions: {
          fast: '150ms ease-in-out',
          normal: '300ms ease-in-out',
          slow: '500ms ease-in-out',
        },
      },
      config: {
        domain: '',
        seo: {
          title: '',
          description: '',
          keywords: '',
        },
        pixel: {
          facebookPixelId: '',
          googleAnalyticsId: '',
        },
        utm: {
          source: '',
          medium: '',
          campaign: '',
          content: '',
          term: '',
        },
        scoring: {
          normalQuestionPoints: 1,
          strategicQuestionPoints: 2,
          autoAdvanceNormal: false,
          autoAdvanceStrategic: true,
          normalSelectionLimit: 1,
          strategicSelectionLimit: 3,
        },
        results: {
          showUserName: true,
          showPrimaryStyle: true,
          showSecondaryStyles: true,
          showPercentages: true,
          showStyleImages: true,
          showStyleGuides: true,
        },
      },
      questions: [],
      results: [],
      intro: {
        title: 'Descubra Seu Estilo Único',
        subtitle: 'Quiz Personalizado',
        description: 'Descubra qual estilo combina mais com você através deste quiz personalizado.',
        buttonText: 'Começar Quiz',
      },
      createdAt: new Date(),
      updatedAt: new Date(),
      isActive: true,
      isDraft: true,
    };

    const updatedFunnels = [...state.funnels, newFunnel];
    setState(prev => ({
      ...prev,
      funnels: updatedFunnels,
      activeFunnelId: newFunnel.id,
    }));
    
    saveFunnels(updatedFunnels);
    return newFunnel;
  }, [state.funnels, saveFunnels]);

  // Atualizar funil
  const updateFunnel = useCallback((funnelId: string, updates: Partial<QuizFunnel>) => {
    const updatedFunnels = state.funnels.map(funnel =>
      funnel.id === funnelId
        ? { ...funnel, ...updates, updatedAt: new Date() }
        : funnel
    );
    
    setState(prev => ({
      ...prev,
      funnels: updatedFunnels,
    }));
    
    saveFunnels(updatedFunnels);
  }, [state.funnels, saveFunnels]);

  // Duplicar funil
  const duplicateFunnel = useCallback((funnelId: string) => {
    const originalFunnel = state.funnels.find(f => f.id === funnelId);
    if (!originalFunnel) return null;

    const duplicatedFunnel: QuizFunnel = {
      ...originalFunnel,
      id: `funnel_${Date.now()}`,
      name: `${originalFunnel.name} (Cópia)`,
      createdAt: new Date(),
      updatedAt: new Date(),
      isDraft: true,
    };

    const updatedFunnels = [...state.funnels, duplicatedFunnel];
    setState(prev => ({
      ...prev,
      funnels: updatedFunnels,
      activeFunnelId: duplicatedFunnel.id,
    }));
    
    saveFunnels(updatedFunnels);
    return duplicatedFunnel;
  }, [state.funnels, saveFunnels]);

  // Deletar funil
  const deleteFunnel = useCallback(async (funnelId: string) => {
    try {
      await schemaDrivenFunnelService.deleteFunnel(funnelId);

      const updatedFunnels = state.funnels.filter(f => f.id !== funnelId);
      const updatedVersions = { ...state.versions };
      delete updatedVersions[funnelId];
      
      setState(prev => ({
        ...prev,
        funnels: updatedFunnels,
        versions: updatedVersions,
        activeFunnelId: prev.activeFunnelId === funnelId ? null : prev.activeFunnelId,
      }));
      
      saveFunnels(updatedFunnels);
      saveVersions(updatedVersions);

      toast({
        title: "Funil excluído!",
        description: "O funil foi removido com sucesso e salvo no backend.",
      });
    } catch (error) {
      console.error('❌ Erro ao excluir funil:', error);
      toast({
        title: "Erro ao excluir funil",
        description: error instanceof Error ? error.message : "Erro desconhecido ao excluir funil.",
        variant: "destructive",
      });
    }
  }, [state.funnels, state.versions, saveFunnels, saveVersions, toast]);

  // Selecionar funil ativo
  const setActiveFunnel = useCallback((funnelId: string | null) => {
    setState(prev => ({
      ...prev,
      activeFunnelId: funnelId,
      activeVersionId: null,
    }));
  }, []);

  // Obter funil ativo
  const getActiveFunnel = useCallback(() => {
    return state.funnels.find(f => f.id === state.activeFunnelId) || null;
  }, [state.funnels, state.activeFunnelId]);

  // Importar funil
  const importFunnel = useCallback((funnelData: Partial<QuizFunnel>) => {
    const importedFunnel: QuizFunnel = {
      id: `funnel_${Date.now()}`,
      name: funnelData.name || 'Funil Importado',
      description: funnelData.description || '',
      theme: funnelData.theme || state.funnels[0]?.theme,
      config: funnelData.config || state.funnels[0]?.config,
      questions: funnelData.questions || [],
      results: funnelData.results || [],
      intro: funnelData.intro || {
        title: 'Quiz Importado',
        subtitle: '',
        description: '',
        buttonText: 'Começar',
      },
      offer: funnelData.offer,
      createdAt: new Date(),
      updatedAt: new Date(),
      isActive: true,
      isDraft: true,
    };

    const updatedFunnels = [...state.funnels, importedFunnel];
    setState(prev => ({
      ...prev,
      funnels: updatedFunnels,
      activeFunnelId: importedFunnel.id,
    }));
    
    saveFunnels(updatedFunnels);
    return importedFunnel;
  }, [state.funnels, saveFunnels]);

  // Exportar funil
  const exportFunnel = useCallback((funnelId: string) => {
    const funnel = state.funnels.find(f => f.id === funnelId);
    if (!funnel) return null;

    const exportData = {
      ...funnel,
      exportedAt: new Date().toISOString(),
      version: '1.0',
    };

    return exportData;
  }, [state.funnels]);

  // Carregar funnels na inicialização
  useEffect(() => {
    loadFunnels();
  }, [loadFunnels]);

  return {
    ...state,
    createFunnel,
    updateFunnel,
    duplicateFunnel,
    deleteFunnel,
    setActiveFunnel,
    getActiveFunnel,
    importFunnel,
    exportFunnel,
    loadFunnels,
  };
};
