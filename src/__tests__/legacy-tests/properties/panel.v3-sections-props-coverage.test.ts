import { describe, it, expect, beforeAll } from 'vitest';
import fs from 'fs';
import path from 'path';
import { initializeSchemaRegistry, SchemaAPI } from '@/config/schemas';

interface Section { type: string; props?: Record<string, any>; }

const V3_SECTION_TYPES = [
  'HeroSection',
  'StyleProfileSection',
  'ResultCalculationSection',
  'MethodStepsSection',
  'BonusSection',
  'SocialProofSection',
  'OfferSection',
  'GuaranteeSection',
  'TransformationSection',
] as const;

function listV3Templates() {
  const dir = path.resolve(__dirname, '../../../public/templates');
  return fs.readdirSync(dir).filter(f => /step-\d{2}-v3\.json$/.test(f)).map(f => path.join(dir, f));
}

function readSectionsWithProps(): Section[] {
  const files = listV3Templates();
  const acc: Section[] = [];
  for (const file of files) {
    try {
      const json = JSON.parse(fs.readFileSync(file, 'utf-8'));
      const sections: any[] = Array.isArray(json.sections) ? json.sections : [];
      sections.forEach((s) => { if (s && typeof s === 'object') acc.push({ type: s.type, props: s.props }); });
    } catch {}
  }
  return acc;
}

function toFlatKey(pathSegs: string[]): string {
  if (pathSegs.length === 0) return '';
  const [head, ...tail] = pathSegs;
  return head + tail.map(s => s.charAt(0).toUpperCase() + s.slice(1)).join('');
}

function collectFlattenedKeys(obj: any, basePath: string[] = [], out: Set<string> = new Set()): Set<string> {
  if (!obj || typeof obj !== 'object') return out;
  for (const [key, val] of Object.entries(obj)) {
    if (Array.isArray(val)) {
      // Para arrays, exigimos apenas a existência do campo da lista na UI (options-list)
      out.add(toFlatKey([...basePath, key]));
      // não desce para itens
      continue;
    }
    if (val && typeof val === 'object') {
      collectFlattenedKeys(val, [...basePath, key], out);
    } else {
      out.add(toFlatKey([...basePath, key]));
    }
  }
  return out;
}

describe('Sections v3 - Cobertura de props (flatten 1:1)', () => {
  beforeAll(() => initializeSchemaRegistry());

  it('todas as chaves de props vistas nos templates possuem correspondência no SchemaAPI (flatten)', async () => {
    const sections = readSectionsWithProps().filter(s => V3_SECTION_TYPES.includes(s.type as any));
    const byType: Record<string, Set<string>> = {};
    for (const s of sections) {
      const flat = collectFlattenedKeys(s.props || {});
      if (!byType[s.type]) byType[s.type] = new Set();
      flat.forEach(k => byType[s.type].add(k));
    }

    const failures: string[] = [];

    for (const type of Object.keys(byType)) {
      const schema = await SchemaAPI.get(type);
      if (!schema) { failures.push(`${type}: schema inexistente`); continue; }
      const keys = Array.from(byType[type]);
      const schemaKeys = new Set((schema.properties || []).map((p: any) => p.key));

      // Mapeamentos específicos onde o schema usa aliases diferentes dos originais do template
      const alias = (k: string): string => {
        // Mapeamentos específicos por tipo
        if (type === 'ResultCalculationSection') {
          if (k.startsWith('scoreMapping')) return 'scoreMapping';
          if (k.startsWith('resultLogic')) return 'resultLogic';
          if (k.startsWith('leadCapture')) return 'leadCapture';
        }
        if (type === 'StyleProfileSection') {
          if (k === 'introTextEnabled') return 'showIntroText';
        }
        if (type === 'OfferSection') {
          if (k === 'pricingDiscountShow') return 'discountShow';
          if (k === 'pricingDiscountPercentage') return 'discountPercentage';
          if (k === 'pricingDiscountLabel') return 'discountLabel';
          if (k === 'pricingDiscountStyle') return 'discountStyle';
          if (k === 'pricingDiscountColor') return 'discountColor';
        }
        if (type === 'SocialProofSection') {
          if (k === 'cardStyleShowStars') return 'cardStyleShowStars'; // já mapeado
        }
        return k; // fallback: flatten direto
      };

      for (const k of keys) {
        const a = alias(k);
        if (!schemaKeys.has(a)) {
          failures.push(`${type}: chave ausente no schema -> ${k} (flatten=${a})`);
        }
      }
    }

    expect(failures, failures.join('\n')).toEqual([]);
  });
});
