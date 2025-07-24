import type { BlockData } from '@/components/editor/blocks';
import { REAL_QUIZ_QUESTIONS, STRATEGIC_QUESTIONS, TRANSITIONS } from '@/components/visual-editor/realQuizData';
import { QuizDataAdapter } from './quizDataAdapter';

// DEBUG: Verificar se os dados estão sendo importados corretamente
console.log('🔍 DEBUG - Dados importados:');
console.log('  REAL_QUIZ_QUESTIONS:', REAL_QUIZ_QUESTIONS?.length || 'UNDEFINED');
console.log('  STRATEGIC_QUESTIONS:', STRATEGIC_QUESTIONS?.length || 'UNDEFINED');
console.log('  TRANSITIONS:', TRANSITIONS ? 'OK' : 'UNDEFINED');

// Tipos para o sistema schema-driven
export interface SchemaDrivenFunnelData {
  id: string;
  name: string;
  description?: string;
  theme: string;
  isPublished: boolean;
  pages: SchemaDrivenPageData[];
  config: FunnelConfig;
  version: number;
  lastModified: Date;
  createdAt: Date;
  userId?: number;
}

export interface SchemaDrivenPageData {
  id: string;
  name: string;
  title: string;
  type: 'intro' | 'question' | 'result' | 'offer' | 'thank-you' | 'custom';
  order: number;
  blocks: BlockData[];
  settings: PageSettings;
  metadata?: Record<string, any>;
}

export interface PageSettings {
  showProgress: boolean;
  progressValue: number;
  backgroundColor: string;
  textColor: string;
  maxWidth: string;
  padding?: string;
  customCSS?: string;
}

export interface FunnelConfig {
  name: string;
  description?: string;
  isPublished: boolean;
  theme: string;
  primaryColor: string;
  secondaryColor: string;
  fontFamily: string;
  abTesting?: {
    enabled: boolean;
    variants: string[];
    currentVariant: string;
  };
  analytics?: {
    trackingId?: string;
    events: string[];
    conversionGoals: string[];
  };
  seo?: {
    title?: string;
    description?: string;
    keywords?: string[];
    ogImage?: string;
  };
}

export interface FunnelVersion {
  id: string;
  funnelId: string;
  version: number;
  data: SchemaDrivenFunnelData;
  createdAt: Date;
  description?: string;
  isAutoSave: boolean;
}

export interface AutoSaveState {
  isEnabled: boolean;
  interval: number; // em segundos
  lastSave: Date | null;
  pendingChanges: boolean;
  errorCount: number;
}

class SchemaDrivenFunnelService {
  private baseUrl = 'http://localhost:3001/api/schema-driven';
  private localStorageKey = 'schema-driven-funnel';
  private versionStorageKey = 'schema-driven-versions';
  private autoSaveInterval: NodeJS.Timeout | null = null;
  private autoSaveState: AutoSaveState = {
    isEnabled: true,
    interval: 10, // 10 segundos
    lastSave: null,
    pendingChanges: false,
    errorCount: 0
  };

  constructor() {
    // Limpeza imediata na inicialização
    this.performEmergencyCleanup();
  }

  // Auto-save management
  enableAutoSave(interval: number = 10) {
    this.autoSaveState.isEnabled = true;
    this.autoSaveState.interval = interval;
    // Limpeza inicial ao habilitar auto-save
    this.cleanupLocalStorage();
    this.startAutoSaveInterval();
  }

  disableAutoSave() {
    this.autoSaveState.isEnabled = false;
    if (this.autoSaveInterval) {
      clearInterval(this.autoSaveInterval);
      this.autoSaveInterval = null;
    }
  }

  private startAutoSaveInterval() {
    if (this.autoSaveInterval) {
      clearInterval(this.autoSaveInterval);
    }

    this.autoSaveInterval = setInterval(() => {
      if (this.autoSaveState.pendingChanges && this.autoSaveState.isEnabled) {
        this.performAutoSave();
      }
    }, this.autoSaveState.interval * 1000);
  }

  private async performAutoSave() {
    try {
      const localData = this.getLocalFunnel();
      if (localData) {
        await this.saveFunnel(localData, true);
        this.autoSaveState.pendingChanges = false;
        this.autoSaveState.lastSave = new Date();
        this.autoSaveState.errorCount = 0;
        console.log('🔄 Auto-save successful:', new Date().toLocaleTimeString());
      }
    } catch (error) {
      this.autoSaveState.errorCount++;
      console.error('❌ Auto-save failed:', error);
      
      // Se muitos erros, aumentar intervalo
      if (this.autoSaveState.errorCount > 3) {
        this.autoSaveState.interval = Math.min(this.autoSaveState.interval * 2, 60);
        this.startAutoSaveInterval();
      }
    }
  }

  markPendingChanges() {
    this.autoSaveState.pendingChanges = true;
  }

  getAutoSaveState(): AutoSaveState {
    return { ...this.autoSaveState };
  }

  // Local storage operations
  saveLocalFunnel(funnel: SchemaDrivenFunnelData): void {
    try {
      localStorage.setItem(this.localStorageKey, JSON.stringify({
        ...funnel,
        lastModified: new Date().toISOString()
      }));
      this.markPendingChanges();
      // console.log('💾 Funnel saved locally');
    } catch (error) {
      console.error('❌ Failed to save funnel locally:', error);
    }
  }

  getLocalFunnel(): SchemaDrivenFunnelData | null {
    try {
      const stored = localStorage.getItem(this.localStorageKey);
      if (stored) {
        const parsed = JSON.parse(stored);
        return {
          ...parsed,
          lastModified: new Date(parsed.lastModified),
          createdAt: new Date(parsed.createdAt)
        };
      }
      return null;
    } catch (error) {
      console.error('❌ Failed to load funnel from local storage:', error);
      return null;
    }
  }

