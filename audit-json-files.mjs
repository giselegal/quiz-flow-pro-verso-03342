#!/usr/bin/env node
import { promises as fs } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const results = {
    templates: [],
    config: [],
    data: [],
    invalid: [],
    stats: {
        total: 0,
        valid: 0,
        invalid: 0,
        totalSize: 0
    }
};

async function analyzeJSON(filePath) {
    try {
        const content = await fs.readFile(filePath, 'utf-8');
        const stats = await fs.stat(filePath);
        const data = JSON.parse(content);
        
        const info = {
            path: path.relative(process.cwd(), filePath),
            size: stats.size,
            sizeFormatted: `${(stats.size / 1024).toFixed(2)} KB`,
            modified: stats.mtime.toISOString(),
            valid: true,
            structure: analyzeStructure(data, filePath)
        };
        
        results.stats.total++;
        results.stats.valid++;
        results.stats.totalSize += stats.size;
        
        return info;
    } catch (error) {
        results.stats.total++;
        results.stats.invalid++;
        return {
            path: path.relative(process.cwd(), filePath),
            valid: false,
            error: error.message
        };
    }
}

function analyzeStructure(data, filePath) {
    const fileName = path.basename(filePath);
    
    // Quiz/Template
    if (data.metadata || data.steps || data.settings) {
        return {
            type: 'quiz-template',
            hasMetadata: !!data.metadata,
            hasSteps: !!data.steps,
            stepsCount: data.steps?.length || 0,
            totalBlocks: data.steps?.reduce((sum, s) => sum + (s.blocks?.length || 0), 0) || 0,
            version: data.version || data.metadata?.version || 'unknown'
        };
    }
    
    // Step individual
    if (data.id && data.blocks && fileName.includes('step')) {
        return {
            type: 'step',
            stepId: data.id,
            blockCount: data.blocks?.length || 0,
            blockTypes: [...new Set(data.blocks?.map(b => b.type) || [])]
        };
    }
    
    // Blocks registry
    if (fileName.includes('blocks.json')) {
        return {
            type: 'blocks-registry',
            blockCount: Object.keys(data).length,
            blockTypes: Object.keys(data)
        };
    }
    
    // Config
    if (fileName.includes('config') || fileName.includes('package')) {
        return {
            type: 'config',
            keys: Object.keys(data).slice(0, 10)
        };
    }
    
    // Generic
    return {
        type: 'generic',
        keys: Object.keys(data).slice(0, 10),
        depth: getDepth(data)
    };
}

function getDepth(obj, depth = 0) {
    if (typeof obj !== 'object' || obj === null) return depth;
    const depths = Object.values(obj).map(v => getDepth(v, depth + 1));
    return Math.max(depth, ...depths);
}

async function scanDirectory(dir, category) {
    try {
        const entries = await fs.readdir(dir, { withFileTypes: true });
        
        for (const entry of entries) {
            const fullPath = path.join(dir, entry.name);
            
            if (entry.isDirectory()) {
                await scanDirectory(fullPath, category);
            } else if (entry.name.endsWith('.json')) {
                const info = await analyzeJSON(fullPath);
                results[category].push(info);
            }
        }
    } catch (error) {
        // Ignore inaccessible directories
    }
}

async function run() {
    console.log('🔍 Auditando arquivos JSON...\n');
    
    // Scan templates
    await scanDirectory(path.join(__dirname, 'public/templates'), 'templates');
    
    // Scan data
    await scanDirectory(path.join(__dirname, 'data'), 'data');
    
    // Scan config files
    const configFiles = [
        'package.json',
        'tsconfig.json',
        'tsconfig.node.json',
        'railway.json',
        'knip-report.json'
    ];
    
    for (const file of configFiles) {
        const fullPath = path.join(__dirname, file);
        try {
            const info = await analyzeJSON(fullPath);
            results.config.push(info);
        } catch (e) {
            // File not found, skip
        }
    }
    
    // Save report
    await fs.writeFile(
        'AUDITORIA_JSON.json',
        JSON.stringify(results, null, 2)
    );
    
    console.log('✅ Auditoria concluída!');
    console.log(`📊 Total: ${results.stats.total} arquivos`);
    console.log(`✅ Válidos: ${results.stats.valid}`);
    console.log(`❌ Inválidos: ${results.stats.invalid}`);
    console.log(`💾 Tamanho total: ${(results.stats.totalSize / 1024).toFixed(2)} KB`);
    console.log('\n📄 Relatório salvo em: AUDITORIA_JSON.json');
}

run().catch(console.error);
