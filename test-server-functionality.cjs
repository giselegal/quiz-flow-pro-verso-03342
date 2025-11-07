/**
 * 🌐 TESTE COMPLETO DO SERVIDOR E EDITOR
 * Valida se o sistema está funcionando end-to-end
 */

const http = require('http');
const { exec } = require('child_process');

console.log('🌐 TESTE COMPLETO DO SERVIDOR E EDITOR');
console.log('═'.repeat(60));

// Função para fazer requisição HTTP
function testHttpEndpoint(url, expectedContent = null) {
    return new Promise((resolve) => {
        const request = http.get(url, (response) => {
            let data = '';
            
            response.on('data', chunk => {
                data += chunk;
            });
            
            response.on('end', () => {
                const success = response.statusCode === 200;
                const contentMatch = expectedContent ? data.includes(expectedContent) : true;
                
                resolve({
                    success: success && contentMatch,
                    statusCode: response.statusCode,
                    contentLength: data.length,
                    hasExpectedContent: contentMatch,
                    data: data.slice(0, 200) // Primeiros 200 chars
                });
            });
        });
        
        request.on('error', (error) => {
            resolve({
                success: false,
                error: error.message,
                statusCode: 0,
                contentLength: 0
            });
        });
        
        request.setTimeout(5000, () => {
            request.destroy();
            resolve({
                success: false,
                error: 'Timeout',
                statusCode: 0,
                contentLength: 0
            });
        });
    });
}

// Função para executar comando e capturar output
function execCommand(command) {
    return new Promise((resolve) => {
        exec(command, { timeout: 10000 }, (error, stdout, stderr) => {
            resolve({
                success: !error,
                stdout: stdout.trim(),
                stderr: stderr.trim(),
                error: error ? error.message : null
            });
        });
    });
}

async function runTests() {
    console.log('🔍 Verificando servidor...');
    
    // Teste 1: Página principal
    console.log('\n📋 TESTE 1: Página Principal');
    console.log('─'.repeat(40));
    
    const mainPageTest = await testHttpEndpoint('http://localhost:8080', 'html');
    console.log(`🌐 Status: ${mainPageTest.statusCode}`);
    console.log(`📏 Tamanho: ${mainPageTest.contentLength} bytes`);
    console.log(`✅ Sucesso: ${mainPageTest.success ? 'SIM' : 'NÃO'}`);
    if (mainPageTest.data) {
        console.log(`📄 Conteúdo: ${mainPageTest.data.substring(0, 100)}...`);
    }
    
    // Teste 2: Editor
    console.log('\n📋 TESTE 2: Editor');
    console.log('─'.repeat(40));
    
    const editorTest = await testHttpEndpoint('http://localhost:8080/editor', 'html');
    console.log(`🌐 Status: ${editorTest.statusCode}`);
    console.log(`📏 Tamanho: ${editorTest.contentLength} bytes`);
    console.log(`✅ Sucesso: ${editorTest.success ? 'SIM' : 'NÃO'}`);
    
    // Teste 3: Editor com template
    console.log('\n📋 TESTE 3: Editor com Template');
    console.log('─'.repeat(40));
    
    const editorTemplateTest = await testHttpEndpoint(
        'http://localhost:8080/editor?template=quiz21StepsComplete', 
        'html'
    );
    console.log(`🌐 Status: ${editorTemplateTest.statusCode}`);
    console.log(`📏 Tamanho: ${editorTemplateTest.contentLength} bytes`);
    console.log(`✅ Sucesso: ${editorTemplateTest.success ? 'SIM' : 'NÃO'}`);
    
    // Teste 4: API de Templates
    console.log('\n📋 TESTE 4: API de Templates');
    console.log('─'.repeat(40));
    
    const templateApiTest = await testHttpEndpoint(
        'http://localhost:8080/api/templates/step-01-v3.json'
    );
    console.log(`🌐 Status: ${templateApiTest.statusCode}`);
    console.log(`📏 Tamanho: ${templateApiTest.contentLength} bytes`);
    console.log(`✅ Sucesso: ${templateApiTest.success ? 'SIM' : 'NÃO'}`);
    
    // Teste 5: Verificar processo do servidor
    console.log('\n📋 TESTE 5: Processo do Servidor');
    console.log('─'.repeat(40));
    
    const processTest = await execCommand('ps aux | grep -E "(vite|npm.*dev)" | grep -v grep');
    console.log(`🔍 Processos encontrados: ${processTest.stdout ? 'SIM' : 'NÃO'}`);
    if (processTest.stdout) {
        const lines = processTest.stdout.split('\n');
        console.log(`📊 Quantidade: ${lines.length} processo(s)`);
        lines.slice(0, 2).forEach(line => {
            console.log(`📋 ${line.substring(0, 80)}...`);
        });
    }
    
    // Teste 6: Porta em uso
    console.log('\n📋 TESTE 6: Porta 8080');
    console.log('─'.repeat(40));
    
    const portTest = await execCommand('netstat -tlnp | grep :8080 || ss -tlnp | grep :8080');
    console.log(`🔌 Porta 8080 em uso: ${portTest.success && portTest.stdout ? 'SIM' : 'NÃO'}`);
    if (portTest.stdout) {
        console.log(`📋 Info: ${portTest.stdout}`);
    }
    
    // Resumo
    console.log('\n' + '═'.repeat(60));
    console.log('📊 RESUMO DOS TESTES DE SERVIDOR');
    console.log('═'.repeat(60));
    
    const tests = [
        { name: 'Página Principal', result: mainPageTest.success },
        { name: 'Editor Base', result: editorTest.success },
        { name: 'Editor + Template', result: editorTemplateTest.success },
        { name: 'API Templates', result: templateApiTest.success },
        { name: 'Processo Servidor', result: processTest.success && processTest.stdout },
        { name: 'Porta 8080', result: portTest.success && portTest.stdout }
    ];
    
    const passedTests = tests.filter(t => t.result).length;
    const totalTests = tests.length;
    const successRate = Math.round((passedTests / totalTests) * 100);
    
    tests.forEach(test => {
        console.log(`${test.result ? '✅' : '❌'} ${test.name}`);
    });
    
    console.log(`\n📈 Taxa de sucesso: ${successRate}%`);
    
    if (successRate >= 80) {
        console.log('🟢 SERVIDOR FUNCIONANDO CORRETAMENTE!');
    } else if (successRate >= 50) {
        console.log('🟡 SERVIDOR PARCIALMENTE FUNCIONAL');
    } else {
        console.log('🔴 PROBLEMAS NO SERVIDOR DETECTADOS');
    }
    
    console.log('\n🎯 PRÓXIMOS PASSOS:');
    if (!mainPageTest.success) {
        console.log('• Verificar se o servidor está rodando: npm run dev');
    }
    if (!editorTest.success) {
        console.log('• Verificar roteamento do editor');
    }
    if (!templateApiTest.success) {
        console.log('• Verificar servimento de arquivos estáticos');
    }
    if (successRate >= 80) {
        console.log('• ✅ Sistema funcionando! Testar manualmente no navegador');
        console.log('• 🌐 Acesse: http://localhost:8080/editor?template=quiz21StepsComplete');
    }
    
    return successRate;
}

// Executar testes
runTests().then(successRate => {
    console.log('\n✨ TESTE DE SERVIDOR CONCLUÍDO!');
    process.exit(successRate >= 50 ? 0 : 1);
}).catch(error => {
    console.error('❌ Erro durante os testes:', error);
    process.exit(1);
});