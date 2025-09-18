/**
 * 🔍 PREVIEW EM TEMPO REAL DAS PROPRIEDADES
 * 
 * Componente que mostra preview das configurações
 * atuais do bloco selecionado
 */

import React from 'react';
import { Card, CardHeader, CardContent, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { 
  Eye, 
  Copy, 
  RotateCcw,
  Palette,
  Grid,
  Settings
} from 'lucide-react';
import { Block } from '@/types/editor';
import { PropertyField } from '@/services/PropertyExtractionService';

interface PropertyPreviewProps {
  block: Block;
  properties: PropertyField[];
  onReset?: () => void;
  onCopy?: () => void;
}

export const PropertyPreview: React.FC<PropertyPreviewProps> = ({
  block,
  properties,
  onReset,
  onCopy
}) => {
  const previewData = React.useMemo(() => {
    const contentProps = properties.filter(p => p.category === 'content');
    const styleProps = properties.filter(p => p.category === 'style');
    const layoutProps = properties.filter(p => p.category === 'layout');
    const behaviorProps = properties.filter(p => p.category === 'behavior');
    
    return {
      content: contentProps,
      style: styleProps, 
      layout: layoutProps,
      behavior: behaviorProps,
      total: properties.length
    };
  }, [properties]);

  const formatValue = (property: PropertyField) => {
    if (property.type === 'boolean') {
      return property.value ? 'Ativado' : 'Desativado';
    }
    
    if (property.type === 'color') {
      return (
        <div className="flex items-center gap-2">
          <div 
            className="w-4 h-4 rounded border"
            style={{ backgroundColor: property.value }}
          />
          <span className="text-xs font-mono">{property.value}</span>
        </div>
      );
    }

    if (property.type === 'array' && Array.isArray(property.value)) {
      return `${property.value.length} item${property.value.length !== 1 ? 's' : ''}`;
    }

    if (property.type === 'range') {
      return `${property.value}${property.step ? (property as any).unit || '' : ''}`;
    }

    return String(property.value || '—');
  };

  return (
    <Card className="h-full">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm flex items-center gap-2">
            <Eye className="w-4 h-4" />
            Preview Configurações
          </CardTitle>
          <div className="flex items-center gap-1">
            {onCopy && (
              <Button variant="ghost" size="sm" onClick={onCopy}>
                <Copy className="w-3 h-3" />
              </Button>
            )}
            {onReset && (
              <Button variant="ghost" size="sm" onClick={onReset}>
                <RotateCcw className="w-3 h-3" />
              </Button>
            )}
          </div>
        </div>
        
        {/* Estatísticas */}
        <div className="flex flex-wrap gap-2">
          <Badge variant="outline" className="text-xs">
            {previewData.total} props
          </Badge>
          <Badge variant="secondary" className="text-xs">
            {block.type}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="p-0">
        <ScrollArea className="h-64">
          <div className="p-4 space-y-4">
            {/* Seção Conteúdo */}
            {previewData.content.length > 0 && (
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Settings className="w-3 h-3" />
                  <h4 className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Conteúdo ({previewData.content.length})
                  </h4>
                </div>
                <div className="space-y-1 pl-5">
                  {previewData.content.slice(0, 3).map(prop => (
                    <div key={prop.key} className="flex items-center justify-between text-xs">
                      <span className="text-muted-foreground truncate">{prop.label}</span>
                      <span className="font-mono text-right ml-2 min-w-0">
                        {formatValue(prop)}
                      </span>
                    </div>
                  ))}
                  {previewData.content.length > 3 && (
                    <div className="text-xs text-muted-foreground">
                      +{previewData.content.length - 3} mais...
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Seção Estilo */}
            {previewData.style.length > 0 && (
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Palette className="w-3 h-3" />
                  <h4 className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Estilo ({previewData.style.length})
                  </h4>
                </div>
                <div className="space-y-1 pl-5">
                  {previewData.style.slice(0, 3).map(prop => (
                    <div key={prop.key} className="flex items-center justify-between text-xs">
                      <span className="text-muted-foreground truncate">{prop.label}</span>
                      <span className="text-right ml-2 min-w-0">
                        {formatValue(prop)}
                      </span>
                    </div>
                  ))}
                  {previewData.style.length > 3 && (
                    <div className="text-xs text-muted-foreground">
                      +{previewData.style.length - 3} mais...
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Seção Layout */}
            {previewData.layout.length > 0 && (
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Grid className="w-3 h-3" />
                  <h4 className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Layout ({previewData.layout.length})
                  </h4>
                </div>
                <div className="space-y-1 pl-5">
                  {previewData.layout.slice(0, 3).map(prop => (
                    <div key={prop.key} className="flex items-center justify-between text-xs">
                      <span className="text-muted-foreground truncate">{prop.label}</span>
                      <span className="font-mono text-right ml-2 min-w-0">
                        {formatValue(prop)}
                      </span>
                    </div>
                  ))}
                  {previewData.layout.length > 3 && (
                    <div className="text-xs text-muted-foreground">
                      +{previewData.layout.length - 3} mais...
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Seção Comportamento */}
            {previewData.behavior.length > 0 && (
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Settings className="w-3 h-3" />
                  <h4 className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Comportamento ({previewData.behavior.length})
                  </h4>
                </div>
                <div className="space-y-1 pl-5">
                  {previewData.behavior.slice(0, 3).map(prop => (
                    <div key={prop.key} className="flex items-center justify-between text-xs">
                      <span className="text-muted-foreground truncate">{prop.label}</span>
                      <span className="font-mono text-right ml-2 min-w-0">
                        {formatValue(prop)}
                      </span>
                    </div>
                  ))}
                  {previewData.behavior.length > 3 && (
                    <div className="text-xs text-muted-foreground">
                      +{previewData.behavior.length - 3} mais...
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};

export default PropertyPreview;