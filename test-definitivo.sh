#!/bin/bash

echo "🔥 TESTE FINAL - FORÇAR PROPERTIES PANEL"
echo "=========================================="
echo ""

# Criar HTML de teste definitivo
cat > /workspaces/quiz-flow-pro-verso-03342/public/TESTE-DEFINITIVO.html << 'HTMLEOF'
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>🔥 TESTE DEFINITIVO</title>
    <script>
        console.log('🔥 ==========================================');
        console.log('🔥 TESTE DEFINITIVO - PROPERTIES PANEL');
        console.log('🔥 ==========================================');
        
        // 1. ATIVAR FLAG
        const chave = 'qm-editor:use-simple-properties';
        localStorage.setItem(chave, 'true');
        console.log('✅ 1. Flag ativada:', chave, '=', localStorage.getItem(chave));
        
        // 2. INTERCEPTAR CONSOLE
        const logs = [];
        const originalLog = console.log;
        console.log = function(...args) {
            const msg = args.map(a => typeof a === 'object' ? JSON.stringify(a, null, 2) : String(a)).join(' ');
            logs.push('[LOG] ' + msg);
            originalLog.apply(console, args);
        };
        
        const originalError = console.error;
        console.error = function(...args) {
            const msg = args.map(a => typeof a === 'object' ? JSON.stringify(a, null, 2) : String(a)).join(' ');
            logs.push('[ERROR] ' + msg);
            originalError.apply(console, args);
        };
        
        console.log('✅ 2. Console interceptado');
        
        // 3. VERIFICAR APÓS CARREGAMENTO
        window.addEventListener('load', () => {
            setTimeout(() => {
                console.log('🔍 3. Verificando estado após 5 segundos...');
                
                // Exportar logs
                const logText = logs.join('\n');
                console.log('📊 Total de logs capturados:', logs.length);
                
                // Salvar logs
                window.capturedLogs = logs;
                
                // Mostrar resumo
                const pontosCegos = logs.filter(l => l.includes('PONTO CEGO'));
                if (pontosCegos.length > 0) {
                    console.error('❌ PONTOS CEGOS DETECTADOS:', pontosCegos.length);
                    pontosCegos.forEach(pc => console.error('  ', pc));
                }
                
                const showProperties = logs.filter(l => l.includes('showProperties'));
                console.log('🔍 Logs com showProperties:', showProperties.length);
                showProperties.forEach(sp => console.log('  ', sp));
                
            }, 5000);
        });
        
        // 4. REDIRECIONAR
        console.log('🚀 4. Redirecionando para editor...');
        setTimeout(() => {
            window.location.href = '/editor?template=quiz21StepsComplete';
        }, 1000);
    </script>
</head>
<body style="background:#000;color:#0f0;font-family:monospace;padding:50px;text-align:center;">
    <h1>🔥 REDIRECIONANDO...</h1>
    <p>Aguarde. Logs serão capturados.</p>
    <hr>
    <p style="font-size:12px;">
        Após carregar o editor:<br>
        1. Abra o console (F12)<br>
        2. Procure por logs "PONTO CEGO"<br>
        3. Verifique se showProperties = true<br>
        4. Clique em um bloco<br>
        5. Verifique se Properties Panel aparece
    </p>
</body>
</html>
HTMLEOF

echo "✅ Arquivo criado: public/TESTE-DEFINITIVO.html"
echo ""
echo "📋 PONTOS CEGOS IDENTIFICADOS:"
echo "================================"
echo ""
echo "1️⃣  PONTO CEGO #1: editorModeUI.showProperties pode ser FALSE"
echo "   📍 Linha 2020: {editorModeUI.showProperties && ("
echo "   🔧 CORREÇÃO: Adicionado useEffect para logar + impedir desligar botão ⚙️"
echo ""
echo "2️⃣  PONTO CEGO #2: useSimplePropertiesPanel pode ser FALSE"
echo "   📍 Linha 2044: useSimplePropertiesPanel ? PropertiesColumn : PropertiesColumnWithJson"
echo "   🔧 CORREÇÃO: Forçado true por padrão (linha 285)"
echo ""
echo "3️⃣  PONTO CEGO #3: Flag localStorage errada"
echo "   📍 Chave correta: 'qm-editor:use-simple-properties'"
echo "   🔧 CORREÇÃO: Testes agora usam chave correta"
echo ""
echo "🌐 ABRA AGORA:"
echo "   http://localhost:8080/TESTE-DEFINITIVO.html"
echo ""
echo "📊 Ou use o Debug Console Interceptor:"
echo "   http://localhost:8080/debug-console-interceptor.html"
echo ""
HTMLEOF

chmod +x /workspaces/quiz-flow-pro-verso-03342/test-definitivo.sh
bash /workspaces/quiz-flow-pro-verso-03342/test-definitivo.sh
