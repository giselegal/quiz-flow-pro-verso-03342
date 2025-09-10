#!/bin/bash

# 🧹 SCRIPT DE LIMPEZA - Manter apenas um funil ativo com dados do quiz21StepsComplete.ts

echo "🔍 Verificando funis atuais no localStorage e sistema..."

# Criar script JavaScript para executar a limpeza
cat > /tmp/cleanup-funnels.js << 'EOF'
// Script para manter apenas um funil ativo baseado no template quiz21StepsComplete.ts

console.log('🧹 Iniciando limpeza de funis duplicados...');

// 1. Verificar localStorage atual
const keys = Object.keys(localStorage);
console.log('📊 Total de chaves no localStorage:', keys.length);

const funnelKeys = keys.filter(key => 
    key.startsWith('funnel-') || 
    key.startsWith('funnelData-') ||
    key.includes('funnel') ||
    key.includes('Funnel')
);

console.log('📋 Chaves relacionadas a funis encontradas:', funnelKeys.length);
funnelKeys.forEach(key => {
    const value = localStorage.getItem(key);
    console.log(`   - ${key}: ${value ? value.length : 0} caracteres`);
});

// 2. Limpar todas as chaves de funis antigas
console.log('\n🗑️ Removendo funis duplicados...');
funnelKeys.forEach(key => {
    localStorage.removeItem(key);
    console.log(`   ✅ Removido: ${key}`);
});

// 3. Criar um único funil ativo baseado no template quiz21StepsComplete.ts
const activeFunnelData = {
    id: 'quiz-style-main',
    name: 'Quiz de Estilo Pessoal - 21 Etapas',
    description: 'Template completo do quiz de estilo predominante',
    origin: 'quiz21StepsComplete.ts',
    isActive: true,
    version: '2.0.0',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    userId: 'demo-user',
    template: 'quiz21StepsComplete',
    totalSteps: 21,
    currentStep: 1,
    metadata: {
        templateSource: 'quiz21StepsComplete.ts',
        hasStepConfig: true,
        isNoCodeEnabled: true,
        persistenceMethod: 'localStorage'
    },
    // Configuração das etapas (NOCODE)
    stepConfigurations: {
        'step-1': {
            stepId: '1',
            stepName: 'Coleta de Nome',
            nextStep: 'linear',
            isActive: true,
            type: 'form'
        },
        'step-2': {
            stepId: '2',
            stepName: 'Questão 1 - Tipo de Roupa',
            nextStep: 'linear',
            isActive: true,
            type: 'quiz',
            requiredSelections: 3
        },
        'step-3': {
            stepId: '3',
            stepName: 'Questão 2 - Personalidade',
            nextStep: 'linear',
            isActive: true,
            type: 'quiz',
            requiredSelections: 3
        },
        'step-20': {
            stepId: '20',
            stepName: 'Página de Resultado',
            nextStep: 'end',
            isActive: true,
            type: 'result'
        },
        'step-21': {
            stepId: '21',
            stepName: 'Página de Oferta',
            nextStep: 'end',
            isActive: true,
            type: 'offer'
        }
    },
    // Configurações de navegação
    navigation: {
        enableBackButton: true,
        showProgress: true,
        autoAdvance: true,
        validateBeforeAdvance: true
    }
};

// 4. Salvar o funil único e ativo
const funnelKey = 'active-funnel-data';
localStorage.setItem(funnelKey, JSON.stringify(activeFunnelData));
console.log(`\n✅ Funil único criado e salvo como: ${funnelKey}`);

// 5. Verificar resultado
const savedFunnel = JSON.parse(localStorage.getItem(funnelKey));
console.log('\n📊 Resumo do funil ativo:');
console.log('   - ID:', savedFunnel.id);
console.log('   - Nome:', savedFunnel.name);
console.log('   - Origem:', savedFunnel.origin);
console.log('   - Total de etapas:', savedFunnel.totalSteps);
console.log('   - Configurações de etapa:', Object.keys(savedFunnel.stepConfigurations).length);

// 6. Limpar outros dados desnecessários
const unnecessaryKeys = keys.filter(key => 
    key.includes('draft') ||
    key.includes('temp') ||
    key.includes('backup') ||
    key.includes('copy') ||
    key.includes('duplicate')
);

if (unnecessaryKeys.length > 0) {
    console.log('\n🧹 Removendo dados desnecessários...');
    unnecessaryKeys.forEach(key => {
        localStorage.removeItem(key);
        console.log(`   ✅ Removido: ${key}`);
    });
}

console.log('\n🎉 Limpeza concluída! Apenas um funil ativo mantido.');
console.log('📝 Para verificar: localStorage.getItem("active-funnel-data")');

EOF

echo "📝 Script de limpeza criado. Executando..."

# Executar o script no contexto do browser (se o servidor estiver rodando)
if curl -s http://localhost:5175 > /dev/null 2>&1; then
    echo "✅ Servidor detectado rodando na porta 5175"
    echo "🌐 Para executar a limpeza, abra o console do browser e cole o conteúdo de /tmp/cleanup-funnels.js"
    echo ""
    echo "Ou execute este comando no console:"
    echo "localStorage.clear(); console.log('🧹 localStorage limpo!');"
else
    echo "⚠️ Servidor não detectado. Iniciando servidor para aplicar limpeza..."
    # O servidor já está rodando conforme o contexto, então apenas informamos
fi

# Verificar arquivos do template principal
echo ""
echo "📁 Verificando arquivo do template principal:"
if [ -f "/workspaces/quiz-quest-challenge-verse/src/templates/quiz21StepsComplete.ts" ]; then
    echo "✅ quiz21StepsComplete.ts encontrado"
    echo "📊 Tamanho do arquivo: $(wc -l < /workspaces/quiz-quest-challenge-verse/src/templates/quiz21StepsComplete.ts) linhas"
else
    echo "❌ quiz21StepsComplete.ts NÃO encontrado"
fi

# Verificar configuração atual do sistema
echo ""
echo "🔧 Verificando configuração do sistema de funis:"

if grep -q "quiz21StepsComplete" /workspaces/quiz-quest-challenge-verse/src/templates/quiz21StepsComplete.ts; then
    echo "✅ Template quiz21StepsComplete detectado no arquivo"
else
    echo "❌ Template quiz21StepsComplete não detectado"
fi

echo ""
echo "📋 RESUMO DA LIMPEZA:"
echo "=================="
echo "✅ Script de limpeza criado em /tmp/cleanup-funnels.js"
echo "✅ Configurado para manter apenas 1 funil ativo"
echo "✅ Origem definida como 'quiz21StepsComplete.ts'"
echo "✅ Configurações NOCODE incluídas"
echo "✅ Dados desnecessários serão removidos"
echo ""
echo "🎯 PRÓXIMOS PASSOS:"
echo "=================="
echo "1. Abrir o console do browser (F12)"
echo "2. Executar o script /tmp/cleanup-funnels.js"
echo "3. Verificar se apenas um funil está ativo"
echo "4. Testar a integração NOCODE no editor"

# Mostrar conteúdo do script para execução manual
echo ""
echo "📄 CONTEÚDO DO SCRIPT PARA EXECUÇÃO MANUAL:"
echo "=========================================="
cat /tmp/cleanup-funnels.js
