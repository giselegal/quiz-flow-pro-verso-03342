/**
 * 🧪 TESTES DE RENDERIZAÇÃO DE BLOCOS
 * 
 * Valida que todos os blocos renderizam corretamente sem "Sem conteúdo"
 */

import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BLOCK_COMPLEXITY_MAP, getSimpleBlockTypes, getComplexBlockTypes } from '@/config/block-complexity-map';
import UniversalBlockRenderer from '@/components/editor/blocks/UniversalBlockRenderer';
import type { Block } from '@/types/editor';

// Mock do logger para evitar poluição no console
vi.mock('@/utils/logger', () => ({
  appLogger: {
    info: vi.fn(),
    warn: vi.fn(),
    error: vi.fn(),
    debug: vi.fn(),
  },
}));

describe('Block Rendering - Universal Block Renderer', () => {
  describe('Renderização de Blocos SIMPLE', () => {
    const simpleBlocks = getSimpleBlockTypes();

    it('deve renderizar blocos SIMPLE sem erro', () => {
      const testBlock: Block = {
        id: 'test-text-1',
        type: 'text',
        order: 1,
        parentId: null,
        properties: {
          text: 'Texto de teste',
          textAlign: 'left',
          color: '#000000',
        },
        content: {
          text: 'Texto de teste',
        },
      };

      const { container } = render(
        <UniversalBlockRenderer block={testBlock} />
      );

      expect(container.firstChild).toBeTruthy();
    });

    // Testa uma amostra de blocos SIMPLE
    const sampleSimpleBlocks = ['text', 'button', 'spacer', 'divider'].filter(type => 
      simpleBlocks.includes(type)
    );

    sampleSimpleBlocks.forEach(blockType => {
      it(`bloco SIMPLE "${blockType}" deve renderizar com dados mínimos`, () => {
        const testBlock: Block = {
          id: `test-${blockType}-1`,
          type: blockType,
          order: 1,
          parentId: null,
          properties: getMinimalPropsForBlock(blockType),
          content: getMinimalContentForBlock(blockType),
        };

        const { container } = render(
          <UniversalBlockRenderer block={testBlock} />
        );

        expect(container.firstChild).toBeTruthy();
        
        // Não deve renderizar "Sem conteúdo"
        const noContentText = screen.queryByText(/sem conteúdo/i);
        expect(noContentText).toBeNull();
      });
    });
  });

  describe('Renderização de Blocos COMPLEX', () => {
    const complexBlocks = getComplexBlockTypes();

    // Testa uma amostra de blocos COMPLEX críticos
    const sampleComplexBlocks = [
      'intro-logo',
      'intro-title',
      'question-progress',
      'options-grid',
    ].filter(type => complexBlocks.includes(type));

    sampleComplexBlocks.forEach(blockType => {
      it(`bloco COMPLEX "${blockType}" deve renderizar com dados mínimos`, () => {
        const testBlock: Block = {
          id: `test-${blockType}-1`,
          type: blockType,
          order: 1,
          parentId: null,
          properties: getMinimalPropsForBlock(blockType),
          content: getMinimalContentForBlock(blockType),
        };

        const { container } = render(
          <UniversalBlockRenderer block={testBlock} />
        );

        expect(container.firstChild).toBeTruthy();
        
        // Não deve renderizar "Sem conteúdo"
        const noContentText = screen.queryByText(/sem conteúdo/i);
        expect(noContentText).toBeNull();
      });
    });
  });

  describe('Validação de Conteúdo Vazio', () => {
    it('blocos com content vazio devem ter fallback', () => {
      const testBlock: Block = {
        id: 'test-empty-1',
        type: 'text',
        order: 1,
        parentId: null,
        properties: {},
        content: {},
      };

      const { container } = render(
        <UniversalBlockRenderer block={testBlock} />
      );

      expect(container.firstChild).toBeTruthy();
    });

    it('blocos com properties vazias devem usar defaults', () => {
      const testBlock: Block = {
        id: 'test-empty-props-1',
        type: 'button',
        order: 1,
        parentId: null,
        properties: {},
        content: {
          text: 'Clique aqui',
        },
      };

      const { container } = render(
        <UniversalBlockRenderer block={testBlock} />
      );

      expect(container.firstChild).toBeTruthy();
    });
  });

  describe('Blocos Não Mapeados', () => {
    it('blocos desconhecidos devem ter fallback gracioso', () => {
      const testBlock: Block = {
        id: 'test-unknown-1',
        type: 'unknown-block-type',
        order: 1,
        parentId: null,
        properties: {},
        content: {},
      };

      const { container } = render(
        <UniversalBlockRenderer block={testBlock} />
      );

      // Deve renderizar algo (fallback) mesmo sem conhecer o tipo
      expect(container.firstChild).toBeTruthy();
    });
  });
});

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

function getMinimalPropsForBlock(blockType: string): Record<string, any> {
  const propsMap: Record<string, Record<string, any>> = {
    text: { text: 'Texto de exemplo', textAlign: 'left', color: '#000000' },
    'text-inline': { text: 'Texto inline', textAlign: 'left' },
    button: { text: 'Clique aqui', variant: 'primary' },
    'button-inline': { text: 'Botão', variant: 'primary' },
    spacer: { height: 20 },
    'spacer-inline': { height: 20 },
    divider: { thickness: 1, color: 'gray-300' },
    'divider-inline': { thickness: 1 },
    image: { src: 'https://placehold.co/400x300', alt: 'Imagem de teste' },
    'image-inline': { src: 'https://placehold.co/400x300', alt: 'Teste' },
    'intro-logo': { src: 'https://placehold.co/200x100', alt: 'Logo', width: 200, height: 100 },
    'intro-title': { text: 'Título', level: 1, textAlign: 'center' },
    'intro-description': { text: 'Descrição', textAlign: 'center' },
    'question-progress': { currentStep: 1, totalSteps: 21 },
    'question-text': { text: 'Pergunta de teste?' },
    'options-grid': { 
      options: [
        { id: 'opt1', text: 'Opção 1' },
        { id: 'opt2', text: 'Opção 2' },
      ],
    },
  };

  return propsMap[blockType] || { text: 'Placeholder' };
}

function getMinimalContentForBlock(blockType: string): Record<string, any> {
  const contentMap: Record<string, Record<string, any>> = {
    text: { text: 'Conteúdo de texto' },
    'text-inline': { text: 'Texto inline' },
    button: { text: 'Botão' },
    'button-inline': { text: 'Botão' },
    spacer: {},
    'spacer-inline': {},
    divider: {},
    'divider-inline': {},
    image: { src: 'https://placehold.co/400x300', alt: 'Imagem' },
    'image-inline': { src: 'https://placehold.co/400x300', alt: 'Imagem' },
    'intro-title': { text: 'Título' },
    'intro-description': { text: 'Descrição' },
    'question-text': { text: 'Pergunta?' },
    'options-grid': {
      options: [
        { id: 'opt1', text: 'Opção A' },
        { id: 'opt2', text: 'Opção B' },
      ],
    },
  };

  return contentMap[blockType] || {};
}
