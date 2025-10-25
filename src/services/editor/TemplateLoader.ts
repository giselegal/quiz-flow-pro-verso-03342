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
 * @version 1.0.0
 */

import { Block } from '@/types/editor';
import { QUIZ_STYLE_21_STEPS_TEMPLATE } from '@/templates/quiz21StepsComplete';
import { safeGetTemplateBlocks, blockComponentsToBlocks, convertTemplateToBlocks } from '@/utils/templateConverter';
import { loadStepTemplate, hasModularTemplate, hasStaticBlocksJSON } from '@/utils/loadStepTemplates';
import hydrateSectionsWithQuizSteps from '@/utils/hydrators/hydrateSectionsWithQuizSteps';
import { unifiedCache } from '@/utils/UnifiedTemplateCache';
import { masterTemplateKey, stepBlocksKey, masterBlocksKey, templateKey } from '@/utils/cacheKeys';
import { TemplateRegistry } from '@/services/TemplateRegistry';
import { TEMPLATE_SOURCES } from '@/config/templateSources';

export type TemplateSource =
  | 'normalized-json'
  | 'modular-json'
  | 'individual-json'
  | 'master-hydrated'
  | 'ts-template';

export interface LoadedTemplate {
  blocks: Block[];
  source: TemplateSource;
}

export class TemplateLoader {
  private masterTemplateRef: any | null = null;
  private loadingSteps = new Set<string>();

  /**
   * Utilitário: executa uma função assíncrona com retry + backoff exponencial simples.
   * Retorna null em caso de falha após todas as tentativas.
   */
  private async withRetry<T>(
    label: string,
    fn: () => Promise<T>,
    attempts = 3,
    initialDelayMs = 150
  ): Promise<T | null> {
    let lastErr: any = null;
    const start = performance.now?.() ?? Date.now();
    for (let i = 0; i < attempts; i++) {
      try {
        const res = await fn();
        const end = performance.now?.() ?? Date.now();
        console.log(`✅ ${label} ok (tentativa ${i + 1}/${attempts}, ${(end - start).toFixed(0)}ms)`);
        return res;
      } catch (err) {
        lastErr = err;
        console.warn(`⚠️ ${label} falhou (tentativa ${i + 1}/${attempts})`, err);
        if (i < attempts - 1) {
          const wait = initialDelayMs * Math.pow(2, i);
          await new Promise(r => setTimeout(r, wait));
        }
      }
    }
    const end = performance.now?.() ?? Date.now();
    console.error(`❌ ${label} esgotou tentativas (${attempts}) em ${(end - start).toFixed(0)}ms`, lastErr);
    return null;
  }

  /**
   * Carrega blocos para um step específico
   * Usa estratégias em cascata com retry logic
   */
  async loadStep(step: number | string): Promise<LoadedTemplate> {
    const normalizedKey = this.normalizeStepKey(step);

    // Proteção contra carregamento duplicado
    if (this.loadingSteps.has(normalizedKey)) {
      console.log(`⏭️ Skip: ${normalizedKey} já está sendo carregado`);
      throw new Error(`Step ${normalizedKey} already loading`);
    }

    this.loadingSteps.add(normalizedKey);

    try {
      console.group(`🔍 [TemplateLoader] ${normalizedKey}`);
      console.log('🎯 TEMPLATE_SOURCES:', TEMPLATE_SOURCES);

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

      // Estratégia 1: Cache unificado (somente se não forçar público)
      const cached = this.loadFromCache(normalizedKey);
      if (cached) return cached;

      // Estratégia 2: Master JSON público (PRIORIDADE quando flag ativa!)
      console.log('🔍 Verificando flag useMasterJSON:', TEMPLATE_SOURCES.useMasterJSON);
      if (TEMPLATE_SOURCES.useMasterJSON) {
        console.log('✅ Flag useMasterJSON está TRUE - tentando carregar master JSON...');
        const fromMaster = await this.loadFromMasterJSON(normalizedKey);
        if (fromMaster) {
          console.log(`🎉 Master JSON SUCCESS: ${fromMaster.blocks.length} blocos, source: ${fromMaster.source}`);
          return fromMaster;
        }
        console.warn('⚠️ loadFromMasterJSON retornou null - tentando outras fontes...');
      } else {
        console.warn('❌ Flag useMasterJSON está FALSE - pulando master JSON');
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
        const modular = this.loadModular(normalizedKey);
        if (modular) return modular;
      }

      // Estratégia 6: TypeScript template (fallback)
      console.warn('🔄 Caindo no fallback TypeScript template');
      return this.loadFromTypescript(normalizedKey);

    } finally {
      this.loadingSteps.delete(normalizedKey);
      console.groupEnd();
    }
  }

