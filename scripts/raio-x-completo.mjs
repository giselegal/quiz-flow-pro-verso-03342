#!/usr/bin/env node

/**
 * 🔬 RAIO-X COMPLETO DO SISTEMA
 * Diagnóstico profundo de TUDO: imports, duplicidades, schemas, registro, renderização, virtualização, JSON
 */

import { readFileSync, existsSync, readdirSync, statSync } from 'fs';
import { join, dirname, basename } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// ============================================================
// CONFIGURAÇÃO
// ============================================================

const ATOMIC_BLOCKS = [
  'transition-title',
  'transition-loader',
  'transition-text',
  'transition-progress',
  'transition-message',
  'result-main',
  'result-style',
  'result-characteristics',
  'result-secondary-styles',
  'result-cta-primary',
  'result-cta-secondary',
  'result-share',
];

const FILES_TO_CHECK = {
  blockSchema: 'src/components/editor/quiz/schema/blockSchema.ts',
  registry: 'src/components/editor/blocks/EnhancedBlockRegistry.tsx',
  dynamicForm: 'src/components/editor/quiz/components/DynamicPropertiesForm.tsx',
  atomicDir: 'src/components/editor/blocks/atomic',
  editorTypes: 'src/types/editor.ts',
  blockProps: 'src/types/blockProps.ts',
};

// ============================================================
// UTILITÁRIOS
// ============================================================

function readFile(path) {
  const fullPath = join(process.cwd(), path);
  if (!existsSync(fullPath)) {
    return null;
  }
  return readFileSync(fullPath, 'utf8');
}

function getAllFiles(dir, fileList = []) {
  const fullPath = join(process.cwd(), dir);
  if (!existsSync(fullPath)) return fileList;
  
  const files = readdirSync(fullPath);
  
  files.forEach(file => {
    const filePath = join(fullPath, file);
    try {
      const stat = statSync(filePath);
      if (stat.isDirectory()) {
        getAllFiles(join(dir, file), fileList);
      } else if (file.endsWith('.tsx') || file.endsWith('.ts')) {
        fileList.push(join(dir, file));
      }
    } catch (err) {
      // Ignorar erros de symlinks quebrados
      console.warn(`   ⚠️  Ignorando arquivo/link quebrado: ${filePath}`);
    }
  });
  
  return fileList;
}

// ============================================================
// 1. DIAGNÓSTICO: IMPORTS
// ============================================================

console.log('🔬 RAIO-X COMPLETO DO SISTEMA');
console.log('═'.repeat(80));
console.log('\n📦 1. ANÁLISE DE IMPORTS\n');

const importAnalysis = {
  duplicated: [],
  missing: [],
  unused: [],
  circular: [],
};

