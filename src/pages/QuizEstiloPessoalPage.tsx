import QuizApp from '@/components/quiz/QuizApp';
import { Helmet } from 'react-helmet-async';
import '@/styles/globals.css';
import { useSearchParams } from 'react-router-dom';
import { usePublishedTemplate } from '@/hooks/usePublishedTemplate';
import { QUIZ_STEPS } from '@/data/quizSteps';
import { useMemo } from 'react';

/**
 * 🎯 QUIZ ESTILO PESSOAL - GISELE GALVÃO
 * 
 * Página principal do quiz de descoberta de estilo pessoal.
 * Usa os novos componentes modulares criados especificamente 
 * para o sistema da Gisele Galvão.
 * 
 * Funcionalidades:
 * - ✅ 21 etapas completas (intro + 10 perguntas + estratégicas + resultado + oferta)
 * - ✅ Sistema de pontuação por estilo (8 estilos disponíveis)
 * - ✅ Ofertas personalizadas baseadas nas respostas estratégicas
 * - ✅ Design com paleta de cores personalizada
 * - ✅ Responsive e otimizado
 * - ✅ Suporte a templates personalizados via funnelId
 */

interface QuizEstiloPessoalPageProps {
    funnelId?: string;
}

export default function QuizEstiloPessoalPage({ funnelId }: QuizEstiloPessoalPageProps) {
    const [searchParams] = useSearchParams();
    const refresh = searchParams.get('refresh') === '1';
    const templateId = 'quiz-estilo';
    // Hook carrega template publicado; refresh=1 força recarga ignorando cache
    const { data, loading, error } = usePublishedTemplate({ templateId, refreshFlag: refresh });

    const effectiveQuestions = useMemo(() => {
        if (data && data.questions?.length) return data.questions;
        // Fallback derivado de QUIZ_STEPS para manter compatibilidade
        return Object.values(QUIZ_STEPS).filter((s: any) => s.type !== 'intro-metadata');
    }, [data]);

    return (
        <div className="quiz-estilo-page">
            {/* Meta tags para SEO */}
            <Helmet>
                <title>Descubra Seu Estilo Pessoal - Quiz Completo | Gisele Galvão</title>
                <meta
                    name="description"
                    content="Descubra seu estilo pessoal único com nosso quiz completo. Natural, Clássico, Contemporâneo, Elegante, Romântico, Sexy, Dramático ou Criativo? Faça o teste agora!"
                />
                <meta name="keywords" content="estilo pessoal, moda, consultoria de imagem, Gisele Galvão, quiz de estilo" />
                <meta property="og:title" content="Descubra Seu Estilo Pessoal - Quiz Completo" />
                <meta property="og:description" content="Quiz completo para descobrir seu estilo pessoal único. Receba dicas personalizadas e ofertas exclusivas." />
                <meta property="og:type" content="website" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
            </Helmet>

            {/* Componente principal do quiz */}
            <main className="min-h-screen">
                {loading && (
                    <div className="p-6 text-center text-sm text-muted-foreground">
                        Carregando template publicado...
                    </div>
                )}
                {error && (
                    <div className="p-6 text-center text-sm text-red-500">
                        Erro ao carregar versão publicada. Usando fallback local.
                    </div>
                )}
                <QuizApp funnelId={funnelId} />
            </main>

            {/* Scripts de analytics (exemplo) */}
            <script
                dangerouslySetInnerHTML={{
                    __html: `
                        // Google Analytics ou outras ferramentas
                        console.log('Quiz Gisele Galvão - Página carregada');
                        console.log('Versão publicada carregada?', !!${'data'});
                        
                        // Tracking de início do quiz
                        if (typeof gtag !== 'undefined') {
                            gtag('event', 'quiz_started', {
                                event_category: 'engagement',
                                event_label: 'quiz_estilo_pessoal'
                            });
                        }
                    `
                }}
            />
        </div>
    );
}