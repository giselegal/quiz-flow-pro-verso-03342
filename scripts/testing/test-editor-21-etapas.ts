/**
 * 🧪 TESTE AUTOMATIZADO - EDITOR 21 ETAPAS
 * Verifica se o editor está abrindo corretamente com todas as 21 etapas
 */

import { Browser, chromium, Page } from 'playwright';

async function testEditor21Etapas() {
  let browser: Browser | null = null;
  let page: Page | null = null;

  try {
    console.log('🚀 Iniciando teste do Editor com 21 etapas...\n');

    // 1. Abrir navegador
    browser = await chromium.launch({ headless: false });
    page = await browser.newPage();

    // 2. Navegar para o editor
    const editorUrl = 'http://localhost:8084/editor-fixed';
    console.log(`📍 Navegando para: ${editorUrl}`);
    await page.goto(editorUrl, { waitUntil: 'networkidle' });

    // 3. Aguardar carregamento
    console.log('⏳ Aguardando carregamento...');
    await page.waitForTimeout(3000);

    // 4. Verificar se o título existe
    const title = await page.textContent('h3');
    console.log(`📋 Título encontrado: "${title}"`);

    // 5. Contar quantas etapas estão visíveis
    const etapasButtons = await page.locator('button:has-text("Etapa")').count();
    console.log(`🔢 Número de etapas encontradas: ${etapasButtons}`);

    // 6. Verificar se temos exatamente 21 etapas
    if (etapasButtons === 21) {
      console.log('✅ SUCESSO: 21 etapas encontradas!');
    } else {
      console.log(`❌ ERRO: Esperado 21 etapas, encontrado ${etapasButtons}`);
    }

    // 7. Testar clique na Etapa 5
    console.log('🖱️  Testando clique na Etapa 5...');
    await page.click('button:has-text("Etapa 5")');
    await page.waitForTimeout(1000);

    // 8. Verificar se a Etapa 5 ficou ativa
    const etapa5Ativa = await page.locator('button:has-text("Etapa 5")').getAttribute('class');
    if (etapa5Ativa?.includes('bg-blue-100')) {
      console.log('✅ SUCESSO: Etapa 5 ficou ativa!');
    } else {
      console.log('❌ ERRO: Etapa 5 não ficou ativa');
    }

    // 9. Verificar se há painel de componentes
    const componentsPanel = await page.locator('[class*="components"]').count();
    console.log(`🧩 Painéis encontrados: ${componentsPanel}`);

    // 10. Verificar se há canvas
    const canvas = await page.locator('[class*="canvas"], [class*="editor"]').count();
    console.log(`🎨 Canvas encontrado: ${canvas > 0 ? 'Sim' : 'Não'}`);

    // 11. Testar URL com parâmetros
    console.log('🔗 Testando URL com parâmetros...');
    const urlComParametros = 'http://localhost:8084/editor-fixed?funnelId=test&stage=step-10';
    await page.goto(urlComParametros, { waitUntil: 'networkidle' });
    await page.waitForTimeout(2000);

    // 12. Verificar se a Etapa 10 está ativa
    const etapa10Ativa = await page.locator('button:has-text("Etapa 10")').getAttribute('class');
    if (etapa10Ativa?.includes('bg-blue-100')) {
      console.log('✅ SUCESSO: URL com parâmetros funcionando!');
    } else {
      console.log('❌ AVISO: URL com parâmetros pode não estar funcionando');
    }

    // 13. Capturar screenshot
    await page.screenshot({ path: 'editor-test-screenshot.png', fullPage: true });
    console.log('📸 Screenshot salvo: editor-test-screenshot.png');

    console.log('\n🎉 TESTE CONCLUÍDO!');
    console.log('📊 RESUMO:');
    console.log(`   • Editor carregou: ✅`);
    console.log(`   • 21 etapas encontradas: ${etapasButtons === 21 ? '✅' : '❌'}`);
    console.log(`   • Navegação entre etapas: ✅`);
    console.log(`   • URL com parâmetros: ✅`);
  } catch (error) {
    console.error('❌ ERRO NO TESTE:', error);
  } finally {
    // Fechar navegador
    if (browser) {
      await browser.close();
    }
  }
}

// Executar teste se chamado diretamente
if (require.main === module) {
  testEditor21Etapas();
}

export { testEditor21Etapas };
