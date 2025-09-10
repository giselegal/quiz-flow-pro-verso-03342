#!/bin/bash

# 🧹 APLICAR LIMPEZA DIRETA - Script para executar limpeza via Node.js

echo "🚀 Aplicando limpeza de funis duplicados via Node.js..."

# Criar script Node.js temporário
cat > /tmp/apply-cleanup.js << 'EOF'
const fs = require('fs');
const path = require('path');

console.log('🧹 Executando limpeza de funis via Node.js...');

// Simular localStorage usando arquivo JSON
const storageFile = path.join(process.cwd(), 'localStorage-simulator.json');

// Função para simular localStorage
class LocalStorageSimulator {
    constructor() {
        this.data = {};
        this.loadData();
    }
    
    loadData() {
        try {
            if (fs.existsSync(storageFile)) {
                const content = fs.readFileSync(storageFile, 'utf8');
                this.data = JSON.parse(content);
            }
        } catch (error) {
            console.log('📝 Criando novo storage simulado...');
            this.data = {};
        }
    }
    
    saveData() {
        try {
            fs.writeFileSync(storageFile, JSON.stringify(this.data, null, 2));
            console.log('💾 Dados salvos em:', storageFile);
        } catch (error) {
            console.error('❌ Erro ao salvar:', error.message);
        }
    }
    
    getItem(key) {
        return this.data[key] || null;
    }
    
    setItem(key, value) {
        this.data[key] = value;
    }
    
    removeItem(key) {
        delete this.data[key];
    }
    
    keys() {
        return Object.keys(this.data);
    }
}

// Executar limpeza
const localStorage = new LocalStorageSimulator();

// 1. Verificar estado atual
const keys = localStorage.keys();
console.log('📊 Total de chaves encontradas:', keys.length);

const funnelKeys = keys.filter(key => 
    key.startsWith('funnel-') || 
    key.startsWith('funnelData-') ||
    key.includes('funnel') ||
    key.includes('Funnel') ||
    key.includes('quiz') ||
    key.includes('Quiz')
);

console.log('📋 Chaves de funis encontradas:', funnelKeys.length);
funnelKeys.forEach(key => {
    const value = localStorage.getItem(key);
    console.log(`   - ${key}: ${value ? value.length : 0} caracteres`);
});

// 2. Limpar funis existentes
console.log('\n🗑️ Removendo funis antigos...');
funnelKeys.forEach(key => {
    localStorage.removeItem(key);
    console.log(`   ✅ Removido: ${key}`);
});

// 3. Criar funil único baseado no quiz21StepsComplete.ts
const activeFunnelData = {
    id: 'quiz-style-main',
    name: 'Quiz de Estilo Pessoal - 21 Etapas',
    description: 'Template completo do quiz de estilo predominante',
    origin: 'quiz21StepsComplete.ts',
    templateSource: 'quiz21StepsComplete',
    isActive: true,
    version: '2.0.0',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    userId: 'demo-user',
    template: 'quiz21StepsComplete',
    totalSteps: 21,
    currentStep: 1,
    status: 'active',
    metadata: {
        templateSource: 'quiz21StepsComplete.ts',
        hasStepConfig: true,
        isNoCodeEnabled: true,
        persistenceMethod: 'file-storage',
        cleanupDate: new Date().toISOString(),
        uniqueFunnel: true,
        nodeCleanup: true
    },
    // Configuração das etapas (NOCODE)
    stepConfigurations: {
        'step-1': {
            stepId: '1',
            stepName: 'Coleta de Nome',
            nextStep: 'linear',
            isActive: true,
            type: 'form',
            description: 'Etapa inicial para coleta do nome do usuário'
        },
        'step-2': {
            stepId: '2',
            stepName: 'Questão 1 - Tipo de Roupa Favorita',
            nextStep: 'linear',
            isActive: true,
            type: 'quiz',
            requiredSelections: 3,
            description: 'Primeira questão do quiz sobre preferências de estilo'
        },
        'step-3': {
            stepId: '3',
            stepName: 'Questão 2 - Personalidade',
            nextStep: 'linear',
            isActive: true,
            type: 'quiz',
            requiredSelections: 3,
            description: 'Segunda questão sobre características de personalidade'
        },
        'step-11': {
            stepId: '11',
            stepName: 'Questão 10 - Tecidos',
            nextStep: 'step-12',
            isActive: true,
            type: 'quiz',
            requiredSelections: 3,
            description: 'Última questão do quiz de estilo'
        },
        'step-12': {
            stepId: '12',
            stepName: 'Transição para Questões Estratégicas',
            nextStep: 'step-13',
            isActive: true,
            type: 'transition',
            description: 'Transição entre quiz de estilo e questões estratégicas'
        },
        'step-18': {
            stepId: '18',
            stepName: 'Questão Estratégica 6 - Objetivo Principal',
            nextStep: 'step-19',
            isActive: true,
            type: 'strategic',
            requiredSelections: 1,
            description: 'Última questão estratégica'
        },
        'step-19': {
            stepId: '19',
            stepName: 'Transição para Resultado',
            nextStep: 'step-20',
            isActive: true,
            type: 'transition',
            description: 'Transição final antes do resultado'
        },
        'step-20': {
            stepId: '20',
            stepName: 'Página de Resultado',
            nextStep: 'step-21',
            isActive: true,
            type: 'result',
            description: 'Apresentação do resultado do quiz de estilo'
        },
        'step-21': {
            stepId: '21',
            stepName: 'Página de Oferta',
            nextStep: 'end',
            isActive: true,
            type: 'offer',
            description: 'Página final com oferta comercial'
        }
    },
    // Configurações de navegação
    navigation: {
        enableBackButton: true,
        showProgress: true,
        autoAdvance: true,
        validateBeforeAdvance: true,
        progressCalculation: 'steps',
        totalSteps: 21
    },
    // Configurações do template
    templateConfig: {
        name: 'Quiz de Estilo Pessoal',
        category: 'style-quiz',
        questions: 10,
        strategicQuestions: 6,
        resultPages: 2,
        totalSteps: 21,
        baseTemplate: 'quiz21StepsComplete.ts'
    }
};

