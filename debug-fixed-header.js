// 🔍 DEBUG ESPECÍFICO - CABEÇALHO FIXO
// Cole no console para investigar o cabeçalho que está atrapalhando

console.clear();
console.log('🔍 INVESTIGANDO CABEÇALHO FIXO\n');

// 1. Procurar elementos com position fixed
const fixedElements = Array.from(document.querySelectorAll('*')).filter(el => {
  const style = window.getComputedStyle(el);
  return style.position === 'fixed';
});

console.log('📌 Elementos FIXED encontrados:', fixedElements.length);
fixedElements.forEach((el, i) => {
  const style = window.getComputedStyle(el);
  console.log(`  ${i + 1}. ${el.tagName} - z-index: ${style.zIndex} - top: ${style.top}`);
  console.log(`     classes: ${el.className.substring(0, 80)}`);
  console.log(`     texto: ${el.textContent.substring(0, 50)}...`);
});

// 2. Procurar elementos com position sticky
const stickyElements = Array.from(document.querySelectorAll('*')).filter(el => {
  const style = window.getComputedStyle(el);
  return style.position === 'sticky';
});

console.log('\n📍 Elementos STICKY encontrados:', stickyElements.length);
stickyElements.forEach((el, i) => {
  const style = window.getComputedStyle(el);
  console.log(`  ${i + 1}. ${el.tagName} - z-index: ${style.zIndex} - top: ${style.top}`);
  console.log(`     classes: ${el.className.substring(0, 80)}`);
});

// 3. Procurar elementos com z-index alto
const highZElements = Array.from(document.querySelectorAll('*')).filter(el => {
  const style = window.getComputedStyle(el);
  const zIndex = parseInt(style.zIndex);
  return zIndex > 50;
});

console.log('\n🏔️ Elementos com Z-INDEX ALTO (>50):', highZElements.length);
highZElements.forEach((el, i) => {
  const style = window.getComputedStyle(el);
  console.log(`  ${i + 1}. ${el.tagName} - z-index: ${style.zIndex}`);
  console.log(`     classes: ${el.className.substring(0, 80)}`);
});

// 4. Procurar especificamente por headers/cabeçalhos
const headerElements = document.querySelectorAll(
  'header, [class*="header"], [class*="Header"], [class*="nav"], [class*="Nav"]'
);
console.log('\n🧭 Elementos de HEADER/NAV encontrados:', headerElements.length);
headerElements.forEach((el, i) => {
  const style = window.getComputedStyle(el);
  console.log(`  ${i + 1}. ${el.tagName} - position: ${style.position} - z-index: ${style.zIndex}`);
  console.log(`     classes: ${el.className.substring(0, 80)}`);
});

// 5. Verificar área do canvas especificamente
const canvasArea = document.querySelector(
  '[data-testid="canvas-dropzone"], .canvas, [class*="canvas"]'
);
if (canvasArea) {
  const rect = canvasArea.getBoundingClientRect();
  console.log('\n🎯 ÁREA DO CANVAS:');
  console.log(`   top: ${rect.top}, left: ${rect.left}`);
  console.log(`   width: ${rect.width}, height: ${rect.height}`);

  // Verificar se há elementos sobrepondo o canvas
  const centerX = rect.left + rect.width / 2;
  const centerY = rect.top + rect.height / 2;
  const elementAtCenter = document.elementFromPoint(centerX, centerY);

  console.log('\n🎯 ELEMENTO NO CENTRO DO CANVAS:');
  console.log(`   ${elementAtCenter.tagName} - classes: ${elementAtCenter.className}`);
  console.log(`   É o próprio canvas? ${elementAtCenter === canvasArea}`);
} else {
  console.log('\n❌ Canvas não encontrado');
}

console.log('\n🎯 ANÁLISE COMPLETA! Procure por elementos que podem estar bloqueando.');
