/**
 * 🎭 CONFIGURAÇÃO PLAYWRIGHT MELHORADA
 * 
 * Configuração otimizada com os novos testes, relatórios personalizados,
 * paralelização inteligente e configurações avançadas.
 */

import { defineConfig, devices } from '@playwright/test';
import path from 'path';

export default defineConfig({
  // Diretório dos testes
  testDir: './tests/e2e',
  
  // Padrões de arquivos de teste
  testMatch: [
    'comprehensive-structure-validation.spec.ts',
    'accessibility-quality.spec.ts', 
    'visual-regression.spec.ts',
    'quick-validation.spec.ts'
  ],
  
  // Configurações de execução
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 1,
  workers: process.env.CI ? 2 : 4,
  
  // Configurações de timeout
  timeout: 60000, // 60s por teste
  expect: {
    timeout: 15000, // 15s para assertions
    toHaveScreenshot: {
      threshold: 0.2, // 20% de diferença permitida
      maxDiffPixels: 1000,
    },
  },
  
  // Configurações globais
  use: {
    // URL base da aplicação
    baseURL: 'http://localhost:8080',
    
    // Configurações de trace e debug
    trace: process.env.CI ? 'on-first-retry' : 'retain-on-failure',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    
    // Configurações de navegador
    actionTimeout: 10000,
    navigationTimeout: 30000,
    
    // Headers personalizados
    extraHTTPHeaders: {
      'Accept-Language': 'pt-BR,pt;q=0.9,en;q=0.8',
      'User-Agent': 'QuizFlow-E2E-Tests/1.0 Playwright',
    },
    
    // Configurações de contexto
    locale: 'pt-BR',
    timezoneId: 'America/Sao_Paulo',
    
    // Desabilitar animações para testes mais estáveis
    reducedMotion: 'reduce',
  },
  
  // Configuração de projetos (browsers)
  projects: [
    // 🖥️ Desktop Browsers
    {
      name: 'chromium-desktop',
      use: {
        ...devices['Desktop Chrome'],
        viewport: { width: 1920, height: 1080 },
      },
      testMatch: ['**/*.spec.ts'],
    },
    
    {
      name: 'firefox-desktop',
      use: {
        ...devices['Desktop Firefox'],
        viewport: { width: 1920, height: 1080 },
      },
      testMatch: ['comprehensive-structure-validation.spec.ts', 'accessibility-quality.spec.ts'],
    },
    
    {
      name: 'webkit-desktop',
      use: {
        ...devices['Desktop Safari'],
        viewport: { width: 1920, height: 1080 },
      },
      testMatch: ['comprehensive-structure-validation.spec.ts', 'quick-validation.spec.ts'],
    },
    
    // 📱 Mobile Browsers
    {
      name: 'mobile-chrome',
      use: {
        ...devices['Pixel 5'],
      },
      testMatch: ['comprehensive-structure-validation.spec.ts', 'accessibility-quality.spec.ts'],
    },
    
    {
      name: 'mobile-safari',
      use: {
        ...devices['iPhone 12'],
      },
      testMatch: ['comprehensive-structure-validation.spec.ts', 'quick-validation.spec.ts'],
    },
    
    // 📊 Tablet
    {
      name: 'tablet-chrome',
      use: {
        ...devices['iPad Pro'],
      },
      testMatch: ['comprehensive-structure-validation.spec.ts'],
    },
    
    // 🎯 Projetos especializados
    {
      name: 'accessibility-audit',
      use: {
        ...devices['Desktop Chrome'],
        viewport: { width: 1366, height: 768 },
      },
      testMatch: ['accessibility-quality.spec.ts'],
    },
    
    {
      name: 'visual-regression',
      use: {
        ...devices['Desktop Chrome'],
        viewport: { width: 1920, height: 1080 },
        // Configurações específicas para testes visuais
        reducedMotion: 'reduce',
        forcedColors: 'none',
      },
      testMatch: ['visual-regression.spec.ts'],
    },
    
    {
      name: 'performance-audit', 
      use: {
        ...devices['Desktop Chrome'],
        viewport: { width: 1920, height: 1080 },
        // Configurações para auditoria de performance
        launchOptions: {
          args: [
            '--disable-web-security',
            '--disable-features=TranslateUI',
            '--disable-ipc-flooding-protection',
          ],
        },
      },
      testMatch: ['comprehensive-structure-validation.spec.ts'],
      grep: /performance|speed|load/i,
    },
  ],
  
  // Configuração de relatórios
  reporter: [
    // Relatório padrão no terminal
    ['list', { printSteps: true }],
    
    // Relatório HTML nativo do Playwright
    ['html', { 
      outputFolder: 'test-results/playwright-report',
      open: process.env.CI ? 'never' : 'on-failure',
    }],
    
    // Relatório JSON para integração com CI/CD
    ['json', { outputFile: 'test-results/results.json' }],
    
    // Relatório JUnit para sistemas de CI
    ['junit', { outputFile: 'test-results/junit.xml' }],
    
    // Relatório customizado
    ['./tests/e2e/utils/custom-reporter.ts'],
  ],
  
  // Configuração de output
  outputDir: 'test-results',
  
  // Setup e teardown globais
  globalSetup: require.resolve('./tests/e2e/global-setup.ts'),
  globalTeardown: require.resolve('./tests/e2e/global-teardown.ts'),
  
  // Configurações do servidor web (se necessário iniciar automaticamente)
  webServer: process.env.CI ? undefined : {
    command: 'npm run dev',
    url: 'http://localhost:8080',
    reuseExistingServer: true,
    timeout: 120000, // 2 minutos para startup
    stdout: 'pipe',
    stderr: 'pipe',
  },
  
  // Configurações experimentais
  experimental: {
    // Habilitar test parallelization por worker
    testIdAttribute: 'data-testid',
  },
  
  // Metadata para relatórios
  metadata: {
    project: 'Quiz Flow Pro',
    version: process.env.npm_package_version || '1.0.0',
    environment: process.env.NODE_ENV || 'development',
    branch: process.env.GITHUB_REF_NAME || 'local',
    commit: process.env.GITHUB_SHA || 'local-commit',
  },
});