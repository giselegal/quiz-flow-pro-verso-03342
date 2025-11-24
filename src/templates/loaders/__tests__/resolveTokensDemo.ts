/**
 * 🧪 TESTE: Verificar se tokens {{theme.*}} e {{asset.*}} são resolvidos
 */
import { getGlobalTheme } from '@/config/globalTheme';
import { ASSETS } from '@/config/assets';

const testBlock = {
  id: 'test-1',
  type: 'text',
  content: {
    text: 'Cor: {{theme.colors.primary}}, Logo: {{asset.logo}}'
  },
  properties: {
    barColor: '{{theme.colors.primary}}',
    logo: '{{asset.logo}}'
  }
};

console.log('\n🧪 TESTE DE RESOLUÇÃO DE TOKENS\n');
console.log('📝 Bloco ANTES da resolução:');
console.log(JSON.stringify(testBlock, null, 2));

// Simular o que o loader faz
function resolveTokens<T>(obj: T): T {
  if (!obj) return obj;
  
  const theme = getGlobalTheme();
  
  const resolveString = (str: string): string => {
    if (typeof str !== 'string') return str;
    
    let resolved = str.replace(/\{\{theme\.colors\.(\w+)\}\}/g, (match, colorKey) => {
      return (theme.colors as any)[colorKey] || match;
    });
    
    resolved = resolved.replace(/\{\{theme\.fonts\.(\w+)\}\}/g, (match, fontKey) => {
      return (theme.fonts as any)[fontKey] || match;
    });
    
    resolved = resolved.replace(/\{\{asset\.(\w+)\}\}/g, (match, assetKey) => {
      return (ASSETS as any)[assetKey] || match;
    });
    
    return resolved;
  };
  
  if (typeof obj === 'string') {
    return resolveString(obj) as T;
  }
  
  if (Array.isArray(obj)) {
    return obj.map(item => resolveTokens(item)) as T;
  }
  
  if (typeof obj === 'object') {
    const resolved: any = {};
    for (const [key, value] of Object.entries(obj)) {
      resolved[key] = resolveTokens(value);
    }
    return resolved as T;
  }
  
  return obj;
}

const resolvedBlock = resolveTokens(testBlock);

console.log('\n✨ Bloco DEPOIS da resolução:');
console.log(JSON.stringify(resolvedBlock, null, 2));

console.log('\n✅ VERIFICAÇÃO:');
console.log(`- theme.colors.primary esperado: #B89B7A`);
console.log(`- Resolvido em text: ${resolvedBlock.content.text.includes('#B89B7A') ? '✅' : '❌'}`);
console.log(`- Resolvido em barColor: ${resolvedBlock.properties.barColor === '#B89B7A' ? '✅' : '❌'}`);
console.log(`- asset.logo esperado: contém "cloudinary"`);
console.log(`- Resolvido em logo: ${resolvedBlock.properties.logo.includes('cloudinary') ? '✅' : '❌'}`);
