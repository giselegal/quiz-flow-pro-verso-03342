// Teste simples para verificar se os templates estão funcionando
const fs = require('fs');

console.log('🧪 Testando sistema de templates...');

// Verificar se todos os arquivos existem
const expectedFiles = [];
for (let i = 1; i <= 21; i++) {
  const stepNum = i.toString().padStart(2, '0');
  let fileName;

  if (i === 1) {
    fileName = `src/components/steps/Step01Intro.tsx`;
  } else if (i === 2) {
    fileName = `src/components/steps/Step02Question01.tsx`;
  } else {
    fileName = `src/components/steps/Step${stepNum}Template.tsx`;
  }

  expectedFiles.push({
    step: i,
    file: fileName,
    exists: fs.existsSync(fileName),
  });
}

console.log('\n📁 Verificação de arquivos:');
expectedFiles.forEach(({ step, file, exists }) => {
  console.log(`Step ${step}: ${exists ? '✅' : '❌'} ${file}`);
});

// Verificar quantos estão faltando
const missing = expectedFiles.filter(f => !f.exists);
const existing = expectedFiles.filter(f => f.exists);

console.log(`\n📊 Resultado:`);
console.log(`✅ Existem: ${existing.length}/21`);
console.log(`❌ Faltam: ${missing.length}/21`);

if (missing.length > 0) {
  console.log(`\n❌ Arquivos faltando:`);
  missing.forEach(({ step, file }) => {
    console.log(`   Step ${step}: ${file}`);
  });
}
