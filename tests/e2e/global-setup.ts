/**
 * 🚀 SETUP GLOBAL DOS TESTES E2E
 * 
 * Configuração executada antes de todos os testes.
 * Prepara o ambiente, dados de teste e validações iniciais.
 */

import { chromium, FullConfig } from '@playwright/test';
import fs from 'fs';
import path from 'path';

async function globalSetup(config: FullConfig) {
  console.log('🚀 Iniciando setup global dos testes E2E...');
  
  try {
    // 1. Criar diretórios necessários
    await createTestDirectories();
    
    // 2. Verificar se o servidor está rodando
    await checkServerHealth(config);
    
    // 3. Preparar dados de teste
    await prepareTestData();
    
    // 4. Configurar storage state (se necessário)
    await setupAuthState(config);
    
    // 5. Limpar screenshots antigos
    await cleanupOldScreenshots();
    
    console.log('✅ Setup global concluído com sucesso');
  } catch (error) {
    console.error('❌ Erro no setup global:', error);
    throw error;
  }
}

/**
 * Criar diretórios necessários para os testes
 */
async function createTestDirectories() {
  const directories = [
    'test-results',
    'test-results/reports', 
    'test-results/screenshots',
    'test-results/videos',
    'test-results/traces',
    'test-results/downloads',
  ];
  
  for (const dir of directories) {
    const fullPath = path.join(process.cwd(), dir);
    if (!fs.existsSync(fullPath)) {
      fs.mkdirSync(fullPath, { recursive: true });
      console.log(`📁 Diretório criado: ${dir}`);
    }
  }
}

/**
 * Verificar saúde do servidor de desenvolvimento
 */
async function checkServerHealth(config: FullConfig) {
  const baseURL = config.projects[0]?.use?.baseURL || 'http://localhost:8080';
  const maxAttempts = 30;
  const delay = 2000;
  
  console.log(`🌐 Verificando servidor em ${baseURL}...`);
  
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      const browser = await chromium.launch();
      const page = await browser.newPage();
      
      const response = await page.goto(baseURL, { 
        timeout: 5000,
        waitUntil: 'domcontentloaded'
      });
      
      await browser.close();
      
      if (response && response.status() < 400) {
        console.log(`✅ Servidor respondendo (status: ${response.status()})`);
        return;
      }
      
      throw new Error(`Servidor retornou status ${response?.status()}`);
      
    } catch (error) {
      console.log(`⚠️ Tentativa ${attempt}/${maxAttempts} falhou: ${(error as Error).message}`);
      
      if (attempt === maxAttempts) {
        throw new Error(`Servidor não está disponível em ${baseURL} após ${maxAttempts} tentativas`);
      }
      
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
}

/**
 * Preparar dados de teste no localStorage
 */
async function prepareTestData() {
  console.log('📋 Preparando dados de teste...');
  
  const testData = {
    // Configurações de teste
    'e2e-test-mode': 'true',
    'e2e-test-timestamp': new Date().toISOString(),
    
    // Dados de usuário de teste
    'test-user-preferences': JSON.stringify({
      theme: 'light',
      language: 'pt-BR',
      notifications: false,
      analytics: false,
    }),
    
    // Estado de quiz de teste  
    'test-quiz-progress': JSON.stringify({
      quizId: 'test-quiz-001',
      currentQuestion: 1,
      answers: {},
      startTime: Date.now(),
    }),
    
    // Configurações do editor de teste
    'test-editor-settings': JSON.stringify({
      gridSnap: true,
      showRulers: false,
      autoSave: false, // Desabilitado para testes
    }),
  };
  
  // Salvar dados em arquivo para injeção posterior
  const testDataPath = path.join(process.cwd(), 'test-results', 'test-data.json');
  fs.writeFileSync(testDataPath, JSON.stringify(testData, null, 2));
  
  console.log(`💾 Dados de teste salvos em: ${testDataPath}`);
}

/**
 * Configurar estado de autenticação (se necessário)
 */
