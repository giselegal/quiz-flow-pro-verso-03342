// Serviço de API (HTTP) para funis. O serviço local (localStorage) foi movido para
// src/services/funnelLocalStore.ts para evitar conflitos de nome e responsabilidades.

import type {
  Funnel,
  InsertFunnel,
  FunnelPage,
  InsertFunnelPage,
  FunnelVersion,
} from '@/types/unified-schema';

// Additional interfaces for backward compatibility
interface InsertFunnelVersion extends Omit<FunnelVersion, 'id'> {}

export interface FunnelData {
  id: string;
  name: string;
  description?: string;
  pages: PageData[];
  config?: {
    name?: string;
    description?: string;
    isPublished?: boolean;
    theme?: string;
  };
  settings?: {
    theme?: string;
    primaryColor?: string;
    abTesting?: {
      enabled: boolean;
      variants: string[];
    };
    analytics?: {
      trackingId?: string;
      events?: string[];
    };
  };
}

export interface PageData {
  id: string;
  type: string;
  name?: string; // Adicionando propriedade name
  title?: string;
  order?: number; // Tornando opcional para compatibilidade
  blocks: BlockData[];
  metadata?: any;
  settings?: any; // Adicionando para compatibilidade
}

export interface BlockData {
  id: string;
  type: string;
  content?: any; // Tornando opcional para compatibilidade
  styles?: any;
  position?: {
    x: number;
    y: number;
  };
  // Compatibilidade com editor atual
  order?: number;
  settings?: any;
  style?: any;
}

class FunnelService {
  private baseUrl = 'http://localhost:3001/api';

  // Funnel operations
  async createFunnel(data: Omit<InsertFunnel, 'userId'> & { userId?: number }): Promise<Funnel> {
    const response = await fetch(`${this.baseUrl}/funnels`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error('Failed to create funnel');
    }

    const result = await response.json();
    return result.data;
  }

  async getFunnelsByUserId(userId: number): Promise<Funnel[]> {
    const response = await fetch(`${this.baseUrl}/funnels/user/${userId}`);

    if (!response.ok) {
      throw new Error('Failed to fetch funnels');
    }

    const result = await response.json();
    return result.data;
  }

  async getFunnelById(id: string): Promise<Funnel | null> {
    const response = await fetch(`${this.baseUrl}/funnels/${id}`);

    if (!response.ok) {
      if (response.status === 404) {
        return null;
      }
      throw new Error('Failed to fetch funnel');
    }

    const result = await response.json();
    return result.data;
  }

  async updateFunnel(id: string, updates: Partial<InsertFunnel>): Promise<Funnel> {
    const response = await fetch(`${this.baseUrl}/funnels/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updates),
    });

    if (!response.ok) {
      throw new Error('Failed to update funnel');
    }

    const result = await response.json();
    return result.data;
  }

  async deleteFunnel(id: string): Promise<void> {
    const response = await fetch(`${this.baseUrl}/funnels/${id}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      throw new Error('Failed to delete funnel');
    }
  }

  // Funnel pages operations
  async createFunnelPage(data: InsertFunnelPage): Promise<FunnelPage> {
    const response = await fetch(`${this.baseUrl}/funnel-pages`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error('Failed to create funnel page');
    }

    const result = await response.json();
    return result.data;
  }

  async getFunnelPages(funnelId: string): Promise<FunnelPage[]> {
    const response = await fetch(`${this.baseUrl}/funnel-pages/funnel/${funnelId}`);

    if (!response.ok) {
      throw new Error('Failed to fetch funnel pages');
    }

    const result = await response.json();
    return result.data;
  }

  async updateFunnelPage(id: string, updates: Partial<InsertFunnelPage>): Promise<FunnelPage> {
    const response = await fetch(`${this.baseUrl}/funnel-pages/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        // alinhar nomes snake_case conforme schema
        page_type: (updates as any)?.page_type ?? (updates as any)?.pageType,
        page_order: (updates as any)?.page_order ?? (updates as any)?.pageOrder,
        title: updates.title,
        blocks: (updates as any)?.blocks as any,
        metadata: (updates as any)?.metadata as any,
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to update funnel page');
    }

    const result = await response.json();
    return result.data;
  }

  async deleteFunnelPage(id: string): Promise<void> {
    const response = await fetch(`${this.baseUrl}/funnel-pages/${id}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      throw new Error('Failed to delete funnel page');
    }
  }

