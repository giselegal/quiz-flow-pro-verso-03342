#!/usr/bin/env node
// Aplica SQL diretamente no Postgres do Supabase usando a connection string (SUPABASE_DB_URL)
// Requisitos:
//  - Variável de ambiente SUPABASE_DB_URL (Postgres connection string do projeto)
//  - Dependência 'postgres' já está no package.json
// Uso:
//  - node scripts/sql/apply-via-pg.mjs --file scripts/sql/2025-11-01_indices_and_rpc.sql
//  - node scripts/sql/apply-via-pg.mjs --file scripts/sql/2025-11-01_indices_and_rpc.sql --file scripts/sql/2025-11-01_rls_policies_template.sql
//  - npm run db:apply:pg
//  - npm run db:apply:pg:with-rls

import fs from 'fs'
import path from 'path'
import process from 'process'
import postgres from 'postgres'
import dotenv from 'dotenv'

// Carrega variáveis de ambiente de arquivos locais, se existirem
try {
  const root = process.cwd()
  const envLocal = path.join(root, '.env.local')
  const env = path.join(root, '.env')
  if (fs.existsSync(envLocal)) dotenv.config({ path: envLocal })
  else if (fs.existsSync(env)) dotenv.config({ path: env })
  else dotenv.config()
} catch {}

function parseArgs() {
  const args = process.argv.slice(2)
  const files = []
  for (let i = 0; i < args.length; i++) {
    const a = args[i]
    if (a === '--file' && args[i+1]) {
      files.push(args[i+1]); i++
    }
  }
  return { files }
}

function readSql(filePath) {
  const abs = path.isAbsolute(filePath) ? filePath : path.join(process.cwd(), filePath)
  if (!fs.existsSync(abs)) throw new Error(`Arquivo SQL não encontrado: ${abs}`)
  return fs.readFileSync(abs, 'utf8')
}

async function main() {
  const SUPABASE_DB_URL = process.env.SUPABASE_DB_URL
  if (!SUPABASE_DB_URL) {
    console.error('Erro: SUPABASE_DB_URL não definido. Cole a connection string do Postgres do seu projeto Supabase nessa variável e tente novamente.')
    process.exit(2)
  }
  // Garante SSL em ambientes Supabase (se faltar sslmode na URL)
  let conn = SUPABASE_DB_URL
  if (!/sslmode=/i.test(conn)) {
    conn += (conn.includes('?') ? '&' : '?') + 'sslmode=require'
  }

  const { files } = parseArgs()
  let sqlText = ''

  if (files.length > 0) {
    for (const f of files) {
      sqlText += '\n\n-- >>> BEGIN ' + f + ' >>>\n' + readSql(f) + '\n-- <<< END ' + f + ' <<<\n'
    }
  } else {
    // padrão: aplicar índices + RPC
    sqlText = readSql('scripts/sql/2025-11-01_indices_and_rpc.sql')
  }

  const sql = postgres(conn, { max: 1, idle_timeout: 5, connect_timeout: 10 })
  try {
    console.log('Conectado. Aplicando SQL...')
    await sql.unsafe(sqlText)
    console.log('✅ SQL aplicado com sucesso.')
  } catch (err) {
    console.error('❌ Falha ao aplicar SQL:', err.message || err)
    process.exit(1)
  } finally {
    await sql.end({ timeout: 1 })
  }
}

main().catch(e => { console.error('❌ apply-via-pg error:', e?.message || e); process.exit(1) })
