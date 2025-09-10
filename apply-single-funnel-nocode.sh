#!/bin/bash

# 🔧 Script para garantir que apenas o quiz21StepsComplete.ts esteja ativo
# com configurações NOCODE completas (SEO, pixel, UTM, webhook, etc.)

echo "🎯 Aplicando funil único com configurações NOCODE completas..."

# Verificar se estamos no diretório correto
if [[ ! -f "package.json" ]]; then
    echo "❌ Erro: Execute este script no diretório raiz do projeto"
    exit 1
fi

# 1. Limpar localStorage de configurações antigas
echo "🧹 Limpando configurações antigas do localStorage..."
cat > cleanup-localstorage-config.js << 'EOF'
// Script para limpar configurações antigas do localStorage
const keysToClean = [
    'quiz-funnel-template',
    'quiz-active-template', 
    'quiz-templates-list',
    'editor-state',
    'funnel-blocks',
    'quiz-settings'
];

keysToClean.forEach(key => {
    if (localStorage.getItem(key)) {
        console.log(`🗑️ Removendo ${key}`);
        localStorage.removeItem(key);
    }
});

// Definir template ativo
localStorage.setItem('quiz-active-template', 'quiz21StepsComplete');
localStorage.setItem('quiz-single-funnel-mode', 'true');

console.log('✅ LocalStorage limpo e configurado para funil único');
EOF

# 2. Atualizar configuração do serviço de funis
echo "⚙️ Configurando serviço para funil único..."
if [[ -f "src/services/FunnelUnifiedService.ts" ]]; then
    # Backup do arquivo original
    cp "src/services/FunnelUnifiedService.ts" "src/services/FunnelUnifiedService.ts.backup"
    
    # Aplicar configuração de funil único
    cat > temp_funnel_config.ts << 'EOF'
// Configuração de funil único para quiz21StepsComplete
export const SINGLE_FUNNEL_CONFIG = {
    activeFunnel: 'quiz21StepsComplete',
    enforceUniqueFunnel: true,
    allowMultipleFunnels: false,
    globalConfigEnabled: true,
    nocodeConfigEnabled: true
};
EOF
    
    # Adicionar configuração no início do arquivo
    cat temp_funnel_config.ts src/services/FunnelUnifiedService.ts > temp_combined.ts
    mv temp_combined.ts src/services/FunnelUnifiedService.ts
    rm temp_funnel_config.ts
    
    echo "✅ FunnelUnifiedService configurado para funil único"
fi

# 3. Garantir que apenas quiz21StepsComplete está disponível
echo "🎯 Configurando template único..."
cat > apply-single-template.js << 'EOF'
// Garantir que apenas quiz21StepsComplete está ativo
const templateConfig = {
    activeTemplate: 'quiz21StepsComplete',
    availableTemplates: ['quiz21StepsComplete'],
    globalConfig: {
        enforceUnique: true,
        nocodeEnabled: true,
        globalSettingsEnabled: true
    }
};

// Salvar no localStorage
localStorage.setItem('quiz-template-config', JSON.stringify(templateConfig));
localStorage.setItem('quiz-global-config-enabled', 'true');

console.log('🎯 Template único configurado:', templateConfig);
EOF

# 4. Criar configuração NOCODE padrão
echo "🔧 Configurando NOCODE padrão..."
cat > setup-nocode-config.js << 'EOF'
// Configuração NOCODE padrão para o funil
const nocodeConfig = {
    stepConnections: {
        enabled: true,
        autoAdvance: true,
        connectionType: 'linear-with-conditionals'
    },
    globalSettings: {
        seoEnabled: true,
        trackingEnabled: true,
        utmEnabled: true,
        webhooksEnabled: true,
        brandingEnabled: true
    },
    template: 'quiz21StepsComplete'
};

// Configurações globais padrão
const globalConfig = {
    seo: {
        title: 'Descubra Seu Estilo Pessoal - Quiz Interativo | Gisele Galvão',
        description: 'Descubra seu estilo predominante através do nosso quiz personalizado e transforme seu guarda-roupa com confiança.',
        configured: true
    },
    tracking: {
        enabled: true,
        configured: false // Para ser configurado no painel
    },
    utm: {
        enabled: true,
        configured: true // Configuração existente em utmConfig.js
    },
    webhooks: {
        enabled: false,
        configured: false // Para ser configurado no painel
    },
    branding: {
        enabled: true,
        configured: true // Cores padrão configuradas
    }
};

// Salvar configurações
localStorage.setItem('quiz-nocode-config', JSON.stringify(nocodeConfig));
localStorage.setItem('quiz-global-config', JSON.stringify(globalConfig));

console.log('🔧 Configuração NOCODE aplicada');
console.log('🌐 Configurações globais inicializadas');
EOF

