#!/usr/bin/env node
/**
 * 🚀 Teste Simples das APIs - Quiz Quest
 * Execute: node test_simple.js
 */

import http from 'http';

const BASE_URL = 'http://localhost:5000';

// Função simples para teste
function testEndpoint(path) {
  return new Promise(resolve => {
    const url = `${BASE_URL}${path}`;
    console.log(`🧪 Testando: ${url}`);

    const req = http.get(url, res => {
      let data = '';
      res.on('data', chunk => (data += chunk));
      res.on('end', () => {
        const status = res.statusCode;
        const emoji = status === 200 ? '✅' : '❌';
        console.log(`${emoji} Status: ${status}`);

        try {
          const json = JSON.parse(data);
          console.log(`📊 Resposta:`, json);
        } catch {
          console.log(`📄 Resposta (text):`, data.slice(0, 100) + '...');
        }
        console.log('─'.repeat(50));
        resolve({ status, data });
      });
    });

    req.on('error', err => {
      console.log(`❌ Erro: ${err.message}`);
      console.log('─'.repeat(50));
      resolve({ status: 0, error: err.message });
    });

    req.setTimeout(5000, () => {
      req.destroy();
      console.log(`⏰ Timeout`);
      console.log('─'.repeat(50));
      resolve({ status: 0, error: 'Timeout' });
    });
  });
}

async function main() {
  console.log('🚀 TESTE SIMPLES DAS APIs');
  console.log('═'.repeat(50));

  const endpoints = [
    '/api/quiz-results',
    '/api/conversion-events',
    '/api/hotmart-purchases',
    '/api/utm-analytics',
    '/api/quiz-participants',
  ];

  for (const endpoint of endpoints) {
    await testEndpoint(endpoint);
    await new Promise(resolve => setTimeout(resolve, 1000)); // Pausa 1s
  }

  console.log('🏁 Teste finalizado!');
  console.log('\n💡 Dicas:');
  console.log('• Se status 200: API funcionando ✅');
  console.log('• Se status 500: Problema no servidor ⚠️');
  console.log('• Se status 0: Servidor não está rodando ❌');
  console.log('\n📋 Para configurar o banco: npm run db:push');
  console.log('📊 Para dashboard visual: open dashboard_analytics.html');
}

main().catch(console.error);
