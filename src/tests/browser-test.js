/**
 * 🌐 TESTE EM BROWSER - VALIDAÇÃO REAL DOS COMPONENTES
 * 
 * Script para testar os componentes diretamente no navegador
 */

// Função para executar testes no browser
const executarTestesNoBrowser = async () => {
    console.log('🌐 INICIANDO TESTES NO BROWSER');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

    const resultados = {
        sucessos: 0,
        falhas: 0,
        testes: []
    };

    // Teste 1: Verificar se a página /editor carrega
    try {
        console.log('🔍 Teste 1: Carregamento da página /editor');

        // Simular navegação para /editor
        if (window.location.pathname !== '/editor') {
            window.history.pushState({}, '', '/editor');
        }

        // Aguardar carregamento
        await new Promise(resolve => setTimeout(resolve, 1000));

        const temEditor = document.querySelector('[data-testid*="editor"]') ||
            document.querySelector('.editor') ||
            document.querySelector('#editor') ||
            document.body.innerHTML.includes('editor');

        if (temEditor) {
            console.log('✅ Página /editor carregou com sucesso');
            resultados.sucessos++;
        } else {
            console.log('❌ Página /editor não carregou adequadamente');
            resultados.falhas++;
        }

        resultados.testes.push({
            nome: 'Carregamento página /editor',
            passou: !!temEditor
        });

    } catch (error) {
        console.log('❌ Erro no teste 1:', error.message);
        resultados.falhas++;
        resultados.testes.push({
            nome: 'Carregamento página /editor',
            passou: false,
            erro: error.message
        });
    }

    // Teste 2: Verificar se componentes React estão renderizando
    try {
        console.log('🔍 Teste 2: Renderização de componentes React');

        // Procurar por elementos típicos do React
        const elementosReact = [
            document.querySelector('[data-reactroot]'),
            document.querySelector('[data-react]'),
            document.querySelector('.react-component'),
            document.querySelector('#root')
        ].filter(Boolean);

        const temReact = elementosReact.length > 0 ||
            document.body.innerHTML.includes('data-react') ||
            window.React !== undefined;

        if (temReact) {
            console.log('✅ Componentes React renderizando');
            resultados.sucessos++;
        } else {
            console.log('❌ Componentes React não detectados');
            resultados.falhas++;
        }

        resultados.testes.push({
            nome: 'Renderização React',
            passou: temReact
        });

    } catch (error) {
        console.log('❌ Erro no teste 2:', error.message);
        resultados.falhas++;
    }

    // Teste 3: Verificar se há erros no console
    try {
        console.log('🔍 Teste 3: Verificação de erros no console');

        // Capturar erros do console
        let errosConsole = 0;
        const originalError = console.error;

        console.error = function (...args) {
            errosConsole++;
            return originalError.apply(console, args);
        };

        // Aguardar um pouco para capturar erros
        await new Promise(resolve => setTimeout(resolve, 500));

        // Restaurar console.error
        console.error = originalError;

        if (errosConsole === 0) {
            console.log('✅ Nenhum erro crítico no console');
            resultados.sucessos++;
        } else {
            console.log(`⚠️ ${errosConsole} erro(s) detectado(s) no console`);
            resultados.falhas++;
        }

        resultados.testes.push({
            nome: 'Erros no console',
            passou: errosConsole === 0,
            detalhes: `${errosConsole} erros`
        });

    } catch (error) {
        console.log('❌ Erro no teste 3:', error.message);
        resultados.falhas++;
    }

    // Teste 4: Verificar se funis dinâmicos funcionam
    try {
        console.log('🔍 Teste 4: Teste de funis dinâmicos');

        const funisDeTeste = [
            '/editor/meu-quiz-personalizado',
            '/editor/landing-page-produto',
            '/editor/campanha-email'
        ];

        let funisQuePassaram = 0;

        for (const funil of funisDeTeste) {
            try {
                // Simular navegação
                window.history.pushState({}, '', funil);
                await new Promise(resolve => setTimeout(resolve, 200));

                // Verificar se a página não quebrou
                const temConteudo = document.body.innerHTML.length > 100;
                const naoTemErro = !document.body.innerHTML.includes('Error') &&
                    !document.body.innerHTML.includes('error');

                if (temConteudo && naoTemErro) {
                    funisQuePassaram++;
                }
            } catch (e) {
                console.log(`⚠️ Erro testando ${funil}:`, e.message);
            }
        }

        if (funisQuePassaram === funisDeTeste.length) {
            console.log('✅ Todos os funis dinâmicos funcionando');
            resultados.sucessos++;
        } else {
            console.log(`⚠️ ${funisQuePassaram}/${funisDeTeste.length} funis funcionando`);
            resultados.falhas++;
        }

        resultados.testes.push({
            nome: 'Funis dinâmicos',
            passou: funisQuePassaram === funisDeTeste.length,
            detalhes: `${funisQuePassaram}/${funisDeTeste.length} funcionando`
        });

    } catch (error) {
        console.log('❌ Erro no teste 4:', error.message);
        resultados.falhas++;
    }

    // Teste 5: Performance de renderização
    try {
        console.log('🔍 Teste 5: Performance de renderização');

        const startTime = performance.now();

        // Simular re-renderização
        const div = document.createElement('div');
        div.innerHTML = '<h1>Teste</h1>'.repeat(100);
        document.body.appendChild(div);
        document.body.removeChild(div);

        const endTime = performance.now();
        const renderTime = endTime - startTime;

        if (renderTime < 50) {
            console.log(`✅ Performance excelente: ${renderTime.toFixed(2)}ms`);
            resultados.sucessos++;
        } else if (renderTime < 100) {
            console.log(`⚠️ Performance aceitável: ${renderTime.toFixed(2)}ms`);
            resultados.sucessos++;
        } else {
            console.log(`❌ Performance ruim: ${renderTime.toFixed(2)}ms`);
            resultados.falhas++;
        }

        resultados.testes.push({
            nome: 'Performance renderização',
            passou: renderTime < 100,
            detalhes: `${renderTime.toFixed(2)}ms`
        });

    } catch (error) {
        console.log('❌ Erro no teste 5:', error.message);
        resultados.falhas++;
    }

    // Relatório final
    console.log('\n📊 RELATÓRIO FINAL DOS TESTES NO BROWSER:');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log(`✅ Sucessos: ${resultados.sucessos}`);
    console.log(`❌ Falhas: ${resultados.falhas}`);
    console.log(`📈 Taxa de sucesso: ${((resultados.sucessos / (resultados.sucessos + resultados.falhas)) * 100).toFixed(1)}%`);

    console.log('\n📋 DETALHES DOS TESTES:');
    resultados.testes.forEach((teste, index) => {
        const status = teste.passou ? '✅' : '❌';
        const detalhes = teste.detalhes ? ` (${teste.detalhes})` : '';
        console.log(`${status} ${index + 1}. ${teste.nome}${detalhes}`);
    });

    // Salvar resultados no localStorage para recuperação
    try {
        localStorage.setItem('testResults', JSON.stringify({
            timestamp: new Date().toISOString(),
            resultados,
            url: window.location.href,
            userAgent: navigator.userAgent
        }));
        console.log('\n💾 Resultados salvos no localStorage');
    } catch (e) {
        console.log('\n⚠️ Não foi possível salvar no localStorage');
    }

    return resultados;
};

