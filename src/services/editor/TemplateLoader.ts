/**
 * 📦 TEMPLATE LOADER SERVICE
 * 
 * Gerencia carregamento de templates com estratégias em cascata:
 * 1. Cache unificado
 * 2. Master JSON público
 * 3. JSON normalizado
 * 4. Templates modulares
 * 5. TypeScript template (fallback)
 * 
 * Extraído do EditorProviderUnified para reduzir complexidade
 * 
 * ✅ FASE 1.2: Migrado para usar templateService (removido safeGetTemplateBlocks)
 * 
 * @version 1.1.0
 */

import { Block } from '@/types/editor';
// ✅ CORREÇÃO: Remover import direto do .ts
// import { QUIZ_STYLE_21_STEPS_TEMPLATE } from '@/templates/quiz21StepsComplete';
import { hierarchicalTemplateSource } from '@/services/core/HierarchicalTemplateSourceMigration';
import { blockComponentsToBlocks, convertTemplateToBlocks } from '@/lib/utils/templateConverter';
// 🔧 Removido dependência de utils/loadStepTemplates para evitar eager-loading de bundles
import hydrateSectionsWithQuizSteps from '@/lib/utils/hydrators/hydrateSectionsWithQuizSteps';
import { unifiedCacheService } from '@/services/unified/UnifiedCacheService';
import { masterTemplateKey, stepBlocksKey, masterBlocksKey, templateKey } from '@/lib/utils/cacheKeys';
import { TEMPLATE_SOURCES } from '@/config/templateSources';
import blockAliasMap from '@/config/block-aliases.json';
import { templateService } from '@/services';
import { funnelComponentsService } from '@/services/funnelComponentsService';

// Alias para compatibilidade
const unifiedCache = unifiedCacheService;
import { convertComponentInstancesToBlocks, filterValidInstances } from '@/lib/utils/componentInstanceConverter';
import { retryWithBackoff, isNetworkError, isSupabaseError } from '@/lib/utils/retryWithBackoff';
import { appLogger } from '@/lib/utils/appLogger';
import TemplateRegistry from '@/services/editor/TemplateRegistry';

export type TemplateSource =
  | 'normalized-json'
  | 'modular-json'
  | 'individual-json'      // JSON público em /templates/blocks/step-XX.json
  | 'master-json'          // Carregado de quiz21-complete.json
  | 'consolidated'         // Consolidated service (prioriza per-step JSON)
  | 'supabase'             // ✅ FASE 2.1: Carregado do Supabase (component_instances)
  | 'ts-template';         // Fallback TypeScript

export interface LoadedTemplate {
  blocks: Block[];
  source: TemplateSource;
}

export class TemplateLoader {
  private static instance: TemplateLoader | null = null;
  private masterTemplateRef: any | null = null;
  // Mantém promessas em voo por step, evitando concorrência e erros "already loading"
  private inFlightLoads = new Map<string, Promise<LoadedTemplate>>();

  // Performance metrics (dev only)
  private metrics = {
    cacheHits: 0,
    cacheMisses: 0,
    loadTimes: [] as number[],
    prefetchCount: 0,
  };

  /**
   * Singleton pattern
   */
  static getInstance(): TemplateLoader {
    if (!TemplateLoader.instance) {
      TemplateLoader.instance = new TemplateLoader();
    }
    return TemplateLoader.instance;
  }

  /**
   * Reset singleton (útil para testes)
   */
  static resetInstance(): void {
    TemplateLoader.instance = null;
  }

  /**
   * ❌ REMOVIDO (Fase 1.4): withRetry não é necessário para arquivos locais
   * Arquivos estáticos em /public/ ou existem ou não existem
   * Retry só faz sentido para chamadas de rede instáveis (Supabase, APIs externas)
   * 
   * Ganho de performance: -1.050ms de latência artificial eliminada
   */

  /**
   * 🎯 FIX 1.3: Detecção de modo (template vs funnel)
   * Evita tentativas de Supabase em modo template
   */
  private detectMode(): { mode: 'template' | 'funnel' | 'unknown'; id: string | null } {
    if (typeof window === 'undefined') {
      return { mode: 'unknown', id: null };
    }

    const params = new URLSearchParams(window.location.search);
    const templateId = params.get('template') || params.get('id');
    const funnelId = params.get('funnelId') || params.get('funnel');

    if (templateId && !funnelId) {
      appLogger.info('🎨 [TemplateLoader] Modo TEMPLATE detectado:', { data: [templateId] });
      return { mode: 'template', id: templateId };
    }

    if (funnelId) {
      appLogger.info('💾 [TemplateLoader] Modo FUNNEL detectado:', { data: [funnelId] });
      return { mode: 'funnel', id: funnelId };
    }

    return { mode: 'unknown', id: null };
  }

