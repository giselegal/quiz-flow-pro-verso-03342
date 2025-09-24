import { expect, type Page, type Locator } from '@playwright/test';
import { faker } from '@faker-js/faker';

/**
 * 🧪 TEST UTILS - UTILITÁRIOS DE TESTE
 * 
 * Funções auxiliares para simulação de dados e validações
 */

// ========================================
// 📊 DATA SIMULATION UTILS
// ========================================

export class TestDataGenerator {

    /**
     * 🎯 Gera dados de funil completo
     */
    static generateFunnelData(overrides: Partial<FunnelData> = {}): FunnelData {
        return {
            id: faker.string.uuid(),
            title: faker.lorem.words(3),
            description: faker.lorem.paragraph(),
            steps: Array.from({ length: 5 }, () => this.generateStepData()),
            createdAt: faker.date.recent(),
            updatedAt: faker.date.recent(),
            userId: faker.string.uuid(),
            isPublished: faker.datatype.boolean(),
            tags: faker.lorem.words(3).split(' '),
            ...overrides
        };
    }

    /**
     * 📝 Gera dados de step
     */
    static generateStepData(overrides: Partial<StepData> = {}): StepData {
        return {
            id: faker.string.uuid(),
            title: faker.lorem.words(2),
            type: faker.helpers.arrayElement(['question', 'result', 'info', 'form']),
            content: faker.lorem.paragraphs(2),
            order: faker.number.int({ min: 1, max: 20 }),
            required: faker.datatype.boolean(),
            validationRules: this.generateValidationRules(),
            ...overrides
        };
    }

    /**
     * ✅ Gera regras de validação
     */
    static generateValidationRules(): ValidationRule[] {
        return [
            {
                type: 'required',
                message: 'Este campo é obrigatório',
                active: true
            },
            {
                type: 'minLength',
                value: faker.number.int({ min: 1, max: 10 }),
                message: 'Mínimo de caracteres requerido',
                active: faker.datatype.boolean()
            }
        ];
    }

    /**
     * 👤 Gera dados de usuário
     */
    static generateUserData(overrides: Partial<UserData> = {}): UserData {
        return {
            id: faker.string.uuid(),
            email: faker.internet.email(),
            name: faker.person.fullName(),
            role: faker.helpers.arrayElement(['admin', 'editor', 'viewer']),
            avatar: faker.image.avatar(),
            createdAt: faker.date.past(),
            lastLogin: faker.date.recent(),
            ...overrides
        };
    }

    /**
     * 📊 Gera dados de performance
     */
    static generatePerformanceMetrics(): PerformanceMetrics {
        return {
            renderTime: faker.number.int({ min: 50, max: 2000 }),
            memoryUsage: faker.number.int({ min: 20, max: 90 }),
            bundleSize: faker.number.float({ min: 0.5, max: 5.0, fractionDigits: 2 }),
            cacheHitRate: faker.number.int({ min: 40, max: 95 }),
            networkLatency: faker.number.int({ min: 10, max: 500 }),
            userInteractionLatency: faker.number.int({ min: 5, max: 100 }),
            errorRate: faker.number.float({ min: 0, max: 5, fractionDigits: 2 }),
            userEngagement: faker.number.int({ min: 60, max: 100 })
        };
    }
}

// ========================================
// 🎯 PAGE INTERACTION UTILS
// ========================================

export class PageUtils {

    /**
     * ⏳ Aguarda elemento aparecer com timeout customizado
     */
    static async waitForElement(
        page: Page,
        selector: string,
        timeout: number = 5000
    ): Promise<Locator> {
        const element = page.locator(selector);
        await element.waitFor({ timeout });
        return element;
    }

    /**
     * 📝 Preenche formulário com dados
     */
    static async fillForm(page: Page, formData: Record<string, string>) {
        for (const [field, value] of Object.entries(formData)) {
            const selector = `[data-testid="${field}"], [name="${field}"], #${field}`;
            await page.fill(selector, value);
        }
    }

    /**
     * 📊 Simula interações de usuário realistas
     */
    static async simulateUserBehavior(page: Page, actions: UserAction[]) {
        for (const action of actions) {
            await page.waitForTimeout(faker.number.int({ min: 100, max: 1000 }));

            switch (action.type) {
                case 'click':
                    await page.click(action.selector);
                    break;
                case 'fill':
                    await page.fill(action.selector, action.value || '');
                    break;
                case 'scroll':
                    await page.evaluate(() => window.scrollBy(0, 200));
                    break;
                case 'hover':
                    await page.hover(action.selector);
                    break;
            }
        }
    }

