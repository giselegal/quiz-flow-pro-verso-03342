import React, { useState, useEffect } from 'react';
import { Block } from '@/types/editor';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Save, RefreshCw, Eye, EyeOff } from 'lucide-react';

interface BlockPropertyPanelProps {
  block: Block | null;
  onBlockUpdate: (blockId: string, changes: Partial<Block>) => void;
  onClose: () => void;
}

export const BlockPropertyPanel: React.FC<BlockPropertyPanelProps> = ({
  block,
  onBlockUpdate,
  onClose,
}) => {
  const [properties, setProperties] = useState<any>({});
  const [content, setContent] = useState<any>({});
  const [hasChanges, setHasChanges] = useState(false);

  // Sync with block changes
  useEffect(() => {
    if (block) {
      setProperties(block.properties || {});
      setContent(block.content || {});
      setHasChanges(false);
    }
  }, [block]);

  if (!block) {
    return (
      <Card className="w-80">
        <CardContent className="p-6 text-center text-muted-foreground">
          <Eye className="w-8 h-8 mx-auto mb-2 opacity-50" />
          <p>Selecione um bloco para editar suas propriedades</p>
        </CardContent>
      </Card>
    );
  }

  const handlePropertyChange = (key: string, value: any) => {
    setProperties((prev: any) => ({ ...prev, [key]: value }));
    setHasChanges(true);
  };

  const handleContentChange = (key: string, value: any) => {
    setContent((prev: any) => ({ ...prev, [key]: value }));
    setHasChanges(true);
  };

  const handleSave = () => {
    onBlockUpdate(block.id, {
      properties,
      content,
    });
    setHasChanges(false);
  };

  const handleReset = () => {
    setProperties(block.properties || {});
    setContent(block.content || {});
    setHasChanges(false);
  };

  const renderProperty = (key: string, value: any, type: 'property' | 'content' = 'property') => {
    const handler = type === 'property' ? handlePropertyChange : handleContentChange;
    
    if (typeof value === 'boolean') {
      return (
        <div key={key} className="flex items-center justify-between">
          <Label htmlFor={key} className="text-sm font-medium">
            {key}
          </Label>
          <Switch
            id={key}
            checked={value}
            onCheckedChange={(checked) => handler(key, checked)}
          />
        </div>
      );
    }

    if (typeof value === 'string') {
      const isLongText = value.length > 50 || key.includes('text') || key.includes('content');
      
      return (
        <div key={key} className="space-y-2">
          <Label htmlFor={key} className="text-sm font-medium">
            {key}
          </Label>
          {isLongText ? (
            <Textarea
              id={key}
              value={value}
              onChange={(e) => handler(key, e.target.value)}
              className="min-h-[80px] resize-none text-sm"
            />
          ) : (
            <Input
              id={key}
              value={value}
              onChange={(e) => handler(key, e.target.value)}
              className="text-sm"
            />
          )}
        </div>
      );
    }

    if (typeof value === 'number') {
      return (
        <div key={key} className="space-y-2">
          <Label htmlFor={key} className="text-sm font-medium">
            {key}
          </Label>
          <Input
            id={key}
            type="number"
            value={value}
            onChange={(e) => handler(key, Number(e.target.value))}
            className="text-sm"
          />
        </div>
      );
    }

    return null;
  };

  return (
    <Card className="w-80 max-h-[600px] overflow-hidden flex flex-col">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">Propriedades</CardTitle>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <EyeOff className="w-4 h-4" />
          </Button>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="secondary">{block.type}</Badge>
          <Badge variant="outline">#{block.id.slice(-6)}</Badge>
        </div>
      </CardHeader>

      <CardContent className="flex-1 overflow-y-auto space-y-4">
        {/* Content Properties */}
        {Object.keys(content).length > 0 && (
          <div className="space-y-3">
            <h4 className="text-sm font-semibold text-muted-foreground">Conteúdo</h4>
            {Object.entries(content).map(([key, value]) => 
              renderProperty(key, value, 'content')
            )}
          </div>
        )}

        {/* Block Properties */}
        {Object.keys(properties).length > 0 && (
          <>
            {Object.keys(content).length > 0 && <Separator />}
            <div className="space-y-3">
              <h4 className="text-sm font-semibold text-muted-foreground">Propriedades</h4>
              {Object.entries(properties).map(([key, value]) => 
                renderProperty(key, value, 'property')
              )}
            </div>
          </>
        )}

        {/* Block Metadata */}
        <Separator />
        <div className="space-y-2">
          <h4 className="text-sm font-semibold text-muted-foreground">Metadata</h4>
          <div className="text-xs text-muted-foreground space-y-1">
            <div>ID: {block.id}</div>
            <div>Tipo: {block.type}</div>
            <div>Ordem: {block.order}</div>
          </div>
        </div>
      </CardContent>

      {/* Action Buttons */}
      {hasChanges && (
        <div className="border-t p-3 bg-muted/50">
          <div className="flex gap-2">
            <Button onClick={handleSave} size="sm" className="flex-1">
              <Save className="w-3 h-3 mr-1" />
              Salvar
            </Button>
            <Button onClick={handleReset} size="sm" variant="outline">
              <RefreshCw className="w-3 h-3" />
            </Button>
          </div>
        </div>
      )}
    </Card>
  );
};