import React, { useState, useCallback, useMemo } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Zap, Wand2, Eye, ArrowRight, CheckCircle } from 'lucide-react';
import type { PropertyEditorProps } from '../interfaces/PropertyEditor';

// Interface para as etapas do funil
interface FunnelStepData {
    type: string;
    title: string;
    category: string;
    progress: number;
    description?: string;
    question?: string;
    options?: Array<{ id: string; text: string; style?: string }>;
    requiredSelections?: number;
    requiresInput?: boolean;
    inputType?: string;
    placeholder?: string;
    autoAdvance?: boolean;
}

/**
 * FullFunnelPreview - Preview completo do fluxo do funil com 21 etapas
 */
const FullFunnelPreview: React.FC<{
    block: any;
    onBack: () => void;
    onUpdate: (patch: Record<string, any>) => void;
}> = ({ block, onBack, onUpdate }) => {
    const [currentStep, setCurrentStep] = useState(1);
    const [userName, setUserName] = useState('');
    const [isAutoAdvancing, setIsAutoAdvancing] = useState(false);
    const [answers, setAnswers] = useState<Record<string, any>>({});
    const [strategicAnswers, setStrategicAnswers] = useState<Record<string, string>>({});
    const [showResults, setShowResults] = useState(false);
    const [quizResult, setQuizResult] = useState<any>(null);
    const [isProcessing, setIsProcessing] = useState(false);

    const props = block?.properties || {};

    // Estrutura completa das 21 etapas baseada no template
    const funnelSteps = useMemo(() => ({
        1: {
            type: 'intro',
            title: 'Bem-vinda!',
            description: 'Como posso te chamar?',
            category: 'Introdução',
            requiresInput: true,
            inputType: 'text',
            placeholder: 'Digite seu primeiro nome...',
            progress: 0
        },
        2: {
            type: 'quiz',
            title: 'Questão 1 de 10',
            question: 'QUAL O SEU TIPO DE ROUPA FAVORITA?',
            category: 'Quiz Principal',
            options: [
                { id: 'natural_q1', text: 'Conforto, leveza e praticidade no vestir', style: 'Natural' },
                { id: 'classico_q1', text: 'Discrição, caimento clássico e sobriedade', style: 'Clássico' },
                { id: 'contemporaneo_q1', text: 'Praticidade com um toque de estilo atual', style: 'Contemporâneo' },
                { id: 'elegante_q1', text: 'Elegância refinada, moderna e sem exageros', style: 'Elegante' },
                { id: 'romantico_q1', text: 'Delicadeza em tecidos suaves e fluidos', style: 'Romântico' },
                { id: 'sexy_q1', text: 'Sensualidade com destaque para o corpo', style: 'Sexy' },
                { id: 'dramatico_q1', text: 'Impacto visual com peças estruturadas e assimétricas', style: 'Dramático' },
                { id: 'criativo_q1', text: 'Mix criativo com formas ousadas e originais', style: 'Criativo' }
            ],
            requiredSelections: 3,
            progress: 10
        },
        3: {
            type: 'quiz',
            title: 'Questão 2 de 10',
            question: 'RESUMA A SUA PERSONALIDADE:',
            category: 'Quiz Principal',
            options: [
                { id: 'natural_q2', text: 'Informal, espontânea, alegre, essencialista', style: 'Natural' },
                { id: 'classico_q2', text: 'Conservadora, séria, organizada', style: 'Clássico' },
                { id: 'contemporaneo_q2', text: 'Informada, ativa, prática', style: 'Contemporâneo' },
                { id: 'elegante_q2', text: 'Exigente, sofisticada, seletiva', style: 'Elegante' },
                { id: 'romantico_q2', text: 'Feminina, meiga, delicada, sensível', style: 'Romântico' },
                { id: 'sexy_q2', text: 'Glamorosa, vaidosa, sensual', style: 'Sexy' },
                { id: 'dramatico_q2', text: 'Cosmopolita, moderna e audaciosa', style: 'Dramático' },
                { id: 'criativo_q2', text: 'Exótica, aventureira, livre', style: 'Criativo' }
            ],
            requiredSelections: 3,
            progress: 20
        },
        4: {
            type: 'quiz',
            title: 'Questão 3 de 10',
            question: 'QUAL VISUAL VOCÊ MAIS SE IDENTIFICA?',
            category: 'Quiz Principal',
            options: [
                { id: 'natural_q3', text: 'Visual leve, despojado e natural', style: 'Natural' },
                { id: 'classico_q3', text: 'Visual clássico e tradicional', style: 'Clássico' },
                { id: 'contemporaneo_q3', text: 'Visual casual com toque atual', style: 'Contemporâneo' },
                { id: 'elegante_q3', text: 'Visual refinado e imponente', style: 'Elegante' },
                { id: 'romantico_q3', text: 'Visual romântico, feminino e delicado', style: 'Romântico' },
                { id: 'sexy_q3', text: 'Visual sensual, com saia justa e decote', style: 'Sexy' },
                { id: 'dramatico_q3', text: 'Visual marcante e urbano (jeans + jaqueta)', style: 'Dramático' },
                { id: 'criativo_q3', text: 'Visual criativo, colorido e ousado', style: 'Criativo' }
            ],
            requiredSelections: 3,
            progress: 30
        },
        5: {
            type: 'quiz',
            title: 'Questão 4 de 10',
            question: 'QUAIS DETALHES VOCÊ GOSTA?',
            category: 'Quiz Principal',
            options: [
                { id: 'natural_q4', text: 'Poucos detalhes, básico e prático', style: 'Natural' },
                { id: 'classico_q4', text: 'Bem discretos e sutis, clean e clássico', style: 'Clássico' },
                { id: 'contemporaneo_q4', text: 'Básico, mas com um toque de estilo', style: 'Contemporâneo' },
                { id: 'elegante_q4', text: 'Detalhes refinados, chic e que deem status', style: 'Elegante' },
                { id: 'romantico_q4', text: 'Detalhes delicados, laços, babados', style: 'Romântico' },
                { id: 'sexy_q4', text: 'Roupas que valorizem meu corpo: couro, zíper, fendas', style: 'Sexy' },
                { id: 'dramatico_q4', text: 'Detalhes marcantes, firmeza e peso', style: 'Dramático' },
                { id: 'criativo_q4', text: 'Detalhes diferentes do convencional, produções ousadas', style: 'Criativo' }
            ],
            requiredSelections: 3,
            progress: 40
        },
        // Continuando com as outras questões...
        6: {
            type: 'quiz',
            title: 'Questão 5 de 10',
            question: 'QUAIS ESTAMPAS VOCÊ MAIS SE IDENTIFICA?',
            category: 'Quiz Principal',
            options: [
                { id: 'natural_q5', text: 'Estampas clean, com poucas informações', style: 'Natural' },
                { id: 'classico_q5', text: 'Estampas clássicas e atemporais', style: 'Clássico' },
                { id: 'contemporaneo_q5', text: 'Atemporais, mas que tenham uma pegada atual e moderna', style: 'Contemporâneo' },
                { id: 'elegante_q5', text: 'Estampas clássicas e atemporais, mas sofisticadas', style: 'Elegante' },
                { id: 'romantico_q5', text: 'Estampas florais e/ou delicadas como bolinhas, borboletas e corações', style: 'Romântico' },
                { id: 'sexy_q5', text: 'Estampas de animal print, como onça, zebra e cobra', style: 'Sexy' },
                { id: 'dramatico_q5', text: 'Estampas geométricas, abstratas e exageradas como grandes poás', style: 'Dramático' },
                { id: 'criativo_q5', text: 'Estampas diferentes do usual, como africanas, xadrez grandes', style: 'Criativo' }
            ],
            requiredSelections: 3,
            progress: 50
        },
        7: {
            type: 'quiz',
            title: 'Questão 6 de 10',
            question: 'QUAL CASACO É SEU FAVORITO?',
            category: 'Quiz Principal',
            options: [
                { id: 'natural_q6', text: 'Cardigã bege confortável e casual', style: 'Natural' },
                { id: 'classico_q6', text: 'Blazer verde estruturado', style: 'Clássico' },
                { id: 'contemporaneo_q6', text: 'Trench coat bege tradicional', style: 'Contemporâneo' },
                { id: 'elegante_q6', text: 'Blazer branco refinado', style: 'Elegante' },
                { id: 'romantico_q6', text: 'Casaco pink vibrante e moderno', style: 'Romântico' },
                { id: 'sexy_q6', text: 'Jaqueta vinho de couro estilosa', style: 'Sexy' },
                { id: 'dramatico_q6', text: 'Jaqueta preta estilo rocker', style: 'Dramático' },
                { id: 'criativo_q6', text: 'Casaco estampado criativo e colorido', style: 'Criativo' }
            ],
            requiredSelections: 3,
            progress: 60
        },
        8: {
            type: 'quiz',
            title: 'Questão 7 de 10',
            question: 'QUAL SUA CALÇA FAVORITA?',
            category: 'Quiz Principal',
            options: [
                { id: 'natural_q7', text: 'Calça fluida acetinada bege', style: 'Natural' },
                { id: 'classico_q7', text: 'Calça de alfaiataria cinza', style: 'Clássico' },
                { id: 'contemporaneo_q7', text: 'Jeans reto e básico', style: 'Contemporâneo' },
                { id: 'elegante_q7', text: 'Calça reta bege de tecido', style: 'Elegante' },
                { id: 'romantico_q7', text: 'Calça ampla rosa alfaiatada', style: 'Romântico' },
                { id: 'sexy_q7', text: 'Legging preta de couro', style: 'Sexy' },
                { id: 'dramatico_q7', text: 'Calça reta preta de couro', style: 'Dramático' },
                { id: 'criativo_q7', text: 'Calça estampada floral leve e ampla', style: 'Criativo' }
            ],
            requiredSelections: 3,
            progress: 70
        },
        9: {
            type: 'quiz',
            title: 'Questão 8 de 10',
            question: 'QUAL DESSES SAPATOS VOCÊ TEM OU MAIS GOSTA?',
            category: 'Quiz Principal',
            options: [
                { id: 'natural_q8', text: 'Tênis nude casual e confortável', style: 'Natural' },
                { id: 'classico_q8', text: 'Scarpin nude de salto baixo', style: 'Clássico' },
                { id: 'contemporaneo_q8', text: 'Sandália dourada com salto bloco', style: 'Contemporâneo' },
                { id: 'elegante_q8', text: 'Scarpin nude salto alto e fino', style: 'Elegante' },
                { id: 'romantico_q8', text: 'Sandália anabela off white', style: 'Romântico' },
                { id: 'sexy_q8', text: 'Sandália rosa de tiras finas', style: 'Sexy' },
                { id: 'dramatico_q8', text: 'Scarpin preto moderno com vinil transparente', style: 'Dramático' },
                { id: 'criativo_q8', text: 'Scarpin colorido estampado', style: 'Criativo' }
            ],
            requiredSelections: 3,
            progress: 80
        },
        10: {
            type: 'quiz',
            title: 'Questão 9 de 10',
            question: 'QUE TIPO DE ACESSÓRIOS VOCÊ GOSTA?',
            category: 'Quiz Principal',
            options: [
                { id: 'natural_q9', text: 'Pequenos e discretos, às vezes nem uso', style: 'Natural' },
                { id: 'classico_q9', text: 'Brincos pequenos e discretos. Corrente fininha', style: 'Clássico' },
                { id: 'contemporaneo_q9', text: 'Acessórios que elevem meu look com um toque moderno', style: 'Contemporâneo' },
                { id: 'elegante_q9', text: 'Acessórios sofisticados, joias ou semijoias', style: 'Elegante' },
                { id: 'romantico_q9', text: 'Peças delicadas e com um toque feminino', style: 'Romântico' },
                { id: 'sexy_q9', text: 'Brincos longos, colares que valorizem minha beleza', style: 'Sexy' },
                { id: 'dramatico_q9', text: 'Acessórios pesados, que causem um impacto', style: 'Dramático' },
                { id: 'criativo_q9', text: 'Acessórios diferentes, grandes e marcantes', style: 'Criativo' }
            ],
            requiredSelections: 3,
            progress: 90
        },
        11: {
            type: 'quiz',
            title: 'Questão 10 de 10',
            question: 'VOCÊ ESCOLHE CERTOS TECIDOS, PRINCIPALMENTE PORQUE ELES...',
            category: 'Quiz Principal',
            options: [
                { id: 'natural_q10', text: 'São fáceis de cuidar', style: 'Natural' },
                { id: 'classico_q10', text: 'São de excelente qualidade', style: 'Clássico' },
                { id: 'contemporaneo_q10', text: 'São fáceis de cuidar e modernos', style: 'Contemporâneo' },
                { id: 'elegante_q10', text: 'São sofisticados', style: 'Elegante' },
                { id: 'romantico_q10', text: 'São delicados', style: 'Romântico' },
                { id: 'sexy_q10', text: 'São perfeitos ao meu corpo', style: 'Sexy' },
                { id: 'dramatico_q10', text: 'São diferentes, e trazem um efeito para minha roupa', style: 'Dramático' },
                { id: 'criativo_q10', text: 'São exclusivos, criam identidade no look', style: 'Criativo' }
            ],
            requiredSelections: 3,
            progress: 100
        },
        12: {
            type: 'transition',
            title: 'Enquanto calculamos o seu resultado...',
            description: 'Queremos te fazer algumas perguntas que vão tornar sua experiência ainda mais completa.',
            category: 'Transição',
            autoAdvance: true,
            progress: 55
        },
        // Questões estratégicas (13-18)
        13: {
            type: 'strategic',
            title: 'Reflexão Pessoal',
            question: 'Quando você se olha no espelho, como se sente com sua imagem pessoal atualmente?',
            category: 'Análise Estratégica',
            options: [
                { id: 'q13_opt1', text: 'Me sinto desconectada da mulher que sou hoje' },
                { id: 'q13_opt2', text: 'Tenho dúvidas sobre o que realmente me valoriza' },
                { id: 'q13_opt3', text: 'Às vezes acerto, às vezes erro' },
                { id: 'q13_opt4', text: 'Me sinto segura, mas sei que posso evoluir' }
            ],
            requiredSelections: 1,
            progress: 65
        },
        14: {
            type: 'strategic',
            title: 'Desafios do Dia a Dia',
            question: 'O que mais te desafia na hora de se vestir?',
            category: 'Análise Estratégica',
            options: [
                { id: 'q14_opt1', text: 'Tenho peças, mas não sei como combiná-las' },
                { id: 'q14_opt2', text: 'Compro por impulso e me arrependo depois' },
                { id: 'q14_opt3', text: 'Minha imagem não reflete quem eu sou' },
                { id: 'q14_opt4', text: 'Perco tempo e acabo usando sempre os mesmos looks' }
            ],
            requiredSelections: 1,
            progress: 70
        },
        15: {
            type: 'strategic',
            title: 'Frequência de Indecisão',
            question: 'Com que frequência você se pega pensando: "Com que roupa eu vou?" — mesmo com o guarda-roupa cheio?',
            category: 'Análise Estratégica',
            options: [
                { id: 'q15_opt1', text: 'Quase todos os dias — é sempre uma indecisão' },
                { id: 'q15_opt2', text: 'Sempre que tenho um compromisso importante' },
                { id: 'q15_opt3', text: 'Às vezes, mas me sinto limitada nas escolhas' },
                { id: 'q15_opt4', text: 'Raramente — já me sinto segura ao me vestir' }
            ],
            requiredSelections: 1,
            progress: 75
        },
        16: {
            type: 'strategic',
            title: 'Investimento em Transformação',
            question: 'Pense no quanto você já gastou com roupas que não usa ou que não representam quem você é... Você acredita que um material estratégico ajudaria?',
            category: 'Análise Estratégica',
            options: [
                { id: 'q16_opt1', text: 'Sim! Se existisse algo assim, eu quero' },
                { id: 'q16_opt2', text: 'Sim, mas teria que ser no momento certo' },
                { id: 'q16_opt3', text: 'Tenho dúvidas se funcionaria pra mim' },
                { id: 'q16_opt4', text: 'Não, prefiro continuar como estou' }
            ],
            requiredSelections: 1,
            progress: 80
        },
        17: {
            type: 'strategic',
            title: 'Percepção de Valor',
            question: 'Se esse conteúdo completo custasse R$ 97,00 — você consideraria um bom investimento?',
            category: 'Análise Estratégica',
            options: [
                { id: 'q17_opt1', text: 'Sim! Por esse resultado, vale muito' },
                { id: 'q17_opt2', text: 'Sim, mas só se eu tiver certeza de que funciona pra mim' },
                { id: 'q17_opt3', text: 'Talvez — depende do que está incluso' },
                { id: 'q17_opt4', text: 'Não, ainda não estou pronta para investir' }
            ],
            requiredSelections: 1,
            progress: 85
        },
        18: {
            type: 'strategic',
            title: 'Objetivo Principal',
            question: 'Qual desses resultados você mais gostaria de alcançar?',
            category: 'Análise Estratégica',
            options: [
                { id: 'q18_opt1', text: 'Montar looks com mais facilidade e confiança' },
                { id: 'q18_opt2', text: 'Usar o que já tenho e me sentir estilosa' },
                { id: 'q18_opt3', text: 'Comprar com mais consciência e sem culpa' },
                { id: 'q18_opt4', text: 'Ser admirada pela imagem que transmito' },
                { id: 'q18_opt5', text: 'Resgatar peças esquecidas e criar novos looks com estilo' }
            ],
            requiredSelections: 1,
            progress: 90
        },
        19: {
            type: 'processing',
            title: 'Processando seu resultado...',
            description: 'Estamos analisando suas respostas e preparando um resultado personalizado para você.',
            category: 'Processamento',
            autoAdvance: true,
            progress: 95
        },
        20: {
            type: 'result',
            title: 'Seu Estilo Predominante',
            description: 'Descubra qual é o seu estilo e como aplicá-lo no dia a dia',
            category: 'Resultado',
            progress: 98
        },
        21: {
            type: 'offer',
            title: 'Receba Seu Guia de Estilo Completo',
            description: 'Transforme sua descoberta em ação com nosso material exclusivo',
            category: 'Conversão',
            progress: 100
        }
    }), []);

    const currentStepData = funnelSteps[currentStep as keyof typeof funnelSteps];

    // Calcular resultado baseado nas respostas do quiz (etapas 2-11)
    const calculateResult = useCallback(() => {
        const styleCount: Record<string, number> = {};

        // Contar pontos por estilo das questões do quiz principal (etapas 2-11)
        Object.entries(answers).forEach(([questionId, selectedOptions]) => {
            if (Array.isArray(selectedOptions)) {
                selectedOptions.forEach((optionId: string) => {
                    // Extrair o estilo da opção (ex: 'natural_q1' -> 'Natural')
                    const styleMatch = optionId.match(/^(\w+)_q\d+$/);
                    if (styleMatch) {
                        let styleName = styleMatch[1];
                        // Capitalizar primeira letra
                        styleName = styleName.charAt(0).toUpperCase() + styleName.slice(1);

                        // Mapear nomes para versões mais amigáveis
                        const styleMapping: Record<string, string> = {
                            'Natural': 'Natural',
                            'Classico': 'Clássico',
                            'Contemporaneo': 'Contemporâneo',
                            'Elegante': 'Elegante',
                            'Romantico': 'Romântico',
                            'Sexy': 'Sexy',
                            'Dramatico': 'Dramático',
                            'Criativo': 'Criativo'
                        };

                        const finalStyleName = styleMapping[styleName] || styleName;
                        styleCount[finalStyleName] = (styleCount[finalStyleName] || 0) + 1;
                    }
                });
            }
        });

        // Encontrar o estilo predominante
        const sortedStyles = Object.entries(styleCount)
            .sort(([, a], [, b]) => b - a);

        const dominantStyle = sortedStyles[0]?.[0] || 'Natural';
        const dominantCount = sortedStyles[0]?.[1] || 0;
        const totalAnswers = Object.values(answers).flat().length;

        // Calcular porcentagem baseada nas respostas
        const percentage = Math.max(60, Math.min(95,
            Math.round((dominantCount / Math.max(totalAnswers, 1)) * 100) + Math.random() * 10
        ));

        return {
            style: dominantStyle,
            percentage: Math.round(percentage),
            description: getStyleDescription(dominantStyle),
            secondaryStyles: sortedStyles.slice(1, 3).map(([style]) => style),
            styleScores: styleCount
        };
    }, [answers]);

    const getStyleDescription = (style: string) => {
        const descriptions = {
            Natural: "Seu estilo é autêntico e descomplicado. Você valoriza o conforto sem abrir mão da elegância, preferindo peças versáteis que reflitam sua personalidade espontânea.",
            Clássico: "Você tem um estilo atemporal e refinado. Prefere qualidade à quantidade, investindo em peças que nunca saem de moda e transmitem seriedade e organização.",
            Contemporâneo: "Seu estilo é moderno e prático. Você gosta de estar atualizada com as tendências, mas sempre priorizando a funcionalidade e o conforto no dia a dia.",
            Elegante: "Você possui um estilo sofisticado e impecável. Valoriza detalhes refinados e peças que transmitem status, sempre priorizando a qualidade e a distinção.",
            Romântico: "Seu estilo é delicado e feminino. Você se identifica com tecidos suaves, detalhes delicados e cores que ressaltam sua sensibilidade e doçura.",
            Sexy: "Você tem um estilo marcante e sensual. Não tem medo de valorizar seu corpo e usar sua feminilidade como ferramenta de expressão pessoal.",
            Dramático: "Seu estilo é bold e impactante. Você gosta de causar impressão com peças estruturadas, detalhes marcantes e uma presença forte e urbana.",
            Criativo: "Você tem um estilo único e original. Não tem medo de ousar, misturar texturas, estampas e criar looks que expressem sua personalidade criativa e livre."
        };
        return descriptions[style] || descriptions.Natural;
    };

    // Avançar para próxima etapa
    const nextStep = useCallback(() => {
        if (currentStep < 21) {
            const newStep = currentStep + 1;
            setCurrentStep(newStep);

            // Auto-advance em algumas etapas
            if ([12, 19].includes(newStep)) {
                setTimeout(() => {
                    setCurrentStep(newStep + 1);
                }, 2500);
            }

            // Calcular resultado na etapa 20
            if (newStep === 20) {
                setIsProcessing(true);
                setTimeout(() => {
                    const result = calculateResult();
                    setQuizResult(result);
                    setShowResults(true);
                    setIsProcessing(false);
                }, 2000);
            }
        }
    }, [currentStep, calculateResult]);

    // Voltar etapa anterior
    const prevStep = useCallback(() => {
        if (currentStep > 1) {
            setCurrentStep(currentStep - 1);
        }
    }, [currentStep]);

    // Lidar com seleção de opções
    const handleOptionSelect = (optionId: string, stepData: any) => {
        if (stepData.type === 'quiz') {
            const questionId = `q${currentStep - 1}`;
            const currentSelections = answers[questionId] || [];

            let newSelections;
            if (currentSelections.includes(optionId)) {
                // Desmarcar se já estiver selecionado
                newSelections = currentSelections.filter((id: string) => id !== optionId);
            } else {
                // Adicionar nova seleção
                if (currentSelections.length < stepData.requiredSelections) {
                    newSelections = [...currentSelections, optionId];
                } else {
                    // Substituir a primeira seleção se já atingiu o limite
                    newSelections = [...currentSelections.slice(1), optionId];
                }
            }

            setAnswers(prev => ({
                ...prev,
                [questionId]: newSelections
            }));

            // Auto-advance se atingiu o número necessário de seleções
            if (newSelections.length === stepData.requiredSelections) {
                setTimeout(() => {
                    nextStep();
                }, 1000);
            }
        } else if (stepData.type === 'strategic') {
            const questionId = `qs${currentStep - 12}`;
            setStrategicAnswers(prev => ({
                ...prev,
                [questionId]: optionId
            }));

            // Auto-advance após seleção
            setTimeout(() => {
                nextStep();
            }, 800);
        }
    };

    // Aplicar resultado calculado às propriedades do componente
    const applyCalculatedResult = () => {
        if (quizResult && userName) {
            onUpdate({
                title: `Parabéns, ${userName}!`,
                subtitle: `Seu estilo predominante é ${quizResult.style}`,
                description: quizResult.description,
                percentage: quizResult.percentage,
                resultStyle: quizResult.style,
                userName: userName,
                styleScores: quizResult.styleScores,
                secondaryStyles: quizResult.secondaryStyles
            });
            onBack(); // Voltar para o editor
        }
    };

    // Renderizar etapa atual
    const renderCurrentStep = () => {
        const stepData = currentStepData;

        if (!stepData) return null;

        // Etapa 1: Entrada de nome
        if (stepData.type === 'intro') {
            return (
                <div className="text-center space-y-6">
                    <div className="space-y-4">
                        <h2 className="text-3xl font-bold text-gray-800">{stepData.title}</h2>
                        <p className="text-gray-600">{stepData.description}</p>
                    </div>
                    <div className="max-w-md mx-auto space-y-4">
                        <Input
                            placeholder={stepData.placeholder}
                            value={userName}
                            onChange={(e) => setUserName(e.target.value)}
                            className="text-center text-lg py-3"
                        />
                        <Button
                            onClick={nextStep}
                            disabled={userName.trim().length < 2}
                            className="w-full py-3 text-lg bg-[#B89B7A] hover:bg-[#A08969] text-white"
                            size="lg"
                        >
                            Quero Descobrir meu Estilo Agora!
                        </Button>
                    </div>
                </div>
            );
        }

        // Etapas de quiz (2-11)
        if (stepData.type === 'quiz') {
            const questionId = `q${currentStep - 1}`;
            const currentSelections = answers[questionId] || [];

            return (
                <div className="space-y-6">
                    <div className="text-center space-y-2">
                        <h2 className="text-2xl font-bold text-gray-800">{stepData.title}</h2>
                        <p className="text-sm text-gray-500">{stepData.category}</p>
                    </div>

                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold text-center text-gray-700">
                            {stepData.question}
                        </h3>
                        <p className="text-sm text-center text-gray-500">
                            Selecione {stepData.requiredSelections} opções ({currentSelections.length}/{stepData.requiredSelections})
                        </p>
                    </div>

                    <div className="grid gap-3">
                        {stepData.options?.map((option: any) => (
                            <button
                                key={option.id}
                                onClick={() => handleOptionSelect(option.id, stepData)}
                                className={`p-4 text-left border-2 rounded-lg transition-all hover:bg-blue-50 ${currentSelections.includes(option.id)
                                        ? 'border-blue-500 bg-blue-50 shadow-md'
                                        : 'border-gray-200 bg-white'
                                    }`}
                            >
                                <div className="flex items-center justify-between">
                                    <span className="text-sm text-gray-800">{option.text}</span>
                                    {currentSelections.includes(option.id) && (
                                        <CheckCircle className="h-5 w-5 text-blue-500" />
                                    )}
                                </div>
                            </button>
                        ))}
                    </div>
                </div>
            );
        }

        // Etapas de transição (12, 19)
        if (stepData.type === 'transition' || stepData.type === 'processing') {
            return (
                <div className="text-center space-y-6">
                    <div className="animate-pulse space-y-4">
                        <h2 className="text-2xl font-bold text-gray-800">{stepData.title}</h2>
                        <p className="text-gray-600">{stepData.description}</p>
                    </div>
                    <div className="flex justify-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#B89B7A]"></div>
                    </div>
                </div>
            );
        }

        // Etapas estratégicas (13-18)
        if (stepData.type === 'strategic') {
            const questionId = `qs${currentStep - 12}`;
            const currentSelection = strategicAnswers[questionId];

            return (
                <div className="space-y-6">
                    <div className="text-center space-y-2">
                        <h2 className="text-2xl font-bold text-gray-800">{stepData.title}</h2>
                        <p className="text-sm text-gray-500">{stepData.category}</p>
                    </div>

                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold text-center text-gray-700">
                            {stepData.question}
                        </h3>
                    </div>

                    <div className="grid gap-3">
                        {stepData.options?.map((option: any) => (
                            <button
                                key={option.id}
                                onClick={() => handleOptionSelect(option.id, stepData)}
                                className={`p-4 text-left border-2 rounded-lg transition-all hover:bg-green-50 ${currentSelection === option.id
                                        ? 'border-green-500 bg-green-50 shadow-md'
                                        : 'border-gray-200 bg-white'
                                    }`}
                            >
                                <div className="flex items-center justify-between">
                                    <span className="text-sm text-gray-800">{option.text}</span>
                                    {currentSelection === option.id && (
                                        <CheckCircle className="h-5 w-5 text-green-500" />
                                    )}
                                </div>
                            </button>
                        ))}
                    </div>
                </div>
            );
        }

        // Etapa de resultado (20)
        if (stepData.type === 'result' && quizResult) {
            return (
                <div className="text-center space-y-6">
                    <div className="space-y-4">
                        <h2 className="text-3xl font-bold text-gray-800">
                            Parabéns, {userName}!
                        </h2>
                        <h3 className="text-2xl font-semibold text-[#B89B7A]">
                            Seu estilo predominante é {quizResult.style}
                        </h3>
                        <div className="text-6xl font-bold text-[#B89B7A]">
                            {quizResult.percentage}%
                        </div>
                    </div>

                    <div className="max-w-2xl mx-auto">
                        <p className="text-gray-600 leading-relaxed">
                            {quizResult.description}
                        </p>
                    </div>

                    {quizResult.secondaryStyles?.length > 0 && (
                        <div className="space-y-2">
                            <h4 className="font-semibold text-gray-700">Estilos Secundários:</h4>
                            <div className="flex justify-center gap-2">
                                {quizResult.secondaryStyles.map((style: string) => (
                                    <Badge key={style} variant="outline" className="px-3 py-1">
                                        {style}
                                    </Badge>
                                ))}
                            </div>
                        </div>
                    )}

                    <div className="flex gap-3 justify-center">
                        <Button
                            onClick={applyCalculatedResult}
                            className="bg-[#B89B7A] hover:bg-[#A08969] text-white"
                        >
                            Aplicar Este Resultado
                        </Button>
                        <Button onClick={nextStep} variant="outline">
                            Continuar Jornada
                        </Button>
                    </div>
                </div>
            );
        }

        // Etapa de oferta/conversão (21)
        if (stepData.type === 'offer') {
            return (
                <div className="text-center space-y-6">
                    <div className="space-y-4">
                        <h2 className="text-3xl font-bold text-gray-800">{stepData.title}</h2>
                        <p className="text-gray-600">{stepData.description}</p>
                    </div>

                    <div className="bg-gradient-to-br from-[#B89B7A] to-[#A08969] text-white p-6 rounded-lg">
                        <h3 className="text-xl font-semibold mb-4">
                            🎁 Guia de Estilo {quizResult?.style} Personalizado
                        </h3>
                        <ul className="text-left space-y-2 text-sm">
                            <li>✅ Análise completa do seu estilo predominante</li>
                            <li>✅ Combinações práticas para o dia a dia</li>
                            <li>✅ Lista de peças essenciais</li>
                            <li>✅ Dicas de compras inteligentes</li>
                            <li>✅ Guia de cores personalizadas</li>
                        </ul>
                        <div className="mt-4 space-y-2">
                            <p className="line-through text-sm opacity-75">De R$ 197,00</p>
                            <p className="text-2xl font-bold">Por apenas R$ 97,00</p>
                        </div>
                    </div>

                    <Button
                        size="lg"
                        className="w-full max-w-md bg-white text-[#B89B7A] border-2 border-[#B89B7A] hover:bg-[#B89B7A] hover:text-white font-semibold py-3"
                    >
                        Quero Meu Guia Personalizado
                    </Button>

                    <p className="text-xs text-gray-500">
                        💳 Pagamento 100% seguro • 7 dias de garantia
                    </p>
                </div>
            );
        }

        return null;
    };

    return (
        <div className="h-full flex flex-col bg-gray-50">
            {/* Header com progresso */}
            <div className="bg-white border-b border-gray-200 p-4">
                <div className="flex items-center justify-between mb-3">
                    <Button
                        onClick={onBack}
                        variant="ghost"
                        size="sm"
                        className="flex items-center gap-2"
                    >
                        <ArrowRight className="h-4 w-4 rotate-180" />
                        Voltar ao Editor
                    </Button>
                    <div className="text-sm text-gray-500">
                        Preview Completo do Funil • 21 Etapas
                    </div>
                </div>

                {/* Barra de progresso */}
                <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                        className="bg-[#B89B7A] h-2 rounded-full transition-all duration-300"
                        style={{ width: `${currentStepData?.progress || 0}%` }}
                    ></div>
                </div>

                <div className="flex justify-between items-center mt-2 text-sm">
                    <span className="text-gray-600">
                        Etapa {currentStep} de 21 • {currentStepData?.category}
                    </span>
                    <span className="text-gray-500">
                        {currentStepData?.progress || 0}%
                    </span>
                </div>
            </div>

            {/* Conteúdo principal */}
            <div className="flex-1 overflow-auto p-6">
                <div className="max-w-4xl mx-auto">
                    {renderCurrentStep()}
                </div>
            </div>

            {/* Footer com navegação (apenas para desenvolvimento) */}
            {(currentStep > 1 && !['transition', 'processing'].includes(currentStepData?.type)) && (
                <div className="bg-white border-t border-gray-200 p-4">
                    <div className="max-w-4xl mx-auto flex justify-between">
                        <Button
                            onClick={prevStep}
                            variant="outline"
                            size="sm"
                            disabled={currentStep <= 1}
                            className="flex items-center gap-2"
                        >
                            <ArrowRight className="h-4 w-4 rotate-180" />
                            Etapa Anterior
                        </Button>

                        {/* Botão de pular (apenas para desenvolvimento/teste) */}
                        {currentStepData?.type !== 'result' && currentStepData?.type !== 'offer' && (
                            <Button
                                onClick={nextStep}
                                variant="ghost"
                                size="sm"
                                className="text-gray-500 hover:text-gray-700"
                            >
                                Pular Etapa →
                            </Button>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

/**
 * ResultCommonPropertyEditor
 * Editor unificado para componentes de resultado:
 * - result-header-inline
 * - modular-result-header
 * - quiz-result-header / quiz-result-style / quiz-result-secondary
 * - result-card
 */
export const ResultCommonPropertyEditor: React.FC<PropertyEditorProps> = ({
    block,
    onUpdate,
    onValidate,
    isPreviewMode = false,
}) => {
    const [tab, setTab] = useState('content');
    const [showProductionPreview, setShowProductionPreview] = useState(false);

    const props = block?.properties || {};

    const update = useCallback((patch: Record<string, any>) => {
        onUpdate?.(patch);
        // Validação básica: título obrigatório para header principal
        const titleValid = typeof (patch.title ?? props.title) === 'string' && (patch.title ?? props.title)?.trim().length > 0;
        onValidate?.(titleValid);
    }, [onUpdate, onValidate, props.title]);

    const componentType = block?.type || '';
    const isHeader = /result-header|quiz-result-header|modular-result-header/.test(componentType);
    const supportsImages = isHeader || componentType.includes('style') || componentType.includes('card');

    // Presets simples (MVP)
    const presets = useMemo(() => ([
        {
            key: 'minimal',
            label: 'Minimal',
            patch: { showBothImages: false, showSpecialTips: false, backgroundColor: 'transparent', spacing: 'compact' }
        },
        {
            key: 'visual',
            label: 'Destaque Visual',
            patch: { showBothImages: true, showSpecialTips: true, backgroundColor: '#FFF8F3', spacing: 'relaxed', showBorder: true, borderColor: '#B89B7A' }
        },
        {
            key: 'guide',
            label: 'Guia + Imagem',
            patch: { showBothImages: true, showSpecialTips: true, guideImageUrl: props.guideImageUrl || '', styleGuideImageUrl: props.styleGuideImageUrl || '' }
        }
    ]), [props.guideImageUrl, props.styleGuideImageUrl]);

    // Se está no modo preview de produção, mostrar o componente funcional
    if (showProductionPreview) {
        return (
            <FullFunnelPreview
                block={block}
                onBack={() => setShowProductionPreview(false)}
                onUpdate={update}
            />
        );
    }

    if (isPreviewMode) {
        return <div className="p-4 text-sm text-muted-foreground">Modo preview - edição desativada</div>;
    }

    return (
        <Card className="h-full flex flex-col">
            <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                    <CardTitle className="text-base flex items-center gap-2">
                        <Zap className="h-4 w-4 text-primary" /> Editor de Resultado
                    </CardTitle>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setShowProductionPreview(true)}
                        className="gap-2 bg-green-50 border-green-200 text-green-700 hover:bg-green-100"
                    >
                        <Eye className="h-3 w-3" />
                        Preview Completo do Funil
                    </Button>
                </div>
                <div className="flex flex-wrap gap-2 mt-2">
                    {presets.map(p => (
                        <Button key={p.key} size="sm" variant="outline" onClick={() => update(p.patch)} className="h-6 text-[11px] px-2">
                            <Wand2 className="h-3 w-3 mr-1" />{p.label}
                        </Button>
                    ))}
                </div>
            </CardHeader>
            <CardContent className="pt-0 overflow-auto">
                <Tabs value={tab} onValueChange={setTab} className="w-full">
                    <TabsList className="grid grid-cols-5 mb-4">
                        <TabsTrigger value="content">Conteúdo</TabsTrigger>
                        <TabsTrigger value="images" disabled={!supportsImages}>Imagens</TabsTrigger>
                        <TabsTrigger value="layout">Layout</TabsTrigger>
                        <TabsTrigger value="style">Estilo</TabsTrigger>
                        <TabsTrigger value="dynamic">Dinâmica</TabsTrigger>
                    </TabsList>

                    {/* Conteúdo */}
                    <TabsContent value="content" className="space-y-4">
                        <div>
                            <Label>Título</Label>
                            <Input defaultValue={props.title} placeholder="Título do resultado" onChange={e => update({ title: e.target.value })} />
                        </div>
                        <div>
                            <Label>Subtítulo</Label>
                            <Input defaultValue={props.subtitle} placeholder="Subtítulo" onChange={e => update({ subtitle: e.target.value })} />
                        </div>
                        <div>
                            <Label>Descrição</Label>
                            <Textarea defaultValue={props.description} rows={4} placeholder="Descrição explicativa" onChange={e => update({ description: e.target.value })} />
                        </div>
                        {isHeader && (
                            <div className="flex items-center justify-between">
                                <Label>Mostrar nome do usuário</Label>
                                <Switch checked={!!props.showUserName} onCheckedChange={v => update({ showUserName: v })} />
                            </div>
                        )}
                    </TabsContent>

                    {/* Imagens */}
                    <TabsContent value="images" className="space-y-4">
                        <div>
                            <Label>Imagem Principal (imageUrl)</Label>
                            <Input defaultValue={props.imageUrl} placeholder="https://..." onChange={e => update({ imageUrl: e.target.value })} />
                        </div>
                        <div className="flex items-center justify-between">
                            <Label>Mostrar duas imagens</Label>
                            <Switch checked={!!props.showBothImages} onCheckedChange={v => update({ showBothImages: v })} />
                        </div>
                        {props.showBothImages && (
                            <>
                                <div>
                                    <Label>Imagem Guia (guideImageUrl)</Label>
                                    <Input defaultValue={props.guideImageUrl} placeholder="https://..." onChange={e => update({ guideImageUrl: e.target.value })} />
                                </div>
                                <div>
                                    <Label>Imagem Estilo (styleGuideImageUrl)</Label>
                                    <Input defaultValue={props.styleGuideImageUrl} placeholder="https://..." onChange={e => update({ styleGuideImageUrl: e.target.value })} />
                                </div>
                            </>
                        )}
                    </TabsContent>

                    {/* Layout */}
                    <TabsContent value="layout" className="space-y-4">
                        <div>
                            <Label>Largura do Container</Label>
                            <Select defaultValue={props.containerWidth || 'full'} onValueChange={v => update({ containerWidth: v })}>
                                <SelectTrigger><SelectValue /></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="small">Small</SelectItem>
                                    <SelectItem value="medium">Medium</SelectItem>
                                    <SelectItem value="large">Large</SelectItem>
                                    <SelectItem value="full">Full</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div>
                            <Label>Espaçamento</Label>
                            <Select defaultValue={props.spacing || 'normal'} onValueChange={v => update({ spacing: v })}>
                                <SelectTrigger><SelectValue /></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="compact">Compacto</SelectItem>
                                    <SelectItem value="normal">Normal</SelectItem>
                                    <SelectItem value="relaxed">Relaxado</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div>
                            <Label>Alinhamento do Texto</Label>
                            <Select defaultValue={props.textAlign || 'center'} onValueChange={v => update({ textAlign: v })}>
                                <SelectTrigger><SelectValue /></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="left">Esquerda</SelectItem>
                                    <SelectItem value="center">Centro</SelectItem>
                                    <SelectItem value="right">Direita</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                            <div>
                                <Label>Margin Top</Label>
                                <Input type="number" defaultValue={props.marginTop ?? 0} onChange={e => update({ marginTop: Number(e.target.value) })} />
                            </div>
                            <div>
                                <Label>Margin Bottom</Label>
                                <Input type="number" defaultValue={props.marginBottom ?? 0} onChange={e => update({ marginBottom: Number(e.target.value) })} />
                            </div>
                        </div>
                        <div>
                            <Label>Variante Mobile</Label>
                            <Select defaultValue={props.mobileVariant || 'stack'} onValueChange={v => update({ mobileVariant: v })}>
                                <SelectTrigger><SelectValue /></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="stack">Stack</SelectItem>
                                    <SelectItem value="compact">Compact</SelectItem>
                                    <SelectItem value="minimal">Minimal</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </TabsContent>

                    {/* Estilo */}
                    <TabsContent value="style" className="space-y-4">
                        <div>
                            <Label>Cor de Fundo</Label>
                            <Input type="color" defaultValue={props.backgroundColor || '#FFFFFF'} onChange={e => update({ backgroundColor: e.target.value })} />
                        </div>
                        <div>
                            <Label>Cor da Borda</Label>
                            <Input type="color" defaultValue={props.borderColor || '#E5E7EB'} onChange={e => update({ borderColor: e.target.value })} />
                        </div>
                        <div className="flex items-center justify-between">
                            <Label>Mostrar Borda</Label>
                            <Switch checked={!!props.showBorder} onCheckedChange={v => update({ showBorder: v })} />
                        </div>
                        <div>
                            <Label>Cor do Progresso</Label>
                            <Input type="color" defaultValue={props.progressColor || '#B89B7A'} onChange={e => update({ progressColor: e.target.value })} />
                        </div>
                        <div>
                            <Label>Badge Text</Label>
                            <Input defaultValue={props.badgeText || 'Exclusivo'} onChange={e => update({ badgeText: e.target.value })} />
                        </div>
                    </TabsContent>

                    {/* Dinâmica */}
                    <TabsContent value="dynamic" className="space-y-4">
                        <div className="flex items-center justify-between">
                            <Label>Mostrar Dicas Especiais</Label>
                            <Switch checked={!!props.showSpecialTips} onCheckedChange={v => update({ showSpecialTips: v })} />
                        </div>
                        <div>
                            <Label>Override de Percentual (opcional)</Label>
                            <Input type="number" defaultValue={props.percentage ?? ''} placeholder="Ex: 78" onChange={e => update({ percentage: e.target.value ? Number(e.target.value) : undefined })} />
                        </div>
                    </TabsContent>
                </Tabs>
            </CardContent>
        </Card>
    );
};

export default ResultCommonPropertyEditor;
