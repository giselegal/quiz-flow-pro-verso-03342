import React, { useEffect, useState, useMemo } from 'react';
import { styleConfigGisele } from '@/data/styles';

interface PersistedResultPayload {
    userName?: string;
    primaryStyle?: string;
    secondaryStyles?: string[];
    timestamp?: string;
    offerKeyUsed?: string;
}

interface OfferContent {
    title?: string;
    description?: string;
    buttonText?: string;
    ctaLabel?: string;
    ctaUrl?: string;
    image?: string;
    testimonial?: { quote?: string; author?: string };
}

/**
 * ResultPage dinâmica: lê resultado e oferta persistidos (ou query) e renderiza bloco.
 * Responsável apenas por apresentação; lógica de cálculo permanece no editor/quiz runtime.
 */
const ResultPage: React.FC = () => {
    const [result, setResult] = useState<PersistedResultPayload | null>(null);
    const [offer, setOffer] = useState<OfferContent | null>(null);
    const [loading, setLoading] = useState(true);

    // Carregar dados persistidos (ex: localStorage) – pode ser substituído por API futura.
    useEffect(() => {
        try {
            const raw = localStorage.getItem('quizResultPayload');
            if (raw) {
                setResult(JSON.parse(raw));
            } else {
                // Fallback minimalista (compatível com stub anterior)
                setResult({ userName: localStorage.getItem('quizUserName') || 'Visitante' });
            }
            // Recuperar offer serializada (salva pelo fluxo do editor quando finaliza simulação futuramente)
            const offerRaw = localStorage.getItem('quizSelectedOffer');
            if (offerRaw) setOffer(JSON.parse(offerRaw));
        } catch (e) {
            console.warn('Falha ao carregar resultado persistido:', e);
        } finally {
            setLoading(false);
        }
    }, []);

    const styleData = useMemo(() => {
        if (!result?.primaryStyle) return null;
        return (styleConfigGisele as any)[result.primaryStyle] || null;
    }, [result?.primaryStyle]);

    const secondaryLabels = useMemo(() => {
        if (!result?.secondaryStyles?.length) return [];
        return result.secondaryStyles
            .map(s => (styleConfigGisele as any)[s]?.name || s)
            .slice(0, 3);
    }, [result?.secondaryStyles]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center text-sm text-muted-foreground">
                Carregando resultado...
            </div>
        );
    }

    const userName = result?.userName || 'Visitante';

    return (
        <div className="max-w-4xl mx-auto py-12 px-5 space-y-10">
            <header className="text-center space-y-4">
                <h1 className="text-3xl font-bold tracking-tight">
                    {result?.primaryStyle ? 'Seu Estilo Principal' : 'Resultado do Quiz'}
                </h1>
                <p className="text-sm text-muted-foreground">
                    {result?.primaryStyle ? (
                        <>Olá <strong>{userName}</strong>, identificamos seu estilo principal.</>
                    ) : (
                        <>Olá <strong>{userName}</strong>, finalize um quiz para ver detalhes completos.</>
                    )}
                </p>
            </header>

            {result?.primaryStyle && (
                <section className="rounded border p-6 bg-card/50 space-y-4">
                    <div className="flex flex-col gap-2">
                        <h2 className="text-xl font-semibold">Estilo: <span className="text-primary">{styleData?.name || result.primaryStyle}</span></h2>
                        {styleData?.specialTips && (
                            <ul className="list-disc pl-5 text-xs space-y-1">
                                {styleData.specialTips.slice(0, 5).map((t: string, i: number) => <li key={i}>{t}</li>)}
                            </ul>
                        )}
                        {secondaryLabels.length > 0 && (
                            <div className="text-xs text-muted-foreground">
                                Secundários: {secondaryLabels.join(', ')}
                            </div>
                        )}
                    </div>
                </section>
            )}

            <section className="space-y-4">
                <h3 className="font-semibold text-lg">Oferta Recomendada</h3>
                {offer ? (
                    <div className="rounded border p-6 bg-gradient-to-br from-background to-muted/30 space-y-3 text-sm">
                        {offer.image && <img src={offer.image} className="rounded max-w-sm" />}
                        {offer.title && <h4 className="text-primary font-semibold" dangerouslySetInnerHTML={{ __html: offer.title.replace?.('{userName}', userName) }} />}
                        {offer.description && <p className="text-muted-foreground whitespace-pre-line">{offer.description}</p>}
                        {offer.testimonial?.quote && (
                            <blockquote className="border-l-2 pl-3 italic text-xs opacity-80">
                                “{offer.testimonial.quote}” {offer.testimonial.author && <span className="font-medium">— {offer.testimonial.author}</span>}
                            </blockquote>
                        )}
                        {(offer.ctaLabel || offer.buttonText) && offer.ctaUrl && (
                            <a
                                href={offer.ctaUrl}
                                className="inline-block mt-2 px-4 py-2 rounded bg-primary text-primary-foreground text-xs font-medium hover:opacity-90"
                                target="_blank"
                                rel="noopener noreferrer"
                            >{offer.ctaLabel || offer.buttonText}</a>
                        )}
                    </div>
                ) : (
                    <p className="text-xs text-muted-foreground">Nenhuma oferta armazenada. Configure um step de oferta no editor.</p>
                )}
            </section>

            <footer className="pt-6 border-t">
                <div className="flex flex-col sm:flex-row justify-between items-center gap-3 text-[11px] text-muted-foreground">
                    <span>Gerado dinamicamente a partir do fluxo do quiz</span>
                    <button
                        onClick={() => (window.location.href = '/editor?mode=quiz')}
                        className="underline hover:text-primary"
                    >Voltar ao Editor</button>
                </div>
            </footer>
        </div>
    );
};

export default ResultPage;
