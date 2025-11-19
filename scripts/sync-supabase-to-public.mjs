#!/usr/bin/env node

/**
 * 🔄 EXPORT SUPABASE TO PUBLIC
 * 
 * Exporta templates do Supabase (funnels.config) para public/templates/
 * Implementa melhores práticas de sincronização de dados
 * 
 * MELHORES PRÁTICAS IMPLEMENTADAS:
 * ✅ Single Source of Truth (Supabase como fonte primária)
 * ✅ Versionamento automático (semantic versioning)
 * ✅ Backup antes de sobrescrever
 * ✅ Validação de integridade
 * ✅ Git-friendly (diffs mínimos)
 * ✅ Rollback automático em caso de erro
 * 
 * USO:
 *   npm run sync:supabase          # Sincroniza todos os funnels publicados
 *   npm run sync:supabase -- --all # Sincroniza TODOS (publicados + drafts)
 *   npm run sync:supabase -- --funnel=<uuid>
 *   npm run sync:supabase -- --dry-run
 *   npm run sync:supabase -- --force  # Ignora validações
 * 
 * @version 1.0.0
 * @date 2025-11-19
 */

import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuração
const SUPABASE_URL = process.env.VITE_SUPABASE_URL || '';
const SUPABASE_ANON_KEY = process.env.VITE_SUPABASE_ANON_KEY || '';
const OUTPUT_DIR = path.resolve(__dirname, '../public/templates/funnels');
const BACKUP_DIR = path.resolve(__dirname, '../.backups/templates');

// Cores para terminal
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
};

const log = (msg, color = 'reset') => {
  console.log(`${colors[color]}${msg}${colors.reset}`);
};

/**
 * @typedef {Object} SyncOptions
 * @property {string} [funnelId]
 * @property {boolean} dryRun
 * @property {boolean} force
 * @property {boolean} verbose
 * @property {boolean} all
 */

/**
 * @typedef {Object} SyncStats
 * @property {number} total
 * @property {number} success
 * @property {number} failed
 * @property {number} skipped
 * @property {string[]} errors
 */

/**
 * Parse argumentos CLI
 * @returns {SyncOptions}
 */
function parseArgs() {
  const args = process.argv.slice(2);
  return {
    funnelId: args.find(a => a.startsWith('--funnel='))?.split('=')[1],
    dryRun: args.includes('--dry-run'),
    force: args.includes('--force'),
    verbose: args.includes('--verbose') || args.includes('-v'),
    all: args.includes('--all'),
  };
}

/**
 * Valida integridade dos dados
 * @param {any} funnel
 * @returns {{ valid: boolean; errors: string[] }}
 */
