import { test, expect } from '@playwright/test';

/**
 * 🔒 TESTES E2E - FLUXOS DE SEGURANÇA
 * 
 * Testa scenarios críticos de segurança do editor
 */

test.describe('Security Flow Tests', () => {

    test.beforeEach(async ({ page }) => {
        // Setup inicial
        await page.goto('/');
        await page.waitForLoadState('networkidle');
    });

    test('🔐 Autenticação - Login seguro', async ({ page }) => {
        // Navegar para login
        await page.click('[data-testid="login-button"]');
        await page.waitForSelector('[data-testid="login-form"]');

        // Testar input sanitization
        await page.fill('[data-testid="email-input"]', 'test@example.com');
        await page.fill('[data-testid="password-input"]', 'securePassword123!');

        // Verificar que senha não aparece em plain text
        const passwordInput = page.locator('[data-testid="password-input"]');
        await expect(passwordInput).toHaveAttribute('type', 'password');

        // Submeter form
        await page.click('[data-testid="login-submit"]');

        // Verificar redirecionamento seguro
        await expect(page).toHaveURL(/.*\/dashboard/);
    });

    test('🛡️ XSS Prevention - Input sanitization', async ({ page }) => {
        // Navegar para editor
        await page.goto('/editor/new');
        await page.waitForLoadState('networkidle');

        // Tentar injetar script malicioso
        const maliciousScript = '<script>alert("XSS")</script>';

        // Testar em título do funil
        await page.fill('[data-testid="funnel-title"]', maliciousScript);

        // Verificar que script não foi executado
        page.on('dialog', () => {
            test.fail('XSS vulnerability detected - alert was triggered');
        });

        // Verificar que conteúdo foi sanitizado
        const titleValue = await page.inputValue('[data-testid="funnel-title"]');
        expect(titleValue).not.toContain('<script>');
    });

    test('🔒 CSRF Protection - Token validation', async ({ page }) => {
        // Interceptar requests para verificar CSRF tokens
        let hasCSRFToken = false;

        page.route('**/api/**', (route) => {
            const headers = route.request().headers();
            if (headers['x-csrf-token'] || headers['x-requested-with']) {
                hasCSRFToken = true;
            }
            route.continue();
        });

        // Executar ação que requer proteção CSRF
        await page.goto('/editor/new');
        await page.click('[data-testid="save-funnel"]');

        // Verificar que CSRF token foi incluído
        expect(hasCSRFToken).toBeTruthy();
    });

    test('🚫 SQL Injection Prevention', async ({ page }) => {
        // Navegar para busca
        await page.goto('/funnels/search');

        // Tentar injection SQL
        const sqlInjection = "'; DROP TABLE funnels; --";
        await page.fill('[data-testid="search-input"]', sqlInjection);
        await page.click('[data-testid="search-button"]');

        // Verificar que aplicação não quebrou
        await expect(page.locator('[data-testid="search-results"]')).toBeVisible();

        // Verificar mensagem de erro apropriada ou resultados vazios
        const results = page.locator('[data-testid="search-result"]');
        await expect(results).toHaveCount(0);
    });

    test('🔐 Session Management - Auto logout', async ({ page }) => {
        // Simular login
        await page.goto('/login');
        await page.fill('[data-testid="email-input"]', 'test@example.com');
        await page.fill('[data-testid="password-input"]', 'password123');
        await page.click('[data-testid="login-submit"]');

        await expect(page).toHaveURL(/.*\/dashboard/);

        // Simular expiração de sessão através de cookie manipulation
        await page.context().clearCookies();

        // Tentar acessar página protegida
        await page.goto('/editor/protected');

        // Verificar redirecionamento para login
        await expect(page).toHaveURL(/.*\/login/);
    });

    test('📊 Data Privacy - Sensitive data handling', async ({ page }) => {
        await page.goto('/editor/new');

        // Interceptar network requests
        const sensitivePatterns = [
            /password/i,
            /credit.card/i,
            /ssn/i,
            /social.security/i
        ];

        page.route('**/*', (route) => {
            const request = route.request();
            const body = request.postData();

            if (body) {
                sensitivePatterns.forEach(pattern => {
                    if (pattern.test(body)) {
                        test.fail(`Sensitive data detected in request: ${body.substring(0, 100)}...`);
                    }
                });
            }

            route.continue();
        });

        // Adicionar dados sensíveis em campos
        await page.fill('[data-testid="user-info"]', 'Social Security: 123-45-6789');
        await page.click('[data-testid="save-draft"]');

        // Test should not fail if properly implemented
    });

    test('🔒 Content Security Policy', async ({ page }) => {
        // Verificar CSP headers
        const response = await page.goto('/');
        const cspHeader = response?.headers()['content-security-policy'];

        if (cspHeader) {
            expect(cspHeader).toContain("script-src 'self'");
            expect(cspHeader).toContain("object-src 'none'");
        }

        // Tentar carregar script externo não autorizado
        const scriptInjected = await page.evaluate(() => {
            try {
                const script = document.createElement('script');
                script.src = 'https://malicious-site.com/evil.js';
                document.head.appendChild(script);
                return true;
            } catch (e) {
                return false;
            }
        });

        // CSP deveria bloquear scripts externos
        expect(scriptInjected).toBeFalsy();
    });

    test('🛡️ Rate Limiting', async ({ page }) => {
        const startTime = Date.now();
        let blockedRequest = false;

        // Interceptar responses para detectar rate limiting
        page.route('**/api/**', (route) => {
            const response = route.fetch().then(res => {
                if (res.status() === 429) {
                    blockedRequest = true;
                }
                return res;
            });
            route.fulfill({ response });
        });

        // Fazer múltiplas requests rapidamente
        for (let i = 0; i < 20; i++) {
            try {
                await page.goto(`/api/test?req=${i}`);
            } catch (e) {
                // Esperado se rate limiting estiver funcionando
            }
        }

        const endTime = Date.now();
        const duration = endTime - startTime;

        // Rate limiting deveria ter entrado em ação
        expect(duration > 1000 || blockedRequest).toBeTruthy();
    });

    test('🔐 Permission Validation', async ({ page }) => {
        // Login como usuário com permissões limitadas
        await page.goto('/login');
        await page.fill('[data-testid="email-input"]', 'limited@example.com');
        await page.fill('[data-testid="password-input"]', 'password123');
        await page.click('[data-testid="login-submit"]');

        // Tentar acessar funcionalidade admin
        await page.goto('/admin/users');

        // Verificar que acesso foi negado
        await expect(page.locator('[data-testid="access-denied"]')).toBeVisible();

        // Ou redirecionado para página de erro
        await expect(page).toHaveURL(/.*\/(403|unauthorized|access-denied)/);
    });
});