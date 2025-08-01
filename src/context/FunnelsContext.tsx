import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { QuizStep } from './StepsContext';
import { supabase } from '../integrations/supabase/client';
import { v4 as uuidv4 } from 'uuid';
import { toast } from '../components/ui/use-toast';

// Interface para um funil completo
export interface Funnel {
  id: string;
  name: string;
  description: string;
  steps: QuizStep[];
  isPublished: boolean;
  theme?: string;
  createdAt: string;
  updatedAt: string;
}

// Templates pré-definidos para funis
const FUNNEL_TEMPLATES = {
  'quiz-estilo': {
    name: 'Quiz de Estilo',
    description: 'Funil de quiz para descoberta de estilo pessoal',
    defaultSteps: [
      { id: 'etapa-1', name: 'Introdução e Nome', order: 1, blocksCount: 0, isActive: true, type: 'intro-with-name', description: 'Apresentação do Quiz de Estilo e coleta do nome' },
      // Adicione etapas pré-definidas conforme necessário
    ]
  },
  'quiz-personalidade': {
    name: 'Quiz de Personalidade',
    description: 'Funil de quiz para descoberta de personalidade',
    defaultSteps: [
      { id: 'etapa-1', name: 'Introdução', order: 1, blocksCount: 0, isActive: true, type: 'intro', description: 'Apresentação do Quiz de Personalidade' },
      { id: 'etapa-2', name: 'Coleta de Nome', order: 2, blocksCount: 0, isActive: false, type: 'name-input', description: 'Captura do nome do participante' },
      // Adicione etapas pré-definidas conforme necessário
    ]
  },
  'quiz-vazio': {
    name: 'Quiz Vazio',
    description: 'Funil de quiz sem etapas pré-definidas',
    defaultSteps: []
  }
};

