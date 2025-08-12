#!/usr/bin/env node

/**
 * Script Inteligente: Conversão Automática para Padrão Modular
 * Converte templates híbridos para modulares puros usando Prettier
 */

import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const STEPS_DIR = path.join(__dirname, '../src/components/steps');

// Configuração Prettier
const prettierConfig = {
  semi: true,
  singleQuote: true,
  trailingComma: 'es5',
  tabWidth: 2,
  printWidth: 100,
};

class ModularConverter {
  constructor() {
    this.results = {
      converted: [],
      skipped: [],
      errors: [],
      created: [],
    };
  }

  async run() {
    console.log('🚀 Iniciando conversão para padrão modular...\n');
    
    // 1. Converter híbridos para modulares
    await this.convertHybrids();
    
    // 2. Criar templates vazios
    await this.createEmptyTemplates();
    
    // 3. Aplicar Prettier em tudo
    await this.formatAllTemplates();
    
    // 4. Relatório final
    this.generateReport();
  }

  async convertHybrids() {
    const hybridSteps = [3, 4, 5, 6, 7, 8, 9, 10, 11, 21];
    
    for (const stepNum of hybridSteps) {
      try {
        const fileName = `Step${stepNum.toString().padStart(2, '0')}Template.tsx`;
        const filePath = path.join(STEPS_DIR, fileName);
        
        if (fs.existsSync(filePath)) {
          console.log(`📝 Convertendo ${fileName}...`);
          await this.convertHybridToModular(filePath, stepNum);
          this.results.converted.push(fileName);
        } else {
          console.log(`⚠️  ${fileName} não encontrado`);
          this.results.skipped.push(fileName);
        }
      } catch (error) {
        console.error(`❌ Erro ao converter Step${stepNum}:`, error.message);
        this.results.errors.push(`Step${stepNum}: ${error.message}`);
      }
    }
  }

  async convertHybridToModular(filePath, stepNum) {
    const content = fs.readFileSync(filePath, 'utf8');
    
    // Extrair apenas a função modular existente
    const modularFunctionMatch = content.match(
      /export const getStep\d+Template = \(\) => \{[\s\S]*?\n\];[\s\S]*?\n\};/
    );
    
    if (!modularFunctionMatch) {
      throw new Error('Função modular não encontrada');
    }
    
    // Criar novo template modular puro
    const newContent = this.createModularTemplate(stepNum, modularFunctionMatch[0]);
    
