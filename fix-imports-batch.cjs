#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Função para converter imports @/ para relativos
function convertImportsInFile(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    let modified = false;
    
    // Calcular o nível de profundidade do arquivo
    const relativePath = path.relative('/workspaces/quiz-quest-challenge-verse/src', path.dirname(filePath));
    const depth = relativePath === '' ? 0 : relativePath.split(path.sep).length;
    const prefix = depth === 0 ? './' : '../'.repeat(depth);
    
    // Substituir imports @/ por relativos
    const newContent = content.replace(
      /from\s+["']@\/([^"']+)["']/g, 
      (match, importPath) => {
        modified = true;
        return `from "${prefix}${importPath}"`;
      }
    );
    
    // Substituir import() dinâmicos
    const finalContent = newContent.replace(
      /import\s*\(\s*["']@\/([^"']+)["']\s*\)/g,
      (match, importPath) => {
        modified = true;
        return `import("${prefix}${importPath}")`;
      }
    );
    
    if (modified) {
      fs.writeFileSync(filePath, finalContent, 'utf8');
      console.log(`✅ Convertido: ${filePath}`);
      return true;
    }
    
    return false;
  } catch (error) {
    console.error(`❌ Erro ao processar ${filePath}:`, error.message);
    return false;
  }
}

// Função para encontrar todos os arquivos TypeScript/JavaScript
function findSourceFiles(dir) {
  const files = [];
  
  function scanDir(currentDir) {
    try {
      const entries = fs.readdirSync(currentDir, { withFileTypes: true });
      
      for (const entry of entries) {
        const fullPath = path.join(currentDir, entry.name);
        
        if (entry.isDirectory()) {
          // Ignorar node_modules, dist, build
          if (!['node_modules', 'dist', 'build', '.git'].includes(entry.name)) {
            scanDir(fullPath);
          }
        } else if (entry.isFile()) {
          // Incluir apenas arquivos fonte
          if (/\.(ts|tsx|js|jsx)$/.test(entry.name)) {
            files.push(fullPath);
          }
        }
      }
    } catch (error) {
      console.error(`Erro ao escanear ${currentDir}:`, error.message);
    }
  }
  
  scanDir(dir);
  return files;
}

// Executar conversão
console.log('🔄 Iniciando conversão de imports @/ para relativos...\n');

const srcDir = '/workspaces/quiz-quest-challenge-verse/src';
const sourceFiles = findSourceFiles(srcDir);

console.log(`📁 Encontrados ${sourceFiles.length} arquivos para processar\n`);

let convertedFiles = 0;
sourceFiles.forEach(file => {
  if (convertImportsInFile(file)) {
    convertedFiles++;
  }
});

console.log(`\n✨ Conversão concluída!`);
console.log(`📊 Arquivos convertidos: ${convertedFiles}/${sourceFiles.length}`);

if (convertedFiles > 0) {
  console.log('\n🎨 Executando Prettier para formatar os arquivos...');
}
