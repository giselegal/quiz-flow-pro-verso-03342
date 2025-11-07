/**
 * 🧪 ANÁLISE COMPLETA DE COMPONENTES DAS ETAPAS
 * Gera tabela completa com todas as verificações solicitadas
 */

const fs = require('fs');
const path = require('path');

console.log('🔍 ANÁLISE COMPLETA DE COMPONENTES DAS ETAPAS');
console.log('═'.repeat(80));

// 1. COLETAR TODOS OS TIPOS DE BLOCOS DOS TEMPLATES JSON
const templateDir = 'public/templates';
const blockTypes = new Set();
const stepAnalysis = {};

if (fs.existsSync(templateDir)) {
    const files = fs.readdirSync(templateDir).filter(f => f.endsWith('.json'));
    
    files.forEach(file => {
        try {
            const content = JSON.parse(fs.readFileSync(path.join(templateDir, file), 'utf8'));
            const stepId = file.replace('.json', '');
            
            stepAnalysis[stepId] = {
                file: file,
                blocks: [],
                hasParentId: false,
                isVirtualized: false
            };
            
            if (content.blocks && Array.isArray(content.blocks)) {
                content.blocks.forEach(block => {
                    blockTypes.add(block.type);
                    stepAnalysis[stepId].blocks.push({
                        type: block.type,
                        id: block.id,
                        hasParentId: !!block.parentId,
                        hasContent: !!block.content,
                        hasProperties: !!block.properties
                    });
                    
                    if (block.parentId) {
                        stepAnalysis[stepId].hasParentId = true;
                        stepAnalysis[stepId].isVirtualized = true;
                    }
                });
            }
        } catch (e) {
            console.error(`❌ Erro ao ler ${file}:`, e.message);
        }
    });
}

console.log(`📊 Encontrados ${blockTypes.size} tipos únicos de blocos em ${Object.keys(stepAnalysis).length} steps`);
console.log();

// 2. VERIFICAR REGISTRY PRINCIPAL
const registryPaths = [
    'src/config/enhancedBlockRegistry.ts',
    'src/editor/registry/BlockRegistry.ts', 
    'src/registry/UnifiedBlockRegistry.ts'
];

const registeredTypes = new Set();

