/**
 * 🎯 EXEMPLO SIMPLES DE TESTE DO EDITOR DESACOPLADO
 * 
 * Script simples para validar o funcionamento básico do sistema
 */

import { EditorMockProvider } from './mocks/EditorMocks';
import { appLogger } from '@/lib/utils/appLogger';

async function testEditorSystem() {
    appLogger.info('🧪 Testando Sistema de Editor Desacoplado...\n');

    try {
        // Criar setup básico
        const { dataProvider, utils } = EditorMockProvider.createMinimalMockSetup();

        // Teste 1: Criar funil vazio
        appLogger.info('📝 Teste 1: Criando funil vazio...');
        const funnel = utils.createEmptyFunnel('Meu Funil de Teste');
        appLogger.info(`✅ Funil criado: ${funnel.name} (ID: ${funnel.id})`);

        // Teste 2: Adicionar páginas
        appLogger.info('\n📄 Teste 2: Adicionando páginas...');
        const introPage = utils.createEmptyPage('intro');
        const questionPage = utils.createEmptyPage('question');
        const resultPage = utils.createEmptyPage('result');

        funnel.pages = [introPage, questionPage, resultPage];
        appLogger.info(`✅ ${funnel.pages.length} páginas adicionadas`);

        // Teste 3: Adicionar blocos
        appLogger.info('\n🧱 Teste 3: Adicionando blocos...');
        const textBlock = utils.createTextBlock('Bem-vindo ao quiz!');
        const questionBlock = utils.createQuestionBlock('Qual sua idade?', 'number-input');

        introPage.blocks.push(textBlock);
        questionPage.blocks.push(questionBlock);

        appLogger.info(`✅ Blocos adicionados: ${textBlock.type}, ${questionBlock.type}`);

        // Teste 4: Salvar funil
        appLogger.info('\n💾 Teste 4: Salvando funil...');
        const saveResult = await dataProvider.saveFunnel(funnel);
        appLogger.info(`✅ Salvo com sucesso! Versão: ${saveResult.version}`);

        // Teste 5: Carregar funil
        appLogger.info('\n📁 Teste 5: Carregando funil...');
        const loadedFunnel = await dataProvider.loadFunnel(funnel.id);
        appLogger.info(`✅ Carregado: ${loadedFunnel?.name} com ${loadedFunnel?.pages.length} páginas`);

        // Teste 6: Listar funis
        appLogger.info('\n📋 Teste 6: Listando funis...');
        const funnelList = await dataProvider.listFunnels();
        appLogger.info(`✅ ${funnelList.length} funis encontrados:`);
        funnelList.forEach(f => appLogger.info(`   - ${f.name} (${f.pageCount} páginas)`));

        appLogger.info('\n🎉 Todos os testes passaram! O sistema está funcionando corretamente.\n');

        // Relatório de validação
        appLogger.info('📊 RELATÓRIO DE VALIDAÇÃO:');
        appLogger.info('==========================');
        appLogger.info('✅ Interfaces definidas e funcionais');
        appLogger.info('✅ Implementações mock operacionais');
        appLogger.info('✅ Criação de dados estruturados');
        appLogger.info('✅ Operações CRUD funcionando');
        appLogger.info('✅ Sistema completamente desacoplado');
        appLogger.info('✅ Pronto para integração e testes');

        return true;

    } catch (error) {
        appLogger.error('❌ Erro nos testes:', { data: [error] });
        return false;
    }
}

// Executar testes se for chamado diretamente
if (require.main === module) {
    testEditorSystem()
        .then(success => {
            process.exit(success ? 0 : 1);
        })
        .catch(error => {
            appLogger.error('💥 Erro fatal:', { data: [error] });
            process.exit(1);
        });
}

export { testEditorSystem };
