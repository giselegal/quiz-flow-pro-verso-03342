import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
    testDir: './tests/e2e',
    testMatch: '**/v3-complete-flow.spec.ts',
    fullyParallel: false, // Executar sequencialmente para manter estado
    forbidOnly: !!process.env.CI,
    retries: process.env.CI ? 2 : 0,
    workers: 1, // Um worker para manter estado consistente
    reporter: [
        ['html', { outputFolder: 'test-results/v3-flow-html' }],
        ['json', { outputFile: 'test-results/v3-flow-results.json' }],
        ['list']
    ],
    use: {
        baseURL: 'http://localhost:5173',
        trace: 'on-first-retry',
        screenshot: 'only-on-failure',
        video: 'retain-on-failure',
        actionTimeout: 10000,
        navigationTimeout: 30000,
    },
    timeout: 120000, // 2 minutos por teste
    expect: {
        timeout: 10000
    },
    projects: [
        {
            name: 'chromium',
            use: { ...devices['Desktop Chrome'] },
        },
    ],
    // Servidor já rodando - comentado para não conflitar
    // webServer: {
    //     command: 'npm run dev',
    //     url: 'http://localhost:5173',
    //     reuseExistingServer: true,
    //     timeout: 60000,
    // },
});
