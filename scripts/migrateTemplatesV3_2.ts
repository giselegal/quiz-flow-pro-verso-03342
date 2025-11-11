#!/usr/bin/env ts-node
/**
 * Migração automática de JSONs de steps v3.1 -> v3.2
 * Ações:
 *  - Atualiza templateVersion para "3.2"
 *  - Converte campos "config" em "content" quando apropriado
 *  - Remove duplicação config/properties
 *  - Renomeia tipos legacy conforme mapping
 *  - Garante que não haja tipos com ponto (.) exceto se ainda sem mapeamento (log de aviso)
 *  - Adiciona content{} vazio quando ausente
 *  - Atualiza master.v3.json
 */

import fs from 'fs';
import path from 'path';

interface Block { id: string; type: string; config?: any; properties?: any; content?: any; [k: string]: any }
interface StepFile { templateVersion?: string; blocks?: Block[]; [k: string]: any }

const stepsDir = path.join(process.cwd(), 'public', 'templates', 'funnels', 'quiz21StepsComplete', 'steps');
const masterFile = path.join(process.cwd(), 'public', 'templates', 'funnels', 'quiz21StepsComplete', 'master.v3.json');

// Mapping definitivo (pode ser extendido depois)
const TYPE_MAPPING: Record<string, string> = {
  'hero-block': 'intro-title', // substituímos por blocos atômicos; título é o mais genérico
  'welcome-form-block': 'intro-form',
  'transition.next': 'transition-hero',
  'result.headline': 'result-main',
  'result.secondaryList': 'result-secondary-styles',
  'offer.core': 'cta-inline', // opção simples; poderia ser 'pricing'
  'offer.urgency': 'urgency-timer-inline',
  'offer.testimonial': 'testimonials',
  'option-grid': 'options-grid',
  'question-block': 'question-hero',
};

// Campos que devem ir para content (se existirem em config)
const CONTENT_KEYS = new Set([
  'title','titleHtml','subtitle','subtitleHtml','message','paragraphs','buttonLabel','questionLabel','placeholder','required',
  'questionText','questionNumber','options','imageUrl','imageAlt','logoUrl','logoAlt','deadlineISO','quote','author','prefix','highlight','showSecondary','max','ctaLabel','ctaUrl','accent','requiredSelections','width'
]);

function migrateBlock(block: Block): Block {
  const originalType = block.type;
  if (TYPE_MAPPING[originalType]) {
    block.type = TYPE_MAPPING[originalType];
  }

  // Se já possui content e não tem config, ok
  if (!block.content) block.content = {};

  if (block.config && typeof block.config === 'object') {
    // Copiar config para content/properties conforme chave
    for (const [key, value] of Object.entries(block.config)) {
      if (CONTENT_KEYS.has(key)) {
        if (block.content[key] === undefined) {
          block.content[key] = value;
        }
      } else {
        // Se não é campo de content, manter em properties se ainda não existir
        if (!block.properties) block.properties = {};
        if (block.properties[key] === undefined) {
          block.properties[key] = value;
        }
      }
    }
    // Remover config após migração
    delete block.config;
  }

  // Se properties duplica os campos de CONTENT_KEYS, podemos deixar (útil para editor) – não removemos para evitar quebrar fluxo

  // Aviso para tipos ainda com ponto sem mapeamento
  if (block.type.includes('.') && !TYPE_MAPPING[originalType]) {
    console.warn(`⚠️  Tipo com ponto não mapeado: ${originalType} (mantido como ${block.type})`);
  }

  return block;
}

function migrateStepFile(filePath: string): void {
  const raw = fs.readFileSync(filePath, 'utf-8');
  let data: StepFile;
  try { data = JSON.parse(raw); } catch (e) { console.error(`❌ JSON inválido em ${filePath}:`, e); return; }
  if (!Array.isArray(data.blocks)) { console.warn(`⚠️  Sem blocks em ${filePath}`); return; }

  let changed = false;

  if (data.templateVersion !== '3.2') {
    data.templateVersion = '3.2';
    changed = true;
  }

  data.blocks = data.blocks.map(b => {
    const before = JSON.stringify(b);
    const migrated = migrateBlock({ ...b });
    if (JSON.stringify(migrated) !== before) changed = true;
    return migrated;
  });

  if (changed) {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
    console.log(`✅ Migrado: ${path.basename(filePath)}`);
  } else {
    console.log(`↔️  Sem mudanças: ${path.basename(filePath)}`);
  }
}

function migrateMaster(filePath: string) {
  if (!fs.existsSync(filePath)) return;
  const raw = fs.readFileSync(filePath, 'utf-8');
  let data: any; try { data = JSON.parse(raw); } catch (e) { console.error('❌ master.v3.json inválido', e); return; }
  let changed = false;
  if (data.templateVersion !== '3.2') { data.templateVersion = '3.2'; changed = true; }
  if (typeof data.description === 'string' && !data.description.includes('v3.2')) {
    data.description = 'Master JSON V3.2 com 21 steps em formato blocks[] normalizado';
    changed = true;
  }
  if (changed) {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
    console.log('✅ Migrado: master.v3.json');
  } else {
    console.log('↔️  Sem mudanças: master.v3.json');
  }
}

function run() {
  if (!fs.existsSync(stepsDir)) { console.error('❌ Diretório de steps não encontrado:', stepsDir); process.exit(1); }
  const files = fs.readdirSync(stepsDir).filter(f => f.endsWith('.json'));
  console.log(`🛠️  Iniciando migração de ${files.length} steps...`);
  files.forEach(f => migrateStepFile(path.join(stepsDir, f)));
  migrateMaster(masterFile);
  console.log('🏁 Migração concluída.');
}

run();
