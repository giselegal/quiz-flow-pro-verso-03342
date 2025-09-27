#!/usr/bin/env node

/**
 * 🚀 SCRIPT DE TESTE PRÁTICO DO FLUXO COMPLETO
 * 
 * Este script executa manualmente o teste do fluxo:
 * Dashboard → Seleção → Editor → Edição → Salvamento → Validação
 * 
 * Execute: node test-funnel-flow-manual.mjs
 */

import { chromium } from 'playwright';
import { setTimeout } from 'timers/promises';

const SERVER_URL = 'http://localhost:8080';
const WAIT_TIME = 2000; // 2 segundos entre ações

async function runFunnelFlowTest() {
    console.log('🚀 INICIANDO TESTE MANUAL DO FLUXO COMPLETO DOS FUNIS');
    console.log('='.repeat(60));

    let browser, page;

    try {
        // 1. Configurar browser
        console.log('\n1️⃣ CONFIGURANDO BROWSER...');
        browser = await chromium.launch({
            headless: false, // Modo visual para acompanhar
            slowMo: 1000     // Retardar ações para visualização
        });

        const context = await browser.newContext({
            viewport: { width: 1920, height: 1080 },
            recordVideo: { dir: './test-results/' }
        });

        page = await context.newPage();

        // Interceptar requisições para monitoramento
        page.on('response', response => {
            if (response.url().includes('supabase') || response.url().includes('/api/')) {
                console.log(`📡 Request: ${response.status()} ${response.request().method()} ${response.url()}`);
            }
        });

        console.log('✅ Browser configurado e pronto');

        // 2. Acessar Homepage
        console.log('\n2️⃣ ACESSANDO HOMEPAGE...');
        await page.goto(SERVER_URL);
        await page.waitForLoadState('domcontentloaded');
        console.log('✅ Homepage carregada');
        await setTimeout(WAIT_TIME);

        // 3. Navegar para Dashboard
        console.log('\n3️⃣ NAVEGANDO PARA DASHBOARD...');

        // Tentar várias formas de acessar o dashboard
        const dashboardSelectors = [
            '[data-testid="dashboard-link"]',
            'a[href*="dashboard"]',
            'text=Dashboard',
            'text=Meus Funis',
            'button:has-text("Dashboard")'
        ];

        let dashboardFound = false;
        for (const selector of dashboardSelectors) {
            try {
                if (await page.locator(selector).count() > 0) {
                    await page.click(selector);
                    dashboardFound = true;
                    break;
                }
            } catch (error) {
                // Continuar tentando
            }
        }

        if (!dashboardFound) {
            // Acessar diretamente via URL
            console.log('🔄 Acessando dashboard diretamente...');
            await page.goto(`${SERVER_URL}/dashboard`);
        }

        await page.waitForLoadState('domcontentloaded');
        console.log('✅ Dashboard acessado');
        await setTimeout(WAIT_TIME);

        // 4. Procurar funis existentes
        console.log('\n4️⃣ PROCURANDO FUNIS EXISTENTES...');

        // Aguardar carregamento dos funis
        await setTimeout(3000);

        const funnelSelectors = [
            '[data-testid="funnel-card"]',
            '.funnel-card',
            '[class*="funnel"]',
            'div:has-text("21 etapas")',
            'div:has-text("Quiz")'
        ];

        let funnelsFound = false;
        let funnelElement = null;

        for (const selector of funnelSelectors) {
            const elements = await page.locator(selector);
            if (await elements.count() > 0) {
                funnelElement = elements.first();
                funnelsFound = true;
                console.log(`✅ Encontrados funis com seletor: ${selector}`);
                break;
            }
        }

        if (!funnelsFound) {
            console.log('🆕 Nenhum funil encontrado, criando novo...');
            await createNewFunnel(page);
        }

        // 5. Acessar Editor do funil
        console.log('\n5️⃣ ACESSANDO EDITOR...');

        if (funnelElement) {
            await funnelElement.click();
            console.log('✅ Clicou no funil');
        } else {
            // Acessar editor diretamente
            await page.goto(`${SERVER_URL}/editor`);
            console.log('✅ Acessou editor diretamente');
        }

        await page.waitForLoadState('domcontentloaded');
        await setTimeout(3000); // Aguardar carregamento do editor

        console.log('✅ Editor carregado');

        // 6. Interagir com o Editor
        console.log('\n6️⃣ INTERAGINDO COM EDITOR...');

        // Aguardar elementos do editor
        const editorSelectors = [
            '[data-testid="modern-unified-editor"]',
            '[data-testid="editor-canvas"]',
            '.editor-canvas',
            '#editor-canvas'
        ];

        let editorLoaded = false;
        for (const selector of editorSelectors) {
            if (await page.locator(selector).count() > 0) {
                console.log(`✅ Editor carregado com seletor: ${selector}`);
                editorLoaded = true;
                break;
            }
        }

        if (!editorLoaded) {
            console.log('⚠️ Editor não detectado visualmente, continuando...');
        }

        await setTimeout(WAIT_TIME);

        // 7. Procurar e editar componentes
        console.log('\n7️⃣ PROCURANDO COMPONENTES PARA EDITAR...');

        const componentSelectors = [
            '[data-component-type]',
            '[data-testid*="component"]',
            '.component',
            '[class*="block"]',
            'div[draggable="true"]'
        ];

        let componentFound = false;
        for (const selector of componentSelectors) {
            const components = await page.locator(selector);
            if (await components.count() > 0) {
                console.log(`🎯 Componentes encontrados: ${await components.count()}`);

                // Clicar no primeiro componente
                await components.first().click();
                componentFound = true;
                console.log('✅ Componente selecionado');
                break;
            }
        }

        if (!componentFound) {
            console.log('🔄 Tentando adicionar componente...');
            await tryAddComponent(page);
        }

        await setTimeout(WAIT_TIME);

        // 8. Procurar painel de propriedades
        console.log('\n8️⃣ PROCURANDO PAINEL DE PROPRIEDADES...');

        const propertiesPanelSelectors = [
            '[data-testid="properties-panel"]',
            '[data-testid="dynamic-properties-panel"]',
            '.properties-panel',
            '[class*="properties"]',
            'div:has-text("Propriedades")'
        ];

        let propertiesFound = false;
        for (const selector of propertiesPanelSelectors) {
            if (await page.locator(selector).count() > 0) {
                console.log(`✅ Painel de propriedades encontrado: ${selector}`);
                propertiesFound = true;

                // Tentar editar algumas propriedades
                await editProperties(page);
                break;
            }
        }

        if (!propertiesFound) {
            console.log('⚠️ Painel de propriedades não encontrado');
        }

        await setTimeout(WAIT_TIME);

        // 9. Tentar salvar
        console.log('\n9️⃣ TENTANDO SALVAR ALTERAÇÕES...');

        const saveSelectors = [
            '[data-testid="save-button"]',
            'button:has-text("Salvar")',
            'button:has-text("Save")',
            '[title*="Salvar"]',
            '.save-btn'
        ];

        let saved = false;
        for (const selector of saveSelectors) {
            if (await page.locator(selector).count() > 0) {
                await page.click(selector);
                console.log(`✅ Clicou em salvar: ${selector}`);
                saved = true;

                // Aguardar possível notificação
                await setTimeout(2000);
                break;
            }
        }

        if (!saved) {
            console.log('⚠️ Botão de salvar não encontrado, usando Ctrl+S');
            await page.keyboard.press('Control+s');
        }

        // 10. Verificar se foi salvo
        console.log('\n🔟 VERIFICANDO SE FOI SALVO...');

        const notificationSelectors = [
            '[data-testid*="notification"]',
            '[data-testid*="success"]',
            '.notification',
            '[class*="toast"]',
            'div:has-text("salvo")',
            'div:has-text("sucesso")'
        ];

        let notificationFound = false;
        for (const selector of notificationSelectors) {
            if (await page.locator(selector).count() > 0) {
                const text = await page.locator(selector).textContent();
                console.log(`✅ Notificação encontrada: "${text}"`);
                notificationFound = true;
                break;
            }
        }

        if (!notificationFound) {
            console.log('⚠️ Nenhuma notificação de sucesso detectada');
        }

        // 11. Teste de recarregamento
        console.log('\n1️⃣1️⃣ TESTANDO PERSISTÊNCIA (RECARREGANDO)...');

        await page.reload();
        await page.waitForLoadState('domcontentloaded');
        await setTimeout(3000);

        console.log('✅ Página recarregada para testar persistência');

        // 12. Resultado final
        console.log('\n🎉 TESTE CONCLUÍDO!');
        console.log('='.repeat(60));
        console.log('📊 RESUMO DO TESTE:');
        console.log('  ✅ Browser configurado');
        console.log('  ✅ Homepage acessada');
        console.log('  ✅ Dashboard navegado');
        console.log(`  ${funnelsFound ? '✅' : '⚠️'} Funis encontrados`);
        console.log('  ✅ Editor acessado');
        console.log(`  ${editorLoaded ? '✅' : '⚠️'} Editor carregado`);
        console.log(`  ${componentFound ? '✅' : '⚠️'} Componentes detectados`);
        console.log(`  ${propertiesFound ? '✅' : '⚠️'} Propriedades encontradas`);
        console.log(`  ${saved ? '✅' : '⚠️'} Salvamento executado`);
        console.log(`  ${notificationFound ? '✅' : '⚠️'} Confirmação de salvamento`);
        console.log('  ✅ Teste de persistência executado');

        // Aguardar um pouco antes de fechar
        console.log('\n⏳ Aguardando 5 segundos antes de fechar...');
        await setTimeout(5000);

    } catch (error) {
        console.error('\n❌ ERRO DURANTE O TESTE:', error);
    } finally {
        // Fechar browser
        if (browser) {
            await browser.close();
            console.log('\n🔚 Browser fechado');
        }
    }
}

