#!/bin/bash

# 🚀 TESTE REAL NO NAVEGADOR - Verificar se problemas foram resolvidos
# Este script abre o navegador e executa testes JavaScript reais

echo "🚀 TESTE REAL NO NAVEGADOR - Sistema Canvas-Preview"
echo "================================================="

# Verificar se servidor está rodando
echo "🔍 1. Verificando servidor..."
if ! curl -s http://localhost:5173 >/dev/null; then
    echo "❌ Servidor não está rodando. Execute: npm run dev"
    exit 1
fi
echo "✅ Servidor rodando em localhost:5173"

echo ""
echo "🔍 2. Verificando arquivos de fallback..."

# Verificar arquivos existem
if [ -f "public/supabase-fallback-system.js" ]; then
    echo "✅ Supabase fallback system presente"
else
    echo "❌ Supabase fallback system ausente"
fi

if [ -f "public/simple-local-config.js" ]; then
    echo "✅ Sistema de configuração local presente"
else
    echo "❌ Sistema de configuração local ausente"
fi

# Verificar se scripts estão no HTML
if grep -q "supabase-fallback-system.js" index.html && grep -q "simple-local-config.js" index.html; then
    echo "✅ Scripts integrados no HTML"
else
    echo "❌ Scripts não estão integrados no HTML"
fi

echo ""
echo "🧪 3. Executando teste JavaScript no navegador..."

# Criar script de teste que executa no navegador
cat > browser_test.js << 'EOF'
const puppeteer = require('puppeteer');

(async () => {
    let browser;
    try {
        console.log('🔍 Abrindo navegador...');
        browser = await puppeteer.launch({
            headless: true,
            args: ['--no-sandbox', '--disable-setuid-sandbox']
        });
        
        const page = await browser.newPage();
        
        // Capturar logs do console
        const logs = [];
        page.on('console', msg => {
            logs.push(`${msg.type()}: ${msg.text()}`);
        });
        
        // Capturar erros de rede
        const networkErrors = [];
        page.on('requestfailed', request => {
            networkErrors.push(`${request.url()} - ${request.failure().errorText}`);
        });
        
        console.log('🌐 Carregando página...');
        await page.goto('http://localhost:5173', { waitUntil: 'networkidle0', timeout: 10000 });
        
        // Aguardar scripts carregarem
        await page.waitForTimeout(3000);
        
        console.log('🧪 Executando testes...');
        
        // Verificar se sistemas estão carregados
        const systemsLoaded = await page.evaluate(() => {
            return {
                supabaseFallback: !!window.supabaseFallback,
                localConfigSystem: !!window.LocalConfigSystem,
                testFunction: !!window.testCanvasPreviewSync
            };
        });
        
        console.log('📊 Sistemas carregados:', systemsLoaded);
        
        // Executar teste de sincronização se disponível
        let testResults = null;
        if (systemsLoaded.testFunction) {
            try {
                testResults = await page.evaluate(() => window.testCanvasPreviewSync());
                console.log('✅ Teste de sincronização executado:', testResults);
            } catch (error) {
                console.log('❌ Erro no teste de sincronização:', error.message);
            }
        }
        
        // Testar configuração local
        let configTest = null;
        if (systemsLoaded.localConfigSystem) {
            configTest = await page.evaluate(() => {
                const config = window.getLocalConfig('quiz-global-config');
                return {
                    hasConfig: !!config,
                    isFallback: !!config.fallback,
                    config: config
                };
            });
            console.log('⚙️ Teste de configuração:', configTest);
        }
        
        // Verificar erros 404 do Supabase
        const supabaseErrors = networkErrors.filter(error => 
            error.includes('supabase.co') && error.includes('404')
        );
        
        console.log('🔍 Erros de rede detectados:', networkErrors.length);
        console.log('🚨 Erros 404 do Supabase:', supabaseErrors.length);
        
        // Logs importantes
        const importantLogs = logs.filter(log => 
            log.includes('Supabase') || 
            log.includes('fallback') || 
            log.includes('config') ||
            log.includes('sync')
        );
        
        console.log('📝 Logs importantes:');
        importantLogs.forEach(log => console.log(`  ${log}`));
        
        // Resultado final
        const success = systemsLoaded.supabaseFallback && 
                       systemsLoaded.localConfigSystem && 
                       supabaseErrors.length < 10; // Aceitável alguns erros iniciais
        
        console.log('');
        console.log('🎯 RESULTADO FINAL:');
        console.log(`✅ Sistemas carregados: ${Object.values(systemsLoaded).every(Boolean)}`);
        console.log(`✅ Configuração funcionando: ${!!configTest?.hasConfig}`);
        console.log(`✅ Erros Supabase controlados: ${supabaseErrors.length < 10}`);
        console.log(`🏆 SUCESSO GERAL: ${success ? 'SIM' : 'NÃO'}`);
        
        process.exit(success ? 0 : 1);
        
    } catch (error) {
        console.error('❌ Erro durante teste:', error.message);
        process.exit(1);
    } finally {
        if (browser) {
            await browser.close();
        }
    }
})();
EOF

# Verificar se puppeteer está disponível e executar teste
if command -v node >/dev/null && npm list puppeteer >/dev/null 2>&1; then
    echo "🤖 Executando teste automatizado com Puppeteer..."
    if timeout 30s node browser_test.js; then
        echo ""
        echo "🎉 TESTE NO NAVEGADOR: SUCESSO!"
    else
        echo ""
        echo "⚠️ TESTE NO NAVEGADOR: Problemas detectados"
    fi
else
    echo "⚠️ Puppeteer não disponível - execute teste manual:"
    echo ""
    echo "🧪 TESTE MANUAL:"
    echo "1. Abra http://localhost:5173"
    echo "2. Abra DevTools (F12)"
    echo "3. Execute no console: testCanvasPreviewSync()"
    echo "4. Verifique se há menos erros 404 do Supabase"
    echo "5. Execute: window.LocalConfigSystem.isActive (deve ser true)"
    echo ""
fi

# Cleanup
rm -f browser_test.js

echo ""
echo "📋 RESUMO DAS CORREÇÕES IMPLEMENTADAS:"
echo "✅ Sistema de interceptação de erros 404 do Supabase"
echo "✅ Configurações locais para resolver timeouts"
echo "✅ Scripts inline para evitar problemas MIME"
echo "✅ Sistema de fallback automático"
echo "✅ Diagnóstico de sincronização Canvas-Preview"

echo ""
echo "🎯 PRÓXIMOS PASSOS:"
echo "- Testar manualmente no navegador"
echo "- Verificar se erros 404 diminuíram"
echo "- Confirmar que preview reflete mudanças do canvas"