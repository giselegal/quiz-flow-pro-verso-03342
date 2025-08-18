#!/usr/bin/env node
/**
 * 🚀 Testador de APIs REST - Quiz Quest
 * Execute: node test_apis.js
 */

import https from 'https';
import http from 'http';

class QuizAPITester {
  constructor(baseUrl = 'http://localhost:5000/api') {
    this.baseUrl = baseUrl;
  }

  // Função para fazer requisições HTTP
  async makeRequest(url) {
    return new Promise((resolve, reject) => {
      const module = url.startsWith('https') ? https : http;

      const req = module.get(url, res => {
        let data = '';

        res.on('data', chunk => {
          data += chunk;
        });

        res.on('end', () => {
          try {
            const jsonData = JSON.parse(data);
            resolve({ statusCode: res.statusCode, data: jsonData });
          } catch (error) {
            resolve({
              statusCode: res.statusCode,
              data: data,
              error: 'JSON Parse Error',
            });
          }
        });
      });

      req.on('error', error => {
        reject(error);
      });

      req.setTimeout(10000, () => {
        req.destroy();
        reject(new Error('Timeout'));
      });
    });
  }

  // Imprimir cabeçalho
  printHeader(title) {
    console.log('\n' + '='.repeat(60));
    console.log(`🎯 ${title}`);
    console.log('='.repeat(60));
  }

  // Testar um endpoint específico
  async testEndpoint(endpoint, description) {
    const url = `${this.baseUrl}${endpoint}`;
    console.log(`\n📡 Testando: ${description}`);
    console.log(`URL: ${url}`);

    try {
      const startTime = Date.now();
      const response = await this.makeRequest(url);
      const endTime = Date.now();

      console.log(`⏱️  Tempo de resposta: ${endTime - startTime}ms`);
      console.log(`📊 Status Code: ${response.statusCode}`);

      if (response.statusCode === 200 && response.data) {
        if (response.data.success) {
          const count = response.data.data ? response.data.data.length : 0;
          console.log(`✅ Sucesso! ${count} registros encontrados`);

          // Mostrar amostra dos dados
          if (count > 0) {
            console.log(`📋 Amostra do primeiro registro:`);
            const sample = response.data.data[0];
            const keys = Object.keys(sample).slice(0, 3);
            keys.forEach(key => {
              console.log(`   • ${key}: ${sample[key]}`);
            });
            if (Object.keys(sample).length > 3) {
              console.log(`   ... e mais ${Object.keys(sample).length - 3} campos`);
            }
          }

          return { success: true, data: response.data, count };
        } else {
          console.log(`❌ API retornou erro:`, response.data);
          return { success: false, data: response.data, count: 0 };
        }
      } else {
        console.log(`❌ Erro HTTP ${response.statusCode}`);
        return { success: false, data: null, count: 0 };
      }
    } catch (error) {
      if (error.message === 'Timeout') {
        console.log('❌ Timeout - Servidor demorou para responder');
      } else if (error.code === 'ECONNREFUSED') {
        console.log('❌ Erro de conexão - Servidor não está rodando?');
      } else {
        console.log(`❌ Erro inesperado: ${error.message}`);
      }
      return { success: false, data: null, count: 0 };
    }
  }

  // Executar todos os testes
  async runAllTests() {
    this.printHeader('TESTADOR DE APIs - QUIZ QUEST');
    console.log(`🔗 Base URL: ${this.baseUrl}`);
    console.log(`⏰ Timestamp: ${new Date().toLocaleString('pt-BR')}`);

    const endpoints = [
      ['/quiz-results', 'Resultados dos Quizzes'],
      ['/conversion-events', 'Eventos de Conversão'],
      ['/hotmart-purchases', 'Compras Hotmart'],
      ['/utm-analytics', 'Analytics UTM'],
      ['/quiz-participants', 'Participantes do Quiz'],
    ];

    const results = [];
    let successCount = 0;

    for (const [endpoint, description] of endpoints) {
      const result = await this.testEndpoint(endpoint, description);
      results.push({
        endpoint,
        description,
        success: result.success,
        count: result.count,
      });
      if (result.success) successCount++;
    }

    // Resumo final
    this.printHeader('RESUMO DOS TESTES');
    console.log(`✅ APIs funcionando: ${successCount}/${endpoints.length}`);
    console.log(`❌ APIs com problema: ${endpoints.length - successCount}/${endpoints.length}`);

    console.log('\n📊 Detalhamento:');
    results.forEach(result => {
      const status = result.success ? '✅' : '❌';
      console.log(
        `${status} ${result.endpoint} - ${result.description} (${result.count} registros)`
      );
    });

    if (successCount === endpoints.length) {
      console.log('\n🎉 PARABÉNS! Todas as APIs estão funcionando perfeitamente!');
    } else if (successCount > 0) {
      console.log('\n⚠️  Algumas APIs estão funcionando. Verifique os erros acima.');
    } else {
      console.log(
        '\n🚨 ATENÇÃO! Nenhuma API está funcionando. Verifique se o servidor está rodando:'
      );
      console.log('   1. Execute: npm run dev');
      console.log('   2. Verifique se a porta 3000 está correta');
      console.log('   3. Teste manualmente: curl http://localhost:3000/api/quiz-results');
    }

    return results;
  }

  // Testar jornada de usuário específico
  async testUserJourney(email) {
    this.printHeader(`JORNADA DO USUÁRIO: ${email}`);

    const result = await this.testEndpoint(
      `/conversion-events/email/${email}`,
      `Eventos do usuário ${email}`
    );

    if (result.success && result.data && result.data.data) {
      const events = result.data.data;
      console.log('\n📈 Jornada completa encontrada:');
      events.forEach((event, index) => {
        const timestamp = event.createdAt || 'N/A';
        const eventType = event.eventType || 'N/A';
        const value = event.value || 0;
        console.log(`   ${index + 1}. ${timestamp} - ${eventType} (R$ ${value})`);
      });
    }

    return result;
  }

  // Exemplo de como usar as APIs em uma aplicação
  async demonstrateUsage() {
    this.printHeader('EXEMPLO DE USO DAS APIs');

    console.log('📝 Exemplo de como usar essas APIs em sua aplicação:');
    console.log(`
// 1. Buscar todos os resultados dos quizzes
fetch('${this.baseUrl}/quiz-results')
  .then(response => response.json())
  .then(data => {
    console.log('Resultados:', data.data);
    // Processar dados...
  });

// 2. Buscar eventos de conversão
fetch('${this.baseUrl}/conversion-events')
  .then(response => response.json())
  .then(data => {
    const events = data.data;
    console.log('Total de eventos:', events.length);
    // Criar dashboard...
  });

// 3. Buscar jornada de um usuário
fetch('${this.baseUrl}/conversion-events/email/user@example.com')
  .then(response => response.json())
  .then(data => {
    console.log('Jornada do usuário:', data.data);
    // Análise de comportamento...
  });
        `);
  }
}

// Função principal
async function main() {
  console.log('🚀 Iniciando teste das APIs REST...');

  // Criar instância do testador
  const tester = new QuizAPITester();

  // Executar todos os testes
  await tester.runAllTests();

  // Teste adicional: jornada de usuário
  console.log('\n' + '='.repeat(60));
  await tester.testUserJourney('user@example.com');

  // Demonstrar uso das APIs
  await tester.demonstrateUsage();

  console.log('\n🏁 Teste finalizado!');
  console.log('💡 Para visualizar os dados em um dashboard, abra: dashboard_analytics.html');
}

// Executar se for chamado diretamente
if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch(console.error);
}

export default QuizAPITester;
