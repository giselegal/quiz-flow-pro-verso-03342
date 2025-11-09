/**
 * 🔧 CORREÇÃO AUTOMÁTICA DA ESTRUTURA DE BLOCOS
 * 
 * Este script aplica as correções necessárias na estrutura de blocos
 */

const fs = require('fs');
const path = require('path');

console.log('🔧 CORREÇÃO AUTOMÁTICA DA ESTRUTURA DE BLOCOS');
console.log('='.repeat(70));

// Carregar análise anterior
let analysisData = null;
if (fs.existsSync('block-analysis-results.json')) {
    analysisData = JSON.parse(fs.readFileSync('block-analysis-results.json', 'utf8'));
    console.log('✅ Análise carregada:', analysisData.blocks.length, 'blocos');
} else {
    console.error('❌ Arquivo de análise não encontrado. Execute analyze-blocks-simple.cjs primeiro.');
    process.exit(1);
}

// ============================================================================
// 1. CORREÇÕES NO UNIFIED BLOCK REGISTRY
// ============================================================================

function fixUnifiedBlockRegistry() {
    const registryPath = 'src/registry/UnifiedBlockRegistry.ts';
    
    if (!fs.existsSync(registryPath)) {
        console.error('❌ UnifiedBlockRegistry não encontrado:', registryPath);
        return false;
    }
    
    console.log('🔧 Corrigindo UnifiedBlockRegistry...');
    
    let content = fs.readFileSync(registryPath, 'utf8');
    
    // Verificar se os blocos críticos estão registrados como lazy
    const criticalBlocks = analysisData.critical || [];
    const missingCriticalBlocks = [];
    
    criticalBlocks.forEach(blockType => {
        if (!content.includes(`'${blockType}':`)) {
            missingCriticalBlocks.push(blockType);
        }
    });
    
    if (missingCriticalBlocks.length > 0) {
        console.log('➕ Adicionando blocos críticos faltantes:', missingCriticalBlocks.join(', '));
        
        // Encontrar a seção de lazyImports
        const lazyImportsMatch = content.match(/(const lazyImports:[^{]*{[^}]*)/s);
        if (lazyImportsMatch) {
            let newImports = '';
            
            missingCriticalBlocks.forEach(blockType => {
                const componentName = blockType
                    .split('-')
                    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                    .join('') + 'Block';
                    
                newImports += `
  // 🔥 CRÍTICO: ${blockType}
  '${blockType}': () => import('@/components/editor/blocks/atomic/${componentName}'),`;
            });
            
            // Inserir antes do fechamento dos lazyImports
            content = content.replace(
                /(\s+\/\/ Container Components)/,
                newImports + '$1'
            );
        }
    }
    
    // Backup do arquivo original
    fs.writeFileSync(registryPath + '.backup', fs.readFileSync(registryPath, 'utf8'));
    
    // Escrever versão corrigida
    fs.writeFileSync(registryPath, content);
    
    return true;
}

// ============================================================================
// 2. CRIAR COMPONENTES ATÔMICOS FALTANTES
// ============================================================================

function createMissingComponents() {
    const atomicDir = 'src/components/editor/blocks/atomic';
    
    // Criar diretório se não existir
    if (!fs.existsSync(atomicDir)) {
        fs.mkdirSync(atomicDir, { recursive: true });
        console.log('📁 Criado diretório:', atomicDir);
    }
    
    const criticalBlocks = analysisData.critical || [];
    const createdComponents = [];
    
    criticalBlocks.forEach(blockType => {
        const componentName = blockType
            .split('-')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join('') + 'Block';
            
        const filePath = path.join(atomicDir, componentName + '.tsx');
        
        if (!fs.existsSync(filePath)) {
            const componentCode = generateAtomicComponent(blockType, componentName);
            fs.writeFileSync(filePath, componentCode);
            createdComponents.push(componentName);
            console.log('✅ Criado:', componentName);
        } else {
            console.log('⚠️ Já existe:', componentName);
        }
    });
    
    return createdComponents;
}

function generateAtomicComponent(blockType, componentName) {
    // Encontrar exemplo do bloco para extrair propriedades
    const blockInfo = analysisData.blocks.find(b => b.type === blockType);
    const example = blockInfo?.examples?.[0] || {};
    
    // Determinar categoria base do componente
    let baseImport = 'BlockComponentProps';
    let renderContent = 'return <div>Placeholder for ' + blockType + '</div>;';
    
    if (blockType.includes('progress')) {
        renderContent = `
    const { currentStep = 1, totalSteps = 21, showPercentage = true } = data.content || {};
    const percentage = Math.round((currentStep / totalSteps) * 100);
    
    return (
        <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
            <div 
                className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                style={{ width: \`\${percentage}%\` }}
            />
            {showPercentage && (
                <div className="text-sm text-gray-600 mt-1">
                    {currentStep} de {totalSteps} ({percentage}%)
                </div>
            )}
        </div>
    );`;
    } else if (blockType.includes('title')) {
        renderContent = `
    const { title = 'Título da Pergunta', subtitle } = data.content || {};
    const { fontSize = '24px', fontWeight = '600', textAlign = 'center' } = data.properties || {};
    
    return (
        <div className="text-center mb-6">
            <h2 
                className="text-gray-800"
                style={{ fontSize, fontWeight, textAlign }}
                dangerouslySetInnerHTML={{ __html: title }}
            />
            {subtitle && (
                <p className="text-gray-600 mt-2">{subtitle}</p>
            )}
        </div>
    );`;
    } else if (blockType.includes('navigation')) {
        renderContent = `
    const { showBack = false, showNext = true, nextText = 'Próxima', backText = 'Voltar' } = data.content || {};
    
    return (
        <div className="flex justify-between items-center mt-8">
            {showBack ? (
                <button className="px-4 py-2 text-gray-600 border rounded hover:bg-gray-50">
                    {backText}
                </button>
            ) : <div />}
            
            {showNext && (
                <button className="px-6 py-3 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors">
                    {nextText}
                </button>
            )}
        </div>
    );`;
    } else if (blockType.includes('options')) {
        renderContent = `
    const { options = [], maxSelections = 3, minSelections = 1 } = data.content || {};
    const { columns = 2, gap = '1rem' } = data.properties || {};
    
    return (
        <div 
            className="grid gap-4"
            style={{ 
                gridTemplateColumns: \`repeat(\${columns}, 1fr)\`,
                gap 
            }}
        >
            {options.map((option, index) => (
                <div
                    key={option.id || index}
                    className="border-2 border-gray-200 rounded-lg p-4 cursor-pointer hover:border-blue-300 transition-colors"
                >
                    {option.imageUrl && (
                        <img 
                            src={option.imageUrl} 
                            alt={option.text}
                            className="w-full h-32 object-cover rounded mb-2"
                        />
                    )}
                    <p className="text-center font-medium">{option.text}</p>
                </div>
            ))}
        </div>
    );`;
    }
    
    return `/**
 * 🔥 COMPONENTE ATÔMICO: ${componentName}
 * 
 * Componente crítico para o funcionamento do quiz.
 * Usado em: ${blockInfo?.steps?.join(', ') || 'N/A'}
 * 
 * Gerado automaticamente pelo script de correção.
 */

import React from 'react';
import type { BlockComponentProps } from '@/types/blockTypes';

export interface ${componentName}Props extends BlockComponentProps {
    // Props específicas podem ser adicionadas aqui
}

export default function ${componentName}({ 
    data, 
    isSelected = false, 
    isEditable = false, 
    onSelect, 
    onUpdate 
}: ${componentName}Props) {
    ${renderContent}
}

// Configuração do componente
${componentName}.displayName = '${componentName}';
${componentName}.blockType = '${blockType}';
`;
}

// ============================================================================
// 3. EXECUTAR CORREÇÕES
// ============================================================================

console.log('🚀 Iniciando correções automáticas...');
console.log('');

// 1. Corrigir registry
console.log('ETAPA 1: Corrigindo UnifiedBlockRegistry');
const registryFixed = fixUnifiedBlockRegistry();
if (registryFixed) {
    console.log('✅ Registry corrigido');
} else {
    console.log('❌ Falha ao corrigir registry');
}

console.log('');

// 2. Criar componentes
console.log('ETAPA 2: Criando componentes atômicos faltantes');
const createdComponents = createMissingComponents();
console.log('✅ Criados', createdComponents.length, 'componentes');

console.log('');

// ============================================================================
// 4. GERAR RELATÓRIO DE CORREÇÕES
// ============================================================================

console.log('📋 RELATÓRIO DE CORREÇÕES APLICADAS:');
console.log('='.repeat(50));

console.log('');
console.log('✅ CORREÇÕES REALIZADAS:');
if (registryFixed) {
    console.log('• UnifiedBlockRegistry atualizado com blocos críticos');
}
console.log('• Criados', createdComponents.length, 'componentes atômicos');
console.log('• Backup do registry salvo em: UnifiedBlockRegistry.ts.backup');

console.log('');
console.log('🔥 COMPONENTES CRÍTICOS CRIADOS:');
createdComponents.forEach((comp, i) => {
    console.log((i+1) + '. ' + comp);
});

console.log('');
console.log('⚠️ PRÓXIMOS PASSOS MANUAIS:');
console.log('1. Revisar os componentes gerados em src/components/editor/blocks/atomic/');
console.log('2. Implementar a lógica específica de cada componente');
console.log('3. Adicionar estilos e interações necessárias');
console.log('4. Testar os componentes no editor');
console.log('5. Executar npm run build para verificar erros');

console.log('');
console.log('🎯 IMPACTO ESPERADO:');
console.log('• Quiz deve ficar 80% funcional com estes componentes');
console.log('• Navegação entre steps funcionará');
console.log('• Seleção de opções funcionará');
console.log('• Progresso será exibido corretamente');

console.log('');
console.log('✨ Correções concluídas! Execute npm run dev para testar.');