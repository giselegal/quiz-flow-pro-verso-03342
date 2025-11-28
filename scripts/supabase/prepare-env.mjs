#!/usr/bin/env node
import { promises as fs } from 'fs';
import path from 'path';

const root = path.resolve('.');
const envPath = path.join(root, '.env');
const outPath = path.join(root, '.env.local');

function parseEnv(text) {
  const lines = text.split(/\r?\n/);
  const obj = {};
  for (const l of lines) {
    const m = l.match(/^([A-Za-z0-9_]+)=(.*)$/);
    if (m) obj[m[1]] = m[2];
  }
  return obj;
}

function projectRefFromUrl(url) {
  const m = url.match(/^https:\/\/([a-z0-9]+)\.supabase\.co\/?$/i);
  return m ? m[1] : null;
}

async function main() {
  const exists = await fs.access(envPath).then(() => true).catch(() => false);
  if (!exists) {
    console.error('No .env found, skipping.');
    process.exit(0);
  }
  const txt = await fs.readFile(envPath, 'utf-8');
  const env = parseEnv(txt);
  const url = env.VITE_SUPABASE_URL;
  const anon = env.VITE_SUPABASE_ANON_KEY;
  const ref = url ? projectRefFromUrl(url) : null;

  const lines = [];
  if (url) lines.push(`VITE_SUPABASE_URL=${url}`);
  if (anon) lines.push(`VITE_SUPABASE_ANON_KEY=${anon}`);
  if (ref) lines.push(`VITE_SUPABASE_PROJECT_ID=${ref}`);
  // placeholders to be filled securely when available
  lines.push(`# SUPABASE_DB_URL=postgresql://user:pass@host:5432/db?sslmode=require`);
  lines.push(`# SUPABASE_ACCESS_TOKEN=sbpat_xxx`);

  await fs.writeFile(outPath, lines.join('\n') + '\n', 'utf-8');
  console.log(`Wrote ${path.relative(root, outPath)} with Supabase fields.`);
}

main();
