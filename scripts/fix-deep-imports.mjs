#!/usr/bin/env node
/**
 * Script para corrigir imports profundos (../../../) e converter para aliases @/
 * 
 * Exemplo:
 * De: import { QuizStep } from '../../../data/quizSteps';
 * Para: import { QuizStep } from '@/data/quizSteps';
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.join(__dirname, '..');
const srcDir = path.join(rootDir, 'src');

// Estatísticas
let stats = {
    filesProcessed: 0,
    filesModified: 0,
    importsFixed: 0,
    errors: 0
};

/**
 * Resolve um import relativo profundo para um import com alias @/
 */
function resolveDeepImport(currentFilePath, importPath) {
    // Se não é import relativo profundo, não mexe
    if (!importPath.startsWith('../')) {
        return importPath;
    }

    // Conta quantos níveis sobe
    const levels = (importPath.match(/\.\.\//g) || []).length;

    // Se tem menos de 3 níveis, mantém (não é "profundo")
    if (levels < 3) {
        return importPath;
    }

    // Calcula o path absoluto do arquivo atual relativo a src/
    const relativeToSrc = path.relative(srcDir, path.dirname(currentFilePath));

    // Calcula o path final do import
    const importTarget = path.normalize(path.join(relativeToSrc, importPath));

    // Remove o .ts/.tsx se tiver
    const cleanImport = importTarget.replace(/\.(ts|tsx)$/, '');

    // Converte para alias @/
    return `@/${cleanImport}`;
}

/**
 * Processa um arquivo TypeScript/TSX
 */
function processFile(filePath) {
    stats.filesProcessed++;

    try {
        let content = fs.readFileSync(filePath, 'utf8');
        const originalContent = content;
        let modified = false;

        // Regex para encontrar imports
        // Captura: import { X } from '../../../Y';
        // Ou: import X from '../../../Y';
        // Ou: import type { X } from '../../../Y';
        const importRegex = /import\s+(?:type\s+)?(?:\{[^}]+\}|\w+)\s+from\s+['"](\.\.[^'"]+)['"]/g;

        let match;
        const replacements = [];

        while ((match = importRegex.exec(originalContent)) !== null) {
            const fullMatch = match[0];
            const importPath = match[1];

            // Verifica se é import profundo (3+ níveis)
            const levels = (importPath.match(/\.\.\//g) || []).length;
            if (levels >= 3) {
                const newImportPath = resolveDeepImport(filePath, importPath);
                const newFullMatch = fullMatch.replace(importPath, newImportPath);

                replacements.push({
                    old: fullMatch,
                    new: newFullMatch,
                    line: originalContent.substring(0, match.index).split('\n').length
                });
            }
        }

        // Aplica as substituições
        if (replacements.length > 0) {
            for (const replacement of replacements) {
                content = content.replace(replacement.old, replacement.new);
                modified = true;
                stats.importsFixed++;

                console.log(`  ✅ Linha ${replacement.line}: ${replacement.old.substring(0, 60)}...`);
                console.log(`     → ${replacement.new.substring(0, 60)}...`);
            }
        }

        // Salva o arquivo se foi modificado
        if (modified) {
            fs.writeFileSync(filePath, content, 'utf8');
            stats.filesModified++;
            console.log(`✅ ${path.relative(rootDir, filePath)} - ${replacements.length} imports corrigidos\n`);
            return true;
        }

        return false;
    } catch (error) {
        stats.errors++;
        console.error(`❌ Erro ao processar ${filePath}:`, error.message);
        return false;
    }
}

/**
 * Varre recursivamente um diretório
 */
function walkDir(dir, callback) {
    try {
        const files = fs.readdirSync(dir);

        for (const file of files) {
            const filePath = path.join(dir, file);

            try {
                const stat = fs.statSync(filePath);

                if (stat.isDirectory()) {
                    // Ignora node_modules, dist, etc
                    if (!['node_modules', 'dist', 'build', '.git'].includes(file)) {
                        walkDir(filePath, callback);
                    }
                } else if (stat.isFile()) {
                    // Processa apenas .ts e .tsx
                    if (file.endsWith('.ts') || file.endsWith('.tsx')) {
                        callback(filePath);
                    }
                }
            } catch (err) {
                // Ignora symlinks quebrados ou arquivos inacessíveis
                if (err.code !== 'ENOENT') {
                    console.warn(`⚠️  Ignorando ${filePath}: ${err.message}`);
                }
            }
        }
    } catch (err) {
        console.warn(`⚠️  Erro ao ler diretório ${dir}: ${err.message}`);
    }
}/**
 * Main
 */
console.log('🔧 Corrigindo imports profundos (../../../) para aliases (@/)\n');
console.log('📁 Diretório fonte:', srcDir);
console.log('─'.repeat(80));

walkDir(srcDir, processFile);

console.log('─'.repeat(80));
console.log('\n📊 RESULTADO:\n');
console.log(`  Arquivos processados: ${stats.filesProcessed}`);
console.log(`  Arquivos modificados: ${stats.filesModified}`);
console.log(`  Imports corrigidos: ${stats.importsFixed}`);
console.log(`  Erros: ${stats.errors}`);

if (stats.filesModified > 0) {
    console.log('\n✅ Sucesso! Imports profundos foram corrigidos.');
    console.log('\n📝 Próximos passos:');
    console.log('  1. Execute: npm run build');
    console.log('  2. Execute: npm run lint');
    console.log('  3. Teste a aplicação para garantir que nada quebrou');
    process.exit(0);
} else {
    console.log('\n✨ Nenhum import profundo encontrado! Código já está limpo.');
    process.exit(0);
}
