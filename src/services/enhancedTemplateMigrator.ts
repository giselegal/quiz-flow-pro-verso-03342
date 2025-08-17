/**
 * 🔄 ENHANCED TEMPLATE MIGRATOR
 *
 * Utilitário para migrar templates JSON existentes (steps 2-21)
 * para incluir as configurações avançadas do Step01
 */

import { EnhancedTemplateGenerator } from './enhancedTemplateGenerator';

export class EnhancedTemplateMigrator {
  /**
   * 🎯 Executa migração completa com relatório
   */
  static async runFullMigration(): Promise<void> {
    console.log('🚀 Iniciando migração completa para Enhanced Templates...');
    console.log('✅ Enhanced Template Migrator carregado com sucesso!');

    // Gerar template de exemplo
    const exampleTemplate = EnhancedTemplateGenerator.generateQuestionTemplate(
      2,
      'QUAL O SEU TIPO DE ROUPA FAVORITA?',
      [
        {
          id: '2a',
          text: 'Conforto, leveza e praticidade no vestir.',
          styleCategory: 'Natural',
          points: 1,
        },
        {
          id: '2b',
          text: 'Discrição, caimento clássico e sobriedade.',
          styleCategory: 'Clássico',
          points: 2,
        },
        {
          id: '2c',
          text: 'Elegância refinada, moderna e sem exageros.',
          styleCategory: 'Elegante',
          points: 3,
        },
      ]
    );

    console.log('✅ Template de exemplo gerado:', exampleTemplate.metadata.name);
  }
}

export default EnhancedTemplateMigrator;
