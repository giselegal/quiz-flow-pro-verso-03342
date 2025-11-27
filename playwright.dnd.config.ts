import { defineConfig, devices } from '@playwright/test';

/**
 * 🧪 PLAYWRIGHT CONFIG - Testes DND
 * 
 * Configuração otimizada para testes do sistema Drag and Drop:
 * - Timeout maior para animações (300ms cubic-bezier)
 * - Screenshots automáticos em falhas
 * - Trace habilitado para debug
 * - Múltiplos browsers + mobile
 */
export default defineConfig({
    testDir: './tests/e2e',
    testMatch: '**/dnd-*.spec.ts',
    
    // Timeout maior para animações DnD
    timeout: 60000,
    expect: {
        timeout: 10000,
    },
    
    fullyParallel: false, // DnD pode ter race conditions
    forbidOnly: !!process.env.CI,
    retries: process.env.CI ? 2 : 1,
    workers: process.env.CI ? 1 : 2,
    
    reporter: [
        ['html', { outputFolder: 'test-results/dnd-report' }],
        ['json', { outputFile: 'test-results/dnd-results.json' }],
        ['list'],
    ],
    
    use: {
        baseURL: process.env.TEST_BASE_URL || 'http://localhost:8080',
        trace: 'retain-on-failure',
        screenshot: 'only-on-failure',
        video: 'retain-on-failure',
        
        // Aumentar tempo de ação para animações
        actionTimeout: 15000,
        navigationTimeout: 30000,
    },
    
    projects: [
        // 🖥️ Desktop
        {
            name: 'chromium-dnd',
            use: { 
                ...devices['Desktop Chrome'],
                viewport: { width: 1280, height: 720 },
            },
        },
        {
            name: 'firefox-dnd',
            use: { ...devices['Desktop Firefox'] },
        },
        {
            name: 'webkit-dnd',
            use: { ...devices['Desktop Safari'] },
        },
        
        // 📱 Mobile
        {
            name: 'mobile-chrome-dnd',
            use: { 
                ...devices['Pixel 5'],
                hasTouch: true,
            },
        },
        {
            name: 'mobile-safari-dnd',
            use: { 
                ...devices['iPhone 12'],
                hasTouch: true,
            },
        },
        
        // 🔍 Debug (com headed mode)
        {
            name: 'debug-dnd',
            use: {
                ...devices['Desktop Chrome'],
                headless: false,
                launchOptions: {
                    slowMo: 500, // Slow motion para ver animações
                },
            },
        },
    ],
    
    webServer: {
        command: 'npm run dev',
        url: 'http://localhost:8080',
        reuseExistingServer: !process.env.CI,
        timeout: 120000,
    },
});
