import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
    HelpCircle,
    Info,
    BookOpen,
    Code,
    Lightbulb,
    X,
    ExternalLink
} from 'lucide-react';

interface TooltipInfo {
    title: string;
    description: string;
    example?: string;
    tips?: string[];
    codeExample?: string;
    relatedLinks?: { label: string; url: string }[];
    category?: 'basic' | 'advanced' | 'expert';
}

interface ContextualTooltipProps {
    info: TooltipInfo;
    trigger?: 'click' | 'hover';
    position?: 'top' | 'bottom' | 'left' | 'right';
    compact?: boolean;
}

/**
 * Tooltip contextual com informações detalhadas sobre propriedades
 * Features: Exemplos, dicas, código, links relacionados
 */
const ContextualTooltip: React.FC<ContextualTooltipProps> = ({
    info,
    trigger = 'click',
    position = 'right',
    compact = false
}) => {
    const [isOpen, setIsOpen] = useState(false);

    const getCategoryColor = (category?: string) => {
        switch (category) {
            case 'basic': return 'bg-green-100 text-green-800 border-green-200';
            case 'advanced': return 'bg-blue-100 text-blue-800 border-blue-200';
            case 'expert': return 'bg-purple-100 text-purple-800 border-purple-200';
            default: return 'bg-gray-100 text-gray-800 border-gray-200';
        }
    };

    const getCategoryIcon = (category?: string) => {
        switch (category) {
            case 'basic': return <Info className="w-3 h-3" />;
            case 'advanced': return <BookOpen className="w-3 h-3" />;
            case 'expert': return <Code className="w-3 h-3" />;
            default: return <HelpCircle className="w-3 h-3" />;
        }
    };

    const handleTrigger = () => {
        if (trigger === 'click') {
            setIsOpen(!isOpen);
        }
    };

    const handleMouseEnter = () => {
        if (trigger === 'hover') {
            setIsOpen(true);
        }
    };

    const handleMouseLeave = () => {
        if (trigger === 'hover') {
            setIsOpen(false);
        }
    };

    const getPositionClasses = () => {
        const base = 'absolute z-50 w-80 max-w-sm';
        switch (position) {
            case 'top': return `${base} bottom-full mb-2 left-1/2 transform -translate-x-1/2`;
            case 'bottom': return `${base} top-full mt-2 left-1/2 transform -translate-x-1/2`;
            case 'left': return `${base} right-full mr-2 top-0`;
            case 'right': return `${base} left-full ml-2 top-0`;
            default: return `${base} left-full ml-2 top-0`;
        }
    };

    return (
        <div className="relative inline-block">
            {/* Trigger Button */}
            <Button
                variant="ghost"
                size="sm"
                className={`h-4 w-4 p-0 text-gray-400 hover:text-gray-600 ${compact ? 'h-3 w-3' : ''}`}
                onClick={handleTrigger}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
            >
                <HelpCircle className={`${compact ? 'w-3 h-3' : 'w-4 h-4'}`} />
            </Button>

            {/* Tooltip Content */}
            {isOpen && (
                <>
                    {/* Backdrop for click-away */}
                    {trigger === 'click' && (
                        <div
                            className="fixed inset-0 z-40"
                            onClick={() => setIsOpen(false)}
                        />
                    )}

                    <Card className={`${getPositionClasses()} border shadow-lg`}>
                        <CardContent className="p-4 space-y-3">
                            {/* Header */}
                            <div className="flex items-start justify-between">
                                <div className="flex items-center gap-2">
                                    <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs border ${getCategoryColor(info.category)}`}>
                                        {getCategoryIcon(info.category)}
                                        <span className="capitalize">{info.category || 'info'}</span>
                                    </div>
                                    {trigger === 'click' && (
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => setIsOpen(false)}
                                            className="h-4 w-4 p-0 text-gray-400 hover:text-gray-600"
                                        >
                                            <X className="w-3 h-3" />
                                        </Button>
                                    )}
                                </div>
                            </div>

                            {/* Title & Description */}
                            <div className="space-y-2">
                                <h4 className="font-semibold text-sm text-gray-900">{info.title}</h4>
                                <p className="text-xs text-gray-600 leading-relaxed">{info.description}</p>
                            </div>

                            {/* Example */}
                            {info.example && (
                                <div className="space-y-1">
                                    <div className="flex items-center gap-1 text-xs font-medium text-gray-700">
                                        <Lightbulb className="w-3 h-3" />
                                        <span>Exemplo:</span>
                                    </div>
                                    <div className="bg-amber-50 border border-amber-200 p-2 rounded text-xs text-amber-800">
                                        {info.example}
                                    </div>
                                </div>
                            )}

                            {/* Tips */}
                            {info.tips && info.tips.length > 0 && (
                                <div className="space-y-1">
                                    <div className="flex items-center gap-1 text-xs font-medium text-gray-700">
                                        <Lightbulb className="w-3 h-3" />
                                        <span>Dicas:</span>
                                    </div>
                                    <ul className="space-y-1">
                                        {info.tips.map((tip, index) => (
                                            <li key={index} className="text-xs text-gray-600 flex items-start gap-1">
                                                <span className="text-gray-400 mt-0.5">•</span>
                                                <span>{tip}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}

                            {/* Code Example */}
                            {info.codeExample && (
                                <div className="space-y-1">
                                    <div className="flex items-center gap-1 text-xs font-medium text-gray-700">
                                        <Code className="w-3 h-3" />
                                        <span>Código:</span>
                                    </div>
                                    <div className="bg-gray-900 text-green-400 p-2 rounded text-xs font-mono overflow-x-auto">
                                        <pre className="whitespace-pre-wrap">{info.codeExample}</pre>
                                    </div>
                                </div>
                            )}

                            {/* Related Links */}
                            {info.relatedLinks && info.relatedLinks.length > 0 && (
                                <div className="space-y-1">
                                    <div className="flex items-center gap-1 text-xs font-medium text-gray-700">
                                        <BookOpen className="w-3 h-3" />
                                        <span>Links Relacionados:</span>
                                    </div>
                                    <div className="space-y-1">
                                        {info.relatedLinks.map((link, index) => (
                                            <a
                                                key={index}
                                                href={link.url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="inline-flex items-center gap-1 text-xs text-blue-600 hover:text-blue-800 hover:underline"
                                            >
                                                <ExternalLink className="w-3 h-3" />
                                                {link.label}
                                            </a>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </>
            )}
        </div>
    );
};

// Predefined tooltip content for common properties
export const tooltipLibrary = {
    margin: {
        title: 'Margens Externas',
        description: 'Controla o espaço exterior ao redor do elemento. Margens criam distância entre elementos.',
        category: 'basic' as const,
        example: 'margin: 16px cria 16px de espaço ao redor do elemento',
        tips: [
            'Use valores negativos para sobrepor elementos',
            'Margens verticais podem colapsar entre elementos adjacentes',
            'Use "auto" para centralizar elementos horizontalmente'
        ],
        codeExample: `/* Individual */
margin-top: 16px;
margin-right: 8px;
margin-bottom: 16px;  
margin-left: 8px;

/* Shorthand */  
margin: 16px 8px;`,
        relatedLinks: [
            { label: 'CSS Margin Guide', url: 'https://developer.mozilla.org/en-US/docs/Web/CSS/margin' }
        ]
    },

    padding: {
        title: 'Espaçamento Interno',
        description: 'Controla o espaço interior entre o conteúdo e a borda do elemento.',
        category: 'basic' as const,
        example: 'padding: 12px cria 12px de espaço interno em todos os lados',
        tips: [
            'Padding aumenta o tamanho total do elemento',
            'Não aceita valores negativos',
            'Útil para criar área clicável maior em botões'
        ],
        codeExample: `/* Todos os lados */
padding: 12px;

/* Vertical e horizontal */
padding: 16px 24px;

/* Individual */
padding: 16px 24px 8px 12px;`,
        relatedLinks: [
            { label: 'CSS Padding Guide', url: 'https://developer.mozilla.org/en-US/docs/Web/CSS/padding' }
        ]
    },

    animation: {
        title: 'Animações CSS',
        description: 'Cria transições visuais suaves e atrativas para melhorar a experiência do usuário.',
        category: 'advanced' as const,
        example: 'animation: fadeIn 0.5s ease-in-out cria uma entrada suave',
        tips: [
            'Use durações curtas (0.2-0.5s) para interações',
            'Durações longas (1-2s) para efeitos chamativos',
            'Prefira transforms para melhor performance',
            'Teste em dispositivos móveis para suavidade'
        ],
        codeExample: `/* Definir keyframes */
@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

/* Aplicar animação */
.element {
  animation: fadeIn 0.5s ease-out;
}`,
        relatedLinks: [
            { label: 'CSS Animations Guide', url: 'https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Animations' },
            { label: 'Animation Performance', url: 'https://web.dev/animations/' }
        ]
    },

    upload: {
        title: 'Upload de Mídia',
        description: 'Permite adicionar imagens, vídeos e outros arquivos ao seu componente com validação e preview.',
        category: 'advanced' as const,
        example: 'Aceita URLs diretos ou upload de arquivos com drag & drop',
        tips: [
            'URLs são mais rápidas que upload de arquivos',
            'Otimize imagens antes do upload (WebP recomendado)',
            'Considere CDNs para melhor performance',
            'Sempre forneça texto alternativo para acessibilidade'
        ],
        codeExample: `<!-- HTML -->
<input 
  type="file" 
  accept="image/*,video/*"
  multiple
/>

<!-- Image with fallback -->
<img 
  src="image.jpg" 
  alt="Descrição"
  loading="lazy"
/>`,
        relatedLinks: [
            { label: 'Image Optimization', url: 'https://web.dev/fast/#optimize-your-images' },
            { label: 'File API Guide', url: 'https://developer.mozilla.org/en-US/docs/Web/API/File' }
        ]
    },

    scoreValues: {
        title: 'Valores de Pontuação',
        description: 'Sistema de scoring para opções de quiz, permite configurar pontos por categoria de resultado.',
        category: 'expert' as const,
        example: 'Cada categoria (Romântico, Clássico, Moderno) tem valores específicos para calcular resultado final',
        tips: [
            'Use valores consistentes entre opções',
            'Considere pesos diferentes para perguntas importantes',
            'Teste cenários extremos (todos zeros, valores máximos)',
            'Documente a lógica de scoring para manutenção'
        ],
        codeExample: `{
  "romantic": 5,
  "classic": 2,  
  "modern": 1,
  "bold": 0
}

// Calculation logic
const scores = calculateScores(answers);
const winner = Object.keys(scores)
  .reduce((a, b) => scores[a] > scores[b] ? a : b);`,
        relatedLinks: [
            { label: 'Quiz Logic Best Practices', url: '#' }
        ]
    },

    responsiveColumns: {
        title: 'Colunas Responsivas',
        description: 'Sistema de grid que adapta o número de colunas baseado no tamanho da tela do dispositivo.',
        category: 'advanced' as const,
        example: 'Desktop: 3 colunas, Tablet: 2 colunas, Mobile: 1 coluna',
        tips: [
            'Sempre teste em dispositivos reais',
            'Considere conteúdo variável ao definir colunas',
            'Use breakpoints padrão (768px tablet, 1024px desktop)',
            'Mantenha legibilidade em telas pequenas'
        ],
        codeExample: `/* CSS Grid */
.grid {
  display: grid;
  gap: 16px;
  grid-template-columns: 1fr;
}

@media (min-width: 768px) {
  .grid { grid-template-columns: repeat(2, 1fr); }
}

@media (min-width: 1024px) {
  .grid { grid-template-columns: repeat(3, 1fr); }
}`,
        relatedLinks: [
            { label: 'CSS Grid Guide', url: 'https://css-tricks.com/snippets/css/complete-guide-grid/' },
            { label: 'Responsive Design', url: 'https://web.dev/responsive-web-design-basics/' }
        ]
    }
};

export default ContextualTooltip;
