/**
 * Componente para exibir e copiar backup codes
 */

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Copy, Download, CheckCircle } from 'lucide-react';

interface BackupCodesDisplayProps {
  codes: string[];
  masked?: boolean;
}

export const BackupCodesDisplay: React.FC<BackupCodesDisplayProps> = ({ 
  codes, 
  masked = false 
}) => {
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();

  const displayCodes = masked 
    ? codes.map(code => code.slice(0, 2) + '******')
    : codes;

  const handleCopy = () => {
    const text = codes.join('\n');
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    
    toast({
      title: 'Copiado',
      description: 'Códigos de backup copiados para a área de transferência.',
    });
  };

  const handleDownload = () => {
    const text = `BACKUP CODES - MANTENHA EM LUGAR SEGURO\n\n${codes.join('\n')}\n\nGerado em: ${new Date().toLocaleString()}`;
    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'backup-codes.txt';
    a.click();
    URL.revokeObjectURL(url);
    
    toast({
      title: 'Download iniciado',
      description: 'Arquivo de backup codes baixado.',
    });
  };

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-2 gap-2">
        {displayCodes.map((code, index) => (
          <div 
            key={index}
            className="p-2 bg-muted rounded text-center font-mono text-sm"
          >
            {code}
          </div>
        ))}
      </div>

      {!masked && (
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={handleCopy} className="flex-1">
            {copied ? (
              <CheckCircle className="w-4 h-4 mr-2 text-green-500" />
            ) : (
              <Copy className="w-4 h-4 mr-2" />
            )}
            Copiar
          </Button>
          <Button variant="outline" size="sm" onClick={handleDownload} className="flex-1">
            <Download className="w-4 h-4 mr-2" />
            Baixar
          </Button>
        </div>
      )}
    </div>
  );
};
