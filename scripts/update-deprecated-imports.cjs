#!/usr/bin/env node

/**
 * 🔧 FASE 2: Atualizar imports dos serviços deprecated
 * 
 * Este script atualiza automaticamente todos os imports dos serviços
 * deprecated para usar o FunnelService canônico.
 */

const fs = require('fs');
const path = require('path');

// Arquivos que precisam ser atualizados (excluindo docs e guia de migração)
const FILES_TO_UPDATE = [
    'src/contexts/data/UnifiedCRUDProvider.tsx',
    'src/hooks/useFunnelLoader.ts',
    'src/hooks/editor/useEditorPersistence.ts',
    'src/hooks/editor/useEditorAutoSave.ts',
    'src/hooks/editor/useContextualEditorPersistence.ts',
    'src/utils/testCRUDOperations.ts',
];

// Padrões de substituição
const REPLACEMENTS = [
    // EnhancedFunnelService
    {
        pattern: /import\s+\{\s*enhancedFunnelService\s*\}\s+from\s+['"].*\/services\/EnhancedFunnelService['"]/g,
        replacement: "import { FunnelService } from '@/application/services/FunnelService'\nconst enhancedFunnelService = new FunnelService() // MIGRATED: usar funnelService"
    },
    {
        pattern: /import\s+\{\s*EnhancedFunnelService\s*\}\s+from\s+['"].*\/services\/EnhancedFunnelService['"]/g,
        replacement: "import { FunnelService as EnhancedFunnelService } from '@/application/services/FunnelService' // MIGRATED"
    },

    // AdvancedFunnelStorage
    {
        pattern: /import\s+\{\s*advancedFunnelStorage\s*\}\s+from\s+['"].*\/services\/AdvancedFunnelStorage['"]/g,
        replacement: "import { FunnelService } from '@/application/services/FunnelService'\nconst advancedFunnelStorage = new FunnelService() // MIGRATED: usar funnelService"
    },
    {
        pattern: /import\s+\{\s*AdvancedFunnelStorage\s*\}\s+from\s+['"].*\/services\/AdvancedFunnelStorage['"]/g,
        replacement: "import { FunnelService as AdvancedFunnelStorage } from '@/application/services/FunnelService' // MIGRATED"
    },

    // contextualFunnelService
    {
        pattern: /import\s+\{[^}]*ContextualFunnelService[^}]*\}\s+from\s+['"].*\/services\/contextualFunnelService['"]/g,
        replacement: "import { FunnelService as ContextualFunnelService } from '@/application/services/FunnelService'\nimport type { ContextualFunnelData } from '@/types/funnel' // MIGRATED"
    },
];

let totalUpdates = 0;
let filesUpdated = 0;

console.log('🔄 FASE 2: Atualizando imports dos serviços deprecated...\n');

FILES_TO_UPDATE.forEach(filePath => {
    const fullPath = path.join('/workspaces/quiz-flow-pro-verso', filePath);

    if (!fs.existsSync(fullPath)) {
        console.log(`⏭️  SKIP: ${filePath} (arquivo não encontrado)`);
        return;
    }

    let content = fs.readFileSync(fullPath, 'utf8');
    let updatedContent = content;
    let fileUpdated = false;

    REPLACEMENTS.forEach(({ pattern, replacement }) => {
        if (pattern.test(updatedContent)) {
            updatedContent = updatedContent.replace(pattern, replacement);
            fileUpdated = true;
            totalUpdates++;
        }
    });

    if (fileUpdated) {
        fs.writeFileSync(fullPath, updatedContent, 'utf8');
        console.log(`✅ UPDATED: ${filePath}`);
        filesUpdated++;
    } else {
        console.log(`⏭️  SKIP: ${filePath} (sem imports deprecated)`);
    }
});

console.log('\n📊 RESULTADO:');
console.log(`   Arquivos atualizados: ${filesUpdated}/${FILES_TO_UPDATE.length}`);
console.log(`   Total de substituições: ${totalUpdates}`);
console.log('\n⚠️  PRÓXIMOS PASSOS:');
console.log('   1. Revisar arquivos atualizados');
console.log('   2. Testar aplicação: npm run dev');
console.log('   3. Verificar console para erros');
console.log('   4. Commit mudanças se tudo ok\n');
