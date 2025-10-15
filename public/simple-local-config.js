/**
 * 🔧 SIMPLE LOCAL CONFIG SYSTEM
 * 
 * Sistema simples de configuração local sem dependências complexas
 */

// Sistema global de configuração
window.LocalConfigSystem = {
    configs: new Map(),
    isActive: false,
    
    // Configurações padrão
    defaults: {
        'quiz-global-config': {
            theme: {
                primaryColor: '#2563eb',
                secondaryColor: '#64748b',
                backgroundColor: '#ffffff'
            },
            features: {
                progressBar: true,
                backButton: true,
                autoSave: false
            },
            fallback: true
        },
        
        'quiz-theme-config': {
            colors: {
                primary: '#2563eb',
                secondary: '#64748b',
                success: '#10b981'
            },
            fallback: true
        },
        
        'quiz-step-1': {
            type: 'question',
            title: 'Pergunta',
            validation: { required: true },
            fallback: true
        }
    },
    
    // Ativar sistema local
    activate() {
        this.isActive = true;
        console.log('🔄 Sistema de configuração local ativado');
        
        // Carregar configurações padrão
        Object.entries(this.defaults).forEach(([key, config]) => {
            this.configs.set(key, { ...config, loadedAt: Date.now() });
        });
        
        // Mostrar aviso
        this.showLocalModeWarning();
        
        // Disparar evento
        window.dispatchEvent(new CustomEvent('local-config-activated'));
    },
    
    // Obter configuração
    getConfig(configId) {
        if (this.configs.has(configId)) {
            const config = this.configs.get(configId);
            console.log(`⚡ Config local: ${configId}`, config);
            return config;
        }
        
        // Retornar configuração padrão
        const defaultConfig = this.defaults[configId] || { 
            fallback: true, 
            configId,
            loadedAt: Date.now() 
        };
        
        this.configs.set(configId, defaultConfig);
        return defaultConfig;
    },
    
    // Definir configuração
    setConfig(configId, config) {
        this.configs.set(configId, config);
        
        // Salvar no localStorage
        try {
            localStorage.setItem(`local-config-${configId}`, JSON.stringify(config));
        } catch (error) {
            console.warn(`Erro ao salvar config ${configId}:`, error);
        }
    },
    
    // Mostrar aviso de modo local
    showLocalModeWarning() {
        // Remover aviso anterior se existir
        const existing = document.getElementById('local-mode-warning');
        if (existing) existing.remove();
        
        // Criar novo aviso
        const warning = document.createElement('div');
        warning.id = 'local-mode-warning';
        warning.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            background-color: #fbbf24;
            color: #92400e;
            padding: 8px;
            text-align: center;
            font-size: 14px;
            z-index: 10000;
            font-weight: 500;
        `;
        warning.textContent = '🔧 Modo Local Ativo - Configurações carregadas localmente devido a problemas de conexão';
        
        document.body.appendChild(warning);
        
        // Remover após 10 segundos
        setTimeout(() => {
            if (warning.parentNode) {
                warning.parentNode.removeChild(warning);
            }
        }, 10000);
    },
    
    // Interceptar timeouts de configuração
    interceptTimeouts() {
        let timeoutCount = 0;
        const originalConsoleWarn = console.warn;
        
        console.warn = (...args) => {
            const message = args.join(' ');
            if (message.includes('timeout') && message.includes('config')) {
                timeoutCount++;
                console.log(`⚠️ Timeout ${timeoutCount} detectado para configuração`);
                
                // Após 3 timeouts, ativar modo local
                if (timeoutCount >= 3 && !this.isActive) {
                    console.log('🚨 Muitos timeouts! Ativando modo local...');
                    this.activate();
                }
            }
            
            // Chamar console.warn original
            originalConsoleWarn.apply(console, args);
        };
    }
};

// Auto-inicializar interceptação de timeouts
window.LocalConfigSystem.interceptTimeouts();

// Expor funções globais para facilidade de uso
window.getLocalConfig = (configId) => window.LocalConfigSystem.getConfig(configId);
window.setLocalConfig = (configId, config) => window.LocalConfigSystem.setConfig(configId, config);
window.activateLocalConfig = () => window.LocalConfigSystem.activate();

// Detectar problemas e ativar automaticamente
let supabaseErrorCount = 0;
const originalFetch = window.fetch;

window.fetch = async (...args) => {
    try {
        const response = await originalFetch(...args);
        
        // Contar erros 404 do Supabase
        if (response.status === 404 && args[0].toString().includes('supabase')) {
            supabaseErrorCount++;
            if (supabaseErrorCount >= 5 && !window.LocalConfigSystem.isActive) {
                console.log('🚨 Muitos erros 404 do Supabase! Ativando modo local...');
                window.LocalConfigSystem.activate();
            }
        }
        
        return response;
    } catch (error) {
        if (args[0].toString().includes('supabase')) {
            supabaseErrorCount++;
            if (supabaseErrorCount >= 3 && !window.LocalConfigSystem.isActive) {
                console.log('🚨 Erros de rede do Supabase! Ativando modo local...');
                window.LocalConfigSystem.activate();
            }
        }
        throw error;
    }
};

console.log('🔧 Sistema de configuração local carregado');

// Ativar automaticamente após 5 segundos se não há atividade
setTimeout(() => {
    if (!window.LocalConfigSystem.isActive && supabaseErrorCount === 0) {
        console.log('🔄 Ativando modo local preventivamente...');
        window.LocalConfigSystem.activate();
    }
}, 5000);