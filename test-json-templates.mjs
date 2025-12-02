/**
 * 🧪 TESTE CRÍTICO: Validação de Templates JSON
 * Verifica se os templates JSON carregam e são processados corretamente
 */

import http from 'http';

const BASE_URL = 'http://localhost:8081';
const TEMPLATES = [
  'quiz21-complete.json',
  'quiz21-v4.json',
  'step-01-v3.json',
  'step-02-v3.json',
  'blocks.json'
];

console.log('🧪 TESTE DE TEMPLATES JSON\n');
console.log('=' .repeat(60));

let totalTests = 0;
let passedTests = 0;
let failedTests = 0;

async function testTemplate(filename) {
  totalTests++;
  const url = `${BASE_URL}/templates/${filename}`;
  
  return new Promise((resolve) => {
    http.get(url, (res) => {
      let data = '';
      
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          // Test 1: HTTP Status
          const statusOk = res.statusCode === 200;
          
          // Test 2: Valid JSON
          const json = JSON.parse(data);
          const jsonValid = json !== null;
          
          // Test 3: Has required structure
          let structureOk = false;
          if (filename === 'blocks.json') {
            structureOk = Array.isArray(json) || typeof json === 'object';
          } else if (filename.includes('step-')) {
            structureOk = json.blocks || json.metadata;
          } else {
            structureOk = json.steps || json.metadata || json.templateId;
          }
          
          // Test 4: Size validation
          const sizeOk = data.length > 100; // Pelo menos 100 bytes
          
          const allPassed = statusOk && jsonValid && structureOk && sizeOk;
          
          if (allPassed) {
            passedTests++;
            console.log(`✅ ${filename}`);
            console.log(`   Status: ${res.statusCode} | Size: ${data.length} bytes`);
            if (json.steps) console.log(`   Steps: ${Object.keys(json.steps).length}`);
            if (json.blocks) console.log(`   Blocks: ${json.blocks.length}`);
          } else {
            failedTests++;
            console.log(`❌ ${filename}`);
            console.log(`   Status: ${res.statusCode} | Valid JSON: ${jsonValid} | Structure: ${structureOk}`);
          }
          
          resolve(allPassed);
        } catch (error) {
          failedTests++;
          console.log(`❌ ${filename} - Parse Error: ${error.message}`);
          resolve(false);
        }
      });
    }).on('error', (err) => {
      failedTests++;
      console.log(`❌ ${filename} - Network Error: ${err.message}`);
      resolve(false);
    });
  });
}

// Executar todos os testes
async function runAllTests() {
  for (const template of TEMPLATES) {
    await testTemplate(template);
  }
  
  console.log('\n' + '='.repeat(60));
  console.log('📊 RESULTADO FINAL');
  console.log('='.repeat(60));
  console.log(`Total: ${totalTests} testes`);
  console.log(`✅ Passou: ${passedTests}`);
  console.log(`❌ Falhou: ${failedTests}`);
  console.log(`📈 Taxa de sucesso: ${((passedTests/totalTests)*100).toFixed(1)}%`);
  
  if (failedTests === 0) {
    console.log('\n🎉 TODOS OS TEMPLATES JSON FUNCIONAM PERFEITAMENTE!');
    process.exit(0);
  } else {
    console.log('\n⚠️ ALGUNS TEMPLATES FALHARAM!');
    process.exit(1);
  }
}

runAllTests().catch(console.error);
