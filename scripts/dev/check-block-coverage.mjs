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
  const slice = txt.slice(objStart);
  const re = /['`]([a-zA-Z0-9_.*-]+)['`]\s*:/g; // chaves do objeto
  const out = new Set();
  let m;
  while ((m = re.exec(slice)) !== null) {
    const key = m[1];
    if (key && !key.includes('*')) out.add(key);
  }
  return Array.from(out).sort();
}

function main() {
  const usedRaw = collectTemplateTypes();

  // Opção: normalizar tipos via mapeamento conhecido (reduz falsos positivos)
  // Use: node scripts/dev/check-block-coverage.mjs --normalize
  const shouldNormalize = process.argv.includes('--normalize');

  // Subconjunto essencial do BLOCK_TYPE_MAP (alinhado com src/utils/blockTypeMapper.ts)
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

    // Perguntas
    'question-progress': 'question-progress',
    'question-number': 'question-number',
    'question-text': 'question-text',
    'question-instructions': 'question-instructions',
    'question-navigation': 'question-navigation',
    'options-grid': 'options-grid',

    // Transição
    'transition-hero': 'transition-hero',
    'transition-title': 'transition-title',
    'transition-text': 'transition-text',
  };

  const mapType = (t) => BLOCK_TYPE_MAP[t] || t;
  const used = shouldNormalize ? Array.from(new Set(usedRaw.map(mapType))).sort() : usedRaw;
  const schemas = collectSchemaTypes();
  const registry = collectRegistryTypes();

  const noSchema = used.filter(t => !schemas.includes(t));
  const noRegistry = used.filter(t => !registry.includes(t));

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

  if (noSchema.length || noRegistry.length) {
    process.exitCode = 1;
  }
}

main();
