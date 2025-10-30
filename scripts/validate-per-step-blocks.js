#!/usr/bin/env node
import fs from 'fs/promises';
import path from 'path';

async function validate() {
  const dir = path.resolve('public/templates/blocks');
  const entries = await fs.readdir(dir);
  const stepFiles = entries.filter((f) => /^step-\d{2}\.json$/.test(f)).sort();

  if (stepFiles.length !== 21) {
    console.warn(`⚠️ Esperados 21 arquivos, encontrados ${stepFiles.length}`);
  }

  let ok = true;
  for (const file of stepFiles) {
    const full = path.join(dir, file);
    try {
      const raw = await fs.readFile(full, 'utf8');
      const json = JSON.parse(raw);
      if (!Array.isArray(json.blocks)) {
        console.error(`❌ ${file}: campo blocks ausente ou inválido`);
        ok = false;
      }
    } catch (e) {
      console.error(`❌ ${file}: JSON inválido`, e.message);
      ok = false;
    }
  }

  if (!ok) {
    process.exit(2);
  }
  console.log('✅ Per-step blocks válidos');
}

validate().catch((e) => {
  console.error('❌ Falha na validação:', e);
  process.exit(1);
});
