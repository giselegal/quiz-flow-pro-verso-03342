import { defineConfig, devices } from '@playwright/test';

/**
 * 🧪 CONFIGURAÇÃO PARA TESTES ABRANGENTES E2E
 * 
 * Configuração otimizada para validação completa da estrutura atual.
 * Inclui configurações para performance, debugging e relatórios detalhados.
 */
export default defineConfig({
    testDir: './tests/e2e',
    
    // Executar testes em paralelo para maior velocidade
    fullyParallel: true,
    
    // Falhar build se test.only for deixado acidentalmente
    forbidOnly: !!process.env.CI,
    
    // Retry em CI para lidar com flakiness
    retries: process.env.CI ? 2 : 0,
    
    // Workers otimizados para testes abrangentes
    workers: process.env.CI ? 2 : 4,
    
    // Timeout estendido para testes de validação estrutural
    timeout: 60 * 1000, // 60 segundos por teste
    
    // Timeout para expect assertions
    expect: {
        timeout: 10 * 1000, // 10 segundos para assertions
    },
    
    // Reporter HTML com métricas detalhadas
    reporter: [
        ['html', { 
            outputFolder: 'playwright-report-comprehensive',
            open: 'never' // Não abrir automaticamente
        }],
        ['line'], // Output no terminal
        ['json', { 
            outputFile: 'test-results-comprehensive.json' 
        }]
    ],
    
    // Configurações globais
    use: {
        // Base URL do aplicação
        baseURL: 'http://localhost:8080',
        
        // Trace para debugging
        trace: 'retain-on-failure',
        
        // Screenshots em falhas
        screenshot: 'only-on-failure',
        
        // Videos em falhas
        video: 'retain-on-failure',
        
        // Timeout para navegação
        navigationTimeout: 30 * 1000,
        
        // Timeout para ações
        actionTimeout: 10 * 1000,
        
        // Configurações de viewport padrão
        viewport: { width: 1280, height: 720 },
        
        // Ignorar certificados HTTPS para desenvolvimento
        ignoreHTTPSErrors: true,
        
        // User agent personalizado para identificar testes
        userAgent: 'QuizFlowPro-E2E-Tests/1.0 Playwright/Comprehensive',
    },

    // Projetos de teste para diferentes browsers e contextos
    projects: [
        // Desktop browsers
        {
            name: 'chromium-desktop',
            use: { 
                ...devices['Desktop Chrome'],
                // Configurações específicas para validação estrutural
                viewport: { width: 1920, height: 1080 },
            },
        },
        {
            name: 'firefox-desktop',
            use: { 
                ...devices['Desktop Firefox'],
                viewport: { width: 1920, height: 1080 },
            },
        },
        {
            name: 'webkit-desktop',
            use: { 
                ...devices['Desktop Safari'],
                viewport: { width: 1920, height: 1080 },
            },
        },

        // Mobile devices
        {
            name: 'mobile-chrome',
            use: { ...devices['Pixel 5'] },
        },
        {
            name: 'mobile-safari',
            use: { ...devices['iPhone 12'] },
        },

        // Tablet
        {
            name: 'tablet-chrome',
            use: { ...devices['iPad Pro'] },
        },

        // Contextos específicos para testes abrangentes
        {
            name: 'performance-test',
            use: { 
                ...devices['Desktop Chrome'],
                // Configurações otimizadas para testes de performance
                launchOptions: {
                    args: ['--disable-dev-shm-usage', '--disable-extensions'],
                },
            },
        },
        {
            name: 'memory-test',
            use: { 
                ...devices['Desktop Chrome'],
                // Configurações para detectar memory leaks
                launchOptions: {
                    args: ['--enable-precise-memory-info'],
                },
            },
        },
    ],

    // Configuração do servidor de desenvolvimento
    webServer: {
        command: 'npm run dev:stack:wait',
        url: 'http://localhost:8080',
        reuseExistingServer: !process.env.CI,
        timeout: 120 * 1000, // 2 minutos para inicializar
        stdout: 'pipe',
        stderr: 'pipe',
    },

    // Configurações globais de setup/teardown
    globalSetup: require.resolve('./tests/e2e/global.setup.ts'),
    globalTeardown: require.resolve('./tests/e2e/global.teardown.ts'),
});