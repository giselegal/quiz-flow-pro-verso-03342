import { defineConfig, devices } from '@playwright/test';

/**
 * Configuração manual do Playwright - sem webServer automático
 * Use quando o servidor já estiver rodando
 */
export default defineConfig({
    testDir: './tests/e2e',
    fullyParallel: false, // Desabilitar paralelismo para testes mais estáveis
    forbidOnly: !!process.env.CI,
    retries: 0, // Sem retries para debug
    workers: 1, // Um worker por vez
    reporter: [['list'], ['html']],
    timeout: 90000, // 90 segundos por teste
    use: {
        baseURL: 'http://localhost:8080',
        trace: 'on-first-retry',
        screenshot: 'only-on-failure',
        video: 'retain-on-failure',
    },
    projects: [
        {
            name: 'chromium',
            use: { ...devices['Desktop Chrome'] },
        },
    ],
    // Sem webServer - assume que está rodando manualmente
});