    /**
     * 📱 Testa responsividade
     */
    static async testResponsiveBreakpoints(page: Page, breakpoints: Breakpoint[]) {
        const results: ResponsiveTestResult[] = [];

        for (const breakpoint of breakpoints) {
            await page.setViewportSize(breakpoint.size);
            await page.waitForTimeout(500); // Aguarda adaptação

            const isVisible = await page.locator(breakpoint.testSelector).isVisible();
            const classAttribute = breakpoint.expectedClass
                ? await page.locator(breakpoint.testSelector).getAttribute('class')
                : null;
            const hasExpectedClass = classAttribute?.includes(breakpoint.expectedClass || '') ?? true;

            results.push({
                name: breakpoint.name,
                passed: isVisible && (hasExpectedClass || false),
                viewport: breakpoint.size
            });
        }

        return results;
    }
}

// ========================================
// ✅ VALIDATION UTILS  
// ========================================

export class ValidationUtils {

    /**
     * 🎯 Valida performance metrics
     */
    static async validatePerformance(page: Page): Promise<PerformanceTestResult> {
        const metrics = await page.evaluate(() => {
            const perf = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
            return {
                loadTime: perf.loadEventEnd - perf.loadEventStart,
                domContentLoaded: perf.domContentLoadedEventEnd - perf.domContentLoadedEventStart,
                firstPaint: performance.getEntriesByName('first-paint')[0]?.startTime || 0,
                firstContentfulPaint: performance.getEntriesByName('first-contentful-paint')[0]?.startTime || 0
            };
        });

        return {
            loadTime: metrics.loadTime,
            domContentLoaded: metrics.domContentLoaded,
            firstPaint: metrics.firstPaint,
            firstContentfulPaint: metrics.firstContentfulPaint,
            passed: {
                loadTime: metrics.loadTime < 3000,
                domContentLoaded: metrics.domContentLoaded < 1500,
                firstPaint: metrics.firstPaint < 1000,
                firstContentfulPaint: metrics.firstContentfulPaint < 1500
            }
        };
    }

    /**
     * 🔒 Valida segurança de inputs
     */
    static validateInputSecurity(input: string): SecurityValidation {
        const threats = {
            xss: /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi.test(input),
            sqlInjection: /(union|select|insert|delete|update|drop|create|alter|exec|execute)/i.test(input),
            htmlInjection: /<[^>]+>/g.test(input),
            jsInjection: /(javascript:|on\w+\s*=)/i.test(input)
        };

        return {
            isSecure: !Object.values(threats).some(Boolean),
            threats: Object.entries(threats)
                .filter(([_, detected]) => detected)
                .map(([type]) => type),
            sanitizedInput: input
                .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
                .replace(/[<>]/g, '')
                .trim()
        };
    }

    /**
     * 🎨 Valida acessibilidade
     */
    static async validateAccessibility(page: Page): Promise<AccessibilityResult> {
        const axeResults = await page.evaluate(() => {
            // Simulação de testes de acessibilidade
            const elements = document.querySelectorAll('[data-testid]');
            const issues: AccessibilityIssue[] = [];

            elements.forEach((el, index) => {
                // Verifica alt text em imagens
                if (el.tagName === 'IMG' && !el.getAttribute('alt')) {
                    issues.push({
                        type: 'missing-alt-text',
                        element: `img:nth-child(${index + 1})`,
                        severity: 'warning',
                        message: 'Image missing alt text'
                    });
                }

                // Verifica labels em inputs
                if (el.tagName === 'INPUT' && el.getAttribute('type') !== 'hidden') {
                    const hasLabel = document.querySelector(`label[for="${el.id}"]`) ||
                        el.getAttribute('aria-label') ||
                        el.getAttribute('aria-labelledby');

                    if (!hasLabel) {
                        issues.push({
                            type: 'missing-label',
                            element: `input:nth-child(${index + 1})`,
                            severity: 'error',
                            message: 'Form input missing label'
                        });
                    }
                }
            });

            return {
                issues,
                passed: issues.filter(i => i.severity === 'error').length === 0
            };
        });

        return axeResults;
    }
}

// ========================================
// 📊 MOCK DATA UTILS
// ========================================

export class MockDataUtils {

    /**
     * 🎭 Cria mock de API responses
     */
    static createAPIResponse<T>(data: T, options: APIResponseOptions = {}): APIResponse<T> {
        return {
            success: options.success ?? true,
            data,
            message: options.message || 'Success',
            timestamp: new Date().toISOString(),
            requestId: faker.string.uuid(),
            ...(options.pagination && { pagination: options.pagination })
        };
    }

