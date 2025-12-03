import React from 'react';
import { Hero } from '@/components/marketing/Hero';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Sparkles } from 'lucide-react';

const templates = [
    { name: 'E-commerce Beleza', category: 'E-commerce', description: 'Descubra o produto ideal para seu perfil.' },
    { name: 'SaaS Qualificação', category: 'SaaS', description: 'Segmentação de leads por necessidade e porte.' },
    { name: 'EduTech Orientação', category: 'Educação', description: 'Indique trilhas com base em objetivos.' },
    { name: 'Consultoria Diagnóstico', category: 'Serviços', description: 'Mapeie dores e indique soluções.' },
];

export default function TemplatesPage() {
    return (
        <main className="min-h-screen bg-neon-black font-body">
            <Hero
                badge="Templates"
                title="Templates prontos para acelerar seu lançamento"
                subtitle="Biblioteca de layouts profissionais por setor para começar em minutos"
            />

            <section className="py-24 bg-neon-space">
                <div className="container mx-auto px-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {templates.map((tpl, idx) => (
                            <Card key={idx} className="p-0 border-translucent bg-gradient-to-tr from-[#0f1724]/60 to-[#020617]/90 shadow-soft rounded-2xl hover:shadow-neon transition-all">
                                <CardContent className="p-6">
                                    <div className="flex items-center gap-2 text-neon-blue mb-3">
                                        <Sparkles className="h-4 w-4" />
                                        <span className="text-slate-300 text-sm">{tpl.category}</span>
                                    </div>
                                    <h3 className="text-white text-xl font-title font-semibold mb-2">{tpl.name}</h3>
                                    <p className="text-slate-300 mb-6">{tpl.description}</p>
                                    <Button className="btn-neon shadow-neon">Usar template</Button>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
            </section>
        </main>
    );
}
