/**
 * 🧪 TESTE DO TEMPLATE PROCESSOR
 * Valida funcionamento do processador de templates dinâmicos
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { processTemplate, removeDuplicateConfig } from '../TemplateProcessor';
import type { DynamicTemplate } from '@/types/dynamic-template';

describe('TemplateProcessor', () => {
  let sampleTemplate: DynamicTemplate;

  beforeEach(() => {
    sampleTemplate = {
      templateVersion: '3.2',
      metadata: {
        id: 'test-01',
        name: 'Test Template',
        description: 'Template de teste',
        category: 'intro',
        tags: ['test'],
      },
      blocks: [
        {
          id: 'block-1',
          type: 'hero-block',
          properties: {
            titleHtml: '<span style="color: {{theme.colors.primary}}">Título</span>',
            imageUrl: '{{assets.hero-intro}}',
            logoUrl: '{{assets.logo-main}}',
          },
        },
      ],
    };
  });

  describe('processTemplate', () => {
    it('deve substituir variáveis de tema', () => {
      const result = processTemplate(sampleTemplate);

      expect(result.success).toBe(true);
      expect(result.template).toBeDefined();

      const block = result.template!.blocks[0];
      expect(block.properties?.titleHtml).toContain('#B89B7A'); // Primary color
      expect(block.properties?.titleHtml).not.toContain('{{theme');
    });

    it('deve substituir variáveis de assets', () => {
      const result = processTemplate(sampleTemplate);

      expect(result.success).toBe(true);

      const block = result.template!.blocks[0];
      expect(block.properties?.imageUrl).toContain('cloudinary.com');
      expect(block.properties?.logoUrl).toContain('cloudinary.com');
      expect(block.properties?.imageUrl).not.toContain('{{assets');
    });

    it('deve contar variáveis substituídas', () => {
      const result = processTemplate(sampleTemplate);

      expect(result.stats).toBeDefined();
      expect(result.stats!.variablesReplaced).toBeGreaterThan(0);
      expect(result.stats!.blocksProcessed).toBe(1);
    });

    it('deve processar múltiplos blocos', () => {
      sampleTemplate.blocks.push({
        id: 'block-2',
        type: 'text-block',
        properties: {
          text: 'Cor: {{theme.colors.secondary}}',
        },
      });

      const result = processTemplate(sampleTemplate);

      expect(result.success).toBe(true);
      expect(result.stats!.blocksProcessed).toBe(2);
      expect(result.template!.blocks[1].properties.text).toContain('#432818');
    });

    it('deve manter valores sem variáveis intactos', () => {
      sampleTemplate.blocks[0].properties.staticText = 'Texto estático';

      const result = processTemplate(sampleTemplate);

      expect(result.success).toBe(true);
      expect(result.template!.blocks[0].properties.staticText).toBe('Texto estático');
    });

    it('deve processar arrays de opções', () => {
      sampleTemplate.blocks[0].properties.options = [
        { id: 'opt1', color: '{{theme.colors.primary}}' },
        { id: 'opt2', color: '{{theme.colors.secondary}}' },
      ];

      const result = processTemplate(sampleTemplate);

      expect(result.success).toBe(true);
      const options = result.template!.blocks[0].properties.options;
      expect(options[0].color).toBe('#B89B7A');
      expect(options[1].color).toBe('#432818');
    });

    it('deve avisar sobre variáveis não encontradas', () => {
      sampleTemplate.blocks[0].properties.invalid = '{{theme.colors.nonexistent}}';

      const result = processTemplate(sampleTemplate);

      expect(result.success).toBe(true);
      expect(result.warnings).toBeDefined();
      expect(result.warnings!.length).toBeGreaterThan(0);
    });
  });

  describe('removeDuplicateConfig', () => {
    it('deve remover config quando idêntico a properties', () => {
      const templateWithDuplication = {
        ...sampleTemplate,
        blocks: [
          {
            id: 'block-1',
            type: 'hero-block',
            config: { title: 'Título' },
            properties: { title: 'Título' },
          },
        ],
      };

      const cleaned = removeDuplicateConfig(templateWithDuplication);

      expect(cleaned.blocks[0].config).toBeUndefined();
      expect(cleaned.blocks[0].properties).toBeDefined();
    });

    it('deve manter config quando diferente de properties', () => {
      const templateWithDifference = {
        ...sampleTemplate,
        blocks: [
          {
            id: 'block-1',
            type: 'hero-block',
            config: { title: 'Título 1' },
            properties: { title: 'Título 2' },
          },
        ],
      };

      const cleaned = removeDuplicateConfig(templateWithDifference);

      expect(cleaned.blocks[0].config).toBeDefined();
      expect(cleaned.blocks[0].properties).toBeDefined();
    });
  });

  describe('integração completa', () => {
    it('deve processar template real step-01', () => {
      const realTemplate: DynamicTemplate = {
        templateVersion: '3.2',
        metadata: {
          id: 'step-01',
          name: 'Intro (Blocos)',
          description: 'Etapa inicial com hero e formulário de nome',
          category: 'intro',
          tags: ['intro', 'form'],
        },
        blocks: [
          {
            id: 'hero-1',
            type: 'hero-block',
            properties: {
              titleHtml: '<span style="color: {{theme.colors.primary}}">Chega</span>',
              imageUrl: '{{assets.hero-intro}}',
              logoUrl: '{{assets.logo-main}}',
            },
          },
          {
            id: 'welcome-form-1',
            type: 'welcome-form-block',
            properties: {
              questionLabel: 'Como posso te chamar?',
              buttonText: 'Quero Descobrir meu Estilo Agora!',
            },
          },
        ],
      };

      const result = processTemplate(realTemplate);

      expect(result.success).toBe(true);
      expect(result.stats!.blocksProcessed).toBe(2);
      expect(result.stats!.variablesReplaced).toBeGreaterThanOrEqual(3);

      // Valida primeiro bloco
      const hero = result.template!.blocks[0];
      expect(hero.properties.titleHtml).toContain('#B89B7A');
      expect(hero.properties.imageUrl).toContain('cloudinary.com');
      expect(hero.properties.logoUrl).toContain('cloudinary.com');

      // Valida segundo bloco (sem variáveis)
      const form = result.template!.blocks[1];
      expect(form.properties.questionLabel).toBe('Como posso te chamar?');
    });
  });
});
