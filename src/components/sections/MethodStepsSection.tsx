/**
 * MethodStepsSection - Componente v3.0
 */

import React from 'react';
import { ThemeSystem } from '@/types/template-v3.types';

interface MethodStepsSectionProps {
  id: string;
  order: number;
  title?: string;
  props: any;
  theme: ThemeSystem;
  userData?: any;
  offerData?: any;
}

export const MethodStepsSection: React.FC<MethodStepsSectionProps> = ({
  id,
  props,
  theme,
}) => {
  return (
    <section id={id} style={{ padding: '2rem' }}>
      <h3>MethodStepsSection (implementação em andamento)</h3>
    </section>
  );
};

export default MethodStepsSection;
