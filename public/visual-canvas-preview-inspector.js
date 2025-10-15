/**
 * 🔍 INSPECTOR VISUAL - Canvas vs Preview Comparison
 * 
 * Ferramenta visual para comparar canvas e preview lado a lado
 * e identificar diferenças visuais e estruturais
 */

class VisualCanvasPreviewInspector {
  constructor() {
    this.isInspecting = false;
    this.overlayElement = null;
    this.comparisonData = {
      canvas: {},
      preview: {},
      differences: []
    };
  }

  init() {
    console.log('🔍 VISUAL INSPECTOR INICIADO');
    this.createInspectorUI();
    this.bindEvents();
  }

  createInspectorUI() {
    // Remover inspector anterior se existir
    const existing = document.getElementById('visual-inspector');
    if (existing) existing.remove();

    // Criar interface do inspector
    const inspector = document.createElement('div');
    inspector.id = 'visual-inspector';
    inspector.style.cssText = `
      position: fixed;
      top: 10px;
      right: 10px;
      width: 320px;
      background: rgba(0,0,0,0.9);
      color: white;
      border-radius: 8px;
      padding: 15px;
      z-index: 9999;
      font-family: 'Monaco', 'Consolas', monospace;
      font-size: 12px;
      box-shadow: 0 4px 20px rgba(0,0,0,0.3);
      max-height: 80vh;
      overflow-y: auto;
    `;

    inspector.innerHTML = `
      <div style="display: flex; align-items: center; margin-bottom: 10px;">
        <span style="flex: 1; font-weight: bold;">🔍 Canvas vs Preview Inspector</span>
        <button id="close-inspector" style="background: #ff4444; border: none; color: white; padding: 4px 8px; border-radius: 4px; cursor: pointer;">✕</button>
      </div>
      
      <div style="margin-bottom: 10px;">
        <button id="start-inspection" style="background: #4CAF50; border: none; color: white; padding: 8px 12px; border-radius: 4px; cursor: pointer; width: 100%;">
          🔍 Iniciar Inspeção
        </button>
      </div>
      
      <div id="inspection-results" style="display: none;">
        <div id="canvas-info" style="margin-bottom: 10px;">
          <h4 style="color: #4CAF50; margin: 5px 0;">📋 Canvas</h4>
          <div id="canvas-details"></div>
        </div>
        
        <div id="preview-info" style="margin-bottom: 10px;">
          <h4 style="color: #2196F3; margin: 5px 0;">👁️ Preview</h4>
          <div id="preview-details"></div>
        </div>
        
        <div id="differences-info">
          <h4 style="color: #FF9800; margin: 5px 0;">⚠️ Diferenças</h4>
          <div id="differences-details"></div>
        </div>
        
        <div style="margin-top: 10px;">
          <button id="highlight-differences" style="background: #FF9800; border: none; color: white; padding: 6px 10px; border-radius: 4px; cursor: pointer; width: 100%;">
            🎯 Destacar Diferenças
          </button>
        </div>
        
        <div style="margin-top: 10px;">
          <button id="export-comparison" style="background: #9C27B0; border: none; color: white; padding: 6px 10px; border-radius: 4px; cursor: pointer; width: 100%;">
            📊 Exportar Comparação
          </button>
        </div>
      </div>
      
      <div id="inspection-status" style="margin-top: 10px; padding: 8px; background: rgba(255,255,255,0.1); border-radius: 4px;">
        Status: Aguardando inspeção...
      </div>
    `;

    document.body.appendChild(inspector);
    this.inspectorElement = inspector;
  }

  bindEvents() {
    // Fechar inspector
    document.getElementById('close-inspector').onclick = () => {
      this.cleanup();
    };

    // Iniciar inspeção
    document.getElementById('start-inspection').onclick = () => {
      this.startInspection();
    };

    // Destacar diferenças
    document.getElementById('highlight-differences').onclick = () => {
      this.highlightDifferences();
    };

    // Exportar comparação
    document.getElementById('export-comparison').onclick = () => {
      this.exportComparison();
    };
  }

  updateStatus(message, color = '#FFF') {
    const statusElement = document.getElementById('inspection-status');
    if (statusElement) {
      statusElement.innerHTML = `Status: <span style="color: ${color}">${message}</span>`;
    }
  }

