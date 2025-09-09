/**
 * 🧹 SCRIPT DE LIMPEZA URGENTE - LOCALSTORAGE
 * 
 * Resolve o erro QuotaExceededError que está causando crashes
 */

console.log('🧹 INICIANDO LIMPEZA URGENTE DO LOCALSTORAGE...');

function cleanupLocalStorage() {
  let totalKeysRemoved = 0;
  let totalSizeFreed = 0;

  // Função para calcular tamanho aproximado
  function getStorageSize(key, value) {
    return new Blob([key + value]).size;
  }

  // Lista todas as chaves problemáticas
  const problematicKeys = [];
  const allKeys = [];
  
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key) {
      allKeys.push(key);
      const value = localStorage.getItem(key);
      if (value) {
        const size = getStorageSize(key, value);
        
        // Identificar chaves problemáticas
        if (
          key.includes('default-funnel') ||
          key.includes('funnel_session_default-funnel') ||
          size > 100000 || // Maior que 100KB
          key.includes('temp_') ||
          key.includes('debug_') ||
          key.includes('test_')
        ) {
          problematicKeys.push({ key, size, value: value.substring(0, 100) + '...' });
        }
      }
    }
  }

  console.log(`📊 ANÁLISE DO LOCALSTORAGE:`);
  console.log(`   Total de chaves: ${allKeys.length}`);
  console.log(`   Chaves problemáticas: ${problematicKeys.length}`);

  // Mostrar chaves problemáticas
  if (problematicKeys.length > 0) {
    console.log('\n❌ CHAVES PROBLEMÁTICAS:');
    problematicKeys.forEach((item, index) => {
      console.log(`${index + 1}. ${item.key} (${(item.size / 1024).toFixed(2)} KB)`);
    });

    // Remover chaves problemáticas
    console.log('\n🗑️ REMOVENDO CHAVES PROBLEMÁTICAS...');
    problematicKeys.forEach(item => {
      try {
        localStorage.removeItem(item.key);
        totalKeysRemoved++;
        totalSizeFreed += item.size;
        console.log(`   ✅ Removido: ${item.key}`);
      } catch (error) {
        console.log(`   ❌ Erro ao remover: ${item.key}`, error);
      }
    });
  }

  // Remover duplicatas antigas de funnels
  console.log('\n🔄 REMOVENDO DUPLICATAS DE FUNNELS...');
  const funnelKeys = allKeys.filter(key => key.startsWith('funnel_'));
  const funnelsByType = {};
  
  funnelKeys.forEach(key => {
    const parts = key.split('_');
    if (parts.length >= 3) {
      const type = parts[1];
      const funnelId = parts[2];
      const typeKey = `${type}_${funnelId}`;
      
      if (!funnelsByType[typeKey]) {
        funnelsByType[typeKey] = [];
      }
      funnelsByType[typeKey].push(key);
    }
  });

  // Manter apenas as versões mais recentes
  Object.entries(funnelsByType).forEach(([typeKey, keys]) => {
    if (keys.length > 1) {
      // Ordenar por timestamp (assumindo que há timestamp nas chaves)
      const sortedKeys = keys.sort((a, b) => {
        const timestampA = a.match(/\d{13}/)?.[0] || '0';
        const timestampB = b.match(/\d{13}/)?.[0] || '0';
        return timestampB.localeCompare(timestampA);
      });
      
      // Remover todas exceto a mais recente
      for (let i = 1; i < sortedKeys.length; i++) {
        try {
          localStorage.removeItem(sortedKeys[i]);
          totalKeysRemoved++;
          console.log(`   ✅ Duplicata removida: ${sortedKeys[i]}`);
        } catch (error) {
          console.log(`   ❌ Erro ao remover duplicata: ${sortedKeys[i]}`);
        }
      }
    }
  });

  console.log('\n📊 RESULTADO DA LIMPEZA:');
  console.log(`   Chaves removidas: ${totalKeysRemoved}`);
  console.log(`   Espaço liberado: ${(totalSizeFreed / 1024).toFixed(2)} KB`);
  console.log(`   Chaves restantes: ${localStorage.length}`);

  return {
    keysRemoved: totalKeysRemoved,
    sizeFreed: totalSizeFreed,
    remainingKeys: localStorage.length
  };
}

// Função para verificar saúde do localStorage
function checkLocalStorageHealth() {
  console.log('\n🔍 VERIFICANDO SAÚDE DO LOCALSTORAGE...');
  
  try {
    // Testar se conseguimos escrever
    const testKey = 'health_check_' + Date.now();
    const testValue = 'test_value';
    localStorage.setItem(testKey, testValue);
    localStorage.removeItem(testKey);
    
    console.log('✅ LocalStorage funcionando corretamente');
    
    // Verificar capacidade restante
    let totalSize = 0;
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key) {
        const value = localStorage.getItem(key);
        if (value) {
          totalSize += new Blob([key + value]).size;
        }
      }
    }
    
    const totalSizeMB = (totalSize / (1024 * 1024)).toFixed(2);
    console.log(`📊 Uso atual: ${totalSizeMB} MB`);
    
    // Tentar estimar capacidade máxima
    const maxStorageEstimate = 5; // ~5MB é típico
    const usagePercent = ((totalSize / (maxStorageEstimate * 1024 * 1024)) * 100).toFixed(1);
    console.log(`📈 Uso estimado: ${usagePercent}%`);
    
    if (parseFloat(usagePercent) > 80) {
      console.log('⚠️ AVISO: LocalStorage próximo do limite!');
    }
    
    return { healthy: true, totalSize, usagePercent };
  } catch (error) {
    console.log('❌ LocalStorage com problemas:', error);
    return { healthy: false, error };
  }
}

// Executar limpeza
const result = cleanupLocalStorage();
const health = checkLocalStorageHealth();

if (result.keysRemoved > 0) {
  console.log('\n🎉 LIMPEZA CONCLUÍDA! Recarregue a página para aplicar as mudanças.');
} else {
  console.log('\n✨ LocalStorage já estava limpo!');
}

// Função de limpeza automática para ser chamada preventivamente
window.autoCleanLocalStorage = function() {
  const health = checkLocalStorageHealth();
  if (!health.healthy || parseFloat(health.usagePercent) > 70) {
    console.log('🧹 Executando limpeza preventiva...');
    cleanupLocalStorage();
    return true;
  }
  return false;
};

console.log('\n💡 DICA: Execute window.autoCleanLocalStorage() para limpeza preventiva');