// Funções auxiliares
async function createNewFunnel(page) {
    const createSelectors = [
        '[data-testid="create-funnel"]',
        'button:has-text("Criar")',
        'button:has-text("Novo")',
        '[data-testid="new-funnel"]',
        '.create-btn'
    ];

    for (const selector of createSelectors) {
        if (await page.locator(selector).count() > 0) {
            await page.click(selector);
            console.log(`✅ Clicou em criar funil: ${selector}`);

            await setTimeout(2000);

            // Tentar preencher formulário
            try {
                await page.fill('input[placeholder*="nome" i]', 'Quiz de 21 Etapas - Teste');
                await page.fill('textarea', 'Funil criado para teste do fluxo completo');
                console.log('✅ Formulário preenchido');
            } catch (error) {
                console.log('⚠️ Formulário não encontrado');
            }

            break;
        }
    }
}

async function tryAddComponent(page) {
    const addSelectors = [
        '[data-testid="add-component"]',
        'button:has-text("Adicionar")',
        '[title*="Adicionar"]',
        '.add-btn',
        '+',
        'button:has-text("+")'
    ];

    for (const selector of addSelectors) {
        if (await page.locator(selector).count() > 0) {
            await page.click(selector);
            console.log(`✅ Tentou adicionar componente: ${selector}`);
            await setTimeout(1000);
            break;
        }
    }
}

