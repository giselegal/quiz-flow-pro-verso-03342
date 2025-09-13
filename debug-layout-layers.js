// Debug Script para analisar camadas e sobreposições no layout da coluna de propriedades
console.log('🔍 DEBUG: Analisando camadas e sobreposições do layout...');

function analyzeLayoutLayers() {
    console.log('📐 Iniciando análise de camadas do layout...');

    // 1. Analisar estrutura hierárquica dos containers
    const mainContainers = [
        { name: 'Steps Sidebar', selector: '[class*="w-[180px]"], [class*="w-\\[10"]' },
        { name: 'Components Sidebar', selector: '[class*="w-[220px]"], [class*="w-\\[15"]' },
        { name: 'Canvas Area', selector: '[class*="flex-1"], [class*="w-\\[55"]' },
        { name: 'Properties Column', selector: '[class*="w-[280px]"], [class*="w-\\[20"]' }
    ];

    console.log('🏗️ Containers principais:');
    mainContainers.forEach(container => {
        const elements = document.querySelectorAll(container.selector);
        elements.forEach((el, i) => {
            const rect = el.getBoundingClientRect();
            const computedStyle = window.getComputedStyle(el);

            console.log(`📦 ${container.name} [${i}]:`, {
                width: `${rect.width.toFixed(1)}px`,
                position: computedStyle.position,
                zIndex: computedStyle.zIndex,
                overflow: computedStyle.overflow,
                display: computedStyle.display,
                flexShrink: computedStyle.flexShrink,
                flexGrow: computedStyle.flexGrow,
                classes: el.className
            });
        });
    });

    // 2. Verificar sobreposições específicas na coluna de propriedades
    const propsColumn = document.querySelector('[class*="properties-column"], div[class*="w-[280px]"], div[class*="w-\\[20"]');
    if (propsColumn) {
        console.log('🎯 Analisando coluna de propriedades específica...');

        const rect = propsColumn.getBoundingClientRect();
        const style = window.getComputedStyle(propsColumn);

        console.log('📊 Propriedades da coluna:', {
            width: rect.width,
            height: rect.height,
            left: rect.left,
            top: rect.top,
            right: rect.right,
            position: style.position,
            zIndex: style.zIndex,
            overflow: style.overflow,
            minWidth: style.minWidth,
            maxWidth: style.maxWidth,
            flexShrink: style.flexShrink,
            flexBasis: style.flexBasis
        });

        // Verificar filhos da coluna de propriedades
        const children = Array.from(propsColumn.children);
        console.log('👶 Filhos da coluna de propriedades:');
        children.forEach((child, i) => {
            const childRect = child.getBoundingClientRect();
            const childStyle = window.getComputedStyle(child);

            console.log(`   [${i}] ${child.tagName}:`, {
                width: `${childRect.width.toFixed(1)}px`,
                height: `${childRect.height.toFixed(1)}px`,
                overflow: childStyle.overflow,
                position: childStyle.position,
                classes: child.className.slice(0, 50) + '...'
            });
        });
    }

    // 3. Verificar elementos que podem estar causando overflow
    const suspiciousElements = document.querySelectorAll('*');
    const overflowElements = [];

    suspiciousElements.forEach(el => {
        const rect = el.getBoundingClientRect();
        if (rect.width > window.innerWidth || rect.height > window.innerHeight) {
            const style = window.getComputedStyle(el);
            overflowElements.push({
                element: el.tagName,
                width: rect.width,
                height: rect.height,
                classes: el.className.slice(0, 30),
                overflow: style.overflow
            });
        }
    });

    if (overflowElements.length > 0) {
        console.warn('⚠️ Elementos com possível overflow:');
        overflowElements.forEach(el => console.warn('   ', el));
    }

    // 4. Verificar z-index conflicts
    const elementsWithZIndex = [];
    document.querySelectorAll('*').forEach(el => {
        const style = window.getComputedStyle(el);
        if (style.zIndex !== 'auto' && style.zIndex !== '0') {
            elementsWithZIndex.push({
                element: el.tagName,
                zIndex: style.zIndex,
                position: style.position,
                classes: el.className.slice(0, 30)
            });
        }
    });

    if (elementsWithZIndex.length > 0) {
        console.log('🗂️ Elementos com z-index definido:');
        elementsWithZIndex.forEach(el => console.log('   ', el));
    }

    // 5. Verificar medidas do viewport vs containers
    const viewport = {
        width: window.innerWidth,
        height: window.innerHeight
    };

    console.log('🖥️ Viewport:', viewport);

    // Calcular se os containers cabem no viewport
    const totalFixedWidth = 180 + 220 + 280; // Steps + Components + Properties
    const availableCanvasWidth = viewport.width - totalFixedWidth;

    console.log('📏 Análise de espaço:');
    console.log(`   Largura fixa total: ${totalFixedWidth}px`);
    console.log(`   Espaço disponível para canvas: ${availableCanvasWidth}px`);
    console.log(`   Proporção canvas: ${((availableCanvasWidth / viewport.width) * 100).toFixed(1)}%`);

    if (availableCanvasWidth < 400) {
        console.warn('⚠️ PROBLEMA: Espaço insuficiente para canvas!');
        console.warn('💡 Sugestão: Reduzir largura das sidebars ou usar layout responsivo');
    }
}

