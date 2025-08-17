import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { DomainSettings as DomainSettingsType } from '@/types/funnelSettings';
import { Plus, Trash2, CheckCircle, XCircle, Globe, Shield } from 'lucide-react';

interface DomainSettingsProps {
  settings: DomainSettingsType;
  onUpdate: (settings: Partial<DomainSettingsType>) => void;
}

export const DomainSettings: React.FC<DomainSettingsProps> = ({ settings, onUpdate }) => {
  const { toast } = useToast();
  const [verifyingDomain, setVerifyingDomain] = useState(false);
  const [domainStatus, setDomainStatus] = useState<'pending' | 'verified' | 'error'>('pending');

  const verifyDomain = async () => {
    if (!settings.customDomain) return;

    setVerifyingDomain(true);
    try {
      // Simular verificação DNS
      await new Promise(resolve => setTimeout(resolve, 2000));
      setDomainStatus('verified');
      toast({
        title: 'Domínio verificado',
        description: 'Seu domínio foi configurado com sucesso.',
      });
    } catch (error) {
      setDomainStatus('error');
      toast({
        title: 'Erro na verificação',
        description: 'Não foi possível verificar o domínio. Verifique as configurações DNS.',
        variant: 'destructive',
      });
    } finally {
      setVerifyingDomain(false);
    }
  };

  const addRedirect = () => {
    const newRedirect = {
      from: '',
      to: '',
      type: '301' as const,
    };
    onUpdate({
      redirects: [...settings.redirects, newRedirect],
    });
  };

  const updateRedirect = (index: number, updates: any) => {
    const updatedRedirects = settings.redirects.map((redirect, i) =>
      i === index ? { ...redirect, ...updates } : redirect
    );
    onUpdate({ redirects: updatedRedirects });
  };

  const removeRedirect = (index: number) => {
    const updatedRedirects = settings.redirects.filter((_, i) => i !== index);
    onUpdate({ redirects: updatedRedirects });
  };

  const getDomainStatusIcon = () => {
    switch (domainStatus) {
      case 'verified':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'error':
        return <XCircle style={{ color: '#432818' }} />;
      default:
        return <Globe style={{ color: '#8B7355' }} />;
    }
  };

  const getDomainStatusText = () => {
    switch (domainStatus) {
      case 'verified':
        return 'Verificado';
      case 'error':
        return 'Erro';
      default:
        return 'Pendente';
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Globe className="w-5 h-5" />
            <span>Domínio Personalizado</span>
          </CardTitle>
          <CardDescription>Configure um domínio personalizado para seu funil</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="customDomain">Domínio</Label>
            <div className="flex space-x-2">
              <Input
                id="customDomain"
                value={settings.customDomain}
                onChange={e => onUpdate({ customDomain: e.target.value })}
                placeholder="meudominio.com"
              />
              <Button
                onClick={verifyDomain}
                disabled={!settings.customDomain || verifyingDomain}
                variant="outline"
              >
                {verifyingDomain ? 'Verificando...' : 'Verificar'}
              </Button>
            </div>
            <div className="flex items-center space-x-2">
              {getDomainStatusIcon()}
              <span className="text-sm text-muted-foreground">Status: {getDomainStatusText()}</span>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="subdomain">Subdomínio</Label>
            <Input
              id="subdomain"
              value={settings.subdomain}
              onChange={e => onUpdate({ subdomain: e.target.value })}
              placeholder="funil.meudominio.com"
            />
            <p className="text-sm text-muted-foreground">
              Opcional: Configure um subdomínio específico para este funil
            </p>
          </div>

          {settings.customDomain && (
            <Card className="bg-[#B89B7A]/10 border-[#B89B7A]/30">
              <CardContent className="pt-4">
                <h4 className="font-medium mb-2">Configurações DNS Necessárias</h4>
                <div className="space-y-2 text-sm">
                  <div className="bg-white p-2 rounded border font-mono">
                    <strong>Tipo:</strong> A<br />
                    <strong>Nome:</strong> @ (ou deixe em branco)
                    <br />
                    <strong>Valor:</strong> 185.158.133.1
                  </div>
                  {settings.subdomain && (
                    <div className="bg-white p-2 rounded border font-mono">
                      <strong>Tipo:</strong> CNAME
                      <br />
                      <strong>Nome:</strong> {settings.subdomain.split('.')[0]}
                      <br />
                      <strong>Valor:</strong> {settings.customDomain}
                    </div>
                  )}
                </div>
                <p className="text-xs text-muted-foreground mt-2">
                  Adicione esses registros no painel de controle do seu provedor de domínio
                </p>
              </CardContent>
            </Card>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Shield className="w-5 h-5" />
            <span>Certificado SSL</span>
          </CardTitle>
          <CardDescription>Configure a segurança HTTPS para seu domínio</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center space-x-2">
            <Switch
              id="enableSSL"
              checked={settings.enableSSL}
              onCheckedChange={checked => onUpdate({ enableSSL: checked })}
            />
            <Label htmlFor="enableSSL">Habilitar certificado SSL automático</Label>
          </div>
          <p className="text-sm text-muted-foreground">
            O certificado SSL será configurado automaticamente após a verificação do domínio
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Redirecionamentos</span>
            <Button onClick={addRedirect} size="sm">
              <Plus className="w-4 h-4 mr-2" />
              Adicionar
            </Button>
          </CardTitle>
          <CardDescription>Configure redirecionamentos automáticos de URLs</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {settings.redirects.length === 0 ? (
            <p className="text-muted-foreground text-center py-4">
              Nenhum redirecionamento configurado
            </p>
          ) : (
            settings.redirects.map((redirect, index) => (
              <Card key={index} className="border-dashed">
                <CardContent className="pt-4">
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
                    <div className="space-y-2">
                      <Label>De</Label>
                      <Input
                        value={redirect.from}
                        onChange={e => updateRedirect(index, { from: e.target.value })}
                        placeholder="/pagina-antiga"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Para</Label>
                      <Input
                        value={redirect.to}
                        onChange={e => updateRedirect(index, { to: e.target.value })}
                        placeholder="/nova-pagina"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Tipo</Label>
                      <Select
                        value={redirect.type}
                        onValueChange={value => updateRedirect(index, { type: value })}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="301">301 - Permanente</SelectItem>
                          <SelectItem value="302">302 - Temporário</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <Button variant="outline" size="sm" onClick={() => removeRedirect(index)}>
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </CardContent>
      </Card>
    </div>
  );
};
