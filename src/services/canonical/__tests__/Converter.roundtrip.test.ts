import { describe, it, expect } from 'vitest';
import { Converter } from '@/services/canonical/Converter';

const sampleV3 = {
  templateVersion: '3.0',
  metadata: {
    id: 'step-01-intro-v3',
    name: 'Introdução',
    category: 'intro',
  },
  theme: {
    colors: { primary: '#B89B7A' },
  },
  sections: [
    {
      id: 'intro-title-01',
      type: 'intro-title',
      content: { title: 'Bem-vinda' },
      style: { textColor: '#432818', padding: 16 },
      animation: { type: 'fade', duration: 400 }
    },
  ],
};

describe('Converter JSON v3 ⇄ UnifiedQuizStep', () => {
  it('fromJsonV3 preserva theme e animations nas propriedades', () => {
    const unified = Converter.fromJsonV3(sampleV3);
    expect(unified.theme).toEqual(sampleV3.theme);
    expect(unified.blocks?.[0]?.properties?.animation).toEqual(sampleV3.sections[0].animation);
  });

  it('round-trip json -> unified -> json preserva metadata, theme e animation', () => {
    const unified = Converter.fromJsonV3(sampleV3);
    const back = Converter.toJsonV3(unified);

    expect(back.templateVersion).toBe('3.0');
    expect(back.metadata?.id).toBe(sampleV3.metadata.id);
    expect(back.metadata?.name).toBe(sampleV3.metadata.name);
    expect(back.theme).toEqual(sampleV3.theme);
    expect(back.sections?.[0]?.animation).toEqual(sampleV3.sections[0].animation);
    expect(back.sections?.[0]?.style?.textColor).toBe(sampleV3.sections[0].style.textColor);
  });

  it('quando unified.sections não existem, mapeia de blocks com animation em propriedade', () => {
    const unified = Converter.fromJsonV3(sampleV3);
    // Remover sections para forçar reconstrução a partir de blocks
    unified.sections = [];
    const back = Converter.toJsonV3(unified);
    expect(back.sections?.[0]?.animation).toEqual(sampleV3.sections[0].animation);
    expect(back.sections?.[0]?.type).toBe('intro-title');
  });
});
