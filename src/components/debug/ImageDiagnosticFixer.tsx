/**
 * Componente de diagnóstico e correção de imagens para desenvolvimento
 * Este componente identifica e corrige problemas de imagens embaçadas
 */
import React, { useEffect, useState } from 'react';
import { analyzeImageUrl, checkRenderedImages, generateImageReport } from '../../utils/images/diagnostic';
import { analyzeImageUrl as jsAnalyzeImageUrl } from '../../utils/ImageChecker';
import { replaceBlurryIntroImages, isLikelyBlurryImage, getHighQualityImageUrl } from '../../utils/images/blurry-image-fixer';

// Estilos para o componente de diagnóstico
const diagnosticStyles = {
  container: {
    position: 'fixed',
    bottom: '20px',
    right: '20px',
    width: '350px',
    maxHeight: '500px',
    backgroundColor: 'rgba(0, 0, 0, 0.85)',
    color: 'white',
    zIndex: 9999,
    borderRadius: '8px',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
    overflow: 'hidden',
    fontSize: '12px',
    fontFamily: 'monospace',
    display: 'flex',
    flexDirection: 'column',
  },
  header: {
    padding: '10px 15px',
    backgroundColor: '#e91e63',
    color: 'white',
    fontWeight: 'bold',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  content: {
    padding: '15px',
    overflowY: 'auto',
    maxHeight: '400px',
  },
  section: {
    marginBottom: '15px',
  },
  sectionTitle: {
    fontSize: '13px',
    fontWeight: 'bold',
    marginBottom: '8px',
    borderBottom: '1px solid rgba(255, 255, 255, 0.2)',
    paddingBottom: '4px',
  },
  imageRow: {
    padding: '8px',
    marginBottom: '8px',
    borderRadius: '4px',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    cursor: 'pointer',
  },
  thumbnail: {
    width: '40px',
    height: '40px',
    objectFit: 'cover',
    marginRight: '10px',
  },
  issue: {
    color: '#ff9800',
    marginBottom: '4px',
  },
  button: {
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    border: 'none',
    padding: '5px 10px',
    borderRadius: '4px',
    color: 'white',
    cursor: 'pointer',
    marginRight: '5px',
    fontSize: '11px',
  },
  fixButton: {
    backgroundColor: '#4CAF50',
    border: 'none',
    padding: '5px 10px',
    borderRadius: '4px',
    color: 'white',
    cursor: 'pointer',
    marginRight: '5px',
    fontSize: '11px',
  },
  input: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    border: '1px solid rgba(255, 255, 255, 0.2)',
    padding: '8px',
    borderRadius: '4px',
    color: 'white',
    width: '100%',
    marginBottom: '10px',
    fontSize: '12px',
  },
  footer: {
    padding: '10px',
    borderTop: '1px solid rgba(255, 255, 255, 0.1)',
    textAlign: 'center',
    fontSize: '11px',
    color: 'rgba(255, 255, 255, 0.6)',
  },
  badge: {
    display: 'inline-block',
    padding: '2px 6px',
    borderRadius: '10px',
    backgroundColor: '#ff5722',
    color: 'white',
    fontSize: '10px',
    marginLeft: '5px',
  },
  statusBadge: {
    display: 'inline-block',
    padding: '2px 6px',
    borderRadius: '10px',
    backgroundColor: '#4CAF50',
    color: 'white',
    fontSize: '10px',
  }
};

