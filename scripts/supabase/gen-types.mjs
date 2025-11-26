#!/usr/bin/env node
// Gera tipos do Supabase em src/integrations/supabase/types.ts
// Estratégias suportadas:
//  - SUPABASE_DB_URL (connection string Postgres) → preferida
//  - VITE_SUPABASE_PROJECT_ID + SUPABASE_ACCESS_TOKEN → usa project-id remoto
// Requisitos: supabase CLI instalada (supabase -v)

import { spawn } from 'child_process'
import fs from 'fs'
import path from 'path'
import dotenv from 'dotenv'

// Carregar env locais
try {
    const root = process.cwd()
    const envLocal = path.join(root, '.env.local')
    const env = path.join(root, '.env')
    if (fs.existsSync(envLocal)) dotenv.config({ path: envLocal })
    else if (fs.existsSync(env)) dotenv.config({ path: env })
    else dotenv.config()
} catch { }

const ROOT = process.cwd()
const OUT_DIR = path.join(ROOT, 'src/integrations/supabase')
const OUT_FILE = path.join(OUT_DIR, 'types.ts')

function ensureOutDir() {
    if (!fs.existsSync(OUT_DIR)) fs.mkdirSync(OUT_DIR, { recursive: true })
}

function run(cmd, args, env = {}) {
    return new Promise((resolve, reject) => {
        const child = spawn(cmd, args, { stdio: 'inherit', env: { ...process.env, ...env } })
        child.on('exit', (code) => {
            if (code === 0) resolve(0)
            else reject(new Error(`${cmd} exited with code ${code}`))
        })
        child.on('error', reject)
    })
}

function runCapture(cmd, args, env = {}) {
    return new Promise((resolve, reject) => {
        const child = spawn(cmd, args, { stdio: ['ignore', 'pipe', 'pipe'], env: { ...process.env, ...env } })
        let stdout = ''
        let stderr = ''
        child.stdout.on('data', (d) => { stdout += d.toString() })
        child.stderr.on('data', (d) => { stderr += d.toString() })
        child.on('exit', (code) => {
            if (code === 0) resolve({ stdout, stderr, code })
            else reject(new Error(stderr || `${cmd} exited with code ${code}`))
        })
        child.on('error', reject)
    })
}

async function main() {
    ensureOutDir()

    const DB_URL = process.env.SUPABASE_DB_URL
    let PROJECT_ID = process.env.VITE_SUPABASE_PROJECT_ID || process.env.SUPABASE_PROJECT_ID
    // Tentar derivar PROJECT_ID a partir de SUPABASE_URL (env) ou scripts/setup-tables.cjs
    if (!PROJECT_ID) {
        const SUPABASE_URL = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL
        const deriveFromUrl = (u) => {
            try {
                const host = new URL(u).host // your-supabase-project-ref.supabase.co
                const ref = host.split('.')[0]
                return ref && ref.length > 5 ? ref : null
            } catch { return null }
        }
        let ref = SUPABASE_URL ? deriveFromUrl(SUPABASE_URL) : null
        if (!ref) {
            // Ler de scripts/setup-tables.cjs (const SUPABASE_URL = 'https://<ref>.supabase.co')
            const setupFile = path.join(ROOT, 'scripts', 'setup-tables.cjs')
            if (fs.existsSync(setupFile)) {
                const text = fs.readFileSync(setupFile, 'utf8')
                const m = text.match(/https?:\/\/([a-z0-9]+)\.supabase\.co/i)
                if (m && m[1]) ref = m[1]
            }
        }
        if (ref) PROJECT_ID = ref
    }

    // Como fallback adicional, tentar ler supabase/config.toml (project_id = "<ref>")
    if (!PROJECT_ID) {
        try {
            const configToml = path.join(ROOT, 'supabase', 'config.toml')
            if (fs.existsSync(configToml)) {
                const text = fs.readFileSync(configToml, 'utf8')
                const m = text.match(/project_id\s*=\s*"([a-z0-9]+)"/i)
                if (m && m[1]) PROJECT_ID = m[1]
            }
        } catch { }
    }

    // Localizar access token por nomes alternativos e arquivos comuns
    let ACCESS_TOKEN = process.env.SUPABASE_ACCESS_TOKEN || process.env.SUPABASE_TOKEN || process.env.SUPABASE_PAT
    if (!ACCESS_TOKEN) {
        const candidates = [
            path.join(ROOT, '.supabase', 'access-token'),
            path.join(ROOT, 'supabase', 'access.token'),
        ]
        for (const f of candidates) {
            if (fs.existsSync(f)) {
                try { ACCESS_TOKEN = fs.readFileSync(f, 'utf8').trim(); if (ACCESS_TOKEN) break } catch { }
            }
        }
    }

    // Verificar CLI
    try {
        await run('supabase', ['-v'])
    } catch {
        console.error('❌ Supabase CLI não encontrada. Instale com: npm i -g supabase')
        process.exit(2)
    }

    // Estratégia 1: DB URL
    if (DB_URL) {
        console.log('🔧 Gerando tipos via DB URL (SUPABASE_DB_URL) ...')
        const args = ['gen', 'types', 'typescript', '--schema', 'public', '--db-url', DB_URL]
        const { stdout } = await runCapture('supabase', args)
        fs.writeFileSync(OUT_FILE, stdout)
        console.log('✅ Tipos gerados em', OUT_FILE)
        return 0
    }

    // Estratégia 2: Project ID + Access Token
    if (PROJECT_ID && ACCESS_TOKEN) {
        console.log('🔧 Gerando tipos via project-id ...')
        const args = ['gen', 'types', 'typescript', '--schema', 'public', '--project-id', PROJECT_ID]
        const { stdout } = await runCapture('supabase', args, { SUPABASE_ACCESS_TOKEN: ACCESS_TOKEN })
        fs.writeFileSync(OUT_FILE, stdout)
        console.log('✅ Tipos gerados em', OUT_FILE)
        return 0
    }

    console.error('❌ Variáveis ausentes para gerar tipos.')
    console.error('   Defina SUPABASE_DB_URL (recomendado) ou VITE_SUPABASE_PROJECT_ID + SUPABASE_ACCESS_TOKEN e rode novamente.')
    console.error('   Exemplo:')
    console.error('     export SUPABASE_DB_URL="postgresql://user:pass@host:5432/db?sslmode=require"')
    console.error('     npm run supabase:gen:types')
    process.exit(3)
}

main().catch((e) => { console.error('❌ Falha:', e?.message || e); process.exit(1) })
