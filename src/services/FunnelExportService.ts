/**
 * FunnelExportService - Service para exportar funis em formato modular
 * 
 * Funcionalidades:
 * - Exporta funis como ZIP modular (meta.json + steps/*.json + README.md)
 * - Detecta contexto (template vs funil customizado vs criado do zero)
 * - Suporta export parcial (apenas steps modificados)
 * - Inclui metadados e documentação
 * 
 * @example
 * ```typescript
 * // Exportar funil completo
 * const zip = await FunnelExportService.exportModular('funnel-id');
 * 
 * // Exportar apenas steps modificados
 * const zip = await FunnelExportService.exportModular('funnel-id', { onlyModified: true });
 * 
 * // Download automático
 * await FunnelExportService.downloadModular('funnel-id', 'meu-funil.zip');
 * ```
 */

import JSZip from 'jszip';
import { supabase } from '@/lib/supabase/client';

export interface ExportOptions {
  /**
   * Exportar apenas steps que foram modificados (vs template original)
   */
  onlyModified?: boolean;
  
  /**
   * Incluir README.md com instruções de uso
   */
  includeReadme?: boolean;
  
  /**
   * Incluir metadados de build (para re-importação)
   */
  includeBuildInfo?: boolean;
  
  /**
   * Formato de compressão (ZIP, TAR.GZ)
   */
  format?: 'zip' | 'tar.gz';
}

export interface ExportResult {
  /**
   * Blob do arquivo exportado
   */
  blob: Blob;
  
  /**
   * Nome sugerido para o arquivo
   */
  filename: string;
  
  /**
   * Estatísticas do export
   */
  stats: {
    totalSteps: number;
    exportedSteps: number;
    totalSize: number;
    createdFrom: 'template' | 'scratch' | 'import';
  };
}

/**
 * Service de exportação de funis
 */
export class FunnelExportService {
  /**
   * Exporta funil em formato modular (ZIP)
   */
  static async exportModular(
    funnelId: string,
    options: ExportOptions = {}
  ): Promise<ExportResult> {
    const {
      onlyModified = false,
      includeReadme = true,
      includeBuildInfo = true,
      format = 'zip'
    } = options;
    
    try {
      // 1. Buscar dados do funil
      const { data: funnel, error } = await supabase
        .from('funnels')
        .select('*')
        .eq('id', funnelId)
        .single();
      
      if (error || !funnel) {
        throw new Error(`Funil não encontrado: ${funnelId}`);
      }
      
      // 2. Extrair steps do settings JSONB
      const settings = funnel.settings || {};
      const steps = settings.steps || {};
      const stepIds = Object.keys(steps).sort();
      
      if (stepIds.length === 0) {
        throw new Error('Funil não possui steps para exportar');
      }
      
      // 3. Criar ZIP
      const zip = new JSZip();
      
      // 4. Adicionar meta.json
      const meta = {
        $schema: '/schemas/funnel-export-meta-v1.schema.json',
        exportVersion: '1.0.0',
        exportedAt: new Date().toISOString(),
        funnel: {
          id: funnel.id,
          name: funnel.name,
          description: funnel.description,
          template_id: funnel.template_id,
          created_from: settings.created_from || 'template',
          totalSteps: stepIds.length
        },
        globalConfig: {
          theme: settings.theme || {},
          navigation: settings.navigation || {},
          scoring: settings.scoring || {}
        },
        buildInfo: includeBuildInfo ? {
          canRebuild: true,
          buildScript: 'npm run build:modular',
          stepsPath: 'steps/'
        } : undefined
      };
      
      zip.file('meta.json', JSON.stringify(meta, null, 2));
      
      // 5. Adicionar steps/
      const stepsFolder = zip.folder('steps');
      let exportedCount = 0;
      
      for (const stepId of stepIds) {
        const stepData = steps[stepId];
        
        // Filtrar steps modificados se solicitado
        if (onlyModified && !stepData._modified) {
          continue;
        }
        
        // Extrair número do step
        const stepNumber = stepId.match(/\d+/)?.[0] || exportedCount + 1;
        const fileName = `step-${stepNumber.toString().padStart(2, '0')}.json`;
        
        // Limpar metadados internos antes de exportar
        const cleanStep = this.cleanStepForExport(stepData);
        
        stepsFolder?.file(fileName, JSON.stringify(cleanStep, null, 2));
        exportedCount++;
      }
      
      // 6. Adicionar README.md
      if (includeReadme) {
        const readme = this.generateReadme(meta, exportedCount);
        zip.file('README.md', readme);
      }
      
      // 7. Gerar arquivo
      const blob = await zip.generateAsync({ 
        type: 'blob',
        compression: 'DEFLATE',
        compressionOptions: { level: 9 }
      });
      
      // 8. Estatísticas
      const stats = {
        totalSteps: stepIds.length,
        exportedSteps: exportedCount,
        totalSize: blob.size,
        createdFrom: settings.created_from || 'template' as const
      };
      
      return {
        blob,
        filename: this.generateFilename(funnel.name, format),
        stats
      };
      
    } catch (err) {
      console.error('[FunnelExportService] Erro ao exportar:', err);
      throw new Error(`Falha ao exportar funil: ${err.message}`);
    }
  }
  
