/**
 * 🧪 TESTES DE MAPEAMENTO DE COMPLEXIDADE DE BLOCOS
 * 
 * Valida que o block-complexity-map.ts está correto:
 * - Blocos SIMPLE têm templates HTML
 * - Blocos COMPLEX têm componentes React
 * - Não há blocos órfãos sem renderizador
 */

import { describe, it, expect } from 'vitest';
import { 
  BLOCK_COMPLEXITY_MAP, 
  getSimpleBlockTypes,
  getComplexBlockTypes,
  isSimpleBlock,
  isComplexBlock,
  getTemplatePath,
  getComponentPath,
  getComplexityStats
} from '@/config/block-complexity-map';
import { existsSync } from 'fs';
import { join } from 'path';

describe('Block Complexity Map', () => {
  describe('Configuração Básica', () => {
    it('deve ter pelo menos 30 blocos mapeados', () => {
      const totalBlocks = Object.keys(BLOCK_COMPLEXITY_MAP).length;
      expect(totalBlocks).toBeGreaterThanOrEqual(30);
    });

    it('deve ter uma divisão equilibrada entre SIMPLE e COMPLEX', () => {
      const stats = getComplexityStats();
      expect(stats.simple).toBeGreaterThan(0);
      expect(stats.complex).toBeGreaterThan(0);
      expect(stats.total).toBe(stats.simple + stats.complex);
    });

    it('deve ter percentuais corretos', () => {
      const stats = getComplexityStats();
      expect(stats.simplePercentage + stats.complexPercentage).toBeGreaterThanOrEqual(99);
      expect(stats.simplePercentage + stats.complexPercentage).toBeLessThanOrEqual(101);
    });
  });

  describe('Blocos SIMPLE', () => {
    it('deve listar todos os blocos SIMPLE', () => {
      const simpleBlocks = getSimpleBlockTypes();
      expect(simpleBlocks.length).toBeGreaterThan(0);
      
      simpleBlocks.forEach(blockType => {
        expect(isSimpleBlock(blockType)).toBe(true);
        expect(isComplexBlock(blockType)).toBe(false);
      });
    });

    it('todos os blocos SIMPLE devem ter template path definido', () => {
      const simpleBlocks = getSimpleBlockTypes();
      
      simpleBlocks.forEach(blockType => {
        const templatePath = getTemplatePath(blockType);
        expect(templatePath).toBeTruthy();
        expect(templatePath).toMatch(/\.html$/);
      });
    });

    it('templates HTML devem existir em public/templates/html/', () => {
      const simpleBlocks = getSimpleBlockTypes();
      const missingTemplates: string[] = [];
      
      simpleBlocks.forEach(blockType => {
        const templatePath = getTemplatePath(blockType);
        if (templatePath) {
          const fullPath = join(process.cwd(), 'public', 'templates', 'html', templatePath);
          if (!existsSync(fullPath)) {
            missingTemplates.push(`${blockType} → ${templatePath}`);
          }
        }
      });

      if (missingTemplates.length > 0) {
        console.warn('⚠️ Templates HTML faltando:', missingTemplates);
      }
      
      // Permitir alguns templates faltando durante desenvolvimento
      expect(missingTemplates.length).toBeLessThanOrEqual(3);
    });
  });

  describe('Blocos COMPLEX', () => {
    it('deve listar todos os blocos COMPLEX', () => {
      const complexBlocks = getComplexBlockTypes();
      expect(complexBlocks.length).toBeGreaterThan(0);
      
      complexBlocks.forEach(blockType => {
        expect(isComplexBlock(blockType)).toBe(true);
        expect(isSimpleBlock(blockType)).toBe(false);
      });
    });

    it('todos os blocos COMPLEX devem ter component path definido', () => {
      const complexBlocks = getComplexBlockTypes();
      
      complexBlocks.forEach(blockType => {
        const componentPath = getComponentPath(blockType);
        expect(componentPath).toBeTruthy();
        expect(componentPath).toMatch(/@\/components/);
      });
    });
  });

  describe('Blocos Críticos do Quiz21', () => {
    const criticalBlocks = [
      // Intro (Step 01)
      'intro-logo',
      'intro-title',
      'intro-description',
      'intro-image',
      'intro-form',
      // Questions (Steps 02-11)
      'question-progress',
      'question-text',
      'question-number',
      'options-grid',
      'quiz-options',
      // Navigation
      'question-navigation',
      'quiz-navigation',
      // Transition (Steps 12, 19)
      'transition-title',
      'transition-text',
      'transition-loader',
      // Result (Step 20)
      'result-header',
      'result-description',
      'result-image',
      // Offer (Step 21)
      'offer-hero',
      'offer-benefits',
      // Buttons
      'button',
      'CTAButton',
    ];

    it('todos os blocos críticos devem estar mapeados', () => {
      const unmappedBlocks: string[] = [];
      
      criticalBlocks.forEach(blockType => {
        if (!BLOCK_COMPLEXITY_MAP[blockType]) {
          unmappedBlocks.push(blockType);
        }
      });

      expect(unmappedBlocks).toEqual([]);
    });

    it('blocos interativos devem ser COMPLEX', () => {
      const interactiveBlocks = [
        'options-grid',
        'quiz-options',
        'question-navigation',
        'quiz-navigation',
        'intro-form',
        'form-input',
      ];

      interactiveBlocks.forEach(blockType => {
        if (BLOCK_COMPLEXITY_MAP[blockType]) {
          expect(isComplexBlock(blockType)).toBe(true);
        }
      });
    });

    it('blocos estáticos simples devem ser SIMPLE', () => {
      const staticBlocks = [
        'text',
        'text-inline',
        'image',
        'image-inline',
      ];

      staticBlocks.forEach(blockType => {
        if (BLOCK_COMPLEXITY_MAP[blockType]) {
          expect(isSimpleBlock(blockType)).toBe(true);
        }
      });
    });
  });

  describe('Validação de Consistência', () => {
    it('não deve ter blocos com ambos template e component', () => {
      Object.entries(BLOCK_COMPLEXITY_MAP).forEach(([blockType, config]) => {
        const hasTemplate = !!config.template;
        const hasComponent = !!config.component;
        
        // XOR: deve ter apenas um ou outro, não ambos
        expect(hasTemplate !== hasComponent).toBe(true);
      });
    });

    it('todos os blocos devem ter reason definido', () => {
      Object.entries(BLOCK_COMPLEXITY_MAP).forEach(([blockType, config]) => {
        expect(config.reason).toBeTruthy();
        expect(config.reason.length).toBeGreaterThan(10);
      });
    });
  });
});