const ImageDiagnosticFixer = () => {
  const [isExpanded, setIsExpanded] = useState(true);
  const [imageIssues, setImageIssues] = useState([]);
  const [customUrl, setCustomUrl] = useState('');
  const [customUrlAnalysis, setCustomUrlAnalysis] = useState(null);
  const [summary, setSummary] = useState(null);
  const [fixStatus, setFixStatus] = useState({ fixed: 0, total: 0 });
  const [isFixingAll, setIsFixingAll] = useState(false);

  // Executar diagnóstico ao montar o componente
  useEffect(() => {
    runDiagnostic();
    
    // Executar novamente o diagnóstico quando novas imagens forem carregadas
    const observer = new MutationObserver((mutations) => {
      const hasNewImages = mutations.some(mutation => 
        Array.from(mutation.addedNodes).some(node => 
          node.nodeName === 'IMG' || 
          (node.nodeType === 1 && (node as Element).querySelector('img'))
        )
      );
      if (hasNewImages) {
        setTimeout(runDiagnostic, 1000); // Pequeno atraso para permitir o carregamento
      }
    });
    
    observer.observe(document.body, { childList: true, subtree: true });
    
    // Função para detectar imagens embaçadas por inspeção visual
    detectBlurryImages();
    
    return () => observer.disconnect();
  }, []);
  
  // Detectar imagens potencialmente embaçadas por inspeção visual
  const detectBlurryImages = () => {
    console.log('🔍 Analisando imagens para detectar embaçamento visual...');
    
    setTimeout(() => {
      const allImages = document.querySelectorAll('img');
      let blurryCount = 0;
      
      allImages.forEach(img => {
        // Ignorar imagens muito pequenas
        if (img.width < 50 || img.height < 50) return;
        
        // Verificar se a imagem tem blur aplicado via CSS
        const style = window.getComputedStyle(img);
        if (style.filter.includes('blur') || img.style.filter.includes('blur')) {
          console.log('🔎 Imagem com blur CSS detectada:', img.src);
          blurryCount++;
          highlightBlurryImage(img);
        }
        
        // Verificar se a URL indica que é um placeholder com blur
        if (img.src.includes('e_blur')) {
          console.log('🔎 Imagem com parâmetro de blur URL detectada:', img.src);
          blurryCount++;
          highlightBlurryImage(img);
        }
        
        // Verificar se a URL tem parâmetros de baixa qualidade
        if (img.src.includes('q_35') || img.src.includes('q_40') || img.src.includes('q_50')) {
          console.log('🔎 Imagem com qualidade baixa detectada:', img.src);
          blurryCount++;
          highlightBlurryImage(img);
        }
        
        // Verificar classes específicas que podem indicar placeholders
        if (img.classList.contains('placeholder') || 
            img.classList.contains('blur') || 
            img.parentElement?.classList.contains('blur-wrapper')) {
          console.log('🔎 Imagem com classe de blur detectada:', img.src);
          blurryCount++;
          highlightBlurryImage(img);
        }
      });
      
      if (blurryCount > 0) {
        console.log(`⚠️ Detectadas ${blurryCount} imagens potencialmente embaçadas`);
        setFixStatus(prev => ({ ...prev, total: prev.total + blurryCount }));
      } else {
        console.log('✅ Nenhuma imagem embaçada óbvia detectada');
      }
    }, 2000); // Dar tempo para as imagens carregarem
  };
  
  // Destacar imagens embaçadas
  const highlightBlurryImage = (img) => {
    img.classList.add('image-diagnostic-highlight');
    img.dataset.blurryImage = 'true';
  };

  // Executar o diagnóstico de imagens
  const runDiagnostic = () => {
    const report = generateImageReport();
    setSummary(report.summary);
    setImageIssues(report.detailedIssues);
  };

  // Analisar URL personalizada
  const analyzeCustomUrl = () => {
    if (!customUrl) return;
    
    const analysis = jsAnalyzeImageUrl(customUrl);
    setCustomUrlAnalysis(analysis);
  };

  // Destacar imagem com problemas e tentar consertar o embaçamento
  const highlightImage = (element) => {
    if (!element) return;
    
    // Remover destaques anteriores
    document.querySelectorAll('.image-diagnostic-highlight').forEach(el => {
      el.classList.remove('image-diagnostic-highlight');
    });
    
    // Adicionar destaque à imagem atual
    element.classList.add('image-diagnostic-highlight');
    element.scrollIntoView({ behavior: 'smooth', block: 'center' });
    
    // Tentar corrigir imagem embaçada
    fixBlurryImage(element);
    
    // Adicionar estilo para o destaque se não existir
    if (!document.getElementById('image-diagnostic-styles')) {
      const style = document.createElement('style');
      style.id = 'image-diagnostic-styles';
      style.innerHTML = `
        .image-diagnostic-highlight {
          outline: 4px solid #e91e63 !important;
          outline-offset: 4px !important;
          transition: outline 0.3s ease-out !important;
          animation: pulse-outline 1.5s infinite !important;
        }
        @keyframes pulse-outline {
          0% { outline-color: rgba(233, 30, 99, 0.8); }
          50% { outline-color: rgba(233, 30, 99, 0.3); }
          100% { outline-color: rgba(233, 30, 99, 0.8); }
        }
      `;
      document.head.appendChild(style);
    }
  };
  
  // Função para corrigir imagens embaçadas
  const fixBlurryImage = (imgElement) => {
    if (!imgElement || !imgElement.src) return;
    
    const currentSrc = imgElement.src;
    console.log('🔧 Tentando corrigir imagem embaçada:', currentSrc);
    
    // Usar a função do blurry-image-fixer para obter uma URL de alta qualidade
    const newSrc = getHighQualityImageUrl(currentSrc);
    
    // Se a URL foi modificada, aplicar a nova URL
    if (newSrc !== currentSrc) {
      console.log('🔄 Alterando URL da imagem para versão não-embaçada:', newSrc);
      
      // Criar uma nova imagem para pré-carregar
      const tempImg = new Image();
      tempImg.onload = () => {
        // Quando a nova imagem carregar, atualizar a src da imagem original
        imgElement.src = newSrc;
        console.log('✅ Imagem corrigida aplicada com sucesso!');
        
        // Adicionar indicador visual de correção
        imgElement.style.transition = 'all 0.3s ease-out';
        imgElement.style.filter = 'none';
        imgElement.style.boxShadow = '0 0 0 2px #4CAF50';
        
        // Remover qualquer classe ou estilo que possa causar embaçamento
        imgElement.classList.remove('blur', 'placeholder');
        if (imgElement.parentElement?.classList.contains('blur-wrapper')) {
          imgElement.parentElement.classList.remove('blur-wrapper');
        }
        
        setFixStatus(prev => ({ ...prev, fixed: prev.fixed + 1 }));
        
        setTimeout(() => {
          imgElement.style.boxShadow = 'none';
        }, 2000);
      };
      
      tempImg.onerror = () => {
        console.error('❌ Erro ao carregar nova imagem. Mantendo a original.');
      };
      
      tempImg.src = newSrc;
    } else {
      console.log('⚠️ Não foi possível otimizar mais esta imagem.');
    }
  };
  
  // Corrigir todas as imagens embaçadas
  const fixAllBlurryImages = () => {
    setIsFixingAll(true);
    console.log('🔧 Corrigindo todas as imagens embaçadas...');
    
    // 1. Corrigir imagens identificadas com problemas pelo diagnóstico
    if (imageIssues && imageIssues.length > 0) {
      imageIssues.forEach(issue => {
        if (issue.element) {
          fixBlurryImage(issue.element);
        }
      });
    }
    
    // 2. Usar o utilitário especializado para imagens da introdução
    const stats = replaceBlurryIntroImages();
    setFixStatus(prev => ({ 
      fixed: prev.fixed + stats.replaced,
      total: prev.total + stats.total
    }));
    
    // 3. Verificar todas as imagens com o atributo data-blurry-image
    const markedBlurryImages = document.querySelectorAll('[data-blurry-image="true"]');
    markedBlurryImages.forEach(img => fixBlurryImage(img));
    
    // 4. Verificar imagens da introdução do quiz especificamente
    const introImages = document.querySelectorAll('.quiz-intro img, [data-section="intro"] img');
    console.log(`🔍 Verificando também ${introImages.length} imagens da introdução...`);
    introImages.forEach(img => fixBlurryImage(img));
    
    setTimeout(() => {
      setIsFixingAll(false);
      runDiagnostic(); // Atualizar diagnóstico após correções
    }, 3000);
  };

  if (process.env.NODE_ENV !== 'development') {
    return null;
  }

  return (
    <div style={diagnosticStyles.container as React.CSSProperties}>
      <div style={diagnosticStyles.header as React.CSSProperties}>
        <div>
          📷 Diagnóstico de Imagens
          {summary && (
            <span style={diagnosticStyles.badge as React.CSSProperties}>
              {summary.totalImagesWithIssues}
            </span>
          )}
        </div>
        <button 
          style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer' }}
          onClick={() => setIsExpanded(!isExpanded)}
        >
          {isExpanded ? '↑' : '↓'}
        </button>
      </div>
      
      {isExpanded && (
        <div style={diagnosticStyles.content as React.CSSProperties}>
          {/* Status da correção */}
          <div style={diagnosticStyles.section as React.CSSProperties}>
            <div style={diagnosticStyles.sectionTitle as React.CSSProperties}>Status da Correção</div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>Imagens corrigidas: {fixStatus.fixed} / {fixStatus.total}</div>
              <div style={diagnosticStyles.statusBadge as React.CSSProperties}>
                {isFixingAll ? 'Corrigindo...' : 'Pronto'}
              </div>
            </div>
            <button 
              style={diagnosticStyles.fixButton as React.CSSProperties}
              onClick={fixAllBlurryImages}
              disabled={isFixingAll}
            >
              {isFixingAll ? 'Corrigindo imagens...' : 'Corrigir TODAS as imagens embaçadas'}
            </button>
          </div>
          
          {summary && (
            <div style={diagnosticStyles.section as React.CSSProperties}>
              <div style={diagnosticStyles.sectionTitle as React.CSSProperties}>Resumo</div>
              <div>Total de imagens: {summary.totalImagesRendered}</div>
              <div>Imagens com problemas: {summary.totalImagesWithIssues}</div>
              <div>Bytes totais: {(summary.totalDownloadedBytes / 1024).toFixed(2)} KB</div>
              <div>Impacto no desempenho: {summary.estimatedPerformanceImpact}</div>
            </div>
          )}
          
          <div style={diagnosticStyles.section as React.CSSProperties}>
            <div style={diagnosticStyles.sectionTitle as React.CSSProperties}>
              Analisar URL personalizada
            </div>
            <input
              type="text"
              style={diagnosticStyles.input as React.CSSProperties}
              placeholder="Cole a URL da imagem aqui..."
              value={customUrl}
              onChange={(e) => setCustomUrl(e.target.value)}
            />
            <button 
              style={diagnosticStyles.button as React.CSSProperties}
              onClick={analyzeCustomUrl}
            >
              Analisar
            </button>
          </div>
          
          {customUrlAnalysis && (
            <div style={diagnosticStyles.section as React.CSSProperties}>
              <div style={diagnosticStyles.sectionTitle as React.CSSProperties}>
                Resultados da análise
              </div>
              <div>Formato: {customUrlAnalysis.format}</div>
              <div>Qualidade: {customUrlAnalysis.quality}</div>
              <div>Largura: {customUrlAnalysis.width}</div>
              <div>Transformações: {customUrlAnalysis.transformations?.length || 0}</div>
              {customUrlAnalysis.suggestions?.length > 0 && (
                <>
                  <div style={{ marginTop: '8px', fontWeight: 'bold' }}>Sugestões:</div>
                  {customUrlAnalysis.suggestions.map((sugestão, i) => (
                    <div key={i} style={diagnosticStyles.issue as React.CSSProperties}>
                      • {sugestão}
                    </div>
                  ))}
                </>
              )}
            </div>
          )}
          
          {imageIssues.length > 0 && (
            <div style={diagnosticStyles.section as React.CSSProperties}>
              <div style={diagnosticStyles.sectionTitle as React.CSSProperties}>
                Problemas identificados ({imageIssues.length})
              </div>
              {imageIssues.map((item, index) => (
                <div 
                  key={index} 
                  style={diagnosticStyles.imageRow as React.CSSProperties}
                  onClick={() => highlightImage(item.element)}
                >
                  <div style={{ display: 'flex', alignItems: 'center', marginBottom: '5px' }}>
                    <img 
                      src={item.url} 
                      style={diagnosticStyles.thumbnail as React.CSSProperties} 
                      alt="Thumbnail" 
                    />
                    <div style={{ fontSize: '10px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {item.url.substring(item.url.lastIndexOf('/') + 1)}
                    </div>
                  </div>
                  <div>
                    {item.issues.map((issue, i) => (
                      <div key={i} style={diagnosticStyles.issue as React.CSSProperties}>
                        • {issue}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
          
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '15px' }}>
            <button 
              style={diagnosticStyles.button as React.CSSProperties}
              onClick={runDiagnostic}
            >
              Verificar novamente
            </button>
            <button 
              style={diagnosticStyles.button as React.CSSProperties}
              onClick={() => {
                console.log('Relatório completo gerado:', generateImageReport());
              }}
            >
              Ver no Console
            </button>
          </div>
        </div>
      )}
      
      <div style={diagnosticStyles.footer as React.CSSProperties}>
        Diagnóstico em tempo real • Apenas em desenvolvimento
      </div>
    </div>
  );
};

export default ImageDiagnosticFixer;
