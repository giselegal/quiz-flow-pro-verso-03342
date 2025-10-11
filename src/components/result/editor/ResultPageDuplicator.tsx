// @ts-nocheck
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { QuizFunnel, ResultPage, OfferPage } from '@/types/quizResult';
import { Copy, BarChart2, PlusCircle, Trash2 } from 'lucide-react';
import { generateId } from '@/utils/idGenerator';

interface ResultPageDuplicatorProps {
  currentFunnel: QuizFunnel;
  onDuplicate: (newFunnel: QuizFunnel) => void;
  onUpdateAbTest: (resultPage: ResultPage) => void;
}

export const ResultPageDuplicator: React.FC<ResultPageDuplicatorProps> = ({
  currentFunnel,
  onDuplicate,
  onUpdateAbTest,
}) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newFunnelName, setNewFunnelName] = useState('');
  const [isAbTestDialogOpen, setIsAbTestDialogOpen] = useState(false);
  const [abTestVariants, setAbTestVariants] = useState<string[]>(
    currentFunnel.resultPage.settings.abTestVariants || []
  );
  const [newVariantName, setNewVariantName] = useState('');
  const [isAbTestEnabled, setIsAbTestEnabled] = useState(
    currentFunnel.resultPage.settings.abTestEnabled || false
  );

  const handleDuplicateFunnel = () => {
    if (!newFunnelName.trim()) return;

    const newFunnel: QuizFunnel = {
      ...currentFunnel,
      id: generateId(),
      name: newFunnelName,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    onDuplicate(newFunnel);
    setIsDialogOpen(false);
    setNewFunnelName('');
  };

  const handleAddVariant = () => {
    if (!newVariantName.trim()) return;

    const updatedVariants = [...abTestVariants, newVariantName];
    setAbTestVariants(updatedVariants);
    setNewVariantName('');
  };

  const handleRemoveVariant = (index: number) => {
    const updatedVariants = [...abTestVariants];
    updatedVariants.splice(index, 1);
    setAbTestVariants(updatedVariants);
  };

  const handleSaveAbTestSettings = () => {
    const updatedResultPage: ResultPage = {
      ...currentFunnel.resultPage,
      settings: {
        ...currentFunnel.resultPage.settings,
        abTestEnabled: isAbTestEnabled,
        abTestVariants: abTestVariants,
      },
    };

    onUpdateAbTest(updatedResultPage);
    setIsAbTestDialogOpen(false);
  };

  return (
    <>
      <div className="flex space-x-2">
        <Button variant="outline" onClick={() => setIsDialogOpen(true)}>
          <Copy className="h-4 w-4 mr-2" />
          Duplicar Funil
        </Button>
        <Button variant="outline" onClick={() => setIsAbTestDialogOpen(true)}>
          <BarChart2 className="h-4 w-4 mr-2" />
          Teste A/B
        </Button>
      </div>

      {/* Dialog para duplicar funil */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Duplicar Funil</DialogTitle>
            <DialogDescription>
              Crie uma cópia deste funil com um novo nome. Todos os elementos serão duplicados.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="funnelName">Nome do Novo Funil</Label>
              <Input
                id="funnelName"
                placeholder="Ex: Funil de Estilo Verão 2023"
                value={newFunnelName}
                onChange={e => setNewFunnelName(e.target.value)}
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleDuplicateFunnel}>Duplicar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog para configurar teste A/B */}
      <Dialog open={isAbTestDialogOpen} onOpenChange={setIsAbTestDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Configurar Teste A/B</DialogTitle>
            <DialogDescription>
              Configure variantes para testar diferentes versões da sua página de resultados.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="enableAbTest">Ativar Teste A/B</Label>
              <Switch
                id="enableAbTest"
                checked={isAbTestEnabled}
                onCheckedChange={setIsAbTestEnabled}
              />
            </div>

            {isAbTestEnabled && (
              <div className="space-y-4">
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-medium">Variantes</CardTitle>
                    <CardDescription>
                      Adicione variantes para testar diferentes versões da sua página.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {abTestVariants.map((variant, index) => (
                        <div key={index} className="flex items-center justify-between">
                          <span className="text-sm">{variant}</span>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleRemoveVariant(index)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}

                      <div className="flex items-center space-x-2 mt-4">
                        <Input
                          placeholder="Nome da variante"
                          value={newVariantName}
                          onChange={e => setNewVariantName(e.target.value)}
                          className="flex-1"
                        />
                        <Button size="sm" onClick={handleAddVariant}>
                          <PlusCircle className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <div style={{ color: '#8B7355' }}>
                  <p>Após salvar, você poderá configurar quais blocos aparecem em cada variante.</p>
                </div>
              </div>
            )}
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAbTestDialogOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleSaveAbTestSettings}>Salvar Configurações</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};
