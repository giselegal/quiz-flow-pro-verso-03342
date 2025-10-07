import { templateService } from './service';

// Seed simples para quando usando driver sqlite (PERSIST_TEMPLATES=sqlite)
// Executar: node server/templates/sqlite.seed.ts

async function run() {
    const base = templateService.createBase('Template SQLite Seed', 'tpl-sqlite-seed');
    console.log('[seed] created draft id=', base.draft.id);
    // adiciona um componente básico
    templateService.addStage(base.draft.id, { type: 'question' });
    console.log('[seed] added question stage');
}

run().catch(e => { console.error(e); process.exit(1); });