  /**
   * Carrega blocos para um step específico
   * 🎯 FIX 1.3: Priorização clara baseada em modo (template vs funnel)
   */
  async loadStep(step: number | string): Promise<LoadedTemplate> {
    const normalizedKey = this.normalizeStepKey(step);
    const startTime = performance.now();

    // ✅ FASE 2.4: Verificar cache primeiro
    const cacheKey = stepBlocksKey(normalizedKey);
    if (unifiedCache.has(cacheKey)) {
      this.metrics.cacheHits++;
      appLogger.info(`⚡ [Cache HIT] ${normalizedKey}`);
      
      const blocks = unifiedCache.get(cacheKey);
      return { blocks: blocks || [], source: 'normalized-json' }; // source genérico para cache
    }
    
    this.metrics.cacheMisses++;

    // De-dup: se já existe um carregamento em andamento para esse step, reutiliza a mesma promise
    const existing = this.inFlightLoads.get(normalizedKey);
    if (existing) {
      appLogger.info(`⏭️ Reutilizando carregamento em andamento para ${normalizedKey}`);
      return existing;
    }

    // Cria a promise de carregamento e registra no mapa
    const loadPromise = (async (): Promise<LoadedTemplate> => {
      try {
        console.group(`🔍 [TemplateLoader] ${normalizedKey}`);
        
        // 🎯 FIX 1.3: DETECTAR MODO PRIMEIRO
        const { mode, id } = this.detectMode();
        appLogger.info(`🎯 Modo detectado: ${mode} (ID: ${id || 'N/A'})`);

        // ============================================================
        // � MODO TEMPLATE: Prioriza fontes locais (JSON público)
        // ============================================================
        if (mode === 'template') {
          appLogger.info('🎨 [MODO TEMPLATE] Usando estratégia LOCAL-FIRST');

          // 1. JSON público individual (PRIORIDADE MÁXIMA em template mode)
          const fromPublic = await this.loadFromPublicStepJSON(normalizedKey);
          if (fromPublic) {
            appLogger.info('✅ Template mode: Carregado de JSON público');
            return fromPublic;
          }

          // 2. Master JSON (fallback)
          if (TEMPLATE_SOURCES.useMasterJSON) {
            const fromMaster = await this.loadFromMasterJSON(normalizedKey);
            if (fromMaster) {
              appLogger.info('✅ Template mode: Carregado de Master JSON');
              return fromMaster;
            }
          }

          // 3. TypeScript template (fallback final)
          appLogger.info('🔄 Template mode: Usando fallback TypeScript');
          return await this.loadFromTypescript(normalizedKey);
        }

        // ============================================================
        // 💾 MODO FUNNEL: Prioriza Supabase (quando implementado)
        // ============================================================
        if (mode === 'funnel') {
          appLogger.info('💾 [MODO FUNNEL] Usando estratégia SUPABASE-FIRST');

          // ✅ FASE 2.1: Implementado carregamento do Supabase
          const fromSupabase = await this.loadFromSupabase(id!, normalizedKey);
          if (fromSupabase) {
            appLogger.info('✅ Funnel mode: Carregado do Supabase');
            return fromSupabase;
          }

          // Fallback: JSON público (para funnels que ainda não têm dados no Supabase)
          const fromPublic = await this.loadFromPublicStepJSON(normalizedKey);
          if (fromPublic) {
            appLogger.info('⚠️ Funnel mode: Carregado de JSON público (fallback)');
            return fromPublic;
          }

          // Fallback: TypeScript
          appLogger.info('🔄 Funnel mode: Usando fallback TypeScript');
          return await this.loadFromTypescript(normalizedKey);
        }

        // ============================================================
        // ❓ MODO DESCONHECIDO: Usa estratégia cascata original
        // ============================================================
        appLogger.info('❓ [MODO DESCONHECIDO] Usando estratégia cascata');

        // Preferência explícita: quando ?template=quiz21StepsComplete estiver na URL do /editor,
        // priorizamos os JSONs individuais gerados em public/templates/step-XX.json
        let preferPublicStepJSON = TEMPLATE_SOURCES.preferPublicStepJSON;
        try {
          if (typeof window !== 'undefined' && window.location?.search) {
            const sp = new URLSearchParams(window.location.search);
            // URL param força preferência
            if ((sp.get('template') || '').toLowerCase() === 'quiz21stepscomplete') {
              preferPublicStepJSON = true;
            }
          }
        } catch {
          // ignore
        }

        // Preferência: quando for fluxo de template via ?template=quiz21StepsComplete,
        // tentamos os JSONs públicos PRIMEIRO (evita cache desatualizado em dev)
        if (preferPublicStepJSON) {
          const fromPublic = await this.loadFromPublicStepJSON(normalizedKey);
          if (fromPublic) return fromPublic;
        }

        // Estratégia 0: Consolidated service (prioriza per-step JSON de forma unificada)
        const fromConsolidated = await this.loadFromConsolidated(normalizedKey);
        if (fromConsolidated) return fromConsolidated;

        // Estratégia 1: Cache unificado (somente se não forçar público)
        const cached = this.loadFromCache(normalizedKey);
        if (cached) return cached;

        // Estratégia 2: Master JSON público (PRIORIDADE quando flag ativa!)
        appLogger.info('🔍 Verificando flag useMasterJSON:', { data: [TEMPLATE_SOURCES.useMasterJSON] });
        if (TEMPLATE_SOURCES.useMasterJSON) {
          appLogger.info('✅ Flag useMasterJSON está TRUE - tentando carregar master JSON...');
          const fromMaster = await this.loadFromMasterJSON(normalizedKey);
          if (fromMaster) {
            appLogger.info(`🎉 Master JSON SUCCESS: ${fromMaster.blocks.length} blocos, source: ${fromMaster.source}`);
            return fromMaster;
          }
          appLogger.warn('⚠️ loadFromMasterJSON retornou null - tentando outras fontes...');
        } else {
          appLogger.warn('❌ Flag useMasterJSON está FALSE - pulando master JSON');
        }

        // Estratégia 3: TemplateRegistry (fonte canônica em memória - FALLBACK)
        const fromRegistry = this.loadFromRegistry(normalizedKey);
        if (fromRegistry) return fromRegistry;

        // Estratégia 4: JSON normalizado (gates 02-11) - controlado por flag
        if (TEMPLATE_SOURCES.useNormalizedJSON) {
          const normalized = await this.loadNormalized(normalizedKey);
          if (normalized) return normalized;
        }

        // Estratégia 5: Templates modulares (controlado por flag)
        if (TEMPLATE_SOURCES.useModularTemplates) {
          const modular = await this.loadModular(normalizedKey);
          if (modular) return modular;
        }

        // Estratégia 6: TypeScript template (fallback)
        appLogger.warn('🔄 Caindo no fallback TypeScript template');
        return await this.loadFromTypescript(normalizedKey);
      } finally {
        console.groupEnd();
      }
    })();

    this.inFlightLoads.set(normalizedKey, loadPromise);

    try {
      const result = await loadPromise;
      
      // ✅ FASE 2.4: Track load time
      const loadTime = performance.now() - startTime;
      this.metrics.loadTimes.push(loadTime);
      
      if (import.meta.env.DEV) {
        appLogger.info(`📊 [loadStep] ${normalizedKey} carregado em ${loadTime.toFixed(0)}ms (source: ${result.source})`);
      }
      
      return result;
    } finally {
      // Limpa a referência independentemente de sucesso ou erro, permitindo novos loads futuros
      this.inFlightLoads.delete(normalizedKey);
    }
  }

