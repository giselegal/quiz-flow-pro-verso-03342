#!/usr/bin/env node
import fs from 'fs';
import path from 'path';

console.log('🔍 ANÁLISE DE COMPONENTES FALTANTES');
console.log('='.repeat(60));

// 1. Ler EnhancedBlockRegistry para extrair TODOS os tipos registrados
const registryPath = 'src/components/editor/blocks/EnhancedBlockRegistry.tsx';
const registryContent = fs.readFileSync(registryPath, 'utf-8');

// Extrair todos os tipos (keys do registry)
const registryTypes = new Set();
const typeMatches = registryContent.matchAll(/'([^']+)':\s*(?:[A-Z][a-zA-Z]+|lazy)/g);
for (const match of typeMatches) {
    if (!match[1].includes('*')) { // Excluir wildcards
        registryTypes.add(match[1]);
    }
}

// 2. Ler blockPropertySchemas para extrair todos os tipos do schema
const schemaPath = 'src/config/blockPropertySchemas.ts';
const schemaContent = fs.readFileSync(schemaPath, 'utf-8');

const schemaTypes = new Set();
const schemaMatches = schemaContent.matchAll(/'([^']+)':\s*\{[\s\S]*?label:\s*'([^']+)'/g);
for (const match of schemaMatches) {
    if (match[1] !== 'universal-default') {
        schemaTypes.add(match[1]);
    }
}

// 3. Buscar arquivos de componentes físicos
const blocksDir = 'src/components/editor/blocks';
const componentFiles = fs.readdirSync(blocksDir)
    .filter(f => f.endsWith('Block.tsx') || f.endsWith('InlineBlock.tsx'))
    .filter(f => f !== 'EnhancedBlockRegistry.tsx');

// 4. Comparar
const inSchemaNotInRegistry = Array.from(schemaTypes).filter(t => !registryTypes.has(t));
const inRegistryNotInSchema = Array.from(registryTypes).filter(t => !schemaTypes.has(t));

console.log('\n📊 ESTATÍSTICAS:');
console.log('  • Tipos no Registry:', registryTypes.size);
console.log('  • Tipos no Schema:', schemaTypes.size);
console.log('  • Arquivos de componentes físicos:', componentFiles.length);

console.log('\n❌ TIPOS NO SCHEMA MAS NÃO NO REGISTRY (' + inSchemaNotInRegistry.length + '):');
console.log('   (Estes componentes têm schema mas não estão registrados para renderização)');
inSchemaNotInRegistry.sort().forEach((type, i) => {
    console.log(`   ${i + 1}. '${type}'`);
});

console.log('\n⚠️ TIPOS NO REGISTRY MAS NÃO NO SCHEMA (' + inRegistryNotInSchema.length + '):');
console.log('   (Estes componentes podem ser renderizados mas não têm painel de propriedades)');
inRegistryNotInSchema.sort().slice(0, 30).forEach((type, i) => {
    console.log(`   ${i + 1}. '${type}'`);
});
if (inRegistryNotInSchema.length > 30) {
    console.log(`   ... e mais ${inRegistryNotInSchema.length - 30} tipos`);
}

console.log('\n🔧 COMPONENTES FÍSICOS SEM REGISTRO:');
console.log('   (Arquivos de componentes que podem não estar no registry)');
componentFiles.slice(0, 20).forEach((file, i) => {
    const componentName = file.replace(/\.tsx$/, '');
    console.log(`   ${i + 1}. ${componentName}`);
});
if (componentFiles.length > 20) {
    console.log(`   ... e mais ${componentFiles.length - 20} arquivos`);
}

// 5. Identificar componentes críticos faltantes
console.log('\n🚨 COMPONENTES CRÍTICOS FALTANDO NO REGISTRY:');
const criticalComponents = [
    'testimonials-carousel-inline',
    'testimonial-card-inline',
    'mentor-section-inline',
    'value-anchoring',
    'secure-purchase',
    'before-after-inline',
    'urgency-timer-inline'
];

criticalComponents.forEach(type => {
    const inRegistry = registryTypes.has(type);
    const inSchema = schemaTypes.has(type);
    const status = inRegistry && inSchema ? '✅' : inRegistry ? '⚠️ Sem schema' : inSchema ? '❌ Não registrado' : '❌❌ Não existe';
    console.log(`   ${status} ${type}`);
});

console.log('\n' + '='.repeat(60));