  async startInspection() {
    this.updateStatus('🔍 Inspecionando...', '#FFD700');
    
    try {
      // Aguardar elementos carregarem
      await this.waitForElements();
      
      // Analisar canvas
      this.comparisonData.canvas = await this.analyzeCanvas();
      
      // Analisar preview
      this.comparisonData.preview = await this.analyzePreview();
      
      // Comparar estruturas
      this.comparisonData.differences = this.findDifferences();
      
      // Mostrar resultados
      this.displayResults();
      
      this.updateStatus('✅ Inspeção concluída', '#4CAF50');
      
    } catch (error) {
      console.error('Erro na inspeção:', error);
      this.updateStatus(`❌ Erro: ${error.message}`, '#FF4444');
    }
  }

  async analyzeCanvas() {
    this.updateStatus('📋 Analisando Canvas...', '#4CAF50');
    
    const canvasSelectors = [
      '[data-testid="canvas"]',
      '.canvas',
      '[class*="canvas"]',
      '.editor-canvas',
      '#canvas'
    ];
    
    let canvasElement = null;
    for (const selector of canvasSelectors) {
      canvasElement = document.querySelector(selector);
      if (canvasElement) break;
    }
    
    if (!canvasElement) {
      // Tentar encontrar por estrutura
      const editorElements = document.querySelectorAll('[class*="editor"], [id*="editor"]');
      canvasElement = editorElements[0] || document.querySelector('.App > div:first-child');
    }

    return this.analyzeElement(canvasElement, 'Canvas');
  }

  async analyzePreview() {
    this.updateStatus('👁️ Analisando Preview...', '#2196F3');
    
    const previewSelectors = [
      '[data-testid="preview"]',
      '.preview',
      '[class*="preview"]',
      '.quiz-preview',
      '#preview'
    ];
    
    let previewElement = null;
    for (const selector of previewSelectors) {
      previewElement = document.querySelector(selector);
      if (previewElement) break;
    }
    
    if (!previewElement) {
      // Tentar encontrar por estrutura
      const appChildren = document.querySelectorAll('.App > div');
      previewElement = appChildren[1] || appChildren[0];
    }

    return this.analyzeElement(previewElement, 'Preview');
  }

  analyzeElement(element, type) {
    if (!element) {
      return {
        found: false,
        error: `${type} element not found`,
        selectors: []
      };
    }

    const steps = element.querySelectorAll('[data-step]');
    const blocks = element.querySelectorAll('[data-block-id], [data-block-type]');
    const results = element.querySelectorAll('[data-type*="result"], [class*="result"]');
    const forms = element.querySelectorAll('form, [data-type*="form"]');
    const buttons = element.querySelectorAll('button');
    const inputs = element.querySelectorAll('input, textarea, select');

    // Analisar templates carregados
    const templateElements = element.querySelectorAll('[data-template-id], [data-template-version]');
    const templateInfo = Array.from(templateElements).map(el => ({
      id: el.dataset.templateId,
      version: el.dataset.templateVersion,
      type: el.dataset.templateType || el.tagName.toLowerCase()
    }));

    // Analisar Step 20 especificamente
    const step20Elements = element.querySelectorAll('[data-step="20"]');
    const step20Info = {
      count: step20Elements.length,
      hasCalculation: Array.from(step20Elements).some(el => 
        el.innerHTML.includes('calculation') || 
        el.querySelector('[data-type*="calculation"], [class*="calculation"]')
      ),
      sections: step20Elements.length > 0 ? 
        step20Elements[0].querySelectorAll('[data-section], .section').length : 0
    };

    return {
      found: true,
      element: {
        tagName: element.tagName,
        className: element.className,
        id: element.id,
        dataAttributes: Object.keys(element.dataset)
      },
      counts: {
        steps: steps.length,
        blocks: blocks.length,
        results: results.length,
        forms: forms.length,
        buttons: buttons.length,
        inputs: inputs.length
      },
      templates: templateInfo,
      step20: step20Info,
      innerHeight: element.scrollHeight,
      boundingRect: element.getBoundingClientRect()
    };
  }

