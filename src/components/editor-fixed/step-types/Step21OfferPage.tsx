import React from 'react';
import {
  OfferHeader,
  OfferHeroSection,
  OfferProblemSection,
  OfferSolutionSection,
  OfferProductShowcase,
  OfferGuaranteeSection,
  OfferFaqSec        <OfferProductShowcase 
          title={products.title}
          subtitle={products.description || ''}
          products={products.items}
          pricing={{
            installments: {
              quantity: 12,
              amount: '97,00'
            },
            fullPrice: '997,00',
            discount: '50%',
            savings: '997,00',
            limitedOffer: true
          }}
          finalCtaText="Garantir Minha Vaga"
          finalCtaIcon="ShoppingCart" 
          finalCtaUrl="#comprar"
        />/offer';
import { withPropertyControls } from '@/components/editor/properties/core/withPropertyControls';
import type { BaseProperty } from '@/components/editor/properties/core/types';
import { PropertyType, PropertyCategory } from '@/hooks/useUnifiedProperties';
import { PropertyType, PropertyCategory } from '@/hooks/useUnifiedProperties'; from 'react';
import {
  OfferHeader,
  OfferHeroSection,
  OfferProblemSection,
  OfferSolutionSection,
  OfferProductShowcase,
  OfferGuaranteeSection,
  OfferFaqSection
} from '../offer';
import { withPropertyControls } from '@/components/editor/properties/core/withPropertyControls';
import type { BaseProperty, PropertyType, WithPropertyControlsProps } from '@/components/editor/properties/core/types';

interface Step21OfferPageProps {
  properties: BaseProperty[];
  onUpdate: (key: string, value: any) => void;
}



const Step21OfferPage: React.FC<Step21OfferPageProps> = ({ properties }) => {
  // Helper para obter valores de propriedades
  const getPropValue = (key: string) => {
    const prop = properties.find(p => p.key === key);
    return prop ? prop.value : undefined;
  };

  const header = getPropValue('header');
  const hero = getPropValue('hero');
  const problem = getPropValue('problem');
  const solution = getPropValue('solution');
  const products = getPropValue('products');
  const guarantee = getPropValue('guarantee');
  const faq = getPropValue('faq');

  return (
    <div className="offer-page">
      {header && <OfferHeader {...header} />}
      {hero && (
        <OfferHeroSection 
          title={hero.title}
          subtitle={hero.subtitle}
          heroImageUrl={hero.imageUrl}
          heroImageAlt={hero.imageAlt}
          heroImageWidth={hero.imageWidth}
          heroImageHeight={hero.imageHeight}
          ctaText={hero.ctaText}
          ctaUrl={hero.ctaUrl}
          ctaIcon="arrow-right"
          trustElements={[]}
          badgeText={hero.badgeText}
          badgeIcon={hero.badgeIcon}
          titleHighlight={hero.titleHighlight}
          titleSuffix={hero.titleSuffix}
        />
      )}
      {problem && <OfferProblemSection {...problem} />}
      {solution && (
        <OfferSolutionSection 
          title={solution.title}
          description={solution.description}
          benefits={solution.benefits}
          imageUrl={solution.imageUrl}
          imageAlt={solution.imageAlt}
          imageWidth={solution.imageWidth}
          imageHeight={solution.imageHeight}
          ctaText="Quero Começar Agora"
          ctaIcon="arrow-right"
          ctaUrl="#comprar"
          showCountdown={!!solution.countdown}
          countdownInitial={solution.countdown || { hours: 48, minutes: 0, seconds: 0 }}
        />
      )}
      {products && (
        <OfferProductShowcase 
          title={products.title}
          subtitle={products.description || ''}
          products={products.items}
          pricing={{
            installments: {
              quantity: 12,
              amount: '97,00'
            },
            fullPrice: '997,00',
            discount: '50%',
            savings: '997,00',
            limitedOffer: true
          }}
          finalCtaText="Garantir Minha Vaga"
          finalCtaIcon="ShoppingCart"
          finalCtaUrl="#comprar"
        />
      )}
      {guarantee && <OfferGuaranteeSection {...guarantee} />}
      {faq && <OfferFaqSection {...faq} />}
    </div>
  );
};

export default withPropertyControls(Step21OfferPage, {
  middlewares: {
    beforeUpdate: [],
    validation: [],
    afterUpdate: []
  },
  properties: [
    {
      key: 'header',
      type: PropertyType.OBJECT,
      label: 'Configurações do Header',
      category: PropertyCategory.CONTENT,
      value: {
        logoUrl: '',
        logoAlt: '',
        logoWidth: 96,
        logoHeight: 96,
        isSticky: true,
        backgroundColor: '#FFFFFF'
      }
    },
    {
      key: 'hero',
      type: PropertyType.OBJECT,
      label: 'Seção Hero',
      category: PropertyCategory.CONTENT,
      value: {
        title: '',
        subtitle: '',
        imageUrl: '',
        imageAlt: '',
        imageWidth: 800,
        imageHeight: 600,
        ctaText: 'Começar',
        ctaUrl: '#'
      }
    },
    {
      key: 'problem',
      type: PropertyType.OBJECT,
      label: 'Seção de Problemas',
      category: PropertyCategory.CONTENT,
      value: {
        title: '',
        problems: [],
        highlightText: '',
        imageUrl: '',
        imageAlt: '',
        imageWidth: 800,
        imageHeight: 600,
        layout: 'side-by-side'
      }
    },
    {
      key: 'solution',
      type: PropertyType.OBJECT,
      label: 'Seção de Solução',
      category: PropertyCategory.CONTENT,
      value: {
        title: '',
        description: '',
        benefits: [],
        imageUrl: '',
        imageAlt: '',
        imageWidth: 800,
        imageHeight: 600,
        countdown: {
          hours: 48,
          minutes: 0,
          seconds: 0
        }
      }
    },
    {
      key: 'products',
      type: PropertyType.OBJECT,
      label: 'Seção de Produtos',
      category: PropertyCategory.CONTENT,
      value: {
        title: '',
        description: '',
        items: []
      }
    },
    {
      key: 'guarantee',
      type: PropertyType.OBJECT,
      label: 'Seção de Garantia',
      category: PropertyCategory.CONTENT,
      value: {
        title: '',
        description: '',
        imageUrl: '',
        imageAlt: '',
        imageWidth: 800,
        imageHeight: 600,
        layout: 'centered'
      }
    },
    {
      key: 'faq',
      type: PropertyType.OBJECT,
      label: 'Seção FAQ',
      category: PropertyCategory.CONTENT,
      value: {
        title: '',
        questions: []
      }
    }
  ]
});
