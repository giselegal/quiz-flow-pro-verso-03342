#!/bin/bash

# 🔧 CORREÇÃO URGENTE - Funil único + Aba Global no Editor

echo "🎯 Corrigindo funis duplicados e aba Global no editor..."

# 1. Executar limpeza de funis
echo "🧹 Executando limpeza completa de funis..."
cat > cleanup-funnels-final.js << 'EOF'
// Limpeza completa de funis duplicados
console.log('🎯 Iniciando limpeza de funis duplicados...');

// 1. Remover todos os funis do localStorage
const keys = Object.keys(localStorage);
const funnelKeys = keys.filter(key => 
    key.includes('funnel') || 
    key.includes('Funnel') || 
    key.includes('quiz') || 
    key.includes('Quiz') ||
    key.includes('template') ||
    key.includes('Template')
);

console.log('🗑️ Removendo', funnelKeys.length, 'chaves relacionadas a funis');
funnelKeys.forEach(key => {
    console.log(`  - Removendo: ${key}`);
    localStorage.removeItem(key);
});

// 2. Definir apenas um funil ativo
const singleFunnel = {
    id: 'quiz-style-unique',
    name: 'Quiz de Estilo Pessoal (Único)',
    description: 'Template único baseado em quiz21StepsComplete.ts',
    origin: 'quiz21StepsComplete.ts',
    template: 'quiz21StepsComplete',
    isActive: true,
    createdAt: new Date().toISOString(),
    totalSteps: 21
};

localStorage.setItem('active-funnel-unique', JSON.stringify(singleFunnel));
localStorage.setItem('funnel-single-mode', 'true');
localStorage.setItem('available-templates', JSON.stringify(['quiz21StepsComplete']));

// 3. Configurar NOCODE
const nocodeConfig = {
    enabled: true,
    globalConfigEnabled: true,
    singleFunnelMode: true,
    template: 'quiz21StepsComplete'
};

localStorage.setItem('nocode-config', JSON.stringify(nocodeConfig));

console.log('✅ Funil único configurado');
console.log('✅ Configuração NOCODE habilitada');
EOF

# 2. Executar JavaScript
echo "📁 Executando no navegador..."
cat > apply-fixes.html << 'EOF'
<!DOCTYPE html>
<html>
<head>
    <title>Aplicar Correções</title>
</head>
<body>
    <h1>Aplicando correções...</h1>
    <div id="log"></div>
    
    <script>
        const log = document.getElementById('log');
        
        // Limpeza completa
        console.log('🎯 Iniciando limpeza de funis duplicados...');
        log.innerHTML += '<p>🎯 Iniciando limpeza de funis duplicados...</p>';

        // 1. Remover todos os funis do localStorage
        const keys = Object.keys(localStorage);
        const funnelKeys = keys.filter(key => 
            key.includes('funnel') || 
            key.includes('Funnel') || 
            key.includes('quiz') || 
            key.includes('Quiz') ||
            key.includes('template') ||
            key.includes('Template')
        );

        console.log('🗑️ Removendo', funnelKeys.length, 'chaves relacionadas a funis');
        log.innerHTML += `<p>🗑️ Removendo ${funnelKeys.length} chaves relacionadas a funis</p>`;
        
        funnelKeys.forEach(key => {
            console.log(`  - Removendo: ${key}`);
            localStorage.removeItem(key);
        });

        // 2. Definir apenas um funil ativo
        const singleFunnel = {
            id: 'quiz-style-unique',
            name: 'Quiz de Estilo Pessoal (Único)',
            description: 'Template único baseado em quiz21StepsComplete.ts',
            origin: 'quiz21StepsComplete.ts',
            template: 'quiz21StepsComplete',
            isActive: true,
            createdAt: new Date().toISOString(),
            totalSteps: 21
        };

        localStorage.setItem('active-funnel-unique', JSON.stringify(singleFunnel));
        localStorage.setItem('funnel-single-mode', 'true');
        localStorage.setItem('available-templates', JSON.stringify(['quiz21StepsComplete']));

        // 3. Configurar NOCODE
        const nocodeConfig = {
            enabled: true,
            globalConfigEnabled: true,
            singleFunnelMode: true,
            template: 'quiz21StepsComplete'
        };

        localStorage.setItem('nocode-config', JSON.stringify(nocodeConfig));

        // 4. Forçar reload das configurações
        localStorage.setItem('force-config-reload', Date.now().toString());

        log.innerHTML += `
            <p>✅ Funil único configurado</p>
            <p>✅ Configuração NOCODE habilitada</p>
            <p>✅ localStorage limpo e organizado</p>
            <br>
            <p><strong>🎉 Correções aplicadas com sucesso!</strong></p>
            <p><em>Agora feche esta aba e acesse o editor: <a href="http://localhost:5174/editor" target="_blank">http://localhost:5174/editor</a></em></p>
        `;
        
        console.log('✅ Correções aplicadas com sucesso!');
    </script>
</body>
</html>
EOF

echo ""
echo "✅ Scripts de correção criados!"
echo ""
echo "📋 Para aplicar as correções:"
echo "1. Abra o arquivo: apply-fixes.html"
echo "2. Deixe executar por 5 segundos"
echo "3. Acesse o editor: http://localhost:5174/editor"
echo ""
echo "🎯 Isso vai:"
echo "  ✅ Remover todos os funis duplicados"
echo "  ✅ Deixar apenas um funil ativo"
echo "  ✅ Habilitar configurações NOCODE"
echo "  ✅ Forçar reload do editor"
echo ""

# Limpar arquivos temporários
rm -f cleanup-funnels-final.js

echo "🚀 Pronto! Execute: open apply-fixes.html"
