/**
 * 🔍 VALIDAÇÃO DE COBERTURA DO BLOCK REGISTRY
 * 
 * Script para validar que todos os tipos definidos no BlockTypeZ
 * possuem definições correspondentes no BlockRegistry.
 */

import { BlockRegistry } from '../src/core/quiz/blocks/registry';
import { BlockTypeZ } from '../src/schemas/quiz-schema.zod';

// Extrai todos os tipos válidos do enum Zod
const schemaTypes = BlockTypeZ._def.values as string[];
const registeredTypes = BlockRegistry.getAllTypes();

console.log('🔍 VALIDAÇÃO DE COBERTURA DO BLOCK REGISTRY\n');
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

console.log(`📋 Tipos no Schema (BlockTypeZ): ${schemaTypes.length}`);
console.log(`✅ Tipos Registrados: ${registeredTypes.length}\n`);

// Encontra tipos não registrados
const missingTypes = schemaTypes.filter(type => !BlockRegistry.hasType(type));

// Encontra tipos registrados mas não no schema
const extraTypes = registeredTypes.filter(type => !schemaTypes.includes(type));

if (missingTypes.length === 0 && extraTypes.length === 0) {
    console.log('✅ PERFEITO! Cobertura completa - todos os tipos estão registrados!\n');
} else {
    if (missingTypes.length > 0) {
        console.log('❌ TIPOS FALTANDO NO REGISTRY:\n');
        missingTypes.forEach(type => {
            console.log(`   - ${type}`);
        });
        console.log('');
    }

    if (extraTypes.length > 0) {
        console.log('⚠️  TIPOS NO REGISTRY MAS NÃO NO SCHEMA:\n');
        extraTypes.forEach(type => {
            console.log(`   - ${type}`);
        });
        console.log('');
    }
}

// Estatísticas detalhadas
const stats = BlockRegistry.getStats();
console.log('📊 ESTATÍSTICAS:\n');
console.log(`   Total de definições: ${stats.totalDefinitions}`);
console.log(`   Total de aliases: ${stats.totalAliases}`);
console.log(`   Categorias: ${stats.categories}`);
console.log('');

// Lista aliases
console.log('🔗 ALIASES REGISTRADOS:\n');
const aliases = BlockRegistry.getAliases();
aliases.forEach((target, alias) => {
    console.log(`   ${alias} → ${target}`);
});
console.log('');

// Resumo por categoria
console.log('📁 DISTRIBUIÇÃO POR CATEGORIA:\n');
const byCategory = registeredTypes.reduce((acc, type) => {
    const def = BlockRegistry.getDefinition(type);
    if (def) {
        acc[def.category] = (acc[def.category] || 0) + 1;
    }
    return acc;
}, {} as Record<string, number>);

Object.entries(byCategory).forEach(([category, count]) => {
    console.log(`   ${category}: ${count} blocos`);
});
console.log('');

console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

// Exit code
process.exit(missingTypes.length > 0 ? 1 : 0);