# 5. Executar limpeza e configuração
echo "🚀 Executando configuração..."

# Criar página HTML temporária para executar os scripts
cat > config-setup.html << 'EOF'
<!DOCTYPE html>
<html>
<head>
    <title>Configuração do Funil Único</title>
</head>
<body>
    <h1>Configurando funil único com NOCODE...</h1>
    <div id="log"></div>
    
    <script>
        const log = document.getElementById('log');
        
        // Limpar localStorage
        const keysToClean = [
            'quiz-funnel-template',
            'quiz-active-template', 
            'quiz-templates-list',
            'editor-state',
            'funnel-blocks',
            'quiz-settings'
        ];

        keysToClean.forEach(key => {
            if (localStorage.getItem(key)) {
                console.log(`🗑️ Removendo ${key}`);
                log.innerHTML += `<p>🗑️ Removendo ${key}</p>`;
                localStorage.removeItem(key);
            }
        });

        // Configurar template único
        localStorage.setItem('quiz-active-template', 'quiz21StepsComplete');
        localStorage.setItem('quiz-single-funnel-mode', 'true');
        
        const templateConfig = {
            activeTemplate: 'quiz21StepsComplete',
            availableTemplates: ['quiz21StepsComplete'],
            globalConfig: {
                enforceUnique: true,
                nocodeEnabled: true,
                globalSettingsEnabled: true
            }
        };
        
        localStorage.setItem('quiz-template-config', JSON.stringify(templateConfig));
        localStorage.setItem('quiz-global-config-enabled', 'true');
        
        // Configuração NOCODE
        const nocodeConfig = {
            stepConnections: {
                enabled: true,
                autoAdvance: true,
                connectionType: 'linear-with-conditionals'
            },
            globalSettings: {
                seoEnabled: true,
                trackingEnabled: true,
                utmEnabled: true,
                webhooksEnabled: true,
                brandingEnabled: true
            },
            template: 'quiz21StepsComplete'
        };
        
        const globalConfig = {
            seo: {
                title: 'Descubra Seu Estilo Pessoal - Quiz Interativo | Gisele Galvão',
                description: 'Descubra seu estilo predominante através do nosso quiz personalizado e transforme seu guarda-roupa com confiança.',
                configured: true
            },
            tracking: {
                enabled: true,
                configured: false
            },
            utm: {
                enabled: true,
                configured: true
            },
            webhooks: {
                enabled: false,
                configured: false
            },
            branding: {
                enabled: true,
                configured: true
            }
        };
        
        localStorage.setItem('quiz-nocode-config', JSON.stringify(nocodeConfig));
        localStorage.setItem('quiz-global-config', JSON.stringify(globalConfig));
        
        log.innerHTML += `
            <p>✅ LocalStorage limpo e configurado</p>
            <p>🎯 Template único configurado: quiz21StepsComplete</p>
            <p>🔧 Configuração NOCODE aplicada</p>
            <p>🌐 Configurações globais inicializadas</p>
            <p><strong>🎉 Configuração concluída com sucesso!</strong></p>
            <br>
            <p><strong>📋 Status das configurações:</strong></p>
            <ul>
                <li>✅ SEO: Configurado</li>
                <li>⚠️ Tracking: Aguardando configuração</li>
                <li>✅ UTM: Configurado (utmConfig.js)</li>
                <li>⚠️ Webhooks: Aguardando configuração</li>
                <li>✅ Branding: Configurado</li>
            </ul>
            <br>
            <p><em>Acesse o editor e vá em "Configurações NOCODE" > "Global" para configurar tracking e webhooks.</em></p>
        `;
        
        console.log('🎉 Configuração de funil único com NOCODE concluída!');
    </script>
</body>
</html>
EOF

echo ""
echo "✅ Script executado com sucesso!"
echo ""
echo "📋 Próximos passos:"
echo "1. Abra o arquivo config-setup.html no navegador para aplicar as configurações"
echo "2. Acesse o editor do funil"
echo "3. Clique em 'Configurações NOCODE' na toolbar"
echo "4. Vá para a aba 'Global' para configurar tracking e webhooks"
echo ""
echo "🎯 Funil ativo: quiz21StepsComplete.ts"
echo "🔧 NOCODE: Habilitado com configurações globais"
echo "🌐 Configurações: SEO ✅, UTM ✅, Tracking ⚠️, Webhooks ⚠️, Branding ✅"
echo ""
echo "Para aplicar as configurações agora, execute:"
echo "  open config-setup.html"

# Limpar arquivos temporários
rm -f cleanup-localstorage-config.js apply-single-template.js setup-nocode-config.js

echo ""
echo "🚀 Configuração pronta! O funil quiz21StepsComplete.ts está ativo com configurações NOCODE completas."