  /**
   * Estratégia: Carregar JSON individual público em public/templates/step-XX.json
   * - Tenta sufixo -v3.json e depois .json
   * - Converte para Block[] com mapeamentos e normalização de campos
   */
  private async loadFromPublicStepJSON(normalizedKey: string): Promise<LoadedTemplate | null> {
    try {
      const base = `/templates/${normalizedKey}`;
      // Ordem de tentativa:
      // 1) v3.1 blocks (public/templates/blocks/step-XX.json)
      // 2) v3 sections (public/templates/step-XX-v3.json)
      // 3) canônico (public/templates/step-XX.json)
      const urls = [
        `/templates/blocks/${normalizedKey}.json`,
        `${base}-v3.json`,
        `${base}.json`
      ];
      let data: any | null = null;

      for (const url of urls) {
        try {
          const bust = (typeof window !== 'undefined' && import.meta.env?.DEV) ? `?ts=${Date.now()}` : '';
          const resp = await fetch(url + bust, { cache: 'no-store' });
          if (resp.ok) {
            data = await resp.json();
            break;
          }
        } catch (e) {
          // tenta próxima URL
        }
      }

      if (!data) return null;

      // Detectar e extrair blocos
      let blocks: Block[] = [];
      const rawBlocks: any[] = Array.isArray(data?.blocks) ? data.blocks : [];

      if (rawBlocks.length) {
        // Caminho 1: JSON no formato blocks[]
        const typeMap: Record<string, string> = { CTAButton: 'cta-inline' };
        blocks = rawBlocks.map((b: any, idx: number) => ({
          id: String(b.id || `${normalizedKey}-block-${idx}`),
          type: (typeMap[b.type] || b.type || 'text-inline') as any,
          order: (b.order ?? b.position ?? b.index ?? idx) as number,
          // Suporte a múltiplas convenções: properties | props | config | options
          properties: (b.properties || b.props || b.config || b.options || {}) as Record<string, any>,
          content: (b.content || {}) as Record<string, any>
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
                content: {}
              });
              // Título
              if (p.titleHtml || p.title) {
                introBlocks.push({
                  id: `${normalizedKey}-intro-title`,
                  type: 'intro-title',
                  order: introBlocks.length,
                  properties: {},
                  content: { titleHtml: p.titleHtml || p.title }
                });
              }
              // Imagem
              if (p.imageUrl) {
                introBlocks.push({
                  id: `${normalizedKey}-intro-image`,
                  type: 'intro-image',
                  order: introBlocks.length,
                  properties: {},
                  content: { imageUrl: p.imageUrl, imageAlt: p.imageAlt }
                });
              }
              // Descrição/subtítulo
              if (p.subtitleHtml || p.subtitle) {
                introBlocks.push({
                  id: `${normalizedKey}-intro-description`,
                  type: 'intro-description',
                  order: introBlocks.length,
                  properties: {},
                  content: { text: p.subtitleHtml || p.subtitle }
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
                content: { formQuestion: p.questionLabel, namePlaceholder: p.placeholder, submitText: p.buttonText }
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
                { id: `${normalizedKey}-qnav`, type: 'quiz-navigation', order: 3, properties: { enableWhenValid: true }, content: {} }
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
                { id: `${normalizedKey}-transition-cta`, type: 'CTAButton', order: 2, properties: {}, content: { label: nextLabel, href: '#next', variant: 'primary', size: 'large' } }
              ] as any[];
            }
          }
        } catch (e) {
          console.warn('⚠️ Falha no adaptador de blocos para editor:', e);
        }
      } else if (Array.isArray(data?.sections)) {
        // Caminho 2: JSON v3 no formato sections[] → converter para Block[]
        try {
          const hydrated = {
            ...data,
            sections: hydrateSectionsWithQuizSteps(normalizedKey, data.sections)
          };
          const blocksComponents = safeGetTemplateBlocks(normalizedKey, { [normalizedKey]: hydrated });
          blocks = blockComponentsToBlocks(blocksComponents);
        } catch (e) {
          console.warn('⚠️ Falha ao converter sections→blocks para', normalizedKey, e);
          return null;
        }
      } else {
        return null;
      }

      unifiedCache.set(stepBlocksKey(normalizedKey), blocks);
      console.log(`📦 Public step JSON → ${normalizedKey}: ${blocks.length} blocos`);
      return { blocks, source: 'individual-json' };
    } catch (e) {
      console.warn('⚠️ Erro ao carregar JSON público individual:', normalizedKey, e);
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
        console.warn(`⚠️ [TemplateRegistry] Template não encontrado: ${normalizedKey}`);
        return null;
      }

      const stepTemplate = registry.get(normalizedKey);
      if (!stepTemplate) return null;

      // Converter template v3 (sections) para Block[]
      const blockComponents = convertTemplateToBlocks(stepTemplate);
      const blocks = blockComponentsToBlocks(blockComponents);

      unifiedCache.set(stepBlocksKey(normalizedKey), blocks);
      console.log(`📦 Registry → ${normalizedKey}: ${blocks.length} blocos`);
      return { blocks, source: 'modular-json' }; // CORRIGIDO: era 'ts-template'
    } catch (e) {
      console.warn('⚠️ Erro ao carregar do TemplateRegistry:', e);
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
   */
  private loadFromCache(normalizedKey: string): LoadedTemplate | null {
    try {
      const cachedStepBlocks =
        unifiedCache.get(stepBlocksKey(normalizedKey)) ||
        unifiedCache.get(masterBlocksKey(normalizedKey));

      if (Array.isArray(cachedStepBlocks) && cachedStepBlocks.length > 0) {
        console.log(`📦 Cache hit: ${normalizedKey} → ${cachedStepBlocks.length} blocos`);
        return {
          blocks: cachedStepBlocks as Block[],
          source: 'master-hydrated'
        };
      }
    } catch (e) {
      console.warn('⚠️ Erro ao ler cache:', e);
    }
    return null;
  }

  /**
   * Estratégia 2: Carregar de Master JSON com retry
   */
  private async loadFromMasterJSON(normalizedKey: string): Promise<LoadedTemplate | null> {
    try {
      console.log('🔍 [loadFromMasterJSON] Iniciando...');

      if (typeof window === 'undefined' || !window.location) {
        console.warn('⚠️ [loadFromMasterJSON] window ou window.location não disponível');
        return null;
      }

      // Carregar master JSON uma vez
      if (!this.masterTemplateRef) {
        console.log('🔍 [loadFromMasterJSON] Master JSON não está em memória, tentando carregar...');

        const cachedMaster = unifiedCache.get(masterTemplateKey());
        if (cachedMaster) {
          console.log('✅ [loadFromMasterJSON] Master JSON encontrado no cache');
          this.masterTemplateRef = cachedMaster;
        } else {
          console.log('🔍 [loadFromMasterJSON] Fazendo fetch de /templates/quiz21-complete.json...');

          // Retry com exponential backoff
          let lastError: any = null;
          for (let attempt = 0; attempt < 3; attempt++) {
            try {
              console.log(`🔍 [loadFromMasterJSON] Tentativa ${attempt + 1}/3...`);
              const resp = await fetch('/templates/quiz21-complete.json', {
                cache: 'force-cache'
              });

              console.log(`📊 [loadFromMasterJSON] Response status: ${resp.status}, ok: ${resp.ok}`);

              if (resp.ok) {
                this.masterTemplateRef = await resp.json();
                unifiedCache.set(masterTemplateKey(), this.masterTemplateRef);
                console.log(`✅ Master JSON carregado (tentativa ${attempt + 1})`);
                console.log(`📊 Steps no master:`, Object.keys(this.masterTemplateRef?.steps || {}).length);
                break;
              } else {
                lastError = new Error(`HTTP ${resp.status}`);
                console.warn(`⚠️ Tentativa ${attempt + 1}/3 falhou:`, resp.status);
              }
            } catch (err) {
              lastError = err;
              console.warn(`⚠️ Tentativa ${attempt + 1}/3 erro de rede:`, err);
            }
            if (attempt < 2) {
              await new Promise(resolve => setTimeout(resolve, 200 * Math.pow(2, attempt)));
            }
          }
          if (!this.masterTemplateRef) {
            console.error('❌ Falha ao carregar master JSON após 3 tentativas:', lastError);
            return null;
          }
        }
      } else {
        console.log('✅ [loadFromMasterJSON] Master JSON já estava em memória');
      }

      const master = this.masterTemplateRef;
      console.log('🔍 [loadFromMasterJSON] Procurando step:', normalizedKey);
      console.log('🔍 [loadFromMasterJSON] Steps disponíveis:', Object.keys(master?.steps || {}));

      const stepConfig = master?.steps?.[normalizedKey];
      if (!stepConfig) {
        console.warn(`⚠️ Master JSON carregado, mas step não encontrado: ${normalizedKey}`);
        return null;
      }

      console.log(`✅ [loadFromMasterJSON] Step ${normalizedKey} encontrado!`);
      console.log(`📊 [loadFromMasterJSON] Sections no step:`, stepConfig.sections?.length || 0);

      if (stepConfig) {
        const hydrated = {
          ...stepConfig,
          sections: hydrateSectionsWithQuizSteps(normalizedKey, stepConfig.sections)
        };
        const blockComponents = safeGetTemplateBlocks(normalizedKey, { [normalizedKey]: hydrated });
        const blocks = blockComponentsToBlocks(blockComponents);

        unifiedCache.set(masterBlocksKey(normalizedKey), blocks);
        unifiedCache.set(stepBlocksKey(normalizedKey), blocks);

        console.log(`📦 Master JSON → ${normalizedKey}: ${blocks.length} blocos`);
        return { blocks, source: 'master-hydrated' };
      }
    } catch (e) {
      console.error('❌ [loadFromMasterJSON] Erro crítico:', e);
      console.warn('⚠️ Erro ao carregar master JSON:', e);
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
        console.log(`📦 Normalized cache hit: ${normalizedKey}`);
        return { blocks: normalizedCache, source: 'normalized-json' };
      }

      // Loader com gate + retry/telemetria
      const mod = await this.withRetry('normalized:import', () => import('@/lib/normalizedLoader'));
      if (!mod) return null;

      const data = await this.withRetry('normalized:loadStep', () => mod.loadNormalizedStep(normalizedKey as any));
      if (!data) return null;

      if (data && Array.isArray((data as any).blocks)) {
        const blocks = (data as any).blocks.map((b: any, idx: number) => ({
          id: b.id || `block-${idx}`,
          type: (b.type || 'text-inline') as any,
          order: b.order ?? b.position ?? idx,
          properties: b.properties || b.props || {},
          content: b.content || {}
        })) as Block[];

        unifiedCache.set(templateKey(`normalized:${normalizedKey}`), blocks);
        unifiedCache.set(stepBlocksKey(normalizedKey), blocks);

        console.log(`📦 Normalized JSON → ${normalizedKey}: ${blocks.length} blocos`);
        return { blocks, source: 'normalized-json' };
      }
    } catch (e) {
      // Silent fail para gate disabled
      console.warn('⚠️ loadNormalized falhou (gate desabilitado ou erro não crítico):', e);
    }
    return null;
  }

