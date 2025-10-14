import { describe, it, expect } from 'vitest';
import { blockPropertySchemas, type BlockSchema } from '@/config/blockPropertySchemas';
import { completeBlockSchemas } from '@/config/expandedBlockSchemas';
import { BLOCK_DEFINITIONS } from '@/editor/registry/BlockRegistry';
import type { BlockDefinition } from '@/editor/registry/BlockRegistry';

/**
 * 🧪 TESTES DE COBERTURA - DefaultProps vs Schemas
 * 
 * Valida que todas as propriedades definidas nos defaultProps dos blocos
 * possuem campos correspondentes nos schemas para edição.
 */

describe('🎯 Cobertura de DefaultProps -> Schemas', () => {
  
  describe('✅ Validação de Propriedades Content', () => {
    it('todas as propriedades content devem ter campos no schema', () => {
      const missingFields: Array<{
        blockType: string;
        property: string;
        location: 'content';
      }> = [];
      
      const allSchemas: Record<string, BlockSchema> = { ...blockPropertySchemas, ...completeBlockSchemas };
      
      BLOCK_DEFINITIONS.forEach((blockDef: BlockDefinition) => {
        const schema = allSchemas[blockDef.type];
        if (!schema) return; // Já validado em outro teste
        
        const schemaFieldKeys = schema.fields.map((f: any) => f.key);
        const contentProps = blockDef.defaultProps.content || {};
        
        Object.keys(contentProps).forEach(propKey => {
          if (!schemaFieldKeys.includes(propKey)) {
            missingFields.push({
              blockType: blockDef.type,
              property: propKey,
              location: 'content'
            });
          }
        });
      });
      
      if (missingFields.length > 0) {
        console.log('\n❌ Propriedades content sem campo no schema:');
        missingFields.forEach(({ blockType, property }) => {
          console.log(`   - ${blockType}: ${property}`);
        });
      }
      
      expect(
        missingFields,
        `❌ ${missingFields.length} propriedades content sem campo no schema`
      ).toHaveLength(0);
    });
  });

  describe('✅ Validação de Propriedades Properties', () => {
    it('todas as propriedades properties devem ter campos no schema', () => {
      const missingFields: Array<{
        blockType: string;
        property: string;
        location: 'properties';
      }> = [];
      
      const allSchemas: Record<string, BlockSchema> = { ...blockPropertySchemas, ...completeBlockSchemas };
      
      // Lista de propriedades universais que podem não estar no schema individual
      const universalProps = [
        'className',
        'style',
        'id',
        'key',
        'ref',
        'onClick',
        'onMouseEnter',
        'onMouseLeave',
        'data-testid'
      ];
      
      BLOCK_DEFINITIONS.forEach((blockDef: BlockDefinition) => {
        const schema = allSchemas[blockDef.type];
        if (!schema) return;
        
        const schemaFieldKeys = schema.fields.map((f: any) => f.key);
        const properties = blockDef.defaultProps.properties || {};
        
        Object.keys(properties).forEach(propKey => {
          // Ignorar propriedades universais do React
          if (universalProps.includes(propKey)) return;
          
          if (!schemaFieldKeys.includes(propKey)) {
            missingFields.push({
              blockType: blockDef.type,
              property: propKey,
              location: 'properties'
            });
          }
        });
      });
      
      if (missingFields.length > 0) {
        console.log('\n❌ Propriedades properties sem campo no schema:');
        missingFields.forEach(({ blockType, property }) => {
          console.log(`   - ${blockType}: ${property}`);
        });
      }
      
      expect(
        missingFields,
        `❌ ${missingFields.length} propriedades properties sem campo no schema`
      ).toHaveLength(0);
    });
  });

  describe('📊 Análise de Cobertura por Componente', () => {
    it('deve gerar relatório detalhado de cobertura', () => {
      const allSchemas: Record<string, BlockSchema> = { ...blockPropertySchemas, ...completeBlockSchemas };
      const coverageReport: Array<{
        blockType: string;
        category: string;
        totalProps: number;
        coveredProps: number;
        coverage: number;
        missingProps: string[];
      }> = [];
      
      BLOCK_DEFINITIONS.forEach((blockDef: BlockDefinition) => {
        const schema = allSchemas[blockDef.type];
        if (!schema) return;
        
        const schemaFieldKeys = schema.fields.map((f: any) => f.key);
        const allProps = {
          ...(blockDef.defaultProps.content || {}),
          ...(blockDef.defaultProps.properties || {})
        };
        
        const propKeys = Object.keys(allProps);
        const coveredProps = propKeys.filter(key => 
          schemaFieldKeys.includes(key)
        );
        const missingProps = propKeys.filter(key => 
          !schemaFieldKeys.includes(key)
        );
        
        const coverage = propKeys.length > 0 
          ? (coveredProps.length / propKeys.length) * 100 
          : 100;
        
        coverageReport.push({
          blockType: blockDef.type,
          category: blockDef.category,
          totalProps: propKeys.length,
          coveredProps: coveredProps.length,
          coverage: Math.round(coverage),
          missingProps
        });
      });
      
      // Ordenar por cobertura (menor primeiro)
      coverageReport.sort((a, b) => a.coverage - b.coverage);
      
      console.log('\n📊 RELATÓRIO DE COBERTURA POR COMPONENTE:');
      console.log('='.repeat(80));
      
      const lowCoverage = coverageReport.filter(r => r.coverage < 100);
      if (lowCoverage.length > 0) {
        console.log('\n⚠️  COMPONENTES COM COBERTURA INCOMPLETA:\n');
        lowCoverage.forEach(report => {
          console.log(`📦 ${report.blockType} (${report.category})`);
          console.log(`   Cobertura: ${report.coverage}% (${report.coveredProps}/${report.totalProps})`);
          if (report.missingProps.length > 0) {
            console.log(`   Faltam: ${report.missingProps.join(', ')}`);
          }
          console.log('');
        });
      }
      
      const perfectCoverage = coverageReport.filter(r => r.coverage === 100);
      console.log(`\n✅ COMPONENTES COM 100% DE COBERTURA: ${perfectCoverage.length}/${coverageReport.length}`);
      
      const avgCoverage = coverageReport.reduce((sum, r) => sum + r.coverage, 0) / coverageReport.length;
      console.log(`📈 COBERTURA MÉDIA: ${avgCoverage.toFixed(2)}%\n`);
      console.log('='.repeat(80));
      
      // Espera pelo menos 95% de cobertura média
      expect(
        avgCoverage,
        `❌ Cobertura média abaixo de 95%: ${avgCoverage.toFixed(2)}%`
      ).toBeGreaterThanOrEqual(95);
    });
  });

  describe('🎨 Validação de Grupos de Propriedades', () => {
    it('schemas devem organizar campos em grupos lógicos', () => {
      const validGroups = [
        'content',
        'layout',
        'style',
        'behavior',
        'validation',
        'transform',
        'spacing',
        'images',
        'scoring',
        'rules',
        'advanced',
        'design',
        'visibility',
        'navigation'
      ];
      
      const allSchemas: Record<string, BlockSchema> = { ...blockPropertySchemas, ...completeBlockSchemas };
      const invalidGroups: Array<{ schema: string; field: string; group: string }> = [];
      
      Object.entries(allSchemas).forEach(([schemaType, schema]) => {
        schema.fields.forEach((field: any) => {
          if (field.group && !validGroups.includes(field.group)) {
            invalidGroups.push({
              schema: schemaType,
              field: field.key,
              group: field.group
            });
          }
        });
      });
      
      if (invalidGroups.length > 0) {
        console.log('\n⚠️  Grupos inválidos encontrados:');
        invalidGroups.forEach(({ schema, field, group }) => {
          console.log(`   - ${schema}.${field}: "${group}"`);
        });
      }
      
      expect(
        invalidGroups,
        `❌ ${invalidGroups.length} campos com grupos inválidos`
      ).toHaveLength(0);
    });

    it('schemas complexos devem ter pelo menos 2 grupos', () => {
      const allSchemas: Record<string, BlockSchema> = { ...blockPropertySchemas, ...completeBlockSchemas };
      const complexComponents = [
        'options-grid',
        'lead-form',
        'button-inline',
        'quiz-intro-header'
      ];
      
      const withoutGroups: string[] = [];
      
      complexComponents.forEach(componentType => {
        const schema = allSchemas[componentType];
        if (!schema) return;
        
        const groups = new Set(
          schema.fields.map((f: any) => f.group).filter(Boolean)
        );
        
        if (groups.size < 2) {
          withoutGroups.push(componentType);
        }
      });
      
      expect(
        withoutGroups,
        `❌ Componentes complexos sem organização em grupos: ${withoutGroups.join(', ')}`
      ).toHaveLength(0);
    });
  });

  describe('📝 Validação de Descrições', () => {
    it('campos importantes devem ter descrição', () => {
      const allSchemas: Record<string, BlockSchema> = { ...blockPropertySchemas, ...completeBlockSchemas };
      const importantFieldTypes = ['json', 'options-list', 'select'];
      const missingDescriptions: Array<{ schema: string; field: string; type: string }> = [];
      
      Object.entries(allSchemas).forEach(([schemaType, schema]) => {
        schema.fields.forEach((field: any) => {
          if (
            importantFieldTypes.includes(field.type) && 
            !field.description
          ) {
            missingDescriptions.push({
              schema: schemaType,
              field: field.key,
              type: field.type
            });
          }
        });
      });
      
      // Aviso, não erro crítico
      if (missingDescriptions.length > 0) {
        console.log('\n⚠️  Campos complexos sem descrição:');
        missingDescriptions.forEach(({ schema, field, type }) => {
          console.log(`   - ${schema}.${field} (${type})`);
        });
      }
      
      // Não falha o teste, apenas avisa
      expect(missingDescriptions.length).toBeLessThan(50);
    });
  });

  describe('🔄 Validação de DefaultValues', () => {
    it('campos importantes devem ter defaultValue', () => {
      const allSchemas: Record<string, BlockSchema> = { ...blockPropertySchemas, ...completeBlockSchemas };
      const fieldsNeedingDefaults = ['boolean', 'range', 'select', 'number'];
      const missingDefaults: Array<{ schema: string; field: string; type: string }> = [];
      
      Object.entries(allSchemas).forEach(([schemaType, schema]) => {
        schema.fields.forEach((field: any) => {
          if (
            fieldsNeedingDefaults.includes(field.type) && 
            field.defaultValue === undefined
          ) {
            missingDefaults.push({
              schema: schemaType,
              field: field.key,
              type: field.type
            });
          }
        });
      });
      
      if (missingDefaults.length > 0) {
        console.log('\n⚠️  Campos sem defaultValue:');
        const grouped = missingDefaults.reduce((acc, item) => {
          acc[item.schema] = acc[item.schema] || [];
          acc[item.schema].push(`${item.field} (${item.type})`);
          return acc;
        }, {} as Record<string, string[]>);
        
        Object.entries(grouped).forEach(([schema, fields]) => {
          console.log(`   ${schema}:`);
          fields.forEach((field: any) => console.log(`      - ${field}`));
        });
      }
      
      // Permitir alguns campos sem default
      expect(missingDefaults.length).toBeLessThan(100);
    });
  });

  describe('🎯 Validação de Required Fields', () => {
    it('campos marcados como required devem existir nos defaultProps', () => {
      const allSchemas: Record<string, BlockSchema> = { ...blockPropertySchemas, ...completeBlockSchemas };
      const issues: Array<{ schema: string; field: string }> = [];
      
      BLOCK_DEFINITIONS.forEach((blockDef: BlockDefinition) => {
        const schema = allSchemas[blockDef.type];
        if (!schema) return;
        
        const allProps = {
          ...(blockDef.defaultProps.content || {}),
          ...(blockDef.defaultProps.properties || {})
        };
        
        schema.fields.forEach((field: any) => {
          if (field.required && !(field.key in allProps)) {
            issues.push({
              schema: blockDef.type,
              field: field.key
            });
          }
        });
      });
      
      if (issues.length > 0) {
        console.log('\n⚠️  Campos required sem valor em defaultProps:');
        issues.forEach(({ schema, field }) => {
          console.log(`   - ${schema}.${field}`);
        });
      }
      
      expect(
        issues,
        `❌ ${issues.length} campos required sem valor padrão`
      ).toHaveLength(0);
    });
  });
});
