const fs = require('fs');
const data = JSON.parse(fs.readFileSync('public/templates/quiz21-v4-saas.json', 'utf-8'));

console.log('🔍 Validação Final de URLs\n');

let relativeUrls = 0;
let absoluteUrls = 0;

data.steps.forEach((step) => {
  step.blocks.forEach((block) => {
    // Content fields
    ['imageUrl', 'image', 'src', 'logoUrl'].forEach(field => {
      const url = block.content?.[field];
      if (url && typeof url === 'string') {
        if (url.startsWith('http')) absoluteUrls++;
        else if (url.startsWith('/quiz-assets/')) relativeUrls++;
      }
    });

    // Properties fields
    ['imageUrl', 'image', 'src', 'logoUrl'].forEach(field => {
      const url = block.properties?.[field];
      if (url && typeof url === 'string') {
        if (url.startsWith('http')) absoluteUrls++;
        else if (url.startsWith('/quiz-assets/')) relativeUrls++;
      }
    });
    
    // Options
    if (block.content?.options) {
      block.content.options.forEach((opt) => {
        const url = opt.imageUrl;
        if (url && typeof url === 'string') {
          if (url.startsWith('http')) absoluteUrls++;
          else if (url.startsWith('/quiz-assets/')) relativeUrls++;
        }
      });
    }
  });
});

console.log('✅ URLs relativas (/quiz-assets/):', relativeUrls);
console.log('⚠️  URLs absolutas restantes:', absoluteUrls);

if (absoluteUrls === 0) {
  console.log('\n🎉 Todas as URLs foram normalizadas com sucesso!');
} else {
  console.log('\n💡 Ainda há URLs absolutas, mas isso pode ser intencional (ex: CDN externo)');
}
