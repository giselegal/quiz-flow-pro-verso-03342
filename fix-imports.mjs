import fs from 'fs';
import path from 'path';

// Função para encontrar e corrigir importações problemáticas
function fixImports(dir) {
  const files = fs.readdirSync(dir);
  
  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    
    if (stat.isDirectory()) {
      fixImports(filePath); // Recursão para subdiretórios
    } else if (file.endsWith('.ts') || file.endsWith('.tsx')) {
      let content = fs.readFileSync(filePath, 'utf8');
      let modified = false;
      
      // Corrigir importações de types/blocks
      const oldPatterns = [
        /from ['"]\.\.\/\.\.\/\.\.\/types\/blocks['"];?/g,
        /from ['"]\.\.\/\.\.\/\.\.\/\.\.\/types\/blocks['"];?/g,
        /from ['"]\.\.\/\.\.\/\.\.\/\.\.\/\.\.\/types\/blocks['"];?/g,
        /from ['"]\.\.\/\.\.\/\.\.\/\.\.\/\.\.\/\.\.\/types\/blocks['"];?/g
      ];
      
      oldPatterns.forEach(pattern => {
        if (pattern.test(content)) {
          content = content.replace(pattern, "from '@/types/blocks';");
          modified = true;
        }
      });
      
      // Corrigir importações de hooks/use-toast
      const hookPatterns = [
        /from ['"]\.\.\/\.\.\/\.\.\/hooks\/use-toast['"];?/g,
        /from ['"]\.\.\/\.\.\/\.\.\/\.\.\/hooks\/use-toast['"];?/g,
        /from ['"]\.\.\/\.\.\/\.\.\/\.\.\/\.\.\/hooks\/use-toast['"];?/g,
        /from ['"]\.\.\/\.\.\/\.\.\/\.\.\/\.\.\/\.\.\/hooks\/use-toast['"];?/g
      ];
      
      hookPatterns.forEach(pattern => {
        if (pattern.test(content)) {
          content = content.replace(pattern, "from '@/hooks/use-toast';");
          modified = true;
        }
      });
      
      // Corrigir importações de lib/utils
      const utilsPatterns = [
        /from ['"]\.\.\/\.\.\/\.\.\/\.\.\/\.\.\/lib\/utils['"];?/g,
        /from ['"]\.\.\/\.\.\/\.\.\/\.\.\/\.\.\/\.\.\/lib\/utils['"];?/g,
        /from ['"]\.\.\/\.\.\/\.\.\/\.\.\/\.\.\/\.\.\/\.\.\/lib\/utils['"];?/g
      ];
      
      utilsPatterns.forEach(pattern => {
        if (pattern.test(content)) {
          content = content.replace(pattern, "from '@/lib/utils';");
          modified = true;
        }
      });
      
      if (modified) {
        fs.writeFileSync(filePath, content);
        console.log(`✅ Corrigido: ${filePath}`);
      }
    }
  });
}

console.log('🔧 Iniciando correção automática de importações...');
fixImports('./src');
console.log('✅ Correção de importações concluída!');