  // Funnel versions operations
  async createFunnelVersion(data: InsertFunnelVersion): Promise<FunnelVersion> {
    const response = await fetch(`${this.baseUrl}/funnel-versions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error('Failed to create funnel version');
    }

    const result = await response.json();
    return result.data;
  }

  async getFunnelVersions(funnelId: string): Promise<FunnelVersion[]> {
    const response = await fetch(`${this.baseUrl}/funnel-versions/funnel/${funnelId}`);

    if (!response.ok) {
      throw new Error('Failed to fetch funnel versions');
    }

    const result = await response.json();
    return result.data;
  }

  /**
   * Salvar configuração de página específica
   */
  async savePageConfig(pageId: string, config: any): Promise<boolean> {
    try {
      const response = await fetch(`${this.baseUrl}/page-configs/${pageId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(config),
      });

      if (!response.ok) {
        throw new Error('Failed to save page config');
      }

      return true;
    } catch (error) {
      console.error('Error saving page config:', error);

      // Fallback para localStorage
      try {
        localStorage.setItem(`page-config-${pageId}`, JSON.stringify(config));
        return true;
      } catch (localError) {
        console.error('Failed to save to localStorage:', localError);
        return false;
      }
    }
  }

  /**
   * Buscar configuração de página específica
   */
  async getPageConfig(pageId: string): Promise<any | null> {
    try {
      const response = await fetch(`${this.baseUrl}/page-configs/${pageId}`);

      if (!response.ok) {
        if (response.status === 404) {
          // Tentar localStorage como fallback
          const localConfig = localStorage.getItem(`page-config-${pageId}`);
          return localConfig ? JSON.parse(localConfig) : null;
        }
        throw new Error('Failed to fetch page config');
      }

      const result = await response.json();
      return result.data;
    } catch (error) {
      console.error('Error fetching page config:', error);

      // Fallback para localStorage
      try {
        const localConfig = localStorage.getItem(`page-config-${pageId}`);
        return localConfig ? JSON.parse(localConfig) : null;
      } catch (localError) {
        console.error('Failed to read from localStorage:', localError);
        return null;
      }
    }
  }

  /**
   * Sincronizar dados do funil com configurações de página
   */
  async syncFunnelToPageConfigs(funnelData: FunnelData): Promise<boolean> {
    try {
      const syncPromises = funnelData.pages.map(async page => {
        const pageConfig = {
          pageId: page.id,
          pageName: page.name || page.title || 'Página sem nome',
          blocks: page.blocks || [],
          styles: {
            backgroundColor: page.settings?.backgroundColor || '#ffffff',
            textColor: page.settings?.textColor || '#000000',
            fontFamily: page.settings?.fontFamily || 'Arial, sans-serif',
            customCSS: page.settings?.customCSS || '',
          },
          metadata: {
            title: page.title || '',
            description: page.metadata?.description || '',
            keywords: page.metadata?.keywords || [],
            ogImage: page.metadata?.ogImage || '',
          },
          settings: page.settings || {},
          lastModified: new Date().toISOString(),
          version: 1,
        };

        return this.savePageConfig(page.id, pageConfig);
      });

      const results = await Promise.all(syncPromises);
      return results.every(result => result === true);
    } catch (error) {
      console.error('Error syncing funnel to page configs:', error);
      return false;
    }
  }

  /**
   * Sincronizar blocos de quiz específicos
   */
  async syncQuizBlocks(funnelData: FunnelData): Promise<boolean> {
    try {
      // Encontrar páginas de quiz (etapas 1-19)
      const quizPages = funnelData.pages.filter(
        page =>
          page.type === 'question' ||
          page.type === 'intro' ||
          page.type === 'main-transition' ||
          page.type === 'strategic'
      );

      const syncPromises = quizPages.map(async page => {
        // Configuração específica para páginas de quiz
        const quizPageConfig = {
          pageId: page.id,
          pageName: page.title || `Etapa ${page.order || 1}`,
          blocks: page.blocks.map(block => ({
            ...block,
            // Mapear tipos específicos para componentes reutilizáveis
            componentType: this.mapBlockTypeToComponent(block.type),
            props: this.extractBlockProps(block),
            editable: true,
          })),
          styles: {
            backgroundColor: page.settings?.backgroundColor || '#FFFBF7',
            textColor: page.settings?.textColor || '#432818',
            fontFamily: page.settings?.fontFamily || 'Inter, sans-serif',
            customCSS: page.settings?.customCSS || '',
          },
          metadata: {
            title: page.title || '',
            description: `Etapa ${page.order || 1} do quiz`,
            type: 'quiz-step',
            stepNumber: page.order || 1,
            totalSteps: quizPages.length,
          },
          settings: {
            ...page.settings,
            isQuizPage: true,
            allowNavigation: true,
            showProgress: true,
          },
          lastModified: new Date().toISOString(),
          version: 1,
        };

        return this.savePageConfig(page.id, quizPageConfig);
      });

      const results = await Promise.all(syncPromises);
      return results.every(result => result === true);
    } catch (error) {
      console.error('Error syncing quiz blocks:', error);
      return false;
    }
  }

  /**
   * Mapear tipos de bloco para componentes reutilizáveis
   */
  private mapBlockTypeToComponent(blockType: string): string {
    const mapping: Record<string, string> = {
      'question-multiple': 'QuizQuestionBlock',
      'question-strategic': 'QuizQuestionBlock',
      'progress-indicator': 'QuizProgressBlock',
      navigation: 'QuizNavigationBlock',
      'main-transition': 'QuizTransitionBlock',
      'final-transition': 'QuizTransitionBlock',
      'loading-animation': 'QuizTransitionBlock',
      header: 'HeaderBlock',
      text: 'TextBlock',
      image: 'ImageBlock',
      button: 'ButtonBlock',
    };

    return mapping[blockType] || blockType;
  }

  /**
   * Extrair props editáveis de um bloco
   */
  private extractBlockProps(block: BlockData): Record<string, any> {
    const baseProps = {
      ...block.settings,
      ...block.content,
      blockId: block.id,
      blockType: block.type,
    };

    // Props específicas por tipo de bloco
    switch (block.type) {
      case 'question-multiple':
      case 'question-strategic':
        return {
          ...baseProps,
          question: block.settings?.question || 'Pergunta não definida',
          options: block.settings?.options || [],
          multipleSelection: block.settings?.multipleSelection || false,
          maxSelections: block.settings?.maxSelections || 1,
          required: block.settings?.required || false,
          showImages: block.settings?.showImages !== false,
        };

      case 'progress-indicator':
        return {
          ...baseProps,
          currentQuestion: block.settings?.currentQuestion || 1,
          totalQuestions: block.settings?.totalQuestions || 10,
          showPercentage: block.settings?.showPercentage !== false,
          showNumbers: block.settings?.showNumbers !== false,
          progressBarStyle: block.settings?.progressBarStyle || 'linear',
        };

      case 'main-transition':
      case 'final-transition':
        return {
          ...baseProps,
          title: block.settings?.title || 'Transição',
          message: block.settings?.message || 'Processando...',
          showAnimation: block.settings?.showAnimation !== false,
          animationType: block.settings?.animationType || 'celebration',
          autoAdvance: block.settings?.autoAdvance || false,
        };

      default:
        return baseProps;
    }
  }

  // High-level operations
  async saveFunnelData(funnelData: FunnelData, userId?: number): Promise<Funnel> {
    // Check if funnel exists
    let funnel = await this.getFunnelById(funnelData.id);

    if (!funnel) {
      // Create new funnel
      funnel = await this.createFunnel({
        name: funnelData.name,
        description: funnelData.description,
        userId: userId || undefined,
        settings: funnelData.settings || null,
      });
    } else {
      // Update existing funnel
      funnel = await this.updateFunnel(funnel.id, {
        name: funnelData.name,
        description: funnelData.description,
        settings: funnelData.settings || null,
      });
    }

    // Save pages
    const existingPages = await this.getFunnelPages(funnel.id);

    // Delete pages that no longer exist
    for (const existingPage of existingPages) {
      if (!funnelData.pages.find(p => p.id === existingPage.id)) {
        await this.deleteFunnelPage(existingPage.id);
      }
    }

    // Create or update pages
    for (const pageData of funnelData.pages) {
      const existingPage = existingPages.find(p => p.id === pageData.id);

      if (existingPage) {
        await this.updateFunnelPage(existingPage.id, {
          pageType: pageData.type,
          pageOrder: pageData.order,
          title: pageData.title || undefined,
          blocks: pageData.blocks,
          metadata: pageData.metadata || undefined,
        });
      } else {
        await this.createFunnelPage({
          funnel_id: funnel.id,
          name: pageData.title || `Page ${pageData.order}`,
          path: `/page-${pageData.order}`,
          pageType: pageData.type,
          pageOrder: pageData.order || 0,
          title: pageData.title || undefined,
          blocks: pageData.blocks,
          metadata: pageData.metadata || undefined,
        });
      }
    }

  // Versioning desabilitado por enquanto (alinhamento de tipos)

    return funnel;
  }

  async loadFunnelData(funnelId: string): Promise<FunnelData | null> {
    const funnel = await this.getFunnelById(funnelId);
    if (!funnel) return null;

    const pages = await this.getFunnelPages(funnelId);

    return {
      id: funnel.id,
      name: funnel.name,
      description: funnel.description || undefined,
      pages: pages.map(page => ({
        id: page.id,
        type: (page as any).page_type || 'default',
        title: page.title || undefined,
        order: (page as any).page_order || 0,
        blocks: (page as any).blocks as unknown as BlockData[],
        metadata: (page as any).metadata || undefined,
      })),
      settings: (funnel.settings as any) || undefined,
    };
  }
}

export const funnelApiService = new FunnelService();
