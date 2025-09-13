// Debug Script para verificar qual painel está sendo usado
console.log('🔍 DEBUG: Verificando painéis ativos...');

// Verificar qual editor está ativo
setTimeout(() => {
    console.log('🎯 Editor ativo:', window.__ACTIVE_EDITOR__ || 'Não definido');

    // Verificar painéis na DOM
    const painelElements = [
        { name: 'SinglePropertiesPanel', selector: '[class*="single-properties"], [data-testid*="single-properties"]' },
        { name: 'EnhancedUniversalPropertiesPanel', selector: '[class*="enhanced-universal"], [data-testid*="enhanced-universal"]' },
        { name: 'RegistryPropertiesPanel', selector: '[class*="registry-properties"], [data-testid*="registry-properties"]' },
        { name: 'PropertiesColumn', selector: '[class*="properties-column"], [data-testid*="properties-column"]' }
    ];

    console.log('📋 Painéis encontrados na DOM:');
    painelElements.forEach(painel => {
        const elements = document.querySelectorAll(painel.selector);
        if (elements.length > 0) {
            console.log(`✅ ${painel.name}: ${elements.length} instância(s)`);
            elements.forEach((el, i) => {
                console.log(`   [${i}] Classes:`, el.className);
                console.log(`   [${i}] ID:`, el.id || 'sem ID');
            });
        } else {
            console.log(`❌ ${painel.name}: não encontrado`);
        }
    });

    // Verificar IDs duplicados
    const allIds = document.querySelectorAll('[id]');
    const idCounts = {};
    allIds.forEach(el => {
        const id = el.id;
        if (idCounts[id]) {
            idCounts[id]++;
        } else {
            idCounts[id] = 1;
        }
    });

    const duplicates = Object.entries(idCounts).filter(([id, count]) => count > 1);
    if (duplicates.length > 0) {
        console.error('🚨 IDs DUPLICADOS encontrados:');
        duplicates.forEach(([id, count]) => {
            console.error(`   ${id}: ${count} vezes`);
            const elements = document.querySelectorAll(`#${id}`);
            elements.forEach((el, i) => {
                console.error(`     [${i}] Tag: ${el.tagName}, Classes: ${el.className}`);
            });
        });
    } else {
        console.log('✅ Nenhum ID duplicado encontrado');
    }

    // Verificar labels órfãs
    const labels = document.querySelectorAll('label[for]');
    const orphanLabels = [];
    labels.forEach(label => {
        const forId = label.getAttribute('for');
        const target = document.getElementById(forId);
        if (!target) {
            orphanLabels.push(forId);
        }
    });

    if (orphanLabels.length > 0) {
        console.warn('⚠️ Labels órfãos encontrados (for sem elemento):');
        orphanLabels.forEach(id => console.warn(`   for="${id}"`));
    } else {
        console.log('✅ Todos os labels têm elementos correspondentes');
    }

    console.log('🏁 Debug concluído. Verifique os resultados acima.');
}, 2000);