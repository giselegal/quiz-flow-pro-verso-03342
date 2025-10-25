#!/usr/bin/env node
/**
 * Migra arquivos JSON em public/templates:
 * - gap -> gridGap
 * - multipleSelect -> multipleSelection
 */
const fs = require('fs');
const path = require('path');

const TEMPLATES_DIR = path.resolve(__dirname, '../public/templates');
const TIMESTAMP = new Date().toISOString().replace(/[:.]/g, '-');
const BACKUP_DIR = path.resolve(__dirname, `../public/templates_backup_${TIMESTAMP}`);

function migrateFile(filePath) {
  const raw = fs.readFileSync(filePath, 'utf8');
  let obj;
  try { obj = JSON.parse(raw); } catch (err) { console.error('Skipping invalid JSON', filePath, err.message); return; }

  let changed = false;
  if (obj.gap !== undefined && obj.gridGap === undefined) { obj.gridGap = obj.gap; delete obj.gap; changed = true; }
  if (obj.multipleSelect !== undefined && obj.multipleSelection === undefined) { obj.multipleSelection = obj.multipleSelect; delete obj.multipleSelect; changed = true; }

  if (changed) {
    fs.writeFileSync(filePath, JSON.stringify(obj, null, 2), 'utf8');
    console.log('Migrated', path.relative(TEMPLATES_DIR, filePath));
  } else {
    console.log('No changes for', path.relative(TEMPLATES_DIR, filePath));
  }
}

function backupAndMigrate() {
  if (!fs.existsSync(TEMPLATES_DIR)) { console.error('Templates dir not found:', TEMPLATES_DIR); process.exit(1); }
  fs.mkdirSync(BACKUP_DIR, { recursive: true });
  const files = fs.readdirSync(TEMPLATES_DIR).filter(f => f.endsWith('.json'));
  for (const file of files) {
    const src = path.join(TEMPLATES_DIR, file);
    const dst = path.join(BACKUP_DIR, file);
    fs.copyFileSync(src, dst);
  }
  console.log('Backup created at', BACKUP_DIR);
  for (const file of files) migrateFile(path.join(TEMPLATES_DIR, file));
  console.log('Migration completed.');
}

backupAndMigrate();
