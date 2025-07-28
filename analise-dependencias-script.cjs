#!/usr/bin/env node
// Script para análise de dependências não utilizadas
// Execute com: node analise-dependencias-script.cjs

const fs = require('fs');
const path = require('path');

const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
const dependencies = { ...packageJson.dependencies, ...packageJson.devDependencies };

// Lista de dependências para verificar
const dependenciesToCheck = [
  'react-router-dom',
  'react-dnd',
  '@dnd-kit/core',
  '@hello-pangea/dnd',
  'quill',
  'react-quill',
  '@react-spring/web',
  'react-spring',
  'framer-motion',
  'antd',
  'wouter',
  '@supabase/supabase-js',
  'drizzle-orm',
  '@tanstack/react-query'
];

console.log('🔍 ANÁLISE DE USO DE DEPENDÊNCIAS\\n');

function searchInFiles(dependency, extensions = ['.ts', '.tsx', '.js', '.jsx']) {
  const results = [];
  
  function searchDir(dir) {
    const files = fs.readdirSync(dir);
    
    for (const file of files) {
      const filePath = path.join(dir, file);
      const stat = fs.statSync(filePath);
      
      if (stat.isDirectory() && !file.startsWith('.') && file !== 'node_modules' && file !== 'dist') {
        searchDir(filePath);
      } else if (extensions.some(ext => file.endsWith(ext))) {
        try {
          const content = fs.readFileSync(filePath, 'utf8');
          
          // Padrões de busca para imports
          const patterns = [
            new RegExp(`import.*from\\s+['"\`]${dependency}['"\`]`, 'g'),
            new RegExp(`import\\s+.*\\s+from\\s+['"\`]${dependency}['"\`]`, 'g'),
            new RegExp(`require\\(['"\`]${dependency}['"\`]\\)`, 'g'),
            new RegExp(`import\\(['"\`]${dependency}['"\`]\\)`, 'g')
          ];
          
          const matches = patterns.some(pattern => pattern.test(content));
          
          if (matches) {
            results.push(filePath);
          }
        } catch (err) {
          // Ignorar erros de leitura
        }
      }
    }
  }
  
  searchDir('./src');
  return results;
}

const report = {
  used: [],
  unused: [],
  conflicts: []
};

// Verificar cada dependência
dependenciesToCheck.forEach(dep => {
  if (dependencies[dep]) {
    const usage = searchInFiles(dep);
    
    if (usage.length > 0) {
      report.used.push({
        name: dep,
        version: dependencies[dep],
        files: usage.length,
        examples: usage.slice(0, 3)
      });
    } else {
      report.unused.push({
        name: dep,
        version: dependencies[dep]
      });
    }
  }
});

// Verificar conflitos DnD
const dndLibs = ['react-dnd', '@dnd-kit/core', '@hello-pangea/dnd'];
const usedDndLibs = dndLibs.filter(lib => 
  dependencies[lib] && searchInFiles(lib).length > 0
);

if (usedDndLibs.length > 1) {
  report.conflicts.push({
    type: 'Drag & Drop Libraries',
    libraries: usedDndLibs,
    recommendation: 'Consolidar em uma única biblioteca (@dnd-kit recomendado)'
  });
}

// Verificar conflitos de routing
const routingLibs = ['react-router-dom', 'wouter'];
const usedRoutingLibs = routingLibs.filter(lib => 
  dependencies[lib] && searchInFiles(lib).length > 0
);

if (usedRoutingLibs.length > 1) {
  report.conflicts.push({
    type: 'Routing Libraries',
    libraries: usedRoutingLibs,
    recommendation: 'Escolher uma única biblioteca (wouter é mais leve)'
  });
}

// Gerar relatório
console.log('✅ DEPENDÊNCIAS UTILIZADAS:');
report.used.forEach(dep => {
  console.log(`  📦 ${dep.name}@${dep.version}`);
  console.log(`     Usado em ${dep.files} arquivo(s)`);
  console.log(`     Exemplos: ${dep.examples.slice(0, 2).join(', ')}`);
  console.log('');
});

console.log('❌ DEPENDÊNCIAS NÃO UTILIZADAS:');
report.unused.forEach(dep => {
  console.log(`  🗑️  ${dep.name}@${dep.version} - PODE SER REMOVIDA`);
});

console.log('\\n⚠️  CONFLITOS DETECTADOS:');
report.conflicts.forEach(conflict => {
  console.log(`  🔥 ${conflict.type}:`);
  console.log(`     Bibliotecas: ${conflict.libraries.join(', ')}`);
  console.log(`     Recomendação: ${conflict.recommendation}`);
  console.log('');
});

// Salvar relatório em arquivo
const reportData = {
  timestamp: new Date().toISOString(),
  summary: {
    totalDependencies: Object.keys(dependencies).length,
    checkedDependencies: dependenciesToCheck.length,
    usedDependencies: report.used.length,
    unusedDependencies: report.unused.length,
    conflicts: report.conflicts.length
  },
  details: report
};

fs.writeFileSync('dependency-analysis-report.json', JSON.stringify(reportData, null, 2));
console.log('\\n📊 Relatório detalhado salvo em: dependency-analysis-report.json');

// Comandos para limpeza
if (report.unused.length > 0) {
  console.log('\\n🧹 COMANDOS PARA LIMPEZA:');
  const uninstallCmd = `npm uninstall ${report.unused.map(d => d.name).join(' ')}`;
  console.log(uninstallCmd);
}

console.log('\\n✨ Análise concluída!');
