import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';

interface ConfigPanelProps {
  config: Record<string, any>;
  onConfigChange: (newConfig: Record<string, any>) => void;
}

export const ConfigPanel: React.FC<ConfigPanelProps> = ({ config, onConfigChange }) => {
  const [localConfig, setLocalConfig] = useState(config || {});

  const handleChange = (key: string, value: any) => {
    const newConfig = { ...localConfig, [key]: value };
    setLocalConfig(newConfig);
    onConfigChange(newConfig);
  };

  const handleSave = () => {
    onConfigChange(localConfig);
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Configurações</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {Object.entries(localConfig).map(([key, value]) => (
          <div key={key} className="space-y-2">
            <Label htmlFor={key}>{key}</Label>
            {typeof value === 'boolean' ? (
              <Switch
                id={key}
                checked={value}
                onCheckedChange={checked => handleChange(key, checked)}
              />
            ) : (
              <Input
                id={key}
                value={String(value)}
                onChange={e => handleChange(key, e.target.value)}
              />
            )}
          </div>
        ))}
        <Button onClick={handleSave} className="w-full">
          Salvar Configurações
        </Button>
      </CardContent>
    </Card>
  );
};
