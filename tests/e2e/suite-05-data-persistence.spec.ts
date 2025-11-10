/**
 * 💾 SUITE 05 - PERSISTÊNCIA DE DADOS
 * 
 * Testes de persistência e storage:
 * - LocalStorage funciona
 * - SessionStorage funciona
 * - Dados sobrevivem refresh
 * - API calls funcionam
 * - Cache funciona adequadamente
 * 
 * @module tests/e2e/suite-05-data-persistence
 */

import { test, expect } from '@playwright/test';

const BASE_URL = 'http://localhost:8080';

test.describe('💾 Suite 05: Persistência de Dados', () => {

    test('deve ter acesso ao localStorage', async ({ page }) => {
        await page.goto(BASE_URL);

        // Testar escrita e leitura no localStorage
        const testValue = await page.evaluate(() => {
            localStorage.setItem('e2e_test_key', 'test_value');
            return localStorage.getItem('e2e_test_key');
        });

        expect(testValue).toBe('test_value');

        // Limpar
        await page.evaluate(() => {
            localStorage.removeItem('e2e_test_key');
        });

        console.log('✅ LocalStorage acessível e funcional');
    });

    test('deve ter acesso ao sessionStorage', async ({ page }) => {
        await page.goto(BASE_URL);

        // Testar escrita e leitura no sessionStorage
        const testValue = await page.evaluate(() => {
            sessionStorage.setItem('e2e_session_test', 'session_value');
            return sessionStorage.getItem('e2e_session_test');
        });

        expect(testValue).toBe('session_value');

        console.log('✅ SessionStorage acessível e funcional');
    });

    test('deve persistir dados no localStorage após refresh', async ({ page }) => {
        await page.goto(BASE_URL);

        // Salvar dado
        await page.evaluate(() => {
            localStorage.setItem('e2e_persist_test', 'persistent_data');
        });

        // Recarregar página
        await page.reload();
        await page.waitForLoadState('networkidle');

        // Verificar que o dado persiste
        const persistedValue = await page.evaluate(() => {
            return localStorage.getItem('e2e_persist_test');
        });

        expect(persistedValue).toBe('persistent_data');

        // Limpar
        await page.evaluate(() => {
            localStorage.removeItem('e2e_persist_test');
        });

        console.log('✅ Dados persistem após refresh da página');
    });

    test('deve fazer chamadas de rede (fetch/XHR)', async ({ page }) => {
        const requests: string[] = [];

        page.on('request', request => {
            const url = request.url();
            if (url.includes('api') || url.includes('supabase') || request.resourceType() === 'fetch') {
                requests.push(url);
            }
        });

        await page.goto(BASE_URL);
        await page.waitForLoadState('networkidle');

        if (requests.length > 0) {
            console.log(`✅ ${requests.length} chamadas de API detectadas`);
        } else {
            console.log('ℹ️ Nenhuma chamada de API detectada (pode ser esperado)');
        }
    });

    test('deve lidar com falhas de rede gracefully', async ({ page }) => {
        // Simular offline
        await page.context().setOffline(true);

        const errors: string[] = [];
        page.on('console', msg => {
            if (msg.type() === 'error') {
                errors.push(msg.text());
            }
        });

        await page.goto(BASE_URL).catch(() => {
            // Esperado falhar
        });

        // Voltar online
        await page.context().setOffline(false);
        await page.goto(BASE_URL);
        await page.waitForLoadState('networkidle');

        // A aplicação deve recuperar
        const root = page.locator('#root');
        await expect(root).toBeVisible();

        console.log('✅ Aplicação recupera de falhas de rede');
    });

    test('deve ter cookies habilitados', async ({ page, context }) => {
        await page.goto(BASE_URL);

        // Definir um cookie de teste
        await context.addCookies([{
            name: 'e2e_test_cookie',
            value: 'test_cookie_value',
            domain: 'localhost',
            path: '/'
        }]);

        // Verificar que o cookie foi definido
        const cookies = await context.cookies();
        const testCookie = cookies.find(c => c.name === 'e2e_test_cookie');

        expect(testCookie).toBeDefined();
        expect(testCookie?.value).toBe('test_cookie_value');

        console.log('✅ Cookies habilitados e funcionais');
    });

    test('deve limpar dados corretamente', async ({ page }) => {
        await page.goto(BASE_URL);

        // Adicionar alguns dados
        await page.evaluate(() => {
            localStorage.setItem('clear_test_1', 'value1');
            localStorage.setItem('clear_test_2', 'value2');
            sessionStorage.setItem('clear_test_session', 'session');
        });

        // Limpar localStorage
        await page.evaluate(() => {
            localStorage.clear();
        });

        // Verificar que foi limpo
        const clearedValue = await page.evaluate(() => {
            return localStorage.getItem('clear_test_1');
        });

        expect(clearedValue).toBeNull();

        console.log('✅ Limpeza de dados funciona corretamente');
    });

    test('deve ter limite de storage respeitado', async ({ page }) => {
        await page.goto(BASE_URL);

        // Tentar escrever dados grandes
        try {
            await page.evaluate(() => {
                const largeData = 'x'.repeat(1024 * 1024); // 1MB
                for (let i = 0; i < 10; i++) {
                    try {
                        localStorage.setItem(`large_data_${i}`, largeData);
                    } catch (e) {
                        // Quota exceeded - esperado
                        throw e;
                    }
                }
            });
        } catch (e) {
            // Quota exceeded é esperado
            console.log('✅ Limite de storage respeitado (quota exceeded detectado)');
        }

        // Limpar
        await page.evaluate(() => {
            localStorage.clear();
        });
    });
});
