/**
 * 🎨 COMPONENTE: Style Result Card (Card de Resultado de Estilo)
 * 
 * Componente especial para step-20 (result) que exibe o estilo predominante
 * calculado baseado nas respostas das perguntas 02-11.
 * 
 * Funcionalidades:
 * - Lê do quizState o resultStyle calculado
 * - Exibe card com imagem, nome, descrição do estilo
 * - Mostra estilos secundários
 * - Suporta variável {userName}
 * - Animações e transições suaves
 */

import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
    Sparkles,
    Heart,
    Star,
    Award,
    Check,
    ArrowRight,
    AlertCircle,
    Crown
} from 'lucide-react';
import { styleConfigGisele, type StyleId } from '@/data/styles';
import { motion } from 'framer-motion';
import { resolveStyleId } from '@/utils/styleIds';

// Tipos
export interface StyleResultCardProps {
    // Estado do quiz (vem do useQuizState)
    quizState?: {
        resultStyle: string; // ID do estilo predominante
        secondaryStyles: string[]; // IDs dos estilos secundários
        userName: string; // Nome do usuário
    };

    // OU dados diretos (para integração com ResultStep existente)
    resultStyle?: string;
    userName?: string;
    secondaryStyles?: string[];
    scores?: Record<string, number>; // Pontuações dos estilos

    // Para preview no editor (quando não tem quizState real)
    previewStyle?: StyleId;
    previewUserName?: string;

    mode?: 'result' | 'preview';
    onNext?: () => void;
    className?: string;
}

/**
 * Componente Style Result Card
 */
