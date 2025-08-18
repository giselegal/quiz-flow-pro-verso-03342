import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/components/ui/use-toast';
import { useUtmParameters } from '@/hooks/useUtmParameters';
import { ArrowRightIcon, CheckCircleIcon, CopyIcon } from 'lucide-react';
import React, { useEffect, useState } from 'react';

export const UtmSettingsTab: React.FC = () => {
  const { setBaseDomain, generateUtmLink } = useUtmParameters();
  const { toast } = useToast();
  const [domainValue, setDomainValue] = useState('');
  const [exampleLinks, setExampleLinks] = useState({
    facebook: '',
    instagram: '',
    email: '',
    resultado: '',
  });

  const updateExampleLinks = (domain: string) => {
    const newLinks = {
      facebook: generateUtmLink(`https://${domain}/`, 'facebook', 'social', 'brand', 'cta_button'),
      instagram: generateUtmLink(`https://${domain}/`, 'instagram', 'social', 'feed', 'story'),
      email: generateUtmLink(`https://${domain}/`, 'email', 'newsletter', 'weekly', 'footer'),
      resultado: generateUtmLink(
        `https://${domain}/resultado`,
        'facebook',
        'social',
        'retargeting',
        'ad_1'
      ),
    };

    setExampleLinks(newLinks);
  };

  useEffect(() => {
    updateExampleLinks(domainValue || 'giselegalvao.com.br');
  }, [domainValue, generateUtmLink]);

  const handleSaveDomain = () => {
    if (domainValue) {
      setBaseDomain(domainValue);
      toast({
        title: 'Domínio salvo',
        description: `O domínio base para UTMs foi atualizado para ${domainValue}.`,
      });
      updateExampleLinks(domainValue);
    }
  };

  const handleCopyLink = (link: string) => {
    navigator.clipboard.writeText(link);
    toast({
      title: 'Link copiado',
      description: 'O link UTM foi copiado para a área de transferência.',
    });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Configurações de UTM</CardTitle>
          <CardDescription>
            Configure seus parâmetros UTM para rastreamento de campanhas de marketing.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="domain">Domínio Base</Label>
              <div className="flex gap-2">
                <Input
                  id="domain"
                  value={domainValue}
                  onChange={e => setDomainValue(e.target.value)}
                  placeholder="ex: giselegalvao.com.br"
                />
                <Button onClick={handleSaveDomain} size="sm">
                  Salvar
                </Button>
              </div>
              <p className="text-sm text-muted-foreground">
                Este domínio será usado como base para gerar URLs com parâmetros UTM.
              </p>
            </div>

            <Separator className="my-4" />

            <div className="space-y-2">
              <h3 className="text-lg font-medium">Links de Exemplo</h3>
              <p className="text-sm text-muted-foreground">
                Aqui estão alguns exemplos de como seus links UTM serão gerados:
              </p>

              <div className="mt-4 space-y-3">
                {Object.entries(exampleLinks).map(([key, link]) => (
                  <div key={key} className="p-3 bg-muted rounded-md">
                    <div className="flex justify-between items-center mb-1">
                      <span className="font-medium capitalize">{key}</span>
                      <Button variant="ghost" size="sm" onClick={() => handleCopyLink(link)}>
                        <CopyIcon className="h-4 w-4 mr-1" /> Copiar
                      </Button>
                    </div>
                    <code className="text-xs break-all">{link}</code>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <p className="text-xs text-muted-foreground">
            Os parâmetros UTM ajudam a rastrear de onde vêm seus visitantes e como eles interagem
            com seu site.
          </p>
        </CardFooter>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Como usar UTMs</CardTitle>
          <CardDescription>
            Guia rápido sobre como aproveitar ao máximo o rastreamento UTM
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-start gap-2">
              <div className="mt-0.5 flex-shrink-0 bg-primary rounded-full p-1">
                <CheckCircleIcon className="h-4 w-4 text-white" />
              </div>
              <div>
                <h4 className="font-medium">Adicione UTMs aos seus links</h4>
                <p className="text-sm text-muted-foreground">
                  Use os parâmetros UTM em todos os seus canais de marketing para rastrear a origem
                  do tráfego.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-2">
              <div className="mt-0.5 flex-shrink-0 bg-primary rounded-full p-1">
                <CheckCircleIcon className="h-4 w-4 text-white" />
              </div>
              <div>
                <h4 className="font-medium">Monitore os resultados</h4>
                <p className="text-sm text-muted-foreground">
                  Acompanhe o desempenho das diferentes campanhas na guia "Campanhas UTM" do
                  Analytics.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-2">
              <div className="mt-0.5 flex-shrink-0 bg-primary rounded-full p-1">
                <CheckCircleIcon className="h-4 w-4 text-white" />
              </div>
              <div>
                <h4 className="font-medium">Ajuste suas estratégias</h4>
                <p className="text-sm text-muted-foreground">
                  Use os insights obtidos para ajustar suas campanhas de marketing e maximizar a
                  conversão.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-end">
          <Button
            variant="outline"
            size="sm"
            onClick={() => window.open('/admin?tab=analytics', '_self')}
          >
            Ver Analytics <ArrowRightIcon className="ml-1 h-4 w-4" />
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};