  findDifferences() {
    this.updateStatus('⚖️ Comparando estruturas...', '#FF9800');
    
    const differences = [];
    const canvas = this.comparisonData.canvas;
    const preview = this.comparisonData.preview;

    if (!canvas.found) {
      differences.push({
        type: 'critical',
        message: 'Canvas element not found',
        impact: 'high'
      });
    }

    if (!preview.found) {
      differences.push({
        type: 'critical',
        message: 'Preview element not found',
        impact: 'high'
      });
    }

    if (canvas.found && preview.found) {
      const counts = canvas.counts;
      const previewCounts = preview.counts;

      // Comparar contagens
      Object.keys(counts).forEach(key => {
        const canvasCount = counts[key];
        const previewCount = previewCounts[key];
        
        if (canvasCount !== previewCount) {
          const diff = Math.abs(canvasCount - previewCount);
          differences.push({
            type: 'count',
            element: key,
            canvas: canvasCount,
            preview: previewCount,
            difference: diff,
            impact: diff > 5 ? 'high' : diff > 2 ? 'medium' : 'low',
            message: `${key}: Canvas(${canvasCount}) vs Preview(${previewCount})`
          });
        }
      });

      // Comparar Step 20
      const canvasStep20 = canvas.step20;
      const previewStep20 = preview.step20;
      
      if (canvasStep20.count !== previewStep20.count) {
        differences.push({
          type: 'step20',
          message: `Step 20 count: Canvas(${canvasStep20.count}) vs Preview(${previewStep20.count})`,
          impact: 'high'
        });
      }

      if (canvasStep20.hasCalculation !== previewStep20.hasCalculation) {
        differences.push({
          type: 'step20',
          message: `Step 20 calculation: Canvas(${canvasStep20.hasCalculation}) vs Preview(${previewStep20.hasCalculation})`,
          impact: 'high'
        });
      }

      // Comparar templates
      const canvasTemplates = canvas.templates.length;
      const previewTemplates = preview.templates.length;
      
      if (canvasTemplates !== previewTemplates) {
        differences.push({
          type: 'template',
          message: `Templates: Canvas(${canvasTemplates}) vs Preview(${previewTemplates})`,
          impact: 'medium'
        });
      }
    }

    return differences;
  }

  displayResults() {
    document.getElementById('inspection-results').style.display = 'block';

    // Canvas info
    const canvasDetails = document.getElementById('canvas-details');
    const canvas = this.comparisonData.canvas;
    
    if (canvas.found) {
      canvasDetails.innerHTML = `
        <div style="font-size: 11px; line-height: 1.4;">
          <div>📍 ${canvas.element.tagName}.${canvas.element.className}</div>
          <div>📊 Steps: ${canvas.counts.steps} | Blocks: ${canvas.counts.blocks}</div>
          <div>🎯 Results: ${canvas.counts.results} | Forms: ${canvas.counts.forms}</div>
          <div>🔢 Step 20: ${canvas.step20.count} (calc: ${canvas.step20.hasCalculation ? 'Yes' : 'No'})</div>
          <div>📋 Templates: ${canvas.templates.length}</div>
        </div>
      `;
    } else {
      canvasDetails.innerHTML = '<div style="color: #FF4444;">❌ Not found</div>';
    }

    // Preview info
    const previewDetails = document.getElementById('preview-details');
    const preview = this.comparisonData.preview;
    
    if (preview.found) {
      previewDetails.innerHTML = `
        <div style="font-size: 11px; line-height: 1.4;">
          <div>📍 ${preview.element.tagName}.${preview.element.className}</div>
          <div>📊 Steps: ${preview.counts.steps} | Blocks: ${preview.counts.blocks}</div>
          <div>🎯 Results: ${preview.counts.results} | Forms: ${preview.counts.forms}</div>
          <div>🔢 Step 20: ${preview.step20.count} (calc: ${preview.step20.hasCalculation ? 'Yes' : 'No'})</div>
          <div>📋 Templates: ${preview.templates.length}</div>
        </div>
      `;
    } else {
      previewDetails.innerHTML = '<div style="color: #FF4444;">❌ Not found</div>';
    }

    // Differences
    const differencesDetails = document.getElementById('differences-details');
    const differences = this.comparisonData.differences;
    
    if (differences.length === 0) {
      differencesDetails.innerHTML = '<div style="color: #4CAF50;">✅ No differences found!</div>';
    } else {
      const diffHtml = differences.map(diff => {
        const color = diff.impact === 'high' ? '#FF4444' : 
                     diff.impact === 'medium' ? '#FF9800' : '#FFF176';
        return `<div style="color: ${color}; font-size: 11px; margin: 2px 0;">
          ${diff.impact === 'high' ? '🔴' : diff.impact === 'medium' ? '🟡' : '🟢'} ${diff.message}
        </div>`;
      }).join('');
      
      differencesDetails.innerHTML = diffHtml;
    }
  }