async function setupAuthState(config: FullConfig) {
  const baseURL = config.projects[0]?.use?.baseURL || 'http://localhost:8080';
  
  // Por enquanto, não temos autenticação implementada
  // Mas preparar a estrutura para quando houver
  
  const authStatePath = path.join(process.cwd(), 'test-results', 'auth-state.json');
  
  const authState = {
    cookies: [],
    origins: [
      {
        origin: baseURL,
        localStorage: [
          {
            name: 'auth-token',
            value: 'test-token-mock',
          },
          {
            name: 'user-session',
            value: JSON.stringify({
              id: 'test-user-123',
              email: 'test@example.com',
              name: 'Usuário de Teste',
              role: 'user',
            }),
          },
        ],
      },
    ],
  };
  
  fs.writeFileSync(authStatePath, JSON.stringify(authState, null, 2));
  console.log('🔐 Estado de autenticação preparado');
}

/**
 * Limpar screenshots antigos para evitar acúmulo
 */
async function cleanupOldScreenshots() {
  const screenshotsDir = path.join(process.cwd(), 'test-results', 'screenshots');
  
  if (!fs.existsSync(screenshotsDir)) {
    return;
  }
  
  const files = fs.readdirSync(screenshotsDir);
  const oldFiles = files.filter(file => {
    const filePath = path.join(screenshotsDir, file);
    const stats = fs.statSync(filePath);
    const daysSinceModified = (Date.now() - stats.mtime.getTime()) / (1000 * 60 * 60 * 24);
    return daysSinceModified > 7; // Arquivos mais antigos que 7 dias
  });
  
  for (const file of oldFiles) {
    const filePath = path.join(screenshotsDir, file);
    fs.unlinkSync(filePath);
  }
  
  if (oldFiles.length > 0) {
    console.log(`🧹 Removidos ${oldFiles.length} screenshots antigos`);
  }
}

/**
 * Validar ambiente e dependências
 */
async function validateEnvironment() {
  console.log('🔍 Validando ambiente...');
  
  // Verificar Node.js version
  const nodeVersion = process.version;
  console.log(`Node.js: ${nodeVersion}`);
  
  // Verificar se playwright está instalado
  try {
    const { chromium } = await import('@playwright/test');
    console.log('✅ Playwright disponível');
  } catch (error) {
    throw new Error('Playwright não está instalado ou configurado corretamente');
  }
  
  // Verificar variáveis de ambiente importantes
  const requiredEnvVars = [
    // Adicionar variáveis necessárias conforme implementação
  ];
  
  for (const envVar of requiredEnvVars) {
    if (!process.env[envVar]) {
      console.warn(`⚠️ Variável de ambiente não definida: ${envVar}`);
    }
  }
}

/**
 * Criar arquivo de configuração de teste
 */
async function createTestConfig() {
  const testConfig = {
    startTime: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
    baseURL: process.env.BASE_URL || 'http://localhost:8080',
    parallel: true,
    retries: process.env.CI ? 2 : 1,
    timeout: 60000,
    
    // Flags para controlar comportamento dos testes
    flags: {
      skipSlowTests: process.env.SKIP_SLOW_TESTS === 'true',
      skipVisualTests: process.env.SKIP_VISUAL_TESTS === 'true', 
      skipA11yTests: process.env.SKIP_A11Y_TESTS === 'true',
      debugMode: process.env.DEBUG === 'true',
    },
    
    // Configurações específicas por categoria
    categories: {
      accessibility: {
        enabled: true,
        strictMode: false, // Não falhar por problemas menores
        wcagLevel: 'AA',
      },
      performance: {
        enabled: true,
        thresholds: {
          firstContentfulPaint: 2000,
          largestContentfulPaint: 4000,
          cumulativeLayoutShift: 0.1,
        },
      },
      visual: {
        enabled: true,
        threshold: 0.2,
        maxDiffPixels: 1000,
      },
    },
  };
  
  const configPath = path.join(process.cwd(), 'test-results', 'test-config.json');
  fs.writeFileSync(configPath, JSON.stringify(testConfig, null, 2));
  
  console.log('⚙️ Configuração de teste criada');
}

export default globalSetup;