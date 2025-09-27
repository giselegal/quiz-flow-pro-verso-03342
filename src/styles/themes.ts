/**
 * 🎨 SISTEMA DE TEMAS - IDENTIDADE VISUAL APP
 * 
 * Configurações de cores e estilos para duas versões do tema
 */

export interface Theme {
    name: string;
    colors: {
        background: string;
        text: string;
        detailsMinor: string;
        glowEffect: string;
        buttons: string;
        accent: string;
    };
    effects: {
        glow: string;
        buttonGlow: string;
        gradient: string;
        blur: string;
        cardGlow: string;
    };
}

// Versão 1 - Fundo Escuro
export const darkTheme: Theme = {
    name: 'dark',
    colors: {
        background: '#000000',
        text: '#ffffff',
        detailsMinor: '#d85dfb',
        glowEffect: '#dee5ff',
        buttons: '#687ef7',
        accent: '#d85dfb'
    },
    effects: {
        glow: `
            box-shadow: 
                0 0 20px rgba(216, 93, 251, 0.3),
                0 0 40px rgba(216, 93, 251, 0.2),
                inset 0 0 20px rgba(222, 229, 255, 0.1);
        `,
        buttonGlow: `
            background: linear-gradient(135deg, #687ef7 0%, #d85dfb 100%);
            box-shadow: 
                0 0 20px rgba(104, 126, 247, 0.5),
                0 0 40px rgba(104, 126, 247, 0.3),
                0 4px 20px rgba(0, 0, 0, 0.3);
            filter: blur(0px);
            transition: all 0.3s ease;
        `,
        gradient: 'linear-gradient(135deg, #687ef7 0%, #d85dfb 50%, #dee5ff 100%)',
        blur: 'backdrop-filter: blur(20px)',
        cardGlow: `
            background: rgba(0, 0, 0, 0.8);
            border: 1px solid rgba(216, 93, 251, 0.3);
            box-shadow: 
                0 0 30px rgba(222, 229, 255, 0.1),
                inset 0 0 20px rgba(216, 93, 251, 0.05);
            backdrop-filter: blur(20px);
        `
    }
};

// Versão 2 - Fundo Claro
export const lightTheme: Theme = {
    name: 'light',
    colors: {
        background: '#ffffff',
        text: '#000000',
        detailsMinor: '#d85dfb',
        glowEffect: '#dee5ff',
        buttons: '#687ef7',
        accent: '#d85dfb'
    },
    effects: {
        glow: `
            box-shadow: 
                0 0 20px rgba(216, 93, 251, 0.2),
                0 0 40px rgba(216, 93, 251, 0.1),
                inset 0 0 20px rgba(222, 229, 255, 0.1);
        `,
        buttonGlow: `
            background: linear-gradient(135deg, #687ef7 0%, #d85dfb 100%);
            box-shadow: 
                0 0 20px rgba(104, 126, 247, 0.4),
                0 0 40px rgba(104, 126, 247, 0.2),
                0 4px 20px rgba(0, 0, 0, 0.1);
            filter: blur(0px);
            transition: all 0.3s ease;
        `,
        gradient: 'linear-gradient(135deg, #687ef7 0%, #d85dfb 50%, #dee5ff 100%)',
        blur: 'backdrop-filter: blur(20px)',
        cardGlow: `
            background: rgba(255, 255, 255, 0.9);
            border: 1px solid rgba(216, 93, 251, 0.2);
            box-shadow: 
                0 0 30px rgba(222, 229, 255, 0.15),
                inset 0 0 20px rgba(216, 93, 251, 0.03);
            backdrop-filter: blur(20px);
        `
    }
};

// CSS personalizado para efeitos
export const themeStyles = {
    glowButton: `
        .glow-button {
            background: linear-gradient(135deg, #687ef7 0%, #d85dfb 100%);
            border: none;
            color: white;
            font-weight: 600;
            border-radius: 12px;
            padding: 12px 24px;
            position: relative;
            overflow: hidden;
            transition: all 0.3s ease;
            box-shadow: 
                0 0 20px rgba(104, 126, 247, 0.5),
                0 0 40px rgba(104, 126, 247, 0.3),
                0 4px 20px rgba(0, 0, 0, 0.3);
        }
        
        .glow-button:hover {
            transform: translateY(-2px);
            box-shadow: 
                0 0 30px rgba(104, 126, 247, 0.7),
                0 0 60px rgba(104, 126, 247, 0.4),
                0 8px 30px rgba(0, 0, 0, 0.4);
        }
        
        .glow-button::before {
            content: '';
            position: absolute;
            top: 0;
            left: -100%;
            width: 100%;
            height: 100%;
            background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
            transition: left 0.5s;
        }
        
        .glow-button:hover::before {
            left: 100%;
        }
    `,

    glowCard: `
        .glow-card {
            border-radius: 16px;
            position: relative;
            overflow: hidden;
            transition: all 0.3s ease;
        }
        
        .glow-card::before {
            content: '';
            position: absolute;
            top: -2px;
            left: -2px;
            right: -2px;
            bottom: -2px;
            background: linear-gradient(135deg, #d85dfb, #dee5ff, #687ef7);
            border-radius: 18px;
            z-index: -1;
            opacity: 0.7;
            filter: blur(10px);
            transition: all 0.3s ease;
        }
        
        .glow-card:hover::before {
            opacity: 1;
            filter: blur(15px);
        }
    `,

    glowText: `
        .glow-text {
            background: linear-gradient(135deg, #d85dfb 0%, #687ef7 100%);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
            filter: drop-shadow(0 0 10px rgba(216, 93, 251, 0.5));
        }
    `,

    neonBorder: `
        .neon-border {
            border: 2px solid transparent;
            background: linear-gradient(135deg, #d85dfb, #dee5ff) border-box;
            border-radius: 12px;
            position: relative;
            animation: neonPulse 2s ease-in-out infinite alternate;
        }
        
        @keyframes neonPulse {
            from {
                box-shadow: 0 0 5px rgba(216, 93, 251, 0.5);
            }
            to {
                box-shadow: 0 0 20px rgba(216, 93, 251, 0.8), 0 0 30px rgba(222, 229, 255, 0.5);
            }
        }
    `
};

// Hook para usar o tema
export const useTheme = () => {
    // Por enquanto usaremos o tema escuro por padrão
    // Pode ser expandido para incluir seleção de tema pelo usuário
    return darkTheme;
};