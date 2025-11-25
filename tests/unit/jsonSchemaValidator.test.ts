/**
 * 🧪 JSON Schema Validation Tests
 *
 * Tests for the JSON Schema validator using Draft 2020-12 schemas.
 * Validates templates, components, stages, logic, and outcomes.
 */

import { describe, it, expect } from 'vitest';
import {
  validate,
  validateTemplate,
  validateTemplateV4,
  validateComponent,
  validateStage,
  validateLogic,
  validateOutcome,
  hasSchemaReference,
  getSchemaInfo,
  type SchemaType,
} from '@/lib/validation/jsonSchemaValidator';

describe('JSON Schema Validator', () => {
  describe('Schema Registration', () => {
    it('should have all schemas registered', () => {
      const schemaTypes: SchemaType[] = [
        'template',
        'component',
        'stage',
        'logic',
        'outcome',
        'quiz-template-v4',
      ];

      schemaTypes.forEach((type) => {
        const info = getSchemaInfo(type);
        expect(info).not.toBeNull();
        expect(info?.version).toBe('draft/2020-12');
      });
    });
  });

  describe('Template Validation', () => {
    it('should validate a valid template', () => {
      const validTemplate = {
        id: 'test-template',
        name: 'Test Template',
        description: 'A test template',
        templateVersion: '1.0.0',
      };

      const result = validateTemplate(validTemplate);
      expect(result.valid).toBe(true);
      expect(result.errors).toBeUndefined();
    });

    it('should reject template without required id field', () => {
      const invalidTemplate = {
        name: 'Test Template',
      };

      const result = validateTemplate(invalidTemplate);
      expect(result.valid).toBe(false);
      expect(result.errors).toBeDefined();
    });

    it('should reject template with invalid id pattern', () => {
      const invalidTemplate = {
        id: 'invalid id with spaces!',
        name: 'Test Template',
      };

      const result = validateTemplate(invalidTemplate);
      expect(result.valid).toBe(false);
    });
  });

  describe('Template V4 Validation', () => {
    it('should validate a complete v4 template', () => {
      const v4Template = {
        version: '4.0.0',
        schemaVersion: '1.0',
        metadata: {
          id: 'quiz-template-v4',
          name: 'Quiz Template V4',
          description: 'A complete v4 template',
          author: 'Test',
        },
        settings: {
          minStages: 1,
          maxStages: 30,
        },
        stages: [
          {
            id: 'step-01',
            name: 'Introduction',
            type: 'intro',
            order: 0,
            blocks: [
              {
                id: 'block-1',
                type: 'heading',
                content: { text: 'Welcome!' },
              },
            ],
          },
        ],
      };

      const result = validateTemplateV4(v4Template);
      expect(result.valid).toBe(true);
    });

    it('should reject v4 template with invalid version format', () => {
      const invalidTemplate = {
        version: 'invalid',
        metadata: {
          id: 'test',
          name: 'Test',
        },
      };

      const result = validateTemplateV4(invalidTemplate);
      expect(result.valid).toBe(false);
    });
  });

  describe('Component Validation', () => {
    it('should validate a valid component', () => {
      const validComponent = {
        id: 'component-1',
        type: 'heading',
        content: { text: 'Hello' },
        properties: { level: 1 },
      };

      const result = validateComponent(validComponent);
      expect(result.valid).toBe(true);
    });

    it('should require type field', () => {
      const invalidComponent = {
        id: 'component-1',
        content: { text: 'Hello' },
      };

      const result = validateComponent(invalidComponent);
      expect(result.valid).toBe(false);
      expect(result.errorMessages?.some((msg) => msg.includes('type'))).toBe(true);
    });

    it('should validate component with valid type enum', () => {
      const validTypes = ['heading', 'text', 'button', 'image', 'question-single'];

      validTypes.forEach((type) => {
        const component = { id: 'test', type };
        const result = validateComponent(component);
        expect(result.valid).toBe(true);
      });
    });
  });

  describe('Stage Validation', () => {
    it('should validate a valid stage', () => {
      const validStage = {
        id: 'stage-1',
        name: 'Introduction',
        type: 'intro',
        order: 0,
        blocks: [],
      };

      const result = validateStage(validStage);
      expect(result.valid).toBe(true);
    });

    it('should require id field', () => {
      const invalidStage = {
        name: 'Stage without ID',
        type: 'intro',
      };

      const result = validateStage(invalidStage);
      expect(result.valid).toBe(false);
    });

    it('should validate stage type enum', () => {
      const validTypes = ['intro', 'question', 'transition', 'result', 'offer', 'custom'];

      validTypes.forEach((type) => {
        const stage = { id: 'test', type };
        const result = validateStage(stage);
        expect(result.valid).toBe(true);
      });
    });
  });

  describe('Logic Validation', () => {
    it('should validate valid logic configuration', () => {
      const validLogic = {
        conditions: [
          {
            id: 'condition-1',
            operator: 'equals',
            left: 'score',
            right: 100,
          },
        ],
        actions: [
          {
            type: 'navigate',
            params: { target: 'result' },
          },
        ],
        rules: [
          {
            when: 'score > 50',
            then: ['showResult'],
          },
        ],
      };

      const result = validateLogic(validLogic);
      expect(result.valid).toBe(true);
    });

    it('should require operator in conditions', () => {
      const invalidLogic = {
        conditions: [
          {
            id: 'condition-1',
            left: 'score',
            right: 100,
          },
        ],
      };

      const result = validateLogic(invalidLogic);
      expect(result.valid).toBe(false);
    });

    it('should require type in actions', () => {
      const invalidLogic = {
        actions: [
          {
            params: { target: 'result' },
          },
        ],
      };

      const result = validateLogic(invalidLogic);
      expect(result.valid).toBe(false);
    });
  });

  describe('Outcome Validation', () => {
    it('should validate a valid outcome', () => {
      const validOutcome = {
        id: 'outcome-1',
        title: 'Classic Style',
        description: 'You have a classic style',
        scoreRange: { min: 0, max: 50 },
      };

      const result = validateOutcome(validOutcome);
      expect(result.valid).toBe(true);
    });

    it('should require id and title', () => {
      const invalidOutcome = {
        description: 'Missing required fields',
      };

      const result = validateOutcome(invalidOutcome);
      expect(result.valid).toBe(false);
    });
  });

  describe('hasSchemaReference', () => {
    it('should detect $schema reference', () => {
      const withSchema = {
        $schema: '/schemas/quiz-template-v4.schema.json',
        version: '4.0.0',
      };

      expect(hasSchemaReference(withSchema)).toBe(true);
    });

    it('should detect json-schema.org URLs', () => {
      const withSchema = {
        $schema: 'https://json-schema.org/draft/2020-12/schema',
      };

      expect(hasSchemaReference(withSchema)).toBe(true);
    });

    it('should reject invalid schema paths', () => {
      const withInvalidSchema = {
        $schema: 'not-a-valid-schema',
      };

      expect(hasSchemaReference(withInvalidSchema)).toBe(false);
    });

    it('should return false for missing $schema', () => {
      const withoutSchema = {
        version: '4.0.0',
      };

      expect(hasSchemaReference(withoutSchema)).toBe(false);
    });

    it('should handle non-object inputs', () => {
      expect(hasSchemaReference(null)).toBe(false);
      expect(hasSchemaReference(undefined)).toBe(false);
      expect(hasSchemaReference('string')).toBe(false);
      expect(hasSchemaReference(123)).toBe(false);
    });
  });

  describe('Error Formatting', () => {
    it('should format errors into readable messages', () => {
      const invalidTemplate = {
        id: 'invalid id!',
        name: '',
      };

      const result = validateTemplate(invalidTemplate);
      expect(result.errorMessages).toBeDefined();
      expect(result.errorMessages?.length).toBeGreaterThan(0);
      expect(typeof result.errorMessages?.[0]).toBe('string');
    });
  });

  describe('validate() generic function', () => {
    it('should work with all schema types', () => {
      interface TestCase {
        type: SchemaType;
        data: Record<string, unknown>;
        expectedValid: boolean;
      }
      
      const testCases: TestCase[] = [
        { type: 'template', data: { id: 'test', name: 'Test' }, expectedValid: true },
        { type: 'component', data: { type: 'heading' }, expectedValid: true },
        { type: 'stage', data: { id: 'stage-1' }, expectedValid: true },
        { type: 'logic', data: {}, expectedValid: true },
        { type: 'outcome', data: { id: 'o1', title: 'Test' }, expectedValid: true },
      ];

      testCases.forEach(({ type, data, expectedValid }) => {
        const result = validate(type, data);
        expect(result.valid).toBe(expectedValid);
      });
    });
  });
});