  highlightDifferences() {
    // Remover highlights anteriores
    document.querySelectorAll('.inspector-highlight').forEach(el => {
      el.classList.remove('inspector-highlight');
    });

    // Adicionar estilo para highlights
    if (!document.getElementById('inspector-highlight-style')) {
      const style = document.createElement('style');
      style.id = 'inspector-highlight-style';
      style.textContent = `
        .inspector-highlight {
          outline: 3px solid #FF4444 !important;
          outline-offset: 2px !important;
          background-color: rgba(255, 68, 68, 0.1) !important;
          position: relative !important;
        }
        .inspector-highlight::after {
          content: 'DIFF';
          position: absolute !important;
          top: -20px !important;
          right: -10px !important;
          background: #FF4444 !important;
          color: white !important;
          padding: 2px 6px !important;
          font-size: 10px !important;
          border-radius: 3px !important;
          z-index: 10000 !important;
        }
      `;
      document.head.appendChild(style);
    }

    // Destacar elementos com diferenças
    this.comparisonData.differences.forEach(diff => {
      if (diff.impact === 'high') {
        // Destacar elementos relevantes
        const selectors = [
          '[data-step="20"]',
          '[data-type*="result"]',
          '[data-block-type*="calculation"]'
        ];
        
        selectors.forEach(selector => {
          const elements = document.querySelectorAll(selector);
          elements.forEach(el => el.classList.add('inspector-highlight'));
        });
      }
    });

    this.updateStatus('🎯 Diferenças destacadas', '#FF9800');
    
    // Remover highlights após 5 segundos
    setTimeout(() => {
      document.querySelectorAll('.inspector-highlight').forEach(el => {
        el.classList.remove('inspector-highlight');
      });
      this.updateStatus('✅ Highlights removidos', '#4CAF50');
    }, 5000);
  }

  exportComparison() {
    const report = {
      timestamp: new Date().toISOString(),
      url: window.location.href,
      userAgent: navigator.userAgent,
      viewport: {
        width: window.innerWidth,
        height: window.innerHeight
      },
      comparison: this.comparisonData
    };

    // Salvar no localStorage
    localStorage.setItem('canvas-preview-comparison', JSON.stringify(report));
    
    // Download como JSON
    const blob = new Blob([JSON.stringify(report, null, 2)], {type: 'application/json'});
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `canvas-preview-comparison-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);

    this.updateStatus('📊 Comparação exportada', '#9C27B0');
  }

  async waitForElements(timeout = 3000) {
    return new Promise((resolve) => {
      const check = () => {
        const elements = document.querySelectorAll('[data-step], [data-block-id], .block, .section');
        if (elements.length > 5) {
          resolve(elements.length);
        } else {
          setTimeout(check, 100);
        }
      };
      
      check();
      
      setTimeout(() => resolve(0), timeout);
    });
  }

  cleanup() {
    if (this.inspectorElement) {
      this.inspectorElement.remove();
    }
    
    // Remover highlights
    document.querySelectorAll('.inspector-highlight').forEach(el => {
      el.classList.remove('inspector-highlight');
    });
    
    // Remover estilo
    const style = document.getElementById('inspector-highlight-style');
    if (style) style.remove();
  }
}

// Inicializar inspector
console.log('🔍 CARREGANDO VISUAL INSPECTOR...');

const visualInspector = new VisualCanvasPreviewInspector();
visualInspector.init();

// Disponibilizar globalmente
window.visualInspector = visualInspector;