function checkOverlapping() {
    console.log('🔍 Verificando sobreposições de elementos...');

    const mainContainers = document.querySelectorAll('div[class*="w-["], div[class*="flex-1"]');
    const overlaps = [];

    for (let i = 0; i < mainContainers.length; i++) {
        for (let j = i + 1; j < mainContainers.length; j++) {
            const rect1 = mainContainers[i].getBoundingClientRect();
            const rect2 = mainContainers[j].getBoundingClientRect();

            // Verificar sobreposição horizontal
            if (rect1.left < rect2.right && rect1.right > rect2.left &&
                rect1.top < rect2.bottom && rect1.bottom > rect2.top) {
                overlaps.push({
                    element1: {
                        tag: mainContainers[i].tagName,
                        classes: mainContainers[i].className.slice(0, 30),
                        rect: rect1
                    },
                    element2: {
                        tag: mainContainers[j].tagName,
                        classes: mainContainers[j].className.slice(0, 30),
                        rect: rect2
                    }
                });
            }
        }
    }

    if (overlaps.length > 0) {
        console.error('🚨 SOBREPOSIÇÕES DETECTADAS:');
        overlaps.forEach((overlap, i) => {
            console.error(`   [${i}] Sobreposição entre:`, overlap);
        });
    } else {
        console.log('✅ Nenhuma sobreposição detectada');
    }
}

function analyzeFlexLayout() {
    console.log('🔧 Analisando layout flex...');

    const flexContainers = document.querySelectorAll('[class*="flex"]');

    flexContainers.forEach((container, i) => {
        const style = window.getComputedStyle(container);
        if (style.display === 'flex' || style.display === 'inline-flex') {
            console.log(`📐 Flex Container [${i}]:`, {
                flexDirection: style.flexDirection,
                justifyContent: style.justifyContent,
                alignItems: style.alignItems,
                flexWrap: style.flexWrap,
                gap: style.gap,
                classes: container.className.slice(0, 50)
            });

            // Analisar filhos flex
            const children = Array.from(container.children);
            children.forEach((child, j) => {
                const childStyle = window.getComputedStyle(child);
                console.log(`   [${j}] Flex Child:`, {
                    flex: childStyle.flex,
                    flexGrow: childStyle.flexGrow,
                    flexShrink: childStyle.flexShrink,
                    flexBasis: childStyle.flexBasis,
                    minWidth: childStyle.minWidth,
                    maxWidth: childStyle.maxWidth,
                    width: childStyle.width
                });
            });
        }
    });
}

// Auto-executar após um delay para garantir que o DOM está carregado
setTimeout(() => {
    try {
        analyzeLayoutLayers();
        checkOverlapping();
        analyzeFlexLayout();

        console.log('🎯 ANÁLISE CONCLUÍDA');
        console.log('💡 Execute as funções individualmente se precisar de mais detalhes:');
        console.log('   - analyzeLayoutLayers()');
        console.log('   - checkOverlapping()');
        console.log('   - analyzeFlexLayout()');

        // Disponibilizar globalmente para uso manual
        window.debugLayout = {
            analyzeLayoutLayers,
            checkOverlapping,
            analyzeFlexLayout
        };

    } catch (error) {
        console.error('❌ Erro na análise de layout:', error);
    }
}, 2000);