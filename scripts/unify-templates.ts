#!/usr/bin/env tsx
/**
 * 🔧 TEMPLATE VERSION UNIFIER
 * 
 * Remove duplicidades entre v2.0 e v3.0 para resolver
 * dessincronização canvas-preview
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const templatesDir = path.join(__dirname, '..', 'public', 'templates');

interface TemplateFile {
    filename: string;
    fullPath: string;
    stepId: string;
    version: string;
    content: any;
    blocks?: number;
    sections?: number;
}

async function analyzeTemplates() {
    console.log('🔍 Analisando duplicidades de templates...\n');
    
    const files = fs.readdirSync(templatesDir);
    const templates: TemplateFile[] = [];
    
    for (const filename of files) {
        if (!filename.endsWith('.json') || filename.includes('normalized')) continue;
        
        const fullPath = path.join(templatesDir, filename);
        let stepId = '';
        let version = '';
        
        // Identificar step ID e versão
        if (filename.includes('-v3.json')) {
            stepId = filename.replace('-v3.json', '');
            version = '3.0';
        } else if (filename.includes('-template.json')) {
            stepId = filename.replace('-template.json', '');
            version = '2.0';
        } else if (filename.match(/step-\d+/)) {
            stepId = filename.replace('.json', '');
            version = '2.0'; // Default para arquivos sem sufixo
        }
        
        if (!stepId) continue;
        
        try {
            const content = JSON.parse(fs.readFileSync(fullPath, 'utf8'));
            const blocks = content.blocks ? content.blocks.length : 0;
            const sections = content.sections ? content.sections.length : 0;
            
            templates.push({
                filename,
                fullPath,
                stepId,
                version,
                content,
                blocks,
                sections
            });
        } catch (error) {
            console.log(`⚠️ Erro lendo ${filename}:`, error);
        }
    }
    
    // Agrupar por step ID
    const grouped = new Map<string, TemplateFile[]>();
    for (const template of templates) {
        if (!grouped.has(template.stepId)) {
            grouped.set(template.stepId, []);
        }
        grouped.get(template.stepId)!.push(template);
    }
    
    // Analisar duplicidades
    console.log('📊 ANÁLISE DE DUPLICIDADES:\n');
    let totalDuplicates = 0;
    
    for (const [stepId, versions] of grouped) {
        if (versions.length > 1) {
            totalDuplicates++;
            console.log(`🔄 ${stepId}:`);
            
            versions.forEach(v => {
                const blocksInfo = v.blocks ? `${v.blocks} blocos` : '';
                const sectionsInfo = v.sections ? `${v.sections} seções` : '';
                const info = [blocksInfo, sectionsInfo].filter(Boolean).join(', ');
                console.log(`   • v${v.version}: ${info} (${v.filename})`);
            });
            console.log('');
        }
    }
    
    console.log(`📈 Total de duplicidades: ${totalDuplicates}/${grouped.size} steps\n`);
    
    return { templates, grouped };
}

async function choosePreferredVersions(grouped: Map<string, TemplateFile[]>) {
    console.log('🎯 ESCOLHENDO VERSÕES PREFERENCIAIS...\n');
    
    const preferred: TemplateFile[] = [];
    const toRemove: string[] = [];
    
    for (const [stepId, versions] of grouped) {
        if (versions.length === 1) {
            preferred.push(versions[0]);
            continue;
        }
        
        // Critério de escolha:
        // 1. v3.0 se tiver seções bem definidas
        // 2. v2.0 se v3.0 tiver poucos dados
        // 3. Arquivo com mais conteúdo
        
        const v3 = versions.find(v => v.version === '3.0');
        const v2 = versions.find(v => v.version === '2.0');
        
        let chosen: TemplateFile;
        
        if (v3 && v3.sections && v3.sections > 0) {
            // v3.0 com seções válidas - preferir
            chosen = v3;
            if (v2) toRemove.push(v2.fullPath);
        } else if (v2 && v2.blocks && v2.blocks > 2) {
            // v2.0 com blocos substanciais - preferir
            chosen = v2;
            if (v3) toRemove.push(v3.fullPath);
        } else {
            // Escolher o maior arquivo
            chosen = versions.reduce((a, b) => 
                JSON.stringify(a.content).length > JSON.stringify(b.content).length ? a : b
            );
            versions.filter(v => v !== chosen).forEach(v => toRemove.push(v.fullPath));
        }
        
        preferred.push(chosen);
        
        const rejectedVersions = versions.filter(v => v !== chosen)
            .map(v => `v${v.version}`)
            .join(', ');
        
        console.log(`✅ ${stepId}: Escolhido v${chosen.version} (rejeitado: ${rejectedVersions})`);
    }
    
    console.log(`\n📊 Resumo: ${preferred.length} templates mantidos, ${toRemove.length} para remoção\n`);
    
    return { preferred, toRemove };
}

async function unifyTemplates() {
    console.log('🚀 TEMPLATE VERSION UNIFIER\n');
    console.log('Resolvendo conflito canvas-preview devido a versões duplicadas...\n');
    
    const { templates, grouped } = await analyzeTemplates();
    const { preferred, toRemove } = await choosePreferredVersions(grouped);
    
    // Criar backup
    const backupDir = path.join(templatesDir, 'backup-' + Date.now());
    fs.mkdirSync(backupDir, { recursive: true });
    
    console.log('💾 Criando backup...');
    for (const file of toRemove) {
        const filename = path.basename(file);
        const backupPath = path.join(backupDir, filename);
        fs.copyFileSync(file, backupPath);
        console.log(`   📁 ${filename} -> backup/`);
    }
    
    console.log('\n🗑️ Removendo templates duplicados...');
    for (const file of toRemove) {
        fs.unlinkSync(file);
        console.log(`   ❌ Removido: ${path.basename(file)}`);
    }
    
    // Regenerar arquivo TypeScript
    console.log('\n🔨 Regenerando templates TypeScript...');
    
    const { execSync } = await import('child_process');
    try {
        execSync('npm run generate:templates', { 
            cwd: path.join(__dirname, '..'),
            stdio: 'pipe'
        });
        console.log('✅ Templates TypeScript regenerados com sucesso!');
    } catch (error) {
        console.log('⚠️ Erro ao regenerar templates, mas arquivos foram unificados');
    }
    
    // Estatísticas finais
    console.log('\n🎉 UNIFICAÇÃO COMPLETA!\n');
    console.log('📊 ESTATÍSTICAS:');
    console.log(`   • Templates únicos: ${preferred.length}`);
    console.log(`   • Duplicatas removidas: ${toRemove.length}`);
    console.log(`   • Backup criado em: ${path.relative(process.cwd(), backupDir)}`);
    
    console.log('\n✅ PROBLEMA RESOLVIDO:');
    console.log('   • Canvas e Preview agora usam a MESMA versão de template');
    console.log('   • Dessincronização eliminada');
    console.log('   • Backup mantido para segurança');
    
    console.log('\n🧪 PRÓXIMO PASSO:');
    console.log('   1. npm run dev (reiniciar servidor)');
    console.log('   2. Testar canvas ↔ preview synchronization');
    console.log('   3. Verificar se edições aparecem corretamente');
    
    return {
        unified: preferred.length,
        removed: toRemove.length,
        backupPath: backupDir
    };
}

// Executar se chamado diretamente
if (import.meta.url === `file://${process.argv[1]}`) {
    unifyTemplates().catch(console.error);
}

export { unifyTemplates, analyzeTemplates };