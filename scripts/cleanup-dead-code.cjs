#!/usr/bin/env node

/**
 * 🧹 CLEANUP DEAD CODE - Remoção Segura de Código Morto
 * 
 * Este script:
 * 1. Identifica arquivos com @ts-nocheck que não têm importações
 * 2. Cria backup antes de excluir
 * 3. Move arquivos para archived/dead-code/
 * 4. Gera relatório detalhado
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const ROOT_DIR = '/workspaces/quiz-flow-pro-verso';
const ARCHIVED_DIR = path.join(ROOT_DIR, 'archived/dead-code');
const BACKUP_DIR = path.join(ROOT_DIR, 'backup-before-cleanup');

// Padrões de exclusão
const EXCLUDE_PATTERNS = [
    'node_modules',
    'dist',
    'build',
    '.git',
    'archived',
    'backup',
    '.next',
    'vite.config',
    'tailwind.config',
    'tsconfig'
];

let stats = {
    scanned: 0,
    deadFiles: 0,
    imported: 0,
    excluded: 0,
    moved: 0,
    errors: 0
};

/**
 * Verifica se arquivo deve ser excluído
 */
function shouldExclude(filePath) {
    return EXCLUDE_PATTERNS.some(pattern => filePath.includes(pattern));
}

/**
 * Verifica se arquivo tem @ts-nocheck
 */
function hasTsNoCheck(filePath) {
    try {
        const content = fs.readFileSync(filePath, 'utf8');
        return content.includes('@ts-nocheck');
    } catch {
        return false;
    }
}

/**
 * Verifica se arquivo é importado em algum lugar
 */
function isImported(filePath) {
    try {
        // Extrair nome do arquivo sem extensão
        const fileName = path.basename(filePath, path.extname(filePath));

        // Buscar por imports deste arquivo
        const result = execSync(
            `grep -r "from.*${fileName}" ${ROOT_DIR}/src --include="*.tsx" --include="*.ts" --include="*.jsx" --include="*.js" 2>/dev/null || true`,
            { encoding: 'utf8', maxBuffer: 10 * 1024 * 1024 }
        );

        // Se encontrou imports, verificar se não é auto-import
        if (result) {
            const lines = result.split('\n').filter(line => {
                // Excluir auto-imports (mesmo arquivo)
                return line && !line.startsWith(filePath);
            });

            return lines.length > 0;
        }

        return false;
    } catch {
        return false; // Em caso de erro, assumir que não é importado
    }
}

/**
 * Lista todos os arquivos TypeScript/JavaScript no projeto
 */
function listAllFiles(dir, fileList = []) {
    try {
        const files = fs.readdirSync(dir);

        files.forEach(file => {
            const filePath = path.join(dir, file);

            if (shouldExclude(filePath)) {
                stats.excluded++;
                return;
            }

            try {
                // Verificar se arquivo/diretório existe antes de stat
                if (!fs.existsSync(filePath)) {
                    console.warn(`⚠️  Link quebrado ou arquivo inexistente: ${filePath}`);
                    return;
                }

                const stat = fs.statSync(filePath);

                if (stat.isDirectory()) {
                    listAllFiles(filePath, fileList);
                } else if (stat.isFile() && /\.(tsx?|jsx?)$/.test(file)) {
                    fileList.push(filePath);
                }
            } catch (error) {
                // Ignorar erros de acesso individual
                console.warn(`⚠️  Erro ao acessar: ${filePath}`);
                stats.excluded++;
            }
        });
    } catch (error) {
        console.warn(`⚠️  Erro ao listar diretório: ${dir}`);
        stats.excluded++;
    }

    return fileList;
}/**
 * Criar backup antes de mover arquivos
 */
function createBackup() {
    if (!fs.existsSync(BACKUP_DIR)) {
        fs.mkdirSync(BACKUP_DIR, { recursive: true });
    }

    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const backupFile = path.join(BACKUP_DIR, `backup-${timestamp}.tar.gz`);

    console.log(`📦 Criando backup: ${backupFile}`);

    try {
        execSync(`tar -czf ${backupFile} src/`, { cwd: ROOT_DIR });
        console.log(`✅ Backup criado com sucesso`);
        return backupFile;
    } catch (error) {
        console.error(`❌ Erro ao criar backup:`, error.message);
        throw error;
    }
}

/**
 * Mover arquivo para archived
 */
function moveToArchived(filePath) {
    try {
        // Calcular caminho relativo
        const relativePath = path.relative(ROOT_DIR, filePath);
        const archivedPath = path.join(ARCHIVED_DIR, relativePath);

        // Criar diretório se não existe
        const archivedDir = path.dirname(archivedPath);
        if (!fs.existsSync(archivedDir)) {
            fs.mkdirSync(archivedDir, { recursive: true });
        }

        // Mover arquivo
        fs.renameSync(filePath, archivedPath);
        stats.moved++;

        return archivedPath;
    } catch (error) {
        console.error(`❌ Erro ao mover ${filePath}:`, error.message);
        stats.errors++;
        return null;
    }
}