registryPaths.forEach(regPath => {
    if (fs.existsSync(regPath)) {
        const content = fs.readFileSync(regPath, 'utf8');
        // Procurar por padrões de registro mais amplos
        const patterns = [
            /['"]([^'"]+)['"]\s*:/g,
            /register\(['"]([^'"]+)['"]/g,
            /type:\s*['"]([^'"]+)['"]/g
        ];
        
        patterns.forEach(pattern => {
            let match;
            while ((match = pattern.exec(content)) !== null) {
                registeredTypes.add(match[1]);
            }
        });
    }
});

console.log(`📋 Encontrados ${registeredTypes.size} tipos registrados nos registries`);
console.log();

// 3. VERIFICAR COMPONENTES FÍSICOS
const componentPaths = [
    'src/components/editor/blocks',
    'src/components/quiz/blocks', 
    'src/components/core/blocks'
];

const physicalComponents = new Set();

componentPaths.forEach(compPath => {
    if (fs.existsSync(compPath)) {
        function scanDir(dir) {
            const items = fs.readdirSync(dir);
            items.forEach(item => {
                const itemPath = path.join(dir, item);
                const stat = fs.statSync(itemPath);
                
                if (stat.isDirectory()) {
                    scanDir(itemPath);
                } else if (item.endsWith('.tsx') || item.endsWith('.ts')) {
                    const baseName = item.replace(/\.(tsx?|jsx?)$/, '');
                    physicalComponents.add(baseName);
                }
            });
        }
        scanDir(compPath);
    }
});

console.log(`🧩 Encontrados ${physicalComponents.size} componentes físicos`);
console.log();

// 4. GERAR TABELA DE ANÁLISE
console.log('📋 TABELA DE ANÁLISE DE COMPONENTES');
console.log('═'.repeat(130));
console.log(`${'TIPO'.padEnd(25)} | ${'REGISTRADO'.padEnd(10)} | ${'COMPONENTE'.padEnd(12)} | ${'JSON_DINÂMICO'.padEnd(13)} | ${'HTML/TSX'.padEnd(9)} | ${'VIRTUALIZADO'.padEnd(12)} | STEPS_USADOS`);
console.log('-'.repeat(130));

const allTypes = Array.from(blockTypes).sort();

allTypes.forEach(type => {
    const isRegistered = registeredTypes.has(type) ? '✅' : '❌';
    const hasComponent = Array.from(physicalComponents).some(comp => 
        comp.toLowerCase().includes(type.toLowerCase()) || 
        type.toLowerCase().includes(comp.toLowerCase())
    ) ? '✅' : '❌';
    
    // Verificar se é usado em JSON dinâmico
    const isJsonDynamic = Object.values(stepAnalysis).some(step => 
        step.blocks.some(block => block.type === type && (block.hasContent || block.hasProperties))
    ) ? '✅' : '❌';
    
    // Verificar se tem HTML/TSX
    const hasHtml = hasComponent === '✅' ? '✅' : '❓';
    
    // Verificar virtualização
    const isVirtualized = Object.values(stepAnalysis).some(step => 
        step.blocks.some(block => block.type === type && block.hasParentId)
    ) ? '✅' : '❌';
    
    // Steps onde é usado
    const usedInSteps = Object.entries(stepAnalysis)
        .filter(([_, step]) => step.blocks.some(block => block.type === type))
        .map(([stepId, _]) => stepId)
        .join(', ');
    
    console.log(`${type.padEnd(25)} | ${isRegistered.padEnd(10)} | ${hasComponent.padEnd(12)} | ${isJsonDynamic.padEnd(13)} | ${hasHtml.padEnd(9)} | ${isVirtualized.padEnd(12)} | ${usedInSteps}`);
});

console.log();
console.log('📊 RESUMO ESTATÍSTICO:');
console.log('-'.repeat(50));

const registered = allTypes.filter(type => registeredTypes.has(type)).length;
const withComponents = allTypes.filter(type => 
    Array.from(physicalComponents).some(comp => 
        comp.toLowerCase().includes(type.toLowerCase()) || 
        type.toLowerCase().includes(comp.toLowerCase())
    )
).length;
const jsonDynamic = allTypes.filter(type =>
    Object.values(stepAnalysis).some(step => 
        step.blocks.some(block => block.type === type && (block.hasContent || block.hasProperties))
    )
).length;
const virtualized = allTypes.filter(type =>
    Object.values(stepAnalysis).some(step => 
        step.blocks.some(block => block.type === type && block.hasParentId)
    )
).length;

console.log(`✅ Registrados: ${registered}/${allTypes.length} (${Math.round(registered/allTypes.length*100)}%)`);
console.log(`🧩 Com Componentes: ${withComponents}/${allTypes.length} (${Math.round(withComponents/allTypes.length*100)}%)`);
console.log(`📄 JSON Dinâmicos: ${jsonDynamic}/${allTypes.length} (${Math.round(jsonDynamic/allTypes.length*100)}%)`);
console.log(`🌐 Virtualizados: ${virtualized}/${allTypes.length} (${Math.round(virtualized/allTypes.length*100)}%)`);

console.log();
console.log('🔍 PROBLEMAS IDENTIFICADOS:');
console.log('-'.repeat(50));

const notRegistered = allTypes.filter(type => !registeredTypes.has(type));
const noComponents = allTypes.filter(type => 
    !Array.from(physicalComponents).some(comp => 
        comp.toLowerCase().includes(type.toLowerCase()) || 
        type.toLowerCase().includes(comp.toLowerCase())
    )
);

if (notRegistered.length > 0) {
    console.log(`❌ Não registrados (${notRegistered.length}): ${notRegistered.join(', ')}`);
}

if (noComponents.length > 0) {
    console.log(`❌ Sem componentes (${noComponents.length}): ${noComponents.join(', ')}`);
}

if (notRegistered.length === 0 && noComponents.length === 0) {
    console.log('🎉 Nenhum problema crítico encontrado!');
}

console.log();
console.log('💡 ANÁLISE DETALHADA POR STEP:');
console.log('-'.repeat(50));

Object.entries(stepAnalysis).forEach(([stepId, analysis]) => {
    console.log(`📋 ${stepId}:`);
    console.log(`   • Blocos: ${analysis.blocks.length}`);
    console.log(`   • Virtualização: ${analysis.isVirtualized ? '✅' : '❌'}`);
    console.log(`   • Tipos únicos: ${[...new Set(analysis.blocks.map(b => b.type))].join(', ')}`);
});

console.log();
console.log('✨ Análise concluída com sucesso!');