  /**
   * ✅ FASE 2.1: Carregar blocos do Supabase (component_instances)
   * ✅ FASE 2.3: Retry com exponential backoff
   * Estratégia SUPABASE-FIRST para modo funnel
   */
  private async loadFromSupabase(funnelId: string, normalizedKey: string): Promise<LoadedTemplate | null> {
    try {
      appLogger.info(`💾 [loadFromSupabase] Carregando: funnel=${funnelId}, step=${normalizedKey}`);

      // Extrair número da etapa (step-01 → 1)
      const stepNumber = parseInt(normalizedKey.replace(/\D/g, ''), 10);
      if (isNaN(stepNumber)) {
        appLogger.warn(`⚠️ [loadFromSupabase] Step number inválido: ${normalizedKey}`);
        return null;
      }

      // Buscar component_instances do Supabase (COM RETRY)
      const instances = await retryWithBackoff(
        () => funnelComponentsService.getComponents({ funnelId, stepNumber }),
        {
          maxAttempts: 3,
          baseDelayMs: 1000,
          onRetry: (attempt, error) => {
            appLogger.warn(`🔄 [loadFromSupabase] Retry ${attempt}/3 para step ${stepNumber}:`, { data: [error.message] });
          },
          shouldRetry: (error) => isNetworkError(error) || isSupabaseError(error),
        }
      );

      if (!instances || instances.length === 0) {
        appLogger.info(`⚠️ [loadFromSupabase] Nenhum component_instance encontrado para step ${stepNumber}`);
        return null;
      }

      appLogger.info(`✅ [loadFromSupabase] ${instances.length} component_instances encontrados`);

      // Filtrar instâncias inválidas
      const validInstances = filterValidInstances(instances);

      if (validInstances.length === 0) {
        appLogger.warn(`⚠️ [loadFromSupabase] Todas as instâncias eram inválidas`);
        return null;
      }

      // Converter ComponentInstance[] → Block[]
      const blocks = convertComponentInstancesToBlocks(validInstances);

      if (blocks.length === 0) {
        appLogger.warn(`⚠️ [loadFromSupabase] Conversão resultou em 0 blocos`);
        return null;
      }

      // Cache os blocos
      unifiedCache.set(stepBlocksKey(normalizedKey), blocks);

      appLogger.info(`📦 Supabase → ${normalizedKey}: ${blocks.length} blocos`);

      return { blocks, source: 'supabase' };
    } catch (error) {
      appLogger.error(`❌ [loadFromSupabase] Erro ao carregar do Supabase após retries:`, { data: [error] });
      // Retornar null para permitir fallback
      return null;
    }
  }