/**
 * Gerar relatório
 */
function generateReport(deadFiles) {
    const report = `# 🧹 RELATÓRIO DE LIMPEZA DE CÓDIGO MORTO

**Data:** ${new Date().toLocaleString('pt-BR')}

## 📊 Estatísticas

- **Arquivos escaneados:** ${stats.scanned}
- **Arquivos mortos identificados:** ${stats.deadFiles}
- **Arquivos importados (mantidos):** ${stats.imported}
- **Arquivos excluídos da análise:** ${stats.excluded}
- **Arquivos movidos para archived:** ${stats.moved}
- **Erros:** ${stats.errors}

## 📂 Arquivos Removidos

${deadFiles.map((file, index) => {
        const relativePath = path.relative(ROOT_DIR, file);
        return `${index + 1}. \`${relativePath}\``;
    }).join('\n')}

## 🔍 Como Recuperar

Se precisar recuperar algum arquivo:

\`\`\`bash
# Restaurar do backup
cd /workspaces/quiz-flow-pro-verso
tar -xzf backup-before-cleanup/backup-*.tar.gz

# Ou restaurar do archived
cp archived/dead-code/src/path/to/file.ts src/path/to/file.ts
\`\`\`

## ⚠️ Próximos Passos

1. Testar aplicação: \`npm run dev\`
2. Verificar se não há imports quebrados
3. Executar testes: \`npm test\`
4. Se tudo ok, commitar mudanças
5. Depois de 1 semana, deletar backup se não houver problemas

---

**Backup localizado em:** \`backup-before-cleanup/\`  
**Arquivos arquivados em:** \`archived/dead-code/\`
`;

    const reportPath = path.join(ROOT_DIR, 'RELATORIO_LIMPEZA_CODIGO_MORTO.md');
    fs.writeFileSync(reportPath, report, 'utf8');

    console.log(`\n📄 Relatório salvo em: ${reportPath}`);
}

/**
 * MAIN - Executar limpeza
 */
async function main() {
    console.log('🧹 INICIANDO LIMPEZA DE CÓDIGO MORTO\n');

    // 1. Criar backup
    console.log('📦 Etapa 1/4: Criando backup...');
    createBackup();

    // 2. Listar todos os arquivos
    console.log('\n🔍 Etapa 2/4: Escaneando arquivos...');
    const allFiles = listAllFiles(path.join(ROOT_DIR, 'src'));
    stats.scanned = allFiles.length;
    console.log(`   Encontrados ${stats.scanned} arquivos TypeScript/JavaScript`);

    // 3. Identificar arquivos mortos
    console.log('\n🔬 Etapa 3/4: Analisando código morto...');
    const deadFiles = [];

    for (const file of allFiles) {
        const hasNoCheck = hasTsNoCheck(file);
        const imported = isImported(file);

        if (hasNoCheck && !imported) {
            deadFiles.push(file);
            stats.deadFiles++;
        } else if (imported) {
            stats.imported++;
        }

        // Mostrar progresso
        if ((stats.deadFiles + stats.imported) % 50 === 0) {
            process.stdout.write('.');
        }
    }

    console.log(`\n   ✅ Identificados ${stats.deadFiles} arquivos mortos`);
    console.log(`   ✅ Mantidos ${stats.imported} arquivos importados`);

    // 4. Mover arquivos para archived
    console.log('\n📦 Etapa 4/4: Movendo arquivos para archived...');

    for (const file of deadFiles) {
        const relativePath = path.relative(ROOT_DIR, file);
        console.log(`   Movendo: ${relativePath}`);
        moveToArchived(file);
    }

    // 5. Gerar relatório
    console.log('\n📊 Gerando relatório...');
    generateReport(deadFiles);

    // 6. Resumo final
    console.log('\n✅ LIMPEZA CONCLUÍDA!\n');
    console.log('📊 RESUMO:');
    console.log(`   • ${stats.moved} arquivos movidos para archived/`);
    console.log(`   • ${stats.imported} arquivos mantidos (em uso)`);
    console.log(`   • ${stats.errors} erros durante o processo`);
    console.log(`\n🔍 Próximos passos:`);
    console.log(`   1. Revisar relatório: RELATORIO_LIMPEZA_CODIGO_MORTO.md`);
    console.log(`   2. Testar aplicação: npm run dev`);
    console.log(`   3. Verificar build: npm run build`);
    console.log(`   4. Se tudo ok, commitar mudanças\n`);
}

// Executar
main().catch(error => {
    console.error('❌ ERRO CRÍTICO:', error);
    process.exit(1);
});