  clearLocalFunnel(): void {
    localStorage.removeItem(this.localStorageKey);
    this.autoSaveState.pendingChanges = false;
  }

  // Limpeza preventiva do localStorage
  private cleanupLocalStorage(): void {
    try {
      // Remover versões antigas (mais de 7 dias)
      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - 7);
      
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key?.startsWith(this.versionStorageKey)) {
          try {
            const versions = JSON.parse(localStorage.getItem(key) || '[]');
            const recentVersions = versions.filter((v: any) => 
              new Date(v.createdAt) > cutoffDate
            ).slice(-5); // Manter apenas 5 versões recentes
            
            if (recentVersions.length === 0) {
              localStorage.removeItem(key);
            } else if (recentVersions.length !== versions.length) {
              localStorage.setItem(key, JSON.stringify(recentVersions));
            }
          } catch {
            localStorage.removeItem(key);
          }
        }
      }
    } catch (error) {
      console.warn('⚠️ Error during localStorage cleanup:', error);
    }
  }

  // Limpeza de emergência em caso de quota exceeded
  private emergencyCleanup(): void {
    try {
      console.log('🚨 Emergency cleanup initiated');
      
      // Remover todas as versões antigas
      const keysToRemove: string[] = [];
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key?.startsWith(this.versionStorageKey)) {
          keysToRemove.push(key);
        }
      }
      
      keysToRemove.forEach(key => {
        try {
          localStorage.removeItem(key);
        } catch {
          // Ignorar erros individuais
        }
      });
      
      console.log(`🧹 Removed ${keysToRemove.length} version history entries`);
    } catch (error) {
      console.error('❌ Emergency cleanup failed:', error);
    }
  }

  // Limpeza mais agressiva na inicialização
  private performEmergencyCleanup(): void {
    try {
      console.log('🧹 Performing initial localStorage cleanup...');
      let removed = 0;
      
      // Obter todas as chaves de uma vez para evitar problemas de índice
      const allKeys: string[] = [];
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key) allKeys.push(key);
      }
      
      // Remover todas as versões antigas
      allKeys.forEach(key => {
        if (key.startsWith(this.versionStorageKey)) {
          try {
            localStorage.removeItem(key);
            removed++;
          } catch {
            // Ignorar erros
          }
        }
      });
      
      if (removed > 0) {
        console.log(`🧹 Cleared ${removed} version entries from localStorage`);
      }
    } catch (error) {
      console.error('❌ Initial cleanup failed:', error);
    }
  }

  // Version management
  saveVersion(funnel: SchemaDrivenFunnelData, description?: string, isAutoSave: boolean = false): FunnelVersion {
    const version: FunnelVersion = {
      id: `version-${Date.now()}`,
      funnelId: funnel.id,
      version: funnel.version + 1,
      data: { ...funnel, version: funnel.version + 1 },
      createdAt: new Date(),
      description: description || (isAutoSave ? 'Auto-save' : 'Manual save'),
      isAutoSave
    };

    try {
      // Limpeza proativa do localStorage antes de salvar
      this.cleanupLocalStorage();
      
      const versions = this.getVersionHistory(funnel.id);
      versions.push(version);
      
      // Manter apenas as últimas 10 versões para economizar espaço
      const limitedVersions = versions.slice(-10);
      localStorage.setItem(`${this.versionStorageKey}-${funnel.id}`, JSON.stringify(limitedVersions));
      
      // console.log(`📋 Version ${version.version} saved`);
      return version;
    } catch (error) {
      if (error instanceof DOMException && error.name === 'QuotaExceededError') {
        console.warn('⚠️ LocalStorage quota exceeded, performing emergency cleanup');
        this.emergencyCleanup();
        // Tentar salvar novamente apenas a versão atual sem histórico
        try {
          localStorage.setItem(`${this.versionStorageKey}-${funnel.id}`, JSON.stringify([version]));
          console.log(`📋 Version ${version.version} saved after cleanup`);
        } catch (secondError) {
          console.error('❌ Failed to save even after cleanup:', secondError);
        }
      } else {
        console.error('❌ Failed to save version:', error);
      }
      return version;
    }
  }

  getVersionHistory(funnelId: string): FunnelVersion[] {
    try {
      const stored = localStorage.getItem(`${this.versionStorageKey}-${funnelId}`);
      if (stored) {
        const parsed = JSON.parse(stored);
        return parsed.map((v: any) => ({
          ...v,
          createdAt: new Date(v.createdAt),
          data: {
            ...v.data,
            lastModified: new Date(v.data.lastModified),
            createdAt: new Date(v.data.createdAt)
          }
        }));
      }
      return [];
    } catch (error) {
      console.error('❌ Failed to load version history:', error);
      return [];
    }
  }

  restoreVersion(funnelId: string, versionId: string): SchemaDrivenFunnelData | null {
    const versions = this.getVersionHistory(funnelId);
    const version = versions.find(v => v.id === versionId);
    
    if (version) {
      this.saveLocalFunnel(version.data);
      console.log(`🔄 Restored to version ${version.version}`);
      return version.data;
    }
    
    return null;
  }

  // Backend operations
  async saveFunnel(funnel: SchemaDrivenFunnelData, isAutoSave: boolean = false): Promise<SchemaDrivenFunnelData> {
    try {
      // Tentar salvar no backend primeiro
      const response = await fetch(`${this.baseUrl}/funnels/${funnel.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...funnel,
          lastModified: new Date().toISOString()
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const result = await response.json();
      const savedFunnel = {
        ...result.data,
        lastModified: new Date(result.data.lastModified),
        createdAt: new Date(result.data.createdAt)
      };

      // Salvar versão se sucesso no backend
      if (!isAutoSave) {
        this.saveVersion(savedFunnel, 'Manual save from backend');
      }

      // Atualizar localStorage com dados do backend
      this.saveLocalFunnel(savedFunnel);
      
      console.log('☁️ Funnel saved to backend successfully');
      return savedFunnel;

    } catch (error) {
      console.warn('⚠️ Backend unavailable, saving locally only:', error);
      
      // Fallback para localStorage
      const updatedFunnel = {
        ...funnel,
        lastModified: new Date(),
        version: funnel.version + (isAutoSave ? 0 : 1)
      };
      
      this.saveLocalFunnel(updatedFunnel);
      
      if (!isAutoSave) {
        this.saveVersion(updatedFunnel, 'Manual save (offline)');
      }
      
      return updatedFunnel;
    }
  }

  async loadFunnel(funnelId: string): Promise<SchemaDrivenFunnelData | null> {
    // Validar funnelId para evitar requisições inválidas
    if (!funnelId || typeof funnelId !== 'string' || funnelId === '[object Object]') {
      console.error('❌ Invalid funnelId provided to loadFunnel:', funnelId);
      return null;
    }

    try {
      // Tentar carregar do backend primeiro
      const response = await fetch(`${this.baseUrl}/funnels/${funnelId}`);
      
      if (response.ok) {
        const result = await response.json();
        const funnel = {
          ...result.data,
          lastModified: new Date(result.data.lastModified),
          createdAt: new Date(result.data.createdAt)
        };
        
        // Atualizar localStorage com dados mais recentes
        try {
          this.saveLocalFunnel(funnel);
        } catch (saveError) {
          console.warn('⚠️ Failed to save to localStorage, continuing without cache:', saveError);
        }
        console.log('☁️ Funnel loaded from backend');
        return funnel;
      }
    } catch (error) {
      console.warn('⚠️ Backend unavailable, trying local storage:', error);
    }

    // Fallback para localStorage
    const localFunnel = this.getLocalFunnel();
    if (localFunnel && localFunnel.id === funnelId) {
      console.log('💾 Funnel loaded from local storage');
      return localFunnel;
    }

    return null;
  }

  async createFunnel(data: Omit<SchemaDrivenFunnelData, 'id' | 'version' | 'lastModified' | 'createdAt'>): Promise<SchemaDrivenFunnelData> {
    const now = new Date();
    const funnel: SchemaDrivenFunnelData = {
      ...data,
      id: `funnel-${Date.now()}`,
      version: 1,
      lastModified: now,
      createdAt: now
    };

    try {
      // Tentar criar no backend
      const response = await fetch(`${this.baseUrl}/funnels`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(funnel),
      });

      if (response.ok) {
        const result = await response.json();
        const createdFunnel = {
          ...result.data,
          lastModified: new Date(result.data.lastModified),
          createdAt: new Date(result.data.createdAt)
        };
        
        this.saveLocalFunnel(createdFunnel);
        this.saveVersion(createdFunnel, 'Initial creation');
        console.log('☁️ Funnel created in backend');
        return createdFunnel;
      }
    } catch (error) {
      console.warn('⚠️ Backend unavailable, creating locally:', error);
    }

    // Fallback para criação local
    this.saveLocalFunnel(funnel);
    this.saveVersion(funnel, 'Initial creation (offline)');
    console.log('💾 Funnel created locally');
    return funnel;
  }

  async syncWithBackend(): Promise<{ success: boolean; message: string }> {
    try {
      const localFunnel = this.getLocalFunnel();
      if (!localFunnel) {
        return { success: false, message: 'No local funnel to sync' };
      }

      const savedFunnel = await this.saveFunnel(localFunnel);
      return { 
        success: true, 
        message: `Synced successfully. Backend version: ${savedFunnel.version}` 
      };
    } catch (error) {
      return { 
        success: false, 
        message: `Sync failed: ${error instanceof Error ? error.message : 'Unknown error'}` 
      };
    }
  }

  // Utility methods
  createDefaultFunnel(): SchemaDrivenFunnelData {
    const now = new Date();
    
    return {
      id: `funnel-${Date.now()}`,
      name: 'Quiz CaktoQuiz - Descubra Seu Estilo',
      description: 'Funil completo para descoberta do estilo pessoal - 21 etapas modulares',
      theme: 'caktoquiz',
      isPublished: false,
      pages: this.createModularPages(),
      config: {
        name: 'Quiz CaktoQuiz - Descubra Seu Estilo',
        description: 'Funil completo para descoberta do estilo pessoal - 21 etapas modulares',
        isPublished: false,
        theme: 'caktoquiz',
        primaryColor: '#B89B7A',
        secondaryColor: '#432818',
        fontFamily: 'Inter, sans-serif',
        analytics: {
          trackingId: 'FB_PIXEL_ID',
          events: ['page_view', 'quiz_start', 'quiz_complete', 'conversion'],
          conversionGoals: ['quiz_completion', 'purchase']
        },
        seo: {
          title: 'Descubra Seu Estilo Pessoal - Quiz CaktoQuiz',
          description: 'Descubra seu estilo pessoal em poucos minutos com nosso quiz especializado.',
          keywords: ['estilo pessoal', 'moda', 'quiz', 'consultoria']
        }
      },
      version: 1,
      lastModified: now,
      createdAt: now
    };
  }

  /**
   * Cria todas as 21 páginas usando APENAS componentes inline modulares ES7+
   * Arquitetura 100% modular com componentes independentes e responsivos
   */
  private createModularPages(): SchemaDrivenPageData[] {
    console.log('🏗️ [ES7+] Iniciando criação das 21 etapas modulares...');
    console.log('🔍 DEBUG: REAL_QUIZ_QUESTIONS length:', REAL_QUIZ_QUESTIONS?.length);
    console.log('🔍 DEBUG: STRATEGIC_QUESTIONS length:', STRATEGIC_QUESTIONS?.length);
    
    const pages: SchemaDrivenPageData[] = [];

    // ==========================================
    // ETAPA 1: INTRODUÇÃO (COLETA DO NOME)
    // ==========================================
    pages.push({
      id: 'etapa-1-intro',
      name: 'Introdução',
      title: 'Etapa 1: Introdução - Coleta do Nome',
      type: 'intro',
      order: 1,
      blocks: [
        {
          id: 'intro-header',
          type: 'quiz-intro-header',
          properties: {
            logoUrl: 'https://res.cloudinary.com/dqljyf76t/image/upload/v1744911572/LOGO_DA_MARCA_GISELE_r14oz2.webp',
            logoAlt: 'Logo Gisele Galvão',
            logoWidth: 96,
            logoHeight: 96,
            progressValue: 0,
            progressMax: 100,
            showBackButton: false
          }
        },
        {
          id: 'intro-decorative-spacer',
          type: 'spacer',
          properties: {
            height: 4,
            backgroundColor: '#B89B7A',
            marginTop: 0,
            marginBottom: 24
          }
        },
        {
          id: 'intro-main-heading',
          type: 'text-inline',
          properties: {
            content: '<span style="color: #B89B7A; font-weight: 700;">Chega</span> de um guarda-roupa lotado e da sensação de que nada combina com você.',
            fontSize: 'text-3xl',
            fontWeight: 'font-bold',
            textAlign: 'text-center',
            color: '#432818',
            marginBottom: 24
          }
        },
        {
          id: 'intro-hero-image',
          type: 'image-display-inline',
          properties: {
            src: 'https://res.cloudinary.com/dqljyf76t/image/upload/v1746838118/20250509_2137_Desordem_e_Reflex%C3%A3o_simple_compose_01jtvszf8sfaytz493z9f16rf2_z1c2up.webp',
            alt: 'Transforme seu guarda-roupa',
            width: 600,
            height: 400,
            className: 'object-cover w-full h-auto rounded-lg mx-auto'
          }
        },
        {
          id: 'intro-subtitle',
          type: 'text-inline',
          properties: {
            content: 'Em poucos minutos, descubra seu Estilo Predominante — e aprenda a montar looks que realmente refletem sua essência, com praticidade e confiança.',
            fontSize: 'text-lg',
            textAlign: 'text-center',
            color: '#432818',
            marginTop: 16,
            marginBottom: 32
          }
        },
        {
          id: 'intro-name-input',
          type: 'form-input',
          properties: {
            label: 'NOME',
            placeholder: 'Digite seu nome aqui...',
            required: true,
            inputType: 'text',
            helperText: '',
            name: 'userName'
          }
        },
        {
          id: 'intro-cta-button',
          type: 'button-inline',
          properties: {
            text: 'Quero Descobrir meu Estilo Agora!',
            variant: 'primary',
            size: 'large',
            fullWidth: true,
            backgroundColor: '#B89B7A',
            textColor: '#ffffff',
            requiresValidInput: true
          }
        }
      ],
      settings: {
        showProgress: false,
        progressValue: 0,
        backgroundColor: '#ffffff',
        textColor: '#432818',
        maxWidth: 'max-w-4xl',
        padding: 'p-6'
      }
    });

    // ==========================================
    // ETAPAS 2-11: QUESTÕES PRINCIPAIS (10 QUESTÕES)
    // Componentes: quiz-intro-header + heading-inline + text-inline + options-grid + button-inline
    // ==========================================
    REAL_QUIZ_QUESTIONS.forEach((questionData, index) => {
      console.log(`🎯 [ES7+] Criando questão ${index + 1}:`, questionData.question);
      const currentProgress = 5 + (index + 1) * 5; // 5%, 10%, 15%... até 55%
      
      pages.push({
        id: `etapa-${index + 2}-questao-${index + 1}`,
        name: `Questão ${index + 1}`,
        title: `Etapa ${index + 2}: ${questionData.question}`,
        type: 'question',
        order: index + 2,
        blocks: [
          // 1. Cabeçalho modular com logo e progresso
          {
            id: `question-${index + 1}-header`,
            type: 'quiz-intro-header',
            properties: {
              logoUrl: 'https://res.cloudinary.com/dqljyf76t/image/upload/v1744911572/LOGO_DA_MARCA_GISELE_r14oz2.webp',
              logoAlt: 'Logo Gisele Galvão',
              logoWidth: 96,
              logoHeight: 96,
              progressValue: currentProgress,
              progressMax: 100,
              showBackButton: true
            }
          },
          // 2. Título da questão (componente inline)
          {
            id: `question-${index + 1}-title`,
            type: 'heading-inline',
            properties: {
              content: questionData.question,
              level: 'h2',
              fontSize: 'text-2xl',
              fontWeight: 'font-bold',
              textAlign: 'text-center',
              color: '#432818',
              marginBottom: 8
            }
          },
          // 3. Indicador de progresso textual (componente inline)
          {
            id: `question-${index + 1}-progress-label`,
            type: 'text-inline',
            properties: {
              content: `Questão ${index + 1} de 10`,
              fontSize: 'text-sm',
              textAlign: 'text-center',
              color: '#6B7280',
              marginBottom: 24
            }
          },
          // 4. Grid de opções responsivo (máx 2 colunas)
          {
            id: `question-${index + 1}-options`,
            type: 'options-grid',
            properties: {
              options: questionData.options.map(opt => ({
                id: opt.id,
                text: opt.text,
                value: opt.value || opt.id,
                imageUrl: (opt as any).imageUrl || undefined,
                category: (opt as any).category || opt.value || opt.id
              })),
              columns: questionData.type === 'both' ? 2 : 1,
              showImages: questionData.type === 'both' || questionData.type === undefined,
              imageSize: 'large',
              multipleSelection: questionData.multipleSelection || false,
              maxSelections: questionData.maxSelections || 1,
              minSelections: 1,
              validationMessage: `Selecione ${questionData.maxSelections || 1} opç${(questionData.maxSelections || 1) > 1 ? 'ões' : 'ão'}`,
              gridGap: 16,
              responsiveColumns: true // Força máximo 2 colunas
            }
          },
          // 5. Botão continuar modular (componente inline)
          {
            id: `question-${index + 1}-continue`,
            type: 'button-inline',
            properties: {
              text: 'Continuar',
              variant: 'primary',
              size: 'large',
              fullWidth: true,
              backgroundColor: '#B89B7A',
              textColor: '#ffffff',
              disabled: true,
              requiresValidSelection: true
            }
          }
        ],
        settings: {
          showProgress: true,
          progressValue: currentProgress,
          backgroundColor: '#ffffff',
          textColor: '#432818',
          maxWidth: 'max-w-4xl',
          padding: 'p-6'
        }
      });
    });

    // ==========================================
    // ETAPA 12: TRANSIÇÃO PRINCIPAL
    // Componentes: quiz-intro-header + heading-inline + text-inline + progress-inline + button-inline
    // ==========================================
    pages.push({
      id: 'etapa-12-transicao-principal',
      name: 'Transição Principal',
      title: 'Etapa 12: Transição - Agora vamos conhecer você melhor',
      type: 'custom',
      order: 12,
      blocks: [
        // 1. Cabeçalho modular com logo e progresso
        {
          id: 'transition-main-header',
          type: 'quiz-intro-header',
          properties: {
            logoUrl: 'https://res.cloudinary.com/dqljyf76t/image/upload/v1744911572/LOGO_DA_MARCA_GISELE_r14oz2.webp',
            logoAlt: 'Logo Gisele Galvão',
            logoWidth: 96,
            logoHeight: 96,
            progressValue: 60,
            progressMax: 100,
            showBackButton: true
          }
        },
        // 2. Título da transição (componente inline)
        {
          id: 'transition-main-title',
          type: 'heading-inline',
          properties: {
            content: 'Agora vamos conhecer você melhor',
            level: 'h2',
            fontSize: 'text-2xl',
            fontWeight: 'font-bold',
            textAlign: 'text-center',
            color: '#432818',
            marginBottom: 16
          }
        },
        // 3. Texto motivacional (componente inline)
        {
          id: 'transition-motivation',
          type: 'text-inline',
          properties: {
            content: 'Suas escolhas até agora já revelam muito sobre seu estilo. Agora vamos aprofundar para criar um perfil ainda mais preciso.',
            fontSize: 'text-lg',
            textAlign: 'text-center',
            color: '#6B7280',
            marginBottom: 32
          }
        },
        // 4. Barra de progresso visual (componente inline)
        {
          id: 'transition-progress-bar',
          type: 'progress-inline',
          properties: {
            progressValue: 60,
            progressMax: 100,
            showPercentage: true,
            color: '#B89B7A',
            backgroundColor: '#F5F5F5',
            height: 8,
            marginBottom: 32
          }
        },
        // 5. Botão continuar (componente inline)
        {
          id: 'transition-continue',
          type: 'button-inline',
          properties: {
            text: 'Continuar Análise',
            variant: 'primary',
            size: 'large',
            fullWidth: true,
            backgroundColor: '#B89B7A',
            textColor: '#ffffff'
          }
        }
      ],
      settings: {
        showProgress: true,
        progressValue: 60,
        backgroundColor: '#ffffff',
        textColor: '#432818',
        maxWidth: 'max-w-4xl',
        padding: 'p-6'
      }
    });

    // ==========================================
    // ETAPAS 13-18: QUESTÕES ESTRATÉGICAS (6 QUESTÕES)
    // Componentes: quiz-intro-header + heading-inline + text-inline + options-grid + button-inline
    // ==========================================
    STRATEGIC_QUESTIONS.forEach((questionData, index) => {
      console.log(`🎯 [ES7+] Criando questão estratégica ${index + 1}:`, questionData.question);
      const currentProgress = 65 + (index * 5); // 65%, 70%, 75%... até 90%
      
      pages.push({
        id: `etapa-${index + 13}-estrategica-${index + 1}`,
        name: `Questão Estratégica ${index + 1}`,
        title: `Etapa ${index + 13}: ${questionData.question}`,
        type: 'question',
        order: index + 13,
        blocks: [
          // 1. Cabeçalho modular com logo e progresso
          {
            id: `strategic-${index + 1}-header`,
            type: 'quiz-intro-header',
            properties: {
              logoUrl: 'https://res.cloudinary.com/dqljyf76t/image/upload/v1744911572/LOGO_DA_MARCA_GISELE_r14oz2.webp',
              logoAlt: 'Logo Gisele Galvão',
              logoWidth: 96,
              logoHeight: 96,
              progressValue: currentProgress,
              progressMax: 100,
              showBackButton: true
            }
          },
          // 2. Título da questão estratégica (componente inline)
          {
            id: `strategic-${index + 1}-title`,
            type: 'heading-inline',
            properties: {
              content: questionData.question,
              level: 'h2',
              fontSize: 'text-2xl',
              fontWeight: 'font-bold',
              textAlign: 'text-center',
              color: '#432818',
              marginBottom: 8
            }
          },
          // 3. Indicador de progresso (componente inline)
          {
            id: `strategic-${index + 1}-progress-label`,
            type: 'text-inline',
            properties: {
              content: `Questão estratégica ${index + 1} de 6`,
              fontSize: 'text-sm',
              textAlign: 'text-center',
              color: '#6B7280',
              marginBottom: 24
            }
          },
          // 4. Grid de opções (estilo simplificado)
          {
            id: `strategic-${index + 1}-options`,
            type: 'options-grid',
            properties: {
              options: questionData.options.map(opt => ({
                id: opt.id,
                text: opt.text,
                value: opt.value || opt.id,
                category: (opt as any).category || opt.value || opt.id
              })),
              columns: 1,
              showImages: false,
              multipleSelection: false,
              maxSelections: 1,
              minSelections: 1,
              validationMessage: 'Selecione uma opção',
              gridGap: 12,
              responsiveColumns: true
            }
          },
          // 5. Botão continuar (componente inline)
          {
            id: `strategic-${index + 1}-continue`,
            type: 'button-inline',
            properties: {
              text: 'Continuar',
              variant: 'primary',
              size: 'large',
              fullWidth: true,
              backgroundColor: '#B89B7A',
              textColor: '#ffffff',
              disabled: true,
              requiresValidSelection: true
            }
          }
        ],
        settings: {
          showProgress: true,
          progressValue: currentProgress,
          backgroundColor: '#ffffff',
          textColor: '#432818',
          maxWidth: 'max-w-4xl',
          padding: 'p-6'
        }
      });
    });

    // ==========================================
    // ETAPA 19: TRANSIÇÃO FINAL 
    // Componentes: quiz-intro-header + heading-inline + progress-inline + text-inline + loading-animation + button-inline
    // ==========================================
    // ==========================================
    // ETAPA 19: TRANSIÇÃO FINAL 
    // Componentes: quiz-intro-header + heading-inline + progress-inline + text-inline + loading-animation + button-inline
    // ==========================================
    pages.push({
      id: 'etapa-19-transicao-final',
      name: 'Transição Final',
      title: 'Etapa 19: Preparando seu resultado personalizado',
      type: 'custom',
      order: 19,
      blocks: [
        // 1. Cabeçalho com progresso completo
        {
          id: 'final-transition-header',
          type: 'quiz-intro-header',
          properties: {
            logoUrl: 'https://res.cloudinary.com/dqljyf76t/image/upload/v1744911572/LOGO_DA_MARCA_GISELE_r14oz2.webp',
            logoAlt: 'Logo Gisele Galvão',
            logoWidth: 96,
            logoHeight: 96,
            progressValue: 95,
            progressMax: 100,
            showBackButton: false
          }
        },
        // 2. Título da transição final
        {
          id: 'final-transition-title',
          type: 'heading-inline',
          properties: {
            content: 'Analisando suas respostas...',
            level: 'h2',
            fontSize: 'text-2xl',
            fontWeight: 'font-bold',
            textAlign: 'text-center',
            color: '#432818',
            marginBottom: 16
          }
        },
        // 3. Barra de carregamento animada
        {
          id: 'final-transition-progress',
          type: 'progress-inline',
          properties: {
            progressValue: 95,
            progressMax: 100,
            showPercentage: true,
            animated: true,
            color: '#B89B7A',
            backgroundColor: '#F5F5F5',
            height: 12,
            marginBottom: 24
          }
        },
        // 4. Texto de aguardo
        {
          id: 'final-transition-message',
          type: 'text-inline',
          properties: {
            content: 'Estamos criando seu perfil personalizado baseado nas suas 18 respostas...',
            fontSize: 'text-lg',
            textAlign: 'text-center',
            color: '#6B7280',
            marginBottom: 32
          }
        },
        // 5. Loading animation placeholder
        {
          id: 'final-transition-loading',
          type: 'loading-animation',
          properties: {
            type: 'spinner',
            size: 'large',
            color: '#B89B7A',
            duration: 3000
          }
        },
        // 6. Botão que aparece após 3 segundos
        {
          id: 'final-transition-reveal',
          type: 'button-inline',
          properties: {
            text: 'Ver Meu Resultado Personalizado',
            variant: 'primary',
            size: 'large',
            fullWidth: true,
            backgroundColor: '#B89B7A',
            textColor: '#ffffff',
            delayShow: 3000 // Aparece após 3 segundos
          }
        }
      ],
      settings: {
        showProgress: true,
        progressValue: 95,
        backgroundColor: '#ffffff',
        textColor: '#432818',
        maxWidth: 'max-w-4xl',
        padding: 'p-6'
      }
    });

    // ==========================================
    // ETAPA 20: PÁGINA DE RESULTADO PERSONALIZADO
    // Componentes inline específicos para resultado
    // ==========================================
    pages.push({
      id: 'etapa-20-resultado',
      name: 'Resultado Personalizado',
      title: 'Etapa 20: Seu Estilo Predominante Identificado',
      type: 'result',
      order: 20,
      blocks: [
        // 1. Header de resultado com logo e nome do usuário
        {
          id: 'result-header-inline',
          type: 'result-header-inline',
          properties: {
            logoUrl: 'https://res.cloudinary.com/dqljyf76t/image/upload/v1744911572/LOGO_DA_MARCA_GISELE_r14oz2.webp',
            logoAlt: 'Logo Gisele Galvão',
            logoWidth: 96,
            logoHeight: 96,
            userName: 'dinamicUserName', // Será preenchido dinamicamente
            showProgress: false
          }
        },
        // 2. Card principal do resultado (85% match)
        {
          id: 'result-main-card',
          type: 'result-card-inline',
          properties: {
            title: 'Seu Estilo Predominante',
            styleName: 'dinamicStyleName', // Será preenchido dinamicamente
            percentage: 85,
            description: 'Baseado nas suas respostas, identificamos que você tem características predominantes do estilo...',
            imageUrl: 'https://res.cloudinary.com/dqljyf76t/image/upload/v1744735317/2_ziffwx.webp',
            showMatch: true,
            animateReveal: true
          }
        },
        // 3. Características do estilo (lista com ícones)
        {
          id: 'result-characteristics',
          type: 'text-inline',
          properties: {
            content: `
              <div class="characteristics-list">
                <h3 class="text-xl font-semibold mb-4 text-[#432818]">Suas principais características:</h3>
                <ul class="space-y-3">
                  <li class="flex items-center">
                    <span class="w-6 h-6 bg-[#B89B7A] rounded-full flex items-center justify-center text-white text-sm mr-3">✓</span>
                    Elegância natural e sofisticação
                  </li>
                  <li class="flex items-center">
                    <span class="w-6 h-6 bg-[#B89B7A] rounded-full flex items-center justify-center text-white text-sm mr-3">✓</span>
                    Preferência por peças atemporais
                  </li>
                  <li class="flex items-center">
                    <span class="w-6 h-6 bg-[#B89B7A] rounded-full flex items-center justify-center text-white text-sm mr-3">✓</span>
                    Valoriza qualidade sobre quantidade
                  </li>
                </ul>
              </div>
            `,
            fontSize: 'text-base',
            textAlign: 'text-left',
            color: '#432818',
            marginBottom: 32
          }
        },
        // 4. Imagem de transformação/guia
        {
          id: 'result-transformation-image',
          type: 'image-display-inline',
          properties: {
            src: 'https://res.cloudinary.com/dqljyf76t/image/upload/v1745071344/GUIA_NATURAL_fzp6fc.webp',
            alt: 'Guia de transformação do seu estilo',
            width: 600,
            height: 400,
            className: 'object-cover w-full h-auto rounded-lg mx-auto shadow-lg'
          }
        },
        // 5. Título dos estilos secundários
        {
          id: 'result-secondary-title',
          type: 'heading-inline',
          properties: {
            content: 'Seus Estilos Secundários',
            level: 'h3',
            fontSize: 'text-xl',
            fontWeight: 'font-semibold',
            textAlign: 'text-center',
            color: '#432818',
            marginTop: 32,
            marginBottom: 16
          }
        },
        // 6-8. Cards dos estilos secundários (3 cards)
        {
          id: 'result-secondary-1',
          type: 'style-card-inline',
          properties: {
            styleName: 'Moderno',
            percentage: 20,
            description: 'Traços modernos na sua personalidade',
            imageUrl: 'https://res.cloudinary.com/dqljyf76t/image/upload/v1744735317/3_moderno.webp',
            compact: true
          }
        },
        {
          id: 'result-secondary-2',
          type: 'style-card-inline',
          properties: {
            styleName: 'Casual',
            percentage: 15,
            description: 'Praticidade em situações do dia a dia',
            imageUrl: 'https://res.cloudinary.com/dqljyf76t/image/upload/v1744735317/4_casual.webp',
            compact: true
          }
        },
        {
          id: 'result-secondary-3',
          type: 'style-card-inline',
          properties: {
            styleName: 'Romântico',
            percentage: 10,
            description: 'Toques delicados e femininos',
            imageUrl: 'https://res.cloudinary.com/dqljyf76t/image/upload/v1744735317/5_romantico.webp',
            compact: true
          }
        },
        // 9. Motivação/transição para oferta
        {
          id: 'result-transition-text',
          type: 'text-inline',
          properties: {
            content: 'Agora que você conhece seu estilo predominante, é hora de aplicar esse conhecimento no seu guarda-roupa e criar looks que realmente refletem sua essência.',
            fontSize: 'text-lg',
            textAlign: 'text-center',
            color: '#432818',
            marginTop: 32,
            marginBottom: 24
          }
        },
        // 10. CTA principal
        {
          id: 'result-main-cta',
          type: 'button-inline',
          properties: {
            text: 'QUERO TRANSFORMAR MEU GUARDA-ROUPA AGORA',
            variant: 'primary',
            size: 'large',
            fullWidth: true,
            backgroundColor: '#B89B7A',
            textColor: '#ffffff',
            pulse: true // Animação de destaque
          }
        }
      ],
      settings: {
        showProgress: false,
        progressValue: 100,
        backgroundColor: '#ffffff',
        textColor: '#432818',
        maxWidth: 'max-w-4xl',
        padding: 'p-6'
      }
    });

    // ==========================================
    // ETAPA 21: PÁGINA DE OFERTA COMERCIAL
    // Componentes inline específicos para conversão
    // ==========================================
    pages.push({
      id: 'etapa-21-oferta',
      name: 'Oferta Especial',
      title: 'Etapa 21: Oferta Personalizada Para Você',
      type: 'offer',
      order: 21,
      blocks: [
        // 1. Título da oferta especial
        {
          id: 'offer-main-title',
          type: 'heading-inline',
          properties: {
            content: 'Oferta Especial Para Você!',
            level: 'h1',
            fontSize: 'text-3xl',
            fontWeight: 'font-bold',
            textAlign: 'text-center',
            color: '#432818',
            marginBottom: 16
          }
        },
        // 2. Subtítulo personalizado com estilo
        {
          id: 'offer-subtitle',
          type: 'text-inline',
          properties: {
            content: 'Como você tem o estilo <strong class="text-[#B89B7A]">ELEGANTE</strong> predominante, criei uma oferta especial para você transformar seu guarda-roupa.',
            fontSize: 'text-lg',
            textAlign: 'text-center',
            color: '#432818',
            marginBottom: 24
          }
        },
        // 3. Imagem do produto/guia
        {
          id: 'offer-product-image',
          type: 'image-display-inline',
          properties: {
            src: 'https://res.cloudinary.com/dqljyf76t/image/upload/v1745071344/GUIA_COMPLETO_PRODUTO.webp',
            alt: 'Guia Completo do Seu Estilo',
            width: 500,
            height: 400,
            className: 'object-cover w-full h-auto rounded-lg mx-auto shadow-xl'
          }
        },
        // 4. Timer de urgência (15 minutos)
        {
          id: 'offer-countdown',
          type: 'countdown-inline',
          properties: {
            title: 'Esta oferta expira em:',
            targetMinutes: 15,
            showLabels: true,
            urgencyColor: 'red',
            size: 'large',
            centerAlign: true,
            onExpire: 'redirect' // Redireciona quando expirar
          }
        },
        // 5. Bloco de preços com desconto
        {
          id: 'offer-pricing',
          type: 'quiz-offer-pricing-inline',
          properties: {
            originalPrice: 197,
            discountedPrice: 97,
            discountPercentage: 51,
            currency: 'BRL',
            installments: {
              number: 12,
              value: 8.83
            },
            features: [
              'Guia Completo do Seu Estilo (PDF)',
              'Análise Personalizada Detalhada',
              'Dicas de Combinações',
              'Lista de Compras Estratégicas',
              'Suporte por 30 dias'
            ],
            highlighted: true
          }
        },
        // 6. Lista de benefícios
        {
          id: 'offer-benefits-title',
          type: 'heading-inline',
          properties: {
            content: 'O que você vai receber:',
            level: 'h3',
            fontSize: 'text-xl',
            fontWeight: 'font-semibold',
            textAlign: 'text-center',
            color: '#432818',
            marginTop: 32,
            marginBottom: 16
          }
        },
        {
          id: 'offer-benefits-list',
          type: 'text-inline',
          properties: {
            content: `
              <div class="benefits-grid grid grid-cols-1 md:grid-cols-2 gap-4">
                <div class="benefit-item flex items-start p-4 bg-gray-50 rounded-lg">
                  <span class="text-2xl mr-3">📚</span>
                  <div>
                    <h4 class="font-semibold text-[#432818]">Guia Completo</h4>
                    <p class="text-sm text-gray-600">Manual com todas as dicas do seu estilo</p>
                  </div>
                </div>
                <div class="benefit-item flex items-start p-4 bg-gray-50 rounded-lg">
                  <span class="text-2xl mr-3">🎯</span>
                  <div>
                    <h4 class="font-semibold text-[#432818]">Análise Personalizada</h4>
                    <p class="text-sm text-gray-600">Baseada nas suas 18 respostas</p>
                  </div>
                </div>
                <div class="benefit-item flex items-start p-4 bg-gray-50 rounded-lg">
                  <span class="text-2xl mr-3">👗</span>
                  <div>
                    <h4 class="font-semibold text-[#432818]">Dicas de Looks</h4>
                    <p class="text-sm text-gray-600">Combinações práticas para o dia a dia</p>
                  </div>
                </div>
                <div class="benefit-item flex items-start p-4 bg-gray-50 rounded-lg">
                  <span class="text-2xl mr-3">📝</span>
                  <div>
                    <h4 class="font-semibold text-[#432818]">Lista de Compras</h4>
                    <p class="text-sm text-gray-600">Peças estratégicas para o seu estilo</p>
                  </div>
                </div>
              </div>
            `,
            fontSize: 'text-base',
            textAlign: 'text-left',
            color: '#432818',
            marginBottom: 32
          }
        },
        // 8. Depoimento/prova social
        {
          id: 'offer-testimonial',
          type: 'testimonial-card-inline',
          properties: {
            name: 'Ana Carolina',
            location: 'São Paulo, SP',
            text: 'Depois do quiz descobri que sou do estilo Elegante e o guia me ajudou a reorganizar todo meu guarda-roupa. Agora me visto com muito mais confiança!',
            rating: 5,
            avatar: 'https://res.cloudinary.com/dqljyf76t/image/upload/v1745071344/avatar-ana.webp',
            compact: false
          }
        },
        // 9. Badge de garantia
        {
          id: 'offer-guarantee',
          type: 'badge-inline',
          properties: {
            text: '7 DIAS DE GARANTIA',
            subtext: 'Se não gostar, devolvemos seu dinheiro',
            icon: 'shield',
            color: 'green',
            size: 'large',
            centered: true
          }
        },
        // 10. CTA principal
        {
          id: 'offer-main-cta',
          type: 'button-inline',
          properties: {
            text: 'QUERO MEU GUIA PERSONALIZADO',
            variant: 'primary',
            size: 'large',
            fullWidth: true,
            backgroundColor: '#B89B7A',
            textColor: '#ffffff',
            pulse: true,
            urgency: true // Estilo de urgência
          }
        },
        // 11. Informações de segurança
        {
          id: 'offer-security-info',
          type: 'text-inline',
          properties: {
            content: `
              <div class="security-info text-center">
                <div class="flex items-center justify-center space-x-4 mb-2">
                  <span class="text-green-600">🔒</span>
                  <span class="text-sm font-medium">Compra 100% Segura</span>
                  <span class="text-green-600">✓</span>
                </div>
                <p class="text-xs text-gray-500">
                  Aceitamos PIX, Cartão de Crédito e Boleto<br>
                  Dados protegidos com certificado SSL
                </p>
              </div>
            `,
            fontSize: 'text-sm',
            textAlign: 'text-center',
            color: '#6B7280',
            marginTop: 24
          }
        }
      ],
      settings: {
        showProgress: false,
        progressValue: 100,
        backgroundColor: '#ffffff',
        textColor: '#432818',
        maxWidth: 'max-w-4xl',
        padding: 'p-6'
      }
    });

    console.log(`✅ [ES7+] Criadas ${pages.length} etapas modulares (1-21)`);
    return pages;
  }

  /**
   * Método legado mantido para compatibilidade
   * Usa a mesma lógica modular do createModularPages()
   */
  createLegacyDefaultFunnel(): SchemaDrivenFunnelData {
    console.log('🔄 Creating legacy funnel using modular architecture...');
    return this.createDefaultFunnel();
  }

  // Cleanup
  destroy() {
    this.disableAutoSave();
  }
}

export const schemaDrivenFunnelService = new SchemaDrivenFunnelService();