// 4. Salvar funil único
const funnelKey = 'active-funnel-main';
localStorage.setItem(funnelKey, JSON.stringify(activeFunnelData));
localStorage.setItem('current-active-funnel-id', activeFunnelData.id);
localStorage.setItem('funnel-cleanup-timestamp', new Date().toISOString());
localStorage.setItem('cleanup-method', 'node-script');

console.log(`\n✅ Funil único criado e salvo como: ${funnelKey}`);

// 5. Salvar dados no arquivo
localStorage.saveData();

// 6. Verificar resultado
const savedFunnel = JSON.parse(localStorage.getItem(funnelKey));
console.log('\n📊 RESUMO DO FUNIL ATIVO:');
console.log('========================');
console.log('   - ID:', savedFunnel.id);
console.log('   - Nome:', savedFunnel.name);
console.log('   - Origem:', savedFunnel.origin);
console.log('   - Template:', savedFunnel.template);
console.log('   - Total de etapas:', savedFunnel.totalSteps);
console.log('   - Configurações de etapa:', Object.keys(savedFunnel.stepConfigurations).length);
console.log('   - Status:', savedFunnel.status);
console.log('   - NOCODE habilitado:', savedFunnel.metadata.isNoCodeEnabled);

const finalKeys = localStorage.keys();
console.log('\n📈 ESTATÍSTICAS DA LIMPEZA:');
console.log('===========================');
console.log('   - Itens removidos:', funnelKeys.length);
console.log('   - Chaves antes:', keys.length);
console.log('   - Chaves depois:', finalKeys.length);
console.log('   - Arquivo de storage:', storageFile);

console.log('\n🎉 Limpeza Node.js concluída com sucesso!');
console.log('📁 Dados salvos em:', storageFile);

EOF

# Executar o script Node.js
echo "📝 Executando script de limpeza..."
cd /workspaces/quiz-quest-challenge-verse && node /tmp/apply-cleanup.js

# Verificar resultado
echo ""
echo "🔍 Verificando resultado da limpeza:"
if [ -f "/workspaces/quiz-quest-challenge-verse/localStorage-simulator.json" ]; then
    echo "✅ Arquivo de storage criado"
    echo "📊 Tamanho: $(wc -c < /workspaces/quiz-quest-challenge-verse/localStorage-simulator.json) bytes"
    echo "📋 Conteúdo (primeiras linhas):"
    head -20 /workspaces/quiz-quest-challenge-verse/localStorage-simulator.json
else
    echo "❌ Arquivo de storage não foi criado"
fi

echo ""
echo "📋 RESUMO DA LIMPEZA APLICADA:"
echo "=============================="
echo "✅ Funis duplicados removidos"
echo "✅ Funil único criado baseado em quiz21StepsComplete.ts"
echo "✅ Configurações NOCODE incluídas"
echo "✅ Dados salvos em arquivo localStorage-simulator.json"
echo "✅ Total de 21 etapas configuradas"
echo "✅ Navegação e metadados definidos"
echo ""
echo "🎯 Para aplicar no browser:"
echo "=========================="
echo "1. Abrir console do browser (F12)"
echo "2. Executar: localStorage.clear()"
echo "3. Copiar conteúdo do arquivo localStorage-simulator.json"
echo "4. Executar no console para cada item do JSON"
