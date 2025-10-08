import QuizApp from '@/components/quiz/QuizApp';
import { Helmet } from 'react-helmet-async';
import '@/styles/globals.css';

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
    // Suporte a preview de draft via ?draft=<draft-id>
    let queryDraftId: string | null = null;
    try {
        if (typeof window !== 'undefined') {
            const params = new URLSearchParams(window.location.search);
            queryDraftId = params.get('draft');
        }
    } catch {
        // ignore
    }

    // Prioridade: query ?draft > prop funnelId de rota > fallback fixo
    const effectiveFunnelId = queryDraftId || funnelId || 'quiz-estilo-21-steps';

    if (import.meta.env.DEV) {
        // eslint-disable-next-line no-console
        console.log('[QuizEstiloPessoalPage] funnelId prop:', funnelId, 'draftParam:', queryDraftId, 'effective:', effectiveFunnelId);
    }
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
                <QuizApp funnelId={effectiveFunnelId} />
            </main>

            {/* Scripts de analytics (exemplo) */}
            <script
                dangerouslySetInnerHTML={{
                    __html: `
                        // Google Analytics ou outras ferramentas
                        console.log('Quiz Gisele Galvão - Página carregada');
                        
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