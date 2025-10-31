// 🔍 Script de Debug para Step-01 Image
// Execute este script no console do navegador (F12) quando estiver em:
// http://localhost:8080/editor?template=quiz21StepsComplete

console.clear();
console.log('%c🔍 DEBUG STEP-01 IMAGE', 'background: #222; color: #4ec9b0; font-size: 20px; padding: 10px;');
console.log('═══════════════════════════════════════════════════════════════\n');

// 1. Verificar JSON
console.log('%c1️⃣ VERIFICANDO JSON...', 'color: #569cd6; font-weight: bold');
fetch('/templates/blocks/step-01.json')
    .then(r => r.json())
    .then(data => {
        console.log('✅ JSON carregado:', data.id);
        console.log('📦 Total de blocos:', data.blocks?.length);
        
        const blocks = data.blocks?.map(b => b.type) || [];
        console.log('📋 Tipos de blocos:', blocks);
        
        const imageBlock = data.blocks?.find(b => b.type === 'intro-image');
        if (imageBlock) {
            console.log('%c✅ Bloco intro-image ENCONTRADO no JSON!', 'color: #4ec9b0; font-weight: bold');
            console.log('🖼️ Detalhes do bloco:', {
                type: imageBlock.type,
                id: imageBlock.id,
                imageUrl: imageBlock.content?.imageUrl,
                src: imageBlock.content?.src,
                alt: imageBlock.content?.alt,
                width: imageBlock.content?.width,
                height: imageBlock.content?.height
            });
        } else {
            console.log('%c❌ Bloco intro-image NÃO encontrado no JSON!', 'color: #f48771; font-weight: bold');
        }
        
        console.log('\n');
        
        // 2. Verificar DOM
        console.log('%c2️⃣ VERIFICANDO DOM...', 'color: #569cd6; font-weight: bold');
        
        // Método 1: Por atributo alt
        const imgByAlt = document.querySelector('[alt="Descubra seu estilo predominante"]');
        console.log('Por alt:', imgByAlt ? '✅ ENCONTRADO' : '❌ NÃO ENCONTRADO');
        
        if (imgByAlt) {
            console.log('📊 Detalhes da imagem:', {
                tag: imgByAlt.tagName,
                src: imgByAlt.src,
                alt: imgByAlt.alt,
                width: imgByAlt.width,
                height: imgByAlt.height,
                offsetWidth: imgByAlt.offsetWidth,
                offsetHeight: imgByAlt.offsetHeight,
                visible: imgByAlt.offsetWidth > 0 && imgByAlt.offsetHeight > 0 ? '✅ SIM' : '❌ NÃO',
                display: getComputedStyle(imgByAlt).display,
                visibility: getComputedStyle(imgByAlt).visibility,
                opacity: getComputedStyle(imgByAlt).opacity
            });
            
            console.log('📍 Caminho no DOM:');
            let current = imgByAlt;
            let path = [];
            while (current) {
                path.unshift(current.tagName + (current.id ? '#' + current.id : '') + (current.className ? '.' + current.className.split(' ').join('.') : ''));
                current = current.parentElement;
                if (path.length > 10) break; // Limitar profundidade
            }
            console.log(path.join(' > '));
        }
        
        // Método 2: Por src
        const imgBySrc = document.querySelector('img[src*="Gemini_Generated_Image"]');
        console.log('Por src (Gemini):', imgBySrc ? '✅ ENCONTRADO' : '❌ NÃO ENCONTRADO');
        
        // Método 3: Todas as imagens
        const allImages = document.querySelectorAll('img');
        console.log(`📷 Total de imagens na página: ${allImages.length}`);
        if (allImages.length > 0) {
            console.log('Listando todas as imagens:');
            allImages.forEach((img, idx) => {
                console.log(`  ${idx + 1}. ${img.alt || '(sem alt)'} - ${img.src.substring(0, 80)}...`);
            });
        }
        
        console.log('\n');
        
        // 3. Verificar blocos intro
        console.log('%c3️⃣ VERIFICANDO BLOCOS INTRO...', 'color: #569cd6; font-weight: bold');
        
        const introBlocks = document.querySelectorAll('[data-block-type^="intro"], [id^="intro"]');
        console.log(`📦 Total de blocos intro: ${introBlocks.length}`);
        
        introBlocks.forEach((block, idx) => {
            const type = block.getAttribute('data-block-type') || block.id || 'unknown';
            const isVisible = block.offsetWidth > 0 && block.offsetHeight > 0;
            console.log(`  ${idx + 1}. ${type} - ${isVisible ? '✅ Visível' : '❌ Oculto'}`);
        });
        
        console.log('\n');
        
        // 4. Verificar step-01 container
        console.log('%c4️⃣ VERIFICANDO STEP-01 CONTAINER...', 'color: #569cd6; font-weight: bold');
        
        const step01Containers = document.querySelectorAll('[data-step-id="step-01"], [id*="step-01"], [data-testid="step-01"]');
        console.log(`📦 Containers step-01 encontrados: ${step01Containers.length}`);
        
        step01Containers.forEach((container, idx) => {
            console.log(`  Container ${idx + 1}:`, {
                tag: container.tagName,
                id: container.id,
                classes: container.className,
                visible: container.offsetWidth > 0 && container.offsetHeight > 0 ? '✅' : '❌',
                childrenCount: container.children.length
            });
            
            // Verificar se tem imagem dentro
            const imgInside = container.querySelector('img');
            console.log(`    Tem imagem dentro? ${imgInside ? '✅ SIM' : '❌ NÃO'}`);
            if (imgInside) {
                console.log(`    URL da imagem: ${imgInside.src.substring(0, 80)}...`);
            }
        });
        
        console.log('\n');
        
        // 5. Verificar logs do IntroImageBlock
        console.log('%c5️⃣ PROCURANDO LOGS DO COMPONENTE...', 'color: #569cd6; font-weight: bold');
        console.log('(Os logs do IntroImageBlock devem aparecer acima com 🖼️)');
        
        console.log('\n');
        console.log('%c═══════════════════════════════════════════════════════════════', 'color: #4ec9b0');
        
        // Resumo final
        if (imgByAlt) {
            console.log('%c✅ RESULTADO: Imagem está sendo renderizada corretamente!', 'background: #0e4f1f; color: #4ec9b0; font-size: 16px; padding: 10px;');
        } else {
            console.log('%c❌ RESULTADO: Imagem NÃO está sendo renderizada!', 'background: #5a1d1d; color: #f48771; font-size: 16px; padding: 10px;');
            console.log('\n%c🔧 Possíveis causas:', 'color: #dcdcaa; font-weight: bold');
            console.log('1. Componente IntroImageBlock não está sendo renderizado');
            console.log('2. BlockTypeRenderer não está mapeando corretamente');
            console.log('3. JSON não está sendo carregado');
            console.log('4. CSS está escondendo a imagem');
            console.log('5. Step-01 não está ativo/visível');
        }
        
    })
    .catch(error => {
        console.error('%c❌ ERRO ao carregar JSON:', 'color: #f48771; font-weight: bold', error);
    });