// Modelo para um novo funil
const createEmptyFunnel = (name: string, templateId: string = 'quiz-vazio'): Funnel => {
  // Carrega template baseado no templateId ou usa template vazio
  const template = FUNNEL_TEMPLATES[templateId] || FUNNEL_TEMPLATES['quiz-vazio'];
  
  return {
    id: `funnel-${Date.now()}`,
    name: name || template.name,
    description: `Funil ${name || template.name}`,
    steps: [...template.defaultSteps], // Clone das etapas do template
    isPublished: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
};

// Interface para o contexto de funis
interface FunnelsContextType {
  funnels: Funnel[];
  activeFunnelId: string | null;
  setActiveFunnelId: (id: string | null) => void;
  addFunnel: (name: string, templateId?: string) => Promise<string>;
  updateFunnel: (funnelId: string, updates: Partial<Funnel>) => Promise<void>;
  deleteFunnel: (funnelId: string) => Promise<void>;
  duplicateFunnel: (funnelId: string, newName?: string) => Promise<string | null>;
  getFunnelById: (funnelId: string) => Funnel | undefined;
  getFunnelSteps: (funnelId: string) => QuizStep[];
  updateFunnelSteps: (funnelId: string, steps: QuizStep[]) => Promise<void>;
  isLoading: boolean;
}

// Criar o contexto
const FunnelsContext = createContext<FunnelsContextType | undefined>(undefined);

// Provider Component
export const FunnelsProvider: React.FC<{children: React.ReactNode}> = ({ children }) => {
  const [funnels, setFunnels] = useState<Funnel[]>([]);
  const [activeFunnelId, setActiveFunnelId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Carregar funis do Supabase
  useEffect(() => {
    const loadFunnels = async () => {
      setIsLoading(true);
      try {
        const { data, error } = await supabase
          .from('funnels')
          .select(`
            id, 
            name, 
            description, 
            is_published, 
            created_at, 
            updated_at,
            settings
          `)
          .order('created_at', { ascending: false });

        if (error) {
          throw error;
        }

        if (data && data.length > 0) {
          // Para cada funil, carregar suas etapas
          const funnelsWithSteps = await Promise.all(
            data.map(async (funnel) => {
              const { data: pagesData, error: pagesError } = await supabase
                .from('funnel_pages')
                .select('*')
                .eq('funnel_id', funnel.id)
                .order('page_order', { ascending: true });

              if (pagesError) {
                console.error('Erro ao carregar páginas do funil:', pagesError);
                return {
                  id: funnel.id,
                  name: funnel.name,
                  description: funnel.description || '',
                  steps: [],
                  isPublished: funnel.is_published || false,
                  theme: funnel.settings ? (funnel.settings as any).theme : undefined,
                  createdAt: funnel.created_at || new Date().toISOString(),
                  updatedAt: funnel.updated_at || new Date().toISOString()
                };
              }

              // Converter páginas em etapas
              const steps: QuizStep[] = pagesData?.map(page => ({
                id: page.id,
                name: page.title || `Etapa ${page.page_order}`,
                order: page.page_order,
                blocksCount: Array.isArray(page.blocks) ? page.blocks.length : 0,
                isActive: page.page_order === 1,
                type: page.page_type as any,
                description: page.metadata ? (page.metadata as any).description || '' : ''
              })) || [];

              return {
                id: funnel.id,
                name: funnel.name,
                description: funnel.description || '',
                steps,
                isPublished: funnel.is_published || false,
                theme: funnel.settings ? (funnel.settings as any).theme : undefined,
                createdAt: funnel.created_at || new Date().toISOString(),
                updatedAt: funnel.updated_at || new Date().toISOString()
              };
            })
          );

          setFunnels(funnelsWithSteps);
          // Definir o primeiro funil como ativo se não houver nenhum
          if (!activeFunnelId && funnelsWithSteps.length > 0) {
            setActiveFunnelId(funnelsWithSteps[0].id);
          }
        } else {
          // Se não houver funis, criar um padrão
          const defaultFunnelId = await addFunnel('Quiz de Estilo');
          setActiveFunnelId(defaultFunnelId);
        }
      } catch (error) {
        console.error('Erro ao carregar funis do Supabase:', error);
        toast({
          title: 'Erro ao carregar funis',
          description: 'Não foi possível carregar os funis do banco de dados.',
          variant: 'destructive'
        });
        
        // Carregar do localStorage como fallback
        const savedFunnels = localStorage.getItem('quiz-funnels');
        if (savedFunnels) {
          const parsedFunnels = JSON.parse(savedFunnels);
          setFunnels(parsedFunnels);
          if (!activeFunnelId && parsedFunnels.length > 0) {
            setActiveFunnelId(parsedFunnels[0].id);
          }
        } else {
          const defaultFunnel = createEmptyFunnel('Quiz de Estilo');
          setFunnels([defaultFunnel]);
          setActiveFunnelId(defaultFunnel.id);
        }
      } finally {
        setIsLoading(false);
      }
    };

    loadFunnels();
  }, []);

  // Adicionar novo funil
  const addFunnel = useCallback(async (name: string, templateId?: string): Promise<string> => {
    const template = FUNNEL_TEMPLATES[templateId || 'quiz-vazio'] || FUNNEL_TEMPLATES['quiz-vazio'];
    const newFunnelId = uuidv4();
    const now = new Date().toISOString();
    
    try {
      // Inserir o novo funil no Supabase
      const { error: funnelError } = await supabase
        .from('funnels')
        .insert({
          id: newFunnelId,
          name: name || template.name,
          description: `Funil ${name || template.name}`,
          is_published: false,
          settings: { theme: 'default' },
          created_at: now,
          updated_at: now
        });

      if (funnelError) {
        throw funnelError;
      }

      // Inserir etapas do template
      const pages = template.defaultSteps.map(step => ({
        id: uuidv4(),
        funnel_id: newFunnelId,
        title: step.name,
        page_order: step.order,
        page_type: step.type,
        blocks: [],
        metadata: { 
          description: step.description,
          multiSelect: step.multiSelect
        },
        created_at: now,
        updated_at: now
      }));

      if (pages.length > 0) {
        const { error: pagesError } = await supabase
          .from('funnel_pages')
          .insert(pages);

        if (pagesError) {
          console.error('Erro ao inserir páginas:', pagesError);
          // Continuar mesmo com erro nas páginas
        }
      }

      // Adicionar ao estado local
      const newFunnel: Funnel = {
        id: newFunnelId,
        name: name || template.name,
        description: `Funil ${name || template.name}`,
        steps: template.defaultSteps,
        isPublished: false,
        theme: 'default',
        createdAt: now,
        updatedAt: now
      };

      setFunnels(prev => [...prev, newFunnel]);
      return newFunnelId;
    } catch (error) {
      console.error('Erro ao adicionar funil:', error);
      toast({
        title: 'Erro ao criar funil',
        description: 'Não foi possível criar um novo funil.',
        variant: 'destructive'
      });
      
      // Criar localmente como fallback
      const newFunnel = createEmptyFunnel(name, templateId);
      setFunnels(prev => [...prev, newFunnel]);
      return newFunnel.id;
    }
  }, []);

  // Atualizar funil
  const updateFunnel = useCallback(async (funnelId: string, updates: Partial<Funnel>) => {
    try {
      const now = new Date().toISOString();
      
      // Preparar dados para o Supabase
      const supabaseUpdates = {
        name: updates.name,
        description: updates.description,
        is_published: updates.isPublished,
        settings: updates.theme ? { theme: updates.theme } : undefined,
        updated_at: now
      };

      // Remover propriedades undefined
      Object.keys(supabaseUpdates).forEach(key => 
        supabaseUpdates[key] === undefined && delete supabaseUpdates[key]
      );

      // Atualizar no Supabase
      const { error } = await supabase
        .from('funnels')
        .update(supabaseUpdates)
        .eq('id', funnelId);

      if (error) {
        throw error;
      }

      // Atualizar etapas se fornecidas
      if (updates.steps) {
        await updateFunnelSteps(funnelId, updates.steps);
      }

      // Atualizar estado local
      setFunnels(prev => prev.map(funnel => 
        funnel.id === funnelId 
          ? { 
              ...funnel, 
              ...updates, 
              updatedAt: now 
            } 
          : funnel
      ));
    } catch (error) {
      console.error('Erro ao atualizar funil:', error);
      toast({
        title: 'Erro ao atualizar funil',
        description: 'Não foi possível atualizar o funil no banco de dados.',
        variant: 'destructive'
      });
      
      // Atualizar localmente como fallback
      setFunnels(prev => prev.map(funnel => 
        funnel.id === funnelId 
          ? { 
              ...funnel, 
              ...updates, 
              updatedAt: new Date().toISOString() 
            } 
          : funnel
      ));
    }
  }, []);

  // Excluir funil
  const deleteFunnel = useCallback(async (funnelId: string) => {
    if (funnels.length <= 1) {
      toast({
        title: 'Operação não permitida',
        description: 'Não é possível excluir o último funil',
        variant: 'destructive'
      });
      return;
    }
    
    try {
      // Excluir etapas do funil primeiro
      const { error: pagesError } = await supabase
        .from('funnel_pages')
        .delete()
        .eq('funnel_id', funnelId);

      if (pagesError) {
        console.error('Erro ao excluir páginas do funil:', pagesError);
        // Continuar mesmo com erro
      }
      
      // Excluir o funil
      const { error } = await supabase
        .from('funnels')
        .delete()
        .eq('id', funnelId);

      if (error) {
        throw error;
      }

      // Atualizar estado local
      setFunnels(prev => prev.filter(funnel => funnel.id !== funnelId));
      
      // Se o funil ativo foi excluído, selecionar outro
      if (activeFunnelId === funnelId) {
        const remainingFunnels = funnels.filter(funnel => funnel.id !== funnelId);
        if (remainingFunnels.length > 0) {
          setActiveFunnelId(remainingFunnels[0].id);
        } else {
          setActiveFunnelId(null);
        }
      }
    } catch (error) {
      console.error('Erro ao excluir funil:', error);
      toast({
        title: 'Erro ao excluir funil',
        description: 'Não foi possível excluir o funil do banco de dados.',
        variant: 'destructive'
      });
      
      // Excluir localmente como fallback
      setFunnels(prev => prev.filter(funnel => funnel.id !== funnelId));
      if (activeFunnelId === funnelId) {
        const remainingFunnels = funnels.filter(funnel => funnel.id !== funnelId);
        if (remainingFunnels.length > 0) {
          setActiveFunnelId(remainingFunnels[0].id);
        } else {
          setActiveFunnelId(null);
        }
      }
    }
  }, [funnels, activeFunnelId]);

  // Duplicar funil
  const duplicateFunnel = useCallback(async (funnelId: string, newName?: string): Promise<string | null> => {
    const funnelToDuplicate = funnels.find(funnel => funnel.id === funnelId);
    if (!funnelToDuplicate) {
      return null;
    }

    try {
      const newFunnelId = uuidv4();
      const now = new Date().toISOString();
      
      // Inserir o novo funil no Supabase
      const { error: funnelError } = await supabase
        .from('funnels')
        .insert({
          id: newFunnelId,
          name: newName || `${funnelToDuplicate.name} (cópia)`,
          description: funnelToDuplicate.description,
          is_published: false,
          settings: { theme: funnelToDuplicate.theme || 'default' },
          created_at: now,
          updated_at: now
        });

      if (funnelError) {
        throw funnelError;
      }

      // Carregar etapas do funil original
      const { data: originalPages, error: pagesError } = await supabase
        .from('funnel_pages')
        .select('*')
        .eq('funnel_id', funnelId)
        .order('page_order', { ascending: true });

      if (pagesError) {
        console.error('Erro ao carregar páginas do funil original:', pagesError);
        // Continuar mesmo com erro
      }

      // Duplicar etapas
      if (originalPages && originalPages.length > 0) {
        const newPages = originalPages.map(page => ({
          id: uuidv4(),
          funnel_id: newFunnelId,
          title: page.title,
          page_order: page.page_order,
          page_type: page.page_type,
          blocks: page.blocks,
          metadata: page.metadata,
          created_at: now,
          updated_at: now
        }));

        const { error: insertError } = await supabase
          .from('funnel_pages')
          .insert(newPages);

        if (insertError) {
          console.error('Erro ao inserir páginas duplicadas:', insertError);
          // Continuar mesmo com erro
        }
      }

      // Criar objeto de funil para o estado local
      const newFunnel: Funnel = {
        ...funnelToDuplicate,
        id: newFunnelId,
        name: newName || `${funnelToDuplicate.name} (cópia)`,
        isPublished: false,
        createdAt: now,
        updatedAt: now
      };

      setFunnels(prev => [...prev, newFunnel]);
      return newFunnelId;
    } catch (error) {
      console.error('Erro ao duplicar funil:', error);
      toast({
        title: 'Erro ao duplicar funil',
        description: 'Não foi possível duplicar o funil no banco de dados.',
        variant: 'destructive'
      });
      
      // Duplicar localmente como fallback
      const newFunnel: Funnel = {
        ...funnelToDuplicate,
        id: `funnel-${Date.now()}`,
        name: newName || `${funnelToDuplicate.name} (cópia)`,
        isPublished: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      setFunnels(prev => [...prev, newFunnel]);
      return newFunnel.id;
    }
  }, [funnels]);

  // Obter funil por ID
  const getFunnelById = useCallback((funnelId: string) => {
    return funnels.find(funnel => funnel.id === funnelId);
  }, [funnels]);

  // Obter etapas de um funil
  const getFunnelSteps = useCallback((funnelId: string): QuizStep[] => {
    const funnel = funnels.find(f => f.id === funnelId);
    return funnel?.steps || [];
  }, [funnels]);

  // Atualizar etapas de um funil
  const updateFunnelSteps = useCallback(async (funnelId: string, steps: QuizStep[]) => {
    try {
      const now = new Date().toISOString();
      
      // Carregar páginas existentes
      const { data: existingPages, error: loadError } = await supabase
        .from('funnel_pages')
        .select('id')
        .eq('funnel_id', funnelId);

      if (loadError) {
        throw loadError;
      }

      // Mapeamento de etapas para páginas do Supabase
      const existingIds = existingPages?.map(page => page.id) || [];
      const updates: any[] = [];
      const inserts: any[] = [];
      const deleteIds = [...existingIds];

      for (const step of steps) {
        const pageData = {
          title: step.name,
          page_order: step.order,
          page_type: step.type,
          metadata: {
            description: step.description,
            multiSelect: step.multiSelect
          },
          updated_at: now
        };

        if (existingIds.includes(step.id)) {
          // Atualizar página existente
          updates.push({
            id: step.id,
            ...pageData
          });
          
          // Remover do array de IDs a excluir
          const index = deleteIds.indexOf(step.id);
          if (index > -1) {
            deleteIds.splice(index, 1);
          }
        } else {
          // Inserir nova página
          inserts.push({
            id: step.id,
            funnel_id: funnelId,
            ...pageData,
            blocks: [],
            created_at: now
          });
        }
      }

      // Executar operações no Supabase em paralelo
      const operations: Promise<any>[] = [];

      // 1. Inserir novas páginas
      if (inserts.length > 0) {
        operations.push(
          supabase
            .from('funnel_pages')
            .insert(inserts)
            .then(({ error }) => {
              if (error) console.error('Erro ao inserir páginas:', error);
              return null;
            }) as Promise<any>
        );
      }

      // 2. Atualizar páginas existentes
      for (const update of updates) {
        operations.push(
          supabase
            .from('funnel_pages')
            .update(update)
            .eq('id', update.id)
            .then(({ error }) => {
              if (error) console.error(`Erro ao atualizar página ${update.id}:`, error);
              return null;
            }) as Promise<any>
        );
      }

      // 3. Excluir páginas que não existem mais
      if (deleteIds.length > 0) {
        operations.push(
          supabase
            .from('funnel_pages')
            .delete()
            .in('id', deleteIds)
            .then(({ error }) => {
              if (error) console.error('Erro ao excluir páginas:', error);
              return null;
            }) as Promise<any>
        );
      }

      // Aguardar todas as operações
      await Promise.all(operations);

      // Atualizar estado local
      setFunnels(prev => prev.map(funnel => 
        funnel.id === funnelId 
          ? { 
              ...funnel, 
              steps, 
              updatedAt: now 
            } 
          : funnel
      ));
    } catch (error) {
      console.error('Erro ao atualizar etapas do funil:', error);
      toast({
        title: 'Erro ao atualizar etapas',
        description: 'Não foi possível atualizar as etapas do funil no banco de dados.',
        variant: 'destructive'
      });
      
      // Atualizar localmente como fallback
      setFunnels(prev => prev.map(funnel => 
        funnel.id === funnelId 
          ? { 
              ...funnel, 
              steps, 
              updatedAt: new Date().toISOString() 
            } 
          : funnel
      ));
    }
  }, []);

  return (
    <FunnelsContext.Provider 
      value={{ 
        funnels, 
        activeFunnelId, 
        setActiveFunnelId,
        addFunnel,
        updateFunnel,
        deleteFunnel,
        duplicateFunnel,
        getFunnelById,
        getFunnelSteps,
        updateFunnelSteps,
        isLoading
      }}
    >
      {children}
    </FunnelsContext.Provider>
  );
};

// Hook para usar o contexto
export const useFunnels = () => {
  const context = useContext(FunnelsContext);
  if (context === undefined) {
    throw new Error('useFunnels must be used within a FunnelsProvider');
  }
  return context;
};