  /**
   * Estratégia 4: Carregar templates modulares
   */
  private loadModular(normalizedKey: string): LoadedTemplate | null {
    try {
      if (!hasModularTemplate(normalizedKey)) {
        return null;
      }

      const blocks = loadStepTemplate(normalizedKey);
      console.log(`📦 Modular template → ${normalizedKey}: ${blocks.length} blocos`);

      unifiedCache.set(stepBlocksKey(normalizedKey), blocks);
      return { blocks, source: 'modular-json' };
    } catch (e) {
      console.warn('⚠️ Erro ao carregar template modular:', normalizedKey, e);
      return null;
    }
  }

  /**
   * Estratégia 5: Carregar de TypeScript template (fallback)
   */
  private loadFromTypescript(normalizedKey: string): LoadedTemplate {
    console.log(`📦 Fallback: TypeScript template → ${normalizedKey}`);

    const stepTemplate = QUIZ_STYLE_21_STEPS_TEMPLATE[normalizedKey];
    if (!stepTemplate) {
      console.warn(`⚠️ Step ${normalizedKey} não encontrado no template TS`);
      return { blocks: [], source: 'ts-template' };
    }

    const blockComponents = safeGetTemplateBlocks(normalizedKey, {
      [normalizedKey]: stepTemplate
    });
    const blocks = blockComponentsToBlocks(blockComponents);

    unifiedCache.set(stepBlocksKey(normalizedKey), blocks);
    console.log(`📦 TS template → ${normalizedKey}: ${blocks.length} blocos`);

    return { blocks, source: 'ts-template' };
  }

  /**
   * Pré-carrega múltiplos steps em paralelo
   */
  async preloadSteps(steps: (number | string)[]): Promise<void> {
    await Promise.allSettled(
      steps.map(step => this.loadStep(step))
    );
  }

  /**
   * Limpa estado interno
   */
  clear(): void {
    this.masterTemplateRef = null;
    this.loadingSteps.clear();
  }
}

export default TemplateLoader;
