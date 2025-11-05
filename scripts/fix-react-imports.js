#!/usr/bin/env node

/**
 * Script para corrigir imports de React em todos os componentes
 * Converte React.useState → useState (com import nomeado)
 */

const fs = require('fs');
const path = require('path');

const COMPONENT_DIRS = [
  'src/components/editor/blocks',
  'src/components/editor/canvas',
  'src/components/editor',
];

function fixReactImports(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  let modified = false;

  // Se já tem import React from 'react', substituir por imports nomeados
  if (content.includes("import React from 'react'") && !content.includes("import React, {")) {
    const hooks = new Set();
    
    // Detectar hooks usados
    if (content.includes('React.useState')) hooks.add('useState');
    if (content.includes('React.useEffect')) hooks.add('useEffect');
    if (content.includes('React.useMemo')) hooks.add('useMemo');
    if (content.includes('React.useCallback')) hooks.add('useCallback');
    if (content.includes('React.useRef')) hooks.add('useRef');
    if (content.includes('React.useContext')) hooks.add('useContext');
    if (content.includes('React.FC')) hooks.add('FC');
    if (content.includes('React.memo')) hooks.add('memo');
    if (content.includes('CSSProperties') || content.includes('React.CSSProperties')) hooks.add('CSSProperties');
    if (content.includes('ReactNode') || content.includes('React.ReactNode')) hooks.add('ReactNode');

    if (hooks.size > 0) {
      const hooksArray = Array.from(hooks).sort();
      content = content.replace(
        "import React from 'react';",
        `import React, { ${hooksArray.join(', ')} } from 'react';`
      );
      
      // Substituir React.useState → useState etc
      content = content.replace(/React\.useState/g, 'useState');
      content = content.replace(/React\.useEffect/g, 'useEffect');
      content = content.replace(/React\.useMemo/g, 'useMemo');
      content = content.replace(/React\.useCallback/g, 'useCallback');
      content = content.replace(/React\.useRef/g, 'useRef');
      content = content.replace(/React\.useContext/g, 'useContext');
      content = content.replace(/React\.FC/g, 'FC');
      content = content.replace(/React\.memo/g, 'memo');
      content = content.replace(/React\.CSSProperties/g, 'CSSProperties');
      content = content.replace(/React\.ReactNode/g, 'ReactNode');
      
      modified = true;
    }
  }

  if (modified) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`✅ Fixed: ${filePath}`);
    return true;
  }
  
  return false;
}

function processDirectory(dir) {
  let count = 0;
  
  function walk(directory) {
    const files = fs.readdirSync(directory);
    
    files.forEach(file => {
      const filePath = path.join(directory, file);
      const stat = fs.statSync(filePath);
      
      if (stat.isDirectory()) {
        walk(filePath);
      } else if (file.endsWith('.tsx') || file.endsWith('.ts')) {
        if (fixReactImports(filePath)) {
          count++;
        }
      }
    });
  }
  
  walk(dir);
  return count;
}

console.log('🔧 Fixing React imports in components...\n');

let totalFixed = 0;
COMPONENT_DIRS.forEach(dir => {
  const dirPath = path.join(process.cwd(), dir);
  if (fs.existsSync(dirPath)) {
    const fixed = processDirectory(dirPath);
    totalFixed += fixed;
    console.log(`\n📁 ${dir}: ${fixed} files fixed`);
  }
});

console.log(`\n✨ Total files fixed: ${totalFixed}`);
