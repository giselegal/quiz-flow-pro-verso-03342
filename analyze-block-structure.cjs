/**
 * 🔍 ANÁLISE E CORREÇÃO DA ESTRUTURA DE BLOCOS
 * 
 * Este script analisa a estrutura atual dos blocos e identifica correções necessárias
 */

const fs = require('fs');
const path = require('path');

console.log('🔍 ANÁLISE E CORREÇÃO DA ESTRUTURA DE BLOCOS');
console.log('═'.repeat(80));

// ============================================================================
// 1. ANALISAR BLOCOS REAIS DOS TEMPLATES JSON
// ============================================================================

function analyzeTemplateBlocks() {
    const templatesDir = 'public/templates';
    const realBlocks = new Map();
    const stepUsage = new Map();
    
    if (!fs.existsSync(templatesDir)) {
        console.error('❌ Diretório de templates não encontrado:', templatesDir);
        return { realBlocks, stepUsage };
    }
    
    const files = fs.readdirSync(templatesDir).filter(f => f.endsWith('.json') && f.startsWith('step-'));
    
    files.forEach(file => {
        try {
            const content = JSON.parse(fs.readFileSync(path.join(templatesDir, file), 'utf8'));
            const stepId = file.replace('.json', '');
            
            if (content.blocks && Array.isArray(content.blocks)) {
                stepUsage.set(stepId, new Set());
                
                content.blocks.forEach(block => {
                    if (!realBlocks.has(block.type)) {
                        realBlocks.set(block.type, {
                            type: block.type,
                            usedInSteps: new Set(),
                            hasProperties: false,
                            hasContent: false,
                            hasParentId: false,
                            examples: []
                        });
                    }
                    
                    const blockInfo = realBlocks.get(block.type);
                    blockInfo.usedInSteps.add(stepId);
                    stepUsage.get(stepId).add(block.type);
                    
                    if (block.properties) blockInfo.hasProperties = true;
                    if (block.content) blockInfo.hasContent = true;
                    if (block.parentId) blockInfo.hasParentId = true;
                    
                    // Guardar exemplo para análise
                    if (blockInfo.examples.length < 2) {
                        blockInfo.examples.push({
                            id: block.id,
                            step: stepId,
                            properties: block.properties ? Object.keys(block.properties) : [],
                            content: block.content ? Object.keys(block.content) : []
                        });
                    }
                });
            }
        } catch (e) {
            console.warn(`⚠️ Erro ao ler ${file}:`, e.message);
        }
    });
    
    return { realBlocks, stepUsage };
}

// ============================================================================
// 2. ANALISAR REGISTRY ATUAL
// ============================================================================

function analyzeRegistryBlocks() {
    const registryPaths = [
        'src/registry/UnifiedBlockRegistry.ts',
        'src/config/enhancedBlockRegistry.ts',
        'src/editor/registry/BlockRegistry.ts'
    ];
    
    const registeredBlocks = new Set();
    const staticBlocks = new Set();
    const lazyBlocks = new Set();
    
    registryPaths.forEach(regPath => {
        if (fs.existsSync(regPath)) {
            const content = fs.readFileSync(regPath, 'utf8');
            
            // Procurar imports estáticos
            const staticMatches = content.match(/import\s+\w+Block\s+from\s+['"]([^'"]+)['"]/g) || [];
            staticMatches.forEach(match => {
                const blockName = match.match(/import\s+(\w+Block)/)?.[1];
                if (blockName) {
                    staticBlocks.add(blockName.replace('Block', '').toLowerCase());
                }
            });
            
            // Procurar imports lazy
            const lazyMatches = content.match(/'([^']+)'\s*:\s*\(\)\s*=>/g) || [];
            lazyMatches.forEach(match => {
                const blockType = match.match(/'([^']+)'/)?.[1];
                if (blockType) {
                    lazyBlocks.add(blockType);
                    registeredBlocks.add(blockType);
                }
            });
            
            // Procurar registros diretos
            const directMatches = content.match(/['"]([^'"]+)['"]\s*:/g) || [];
            directMatches.forEach(match => {
                const type = match.replace(/['"]|:\s*$/g, '');
                if (type && type.length > 1 && !type.includes(' ')) {
                    registeredBlocks.add(type);
                }
            });
        }
    });
    
    return { registeredBlocks, staticBlocks, lazyBlocks };
}

