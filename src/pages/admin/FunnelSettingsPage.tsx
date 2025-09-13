import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { funnelLocalStore, FunnelSettings } from '@/services/funnelLocalStore';
import React from 'react';
import { useLocation, useRoute } from 'wouter';

const FunnelSettingsPage: React.FC = () => {
  const [, params] = useRoute('/admin/funnel-settings/:id');
  const [, setLocation] = useLocation();
  const funnelId = params?.id as string;

  const [settings, setSettings] = React.useState<FunnelSettings>(() =>
    funnelLocalStore.getSettings(funnelId || 'default')
  );

  const [name, setName] = React.useState(settings.name);
  const [url, setUrl] = React.useState(settings.url);
  const [seoTitle, setSeoTitle] = React.useState(settings.seo.title);
  const [seoDesc, setSeoDesc] = React.useState(settings.seo.description);
  const [pixel, setPixel] = React.useState(settings.pixel);
  const [token, setToken] = React.useState(settings.token);
  const [utm, setUtm] = React.useState(settings.utm);
  const [webhooks, setWebhooks] = React.useState(settings.webhooks);
  const [collectUserName, setCollectUserName] = React.useState(settings.custom.collectUserName);
  const [variables, setVariables] = React.useState(settings.custom.variables);

  React.useEffect(() => {
    const updated: FunnelSettings = {
      name,
      url,
      seo: { title: seoTitle, description: seoDesc },
      pixel,
      token,
      utm,
      webhooks,
      custom: { collectUserName, variables },
    };
    setSettings(updated);
  }, [name, url, seoTitle, seoDesc, pixel, token, utm, webhooks, collectUserName, variables]);

  const save = () => {
    if (!funnelId) return;
    funnelLocalStore.saveSettings(funnelId, settings);
    const item = funnelLocalStore.get(funnelId);
    if (item)
      funnelLocalStore.upsert({
        ...item,
        name: settings.name,
        url: settings.url,
        updatedAt: new Date().toISOString(),
      });
    setLocation('/admin/meus-funis');
  };

  const addWebhook = () => setWebhooks([...webhooks, { platform: '', url: '' }]);
  const removeWebhook = (i: number) => setWebhooks(webhooks.filter((_, idx) => idx !== i));

  const addVariable = () => setVariables([...variables, { key: '', label: '' }]);
  const removeVariable = (i: number) => setVariables(variables.filter((_, idx) => idx !== i));

  return (
    <div className="p-6 space-y-6" style={{ backgroundColor: '#FAF9F7', minHeight: '100vh' }}>
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold" style={{ color: '#432818' }}>
          Configurações do Funil
        </h1>
        <Button onClick={save} className="bg-[#B89B7A] text-white">
          Salvar
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Identidade */}
        <Card style={{ backgroundColor: '#FFFFFF' }}>
          <CardHeader>
            <CardTitle className="text-[#432818]">Identidade</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>Nome do Funil</Label>
              <Input value={name} onChange={e => setName(e.target.value)} />
            </div>
            <div>
              <Label>URL</Label>
              <Input value={url} onChange={e => setUrl(e.target.value)} placeholder="/meu-funil" />
            </div>
          </CardContent>
        </Card>

        {/* SEO */}
        <Card style={{ backgroundColor: '#FFFFFF' }}>
          <CardHeader>
            <CardTitle className="text-[#432818]">SEO</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>Título</Label>
              <Input value={seoTitle} onChange={e => setSeoTitle(e.target.value)} />
            </div>
            <div>
              <Label>Descrição</Label>
              <Textarea value={seoDesc} onChange={e => setSeoDesc(e.target.value)} />
            </div>
          </CardContent>
        </Card>

        {/* Rastreamento */}
        <Card style={{ backgroundColor: '#FFFFFF' }}>
          <CardHeader>
            <CardTitle className="text-[#432818]">Rastreamento</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>Pixel</Label>
              <Input
                value={pixel}
                onChange={e => setPixel(e.target.value)}
                placeholder="ID do Pixel"
              />
            </div>
            <div>
              <Label>Token</Label>
              <Input
                value={token}
                onChange={e => setToken(e.target.value)}
                placeholder="API Token"
              />
            </div>
          </CardContent>
        </Card>

        {/* UTM */}
        <Card style={{ backgroundColor: '#FFFFFF' }}>
          <CardHeader>
            <CardTitle className="text-[#432818]">UTM</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label>Source</Label>
              <Input
                value={utm.source || ''}
                onChange={e => setUtm({ ...utm, source: e.target.value })}
              />
            </div>
            <div>
              <Label>Medium</Label>
              <Input
                value={utm.medium || ''}
                onChange={e => setUtm({ ...utm, medium: e.target.value })}
              />
            </div>
            <div>
              <Label>Campaign</Label>
              <Input
                value={utm.campaign || ''}
                onChange={e => setUtm({ ...utm, campaign: e.target.value })}
              />
            </div>
            <div>
              <Label>Term</Label>
              <Input
                value={utm.term || ''}
                onChange={e => setUtm({ ...utm, term: e.target.value })}
              />
            </div>
            <div>
              <Label>Content</Label>
              <Input
                value={utm.content || ''}
                onChange={e => setUtm({ ...utm, content: e.target.value })}
              />
            </div>
          </CardContent>
        </Card>

        {/* Webhooks */}
        <Card style={{ backgroundColor: '#FFFFFF' }}>
          <CardHeader>
            <CardTitle className="text-[#432818]">Webhooks</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {webhooks.map((w, i) => (
              <div key={i} className="grid grid-cols-1 md:grid-cols-5 gap-2 items-end">
                <div className="md:col-span-2">
                  <Label>Plataforma</Label>
                  <Input
                    value={w.platform}
                    onChange={e => {
                      const copy = [...webhooks];
                      copy[i] = { ...copy[i], platform: e.target.value };
                      setWebhooks(copy);
                    }}
                  />
                </div>
                <div className="md:col-span-3">
                  <Label>URL</Label>
                  <Input
                    value={w.url}
                    onChange={e => {
                      const copy = [...webhooks];
                      copy[i] = { ...copy[i], url: e.target.value };
                      setWebhooks(copy);
                    }}
                  />
                </div>
                <div>
                  <Button variant="outline" onClick={() => removeWebhook(i)}>
                    Remover
                  </Button>
                </div>
              </div>
            ))}
            <Button variant="outline" onClick={addWebhook}>
              Adicionar Webhook
            </Button>
          </CardContent>
        </Card>

        {/* Variáveis do Quiz */}
        <Card style={{ backgroundColor: '#FFFFFF' }} className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-[#432818]">Variáveis Personalizadas do Quiz</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-2">
              <input
                id="collect-name"
                type="checkbox"
                checked={collectUserName}
                onChange={e => setCollectUserName(e.target.checked)}
              />
              <Label htmlFor="collect-name">Ativar coleta do nome</Label>
            </div>

            {variables.map((v, i) => (
              <div key={i} className="grid grid-cols-1 md:grid-cols-6 gap-2 items-end">
                <div>
                  <Label>Chave</Label>
                  <Input
                    value={v.key}
                    onChange={e => {
                      const copy = [...variables];
                      copy[i] = { ...copy[i], key: e.target.value };
                      setVariables(copy);
                    }}
                  />
                </div>
                <div>
                  <Label>Rótulo</Label>
                  <Input
                    value={v.label}
                    onChange={e => {
                      const copy = [...variables];
                      copy[i] = { ...copy[i], label: e.target.value };
                      setVariables(copy);
                    }}
                  />
                </div>
                <div className="md:col-span-2">
                  <Label>Descrição</Label>
                  <Input
                    value={v.description || ''}
                    onChange={e => {
                      const copy = [...variables];
                      copy[i] = { ...copy[i], description: e.target.value };
                      setVariables(copy);
                    }}
                  />
                </div>
                <div>
                  <Label>Peso</Label>
                  <Input
                    type="number"
                    value={v.scoringWeight || 0}
                    onChange={e => {
                      const copy = [...variables];
                      copy[i] = { ...copy[i], scoringWeight: Number(e.target.value) };
                      setVariables(copy);
                    }}
                  />
                </div>
                <div>
                  <Label>Imagem (URL)</Label>
                  <Input
                    value={v.imageUrl || ''}
                    onChange={e => {
                      const copy = [...variables];
                      copy[i] = { ...copy[i], imageUrl: e.target.value };
                      setVariables(copy);
                    }}
                  />
                </div>
                <div>
                  <Button variant="outline" onClick={() => removeVariable(i)}>
                    Remover
                  </Button>
                </div>
              </div>
            ))}
            <Button variant="outline" onClick={addVariable}>
              Adicionar Variável
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default FunnelSettingsPage;