  /**
   * Estratégia: Carregar JSON individual público em public/templates/step-XX.json
   * - ATUALIZADO: Remove tentativa de carregar -v3.json (arquivados)
   * - Tenta apenas .json (formato blocks[])
   * - Converte para Block[] com mapeamentos e normalização de campos
   */
  private async loadFromPublicStepJSON(normalizedKey: string): Promise<LoadedTemplate | null> {
    try {
      const base = `/templates/${normalizedKey}`;
      // ✅ OTIMIZADO: Priorizar /templates/blocks/ que é a fonte primária atual
      // Ordem de tentativa (SEM -v3.json que foi arquivado):
      // 1) v3.1 blocks (public/templates/blocks/step-XX.json) ← FONTE PRIMÁRIA
      // 2) canônico (public/templates/step-XX.json) ← FALLBACK
      const urls = [
        `/templates/blocks/${normalizedKey}.json`,
        `${base}.json`,
      ];
      let data: any | null = null;
      let successUrl: string | null = null;

      // ✅ FIX 1.4: SEM RETRY - arquivos locais ou existem ou não
      for (const url of urls) {
        try {
          const bust = (typeof window !== 'undefined' && import.meta.env?.DEV) ? `?ts=${Date.now()}` : '';
          const resp = await fetch(url + bust, { cache: 'no-store' });
          if (resp.ok) {
            data = await resp.json();
            successUrl = url;
            break;
          }
        } catch (e) {
          // Falha imediata, sem retry
        }
      }

      if (!data) return null;

      // Detectar e extrair blocos
      let blocks: Block[] = [];
      const rawBlocks: any[] = Array.isArray(data?.blocks) ? data.blocks : [];

      if (rawBlocks.length) {
        // Caminho 1: JSON no formato blocks[]
        const typeMap: Record<string, string> = blockAliasMap as Record<string, string>;
        blocks = rawBlocks.map((b: any, idx: number) => ({
          id: String(b.id || `${normalizedKey}-block-${idx}`),
          type: (typeMap[b.type] || b.type || 'text-inline') as any,
          order: (b.order ?? b.position ?? b.index ?? idx) as number,
          // Suporte a múltiplas convenções: properties | props | config | options
          properties: (b.properties || b.props || b.config || b.options || {}) as Record<string, any>,
          content: (b.content || {}) as Record<string, any>,
        }));

        // Hidratar textos do v3 (sections) se disponível → aplica apenas para question-block
        try {
          const v3Url = `/templates/${normalizedKey}-v3.json`;
          const bust = (typeof window !== 'undefined' && import.meta.env?.DEV) ? `?ts=${Date.now()}` : '';
          const respV3 = await fetch(v3Url + bust, { cache: 'no-store' });
          if (respV3.ok) {
            const v3 = await respV3.json();
            const sections = Array.isArray(v3?.sections) ? v3.sections : [];
            const secByType = (t: string) => sections.find((s: any) => s?.type === t);
            const qNumSec = secByType('question-number') || secByType('question-progress');
            const qTextSec = secByType('question-text');
            const gridSec = secByType('options-grid');
            const numberStr = (qNumSec?.content?.questionNumber) || (
              (qNumSec?.content?.currentQuestion && qNumSec?.content?.totalQuestions)
                ? `${qNumSec.content.currentQuestion} de ${qNumSec.content.totalQuestions}`
                : undefined
            );
            const textStr = qTextSec?.content?.text;
            const opts = Array.isArray(gridSec?.content?.options) ? gridSec.content.options : [];
            const minSel = gridSec?.content?.minSelections ?? undefined;

            blocks = blocks.map(b => {
              if (String(b.type) !== 'question-block') return b;
              const cfg = { ...(b.properties || {}) };
              if (numberStr) cfg.questionNumber = numberStr;
              if (textStr) cfg.questionText = textStr;
              if (Array.isArray(opts) && opts.length) {
                cfg.options = opts.map((o: any) => ({ id: String(o.id || o.value), text: String(o.text || o.label || o.value || ''), image: o.imageUrl || o.image }));
              }
              if (typeof minSel === 'number' && minSel > 0) cfg.requiredSelections = minSel;
              return { ...b, properties: cfg };
            });

            // Hidratação adicional por step (hero/intro, oferta/resultado)
            const stepNum = Number(normalizedKey.replace('step-', ''));

            // step-01: hero-block e welcome-form-block
            if (stepNum === 1) {
              const header = secByType('quiz-intro-header');
              const introTitle = secByType('intro-title');
              const introDesc = secByType('intro-description');
              const introImg = secByType('intro-image');
              const introForm = secByType('intro-form');

              blocks = blocks.map(b => {
                const cfg = { ...(b.properties || {}) };
                if (String(b.type) === 'hero-block') {
                  if (introTitle?.content?.titleHtml) cfg.titleHtml = introTitle.content.titleHtml;
                  if (introDesc?.content?.text) cfg.subtitleHtml = introDesc.content.text;
                  if (introImg?.content?.imageUrl) cfg.imageUrl = introImg.content.imageUrl;
                  if (introImg?.content?.imageAlt) cfg.imageAlt = introImg.content.imageAlt;
                  if (header?.content?.logoUrl) cfg.logoUrl = header.content.logoUrl;
                  if (header?.content?.logoAlt) cfg.logoAlt = header.content.logoAlt;
                  return { ...b, properties: cfg };
                }
                if (String(b.type) === 'welcome-form-block') {
                  if (introForm?.content?.formQuestion) cfg.questionLabel = introForm.content.formQuestion;
                  if (introForm?.content?.namePlaceholder) cfg.placeholder = introForm.content.namePlaceholder;
                  if (introForm?.content?.submitText) cfg.buttonText = introForm.content.submitText;
                  return { ...b, properties: cfg };
                }
                return b;
              });
            }

            // step-20 e 21: oferta e resultado
            if (stepNum === 20 || stepNum === 21) {
              const offer = v3?.offer || {};
              const heroSection = sections.find((s: any) => s?.type === 'HeroSection');
              const styleProfile = sections.find((s: any) => s?.type === 'StyleProfileSection');
              const ctaPrimary = sections.find((s: any) => s?.id === 'cta-primary' && s?.type === 'CTAButton');
              const ctaLabel = ctaPrimary?.props?.text || 'Quero começar agora';
              const checkout = offer?.links?.checkout || offer?.checkout;
              const offerTitle = offer?.productName || heroSection?.props?.titleFormat || 'Programa Especial';
              const offerDesc = offer?.description || 'Método completo para dominar seu estilo.';

              blocks = blocks.map(b => {
                const cfg = { ...(b.properties || {}) };
                if (String(b.type) === 'offer.core') {
                  cfg.title = offerTitle;
                  cfg.description = offerDesc;
                  if (checkout) cfg.ctaUrl = checkout;
                  if (ctaLabel) cfg.ctaLabel = ctaLabel;
                  return { ...b, properties: cfg };
                }
                if (String(b.type) === 'result.secondaryList') {
                  const titleFormat = styleProfile?.props?.progressBars?.titleFormat;
                  if (titleFormat) cfg.title = titleFormat;
                  return { ...b, properties: cfg };
                }
                return b;
              });
            }
          }
        } catch (_e) {
          // silencioso: sem bloqueio em caso de falha
        }

        // Adaptadores de tipo para o Editor (quando só há 1 bloco por etapa e tipos não são reconhecidos pelo renderer modular)
        try {
          const stepNum = Number(normalizedKey.replace('step-', ''));

          // 1) Intro (step-01): mapear hero-block/welcome-form-block para blocos ATÔMICOS do editor
          if (stepNum === 1) {
            const introBlocks: any[] = [];
            const hero = blocks.find(b => String(b.type) === 'hero-block');
            const form = blocks.find(b => String(b.type) === 'welcome-form-block');

            if (hero) {
              const p = hero.properties || {};
              // Header com logo + linha
              introBlocks.push({
                id: `${normalizedKey}-intro-logo-header`,
                type: 'intro-logo-header',
                order: 0,
                properties: { logoUrl: p.logoUrl, logoAlt: p.logoAlt },
                content: {},
              });
              // Título
              if (p.titleHtml || p.title) {
                introBlocks.push({
                  id: `${normalizedKey}-intro-title`,
                  type: 'intro-title',
                  order: introBlocks.length,
                  properties: {},
                  content: { titleHtml: p.titleHtml || p.title },
                });
              }
              // Imagem
              if (p.imageUrl) {
                introBlocks.push({
                  id: `${normalizedKey}-intro-image`,
                  type: 'intro-image',
                  order: introBlocks.length,
                  properties: {},
                  content: { imageUrl: p.imageUrl, imageAlt: p.imageAlt },
                });
              }
              // Descrição/subtítulo
              if (p.subtitleHtml || p.subtitle) {
                introBlocks.push({
                  id: `${normalizedKey}-intro-description`,
                  type: 'intro-description',
                  order: introBlocks.length,
                  properties: {},
                  content: { text: p.subtitleHtml || p.subtitle },
                });
              }
            }
            if (form) {
              const p = form.properties || {};
              introBlocks.push({
                id: `${normalizedKey}-intro-form`,
                type: 'intro-form',
                order: introBlocks.length,
                properties: { buttonText: p.buttonText, placeholder: p.placeholder },
                content: { formQuestion: p.questionLabel, namePlaceholder: p.placeholder, submitText: p.buttonText },
              });
            }

            if (introBlocks.length) {
              blocks = introBlocks;
            }
          }

          // 2) Perguntas (steps 02–18): expandir question-block único em blocos modulares esperados pelo editor
          if (stepNum >= 2 && stepNum <= 18) {
            const onlyQuestionBlock = blocks.length === 1 && String(blocks[0].type) === 'question-block';
            if (onlyQuestionBlock) {
              const qb = blocks[0];
              const p = qb.properties || {};
              const opts = Array.isArray(p.options) ? p.options : [];
              const mapped = opts.map((o: any) => ({ id: String(o.id), text: String(o.text || o.label || o.id), imageUrl: o.imageUrl || o.image }));
              blocks = [
                { id: `${normalizedKey}-qnum`, type: 'question-number', order: 0, properties: { questionNumber: p.questionNumber }, content: {} },
                { id: `${normalizedKey}-qtext`, type: 'question-text', order: 1, properties: { questionText: p.questionText }, content: { questionText: p.questionText } },
                { id: `${normalizedKey}-qopts`, type: 'options-grid', order: 2, properties: { options: mapped }, content: { options: mapped } },
                { id: `${normalizedKey}-qnav`, type: 'quiz-navigation', order: 3, properties: { enableWhenValid: true }, content: {} },
              ] as any[];
            }
          }

          // 3) Transição (step-19): mapear transition.next para BLOCOS ATÔMICOS do editor
          if (stepNum === 19) {
            const trans = blocks.find(b => String(b.type) === 'transition.next');
            if (trans) {
              const p = trans.properties || {};
              const title = p.title || p.message || '';
              const paragraphs = Array.isArray(p.paragraphs) ? p.paragraphs : [];
              const text = [title, ...paragraphs].filter(Boolean).join('\n\n');
              const nextLabel = p.buttonLabel || 'Ver resultado';
              blocks = [
                { id: `${normalizedKey}-transition-title`, type: 'transition-title', order: 0, properties: {}, content: { text: title } },
                { id: `${normalizedKey}-transition-text`, type: 'transition-text', order: 1, properties: {}, content: { text } },
                { id: `${normalizedKey}-transition-cta`, type: 'cta-inline', order: 2, properties: { text: nextLabel, variant: 'primary', size: 'large', action: 'next-step', nextStepId: 'step-20' }, content: {} },
              ] as any[];
            }
          }
        } catch (e) {
          appLogger.warn('⚠️ Falha no adaptador de blocos para editor:', { data: [e] });
        }
      } else if (Array.isArray(data?.sections)) {
        // Caminho 2: JSON v3 no formato sections[] → converter para Block[]
        // ✅ FASE 1.2: Migrado para usar convertTemplateToBlocks diretamente
        try {
          const hydrated = {
            ...data,
            sections: hydrateSectionsWithQuizSteps(normalizedKey, data.sections, templateService.getAllStepsSync()),
          };
          const blocksComponents = convertTemplateToBlocks({ [normalizedKey]: hydrated });
          blocks = blockComponentsToBlocks(blocksComponents);
        } catch (e) {
          appLogger.warn('⚠️ Falha ao converter sections→blocks para', { data: [normalizedKey, e] });
          return null;
        }
      } else {
        return null;
      }

      unifiedCache.set(stepBlocksKey(normalizedKey), blocks);
      appLogger.info(`📦 Public step JSON → ${normalizedKey}: ${blocks.length} blocos`);
      return { blocks, source: 'individual-json' };
    } catch (e) {
      appLogger.warn('⚠️ Erro ao carregar JSON público individual:', { data: [normalizedKey, e] });
      return null;
    }
  }

