/**
 * 🧪 TESTE DO PAINEL DE PROPRIEDADES
 * 
 * Testa se o painel consegue consumir todos os dados do Step 20 híbrido
 */

import { promises as fs } from 'fs';
import path from 'path';

async function testPropertiesPanel() {
  console.log('🧪 TESTE DO PAINEL DE PROPRIEDADES\n');

  try {
    // 1. Ler template Step 20 híbrido
    const templatePath = '/workspaces/quiz-flow-pro-verso/public/templates/step-20-v3.json';
    const templateContent = await fs.readFile(templatePath, 'utf8');
    const template = JSON.parse(templateContent);

    console.log('✅ Template carregado:', template.metadata.name);

    // 2. Extrair seção result-calculation
    const resultSection = template.sections?.find((s: any) => s.type === 'ResultCalculationSection');
    
    if (!resultSection) {
      console.log('❌ Seção ResultCalculationSection não encontrada');
      return;
    }

    console.log('✅ Seção encontrada:', resultSection.title);

    // 3. Verificar propriedades
    const props = resultSection.props;
    
    console.log('\n📊 PROPRIEDADES DISPONÍVEIS:');
    console.log('• calculationMethod:', props.calculationMethod);
    console.log('• scoreMapping:', Object.keys(props.scoreMapping || {}).length, 'estilos');
    console.log('• resultLogic.winnerSelection:', props.resultLogic?.winnerSelection);
    console.log('• resultLogic.tieBreaker:', props.resultLogic?.tieBreaker);
    console.log('• resultLogic.minThreshold:', props.resultLogic?.minThreshold);
    console.log('• leadCapture.fields:', props.leadCapture?.properties?.fields?.length, 'campos');

    // 4. Verificar se todas as propriedades podem ser editadas
    const editableProperties = {
      calculationMethod: typeof props.calculationMethod,
      scoreMapping: typeof props.scoreMapping,
      resultLogic: typeof props.resultLogic,
      leadCapture: typeof props.leadCapture
    };

    console.log('\n🔧 TIPOS DE DADOS:');
    Object.entries(editableProperties).forEach(([key, type]) => {
      const isSupported = ['string', 'object'].includes(type);
      console.log(`• ${key}: ${type} ${isSupported ? '✅' : '❌'}`);
    });

    // 5. Testar serialização/deserialização
    console.log('\n🔄 TESTE DE SERIALIZAÇÃO:');
    
    try {
      const serialized = JSON.stringify(props, null, 2);
      const deserialized = JSON.parse(serialized);
      
      const isIdentical = JSON.stringify(props) === JSON.stringify(deserialized);
      console.log('• Serialização/Deserialização:', isIdentical ? '✅ OK' : '❌ FALHA');
      
    } catch (error) {
      console.log('• Serialização/Deserialização: ❌ ERRO', error);
    }

    // 6. Verificar estrutura esperada pelo painel
    const requiredForPanel = {
      'calculationMethod': !!props.calculationMethod,
      'scoreMapping com estilos': !!(props.scoreMapping && Object.keys(props.scoreMapping).length > 0),
      'resultLogic completo': !!(props.resultLogic?.winnerSelection && props.resultLogic?.tieBreaker),
      'leadCapture configurado': !!(props.leadCapture?.properties)
    };

    console.log('\n📋 COMPATIBILIDADE COM PAINEL:');
    Object.entries(requiredForPanel).forEach(([requirement, isOk]) => {
      console.log(`• ${requirement}: ${isOk ? '✅' : '❌'}`);
    });

    // 7. Resultado final
    const allOk = Object.values(requiredForPanel).every(Boolean);
    console.log('\n🎯 RESULTADO FINAL:');
    console.log(allOk ? 
      '✅ PAINEL PODE CONSUMIR TODOS OS DADOS!' : 
      '❌ ALGUMAS PROPRIEDADES PODEM TER PROBLEMAS'
    );

    // 8. Sugestões de melhoria
    console.log('\n💡 SUGESTÕES:');
    if (!props.calculationMethod) {
      console.log('• Adicionar valor padrão para calculationMethod');
    }
    if (!props.scoreMapping || Object.keys(props.scoreMapping).length === 0) {
      console.log('• Garantir que scoreMapping tenha pelo menos um estilo');
    }
    if (!props.resultLogic) {
      console.log('• Configurar resultLogic com valores padrão');
    }

  } catch (error) {
    console.error('❌ Erro no teste:', error);
  }
}

testPropertiesPanel().catch(console.error);