    /**
     * 🔧 Setup de mocks para testes
     */
    static async setupMocks(page: Page, mocks: MockConfig[]) {
        for (const mock of mocks) {
            await page.route(mock.url, route => {
                const response = mock.response || { success: true };
                route.fulfill({
                    status: mock.status || 200,
                    contentType: 'application/json',
                    body: JSON.stringify(response)
                });
            });
        }
    }

    /**
     * ⏰ Simula loading states
     */
    static async simulateLoading(page: Page, selector: string, duration: number = 2000) {
        await page.addStyleTag({
            content: `
        ${selector} {
          opacity: 0.5;
          pointer-events: none;
        }
        ${selector}::after {
          content: "Loading...";
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
        }
      `
        });

        await page.waitForTimeout(duration);

        await page.addStyleTag({
            content: `
        ${selector} {
          opacity: 1;
          pointer-events: auto;
        }
        ${selector}::after {
          display: none;
        }
      `
        });
    }
}

// ========================================
// 📱 DEVICE SIMULATION UTILS
// ========================================

export class DeviceUtils {

    static readonly COMMON_DEVICES = {
        mobile: { width: 375, height: 667 },
        tablet: { width: 768, height: 1024 },
        desktop: { width: 1920, height: 1080 },
        ultrawide: { width: 2560, height: 1440 }
    };

    /**
     * 📱 Testa em múltiplos dispositivos
     */
    static async testMultipleDevices(
        page: Page,
        testFn: (device: DeviceConfig) => Promise<void>
    ) {
        for (const [name, viewport] of Object.entries(this.COMMON_DEVICES)) {
            await page.setViewportSize(viewport);
            await page.waitForTimeout(500);

            try {
                await testFn({ name, viewport });
            } catch (error) {
                const errorMessage = error instanceof Error ? error.message : 'Unknown error';
                throw new Error(`Test failed on ${name}: ${errorMessage}`);
            }
        }
    }
}

// ========================================
// 🎯 TYPE DEFINITIONS
// ========================================

interface FunnelData {
    id: string;
    title: string;
    description: string;
    steps: StepData[];
    createdAt: Date;
    updatedAt: Date;
    userId: string;
    isPublished: boolean;
    tags: string[];
}

interface StepData {
    id: string;
    title: string;
    type: string;
    content: string;
    order: number;
    required: boolean;
    validationRules: ValidationRule[];
}

interface ValidationRule {
    type: string;
    value?: any;
    message: string;
    active: boolean;
}

interface UserData {
    id: string;
    email: string;
    name: string;
    role: string;
    avatar: string;
    createdAt: Date;
    lastLogin: Date;
}

interface PerformanceMetrics {
    renderTime: number;
    memoryUsage: number;
    bundleSize: number;
    cacheHitRate: number;
    networkLatency: number;
    userInteractionLatency: number;
    errorRate: number;
    userEngagement: number;
}

interface UserAction {
    type: 'click' | 'fill' | 'scroll' | 'hover';
    selector: string;
    value?: string;
}

interface Breakpoint {
    name: string;
    size: { width: number; height: number };
    testSelector: string;
    expectedClass?: string;
}

interface ResponsiveTestResult {
    name: string;
    passed: boolean;
    viewport: { width: number; height: number };
}

interface PerformanceTestResult {
    loadTime: number;
    domContentLoaded: number;
    firstPaint: number;
    firstContentfulPaint: number;
    passed: {
        loadTime: boolean;
        domContentLoaded: boolean;
        firstPaint: boolean;
        firstContentfulPaint: boolean;
    };
}

interface SecurityValidation {
    isSecure: boolean;
    threats: string[];
    sanitizedInput: string;
}

interface AccessibilityIssue {
    type: string;
    element: string;
    severity: 'error' | 'warning' | 'info';
    message: string;
}

interface AccessibilityResult {
    issues: AccessibilityIssue[];
    passed: boolean;
}

interface APIResponse<T> {
    success: boolean;
    data: T;
    message: string;
    timestamp: string;
    requestId: string;
    pagination?: {
        page: number;
        limit: number;
        total: number;
    };
}

interface APIResponseOptions {
    success?: boolean;
    message?: string;
    pagination?: {
        page: number;
        limit: number;
        total: number;
    };
}

interface MockConfig {
    url: string;
    status?: number;
    response?: any;
}

interface DeviceConfig {
    name: string;
    viewport: { width: number; height: number };
}

export {
    type FunnelData,
    type StepData,
    type UserData,
    type PerformanceMetrics,
    type UserAction,
    type Breakpoint,
    type ResponsiveTestResult,
    type PerformanceTestResult,
    type SecurityValidation,
    type AccessibilityResult,
    type DeviceConfig
};