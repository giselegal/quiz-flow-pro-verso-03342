// TESTE ESPECÍFICO: Verificar alinhamento de camadas modo edição vs produção
// Execute no console do browser em http://localhost:8082/editor-unified

console.log('🔍 ANÁLISE CAMADAS CANVAS & CONTAINERS');
console.log('=====================================');

// 1. Identificar modo atual
const isPreviewMode =
  document.body.className.includes('preview') || document.querySelector('.is-previewing') !== null;

console.log('🎭 MODO ATUAL:', isPreviewMode ? 'PREVIEW/PRODUÇÃO' : 'EDIÇÃO');

// 2. Verificar hierarquia de containers
console.log('\n📦 HIERARQUIA DE CONTAINERS:');

const containers = [
  { name: 'DndContext', selector: '[data-dnd-kit-dnd-context]' },
  { name: 'SortableContext-Principal', selector: '[data-dnd-kit-sortable-context]' },
  { name: 'Canvas-Main', selector: '.unified-editor-canvas, main' },
  { name: 'Preview-Container', selector: '.preview-container' },
  { name: 'Blocks-Container', selector: '.blocks-container' },
  {
    name: 'SortableContext-Interno',
    selector: '.blocks-container [data-dnd-kit-sortable-context]',
  },
];

containers.forEach(container => {
  const elements = document.querySelectorAll(container.selector);
  console.log(`${container.name}: ${elements.length} encontrado(s)`);

  if (elements.length > 1) {
    console.log(`  ⚠️ DUPLICAÇÃO DETECTADA: ${elements.length} ${container.name}`);
  }
});

// 3. Verificar droppables
console.log('\n🎯 DROPPABLES:');
const droppables = document.querySelectorAll('[data-dnd-kit-droppable-id]');
console.log(`Total de droppables: ${droppables.length}`);

droppables.forEach((el, i) => {
  const id = el.getAttribute('data-dnd-kit-droppable-id');
  const rect = el.getBoundingClientRect();
  console.log(`  [${i}] ID: ${id}, Size: ${Math.round(rect.width)}x${Math.round(rect.height)}`);
});

// 4. Verificar sortables
console.log('\n🔄 SORTABLES:');
const sortables = document.querySelectorAll('[data-dnd-kit-sortable-id]');
console.log(`Total de sortables: ${sortables.length}`);

// 5. Verificar estilos conflitantes
console.log('\n🎨 ESTILOS DE BACKGROUND:');

const mainCanvas = document.querySelector('.unified-editor-canvas, main');
const previewContainer = document.querySelector('.preview-container');

if (mainCanvas) {
  const mainStyle = getComputedStyle(mainCanvas);
  console.log('Main Canvas Background:', mainStyle.background.substring(0, 100) + '...');
}

if (previewContainer) {
  const previewStyle = getComputedStyle(previewContainer);
  console.log('Preview Container Background:', previewStyle.background);
  console.log('Preview Container Min-Height:', previewStyle.minHeight);
}

// 6. Verificar modo específico
console.log('\n🎭 ANÁLISE POR MODO:');

const previewHeader = document.querySelector('.preview-header');
const debugPanel = document.querySelector('.preview-debug-panel, [class*="debug"]');
const outlines = document.querySelectorAll('[style*="outline"], .show-outlines');

console.log(
  'Preview Header (deve aparecer só em edição):',
  previewHeader ? '✅ VISÍVEL' : '❌ OCULTO'
);
console.log('Debug Panel (deve aparecer só em dev):', debugPanel ? '✅ VISÍVEL' : '❌ OCULTO');
console.log('Outlines visíveis:', outlines.length);

// 7. Verificar Z-INDEX e sobreposições
console.log('\n📚 Z-INDEX E SOBREPOSIÇÕES:');

const layeredElements = [
  '.unified-editor-canvas',
  '.preview-container',
  '.blocks-container',
  '[data-dnd-kit-droppable-id]',
  '.absolute',
];

layeredElements.forEach(selector => {
  const el = document.querySelector(selector);
  if (el) {
    const style = getComputedStyle(el);
    console.log(`${selector}: z-index: ${style.zIndex}, position: ${style.position}`);
  }
});

// 8. DIAGNÓSTICO FINAL
console.log('\n🎯 DIAGNÓSTICO FINAL:');

const hasMultipleSortableContext =
  document.querySelectorAll('[data-dnd-kit-sortable-context]').length > 1;
const hasCorrectDroppable =
  document.querySelector('[data-dnd-kit-droppable-id="canvas-dropzone"]') !== null;
const hasBackgroundConflict =
  mainCanvas &&
  previewContainer &&
  getComputedStyle(mainCanvas).background !== 'none' &&
  getComputedStyle(previewContainer).background !== 'none';

if (hasMultipleSortableContext) {
  console.log('❌ PROBLEMA: SortableContext duplicado detectado');
}

if (!hasCorrectDroppable) {
  console.log('❌ PROBLEMA: Canvas droppable não encontrado');
}

if (hasBackgroundConflict) {
  console.log('⚠️ AVISO: Possível conflito de background');
}

if (!hasMultipleSortableContext && hasCorrectDroppable && !hasBackgroundConflict) {
  console.log('✅ ESTRUTURA PARECE CORRETA');
} else {
  console.log('🔧 CORREÇÕES NECESSÁRIAS IDENTIFICADAS');
}

console.log('\n💡 TESTE MANUAL SUGERIDO:');
console.log('1. Alterne entre modo Edição e Preview');
console.log('2. Verifique se o header desaparece em Preview');
console.log('3. Teste drag & drop em ambos os modos');
console.log('4. Observe mudanças visuais nos containers');
