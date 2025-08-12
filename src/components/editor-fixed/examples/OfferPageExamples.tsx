import React from 'react';
import { OfferHeader, OfferHeroSection, OfferPageJson } from '@/components/editor-fixed';

/**
 * 🎯 EXEMPLO: Página de Oferta da Etapa 21
 *
 * Demonstra como usar o sistema JSON/JavaScript modular
 * para renderizar uma página de oferta completa
 */

// ===== OPÇÃO 1: Usando OfferPageJson (Recomendado) =====
export const OfferPage21Example: React.FC = () => {
  return <OfferPageJson stepNumber={21} templateName="step-21-template" />;
};

// ===== OPÇÃO 2: Usando componentes individuais =====
export const OfferPageManualExample: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#FFFBF7]">
      {/* Header */}
      <OfferHeader
        logoUrl="https://res.cloudinary.com/dqljyf76t/image/upload/v1744911572/LOGO_DA_MARCA_GISELE_r14oz2.webp"
        logoAlt="Logo Gisele Galvão"
        logoWidth={180}
        logoHeight={80}
        isSticky={true}
        backgroundColor="rgba(255, 255, 255, 0.9)"
        backdropBlur={true}
      />

      {/* Hero Section */}
      <OfferHeroSection
        badgeText="3000+ mulheres transformadas"
        badgeIcon="Award"
        title="Etapa 21:"
        titleHighlight="Oferta Exclusiva"
        titleSuffix="Para Seu Estilo!"
        subtitle="Leve sua transformação de estilo para o próximo nível com nosso **Guia Completo personalizado** para seu resultado"
        heroImageUrl="https://res.cloudinary.com/dqljyf76t/image/upload/v1745193445/4fb35a75-02dd-40b9-adae-854e90228675_ibkrmt.webp"
        heroImageAlt="Transformação de guarda-roupa"
        heroImageWidth={600}
        heroImageHeight={400}
        ctaText="Sim! Quero Garantir Meu Acesso"
        ctaIcon="ArrowRight"
        ctaUrl="https://pay.hotmart.com/W98977034C?checkoutMode=10&bid=1744967466912"
        trustElements={[
          { icon: 'Lock', text: '100% Seguro' },
          { icon: 'Shield', text: '7 Dias Garantia' },
        ]}
      />

      {/* Outras seções... */}
    </div>
  );
};

// ===== OPÇÃO 3: Editável com JSON customizado =====
export const OfferPageCustomExample: React.FC = () => {
  const [customBlocks] = React.useState([
    {
      id: 'custom-hero',
      type: 'offer-hero-section',
      properties: {
        badgeText: 'Oferta Personalizada',
        title: 'Sua Transformação',
        titleHighlight: 'Começa Aqui',
        // ... outras propriedades
      },
    },
    // ... outros blocos
  ]);

  return (
    <div>
      {/* Renderizar blocos customizados */}
      {customBlocks.map(block => {
        // Lógica de renderização personalizada
        return <div key={block.id}>Componente customizado</div>;
      })}
    </div>
  );
};

export default OfferPage21Example;
