// @ts-nocheck
import React from 'react';

/**
 * ✅ ResultPage (Stub Temporário)
 * Fornece implementação mínima para destravar o build.
 * Substituir depois por versão completa (com ofertas, CTA, etc.).
 */
const ResultPage: React.FC = () => {
    // Recupera nome salvo (se existir)
    const userName = (typeof window !== 'undefined' && localStorage.getItem('quizUserName')) || 'Visitante';

    return (
        <div className="max-w-3xl mx-auto py-16 px-6">
            <div className="text-center space-y-6">
                <h1 className="text-4xl font-extrabold tracking-tight text-[#432818]">
                    Resultado do Seu Estilo
                </h1>
                <p className="text-lg text-[#6B4F43]">
                    Obrigado por concluir o quiz, <span className="font-semibold">{userName}</span>.
                </p>
                <div className="p-6 rounded-xl bg-gradient-to-br from-[#FAF9F7] via-[#F5F2E9] to-[#EEEBE1] shadow-sm border border-[#E6E0D4]">
                    <p className="text-[#5C4539] leading-relaxed">
                        Esta é uma página de resultado placeholder. Aqui você poderá:
                    </p>
                    <ul className="list-disc text-left mt-4 ml-6 space-y-1 text-[#5C4539]">
                        <li>Mostrar o perfil/arquétipo calculado</li>
                        <li>Exibir recomendações personalizadas</li>
                        <li>Renderizar um bloco de oferta (upsell)</li>
                        <li>Incluir CTAs dinâmicos baseados nas respostas</li>
                    </ul>
                </div>
                <div className="space-y-4">
                    <button
                        onClick={() => window.location.href = '/editor?template=quiz-estilo-21-steps'}
                        className="bg-[#8B7355] hover:bg-[#7A6247] text-white px-6 py-3 rounded-lg font-medium transition-colors"
                    >
                        Voltar ao Editor (Quiz)
                    </button>
                    <div className="text-xs text-[#937B63]">
                        (Substitua este stub por sua implementação final em `src/pages/ResultPage.tsx`.)
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ResultPage;