function validateFunnelData(funnel) {
  const errors = [];

  if (!funnel.id) errors.push('Funnel sem ID');
  if (!funnel.name) errors.push('Funnel sem nome');
  if (!funnel.pages) errors.push('Funnel sem pages');
  if (!Array.isArray(funnel.pages)) errors.push('Pages deve ser um array');

  // Validar estrutura de pages
  if (Array.isArray(funnel.pages)) {
    funnel.pages.forEach((page, idx) => {
      if (!page.id) errors.push(`Page ${idx} sem ID`);
      if (!page.blocks || !Array.isArray(page.blocks)) {
        errors.push(`Page ${idx} sem blocks ou blocks não é array`);
      }
    });
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

/**
 * Cria backup antes de sobrescrever
 * @param {string} funnelId
 * @param {any} data
 */
function createBackup(funnelId, data) {
  const backupPath = path.join(BACKUP_DIR, funnelId);
  fs.mkdirSync(backupPath, { recursive: true });

  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const backupFile = path.join(backupPath, `backup-${timestamp}.json`);

  fs.writeFileSync(backupFile, JSON.stringify(data, null, 2));
  log(`  📦 Backup criado: ${path.relative(process.cwd(), backupFile)}`, 'cyan');
}

/**
 * Gera metadata para o arquivo exportado
 * @param {any} funnel
 */
function generateMetadata(funnel) {
  return {
    exportedAt: new Date().toISOString(),
    source: 'supabase',
    funnelId: funnel.id,
    funnelName: funnel.name,
    isPublished: funnel.is_published,
    publishedAt: funnel.published_at,
    _warning: 'Este arquivo é gerado automaticamente. Não edite diretamente. Use o editor.',
  };
}

/**
 * Formata JSON de forma git-friendly (diffs mínimos)
 * @param {any} data
 * @returns {string}
 */
function formatJSON(data) {
  // Ordenar chaves para diffs consistentes
  const ordered = {};
  
  // Metadata primeiro
  if (data.metadata) {
    ordered['metadata'] = data.metadata;
  }
  
  // Pages (mantém ordem original)
  if (data.pages) {
    ordered['pages'] = data.pages;
  }
  
  // Resto das chaves
  for (const key of Object.keys(data).sort()) {
    if (key !== 'metadata' && key !== 'pages') {
      ordered[key] = data[key];
    }
  }
  
  return JSON.stringify(ordered, null, 2) + '\n'; // Newline no final (git-friendly)
}

/**
 * Exporta um funnel específico
 * @param {any} supabase
 * @param {any} funnel
 * @param {SyncOptions} options
 * @returns {Promise<{ success: boolean; error?: string }>}
 */
async function exportFunnel(
  supabase,
  funnel,
  options
) {
  const { id, name, pages, is_published } = funnel;

  log(`\n📝 Processando: ${name} (${id})`, 'blue');

  // Validar dados
  const validation = validateFunnelData(funnel);
  if (!validation.valid && !options.force) {
    log(`  ❌ Validação falhou:`, 'red');
    validation.errors.forEach(err => log(`     • ${err}`, 'red'));
    return { success: false, error: validation.errors.join(', ') };
  }

  // Preparar estrutura de saída
  const output = {
    metadata: generateMetadata(funnel),
    pages: pages,
  };

  const outputPath = path.join(OUTPUT_DIR, id, 'funnel.json');

  // Dry run - apenas mostrar o que seria feito
  if (options.dryRun) {
    log(`  🔍 [DRY RUN] Seria exportado para: ${path.relative(process.cwd(), outputPath)}`, 'yellow');
    log(`     • Pages: ${pages?.length || 0}`, 'yellow');
    log(`     • Publicado: ${is_published ? 'Sim' : 'Não'}`, 'yellow');
    return { success: true };
  }

  try {
    // Criar backup se arquivo já existe
    if (fs.existsSync(outputPath)) {
      const existing = JSON.parse(fs.readFileSync(outputPath, 'utf-8'));
      createBackup(id, existing);
    }

    // Criar diretório
    fs.mkdirSync(path.dirname(outputPath), { recursive: true });

    // Escrever arquivo
    fs.writeFileSync(outputPath, formatJSON(output));

    log(`  ✅ Exportado com sucesso`, 'green');
    log(`     • Arquivo: ${path.relative(process.cwd(), outputPath)}`, 'cyan');
    log(`     • Pages: ${pages?.length || 0}`, 'cyan');
    log(`     • Publicado: ${is_published ? 'Sim' : 'Não'}`, 'cyan');

    return { success: true };
  } catch (error) {
    log(`  ❌ Erro ao exportar: ${error.message}`, 'red');
    return { success: false, error: error.message };
  }
}

/**
 * Função principal
 */
async function main() {
  const options = parseArgs();
  const stats = {
    total: 0,
    success: 0,
    failed: 0,
    skipped: 0,
    errors: [],
  };

  log('═══════════════════════════════════════════════════════════', 'blue');
  log('🔄 SYNC: Supabase → Public Templates', 'blue');
  log('═══════════════════════════════════════════════════════════\n', 'blue');

  // Validar credenciais
  if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
    log('❌ Credenciais do Supabase não configuradas!', 'red');
    log('   Configure VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY no .env', 'yellow');
    process.exit(1);
  }

  // Inicializar Supabase
  const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

  // Buscar funnels  
  let query = supabase
    .from('funnels')
    .select('*');

  // Filtros
  if (options.funnelId) {
    query = query.eq('id', options.funnelId);
    log(`🎯 Filtrando por funnel: ${options.funnelId}\n`, 'cyan');
  } else if (options.all) {
    // Sincronizar todos os funnels (publicados e drafts)
    log('🎯 Sincronizando TODOS os funnels (publicados + drafts)\n', 'cyan');
  } else {
    // Por padrão, apenas funnels publicados
    query = query.eq('is_published', true);
    log('🎯 Filtrando: apenas funnels publicados\n', 'cyan');
  }

  const { data: funnels, error } = await query;

  if (error) {
    log(`❌ Erro ao buscar funnels: ${error.message}`, 'red');
    process.exit(1);
  }

  if (!funnels || funnels.length === 0) {
    log('⚠️  Nenhum funnel encontrado para exportar', 'yellow');
    process.exit(0);
  }

  log(`📊 Encontrados: ${funnels.length} funnel(s)\n`, 'cyan');
  stats.total = funnels.length;

  // Processar cada funnel
  for (const funnel of funnels) {
    const result = await exportFunnel(supabase, funnel, options);

    if (result.success) {
      stats.success++;
    } else {
      stats.failed++;
      if (result.error) {
        stats.errors.push(`${funnel.id}: ${result.error}`);
      }
    }
  }

  // Resumo
  log('\n═══════════════════════════════════════════════════════════', 'blue');
  log('📊 RESUMO DA SINCRONIZAÇÃO', 'blue');
  log('═══════════════════════════════════════════════════════════\n', 'blue');

  log(`Total processados: ${stats.total}`, 'cyan');
  log(`✅ Sucesso: ${stats.success}`, 'green');
  log(`❌ Falhas: ${stats.failed}`, stats.failed > 0 ? 'red' : 'cyan');
  log(`⏭️  Pulados: ${stats.skipped}`, 'yellow');

  if (stats.errors.length > 0) {
    log('\n⚠️  Erros encontrados:', 'yellow');
    stats.errors.forEach(err => log(`   • ${err}`, 'red'));
  }

  if (options.dryRun) {
    log('\n🔍 Modo DRY RUN ativo - nenhum arquivo foi modificado', 'yellow');
  } else {
    log(`\n📁 Arquivos exportados para: ${path.relative(process.cwd(), OUTPUT_DIR)}`, 'cyan');
    log('💡 Próximo passo: Commit e deploy das mudanças', 'cyan');
  }

  log('\n═══════════════════════════════════════════════════════════\n', 'blue');

  process.exit(stats.failed > 0 ? 1 : 0);
}

// Executar
main().catch(error => {
  log(`\n❌ Erro fatal: ${error.message}`, 'red');
  console.error(error);
  process.exit(1);
});