async function editProperties(page) {
    // Tentar editar campos comuns
    const inputSelectors = [
        'input[type="text"]',
        'input[type="color"]',
        'textarea',
        'select',
        'input[type="number"]'
    ];

    for (const selector of inputSelectors) {
        const inputs = await page.locator(selector);
        if (await inputs.count() > 0) {
            const input = inputs.first();
            const tagName = await input.evaluate(el => el.tagName.toLowerCase());

            try {
                if (tagName === 'input') {
                    const type = await input.getAttribute('type');

                    if (type === 'text') {
                        await input.fill('Texto editado pelo teste');
                        console.log('✅ Campo de texto editado');
                    } else if (type === 'color') {
                        await input.fill('#FF6B6B');
                        console.log('✅ Cor editada');
                    } else if (type === 'number') {
                        await input.fill('100');
                        console.log('✅ Número editado');
                    }
                } else if (tagName === 'textarea') {
                    await input.fill('Descrição editada pelo teste automatizado');
                    console.log('✅ Textarea editada');
                }

                await setTimeout(500);
            } catch (error) {
                console.log(`⚠️ Erro ao editar campo: ${error.message}`);
            }
        }
    }

    // Tentar toggles/switches
    const toggleSelectors = [
        'input[type="checkbox"]',
        '[role="switch"]',
        '.toggle',
        '.switch'
    ];

    for (const selector of toggleSelectors) {
        if (await page.locator(selector).count() > 0) {
            await page.click(selector);
            console.log(`✅ Toggle alterado: ${selector}`);
            await setTimeout(500);
        }
    }
}

// Executar o teste
if (import.meta.url === `file://${process.argv[1]}`) {
    runFunnelFlowTest().catch(console.error);
}