export function StyleResultCard({
    quizState,
    resultStyle: propResultStyle,
    userName: propUserName,
    secondaryStyles: propSecondaryStyles,
    scores,
    previewStyle,
    previewUserName = 'Maria',
    mode = 'result',
    onNext,
    className = ''
}: StyleResultCardProps) {
    const [isRevealing, setIsRevealing] = useState(false);

    // Determinar estilo a exibir (prioridade: props diretas > quizState > preview)
    const styleId = (
        propResultStyle ||
        quizState?.resultStyle ||
        previewStyle ||
        'clássico'
    ) as StyleId;

    const userName = propUserName || quizState?.userName || previewUserName;
    const secondaryStyles = propSecondaryStyles || quizState?.secondaryStyles || [];

    // Resolver ID do estilo (normalizar acentos)
    const resolvedStyleId = resolveStyleId(styleId);

    // Buscar dados do estilo
    const style = styleConfigGisele[resolvedStyleId];

    useEffect(() => {
        // Animação de reveal ao montar
        if (mode === 'result') {
            setIsRevealing(true);
            const timer = setTimeout(() => setIsRevealing(false), 2000);
            return () => clearTimeout(timer);
        }
    }, [mode]);

    if (!style) {
        return (
            <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                    Erro: Estilo "{styleId}" não encontrado
                </AlertDescription>
            </Alert>
        );
    }

    // Ícones por estilo
    const styleIcons: Record<string, any> = {
        'natural': Sparkles,
        'clássico': Crown,
        'contemporâneo': Star,
        'elegante': Award,
        'romântico': Heart,
        'sexy': Heart,
        'dramático': Star,
        'criativo': Sparkles
    };

    const Icon = styleIcons[styleId] || Award;

    return (
        <div className="max-w-4xl mx-auto space-y-8">
            {/* Animação de Reveal (apenas em modo result) */}
            {isRevealing && mode === 'result' && (
                <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className="text-center"
                >
                    <Sparkles className="h-16 w-16 mx-auto mb-4 text-[#B89B7A] animate-pulse" />
                    <p className="text-xl text-gray-600">Calculando seu estilo...</p>
                </motion.div>
            )}

            {/* Card Principal do Estilo */}
            {(!isRevealing || mode === 'preview') && (
                <motion.div
                    initial={mode === 'result' ? { opacity: 0, y: 20 } : {}}
                    animate={mode === 'result' ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.6, delay: 2 }}
                >
                    <Card className="border-4 border-[#B89B7A] overflow-hidden bg-gradient-to-br from-white to-[#fefefe]">
                        <CardHeader className="text-center pb-0">
                            <div className="mx-auto mb-4 relative">
                                <div className="absolute inset-0 bg-[#B89B7A]/20 blur-xl rounded-full" />
                                <Icon className="relative h-16 w-16 text-[#B89B7A] mx-auto" />
                            </div>

                            <CardTitle className="text-3xl md:text-4xl font-bold text-[#5b4135] mb-2">
                                {userName}, seu estilo predominante é:
                            </CardTitle>

                            <div className="inline-flex items-center gap-2 bg-[#B89B7A] text-white px-8 py-4 rounded-full text-2xl md:text-3xl font-bold mt-4">
                                <Crown className="h-8 w-8" />
                                {style.name}
                            </div>
                        </CardHeader>

                        <CardContent className="pt-8 space-y-6">
                            {/* Imagem do Estilo */}
                            {style.imageUrl && (
                                <div className="relative rounded-xl overflow-hidden border-4 border-[#B89B7A]/30">
                                    <img
                                        src={style.imageUrl}
                                        alt={style.name}
                                        className="w-full h-64 md:h-96 object-cover"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                                    <div className="absolute bottom-0 left-0 right-0 p-6">
                                        <Badge className="bg-[#B89B7A] text-white text-base px-4 py-2">
                                            Seu Estilo Único
                                        </Badge>
                                    </div>
                                </div>
                            )}

                            {/* Descrição */}
                            <div className="text-center space-y-4">
                                <p className="text-lg text-gray-700 leading-relaxed">
                                    {style.description}
                                </p>
                            </div>

                            {/* Características */}
                            <div>
                                <h3 className="text-xl font-semibold text-[#5b4135] mb-4 flex items-center gap-2">
                                    <Check className="h-5 w-5 text-[#B89B7A]" />
                                    Características do seu estilo:
                                </h3>
                                <div className="flex flex-wrap gap-2">
                                    {style.characteristics?.map((char: string, index: number) => (
                                        <Badge
                                            key={index}
                                            variant="outline"
                                            className="text-sm px-4 py-2 border-[#B89B7A] text-[#5b4135] capitalize"
                                        >
                                            {char}
                                        </Badge>
                                    ))}
                                </div>
                            </div>

                            {/* Recomendações */}
                            {style.recommendations && style.recommendations.length > 0 && (
                                <div>
                                    <h3 className="text-xl font-semibold text-[#5b4135] mb-4 flex items-center gap-2">
                                        <Star className="h-5 w-5 text-[#B89B7A]" />
                                        Recomendações para você:
                                    </h3>
                                    <ul className="space-y-2">
                                        {style.recommendations.map((rec: string, index: number) => (
                                            <li key={index} className="flex items-start gap-3 text-gray-700">
                                                <Check className="h-5 w-5 text-[#B89B7A] flex-shrink-0 mt-0.5" />
                                                <span className="capitalize">{rec}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}

                            {/* Estilos Secundários */}
                            {secondaryStyles && secondaryStyles.length > 0 && (
                                <div className="border-t pt-6">
                                    <h3 className="text-lg font-semibold text-[#5b4135] mb-4">
                                        Seus estilos complementares:
                                    </h3>
                                    <div className="grid grid-cols-2 gap-4">
                                        {secondaryStyles.map((secStyleId, index) => {
                                            const resolvedSecId = resolveStyleId(secStyleId);
                                            const secStyle = styleConfigGisele[resolvedSecId];
                                            if (!secStyle) return null;

                                            const SecIcon = styleIcons[secStyleId] || Award;

                                            return (
                                                <Card key={index} className="border-2 border-gray-200 hover:border-[#B89B7A] transition-colors">
                                                    <CardContent className="p-4">
                                                        <div className="flex items-center gap-3">
                                                            <SecIcon className="h-8 w-8 text-[#B89B7A]" />
                                                            <div>
                                                                <p className="font-semibold text-[#5b4135]">
                                                                    {secStyle.name}
                                                                </p>
                                                                <Badge variant="secondary" className="text-xs mt-1">
                                                                    #{index + 2}
                                                                </Badge>
                                                            </div>
                                                        </div>
                                                    </CardContent>
                                                </Card>
                                            );
                                        })}
                                    </div>
                                </div>
                            )}

                            {/* Botão de Ação */}
                            {onNext && (
                                <Button
                                    onClick={onNext}
                                    size="lg"
                                    className="w-full bg-[#B89B7A] hover:bg-[#a08464] text-white text-lg py-6 mt-8"
                                >
                                    Continuar
                                    <ArrowRight className="ml-2 h-5 w-5" />
                                </Button>
                            )}

                            {/* Badge de Preview (apenas no editor) */}
                            {mode === 'preview' && (
                                <div className="text-center pt-4">
                                    <Badge variant="secondary" className="text-xs">
                                        <Sparkles className="h-3 w-3 mr-1" />
                                        Preview - Resultado exibido após cálculo do quiz
                                    </Badge>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </motion.div>
            )}
        </div>
    );
}

export default StyleResultCard;
