/**
 * 🎨 Criador de Imagens Placeholder para Estilos
 * 
 * Gera imagens SVG temporárias até as imagens reais serem adicionadas
 */

import fs from 'fs';
import path from 'path';

const estilos = [
    { key: 'classico', name: 'Clássico', cor: '#2C3E50', icon: '👔' },
    { key: 'natural', name: 'Natural', cor: '#27AE60', icon: '🌿' },
    { key: 'contemporaneo', name: 'Contemporâneo', cor: '#3498DB', icon: '🏙️' },
    { key: 'elegante', name: 'Elegante', cor: '#8E44AD', icon: '✨' },
    { key: 'romantico', name: 'Romântico', cor: '#E74C3C', icon: '🌹' },
    { key: 'sexy', name: 'Sexy', cor: '#C0392B', icon: '💋' },
    { key: 'dramatico', name: 'Dramático', cor: '#2C3E50', icon: '🎭' },
    { key: 'criativo', name: 'Criativo', cor: '#F39C12', icon: '🎨' }
];

const criarSVG = (estilo, tipo) => {
    const width = tipo === 'personal' ? 400 : 600;
    const height = tipo === 'personal' ? 300 : 400;
    const titulo = tipo === 'personal' ? estilo.name : `Guia ${estilo.name}`;

    return `<?xml version="1.0" encoding="UTF-8"?>
<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="gradient${estilo.key}" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:${estilo.cor};stop-opacity:1" />
      <stop offset="100%" style="stop-color:${estilo.cor}88;stop-opacity:1" />
    </linearGradient>
  </defs>
  
  <rect width="100%" height="100%" fill="url(#gradient${estilo.key})"/>
  
  <!-- Padrão decorativo -->
  <circle cx="50" cy="50" r="30" fill="white" opacity="0.1"/>
  <circle cx="${width - 50}" cy="${height - 50}" r="25" fill="white" opacity="0.1"/>
  <circle cx="${width / 2}" cy="${height / 2 - 50}" r="20" fill="white" opacity="0.1"/>
  
  <!-- Ícone central -->
  <text 
    x="50%" 
    y="40%" 
    font-size="${Math.min(width, height) / 8}"
    fill="white" 
    text-anchor="middle" 
    dominant-baseline="middle"
  >${estilo.icon}</text>
  
  <!-- Título -->
  <text 
    x="50%" 
    y="60%" 
    font-family="system-ui, -apple-system, sans-serif" 
    font-size="${Math.min(width, height) / 15}"
    font-weight="600"
    fill="white" 
    text-anchor="middle" 
    dominant-baseline="middle"
  >${titulo}</text>
  
  <!-- Subtítulo -->
  <text 
    x="50%" 
    y="75%" 
    font-family="system-ui, -apple-system, sans-serif" 
    font-size="${Math.min(width, height) / 25}"
    fill="white" 
    opacity="0.8"
    text-anchor="middle" 
    dominant-baseline="middle"
  >${tipo === 'personal' ? 'Estilo Pessoal' : 'Guia de Estilo'}</text>
  
  <!-- Moldura -->
  <rect x="2" y="2" width="${width - 4}" height="${height - 4}" fill="none" stroke="white" stroke-width="2" opacity="0.3"/>
</svg>`;
};

const publicDir = '/workspaces/quiz-quest-challenge-verse/public/estilos';

console.log('🎨 Criando imagens placeholder para os estilos...\n');

estilos.forEach(estilo => {
    // Imagem personal
    const personalSVG = criarSVG(estilo, 'personal');
    const personalPath = path.join(publicDir, `${estilo.key}-personal.jpg`);

    // Imagem guide  
    const guideSVG = criarSVG(estilo, 'guide');
    const guidePath = path.join(publicDir, `${estilo.key}-guide.jpg`);

    // Salvar como SVG temporariamente (depois renomear para .jpg)
    fs.writeFileSync(personalPath.replace('.jpg', '.svg'), personalSVG);
    fs.writeFileSync(guidePath.replace('.jpg', '.svg'), guideSVG);

    console.log(`✅ Criado: ${estilo.name}`);
    console.log(`   📸 ${estilo.key}-personal.svg`);
    console.log(`   📖 ${estilo.key}-guide.svg`);
});

console.log(`\n🎯 Total: ${estilos.length * 2} imagens placeholder criadas!`);
console.log(`📁 Localização: ${publicDir}`);
console.log(`\n💡 PRÓXIMO PASSO:`);
console.log(`   Converter SVGs para JPG ou atualizar URLs para .svg nos estilos`);