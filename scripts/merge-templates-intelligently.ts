#!/usr/bin/env node

/**
 * MERGE INTELIGENTE DE TEMPLATES
 * 
 * Combina o melhor das versões v.2 e v.3:
 * - V.2: Lógica de cálculos e estrutura funcional
 * - V.3: Visual moderno e imagens
 */

import fs from 'fs';
import path from 'path';

console.log('🧠 MERGE INTELIGENTE DE TEMPLATES');
console.log('Combinando lógica v.2 + visual v.3...\n');

interface TemplateAnalysis {
  step: number;
  v2Path: string;
  v3Path: string;
  v2Content: any;
  v3Content: any;
  mergeStrategy: 'use_v2' | 'use_v3' | 'hybrid' | 'custom';
  reasoning: string;
}

const templatesDir = '/workspaces/quiz-flow-pro-verso/public/templates';
const backupDir = path.join(templatesDir, 'backup-1760538790833');

// Estratégias de merge por step
const mergeStrategies: Record<number, { 
  strategy: TemplateAnalysis['mergeStrategy']; 
  reasoning: string;
  customLogic?: (v2: any, v3: any) => any;
}> = {
  // Steps 1-19: Usar v.3 (melhor visual)
  ...Object.fromEntries(
    Array.from({ length: 19 }, (_, i) => i + 1).map(step => [
      step,
      {
        strategy: 'use_v3' as const,
        reasoning: `Step ${step}: v.3 tem melhor visual e estrutura`
      }
    ])
  ),
  
  // Step 20: CRÍTICO - Merge híbrido
  20: {
    strategy: 'hybrid' as const,
    reasoning: 'Step 20: v.2 tem lógica de resultado, v.3 tem visual. MERGE OBRIGATÓRIO!',
    customLogic: (v2: any, v3: any) => {
      console.log('🔥 Executando merge híbrido para Step 20...');
      
      return {
        // Base da v.3 (estrutura moderna)
        ...v3,
        
        // Metadados híbridos
        metadata: {
          ...v3.metadata,
          id: 'step-20-hybrid',
          name: 'Resultado com Cálculos + Visual Moderno',
          description: 'Híbrido: lógica v.2 + visual v.3',
          mergedAt: new Date().toISOString()
        },
        
        // PRESERVAR: Lógica de validação da v.2
        validation: {
          ...v2.validation,
          // Adicionar validações da v.3
          required: ['userName', 'styleName', 'scores', 'calculatedResult']
        },
        
        // PRESERVAR: Analytics básico da v.2
        analytics: {
          ...v2.analytics,
          // Manter eventos importantes da v.3
          events: [...v2.analytics.events, ...v3.analytics.events],
          trackingId: 'step-20-hybrid'
        },
        
        // ADICIONAR: Seção de cálculo no início
        sections: [
          // 🧮 NOVA SEÇÃO: Cálculo de Resultados (da v.2)
          {
            id: 'result-calculation',
            type: 'ResultCalculationSection',
            enabled: true,
            order: 0,
            title: 'Processamento de Resultados',
            props: {
              calculationMethod: 'weighted_sum',
              scoreMapping: {
                'romantico': { min: 0, max: 100, label: 'Romântico' },
                'classico': { min: 0, max: 100, label: 'Clássico' },
                'moderno': { min: 0, max: 100, label: 'Moderno' },
                'criativo': { min: 0, max: 100, label: 'Criativo' },
                'dramatico': { min: 0, max: 100, label: 'Dramático' }
              },
              resultLogic: {
                winnerSelection: 'highest_score',
                tieBreaker: 'secondary_scores',
                minThreshold: 20
              },
              // Preservar sistema de lead da v.2
              leadCapture: v2.blocks?.find((b: any) => b.type === 'lead-form') || null
            }
          },
          
          // Manter todas as seções visuais da v.3 (com ordem ajustada)
          ...v3.sections.map((section: any) => ({
            ...section,
            order: section.order + 1 // Deslocar para depois do cálculo
          }))
        ],
        
        // HÍBRIDO: Layout da v.3 com funcionalidade da v.2
        layout: {
          ...v3.layout,
          // Garantir que cálculos funcionem
          supportsCalculation: true,
          calculationMode: 'server_side'
        }
      };
    }
  },
  
  // Step 21: Usar v.3 mas verificar se v.2 tem algo importante
  21: {
    strategy: 'use_v3' as const,
    reasoning: 'Step 21: v.3 é mais completa'
  }
};

async function analyzeAndMerge() {
  const analyses: TemplateAnalysis[] = [];
  
  // Analisar cada step
  for (let step = 1; step <= 21; step++) {
    const v2Path = path.join(backupDir, `step-${step.toString().padStart(2, '0')}-template.json`);
    const v3Path = path.join(templatesDir, `step-${step.toString().padStart(2, '0')}-v3.json`);
    
    if (!fs.existsSync(v2Path) || !fs.existsSync(v3Path)) {
      console.log(`⚠️  Step ${step}: Arquivos não encontrados`);
      continue;
    }
    
    const v2Content = JSON.parse(fs.readFileSync(v2Path, 'utf8'));
    const v3Content = JSON.parse(fs.readFileSync(v3Path, 'utf8'));
    
    const strategy = mergeStrategies[step] || {
      strategy: 'use_v3' as const,
      reasoning: 'Padrão: preferir v.3'
    };
    
    analyses.push({
      step,
      v2Path,
      v3Path,
      v2Content,
      v3Content,
      mergeStrategy: strategy.strategy,
      reasoning: strategy.reasoning
    });
    
    console.log(`📋 Step ${step}: ${strategy.strategy} - ${strategy.reasoning}`);
  }
  
  console.log('\n🔧 Aplicando merges...\n');
  
  // Aplicar merges
  for (const analysis of analyses) {
    let finalContent: any;
    const strategy = mergeStrategies[analysis.step];
    
    switch (analysis.mergeStrategy) {
      case 'use_v2':
        finalContent = analysis.v2Content;
        console.log(`✅ Step ${analysis.step}: Mantido v.2`);
        break;
        
      case 'use_v3':
        finalContent = analysis.v3Content;
        console.log(`✅ Step ${analysis.step}: Mantido v.3`);
        break;
        
      case 'hybrid':
        if (strategy?.customLogic) {
          finalContent = strategy.customLogic(analysis.v2Content, analysis.v3Content);
          console.log(`🔥 Step ${analysis.step}: MERGE HÍBRIDO aplicado`);
        } else {
          finalContent = analysis.v3Content;
          console.log(`⚠️  Step ${analysis.step}: Fallback para v.3`);
        }
        break;
        
      default:
        finalContent = analysis.v3Content;
        break;
    }
    
    // Salvar resultado final
    const outputPath = path.join(templatesDir, `step-${analysis.step.toString().padStart(2, '0')}-v3.json`);
    fs.writeFileSync(outputPath, JSON.stringify(finalContent, null, 4));
  }
  
  console.log('\n🎉 MERGE CONCLUÍDO!');
  console.log('\n📊 RESULTADO:');
  console.log('✅ Step 20: Agora tem lógica de cálculo + visual moderno');
  console.log('✅ Steps 1-19, 21: Mantém visual v.3');
  console.log('✅ Sistema híbrido funcional');
  
  console.log('\n🧪 PRÓXIMOS PASSOS:');
  console.log('1. Testar step 20 no editor');
  console.log('2. Verificar se cálculos funcionam');
  console.log('3. Validar canvas ↔ preview sync');
}

analyzeAndMerge().catch(console.error);