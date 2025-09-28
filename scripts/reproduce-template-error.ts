import { chromium } from 'playwright';

async function main() {
    const funnelId = process.argv[2] ?? 'funnel_1759079823724_u68cv8hca';
    const url = `http://localhost:8080/editor/quiz21StepsComplete?funnel=${encodeURIComponent(funnelId)}`;

    console.log('🚀 Abrindo URL do editor para reprodução do erro:', url);

    const browser = await chromium.launch({ headless: true });
    const page = await browser.newPage();

    page.on('console', (msg) => {
        const location = msg.location();
        const locationInfo = location?.url ? ` (${location.url}:${location.lineNumber}:${location.columnNumber})` : '';
        console.log(`🖥️  console.${msg.type()}${locationInfo}:`, msg.text());
    });

    page.on('pageerror', (error) => {
        console.error('🔥 pageerror capturado:', error);
    });

    page.on('requestfailed', (request) => {
        console.warn('⚠️  requestfailed:', request.url(), request.failure()?.errorText);
    });

    try {
        const response = await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 15000 });
        console.log('🌐 Status inicial da navegação:', response?.status());
    } catch (error) {
        console.error('❌ Erro ao navegar para a página:', error);
    }

    try {
        await page.waitForLoadState('networkidle', { timeout: 15000 });
        console.log('⏱️  Estado networkidle alcançado.');
    } catch (error) {
        console.warn('⌛ Timeout ao aguardar networkidle:', error);
    }

    // Espera adicional para componentes client-side
    await page.waitForTimeout(3000);

    const errorBanner = await page.locator('text=Erro no Template');
    const hasErrorBanner = await errorBanner.count();
    console.log('🧪 Banner "Erro no Template" encontrado?', hasErrorBanner > 0);

    const lastTemplateError = await page.evaluate(() => (window as any)?.__LAST_TEMPLATE_ERROR__ ?? null);
    console.log('📦 window.__LAST_TEMPLATE_ERROR__:', lastTemplateError);

    const stageLocator = page.locator('[data-testid="step-navigator-item"]');
    const stageCount = await stageLocator.count().catch(() => 0);
    console.log('📊 Quantidade de etapas detectadas no StepNavigator:', stageCount);

    if (stageCount > 0) {
        const stageMetadata = await stageLocator.evaluateAll((elements) =>
            elements.map((element) => ({
                id: element.getAttribute('data-step-id') ?? undefined,
                order: Number(element.getAttribute('data-step-order') ?? NaN)
            }))
        );
        console.log('🗂️  Metadados das etapas detectadas:', stageMetadata);
    } else {
        console.warn('⚠️  Nenhuma etapa encontrada via [data-testid="step-navigator-item"].');
    }

    await browser.close();
    console.log('✅ Browser fechado.');
}

main().catch((error) => {
    console.error('❌ Erro inesperado durante a execução do script:', error);
    process.exit(1);
});