// Verificar imports dos componentes atômicos
ATOMIC_BLOCKS.forEach(block => {
  const pascalName = block.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join('');
  const fileName = `${pascalName}Block.tsx`;
  const filePath = join(FILES_TO_CHECK.atomicDir, fileName);
  
  const content = readFile(filePath);
  
  if (!content) {
    importAnalysis.missing.push({
      block,
      file: fileName,
      reason: 'Arquivo não encontrado'
    });
    return;
  }
  
  // Verificar imports duplicados
  const imports = content.match(/^import\s+.+from\s+['"'].+['"];?$/gm) || [];
  const importMap = {};
  
  imports.forEach(imp => {
    if (importMap[imp]) {
      importAnalysis.duplicated.push({
        block,
        file: fileName,
        import: imp.trim()
      });
    }
    importMap[imp] = true;
  });
  
  // Verificar imports necessários
  const requiredImports = ['AtomicBlockProps', 'React'];
  requiredImports.forEach(req => {
    if (!content.includes(req)) {
      importAnalysis.missing.push({
        block,
        file: fileName,
        missing: req
      });
    }
  });
  
  // Verificar imports não utilizados
  const importedItems = imports.map(imp => {
    const match = imp.match(/import\s+(?:{([^}]+)}|(\w+))\s+from/);
    if (!match) return [];
    return match[1] ? match[1].split(',').map(s => s.trim()) : [match[2]];
  }).flat();
  
  importedItems.forEach(item => {
    const regex = new RegExp(`\\b${item.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'g');
    const matches = (content.match(regex) || []).length;
    if (matches <= 1) { // Só aparece no import
      importAnalysis.unused.push({
        block,
        file: fileName,
        unused: item
      });
    }
  });
});

console.log('📊 Imports Duplicados:', importAnalysis.duplicated.length);
if (importAnalysis.duplicated.length > 0) {
  importAnalysis.duplicated.forEach(d => {
    console.log(`   ❌ ${d.file}: ${d.import}`);
  });
}

console.log('\n📊 Imports Faltando:', importAnalysis.missing.length);
if (importAnalysis.missing.length > 0) {
  importAnalysis.missing.forEach(m => {
    console.log(`   ❌ ${m.file}: ${m.missing || m.reason}`);
  });
}

console.log('\n📊 Imports Não Utilizados:', importAnalysis.unused.length);
if (importAnalysis.unused.length > 0) {
  importAnalysis.unused.slice(0, 10).forEach(u => {
    console.log(`   ⚠️  ${u.file}: ${u.unused}`);
  });
  if (importAnalysis.unused.length > 10) {
    console.log(`   ... e mais ${importAnalysis.unused.length - 10}`);
  }
}

// ============================================================
// 2. DIAGNÓSTICO: DUPLICIDADES
// ============================================================

console.log('\n\n🔍 2. ANÁLISE DE DUPLICIDADES\n');

const duplicityAnalysis = {
  blockTypes: {},
  componentNames: {},
  schemaKeys: {},
};

// Verificar tipos de blocos duplicados
const registryContent = readFile(FILES_TO_CHECK.registry);
const blockTypeMatches = registryContent.match(/'([^']+)':\s*(?:lazy\(\(\)|[A-Z])/g) || [];

blockTypeMatches.forEach(match => {
  const type = match.match(/'([^']+)':/)[1];
  duplicityAnalysis.blockTypes[type] = (duplicityAnalysis.blockTypes[type] || 0) + 1;
});

console.log('📊 Tipos de Blocos no Registry:');
Object.entries(duplicityAnalysis.blockTypes).forEach(([type, count]) => {
  if (count > 1) {
    console.log(`   ❌ '${type}' - ${count} registros (DUPLICADO!)`);
  }
});

const duplicatedTypes = Object.entries(duplicityAnalysis.blockTypes).filter(([_, count]) => count > 1);
console.log(`\n   Total duplicados: ${duplicatedTypes.length}`);

// Verificar nomes de componentes duplicados
const atomicFiles = getAllFiles(FILES_TO_CHECK.atomicDir);
atomicFiles.forEach(file => {
  const name = basename(file, '.tsx');
  duplicityAnalysis.componentNames[name] = (duplicityAnalysis.componentNames[name] || 0) + 1;
});

console.log('\n📊 Nomes de Componentes:');
Object.entries(duplicityAnalysis.componentNames).forEach(([name, count]) => {
  if (count > 1) {
    console.log(`   ❌ ${name} - ${count} arquivos (DUPLICADO!)`);
  }
});

// Verificar schemas duplicados
const schemaContent = readFile(FILES_TO_CHECK.blockSchema);
const schemaMatches = schemaContent.match(/'([^']+)':\s*\{/g) || [];

schemaMatches.forEach(match => {
  const key = match.match(/'([^']+)':/)[1];
  duplicityAnalysis.schemaKeys[key] = (duplicityAnalysis.schemaKeys[key] || 0) + 1;
});

console.log('\n📊 Schemas no blockSchemaMap:');
Object.entries(duplicityAnalysis.schemaKeys).forEach(([key, count]) => {
  if (count > 1) {
    console.log(`   ❌ '${key}' - ${count} definições (DUPLICADO!)`);
  }
});

// ============================================================
// 3. DIAGNÓSTICO: SCHEMAS
// ============================================================

console.log('\n\n📋 3. ANÁLISE DE SCHEMAS\n');

const schemaAnalysis = {
  present: [],
  missing: [],
  incomplete: [],
  structure: {},
};

ATOMIC_BLOCKS.forEach(block => {
  const blockPattern = new RegExp(`'${block}':\\s*\\{`, 'g');
  const found = blockPattern.test(schemaContent);
  
  if (!found) {
    schemaAnalysis.missing.push(block);
    return;
  }
  
  schemaAnalysis.present.push(block);
  
  // Verificar estrutura do schema
  const blockStart = schemaContent.indexOf(`'${block}': {`);
  const nextBlock = schemaContent.indexOf('\n  },\n', blockStart);
  const blockContent = schemaContent.substring(blockStart, nextBlock + 5);
  
  const hasType = /type:\s*'[^']+'/.test(blockContent);
  const hasLabel = /label:\s*'[^']+'/.test(blockContent);
  const hasCategory = /category:\s*'[^']+'/.test(blockContent);
  const hasDefaultData = /defaultData:\s*\{/.test(blockContent);
  const hasPropertySchema = /propertySchema:\s*\[/.test(blockContent);
  
  schemaAnalysis.structure[block] = {
    type: hasType,
    label: hasLabel,
    category: hasCategory,
    defaultData: hasDefaultData,
    propertySchema: hasPropertySchema,
    complete: hasType && hasLabel && hasCategory && hasDefaultData && hasPropertySchema,
  };
  
  if (!schemaAnalysis.structure[block].complete) {
    schemaAnalysis.incomplete.push(block);
  }
  
  // Contar campos no propertySchema
  const propertyMatches = blockContent.match(/{\s*key:/g) || [];
  schemaAnalysis.structure[block].fieldCount = propertyMatches.length;
});

console.log('✅ Schemas Presentes:', schemaAnalysis.present.length);
console.log('❌ Schemas Faltando:', schemaAnalysis.missing.length);
if (schemaAnalysis.missing.length > 0) {
  schemaAnalysis.missing.forEach(b => console.log(`   ❌ ${b}`));
}

console.log('\n📊 Estrutura dos Schemas:');
Object.entries(schemaAnalysis.structure).forEach(([block, structure]) => {
  const status = structure.complete ? '✅' : '⚠️';
  console.log(`   ${status} ${block}: ${structure.fieldCount} campos`);
  if (!structure.complete) {
    const missing = [];
    if (!structure.type) missing.push('type');
    if (!structure.label) missing.push('label');
    if (!structure.category) missing.push('category');
    if (!structure.defaultData) missing.push('defaultData');
    if (!structure.propertySchema) missing.push('propertySchema');
    console.log(`      Faltando: ${missing.join(', ')}`);
  }
});

// ============================================================
// 4. DIAGNÓSTICO: REGISTRO
// ============================================================

console.log('\n\n🎨 4. ANÁLISE DE REGISTRO (EnhancedBlockRegistry)\n');

const registryAnalysis = {
  inRegistry: [],
  missing: [],
  inAvailable: [],
  notAvailable: [],
  registryType: {},
};

ATOMIC_BLOCKS.forEach(block => {
  // Verificar em ENHANCED_BLOCK_REGISTRY
  const directPattern = new RegExp(`'${block}':\\s*[A-Z]`, 'g');
  const lazyPattern = new RegExp(`'${block}':\\s*lazy\\(`, 'g');
  const inRegistry = directPattern.test(registryContent) || lazyPattern.test(registryContent);
  
  if (inRegistry) {
    registryAnalysis.inRegistry.push(block);
    registryAnalysis.registryType[block] = lazyPattern.test(registryContent) ? 'lazy' : 'direct';
  } else {
    registryAnalysis.missing.push(block);
  }
  
  // Verificar em AVAILABLE_COMPONENTS
  const availablePattern = new RegExp(`type:\\s*'${block}'`, 'g');
  const inAvailable = availablePattern.test(registryContent);
  
  if (inAvailable) {
    registryAnalysis.inAvailable.push(block);
  } else {
    registryAnalysis.notAvailable.push(block);
  }
});

console.log('✅ Registrados em ENHANCED_BLOCK_REGISTRY:', registryAnalysis.inRegistry.length);
registryAnalysis.inRegistry.forEach(b => {
  console.log(`   ✅ ${b} (${registryAnalysis.registryType[b]})`);
});

console.log('\n❌ Não Registrados:', registryAnalysis.missing.length);
if (registryAnalysis.missing.length > 0) {
  registryAnalysis.missing.forEach(b => console.log(`   ❌ ${b}`));
}

console.log('\n✅ Disponíveis em AVAILABLE_COMPONENTS:', registryAnalysis.inAvailable.length);
console.log('❌ Não Disponíveis:', registryAnalysis.notAvailable.length);
if (registryAnalysis.notAvailable.length > 0) {
  registryAnalysis.notAvailable.forEach(b => console.log(`   ❌ ${b}`));
}

// ============================================================
// 5. DIAGNÓSTICO: RENDERIZAÇÃO
// ============================================================

console.log('\n\n🖼️ 5. ANÁLISE DE RENDERIZAÇÃO\n');

const renderAnalysis = {
  components: [],
  missingComponents: [],
  contentVsProperties: {},
};

ATOMIC_BLOCKS.forEach(block => {
  const pascalName = block.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join('');
  const fileName = `${pascalName}Block.tsx`;
  const filePath = join(FILES_TO_CHECK.atomicDir, fileName);
  
  const content = readFile(filePath);
  
  if (!content) {
    renderAnalysis.missingComponents.push(block);
    return;
  }
  
  renderAnalysis.components.push(block);
  
  // Analisar se lê de content ou properties
  const readsContent = /block\.content/.test(content);
  const readsProperties = /block\.properties/.test(content);
  
  // Contar quantas vezes cada um é acessado
  const contentMatches = (content.match(/block\.content\??\./g) || []).length;
  const propertiesMatches = (content.match(/block\.properties\??\./g) || []).length;
  
  renderAnalysis.contentVsProperties[block] = {
    readsContent,
    readsProperties,
    contentCount: contentMatches,
    propertiesCount: propertiesMatches,
    pattern: readsContent && readsProperties ? 'both' : readsContent ? 'content' : readsProperties ? 'properties' : 'none',
  };
});

console.log('✅ Componentes Encontrados:', renderAnalysis.components.length);
console.log('❌ Componentes Faltando:', renderAnalysis.missingComponents.length);
if (renderAnalysis.missingComponents.length > 0) {
  renderAnalysis.missingComponents.forEach(b => console.log(`   ❌ ${b}`));
}

console.log('\n📊 Padrão de Leitura (content vs properties):');
const patterns = { content: 0, properties: 0, both: 0, none: 0 };
Object.entries(renderAnalysis.contentVsProperties).forEach(([block, data]) => {
  patterns[data.pattern]++;
  const icon = data.pattern === 'both' ? '⚠️' : data.pattern === 'content' ? '✅' : data.pattern === 'properties' ? '🔧' : '❌';
  console.log(`   ${icon} ${block}: ${data.pattern} (content: ${data.contentCount}, properties: ${data.propertiesCount})`);
});

console.log('\n📊 Resumo de Padrões:');
console.log(`   ✅ Apenas content: ${patterns.content}`);
console.log(`   🔧 Apenas properties: ${patterns.properties}`);
console.log(`   ⚠️  Ambos (DUPLICAÇÃO): ${patterns.both}`);
console.log(`   ❌ Nenhum: ${patterns.none}`);

// ============================================================
// 6. DIAGNÓSTICO: VIRTUALIZAÇÃO
// ============================================================

console.log('\n\n🔄 6. ANÁLISE DE VIRTUALIZAÇÃO\n');

// Procurar por uso de virtualização
const allFiles = getAllFiles('src');
const virtualizationFiles = allFiles.filter(file => {
  const content = readFile(file);
  return content && (
    content.includes('@tanstack/react-virtual') ||
    content.includes('react-window') ||
    content.includes('react-virtualized') ||
    content.includes('useVirtualizer')
  );
});

console.log('📊 Arquivos com Virtualização:', virtualizationFiles.length);
if (virtualizationFiles.length > 0) {
  virtualizationFiles.forEach(file => console.log(`   📄 ${file}`));
} else {
  console.log('   ℹ️  Nenhum arquivo usando virtualização detectado');
}

// Verificar se ModularTransitionStep e ModularResultStep existem
const transitionStepContent = readFile('src/components/editor/modules/ModularTransitionStep.tsx');
const resultStepContent = readFile('src/components/editor/modules/ModularResultStep.tsx');

console.log('\n📊 Componentes Modulares:');
console.log(`   ${transitionStepContent ? '✅' : '❌'} ModularTransitionStep.tsx`);
console.log(`   ${resultStepContent ? '✅' : '❌'} ModularResultStep.tsx`);

// ============================================================
// 7. DIAGNÓSTICO: ESTRUTURA JSON
// ============================================================

console.log('\n\n📄 7. ANÁLISE DA ESTRUTURA JSON\n');

const jsonAnalysis = {
  blockInterface: null,
  hasContent: false,
  hasProperties: false,
  hasData: false,
};

const editorTypesContent = readFile(FILES_TO_CHECK.editorTypes);

// Verificar interface Block
const blockInterfaceMatch = editorTypesContent.match(/export interface Block[^{]*\{([^}]+)\}/s);
if (blockInterfaceMatch) {
  jsonAnalysis.blockInterface = blockInterfaceMatch[0];
  jsonAnalysis.hasContent = /content:/i.test(blockInterfaceMatch[0]);
  jsonAnalysis.hasProperties = /properties\??:/i.test(blockInterfaceMatch[0]);
  jsonAnalysis.hasData = /data\??:/i.test(blockInterfaceMatch[0]);
}

console.log('📊 Interface Block:');
console.log(`   ${jsonAnalysis.hasContent ? '✅' : '❌'} Tem campo 'content'`);
console.log(`   ${jsonAnalysis.hasProperties ? '✅' : '❌'} Tem campo 'properties'`);
console.log(`   ${jsonAnalysis.hasData ? '✅' : '❌'} Tem campo 'data'`);

if (jsonAnalysis.hasContent && jsonAnalysis.hasProperties) {
  console.log('\n   ⚠️  ATENÇÃO: Interface tem AMBOS content E properties!');
  console.log('   ⚠️  Isso pode causar duplicação de dados.');
}

// ============================================================
// 8. DIAGNÓSTICO: MODULARIDADE
// ============================================================

console.log('\n\n🧩 8. ANÁLISE DE MODULARIDADE\n');

const modularityAnalysis = {
  atomic: 0,
  modular: 0,
  legacy: 0,
  dependencies: {},
};

ATOMIC_BLOCKS.forEach(block => {
  const pascalName = block.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join('');
  const fileName = `${pascalName}Block.tsx`;
  const filePath = join(FILES_TO_CHECK.atomicDir, fileName);
  
  const content = readFile(filePath);
  
  if (!content) return;
  
  // Verificar se é atômico (usa AtomicBlockProps)
  if (content.includes('AtomicBlockProps')) {
    modularityAnalysis.atomic++;
  }
  
  // Contar dependências
  const imports = content.match(/^import\s+.+from\s+['"']([^'"']+)['"];?$/gm) || [];
  modularityAnalysis.dependencies[block] = imports.length;
  
  // Verificar se tem lógica complexa (não é apenas apresentação)
  const hasState = /useState|useReducer/.test(content);
  const hasEffect = /useEffect/.test(content);
  const hasCallback = /useCallback|useMemo/.test(content);
  const hasComplexLogic = hasState || hasEffect || hasCallback;
  
  if (hasComplexLogic) {
    modularityAnalysis.legacy++;
  } else {
    modularityAnalysis.modular++;
  }
});

console.log('📊 Modularidade dos Componentes:');
console.log(`   ✅ Atômicos (usa AtomicBlockProps): ${modularityAnalysis.atomic}`);
console.log(`   ✅ Modulares (apenas apresentação): ${modularityAnalysis.modular}`);
console.log(`   ⚠️  Com lógica interna (hooks): ${modularityAnalysis.legacy}`);

console.log('\n📊 Dependências (imports por componente):');
const avgDeps = Object.values(modularityAnalysis.dependencies).reduce((a, b) => a + b, 0) / Object.keys(modularityAnalysis.dependencies).length;
console.log(`   Média: ${avgDeps.toFixed(1)} imports por componente`);

Object.entries(modularityAnalysis.dependencies).sort((a, b) => b[1] - a[1]).slice(0, 5).forEach(([block, count]) => {
  console.log(`   ${count > avgDeps ? '⚠️' : '✅'} ${block}: ${count} imports`);
});

// ============================================================
// RESUMO FINAL
// ============================================================

console.log('\n\n' + '═'.repeat(80));
console.log('📊 RESUMO FINAL DO RAIO-X');
console.log('═'.repeat(80));

const totalIssues = 
  importAnalysis.duplicated.length +
  importAnalysis.missing.length +
  duplicatedTypes.length +
  schemaAnalysis.missing.length +
  schemaAnalysis.incomplete.length +
  registryAnalysis.missing.length +
  registryAnalysis.notAvailable.length +
  renderAnalysis.missingComponents.length +
  patterns.both +
  (jsonAnalysis.hasContent && jsonAnalysis.hasProperties ? 1 : 0);

console.log('\n🎯 PROBLEMAS ENCONTRADOS:', totalIssues);

if (importAnalysis.duplicated.length > 0) {
  console.log(`   ❌ ${importAnalysis.duplicated.length} imports duplicados`);
}
if (importAnalysis.missing.length > 0) {
  console.log(`   ❌ ${importAnalysis.missing.length} imports faltando`);
}
if (duplicatedTypes.length > 0) {
  console.log(`   ❌ ${duplicatedTypes.length} tipos de blocos duplicados no registry`);
}
if (schemaAnalysis.missing.length > 0) {
  console.log(`   ❌ ${schemaAnalysis.missing.length} schemas faltando`);
}
if (schemaAnalysis.incomplete.length > 0) {
  console.log(`   ⚠️  ${schemaAnalysis.incomplete.length} schemas incompletos`);
}
if (registryAnalysis.missing.length > 0) {
  console.log(`   ❌ ${registryAnalysis.missing.length} componentes não registrados`);
}
if (registryAnalysis.notAvailable.length > 0) {
  console.log(`   ❌ ${registryAnalysis.notAvailable.length} blocos não disponíveis no editor`);
}
if (renderAnalysis.missingComponents.length > 0) {
  console.log(`   ❌ ${renderAnalysis.missingComponents.length} componentes faltando`);
}
if (patterns.both > 0) {
  console.log(`   ⚠️  ${patterns.both} componentes leem de content E properties (duplicação)`);
}
if (jsonAnalysis.hasContent && jsonAnalysis.hasProperties) {
  console.log(`   ⚠️  1 problema estrutural: Interface Block tem content E properties`);
}

console.log('\n✅ PONTOS FORTES:');
console.log(`   ✅ ${schemaAnalysis.present.length}/12 schemas presentes`);
console.log(`   ✅ ${registryAnalysis.inRegistry.length}/12 componentes registrados`);
console.log(`   ✅ ${registryAnalysis.inAvailable.length}/12 blocos disponíveis`);
console.log(`   ✅ ${renderAnalysis.components.length}/12 componentes implementados`);
console.log(`   ✅ ${modularityAnalysis.atomic}/12 componentes atômicos`);

console.log('\n🎯 PRIORIDADES DE CORREÇÃO:');

const priorities = [];

if (patterns.both > 0) {
  priorities.push({
    priority: 'ALTA',
    issue: `${patterns.both} componentes com duplicação content/properties`,
    action: 'Unificar leitura apenas em block.content',
  });
}

if (registryAnalysis.missing.length > 0) {
  priorities.push({
    priority: 'CRÍTICA',
    issue: `${registryAnalysis.missing.length} componentes não registrados`,
    action: 'Adicionar ao ENHANCED_BLOCK_REGISTRY',
  });
}

if (registryAnalysis.notAvailable.length > 0) {
  priorities.push({
    priority: 'ALTA',
    issue: `${registryAnalysis.notAvailable.length} blocos não disponíveis`,
    action: 'Adicionar ao AVAILABLE_COMPONENTS',
  });
}

if (schemaAnalysis.incomplete.length > 0) {
  priorities.push({
    priority: 'MÉDIA',
    issue: `${schemaAnalysis.incomplete.length} schemas incompletos`,
    action: 'Completar campos faltando (defaultData, propertySchema)',
  });
}

if (importAnalysis.duplicated.length > 0) {
  priorities.push({
    priority: 'BAIXA',
    issue: `${importAnalysis.duplicated.length} imports duplicados`,
    action: 'Remover imports repetidos',
  });
}

priorities.sort((a, b) => {
  const order = { CRÍTICA: 0, ALTA: 1, MÉDIA: 2, BAIXA: 3 };
  return order[a.priority] - order[b.priority];
});

priorities.forEach((p, i) => {
  console.log(`\n${i + 1}. [${p.priority}] ${p.issue}`);
  console.log(`   → ${p.action}`);
});

if (totalIssues === 0) {
  console.log('\n🎉 PARABÉNS! Sistema 100% íntegro!');
} else {
  console.log(`\n\n⚠️  Total de ${totalIssues} problemas encontrados`);
  console.log('📝 Execute as correções sugeridas acima');
}

console.log('\n' + '═'.repeat(80));

process.exit(totalIssues > 0 ? 1 : 0);