// ============================================================================
// 3. ANALISAR COMPONENTES FÍSICOS
// ============================================================================

function analyzePhysicalComponents() {
    const componentPaths = [
        'src/components/editor/blocks',
        'src/components/editor/blocks/atomic',
        'src/components/quiz/blocks',
        'src/components/sections'
    ];
    
    const physicalComponents = new Map();
    
    componentPaths.forEach(compPath => {
        if (fs.existsSync(compPath)) {
            function scanDir(dir, prefix = '') {
                const items = fs.readdirSync(dir);
                items.forEach(item => {
                    const itemPath = path.join(dir, item);
                    const stat = fs.statSync(itemPath);
                    
                    if (stat.isDirectory()) {
                        scanDir(itemPath, prefix + item + '/');
                    } else if (item.endsWith('.tsx') || item.endsWith('.ts')) {
                        const baseName = item.replace(/\\.(tsx?|jsx?)$/, '');
                        const fullPath = prefix + baseName;
                        
                        // Tentar mapear para tipo de bloco
                        let blockType = baseName
                            .replace(/Block$/, '')
                            .replace(/([A-Z])/g, '-$1')
                            .toLowerCase()
                            .replace(/^-/, '');
                            
                        physicalComponents.set(blockType, {
                            fileName: baseName,
                            path: itemPath,
                            fullPath: fullPath
                        });
                        
                        // Adicionar variações comuns
                        if (baseName.includes('Inline')) {
                            const inlineType = blockType + '-inline';
                            physicalComponents.set(inlineType, {
                                fileName: baseName,
                                path: itemPath,
                                fullPath: fullPath
                            });
                        }
                    }
                });
            }
            scanDir(compPath);
        }
    });
    
    return physicalComponents;
}

// ============================================================================
// 4. EXECUTAR ANÁLISES
// ============================================================================

console.log('📊 Coletando dados dos templates JSON...');
const { realBlocks, stepUsage } = analyzeTemplateBlocks();

console.log('📊 Analisando registry atual...');
const { registeredBlocks, staticBlocks, lazyBlocks } = analyzeRegistryBlocks();

console.log('📊 Verificando componentes físicos...');
const physicalComponents = analyzePhysicalComponents();

// ============================================================================
// 5. GERAR RELATÓRIO DE CORREÇÕES
// ============================================================================

console.log('\\n🔍 RELATÓRIO DE ANÁLISE E CORREÇÕES');
console.log('═'.repeat(80));

// Classificar blocos por prioridade
const criticalBlocks = [];
const missingComponents = [];
const incorrectMappings = [];
const unusedRegistrations = [];

// Analisar cada bloco real
realBlocks.forEach((blockInfo, blockType) => {
    const stepCount = blockInfo.usedInSteps.size;
    const isRegistered = registeredBlocks.has(blockType);
    const hasPhysicalComponent = physicalComponents.has(blockType);
    
    // Determinar se é crítico (usado em muitos steps)
    if (stepCount >= 5) {
        criticalBlocks.push({
            type: blockType,
            stepCount,
            isRegistered,
            hasPhysicalComponent,
            steps: Array.from(blockInfo.usedInSteps),
            priority: stepCount >= 10 ? 'CRÍTICO' : 'ALTO'
        });
    }
    
    // Componentes faltando
    if (!hasPhysicalComponent) {
        missingComponents.push({
            type: blockType,
            stepCount,
            isRegistered,
            steps: Array.from(blockInfo.usedInSteps),
            examples: blockInfo.examples
        });
    }
});

// Registrações não utilizadas
registeredBlocks.forEach(regType => {
    if (!realBlocks.has(regType)) {
        unusedRegistrations.push(regType);
    }
});

// ============================================================================
// 6. EXIBIR RELATÓRIO
// ============================================================================

