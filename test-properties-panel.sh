#!/bin/bash

# 🧪 TESTE AUTOMÁTICO: Properties Panel

echo "🔧 TESTE: Properties Panel no QuizModularEditor"
echo "================================================"
echo ""

# 1. Criar HTML de teste que ativa a flag CORRETA
cat > /workspaces/quiz-flow-pro-verso-03342/public/test-auto-properties.html << 'HTMLEOF'
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>🧪 Teste Automático Properties</title>
    <script>
        console.log('🧪 [TESTE] Iniciando teste automático...');
        
        // ATIVAR FLAG CORRETA
        const chaveCorreta = 'qm-editor:use-simple-properties';
        localStorage.setItem(chaveCorreta, 'true');
        
        console.log('✅ [TESTE] Flag ativada:', {
            chave: chaveCorreta,
            valor: localStorage.getItem(chaveCorreta)
        });
        
        // Aguardar e redirecionar
        setTimeout(() => {
            console.log('🚀 [TESTE] Redirecionando para editor...');
            window.location.href = '/editor?template=quiz21StepsComplete';
        }, 1000);
    </script>
</head>
<body style="background: #000; color: #0f0; font-family: monospace; padding: 50px;">
    <h1>🧪 TESTE AUTOMÁTICO</h1>
    <p>✅ Ativando flag: qm-editor:use-simple-properties = true</p>
    <p>🔄 Redirecionando para o editor...</p>
    <hr>
    <p>Aguarde o console do navegador para ver os logs de debug.</p>
</body>
</html>
HTMLEOF

echo "✅ Arquivo de teste criado: public/test-auto-properties.html"
echo ""

