"use client";

import React from 'react';
import { getSalesPageConfig } from '@/config/salesPageConfig';
import type { StyleResult } from '@/types/quiz';

// Blocos reutilizáveis já existentes em quiz-result/sales
import HeroSection from "@/components/quiz/result-pages/sales/HeroSection";
import ProductShowcase from "@/components/quiz/result-pages/sales/ProductShowcase";
import BenefitList from "@/components/quiz/result-pages/sales/BenefitList";
import Testimonials from "@/components/quiz/result-pages/sales/Testimonials";
import Guarantee from "@/components/quiz/result-pages/sales/Guarantee";
import PricingSection from "@/components/quiz/result-pages/sales/PricingSection";
import TransformationBlock from '@/components/sales/TransformationBlock';

type SalesPageFromConfigProps = {
  style: StyleResult;
  heroImageUrl?: string;
};

/**
 * Página de Vendas montada a partir de getSalesPageConfig(style)
 * Reutiliza componentes em src/components/quiz-result/sales/*
 */
const SalesPageFromConfig: React.FC<SalesPageFromConfigProps> = ({ style, heroImageUrl }) => {
  const cfg = getSalesPageConfig(style);

  const handleCta = () => {
    // Redireciona para URL configurada (pode ser enriquecida com UTM externamente)
    window.location.href = cfg.ctaUrl;
  };

  return (
    <div className="min-h-screen bg-[#fffaf7]">
      {/* Hero */}
      <HeroSection
        title={cfg.title}
        subtitle={cfg.subtitle}
        imageUrl={
          heroImageUrl ||
          'https://res.cloudinary.com/dqljyf76t/image/upload/v1744911666/C%C3%B3pia_de_Template_Dossi%C3%AA_Completo_2024_15_-_Copia_ssrhu3.webp'
        }
        ctaText={cfg.ctaText}
        onCtaClick={handleCta}
      />

      <main className="container mx-auto px-4 py-8 space-y-12">
        {/* Destaque de Produto/Benefícios visuais */}
        <ProductShowcase />

        {/* Lista de Benefícios (usa defaults se nenhum for passado) */}
        <BenefitList />

        {/* Depoimentos */}
        <Testimonials />

        {/* Garantia */}
        <Guarantee text={`Garantia incondicional de ${cfg.guaranteeDays} dias. Se não amar, devolvemos 100%.`} />

        {/* Seção de Preço e CTA (mapeada da config) */}
        <PricingSection
          price={cfg.price}
          regularPrice={cfg.regularPrice}
          ctaText={cfg.ctaText}
          ctaUrl={cfg.ctaUrl}
        />

        {/* Bloco de transformação adicional (opcional) */}
        <TransformationBlock />
      </main>
    </div>
  );
};

export default SalesPageFromConfig;