  /**
   * Estratégia 0: ConsolidatedTemplateService → prioriza per-step JSON automaticamente
   */
  private async loadFromConsolidated(normalizedKey: string): Promise<LoadedTemplate | null> {
    try {
      const result = await templateService.getStep(normalizedKey);
      const blocks = result.success ? (result.data as any[]) : [];
      if (Array.isArray(blocks) && blocks.length > 0) {
        unifiedCache.set(stepBlocksKey(normalizedKey), blocks);
        appLogger.info(`📦 Consolidated → ${normalizedKey}: ${blocks.length} blocos`);
        return { blocks: blocks as Block[], source: 'consolidated' };
      }
      return null;
    } catch (e) {
      appLogger.warn('⚠️ Erro ao carregar via consolidatedTemplateService:', { data: [normalizedKey, e] });
      return null;
    }
  }

  /**
   * Estratégia 3: Carregar do TemplateRegistry (single source of truth)
   */
  private loadFromRegistry(normalizedKey: string): LoadedTemplate | null {
    try {
      const registry = TemplateRegistry.getInstance();
      if (!registry.has(normalizedKey)) {
        appLogger.warn(`⚠️ [TemplateRegistry] Template não encontrado: ${normalizedKey}`);
        return null;
      }

      const stepTemplate = registry.get(normalizedKey);
      if (!stepTemplate) return null;

      // Converter template v3 (sections) para Block[]
      const blockComponents = convertTemplateToBlocks(stepTemplate);
      const blocks = blockComponentsToBlocks(blockComponents);

      unifiedCache.set(stepBlocksKey(normalizedKey), blocks);
      appLogger.info(`📦 Registry → ${normalizedKey}: ${blocks.length} blocos`);
      return { blocks, source: 'modular-json' }; // CORRIGIDO: era 'ts-template'
    } catch (e) {
      appLogger.warn('⚠️ Erro ao carregar do TemplateRegistry:', { data: [e] });
      return null;
    }
  }