# 2. Criar script de verificação de console
cat > /workspaces/quiz-flow-pro-verso-03342/public/verificar-properties.html << 'HTMLEOF'
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>🔍 Verificação Properties Panel</title>
    <style>
        body {
            background: #1a1a2e;
            color: #eee;
            font-family: 'Courier New', monospace;
            padding: 20px;
        }
        .status { padding: 15px; margin: 10px 0; border-radius: 8px; }
        .success { background: #16213e; border-left: 5px solid #0f0; }
        .error { background: #3d0000; border-left: 5px solid #f00; }
        .warning { background: #3d3d00; border-left: 5px solid #ff0; }
        button {
            background: #0f0;
            color: #000;
            border: none;
            padding: 15px 30px;
            font-size: 16px;
            font-weight: bold;
            cursor: pointer;
            margin: 10px 5px;
            border-radius: 5px;
        }
        button:hover { background: #0c0; }
        pre { background: #000; padding: 10px; border-radius: 5px; overflow-x: auto; }
    </style>
</head>
<body>
    <h1>🔍 VERIFICAÇÃO: Properties Panel</h1>
    
    <div class="status" id="status-flag"></div>
    <div class="status" id="status-location"></div>
    <div class="status" id="status-dom"></div>
    
    <div style="margin: 20px 0;">
        <button onclick="ativarFlag()">✅ ATIVAR FLAG CORRETA</button>
        <button onclick="abrirEditor()">🚀 ABRIR EDITOR</button>
        <button onclick="verificar()">🔍 VERIFICAR TUDO</button>
        <button onclick="injetarDebug()">🐛 INJETAR DEBUG</button>
    </div>
    
    <h2>📊 Logs do Console:</h2>
    <pre id="logs">Aguardando logs...</pre>
    
    <script>
        const logsDiv = document.getElementById('logs');
        const logs = [];
        
        // Interceptar console
        ['log', 'info', 'warn', 'error'].forEach(method => {
            const original = console[method];
            console[method] = function(...args) {
                const msg = args.map(a => typeof a === 'object' ? JSON.stringify(a, null, 2) : String(a)).join(' ');
                logs.push(`[${method.toUpperCase()}] ${msg}`);
                if (logs.length > 30) logs.shift();
                logsDiv.textContent = logs.slice(-20).join('\n');
                original.apply(console, args);
            };
        });
        
        function ativarFlag() {
            localStorage.setItem('qm-editor:use-simple-properties', 'true');
            console.log('✅ Flag ativada com chave CORRETA: qm-editor:use-simple-properties');
            verificar();
            alert('✅ Flag ATIVADA!\n\nChave: qm-editor:use-simple-properties\nValor: true\n\nAgora abra o editor.');
        }
        
        function abrirEditor() {
            console.log('🚀 Abrindo editor...');
            window.open('/editor?template=quiz21StepsComplete', '_blank');
        }
        
        function verificar() {
            // Flag
            const flag = localStorage.getItem('qm-editor:use-simple-properties');
            const statusFlag = document.getElementById('status-flag');
            if (flag === 'true') {
                statusFlag.className = 'status success';
                statusFlag.innerHTML = '<strong>✅ FLAG CORRETA</strong><br>qm-editor:use-simple-properties = "true"';
            } else {
                statusFlag.className = 'status error';
                statusFlag.innerHTML = '<strong>❌ FLAG INCORRETA</strong><br>qm-editor:use-simple-properties = "' + (flag || 'null') + '"';
            }
            
            // Location
            const isEditor = window.location.pathname.includes('/editor');
            const statusLoc = document.getElementById('status-location');
            if (isEditor) {
                statusLoc.className = 'status success';
                statusLoc.innerHTML = '<strong>✅ NO EDITOR</strong><br>' + window.location.href;
            } else {
                statusLoc.className = 'status warning';
                statusLoc.innerHTML = '<strong>⚠️ NÃO ESTÁ NO EDITOR</strong><br>Abra /editor para testar';
            }
            
            // DOM
            if (isEditor) {
                const propsColumn = document.querySelector('[data-testid="column-properties"]');
                const blocks = document.querySelectorAll('[data-block-id]');
                const statusDom = document.getElementById('status-dom');
                
                let html = '<strong>🔍 ELEMENTOS NO DOM</strong><br>';
                html += 'PropertiesColumn: ' + (propsColumn ? '✅ Encontrado' : '❌ Não encontrado') + '<br>';
                html += 'Blocos no canvas: ' + blocks.length;
                
                statusDom.className = propsColumn ? 'status success' : 'status error';
                statusDom.innerHTML = html;
            }
            
            console.log('📊 Verificação completa:', {
                flag,
                isEditor,
                timestamp: new Date().toISOString()
            });
        }
        
        function injetarDebug() {
            if (!window.location.pathname.includes('/editor')) {
                alert('⚠️ Você precisa estar no /editor para injetar debug!');
                return;
            }
            
            // Interceptar cliques em blocos
            document.addEventListener('click', function(e) {
                const blockEl = e.target.closest('[data-block-id]');
                if (blockEl) {
                    const blockId = blockEl.getAttribute('data-block-id');
                    console.log('🖱️ [DEBUG INJETADO] Clique no bloco:', blockId);
                }
            }, true);
            
            console.log('🐛 Debug injetado! Clique em qualquer bloco para ver logs.');
            alert('🐛 Debug injetado!\n\nClique em um bloco e veja o console.');
        }
        
        // Verificar automaticamente
        setTimeout(verificar, 500);
        setInterval(verificar, 5000);
    </script>
</body>
</html>
HTMLEOF

echo "✅ Arquivo de verificação criado: public/verificar-properties.html"
echo ""

echo "📋 INSTRUÇÕES DE TESTE:"
echo "======================="
echo ""
echo "1️⃣  Abra no navegador:"
echo "    http://localhost:8080/test-auto-properties.html"
echo ""
echo "2️⃣  A flag será ativada automaticamente e você será redirecionado"
echo ""
echo "3️⃣  No editor, clique em um bloco do canvas"
echo ""
echo "4️⃣  Abra o console (F12) e veja os logs:"
echo "    - 🔍 [QuizModularEditor] useSimplePropertiesPanel inicial"
echo "    - 🖱️ [CanvasColumn] Click no bloco"
echo "    - 🎯 [QuizModularEditor] selectedBlock calculado"
echo "    - 🔍 [PropertiesColumn] selectedBlock recalculando"
echo ""
echo "5️⃣  Se nada aparecer, abra:"
echo "    http://localhost:8080/verificar-properties.html"
echo ""
echo "✅ TESTE PRONTO!"
echo ""
