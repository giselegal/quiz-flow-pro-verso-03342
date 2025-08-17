import React, { useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from '@/hooks/use-toast';
import { 
  Download, 
  Upload, 
  CheckCircle, 
  AlertCircle,
  Copy,
  Save
} from 'lucide-react';

interface JsonTemplate {
  templateVersion: string;
  metadata: {
    id: string;
    name: string;
    description: string;
    category: string;
    tags: string[];
    createdAt: string;
  };
  funnelData: any;
  components: any[];
}

interface TemplateImportExportProps {
  currentFunnelData?: any;
  currentComponents?: any[];
  onImportTemplate?: (template: JsonTemplate) => void;
  onExportComplete?: (filename: string) => void;
  className?: string;
}

const TemplateImportExport: React.FC<TemplateImportExportProps> = ({
  currentFunnelData,
  currentComponents = [],
  onImportTemplate,
  onExportComplete,
  className
}) => {
  const [importDialogOpen, setImportDialogOpen] = useState(false);
  const [exportDialogOpen, setExportDialogOpen] = useState(false);
  const [jsonInput, setJsonInput] = useState('');
  const [validationResult, setValidationResult] = useState<{
    isValid: boolean;
    errors: string[];
    warnings: string[];
  } | null>(null);
  
  // Export form state
  const [exportMetadata, setExportMetadata] = useState({
    name: 'Meu Funil Personalizado',
    description: 'Funil criado no editor',
    category: 'custom',
    tags: ['personalizado']
  });

  // Validate JSON template structure
  const validateJsonTemplate = useCallback((jsonText: string) => {
    const errors: string[] = [];
    const warnings: string[] = [];
    
    try {
      const parsed = JSON.parse(jsonText);
      
      // Check required fields
      if (!parsed.templateVersion) {
        errors.push('Campo "templateVersion" é obrigatório');
      }
      
      if (!parsed.metadata) {
        errors.push('Campo "metadata" é obrigatório');
      } else {
        if (!parsed.metadata.name) {
          errors.push('Campo "metadata.name" é obrigatório');
        }
        if (!parsed.metadata.id) {
          warnings.push('Campo "metadata.id" não encontrado, será gerado automaticamente');
        }
      }
      
      if (!parsed.components || !Array.isArray(parsed.components)) {
        errors.push('Campo "components" deve ser um array');
      } else if (parsed.components.length === 0) {
        warnings.push('Template não contém componentes');
      }
      
      // Check components structure
      parsed.components?.forEach((component: any, index: number) => {
        if (!component.type) {
          errors.push(`Componente ${index + 1}: campo "type" é obrigatório`);
        }
        if (!component.properties) {
          warnings.push(`Componente ${index + 1}: campo "properties" não encontrado`);
        }
      });
      
      return { isValid: errors.length === 0, errors, warnings };
    } catch (error) {
      return { 
        isValid: false, 
        errors: ['JSON inválido: ' + (error as Error).message], 
        warnings: [] 
      };
    }
  }, []);

  // Handle JSON input change
  const handleJsonInputChange = useCallback((value: string) => {
    setJsonInput(value);
    if (value.trim()) {
      const result = validateJsonTemplate(value);
      setValidationResult(result);
    } else {
      setValidationResult(null);
    }
  }, [validateJsonTemplate]);

  // Import template
  const handleImport = useCallback(() => {
    if (!validationResult?.isValid) {
      toast({
        title: 'Erro na validação',
        description: 'Corrija os erros antes de importar',
        variant: 'destructive'
      });
      return;
    }

    try {
      const template = JSON.parse(jsonInput) as JsonTemplate;
      
      // Generate ID if missing
      if (!template.metadata.id) {
        template.metadata.id = `imported-${Date.now()}`;
      }
      
      onImportTemplate?.(template);
      
      toast({
        title: 'Template importado com sucesso',
        description: `"${template.metadata.name}" foi carregado no editor`
      });
      
      setImportDialogOpen(false);
      setJsonInput('');
      setValidationResult(null);
    } catch (error) {
      toast({
        title: 'Erro ao importar',
        description: (error as Error).message,
        variant: 'destructive'
      });
    }
  }, [jsonInput, validationResult, onImportTemplate]);

  // Export current template
  const handleExport = useCallback(() => {
    try {
      const template: JsonTemplate = {
        templateVersion: '2.0',
        metadata: {
          id: `exported-${Date.now()}`,
          name: exportMetadata.name,
          description: exportMetadata.description,
          category: exportMetadata.category,
          tags: exportMetadata.tags,
          createdAt: new Date().toISOString()
        },
        funnelData: currentFunnelData || {},
        components: currentComponents || []
      };

      const jsonString = JSON.stringify(template, null, 2);
      const filename = `${exportMetadata.name.toLowerCase().replace(/[^a-z0-9]/g, '-')}.json`;
      
      // Create and trigger download
      const blob = new Blob([jsonString], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      toast({
        title: 'Template exportado',
        description: `Arquivo "${filename}" foi baixado`
      });

      onExportComplete?.(filename);
      setExportDialogOpen(false);
    } catch (error) {
      toast({
        title: 'Erro ao exportar',
        description: (error as Error).message,
        variant: 'destructive'
      });
    }
  }, [exportMetadata, currentFunnelData, currentComponents, onExportComplete]);

  // Copy JSON to clipboard
  const copyToClipboard = useCallback(() => {
    if (jsonInput) {
      navigator.clipboard.writeText(jsonInput).then(() => {
        toast({
          title: 'Copiado para a área de transferência',
          description: 'JSON template foi copiado'
        });
      });
    }
  }, [jsonInput]);

  // Load from file
  const handleFileLoad = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target?.result as string;
        handleJsonInputChange(content);
      };
      reader.readAsText(file);
    }
  }, [handleJsonInputChange]);

  return (
    <div className={`flex space-x-2 ${className}`}>
      {/* Import Dialog */}
      <Dialog open={importDialogOpen} onOpenChange={setImportDialogOpen}>
        <DialogTrigger asChild>
          <Button 
            variant="outline"
            className="border-[#B89B7A] text-[#6B4F43] hover:bg-[#B89B7A]/10"
          >
            <Upload className="w-4 h-4 mr-2" />
            Importar JSON
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Importar Template JSON</DialogTitle>
            <DialogDescription>
              Cole o JSON do template ou carregue um arquivo para importar
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            {/* File Upload */}
            <div>
              <Label htmlFor="file-upload">Carregar arquivo JSON</Label>
              <Input
                id="file-upload"
                type="file"
                accept=".json"
                onChange={handleFileLoad}
                className="mt-1"
              />
            </div>

            {/* JSON Input */}
            <div>
              <div className="flex items-center justify-between">
                <Label htmlFor="json-input">JSON Template</Label>
                {jsonInput && (
                  <Button size="sm" variant="ghost" onClick={copyToClipboard}>
                    <Copy className="w-3 h-3 mr-1" />
                    Copiar
                  </Button>
                )}
              </div>
              <Textarea
                id="json-input"
                placeholder="Cole aqui o JSON do template..."
                value={jsonInput}
                onChange={(e) => handleJsonInputChange(e.target.value)}
                className="mt-1 font-mono text-sm min-h-[200px]"
              />
            </div>

            {/* Validation Results */}
            {validationResult && (
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center text-sm">
                    {validationResult.isValid ? (
                      <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                    ) : (
                      <AlertCircle className="w-4 h-4 text-red-500 mr-2" />
                    )}
                    Validação do Template
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  {validationResult.errors.length > 0 && (
                    <div>
                      <p className="text-sm font-medium text-red-600">Erros:</p>
                      <ul className="text-sm text-red-600 list-disc list-inside">
                        {validationResult.errors.map((error, index) => (
                          <li key={index}>{error}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                  
                  {validationResult.warnings.length > 0 && (
                    <div>
                      <p className="text-sm font-medium text-yellow-600">Avisos:</p>
                      <ul className="text-sm text-yellow-600 list-disc list-inside">
                        {validationResult.warnings.map((warning, index) => (
                          <li key={index}>{warning}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {validationResult.isValid && (
                    <p className="text-sm text-green-600">
                      ✅ Template válido e pronto para importar
                    </p>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Actions */}
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setImportDialogOpen(false)}>
                Cancelar
              </Button>
              <Button 
                onClick={handleImport}
                disabled={!validationResult?.isValid}
                className="bg-[#B89B7A] hover:bg-[#A38A69]"
              >
                <Upload className="w-4 h-4 mr-2" />
                Importar Template
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Export Dialog */}
      <Dialog open={exportDialogOpen} onOpenChange={setExportDialogOpen}>
        <DialogTrigger asChild>
          <Button 
            variant="outline"
            className="border-[#B89B7A] text-[#6B4F43] hover:bg-[#B89B7A]/10"
          >
            <Download className="w-4 h-4 mr-2" />
            Exportar JSON
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Exportar Template JSON</DialogTitle>
            <DialogDescription>
              Configure os metadados do template antes de exportar
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div>
              <Label htmlFor="export-name">Nome do Template</Label>
              <Input
                id="export-name"
                value={exportMetadata.name}
                onChange={(e) => setExportMetadata(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Nome do seu template"
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="export-description">Descrição</Label>
              <Textarea
                id="export-description"
                value={exportMetadata.description}
                onChange={(e) => setExportMetadata(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Descreva o seu template"
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="export-category">Categoria</Label>
              <Input
                id="export-category"
                value={exportMetadata.category}
                onChange={(e) => setExportMetadata(prev => ({ ...prev, category: e.target.value }))}
                placeholder="Categoria do template"
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="export-tags">Tags (separadas por vírgula)</Label>
              <Input
                id="export-tags"
                value={exportMetadata.tags.join(', ')}
                onChange={(e) => setExportMetadata(prev => ({ 
                  ...prev, 
                  tags: e.target.value.split(',').map(tag => tag.trim()).filter(Boolean)
                }))}
                placeholder="tag1, tag2, tag3"
                className="mt-1"
              />
            </div>

            {/* Preview */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Preview do Export</CardTitle>
              </CardHeader>
              <CardContent className="text-sm space-y-1">
                <p><strong>Componentes:</strong> {currentComponents.length}</p>
                <p><strong>Arquivo:</strong> {exportMetadata.name.toLowerCase().replace(/[^a-z0-9]/g, '-')}.json</p>
              </CardContent>
            </Card>

            {/* Actions */}
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setExportDialogOpen(false)}>
                Cancelar
              </Button>
              <Button 
                onClick={handleExport}
                className="bg-[#B89B7A] hover:bg-[#A38A69]"
              >
                <Save className="w-4 h-4 mr-2" />
                Exportar Template
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default TemplateImportExport;