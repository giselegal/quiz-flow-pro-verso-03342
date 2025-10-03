#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const glob = require('glob');

// Arquivos que devem ser migrados
const patterns = [
    'src/**/*.tsx',
    'src/**/*.ts'
];

// Arquivos que devem ser ignorados
const ignorePatterns = [
    '**/EditorProviderMigrationAdapter.tsx', // Não migrar o próprio adaptador
    '**/node_modules/**',
    '**/*.test.ts',
    '**/*.test.tsx'
];

// Mapeamentos de migração
const migrations = [
    {
        // Migrar useEditor do adapter para EditorProvider direto
        from: /import\s*{\s*useEditor\s*}\s*from\s*['"]@\/components\/editor\/EditorProviderMigrationAdapter['"];?/g,
        to: "import { useEditor } from '@/components/editor/EditorProvider';"
    },
    {
        // Migrar EditorProvider do adapter para EditorProvider direto
        from: /import\s*{\s*EditorProvider\s*}\s*from\s*['"]@\/components\/editor\/EditorProviderMigrationAdapter['"];?/g,
        to: "import { EditorProvider } from '@/components/editor/EditorProvider';"
    },
    {
        // Migrar imports combinados
        from: /import\s*{\s*([^}]*EditorProvider[^}]*)\s*}\s*from\s*['"]@\/components\/editor\/EditorProviderMigrationAdapter['"];?/g,
        to: "import { $1 } from '@/components/editor/EditorProvider';"
    },
    {
        // Migrar imports combinados com useEditor
        from: /import\s*{\s*([^}]*useEditor[^}]*)\s*}\s*from\s*['"]@\/components\/editor\/EditorProviderMigrationAdapter['"];?/g,
        to: "import { $1 } from '@/components/editor/EditorProvider';"
    }
];

function migrateFile(filePath) {
    try {
        let content = fs.readFileSync(filePath, 'utf8');
        let changed = false;

        // Aplicar todas as migrações
        for (const migration of migrations) {
            const newContent = content.replace(migration.from, migration.to);
            if (newContent !== content) {
                content = newContent;
                changed = true;
            }
        }

        if (changed) {
            fs.writeFileSync(filePath, content, 'utf8');
            console.log(`✅ Migrado: ${filePath}`);
            return true;
        }
        
        return false;
    } catch (error) {
        console.error(`❌ Erro ao migrar ${filePath}:`, error.message);
        return false;
    }
}

function main() {
    console.log('🔄 Iniciando migração do EditorProviderMigrationAdapter...\n');
    
    let totalFiles = 0;
    let migratedFiles = 0;

    // Encontrar todos os arquivos TypeScript/TSX
    for (const pattern of patterns) {
        const files = glob.sync(pattern, {
            ignore: ignorePatterns,
            absolute: true
        });

        for (const file of files) {
            totalFiles++;
            
            // Verificar se o arquivo contém imports do adapter
            const content = fs.readFileSync(file, 'utf8');
            if (content.includes('EditorProviderMigrationAdapter')) {
                if (migrateFile(file)) {
                    migratedFiles++;
                }
            }
        }
    }

    console.log(`\n📊 Resumo da migração:`);
    console.log(`   Arquivos verificados: ${totalFiles}`);
    console.log(`   Arquivos migrados: ${migratedFiles}`);
    
    if (migratedFiles > 0) {
        console.log(`\n✅ Migração concluída! ${migratedFiles} arquivos foram atualizados.`);
        console.log(`\nPróximos passos:`);
        console.log(`1. Verificar se não há erros de compilação: npm run type-check`);
        console.log(`2. Executar testes: npm test`);
        console.log(`3. Remover o arquivo EditorProviderMigrationAdapter.tsx`);
    } else {
        console.log(`\n✨ Nenhuma migração necessária.`);
    }
}

if (require.main === module) {
    main();
}