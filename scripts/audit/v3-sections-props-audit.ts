#!/usr/bin/env tsx
/**
 * Audit: Props das Sections v3 nos templates vs SchemaAPI
 * - Varre public/templates/step-*-v3.json
 * - Coleta chaves de props.* por tipo de Section
 * - Aplica flatten para gerar camelCase combinado (ex.: colors.greeting -> colorsGreeting)
 * - Compara com propriedades registradas no SchemaAPI para o tipo
 * - Emite relatório de chaves faltantes no schema e chaves extras do schema não vistas nos templates
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { initializeSchemaRegistry, SchemaAPI } from '../../src/config/schemas';

type SectionPropsUnion = Record<string, Set<string>>; // type -> keys

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT = path.resolve(__dirname, '../../');
const TEMPLATES_DIR = path.join(ROOT, 'public', 'templates');

function isPlainObject(v: any) {
  return v && typeof v === 'object' && !Array.isArray(v);
}

function camelJoin(parent: string, key: string) {
  if (!parent) return key;
  return parent + key.charAt(0).toUpperCase() + key.slice(1);
}

// Flatten com estratégia de concatenação em camelCase (sem detalhar arrays)
function flattenPropsKeys(obj: any, parent = ''): string[] {
  const out: string[] = [];
  if (!isPlainObject(obj)) return out;
  for (const [k, v] of Object.entries(obj)) {
    const name = camelJoin(parent, k);
    if (Array.isArray(v)) {
      // para arrays, consideramos apenas a chave raiz (ex.: testimonials, items, steps)
      out.push(name);
      continue;
    }
    if (isPlainObject(v)) {
      // descer recursivamente
      const nested = flattenPropsKeys(v, name);
      if (nested.length === 0) out.push(name);
      out.push(...nested);
    } else {
      out.push(name);
    }
  }
  return Array.from(new Set(out));
}

async function main() {
  await initializeSchemaRegistry();
  const files = fs
    .readdirSync(TEMPLATES_DIR)
    .filter((f) => /^step-.*-v3\.json$/i.test(f))
    .map((f) => path.join(TEMPLATES_DIR, f))
    .sort();

  const unionByType: SectionPropsUnion = {};

  for (const file of files) {
    try {
      const raw = fs.readFileSync(file, 'utf-8');
      const json = JSON.parse(raw);
      const sections: any[] = Array.isArray(json.sections) ? json.sections : [];
      for (const s of sections) {
        const type: string = s?.type;
        if (!type) continue;
        const props = s?.props;
        if (!isPlainObject(props)) continue;
        const keys = flattenPropsKeys(props);
        if (!unionByType[type]) unionByType[type] = new Set();
        keys.forEach((k) => unionByType[type].add(k));
      }
    } catch (e) {
      console.error('Erro ao ler template:', file, e);
    }
  }

  const types = Object.keys(unionByType).sort();
  const report: any[] = [];

  for (const type of types) {
    const templateKeys = Array.from(unionByType[type]).sort();
    let schemaKeys: string[] = [];
    if (SchemaAPI.has(type)) {
      const schema: any = await SchemaAPI.get(type as any);
      schemaKeys = Array.isArray(schema?.properties) ? schema.properties.map((p: any) => p.key) : [];
    } else if (type === 'CTAButton' && SchemaAPI.has('CTAButton')) {
      const schema: any = await SchemaAPI.get('CTAButton' as any);
      schemaKeys = Array.isArray(schema?.properties) ? schema.properties.map((p: any) => p.key) : [];
    }

    const schemaSet = new Set(schemaKeys);
    const missingInSchema = templateKeys.filter((k) => !schemaSet.has(k));

    const templateSet = new Set(templateKeys);
    const extraInSchema = schemaKeys.filter((k) => !templateSet.has(k));

    report.push({ type, templateKeys, schemaKeys, missingInSchema, extraInSchema });
  }

  // Impressão amigável
  console.log('=== V3 Sections Props Audit ===');
  for (const item of report) {
    const { type, missingInSchema, extraInSchema } = item;
    const missingCount = missingInSchema.length;
    const extraCount = extraInSchema.length;
    console.log(`\n• ${type}`);
    if (missingCount === 0) console.log('  ✅ Sem faltas no schema');
    else {
      console.log(`  ❌ Faltando no schema:\n   - ${missingInSchema.join('\n   - ')}`);
    }
    if (extraCount > 0) {
      console.log('  ℹ️  Presentes no schema e não vistos nos templates (ok):\n   - ' + extraInSchema.join('\n   - '));
    }
  }

  // Resumo
  const totalMissing = report.reduce((acc, r) => acc + r.missingInSchema.length, 0);
  console.log(`\nResumo: tipos analisados=${types.length}, total de chaves faltantes=${totalMissing}`);
  process.exit(0);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