  /**
   * Exporta e faz download automático
   */
  static async downloadModular(
    funnelId: string,
    filename?: string,
    options: ExportOptions = {}
  ): Promise<void> {
    const result = await this.exportModular(funnelId, options);
    
    const url = URL.createObjectURL(result.blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename || result.filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    console.log('[FunnelExportService] Download iniciado:', {
      filename: a.download,
      stats: result.stats
    });
  }
  
  /**
   * Remove metadados internos antes de exportar
   */
  private static cleanStepForExport(stepData: any): any {
    const cleaned = { ...stepData };
    
    // Remover propriedades internas
    delete cleaned._modified;
    delete cleaned._modular;
    delete cleaned._cache;
    delete cleaned._internal;
    
    return cleaned;
  }
  
  /**
   * Gera nome do arquivo de export
   */
  private static generateFilename(funnelName: string, format: string): string {
    const sanitized = funnelName
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
    
    const timestamp = new Date().toISOString().split('T')[0];
    return `${sanitized}-${timestamp}.${format}`;
  }
  
  /**
   * Gera README.md com instruções
   */
  private static generateReadme(meta: any, stepCount: number): string {
    return `# ${meta.funnel.name}

## 📋 Informações do Funil

- **Exportado em:** ${new Date(meta.exportedAt).toLocaleString('pt-BR')}
- **Steps exportados:** ${stepCount}
- **Origem:** ${meta.funnel.created_from}
- **Template base:** ${meta.funnel.template_id || 'N/A'}

## 📁 Estrutura

\`\`\`
${meta.funnel.name.toLowerCase().replace(/\s+/g, '-')}/
├── meta.json              # Metadados e configuração global
├── README.md              # Este arquivo
└── steps/                 # Steps individuais
    ├── step-01.json
    ├── step-02.json
    └── ...
\`\`\`

## ✏️ Como Editar

### 1. Editar Step Existente
- Abra \`steps/step-XX.json\`
- Modifique blocos, propriedades, conteúdo
- Salve o arquivo

### 2. Adicionar Novo Step
- Crie \`steps/step-XX.json\` seguindo estrutura dos existentes
- Atualize \`meta.json\` (\`totalSteps\`)

### 3. Remover Step
- Delete \`steps/step-XX.json\`
- Atualize \`meta.json\` (\`totalSteps\`)

## 📤 Como Re-importar

1. Acesse a plataforma Quiz Flow Pro
2. Vá em "Importar Funil"
3. Selecione este arquivo ZIP
4. Sistema detectará formato automaticamente
5. Confirme importação

## 🎨 Configuração Global

Edite \`meta.json\` para alterar:
- Tema (cores, fontes)
- Navegação (permitir voltar, mostrar progresso)
- Pontuação (bônus, penalidades)

## 🔧 Validação

Para validar estrutura localmente:
\`\`\`bash
npm install -g ajv-cli
ajv validate -s /schemas/funnel-export-meta-v1.schema.json -d meta.json
\`\`\`

## 📚 Documentação

- [Guia Completo de Templates](https://docs.quizflowpro.com/templates)
- [API de Import/Export](https://docs.quizflowpro.com/api/export)
- [Suporte](https://support.quizflowpro.com)

---

**Gerado por:** Quiz Flow Pro v1.0.0  
**Formato:** Modular Export v1.0.0
`;
  }
}

export default FunnelExportService;
