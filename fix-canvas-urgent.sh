#!/bin/bash

# 🚨 PATCH URGENTE: CORREÇÃO DE RENDERIZAÇÃO CANVAS
# Este script aplica correções imediatas para problemas de performance

echo "🚨 === PATCH URGENTE: RENDERIZAÇÃO CANVAS ==="
echo "🔧 Aplicando correções de performance..."

# 1. BACKUP DO ARQUIVO ATUAL
echo "📦 1. Criando backup..."
cp "src/components/editor/canvas/CanvasDropZone.simple.tsx" "src/components/editor/canvas/CanvasDropZone.simple.backup.tsx"
echo "   ✅ Backup criado"

# 2. APLICAR OTIMIZAÇÕES CSS
echo "⚡ 2. Aplicando otimizações CSS..."

cat > "src/styles/canvas-performance.css" << 'EOF'
/* 🚀 OTIMIZAÇÕES DE PERFORMANCE CANVAS */

/* GPU Acceleration para canvas */
.dnd-droppable-zone {
  transform: translateZ(0) !important;
  will-change: transform !important;
  contain: layout style paint !important;
  backface-visibility: hidden !important;
}

/* Otimizar blocos sortáveis */
.sortable-block {
  transform: translateZ(0) !important;
  will-change: transform !important;
  contain: layout style !important;
}

/* Reduzir paint e layout thrashing */
.canvas-drop-zone * {
  contain: layout !important;
}

/* Otimizações para drag overlay */
.drag-overlay {
  transform: translateZ(0) !important;
  will-change: transform, opacity !important;
  isolation: isolate !important;
}

/* Throttle de transições */
.transition-all {
  transition-duration: 0.1s !important;
}

/* Otimização para muitos elementos */
.space-y-6 > * + * {
  contain: layout !important;
}

/* Performance para mobile */
@media (max-width: 768px) {
  .dnd-droppable-zone {
    contain: layout !important;
  }
  
  .sortable-block {
    contain: layout !important;
  }
}

/* Reduced motion para performance */
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}

/* Debug styles para development */
[data-canvas-optimized="true"]::before {
  content: "🚀 OTIMIZADO";
  position: fixed;
  top: 10px;
  right: 10px;
  background: #22c55e;
  color: white;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  z-index: 9999;
  pointer-events: none;
}
EOF

echo "   ✅ CSS de performance criado"

# 3. APLICAR PATCH NO VITE CONFIG
echo "🔧 3. Otimizando configuração Vite..."

cat > "temp_vite_patch.js" << 'EOF'
// Patch para vite.config.ts
const fs = require('fs');
const path = require('path');

const viteConfigPath = path.join(process.cwd(), 'vite.config.ts');
let content = fs.readFileSync(viteConfigPath, 'utf8');

// Adicionar otimizações se não existirem
if (!content.includes('chunkSizeWarningLimit')) {
  content = content.replace(
    'export default defineConfig({',
    `export default defineConfig({
  build: {
    chunkSizeWarningLimit: 1000,
    rollupOptions: {
      output: {
        manualChunks: {
          'editor-core': ['src/legacy/editor/EditorPro.tsx'],
          'canvas-components': ['src/components/editor/canvas/CanvasDropZone.simple.tsx'],
          'dnd-kit': ['@dnd-kit/core', '@dnd-kit/sortable'],
        }
      }
    }
  },`
  );
}

fs.writeFileSync(viteConfigPath, content);
console.log('✅ Vite config otimizado');
EOF

node temp_vite_patch.js
rm temp_vite_patch.js

# 4. APLICAR PATCH NO INDEX.CSS
echo "🎨 4. Aplicando patch no CSS principal..."

if ! grep -q "canvas-performance.css" "src/index.css"; then
  echo '@import "./styles/canvas-performance.css";' >> "src/index.css"
  echo "   ✅ CSS de performance importado"
fi

# 5. APLICAR PATCH JAVASCRIPT NO CANVAS
echo "⚡ 5. Aplicando otimizações JavaScript..."

cat > "temp_canvas_patch.js" << 'EOF'
// Patch JavaScript para CanvasDropZone.simple.tsx
const fs = require('fs');
const path = require('path');

const canvasPath = path.join(process.cwd(), 'src/components/editor/canvas/CanvasDropZone.simple.tsx');
let content = fs.readFileSync(canvasPath, 'utf8');

// Adicionar otimizações se não existirem
if (!content.includes('data-canvas-optimized')) {
  // Adicionar data attribute para debugging
  content = content.replace(
    'data-id="canvas-drop-zone"',
    'data-id="canvas-drop-zone"\n      data-canvas-optimized="true"'
  );
  
  // Otimizar useMemo para aceitar tipos
  if (!content.includes('React.useMemo(() => accepts')) {
    content = content.replace(
      'const accepts = React.useMemo(() => [\'sidebar-component\', \'canvas-block\'], []);',
      'const accepts = React.useMemo<string[]>(() => [\'sidebar-component\', \'canvas-block\'], []);'
    );
  }
  
  fs.writeFileSync(canvasPath, content);
  console.log('✅ Canvas JavaScript otimizado');
}
EOF

node temp_canvas_patch.js
rm temp_canvas_patch.js

# 6. REINICIAR SERVIDOR DE DESENVOLVIMENTO
echo "🔄 6. Reiniciando servidor..."

# Parar servidor atual
pkill -f "vite.*5173" 2>/dev/null || true
pkill -f "npm.*dev" 2>/dev/null || true

sleep 2

echo "🚀 PATCH APLICADO COM SUCESSO!"
echo ""
echo "📊 MELHORIAS IMPLEMENTADAS:"
echo "   ✅ GPU acceleration para canvas"
echo "   ✅ CSS containment para blocos"
echo "   ✅ Will-change otimizado"
echo "   ✅ Reduced motion support"
echo "   ✅ Chunks otimizados no Vite"
echo "   ✅ Debug visual ativo"
echo ""
echo "🔧 PRÓXIMOS PASSOS:"
echo "   1. npm run dev (reiniciar servidor)"
echo "   2. Abrir navegador em localhost:5173"
echo "   3. Verificar indicador '🚀 OTIMIZADO' no canto superior direito"
echo "   4. Testar drag & drop no canvas"
echo ""
echo "📋 ROLLBACK (se necessário):"
echo "   cp src/components/editor/canvas/CanvasDropZone.simple.backup.tsx src/components/editor/canvas/CanvasDropZone.simple.tsx"
