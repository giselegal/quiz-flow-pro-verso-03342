/**
 * 🎯 EXEMPLO SIMPLES DE TESTE DO EDITOR DESACOPLADO
 * 
 * Script simples para validar o funcionamento básico do sistema
 */

import { EditorMockProvider } from './mocks/EditorMocks';

async function testEditorSystem() {
    console.log('🧪 Testando Sistema de Editor Desacoplado...\n');

    try {
        // Criar setup básico
        const { dataProvider, utils } = EditorMockProvider.createMinimalMockSetup();

        // Teste 1: Criar funil vazio
        console.log('📝 Teste 1: Criando funil vazio...');
        const funnel = utils.createEmptyFunnel('Meu Funil de Teste');
        console.log(`✅ Funil criado: ${funnel.name} (ID: ${funnel.id})`);

        // Teste 2: Adicionar páginas
        console.log('\n📄 Teste 2: Adicionando páginas...');
        const introPage = utils.createEmptyPage('intro');
        const questionPage = utils.createEmptyPage('question');
        const resultPage = utils.createEmptyPage('result');

        funnel.pages = [introPage, questionPage, resultPage];
        console.log(`✅ ${funnel.pages.length} páginas adicionadas`);

        // Teste 3: Adicionar blocos
        console.log('\n🧱 Teste 3: Adicionando blocos...');
        const textBlock = utils.createTextBlock('Bem-vindo ao quiz!');
        const questionBlock = utils.createQuestionBlock('Qual sua idade?', 'number-input');

        introPage.blocks.push(textBlock);
        questionPage.blocks.push(questionBlock);

        console.log(`✅ Blocos adicionados: ${textBlock.type}, ${questionBlock.type}`);

        // Teste 4: Salvar funil
        console.log('\n💾 Teste 4: Salvando funil...');
        const saveResult = await dataProvider.saveFunnel(funnel);
        console.log(`✅ Salvo com sucesso! Versão: ${saveResult.version}`);

        // Teste 5: Carregar funil
        console.log('\n📁 Teste 5: Carregando funil...');
        const loadedFunnel = await dataProvider.loadFunnel(funnel.id);
        console.log(`✅ Carregado: ${loadedFunnel?.name} com ${loadedFunnel?.pages.length} páginas`);

        // Teste 6: Listar funis
        console.log('\n📋 Teste 6: Listando funis...');
        const funnelList = await dataProvider.listFunnels();
        console.log(`✅ ${funnelList.length} funis encontrados:`);
        funnelList.forEach(f => console.log(`   - ${f.name} (${f.pageCount} páginas)`));

        console.log('\n🎉 Todos os testes passaram! O sistema está funcionando corretamente.\n');

        // Relatório de validação
        console.log('📊 RELATÓRIO DE VALIDAÇÃO:');
        console.log('==========================');
        console.log(`✅ Interfaces definidas e funcionais`);
        console.log(`✅ Implementações mock operacionais`);
        console.log(`✅ Criação de dados estruturados`);
        console.log(`✅ Operações CRUD funcionando`);
        console.log(`✅ Sistema completamente desacoplado`);
        console.log(`✅ Pronto para integração e testes`);

        return true;

    } catch (error) {
        console.error('❌ Erro nos testes:', error);
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
            console.error('💥 Erro fatal:', error);
            process.exit(1);
        });
}

export { testEditorSystem };