  /**
   * Normaliza chave do step para formato step-XX
   */
  private normalizeStepKey(step: number | string): string {
    const rawKey = typeof step === 'string' ? step : `step-${step}`;
    const match = rawKey.match(/^step-(\d{1,2})$/);
    return match ? `step-${parseInt(match[1], 10).toString().padStart(2, '0')}` : rawKey;
  }

  /**
   * Estratégia 1: Carregar de cache unificado
   * NOTA: Não usamos cache aqui para garantir que a fonte correta seja retornada
   * O cache é mantido apenas para melhorar performance após o primeiro carregamento
   */
  private loadFromCache(normalizedKey: string): LoadedTemplate | null {
    // ❌ DESABILITADO: Cache pode misturar fontes e retornar 'master-hydrated' incorretamente
    // quando os blocos vieram de /templates/blocks/*.json
    // 
    // Para garantir a fonte correta, sempre carregamos do disco/rede
    return null;
  }

  /**
   * Estratégia 2: Carregar de Master JSON com retry
   */
  private async loadFromMasterJSON(normalizedKey: string): Promise<LoadedTemplate | null> {
    try {
      appLogger.info('🔍 [loadFromMasterJSON] Iniciando...');

      if (typeof window === 'undefined' || !window.location) {
        appLogger.warn('⚠️ [loadFromMasterJSON] window ou window.location não disponível');
        return null;
      }

      // Carregar master JSON uma vez
      if (!this.masterTemplateRef) {
        appLogger.info('🔍 [loadFromMasterJSON] Master JSON não está em memória, tentando carregar...');

        const cachedMaster = unifiedCache.get(masterTemplateKey());
        if (cachedMaster) {
          appLogger.info('✅ [loadFromMasterJSON] Master JSON encontrado no cache');
          this.masterTemplateRef = cachedMaster;
        } else {
          // ✅ FASE 2 FIX: Path corrigido para quiz21-v4.json em .obsolete
          appLogger.info('🔍 [loadFromMasterJSON] Fazendo fetch de /templates/.obsolete/quiz21-v4.json...');

          // Retry com exponential backoff
          let lastError: any = null;
          for (let attempt = 0; attempt < 3; attempt++) {
            try {
              appLogger.info(`🔍 [loadFromMasterJSON] Tentativa ${attempt + 1}/3...`);
              const resp = await fetch('/templates/.obsolete/quiz21-v4.json', {
                cache: 'force-cache',
              });

              appLogger.info(`📊 [loadFromMasterJSON] Response status: ${resp.status}, ok: ${resp.ok}`);

              if (resp.ok) {
                this.masterTemplateRef = await resp.json();
                unifiedCache.set(masterTemplateKey(), this.masterTemplateRef);
                appLogger.info(`✅ Master JSON carregado (tentativa ${attempt + 1})`);
                appLogger.info('📊 Steps no master:', { data: [Object.keys(this.masterTemplateRef?.steps || {}).length] });
                break;
              } else {
                lastError = new Error(`HTTP ${resp.status}`);
                appLogger.warn(`⚠️ Tentativa ${attempt + 1}/3 falhou:`, { data: [resp.status] });
              }
            } catch (err) {
              lastError = err;
              appLogger.warn(`⚠️ Tentativa ${attempt + 1}/3 erro de rede:`, { data: [err] });
            }
            if (attempt < 2) {
              await new Promise(resolve => setTimeout(resolve, 200 * Math.pow(2, attempt)));
            }
          }
          if (!this.masterTemplateRef) {
            appLogger.error('❌ Falha ao carregar master JSON após 3 tentativas:', { data: [lastError] });
            return null;
          }
        }
      } else {
        appLogger.info('✅ [loadFromMasterJSON] Master JSON já estava em memória');
      }

      const master = this.masterTemplateRef;
      appLogger.info('🔍 [loadFromMasterJSON] Procurando step:', { data: [normalizedKey] });
      appLogger.info('🔍 [loadFromMasterJSON] Steps disponíveis:', { data: [Object.keys(master?.steps || {})] });

      const stepConfig = master?.steps?.[normalizedKey];
      if (!stepConfig) {
        appLogger.warn(`⚠️ Master JSON carregado, mas step não encontrado: ${normalizedKey}`);
        return null;
      }

      appLogger.info(`✅ [loadFromMasterJSON] Step ${normalizedKey} encontrado!`);
      appLogger.info('📊 [loadFromMasterJSON] Blocks no step:', { data: [stepConfig.blocks?.length || 0] });
      appLogger.info('📊 [loadFromMasterJSON] Sections no step:', { data: [stepConfig.sections?.length || 0] });

      // ✅ PRIORIDADE: Se step tem blocks[], usar diretamente!
      if (Array.isArray(stepConfig.blocks) && stepConfig.blocks.length > 0) {
        const typeMap: Record<string, string> = blockAliasMap as Record<string, string>;
        const blocks: Block[] = stepConfig.blocks.map((b: any, idx: number) => ({
          id: String(b.id || `${normalizedKey}-block-${idx}`),
          type: (typeMap[b.type] || b.type || 'text-inline') as any,
          order: (b.order ?? b.position ?? b.index ?? idx) as number,
          properties: (b.properties || b.props || b.config || b.options || {}) as Record<string, any>,
          content: (b.content || {}) as Record<string, any>,
        }));

        unifiedCache.set(masterBlocksKey(normalizedKey), blocks);
        unifiedCache.set(stepBlocksKey(normalizedKey), blocks);

        appLogger.info(`📦 Master JSON (blocks) → ${normalizedKey}: ${blocks.length} blocos`);
        return { blocks, source: 'master-json' };
      }

      // ⚠️ FALLBACK: Se step tem sections[] (formato antigo), converter
      // ✅ FASE 1.2: Migrado para usar convertTemplateToBlocks diretamente
      if (Array.isArray(stepConfig.sections) && stepConfig.sections.length > 0) {
        const hydrated = {
          ...stepConfig,
          sections: hydrateSectionsWithQuizSteps(normalizedKey, stepConfig.sections, templateService.getAllStepsSync()),
        };
        const blockComponents = convertTemplateToBlocks({ [normalizedKey]: hydrated });
        const blocks = blockComponentsToBlocks(blockComponents);

        unifiedCache.set(masterBlocksKey(normalizedKey), blocks);
        unifiedCache.set(stepBlocksKey(normalizedKey), blocks);

        appLogger.info(`📦 Master JSON (sections) → ${normalizedKey}: ${blocks.length} blocos`);
        return { blocks, source: 'master-json' };
      }

      appLogger.warn(`⚠️ Step ${normalizedKey} não tem blocks[] nem sections[]`);
      return null;
    } catch (e) {
      appLogger.error('❌ [loadFromMasterJSON] Erro crítico:', { data: [e] });
      appLogger.warn('⚠️ Erro ao carregar master JSON:', { data: [e] });
    }
    return null;
  }

