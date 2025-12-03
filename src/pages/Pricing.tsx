import React from 'react';
import { Hero } from '@/components/marketing/Hero';
import { CTA } from '@/components/marketing/CTA';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle } from 'lucide-react';

const plans = [
    {
        name: 'Starter',
        price: 'R$0/mês',
        features: ['1 quiz ativo', 'Templates básicos', 'Coleta de leads'],
        highlight: false,
    },
    {
        name: 'Pro',
        price: 'R$99/mês',
        features: ['Quizzes ilimitados', 'Templates premium', 'Análises avançadas', 'Teste A/B'],
        highlight: true,
    },
    {
        name: 'Enterprise',
        price: 'Custom',
        features: ['SLA e suporte dedicado', 'Integrações avançadas', 'Onboarding personalizado'],
        highlight: false,
    },
];

export default function PricingPage() {
    return (
        <main className="min-h-screen bg-neon-black font-body">
            <Hero
                badge="Planos"
                title="Planos simples e transparentes"
                subtitle="Escolha o plano ideal para seu estágio de crescimento"
            />

            <section className="py-24 bg-neon-space">
                <div className="container mx-auto px-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
                        {plans.map((plan, idx) => (
                            <Card
                                key={idx}
                                className={`bg-gradient-to-tr from-[#0f1724]/70 to-[#020617]/90 border-translucent rounded-2xl shadow-soft ${plan.highlight ? 'border-2 border-neon-cyan' : ''
                                    }`}
                            >
                                <CardContent className="p-8">
                                    {plan.highlight && (
                                        <Badge className="mb-3 badge-translucent">Mais Popular</Badge>
                                    )}
                                    <div className="text-white text-xl font-bold mb-2 font-title">{plan.name}</div>
                                    <div className="text-4xl font-extrabold text-white mb-6">{plan.price}</div>
                                    <ul className="space-y-3 text-slate-300 mb-8">
                                        {plan.features.map((feat, i) => (
                                            <li key={i} className="flex items-center">
                                                <CheckCircle className="h-5 w-5 text-neon-blue mr-2" />
                                                {feat}
                                            </li>
                                        ))}
                                    </ul>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
            </section>

            <CTA
                title="Pronto para começar?"
                subtitle="Inicie seu teste gratuito e veja o impacto dos quizzes."
                buttons={[
                    {
                        label: 'Iniciar teste gratuito',
                        onClick: () => (window.location.href = '/criar-funil'),
                        variant: 'primary',
                    },
                    {
                        label: 'Falar com Vendas',
                        onClick: () => window.open('mailto:sales@quizflow.pro'),
                        variant: 'outline',
                    },
                ]}
            />
        </main>
    );
}
