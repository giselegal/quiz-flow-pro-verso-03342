#!/usr/bin/env node
/**
 * Verifica cobertura de tipos de blocos:
 * - Coleta todos os tipos usados nos templates (JSON/TS) por regex simples
 * - Compara com tipos registrados no SchemaAPI (src/config/schemas/dynamic.ts)
 * - Compara com chaves do EnhancedBlockRegistry (src/components/editor/blocks/EnhancedBlockRegistry.tsx)
 * Saída: lista de tipos sem schema e/ou sem componente.
 */
import fs from 'fs';
import path from 'path';

const ROOT = process.cwd();

function readFileSafe(p) {
  try { return fs.readFileSync(p, 'utf8'); } catch { return ''; }
}

function walk(dir, exts = ['.json', '.ts', '.tsx']) {
  const out = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      out.push(...walk(full, exts));
    } else if (exts.includes(path.extname(entry.name))) {
      out.push(full);
    }
  }
  return out;
}

function collectTemplateTypes() {
  const candidates = [
    path.join(ROOT, 'public'),
    path.join(ROOT, 'src', 'templates'),
    path.join(ROOT, 'src', 'data'),
  ].filter(p => fs.existsSync(p));

  const typeSet = new Set();
  const typeRegexes = [
    /"type"\s*:\s*"([^"]+)"/g, // JSON/TS simples
    /type:\s*'([^']+)'/g,          // TS objetos
  ];

  for (const base of candidates) {
    for (const file of walk(base)) {
      const txt = readFileSafe(file);
      if (!txt) continue;
      for (const re of typeRegexes) {
        let m;
        while ((m = re.exec(txt)) !== null) {
          const t = String(m[1]).trim();
          if (t && !t.includes('${')) typeSet.add(t);
        }
      }
    }
  }
  return Array.from(typeSet).sort();
}