  /**
   * Estratégia 3: Carregar JSON normalizado (steps 02-11)
   */
  private async loadNormalized(normalizedKey: string): Promise<LoadedTemplate | null> {
    try {
      const stepNum = Number(normalizedKey.replace('step-', ''));
      const isNormalizedRange = stepNum >= 2 && stepNum <= 11;

      if (!isNormalizedRange) return null;

      // Cache normalizado
      const normalizedCache = unifiedCache.get<Block[]>(templateKey(`normalized:${normalizedKey}`));
      if (Array.isArray(normalizedCache) && normalizedCache.length > 0) {
        appLogger.info(`📦 Normalized cache hit: ${normalizedKey}`);
        return { blocks: normalizedCache, source: 'normalized-json' };
      }

      // ✅ FASE 1.4: Carregamento direto sem retry (módulos locais)
      try {
        const mod = await import('@/lib/normalizedLoader');
        const data = await mod.loadNormalizedStep(normalizedKey as any);
        
        if (!data) return null;

        if (data && Array.isArray((data as any).blocks)) {
          const blocks = (data as any).blocks.map((b: any, idx: number) => ({
            id: b.id || `block-${idx}`,
            type: (b.type || 'text-inline') as any,
            order: b.order ?? b.position ?? idx,
            properties: b.properties || b.props || {},
            content: b.content || {},
          })) as Block[];

          unifiedCache.set(templateKey(`normalized:${normalizedKey}`), blocks);
          unifiedCache.set(stepBlocksKey(normalizedKey), blocks);

          appLogger.info(`📦 Normalized JSON → ${normalizedKey}: ${blocks.length} blocos`);
          return { blocks, source: 'normalized-json' };
        }
      } catch (e) {
        appLogger.warn('⚠️ loadNormalized falhou:', { data: [e] });
      }
    } catch (e) {
      // Silent fail para gate disabled
      appLogger.warn('⚠️ loadNormalized falhou (gate desabilitado ou erro não crítico):', { data: [e] });
    }
    return null;
  }