console.log('\\n📋 BLOCOS CRÍTICOS (Prioridade Máxima):');
console.log('-'.repeat(60));
criticalBlocks
    .sort((a, b) => b.stepCount - a.stepCount)
    .forEach(block => {
        const status = block.hasPhysicalComponent ? '✅' : '❌';
        const regStatus = block.isRegistered ? '🔗' : '❌';
        console.log(\`\${status} \${regStatus} \${block.type.padEnd(25)} | \${block.stepCount} steps | \${block.priority}\`);
    });

console.log('\\n❌ COMPONENTES SEM IMPLEMENTAÇÃO FÍSICA:');
console.log('-'.repeat(60));
missingComponents
    .sort((a, b) => b.stepCount - a.stepCount)
    .slice(0, 15) // Top 15 mais críticos
    .forEach(comp => {
        const regStatus = comp.isRegistered ? '🔗 REG' : '❌ UNREG';
        console.log(\`• \${comp.type.padEnd(25)} | \${comp.stepCount} steps | \${regStatus}\`);
        if (comp.examples.length > 0) {
            const example = comp.examples[0];
            console.log(\`  └─ Ex: \${example.step} - props: [\${example.properties.slice(0,3).join(', ')}] content: [\${example.content.slice(0,3).join(', ')}]\`);
        }
    });

console.log('\\n🗑️ REGISTRAÇÕES NÃO UTILIZADAS (podem ser removidas):');
console.log('-'.repeat(60));
if (unusedRegistrations.length > 0) {
    unusedRegistrations.slice(0, 10).forEach(reg => {
        console.log(\`• \${reg}\`);
    });
    if (unusedRegistrations.length > 10) {
        console.log(\`... e mais \${unusedRegistrations.length - 10} tipos\`);
    }
} else {
    console.log('✅ Nenhuma registração desnecessária encontrada');
}

console.log('\\n📊 RESUMO ESTATÍSTICO:');
console.log('-'.repeat(40));
console.log(\`📄 Blocos reais nos JSONs: \${realBlocks.size}\`);
console.log(\`🔗 Blocos registrados: \${registeredBlocks.size}\`);
console.log(\`🧩 Componentes físicos: \${physicalComponents.size}\`);
console.log(\`🔥 Blocos críticos: \${criticalBlocks.length}\`);
console.log(\`❌ Sem implementação: \${missingComponents.length}\`);
console.log(\`🗑️ Registrações desnecessárias: \${unusedRegistrations.length}\`);

// ============================================================================
// 7. GERAR PLANO DE AÇÃO
// ============================================================================

console.log('\\n🚀 PLANO DE AÇÃO RECOMENDADO:');
console.log('═'.repeat(50));

console.log('\\n**FASE 1: CRÍTICA** (Implementar imediatamente)');
const phase1 = criticalBlocks
    .filter(b => !b.hasPhysicalComponent && b.stepCount >= 10)
    .slice(0, 4);
    
phase1.forEach((block, i) => {
    console.log(\`\${i+1}. Implementar \${block.type} (usado em \${block.stepCount} steps)\`);
});

console.log('\\n**FASE 2: ALTA** (Próximas 2 semanas)');
const phase2 = criticalBlocks
    .filter(b => !b.hasPhysicalComponent && b.stepCount >= 5 && b.stepCount < 10)
    .slice(0, 6);
    
phase2.forEach((block, i) => {
    console.log(\`\${i+1}. Implementar \${block.type} (usado em \${block.stepCount} steps)\`);
});

console.log('\\n**LIMPEZA:** Remover registrações não utilizadas');
if (unusedRegistrations.length > 0) {
    console.log(\`• Remover \${unusedRegistrations.length} tipos não utilizados do registry\`);
}

console.log('\\n✨ Análise concluída! Use este relatório para priorizar o desenvolvimento.');

// ============================================================================
// 8. SALVAR DADOS PARA CORREÇÕES AUTOMÁTICAS
// ============================================================================

const analysisData = {
    realBlocks: Array.from(realBlocks.entries()).map(([type, info]) => ({
        type,
        ...info,
        usedInSteps: Array.from(info.usedInSteps)
    })),
    criticalBlocks,
    missingComponents,
    unusedRegistrations,
    stepUsage: Array.from(stepUsage.entries()).map(([step, types]) => ({
        step,
        types: Array.from(types)
    })),
    stats: {
        realBlocks: realBlocks.size,
        registeredBlocks: registeredBlocks.size,
        physicalComponents: physicalComponents.size,
        criticalBlocks: criticalBlocks.length,
        missingComponents: missingComponents.length
    }
};

fs.writeFileSync('block-structure-analysis.json', JSON.stringify(analysisData, null, 2));
console.log('\\n💾 Dados da análise salvos em: block-structure-analysis.json');