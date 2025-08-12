import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

export const FacebookAdsTab = () => {
  // Exemplo de URL do quiz com parâmetros UTM
  const exampleUrl = `${window.location.origin}?utm_source=facebook&utm_medium=cpc&utm_campaign=estilo_quiz&utm_content=ad1`;

  // Exemplo de parâmetros UTM para diferentes tipos de anúncios
  const campaignExamples = {
    awareness: 'estilo_quiz_awareness',
    consideration: 'estilo_quiz_consideration',
    conversion: 'estilo_quiz_conversion',
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Configuração de Ads do Facebook</CardTitle>
          <CardDescription>Configure parâmetros UTM para seus anúncios do Facebook</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label>URL do Quiz com Parâmetros UTM</Label>
            <div className="flex space-x-2">
              <Input value={exampleUrl} readOnly className="flex-grow font-mono text-xs" />
              <Button onClick={() => navigator.clipboard.writeText(exampleUrl)} variant="outline">
                Copiar
              </Button>
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Esta URL inclui parâmetros UTM para rastreamento de campanhas do Facebook.
            </p>
          </div>

          <Tabs defaultValue="structure">
            <TabsList className="grid grid-cols-3 mb-4">
              <TabsTrigger value="structure">Estrutura UTM</TabsTrigger>
              <TabsTrigger value="examples">Exemplos</TabsTrigger>
              <TabsTrigger value="generator">Gerador</TabsTrigger>
            </TabsList>

            <TabsContent value="structure" className="space-y-4">
              <div className="space-y-2">
                <h3 className="text-sm font-semibold">Estrutura Recomendada para Parâmetros UTM</h3>
                <div className="rounded-md bg-muted p-4">
                  <ul className="list-disc ml-4 space-y-2 text-sm">
                    <li>
                      <strong>utm_source</strong>: facebook, instagram, messenger
                    </li>
                    <li>
                      <strong>utm_medium</strong>: cpc, social, banner, stories
                    </li>
                    <li>
                      <strong>utm_campaign</strong>: nome_da_campanha
                    </li>
                    <li>
                      <strong>utm_content</strong>: identificador_do_anúncio
                    </li>
                    <li>
                      <strong>utm_term</strong>: palavras-chave (opcional)
                    </li>
                  </ul>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="examples" className="space-y-4">
              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-semibold mb-2">Campanha de Reconhecimento</h3>
                  <Input
                    value={`${window.location.origin}?utm_source=facebook&utm_medium=cpc&utm_campaign=${campaignExamples.awareness}&utm_content=carousel_1`}
                    readOnly
                    className="w-full font-mono text-xs"
                  />
                  <Button
                    onClick={() =>
                      navigator.clipboard.writeText(
                        `${window.location.origin}?utm_source=facebook&utm_medium=cpc&utm_campaign=${campaignExamples.awareness}&utm_content=carousel_1`
                      )
                    }
                    variant="link"
                    className="text-xs px-0 h-6"
                  >
                    Copiar
                  </Button>
                </div>

                <div>
                  <h3 className="text-sm font-semibold mb-2">Campanha de Consideração</h3>
                  <Input
                    value={`${window.location.origin}?utm_source=facebook&utm_medium=cpc&utm_campaign=${campaignExamples.consideration}&utm_content=video_ad`}
                    readOnly
                    className="w-full font-mono text-xs"
                  />
                  <Button
                    onClick={() =>
                      navigator.clipboard.writeText(
                        `${window.location.origin}?utm_source=facebook&utm_medium=cpc&utm_campaign=${campaignExamples.consideration}&utm_content=video_ad`
                      )
                    }
                    variant="link"
                    className="text-xs px-0 h-6"
                  >
                    Copiar
                  </Button>
                </div>

                <div>
                  <h3 className="text-sm font-semibold mb-2">Campanha de Conversão</h3>
                  <Input
                    value={`${window.location.origin}?utm_source=facebook&utm_medium=cpc&utm_campaign=${campaignExamples.conversion}&utm_content=image_ad`}
                    readOnly
                    className="w-full font-mono text-xs"
                  />
                  <Button
                    onClick={() =>
                      navigator.clipboard.writeText(
                        `${window.location.origin}?utm_source=facebook&utm_medium=cpc&utm_campaign=${campaignExamples.conversion}&utm_content=image_ad`
                      )
                    }
                    variant="link"
                    className="text-xs px-0 h-6"
                  >
                    Copiar
                  </Button>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="generator" className="space-y-4">
              <div className="grid gap-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="utm_source">UTM Source</Label>
                    <Input id="utm_source" defaultValue="facebook" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="utm_medium">UTM Medium</Label>
                    <Input id="utm_medium" defaultValue="cpc" />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="utm_campaign">UTM Campaign</Label>
                    <Input id="utm_campaign" defaultValue="estilo_quiz" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="utm_content">UTM Content</Label>
                    <Input id="utm_content" defaultValue="ad_version_1" />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="utm_term">UTM Term (opcional)</Label>
                  <Input id="utm_term" placeholder="Palavras-chave (opcional)" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="generated_url">URL Gerada</Label>
                  <Textarea
                    id="generated_url"
                    className="font-mono text-xs"
                    readOnly
                    rows={3}
                    value={`${window.location.origin}?utm_source=facebook&utm_medium=cpc&utm_campaign=estilo_quiz&utm_content=ad_version_1`}
                  />
                </div>

                <Button className="bg-[#B89B7A] hover:bg-[#A38A69]">Gerar e Copiar URL</Button>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Pixel do Facebook e Parâmetros UTM</CardTitle>
          <CardDescription>Como o Facebook Pixel usa os parâmetros UTM</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-sm space-y-4">
            <p>
              Quando os parâmetros UTM estão presentes na URL, o Facebook Pixel automaticamente:
            </p>

            <ol className="list-decimal ml-5 space-y-2">
              <li>Associa a conversão à campanha e anúncio específicos</li>
              <li>Melhora a atribuição de conversões no Facebook Ads Manager</li>
              <li>Otimiza automaticamente seus anúncios para melhor performance</li>
              <li>Permite criar públicos personalizados baseados em campanhas específicas</li>
            </ol>

            <div className="rounded-md bg-muted p-4 mt-4">
              <h4 className="font-medium mb-2">Dica:</h4>
              <p className="text-xs">
                Para verificar se os parâmetros UTM estão sendo corretamente capturados, visite a
                página de Analytics do admin e selecione a aba "UTM". Lá você poderá ver todas as
                fontes de tráfego e suas respectivas conversões.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
