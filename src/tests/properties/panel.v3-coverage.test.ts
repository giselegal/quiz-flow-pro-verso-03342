import { describe, it, expect, beforeAll } from 'vitest';
import fs from 'fs';
import path from 'path';
import { initializeSchemaRegistry, SchemaAPI } from '@/config/schemas';

interface Section {
  type: string;
  id?: string;
  content?: Record<string, any>;
  style?: Record<string, any>;
}

function readV3Sections(): Section[] {
  const dir = path.resolve(__dirname, '../../../public/templates');
  const files = fs.readdirSync(dir).filter(f => /step-\d{2}-v3\.json$/.test(f));
  const sections: Section[] = [];
  for (const file of files) {
    const json = JSON.parse(fs.readFileSync(path.join(dir, file), 'utf-8'));
    const list = Array.isArray(json.sections) ? json.sections : [];
    list.forEach((s: any) => sections.push(s as Section));
  }
  return sections;
}

function uniqueTypes(sections: Section[]): string[] {
  return Array.from(new Set(sections.map(s => s.type))).sort();
}

function collectUsedKeysByType(sections: Section[]): Record<string, { content: Set<string>; style: Set<string> }> {
  const map: Record<string, { content: Set<string>; style: Set<string> }> = {};
  for (const s of sections) {
    if (!map[s.type]) map[s.type] = { content: new Set(), style: new Set() };
    const c = s.content && typeof s.content === 'object' ? Object.keys(s.content) : [];
    const st = s.style && typeof s.style === 'object' ? Object.keys(s.style) : [];
    c.forEach(k => map[s.type].content.add(k));
    st.forEach(k => map[s.type].style.add(k));
  }
  return map;
}

function getSchemaKeys(schema: any): Set<string> {
  const props = Array.isArray(schema?.properties) ? schema.properties : [];
  const keys = new Set<string>();
  for (const p of props) {
    if (p && typeof p.key === 'string') keys.add(p.key);
  }
  return keys;
}

describe('Cobertura do Properties Panel para componentes do JSON v3', () => {
  let sections: Section[];
  let byType: Record<string, { content: Set<string>; style: Set<string> }>;
  let types: string[];

  beforeAll(() => {
    initializeSchemaRegistry();
    sections = readV3Sections();
    byType = collectUsedKeysByType(sections);
    types = uniqueTypes(sections);
  });

  it('lista os componentes únicos usados no JSON v3', () => {
    expect(types.length).toBeGreaterThan(0);
    // Log para depuração local (não falha):
    // console.log('Componentes v3:', types);
  });

  it('cada tipo do v3 possui schema registrado no SchemaAPI', async () => {
    const missing: string[] = [];
    for (const t of types) {
      if (!SchemaAPI.has(t)) missing.push(t);
    }
    expect(missing, `Tipos sem schema: ${missing.join(', ')}`).toEqual([]);
  });

  it('campos de conteúdo usados no v3 estão cobertos pelos schemas (content coverage)', async () => {
    const failures: string[] = [];
    for (const t of types) {
      const schema = await SchemaAPI.get(t);
      if (!schema) {
        failures.push(`${t}: schema não encontrado`);
        continue;
      }
      const schemaKeys = getSchemaKeys(schema);
      const usedContent = Array.from(byType[t]?.content || []);
      const missingContent = usedContent.filter(k => !schemaKeys.has(k));
      if (missingContent.length > 0) {
        failures.push(`${t}: faltam campos de conteúdo [${missingContent.join(', ')}]`);
      }
    }
    expect(failures, failures.join('\n')).toEqual([]);
  });

  it('campos de estilo usados no v3 estão preferencialmente cobertos (style coverage - advisory)', async () => {
    // Este teste é informativo: não falha build; apenas alerta se houver lacunas.
    const advisories: string[] = [];
    for (const t of types) {
      const schema = await SchemaAPI.get(t);
      if (!schema) continue;
      const schemaKeys = getSchemaKeys(schema);
      const usedStyle = Array.from(byType[t]?.style || []);
      const missingStyle = usedStyle.filter(k => !schemaKeys.has(k));
      if (missingStyle.length > 0) {
        advisories.push(`${t}: campos de estilo não mapeados [${missingStyle.join(', ')}]`);
      }
    }
    if (advisories.length > 0) {
      console.warn(`Avisos de cobertura de estilo (recomendado mapear no schema):\n${  advisories.join('\n')}`);
    }
    expect(true).toBe(true);
  });
});
