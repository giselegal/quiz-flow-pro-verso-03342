/**
 * OfferSection - Se\u00e7\u00e3o de apresenta\u00e7\u00e3o da oferta (v3.0)
 */

import React from 'react';
import { ThemeSystem } from '@/types/template-v3.types';

interface OfferSectionProps {
  id: string;
  order: number;
  title?: string;
  props: any;
  theme: ThemeSystem;
  offerData?: any;
}

export const OfferSection: React.FC<OfferSectionProps> = ({
  id,
  props,
  theme,
  offerData = {},
}) => {
  const pricing = offerData.pricing || {};
  
  return (
    <section id={id} style={{ padding: '2rem', textAlign: 'center' }}>
      <h2 style={{ fontSize: '2rem', marginBottom: '1rem' }}>
        {offerData.productName || 'Oferta Especial'}
      </h2>
      <div style={{ fontSize: '3rem', fontWeight: 700, color: theme.colors.success }}>
        R$ {pricing.salePrice || '97,00'}
      </div>
      {pricing.installments && (
        <div>ou {pricing.installments.count}x de R$ {pricing.installments.value}</div>
      )}
    </section>
  );
};

export default OfferSection;