  /**
   * Estratégia 4: Carregar templates modulares
   */
  private async loadModular(normalizedKey: string): Promise<LoadedTemplate | null> {
    try {
      // Usar TemplateService canônico para obter blocos do step
      const result = await templateService.getStep(normalizedKey);
      if (!result.success || !result.data || result.data.length === 0) {
        return null;
      }

      const blocks = result.data as Block[];
      appLogger.info(`📦 Modular (TemplateService) → ${normalizedKey}: ${blocks.length} blocos`);

      unifiedCache.set(stepBlocksKey(normalizedKey), blocks);
      return { blocks, source: 'modular-json' };
    } catch (e) {
      appLogger.warn('⚠️ Erro ao carregar template modular (TemplateService):', { data: [normalizedKey, e] });
      return null;
    }
  }

  /**
   * Estratégia 5: Carregar de TypeScript template (fallback)
   * ✅ CORREÇÃO: Agora usa hierarchicalTemplateSource
   */
  private async loadFromTypescript(normalizedKey: string): Promise<LoadedTemplate> {
    appLogger.info(`📦 Fallback: HierarchicalTemplateSource → ${normalizedKey}`);

    // ✅ FASE 1.2: Migrado para usar hierarchicalTemplateSource
    const result = await hierarchicalTemplateSource.getPrimary(normalizedKey);
    const stepBlocks = result?.data || [];
    
    if (!stepBlocks || stepBlocks.length === 0) {
      appLogger.warn(`⚠️ Step ${normalizedKey} não encontrado via hierarchicalTemplateSource`);
      return { blocks: [], source: 'ts-template' };
    }

    unifiedCache.set(stepBlocksKey(normalizedKey), stepBlocks);
    appLogger.info(`📦 HierarchicalSource → ${normalizedKey}: ${stepBlocks.length} blocos`);

    return { blocks: stepBlocks, source: 'ts-template' };
  }

  /**
   * Pré-carrega múltiplos steps em paralelo
   */
  async preloadSteps(steps: (number | string)[]): Promise<void> {
    await Promise.allSettled(
      steps.map(step => this.loadStep(step)),
    );
  }

  /**
   * ✅ FASE 2.4: Cache warming - carrega múltiplos steps em background
   * Útil para prefetch estratégico
   * 
   * @param stepIds - Array de step IDs (ex: ['step-01', 'step-02'])
   * @param mode - Modo de carregamento ('template' ou 'funnel')
   * @param id - Template ID ou Funnel ID (não usado diretamente, mas detectado via URL)
   */
  async warmCache(
    stepIds: string[],
    mode?: 'template' | 'funnel',
    id?: string
  ): Promise<{ loaded: number; cached: number; failed: number }> {
    const startTime = performance.now();
    const results = { loaded: 0, cached: 0, failed: 0 };

    appLogger.info(`🔥 [warmCache] Warming ${stepIds.length} steps...`);

    const promises = stepIds.map(async (stepId) => {
      try {
        // Verificar se já está em cache
        const cacheKey = stepBlocksKey(stepId);
        if (unifiedCache.has(cacheKey)) {
          results.cached++;
          return;
        }

        // Carregar step (detecta modo automaticamente se não fornecido)
        await this.loadStep(stepId);
        results.loaded++;
      } catch (error) {
        appLogger.warn(`⚠️ [warmCache] Falha ao carregar ${stepId}:`, { data: [error] });
        results.failed++;
      }
    });

    await Promise.allSettled(promises);

    const duration = performance.now() - startTime;
    appLogger.info(`✅ [warmCache] Completo em ${duration.toFixed(0)}ms:`, { data: [`${results.loaded} loaded, ${results.cached} cached, ${results.failed} failed`] });

    return results;
  }

  /**
   * Obtém métricas de performance (dev only)
   */
  getMetrics() {
    const avgLoadTime = this.metrics.loadTimes.length > 0
      ? this.metrics.loadTimes.reduce((a, b) => a + b, 0) / this.metrics.loadTimes.length
      : 0;

    const cacheHitRate = (this.metrics.cacheHits + this.metrics.cacheMisses) > 0
      ? (this.metrics.cacheHits / (this.metrics.cacheHits + this.metrics.cacheMisses)) * 100
      : 0;

    return {
      cacheHits: this.metrics.cacheHits,
      cacheMisses: this.metrics.cacheMisses,
      cacheHitRate: cacheHitRate.toFixed(1) + '%',
      avgLoadTime: avgLoadTime.toFixed(0) + 'ms',
      prefetchCount: this.metrics.prefetchCount,
      totalLoads: this.metrics.loadTimes.length,
    };
  }

  /**
   * Reset métricas (dev only)
   */
  resetMetrics(): void {
    this.metrics = {
      cacheHits: 0,
      cacheMisses: 0,
      loadTimes: [],
      prefetchCount: 0,
    };
  }

  /**
   * Limpa estado interno
   */
  clear(): void {
    this.masterTemplateRef = null;
    this.inFlightLoads.clear();
  }
}

export default TemplateLoader;