function collectSchemaTypes() {
  const dyn = path.join(ROOT, 'src', 'config', 'schemas', 'dynamic.ts');
  const txt = readFileSafe(dyn);
  const re = /registerSchema\(\s*['"]([^'"]+)['"]/g;
  const out = new Set();
  let m;
  while ((m = re.exec(txt)) !== null) out.add(m[1]);
  return Array.from(out).sort();
}

function collectRegistryTypes() {
  const reg = path.join(ROOT, 'src', 'components', 'editor', 'blocks', 'EnhancedBlockRegistry.tsx');
  const txt = readFileSafe(reg);
  const objStart = txt.indexOf('export const ENHANCED_BLOCK_REGISTRY');
  if (objStart < 0) return [];
  // Isolar apenas o literal do objeto do registro para evitar falsos positivos
  const afterConst = txt.slice(objStart);
  const firstBrace = afterConst.indexOf('{');
  if (firstBrace < 0) return [];
  let depth = 0;
  let endIdx = -1;
  for (let i = firstBrace; i < afterConst.length; i++) {
    const ch = afterConst[i];
    if (ch === '{') depth++;
    else if (ch === '}') {
      depth--;
      if (depth === 0) { endIdx = i; break; }
    }
  }
  if (endIdx < 0) return [];
  const objLiteral = afterConst.slice(firstBrace, endIdx + 1);

  // Capturar chaves com e sem aspas: 'key':, "key":, key:
  const reQuoted = /['"]([a-zA-Z0-9_.*-]+)['"]\s*:/g;
  const reBare = /\b([a-zA-Z_][a-zA-Z0-9_-]*)\s*:/g;

  const out = new Set();
  let m;
  while ((m = reQuoted.exec(objLiteral)) !== null) {
    const key = m[1];
    if (key && !key.includes('*')) out.add(key);
  }
  while ((m = reBare.exec(objLiteral)) !== null) {
    const key = m[1];
    // Evitar capturar palavras reservadas comuns do objeto que não são chaves reais de bloco
    // mas mantemos nomes simples como benefits, guarantee, etc.
    if (key && !key.includes('*')) out.add(key);
  }
  return Array.from(out).sort();
}

function collectRendererTypes() {
  // Considerar tipos suportados diretamente pelo BlockTypeRenderer (switch/case)
  const p = path.join(ROOT, 'src', 'components', 'editor', 'quiz', 'renderers', 'BlockTypeRenderer.tsx');
  const txt = readFileSafe(p);
  if (!txt) return [];
  const re = /case\s+['"]([^'\"]+)['"]\s*:/g;
  const out = new Set();
  let m;
  while ((m = re.exec(txt)) !== null) {
    const key = m[1];
    if (key && !key.includes('*')) out.add(key);
  }
  return Array.from(out).sort();
}

function collectUniversalRendererTypes() {
  const p = path.join(ROOT, 'src', 'components', 'editor', 'blocks', 'UniversalBlockRenderer.tsx');
  const txt = readFileSafe(p);
  const objStart = txt.indexOf('const BlockComponentRegistry');
  if (objStart < 0) return [];
  const afterConst = txt.slice(objStart);
  const firstBrace = afterConst.indexOf('{');
  if (firstBrace < 0) return [];
  let depth = 0;
  let endIdx = -1;
  for (let i = firstBrace; i < afterConst.length; i++) {
    const ch = afterConst[i];
    if (ch === '{') depth++;
    else if (ch === '}') {
      depth--;
      if (depth === 0) { endIdx = i; break; }
    }
  }
  if (endIdx < 0) return [];
  const objLiteral = afterConst.slice(firstBrace, endIdx + 1);
  const reQuoted = /['"]([a-zA-Z0-9_.*-]+)['"]\s*:/g;
  const reBare = /\b([a-zA-Z_][a-zA-Z0-9_-]*)\s*:/g;
  const out = new Set();
  let m;
  while ((m = reQuoted.exec(objLiteral)) !== null) {
    const key = m[1];
    if (key && !key.includes('*')) out.add(key);
  }
  while ((m = reBare.exec(objLiteral)) !== null) {
    const key = m[1];
    if (key && !key.includes('*')) out.add(key);
  }
  return Array.from(out).sort();
}

function loadAliasMap() {
  try {
    const p = path.join(ROOT, 'src', 'config', 'block-aliases.json');
    if (fs.existsSync(p)) {
      const txt = fs.readFileSync(p, 'utf8');
      return JSON.parse(txt) || {};
    }
  } catch (e) {
    console.warn('⚠️ Falha ao carregar block-aliases.json:', e);
  }
  return {};
}

function main() {
  const usedRaw = collectTemplateTypes();

  // Opção: normalizar tipos via mapeamento conhecido (reduz falsos positivos)
  // Use: node scripts/dev/check-block-coverage.mjs --normalize
  const shouldNormalize = process.argv.includes('--normalize');

  // Subconjunto essencial do BLOCK_TYPE_MAP (alinhado com src/utils/blockTypeMapper.ts) + aliases genéricos
  const BLOCK_TYPE_MAP = {
    // Seções v3 → blocos atômicos/registry
    HeroSection: 'result-congrats',
    StyleProfileSection: 'result-main',
    TransformationSection: 'benefits',
    MethodStepsSection: 'benefits',
    BonusSection: 'benefits',
    SocialProofSection: 'testimonials',
    OfferSection: 'offer-hero',
    GuaranteeSection: 'guarantee',
    ResultCalculationSection: 'result-calculation',

    // Variantes comuns
    'result-card': 'result-card',
    'result-header': 'result-congrats',

    // CTA genérico
    CTAButton: 'cta-inline',
    ctabutton: 'cta-inline',
    'cta-section-inline': 'cta-inline',

    // Perguntas
    'question-progress': 'question-progress',
    'question-number': 'question-number',
    'question-text': 'question-text',
    'question-instructions': 'question-instructions',
    'question-navigation': 'question-navigation',
    'options-grid': 'options-grid',
    'options grid': 'options-grid',
    'option-grid': 'options-grid',
    options: 'options-grid',
    question: 'question-text',
    'quiz-question': 'question-text',
    'quiz-options-grid': 'options-grid',

    // Transição
    'transition-hero': 'transition-hero',
    'transition-title': 'transition-title',
    'transition-text': 'transition-text',
    transition: 'transition-title',
    'transition-result': 'transition-hero',
    'transition-loader': 'transition-loader',
    'transition-progress': 'transition-progress',

    // Conteúdo genérico → blocos atômicos
    header: 'heading-inline',
    title: 'heading-inline',
    subtitle: 'text-inline',
    description: 'text-inline',
    paragraph: 'text-inline',
    footer: 'legal-notice',
    logo: 'image-inline',
    'image-display': 'image-inline',
    progress: 'progress-inline',
    'progress-bar': 'progress-inline',
    loading: 'transition-loader',
    spinner: 'transition-loader',

    // Oferta/Resultado genéricos
    offer: 'offer-hero',
    'offer-header': 'offer-hero',
    'offer-hero-section': 'offer-hero',
    'result-display': 'result-main',
    result: 'result-main',
    'result-offer': 'offer-hero',
    'result-card-inline': 'result-card',
    'result.headline': 'result-congrats',
    'result.secondaryList': 'result-secondary-styles',

    // Aliases diversos
    headline: 'heading-inline',
    'heading-inline': 'heading-inline',
    heading: 'heading-inline',
    'quiz-progress': 'progress-inline',
    'quiz-button': 'button-inline',
    'lead-form': 'lead-form',
    // Ofertas: aliases observados
    'offer-faq-section': 'offer-faq-section',
    'offer-guarantee-section': 'guarantee',
    'offer-problem-section': 'benefits',
    'offer-product-showcase': 'result-style',
    'offer-solution-section': 'benefits',
    'offer.testimonial': 'testimonials',
    // Preços
    price: 'pricing',
    'pricing-card': 'pricing',
    // Social proof/testemunhos
    'social-proof': 'testimonials',
    testimonial: 'testimonial-card-inline',
    'testimonial-card': 'testimonial-card-inline',
    'testimonials-inline': 'testimonials',
    // Perguntas/estratégico
    'question-block': 'question-text',
    strategic: 'strategic-question',
    'strategic-question-main': 'strategic-question',
    // Outros
    faq: 'offer-faq-section',
    video: 'image-inline',
    'welcome-form-block': 'intro-form',
    'transition.next': 'transition-title',
    'quiz-offer-pricing-inline': 'offer-pricing-table',
    'style-card': 'style-card-inline',
    // Forms/dados
    survey: 'lead-form',
    'quiz-demographic': 'lead-form',
    input: 'form-input',
    'name-input': 'form-input',
    // Ícones/visuais
    'badge-inline': 'decorative-bar-inline',
    cover: 'image-inline',
    gradient: 'gradient-animation',
    // Intro/Hero
    intro: 'intro-logo-header',
    'hero-block': 'intro-logo-header',
    // Mentoria/real data
    'mentor-component-real': 'mentor-section-inline',
    'motivation-component-real': 'mentor-section-inline',
    'guarantee-component-real': 'guarantee',
    // Ofertas adicionais
    'step-21-offer': 'offer-hero',
    // Estratégico/estatística
    'quiz-strategic': 'strategic-question',
    'stat-inline': 'text-inline',
    // Testemunhos/benefícios
    'testimonials-component-real': 'testimonials',
    'value-stack-inline': 'benefits',
  };

  // Mescla aliases centralizados (quando existir) para evitar drift
  try {
    const externalAliases = loadAliasMap();
    Object.assign(BLOCK_TYPE_MAP, externalAliases);
  } catch (e) {
    console.warn('⚠️ Não foi possível mesclar block-aliases.json no BLOCK_TYPE_MAP:', e);
  }

  const IGNORE_TYPES = new Set([
    // Palavras que aparecem como "type" em outras estruturas (não são block types)
    'image/x-icon',
    'required',
    'both',
    'singleChoice',
    'multipleChoice',
    // valores de estilo (não são blocos)
    'romântico', 'elegante', 'natural', 'classico', 'criativo', 'dramático', 'sexy', 'highest', 'solid', 'fade', 'scale', 'slideUp',
    // mais termos que aparecem como metadados de seleção
    'selection', 'single-choice', 'multiple', 'multiple-choice', 'scored',
  ]);

  const isPlausibleBlockType = (t) => {
    if (!t || IGNORE_TYPES.has(t)) return false;
    if (BLOCK_TYPE_MAP[t]) return true;
    // V3 sections com PascalCase reconhecidas
    if (/^[A-Z][A-Za-z]+Section$/.test(t)) return true;
    // Tipos canônicos com kebab-case e opcionais namespaces com ponto
    if (/^[a-z0-9-]+(\.[a-z0-9-]+)?$/.test(t)) return true;
    return false;
  };

  const mapType = (t) => BLOCK_TYPE_MAP[t] || t;
  const filtered = usedRaw.filter(isPlausibleBlockType);
  const used = shouldNormalize ? Array.from(new Set(filtered.map(mapType))).sort() : filtered;
  
  // Allowlists para reduzir falsos positivos
  const NO_SCHEMA_REQUIRED = new Set([
    'text-inline','image-inline','button-inline','cta-inline','heading-inline','headline','headline-inline',
    'progress-inline','decorative-bar-inline','image-display-inline',
    'offer-header','offer-hero','offer-pricing-table','offer-faq-section','guarantee',
    'options-grid','question-text','question-number','question-progress','question-instructions','question-navigation',
    'transition-title','transition-text','transition-loader','transition-progress',
    'result-card','result-header-inline','result-congrats','result-secondary-styles','result-display',
    'lead-form','form-input','style-card-inline','testimonial-card-inline','testimonials'
  ]);
  const ALLOW_MISSING_REGISTRY = new Set([
    'badge-inline','before-after-component-real','bonus-component-real','bonus-list-inline','category-points','countdown',
    'cover','gradient','mentor-component-real','motivation-component-real','name-input','quiz-demographic','quiz-step',
    'quiz-strategic','stat-inline','step-21-offer','survey','testimonials-component-real','value-stack-inline'
  ]);
  const schemas = collectSchemaTypes();
  const registry = Array.from(new Set([
    ...collectRegistryTypes(),
    ...collectRendererTypes(),
    ...collectUniversalRendererTypes(),
  ])).sort();

  const noSchemaRaw = used.filter(t => !schemas.includes(t));
  const noRegistryRaw = used.filter(t => !registry.includes(t));
  const noSchema = noSchemaRaw.filter(t => !NO_SCHEMA_REQUIRED.has(t));
  const noRegistry = noRegistryRaw.filter(t => !ALLOW_MISSING_REGISTRY.has(t));

  const report = {
    summary: {
      used: used.length,
      schemas: schemas.length,
      registry: registry.length,
      missingSchema: noSchema.length,
      missingRegistry: noRegistry.length,
    },
    missing: {
      schema: noSchema,
      registry: noRegistry,
    },
  };

  console.log('📊 Block Coverage Report');
  console.log(JSON.stringify(report, null, 2));

  // Considerar apenas faltas de registro como bloqueantes; schemas podem ser opcionais para blocos inline
  if (noRegistry.length) {
    process.exitCode = 1;
  }
}

main();