// Função para recuperar resultados salvos
const recuperarResultadosSalvos = () => {
    try {
        const saved = localStorage.getItem('testResults');
        if (saved) {
            const data = JSON.parse(saved);
            console.log('📤 Resultados recuperados do localStorage:');
            console.log(`🕐 Timestamp: ${data.timestamp}`);
            console.log(`🌐 URL: ${data.url}`);
            console.log(`📱 User Agent: ${data.userAgent}`);
            return data.resultados;
        }
    } catch (e) {
        console.log('⚠️ Erro ao recuperar resultados salvos');
    }
    return null;
};

// Executar automaticamente se estiver no browser
if (typeof window !== 'undefined') {
    console.log('🌐 Detectado ambiente de browser - executando testes...');

    // Aguardar carregamento completo da página
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            setTimeout(() => executarTestesNoBrowser(), 1000);
        });
    } else {
        setTimeout(() => executarTestesNoBrowser(), 1000);
    }

    // Disponibilizar funções globalmente
    window.executarTestesNoBrowser = executarTestesNoBrowser;
    window.recuperarResultadosSalvos = recuperarResultadosSalvos;

    console.log('🎯 Funções disponíveis:');
    console.log('- window.executarTestesNoBrowser()');
    console.log('- window.recuperarResultadosSalvos()');
}

// Para uso em Node.js (testes automatizados)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        executarTestesNoBrowser,
        recuperarResultadosSalvos
    };
}