    // Salvar e formatar
    fs.writeFileSync(filePath, newContent);
    await this.formatFile(filePath);
  }

  createModularTemplate(stepNum, modularFunction) {
    const stepPadded = stepNum.toString().padStart(2, '0');
    
    return `/**
 * Step${stepPadded}Template - Template Modular para Etapa ${stepNum} do Quiz
 * ✅ CONVERTIDO PARA MODULAR PURO
 * ❌ Componente React removido para consistency
 */

${modularFunction}

export default getStep${stepPadded}Template;
`;
  }

  async createEmptyTemplates() {
    const emptySteps = [13, 15];
    
    for (const stepNum of emptySteps) {
      try {
        const fileName = `Step${stepNum.toString().padStart(2, '0')}Template.tsx`;
        const filePath = path.join(STEPS_DIR, fileName);
        
        console.log(`📝 Criando ${fileName}...`);
        
        const strategicIndex = stepNum === 13 ? 1 : 3;
        const content = this.createStrategicTemplate(stepNum, strategicIndex);
        
        fs.writeFileSync(filePath, content);
        await this.formatFile(filePath);
        
        this.results.created.push(fileName);
      } catch (error) {
        console.error(`❌ Erro ao criar Step${stepNum}:`, error.message);
        this.results.errors.push(`Step${stepNum}: ${error.message}`);
      }
    }
  }

  createStrategicTemplate(stepNum, strategicIndex) {
    const stepPadded = stepNum.toString().padStart(2, '0');
    const progressValue = Math.round(((stepNum - 1) / 20) * 100);
    
    const questions = {
      13: 'Em que ocasiões você mais usa as roupas que compra?',
      15: 'Qual aspecto mais te incomoda no seu guarda-roupa atual?'
    };
    
    const options = {
      13: [
        { id: 'strategic-13-a', text: 'Trabalho/profissional', category: 'work' },
        { id: 'strategic-13-b', text: 'Eventos sociais', category: 'social' },
        { id: 'strategic-13-c', text: 'Dia a dia casual', category: 'casual' },
        { id: 'strategic-13-d', text: 'Ocasiões especiais', category: 'special' },
      ],
      15: [
        { id: 'strategic-15-a', text: 'Falta de organização', category: 'organization' },
        { id: 'strategic-15-b', text: 'Roupas que não combina', category: 'mismatch' },
        { id: 'strategic-15-c', text: 'Peças sem uso', category: 'unused' },
        { id: 'strategic-15-d', text: 'Falta de variedade', category: 'variety' },
      ]
    };

    return `/**
 * Step${stepPadded}Template - Template Modular para Etapa ${stepNum} do Quiz
 * ✅ QUESTÃO ESTRATÉGICA ${strategicIndex} - NÃO pontua, apenas métricas
 */

export const getStep${stepPadded}Template = () => {
  return [
    {
      id: 'progress-header-step${stepNum}',
      type: 'quiz-header',
      properties: {
        logoUrl: 'https://res.cloudinary.com/dqljyf76t/image/upload/v1744911572/LOGO_DA_MARCA_GISELE_r14oz2.webp',
        logoAlt: 'Logo Gisele Galvão',
        logoWidth: 80,
        logoHeight: 80,
        progressValue: ${progressValue},
        progressMax: 100,
        showBackButton: false,
        showProgress: true,
        stepNumber: '${stepNum} de 21',
        spacing: 'small',
      },
    },
    {
      id: 'question-title-step${stepNum}',
      type: 'text-inline',
      properties: {
        content: 'QUESTÃO ESTRATÉGICA ${strategicIndex}',
        fontSize: 'text-2xl md:text-3xl',
        fontWeight: 'font-bold',
        textAlign: 'text-center',
        color: '#432818',
        marginBottom: 16,
        spacing: 'medium',
      },
    },
    {
      id: 'strategic-question-step${stepNum}',
      type: 'text-inline',
      properties: {
        content: '${questions[stepNum]}',
        fontSize: 'text-xl md:text-2xl',
        fontWeight: 'font-semibold',
        textAlign: 'text-center',
        color: '#432818',
        marginBottom: 32,
        maxWidth: '720px',
        spacing: 'medium',
      },
    },
    {
      id: 'strategic-options-step${stepNum}',
      type: 'options-grid',
      properties: {
        options: ${JSON.stringify(options[stepNum].map(opt => ({
          ...opt,
          strategicType: 'usage'
        })), null, 10)},
        multiSelect: false,
        columns: 2,
        backgroundColor: '#FFFFFF',
        borderColor: '#E5DDD5',
        hoverBackgroundColor: '#F3E8E6',
        selectedBackgroundColor: '#B89B7A',
        selectedTextColor: '#FFFFFF',
        borderRadius: 12,
        padding: 16,
        spacing: 'medium',
        trackingEnabled: true,
      },
    },
    {
      id: 'navigation-button-step${stepNum}',
      type: 'button-inline',
      properties: {
        text: 'Próxima Questão →',
        variant: 'primary',
        size: 'large',
        backgroundColor: '#B89B7A',
        textColor: '#FFFFFF',
        hoverBackgroundColor: '#A1835D',
        borderRadius: 12,
        padding: '16px 32px',
        fontSize: 'text-lg',
        fontWeight: 'font-semibold',
        marginTop: 32,
        marginBottom: 16,
        showShadow: true,
        spacing: 'medium',
        disabled: true,
        requiresSelection: true,
      },
    },
    {
      id: 'strategic-progress-step${stepNum}',
      type: 'text-inline',
      properties: {
        content: 'Questão Estratégica ${strategicIndex} de 6 • Não afeta sua pontuação',
        fontSize: 'text-sm',
        textAlign: 'text-center',
        color: '#432818',
        opacity: 0.6,
        marginTop: 16,
        spacing: 'small',
      },
    },
  ];
};

export default getStep${stepPadded}Template;
`;
  }

  async formatAllTemplates() {
    console.log('\n🎨 Aplicando Prettier em todos os templates...');
    
    try {
      const templateFiles = fs.readdirSync(STEPS_DIR)
        .filter(file => file.match(/Step\d+Template\.tsx$/))
        .map(file => path.join(STEPS_DIR, file));
      
      for (const file of templateFiles) {
        await this.formatFile(file);
      }
      
      console.log('✅ Prettier aplicado com sucesso!');
    } catch (error) {
      console.error('❌ Erro ao aplicar Prettier:', error.message);
    }
  }

  async formatFile(filePath) {
    try {
      execSync(`npx prettier --write "${filePath}"`, { 
        stdio: 'pipe',
        cwd: path.join(__dirname, '..')
      });
    } catch (error) {
      console.warn(`⚠️  Prettier falhou em ${path.basename(filePath)}`);
    }
  }

  generateReport() {
    console.log('\n📊 RELATÓRIO DE CONVERSÃO:\n');
    
    console.log(`✅ Convertidos: ${this.results.converted.length}`);
    this.results.converted.forEach(file => console.log(`   - ${file}`));
    
    console.log(`\n🆕 Criados: ${this.results.created.length}`);
    this.results.created.forEach(file => console.log(`   - ${file}`));
    
    console.log(`\n⏭️  Ignorados: ${this.results.skipped.length}`);
    this.results.skipped.forEach(file => console.log(`   - ${file}`));
    
    if (this.results.errors.length > 0) {
      console.log(`\n❌ Erros: ${this.results.errors.length}`);
      this.results.errors.forEach(error => console.log(`   - ${error}`));
    }
    
    console.log('\n🎯 PRÓXIMOS PASSOS:');
    console.log('   1. Verificar se todos os templates foram convertidos');
    console.log('   2. Testar integração com o sistema');
    console.log('   3. Remover imports React não utilizados');
    
    console.log('\n🚀 Conversão concluída!');
  }
}

// Executar se for chamado diretamente
if (import.meta.url === `file://${process.argv[1]}`) {
  const converter = new ModularConverter();
  converter.run().catch(console.error);
}

export default ModularConverter;
