import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/components/ui/use-toast';
import { ABTest, ABTestVariation } from '@/hooks/useABTest';
import {
  ArrowLeft,
  BarChart,
  Copy,
  Edit,
  ExternalLink,
  Globe,
  LineChart,
  PieChart,
  Plus,
  Save,
  Trash2,
} from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { useLocation } from 'wouter';

const ABTestManagerPage: React.FC = () => {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [tests, setTests] = useState<ABTest[]>([]);
  const [selectedTest, setSelectedTest] = useState<ABTest | null>(null);
  const [selectedTabId, setSelectedTabId] = useState<'active' | 'archived'>('active');
  const [editMode, setEditMode] = useState(false);
  const [isCreatingTest, setIsCreatingTest] = useState(false);

  // Variáveis de estado para edição
  const [editedTest, setEditedTest] = useState<ABTest | null>(null);

  useEffect(() => {
    loadTests();
  }, []);

  const loadTests = () => {
    try {
      const savedTests = localStorage.getItem('ab_tests');
      if (savedTests) {
        const parsedTests = JSON.parse(savedTests);
        setTests(parsedTests);

        // Se houver testes, selecionar o primeiro
        if (parsedTests.length > 0) {
          setSelectedTest(parsedTests[0]);
        }
      }
    } catch (error) {
      console.error('Erro ao carregar testes:', error);
      toast({
        title: 'Erro ao carregar testes',
        description: 'Não foi possível carregar os testes A/B salvos.',
        variant: 'destructive',
      });
    }
  };

  const handleSaveTests = (updatedTests: ABTest[]) => {
    try {
      localStorage.setItem('ab_tests', JSON.stringify(updatedTests));
      setTests(updatedTests);
      toast({
        title: 'Testes salvos',
        description: 'Os testes A/B foram salvos com sucesso.',
      });
    } catch (error) {
      console.error('Erro ao salvar testes:', error);
      toast({
        title: 'Erro ao salvar testes',
        description: 'Não foi possível salvar os testes A/B.',
        variant: 'destructive',
      });
    }
  };

  const handleCreateTest = () => {
    const newTest: ABTest = {
      id: `test_${Date.now()}`,
      name: 'Novo Teste A/B',
      type: 'result',
      isActive: true,
      startDate: new Date().toISOString(),
      variations: [
        {
          id: `var_${Date.now()}_a`,
          name: 'Variação A (Original)',
          trafficPercentage: 50,
          content: {},
        },
        {
          id: `var_${Date.now()}_b`,
          name: 'Variação B',
          trafficPercentage: 50,
          content: {},
        },
      ],
    };

    const updatedTests = [...tests, newTest];
    handleSaveTests(updatedTests);
    setSelectedTest(newTest);
    setEditedTest(newTest);
    setEditMode(true);
    setIsCreatingTest(true);
  };

  const handleDeleteTest = (testId: string) => {
    if (
      window.confirm('Tem certeza que deseja excluir este teste? Esta ação não pode ser desfeita.')
    ) {
      const updatedTests = tests.filter(test => test.id !== testId);
      handleSaveTests(updatedTests);

      if (selectedTest && selectedTest.id === testId) {
        setSelectedTest(updatedTests.length > 0 ? updatedTests[0] : null);
      }
    }
  };

  const handleToggleTestActive = (testId: string, isActive: boolean) => {
    const updatedTests = tests.map(test => (test.id === testId ? { ...test, isActive } : test));

    handleSaveTests(updatedTests);

    if (selectedTest && selectedTest.id === testId) {
      setSelectedTest({ ...selectedTest, isActive });
    }
  };

  const handleEditTest = () => {
    if (selectedTest) {
      setEditedTest({ ...selectedTest });
      setEditMode(true);
    }
  };

  const handleSaveEdit = () => {
    if (editedTest) {
      const updatedTests = tests.map(test => (test.id === editedTest.id ? editedTest : test));

      handleSaveTests(updatedTests);
      setSelectedTest(editedTest);
      setEditMode(false);
      setIsCreatingTest(false);
    }
  };

  const handleCancelEdit = () => {
    setEditMode(false);
    setIsCreatingTest(false);

    // Se estiver criando um novo teste e cancelar, removê-lo
    if (isCreatingTest && editedTest) {
      const updatedTests = tests.filter(test => test.id !== editedTest.id);
      handleSaveTests(updatedTests);
      setSelectedTest(updatedTests.length > 0 ? updatedTests[0] : null);
    }
  };

  const handleAddVariation = () => {
    if (editedTest) {
      const newVariation: ABTestVariation = {
        id: `var_${Date.now()}`,
        name: `Variação ${String.fromCharCode(65 + editedTest.variations.length)}`,
        trafficPercentage: 0,
        content: {},
      };

      const updatedVariations = [...editedTest.variations, newVariation];

      // Redistribuir percentuais
      const newPercentage = Math.floor(100 / updatedVariations.length);
      const updatedVariationsWithPercentages = updatedVariations.map((variation, index) => {
        if (index === updatedVariations.length - 1) {
          // Última variação recebe o que sobrou para garantir soma = 100%
          const sumOthers = updatedVariations
            .slice(0, -1)
            .reduce((acc, var1) => acc + (var1.trafficPercentage || 0), 0);
          return {
            ...variation,
            trafficPercentage: 100 - sumOthers,
          };
        }
        return { ...variation, trafficPercentage: newPercentage };
      });

      setEditedTest({
        ...editedTest,
        variations: updatedVariationsWithPercentages,
      });
    }
  };

  const handleDeleteVariation = (variationId: string) => {
    if (editedTest) {
      if (editedTest.variations.length <= 2) {
        toast({
          title: 'Operação não permitida',
          description: 'Um teste A/B precisa ter pelo menos duas variações.',
          variant: 'destructive',
        });
        return;
      }

      const updatedVariations = editedTest.variations.filter(
        variation => variation.id !== variationId
      );

      // Redistribuir percentuais
      const newPercentage = Math.floor(100 / updatedVariations.length);
      const updatedVariationsWithPercentages = updatedVariations.map((variation, index) => {
        if (index === updatedVariations.length - 1) {
          // Última variação recebe o que sobrou para garantir soma = 100%
          const sumOthers = updatedVariations
            .slice(0, -1)
            .reduce((acc, var1) => acc + (var1.trafficPercentage || 0), 0);
          return {
            ...variation,
            trafficPercentage: 100 - sumOthers,
          };
        }
        return { ...variation, trafficPercentage: newPercentage };
      });

      setEditedTest({
        ...editedTest,
        variations: updatedVariationsWithPercentages,
      });
    }
  };

  const handleUpdateVariation = (variationId: string, field: keyof ABTestVariation, value: any) => {
    if (editedTest) {
      const updatedVariations = editedTest.variations.map(variation =>
        variation.id === variationId ? { ...variation, [field]: value } : variation
      );

      setEditedTest({
        ...editedTest,
        variations: updatedVariations,
      });
    }
  };

  const handleUpdateVariationContent = (variationId: string, field: string, value: any) => {
    if (editedTest) {
      const updatedVariations = editedTest.variations.map(variation => {
        if (variation.id === variationId) {
          return {
            ...variation,
            content: {
              ...(variation.content || {}),
              [field]: value,
            },
          };
        }
        return variation;
      });

      setEditedTest({
        ...editedTest,
        variations: updatedVariations,
      });
    }
  };

  const handleDuplicateVariation = (variationId: string) => {
    if (editedTest) {
      const variationToDuplicate = editedTest.variations.find(v => v.id === variationId);

      if (!variationToDuplicate) return;

      const newVariation: ABTestVariation = {
        ...JSON.parse(JSON.stringify(variationToDuplicate)),
        id: `var_${Date.now()}`,
        name: `${variationToDuplicate.name} (cópia)`,
        trafficPercentage: 0,
      };

      const updatedVariations = [...editedTest.variations, newVariation];

      // Redistribuir percentuais
      const newPercentage = Math.floor(100 / updatedVariations.length);
      const updatedVariationsWithPercentages = updatedVariations.map((variation, index) => {
        if (index === updatedVariations.length - 1) {
          // Última variação recebe o que sobrou para garantir soma = 100%
          const sumOthers = updatedVariations
            .slice(0, -1)
            .reduce((acc, var1) => acc + (var1.trafficPercentage || 0), 0);
          return {
            ...variation,
            trafficPercentage: 100 - sumOthers,
          };
        }
        return { ...variation, trafficPercentage: newPercentage };
      });

      setEditedTest({
        ...editedTest,
        variations: updatedVariationsWithPercentages,
      });
    }
  };

  // Filtra os testes com base na aba selecionada
  const filteredTests = tests.filter(test =>
    selectedTabId === 'active' ? test.isActive : !test.isActive
  );

  const getConversionRate = (testId: string, variationId: string) => {
    try {
      // Obter o número de visitantes
      const visitorKey = `ab_test_${testId}_visitor_count_${variationId}`;
      const visitors = localStorage.getItem(visitorKey);
      const visitorsCount = visitors ? parseInt(visitors, 10) : 0;

      // Obter o número de conversões
      const conversionKey = `ab_test_${testId}_${variationId}_conversions`;
      const conversions = localStorage.getItem(conversionKey);
      const conversionsCount = conversions ? parseInt(conversions, 10) : 0;

      if (visitorsCount === 0) return '0%';

      const rate = (conversionsCount / visitorsCount) * 100;
      return `${rate.toFixed(2)}%`;
    } catch (error) {
      console.error('Erro ao calcular taxa de conversão:', error);
      return 'N/A';
    }
  };

  return (
    <div className="container mx-auto p-6">
      <div className="flex items-center gap-4 mb-6">
        <Button variant="outline" size="sm" onClick={() => setLocation('/admin')}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Voltar
        </Button>
        <h1 className="text-2xl font-semibold">Gerenciador de Testes A/B</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="md:col-span-1">
          <Card className="mb-4">
            <CardContent className="p-4">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-medium">Testes</h2>
                <Button onClick={handleCreateTest} size="sm" variant="outline">
                  <Plus className="h-4 w-4 mr-1" />
                  Novo Teste
                </Button>
              </div>

              <Tabs
                defaultValue="active"
                value={selectedTabId}
                onValueChange={value => setSelectedTabId(value as 'active' | 'archived')}
                className="w-full"
              >
                <TabsList className="w-full mb-4">
                  <TabsTrigger value="active" className="flex-1">
                    Ativos
                  </TabsTrigger>
                  <TabsTrigger value="archived" className="flex-1">
                    Arquivados
                  </TabsTrigger>
                </TabsList>
              </Tabs>

              {filteredTests.length === 0 ? (
                <div className="text-center py-4 text-muted-foreground">
                  Nenhum teste {selectedTabId === 'active' ? 'ativo' : 'arquivado'} encontrado.
                </div>
              ) : (
                <ul className="space-y-2">
                  {filteredTests.map(test => (
                    <li
                      key={test.id}
                      className={`
                        p-3 rounded-md cursor-pointer hover:bg-muted transition-colors
                        ${selectedTest?.id === test.id ? 'bg-muted border-l-4 border-primary' : ''}
                      `}
                      onClick={() => setSelectedTest(test)}
                    >
                      <div className="font-medium">{test.name}</div>
                      <div className="text-xs text-muted-foreground">
                        {test.type === 'result' ? 'Página de Resultados' : 'Página de Vendas'}
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="md:col-span-3">
          {selectedTest ? (
            <Card>
              <CardContent className="p-6">
                {editMode ? (
                  // Modo de edição
                  <div>
                    <div className="flex justify-between items-center mb-6">
                      <div className="space-y-1 flex-1">
                        <Input
                          value={editedTest?.name || ''}
                          onChange={e =>
                            setEditedTest(prev => (prev ? { ...prev, name: e.target.value } : null))
                          }
                          className="text-xl font-medium border-none bg-transparent focus-visible:ring-0 p-0 h-auto"
                        />
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" onClick={handleCancelEdit}>
                          Cancelar
                        </Button>
                        <Button onClick={handleSaveEdit}>
                          <Save className="h-4 w-4 mr-2" />
                          Salvar
                        </Button>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                      <div className="space-y-3">
                        <div>
                          <Label>Tipo de Teste</Label>
                          <select
                            value={editedTest?.type || 'result'}
                            onChange={e =>
                              setEditedTest(prev =>
                                prev
                                  ? {
                                      ...prev,
                                      type: e.target.value as 'result' | 'sales',
                                    }
                                  : null
                              )
                            }
                            className="w-full mt-1 p-2 border rounded-md"
                          >
                            <option value="result">Página de Resultados</option>
                            <option value="sales">Página de Vendas</option>
                          </select>
                        </div>

                        <div>
                          <Label>Data de Início</Label>
                          <Input
                            type="date"
                            value={
                              editedTest?.startDate
                                ? new Date(editedTest.startDate).toISOString().split('T')[0]
                                : ''
                            }
                            onChange={e =>
                              setEditedTest(prev =>
                                prev
                                  ? {
                                      ...prev,
                                      startDate: new Date(e.target.value).toISOString(),
                                    }
                                  : null
                              )
                            }
                            className="mt-1"
                          />
                        </div>
                      </div>

                      <div className="space-y-3">
                        <div>
                          <Label>Status</Label>
                          <div className="flex items-center space-x-2 mt-1">
                            <Switch
                              checked={editedTest?.isActive || false}
                              onCheckedChange={checked =>
                                setEditedTest(prev =>
                                  prev ? { ...prev, isActive: checked } : null
                                )
                              }
                            />
                            <Label>{editedTest?.isActive ? 'Ativo' : 'Inativo'}</Label>
                          </div>
                        </div>

                        <div>
                          <Label>Data de Término</Label>
                          <Input
                            type="date"
                            value={
                              editedTest?.endDate
                                ? new Date(editedTest.endDate).toISOString().split('T')[0]
                                : ''
                            }
                            onChange={e => {
                              const value = e.target.value;
                              setEditedTest(prev =>
                                prev
                                  ? {
                                      ...prev,
                                      endDate: value ? new Date(value).toISOString() : undefined,
                                    }
                                  : null
                              );
                            }}
                            className="mt-1"
                          />
                        </div>
                      </div>
                    </div>

                    <Separator className="my-6" />

                    <div>
                      <div className="flex justify-between items-center mb-4">
                        <h3 className="text-lg font-medium">Variações</h3>
                        <Button size="sm" variant="outline" onClick={handleAddVariation}>
                          <Plus className="h-4 w-4 mr-1" />
                          Adicionar Variação
                        </Button>
                      </div>

                      <div className="space-y-4">
                        {editedTest?.variations.map(variation => (
                          <Card key={variation.id} className="p-4 border">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                              <div>
                                <Label>Nome da Variação</Label>
                                <Input
                                  value={variation.name}
                                  onChange={e =>
                                    handleUpdateVariation(variation.id, 'name', e.target.value)
                                  }
                                  className="mt-1"
                                />
                              </div>

                              <div>
                                <Label>Domínio (opcional)</Label>
                                <div className="flex items-center mt-1">
                                  <Globe className="h-4 w-4 mr-2 text-muted-foreground" />
                                  <Input
                                    value={variation.domain || ''}
                                    onChange={e =>
                                      handleUpdateVariation(variation.id, 'domain', e.target.value)
                                    }
                                    placeholder="ex: variacao-a.meudominio.com.br"
                                  />
                                </div>
                              </div>

                              <div>
                                <Label>Distribuição de Tráfego (%)</Label>
                                <Input
                                  type="number"
                                  min="0"
                                  max="100"
                                  value={variation.trafficPercentage || 0}
                                  onChange={e =>
                                    handleUpdateVariation(
                                      variation.id,
                                      'trafficPercentage',
                                      parseInt(e.target.value, 10)
                                    )
                                  }
                                  className="mt-1"
                                />
                              </div>
                            </div>

                            <div className="mt-4">
                              <Label>URL de Checkout (para variação de teste)</Label>
                              <Input
                                value={(variation.content?.checkoutUrl as string) || ''}
                                onChange={e =>
                                  handleUpdateVariationContent(
                                    variation.id,
                                    'checkoutUrl',
                                    e.target.value
                                  )
                                }
                                placeholder="https://checkout.exemplo.com/seu-produto"
                                className="mt-1"
                              />
                            </div>

                            <div className="mt-4">
                              <Label>Informações de Preço (para variação de teste)</Label>
                              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-2">
                                <div>
                                  <Label className="text-xs text-muted-foreground">
                                    Preço Regular
                                  </Label>
                                  <Input
                                    value={
                                      (variation.content?.pricing?.regularPrice as string) || ''
                                    }
                                    onChange={e => {
                                      const pricing = {
                                        ...((variation.content?.pricing as object) || {}),
                                        regularPrice: e.target.value,
                                      };
                                      handleUpdateVariationContent(
                                        variation.id,
                                        'pricing',
                                        pricing
                                      );
                                    }}
                                    placeholder="R$ 175,00"
                                    className="mt-1"
                                  />
                                </div>

                                <div>
                                  <Label className="text-xs text-muted-foreground">
                                    Preço Atual
                                  </Label>
                                  <Input
                                    value={
                                      (variation.content?.pricing?.currentPrice as string) || ''
                                    }
                                    onChange={e => {
                                      const pricing = {
                                        ...((variation.content?.pricing as object) || {}),
                                        currentPrice: e.target.value,
                                      };
                                      handleUpdateVariationContent(
                                        variation.id,
                                        'pricing',
                                        pricing
                                      );
                                    }}
                                    placeholder="R$ 39,00"
                                    className="mt-1"
                                  />
                                </div>

                                <div>
                                  <Label className="text-xs text-muted-foreground">
                                    Informação de Parcelamento
                                  </Label>
                                  <Input
                                    value={
                                      (variation.content?.pricing?.installments as string) || ''
                                    }
                                    onChange={e => {
                                      const pricing = {
                                        ...((variation.content?.pricing as object) || {}),
                                        installments: e.target.value,
                                      };
                                      handleUpdateVariationContent(
                                        variation.id,
                                        'pricing',
                                        pricing
                                      );
                                    }}
                                    placeholder="4X de R$ 10,86"
                                    className="mt-1"
                                  />
                                </div>
                              </div>
                            </div>

                            <div className="flex justify-end mt-4 space-x-2">
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleDuplicateVariation(variation.id)}
                              >
                                <Copy className="h-4 w-4 mr-1" />
                                Duplicar
                              </Button>

                              <Button
                                size="sm"
                                variant="destructive"
                                onClick={() => handleDeleteVariation(variation.id)}
                                disabled={editedTest.variations.length <= 2}
                              >
                                <Trash2 className="h-4 w-4 mr-1" />
                                Excluir
                              </Button>
                            </div>
                          </Card>
                        ))}
                      </div>
                    </div>
                  </div>
                ) : (
                  // Modo de visualização
                  <div>
                    <div className="flex justify-between items-center mb-6">
                      <div>
                        <h2 className="text-xl font-semibold">{selectedTest.name}</h2>
                        <p className="text-sm text-muted-foreground">
                          {selectedTest.type === 'result'
                            ? 'Página de Resultados'
                            : 'Página de Vendas'}
                        </p>
                      </div>

                      <div className="flex gap-2">
                        <div className="flex items-center space-x-2">
                          <Switch
                            checked={selectedTest.isActive}
                            onCheckedChange={checked =>
                              handleToggleTestActive(selectedTest.id, checked)
                            }
                          />
                          <Label>{selectedTest.isActive ? 'Ativo' : 'Inativo'}</Label>
                        </div>

                        <Button variant="outline" onClick={handleEditTest}>
                          <Edit className="h-4 w-4 mr-2" />
                          Editar
                        </Button>

                        <Button
                          variant="destructive"
                          onClick={() => handleDeleteTest(selectedTest.id)}
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          Excluir
                        </Button>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                      <div>
                        <h3 className="text-sm font-medium text-muted-foreground">
                          Data de Início
                        </h3>
                        <p>{new Date(selectedTest.startDate).toLocaleDateString()}</p>
                      </div>

                      <div>
                        <h3 className="text-sm font-medium text-muted-foreground">
                          Data de Término
                        </h3>
                        <p>
                          {selectedTest.endDate
                            ? new Date(selectedTest.endDate).toLocaleDateString()
                            : 'Não definida'}
                        </p>
                      </div>

                      <div>
                        <h3 className="text-sm font-medium text-muted-foreground">Status</h3>
                        <div
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            selectedTest.isActive
                              ? 'bg-green-100 text-green-800'
                              : 'bg-gray-100 text-gray-800'
                          }`}
                        >
                          {selectedTest.isActive ? 'Ativo' : 'Inativo'}
                        </div>
                      </div>
                    </div>

                    <div className="mb-8">
                      <h3 className="text-lg font-medium mb-4">Performance</h3>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <Card className="p-4">
                          <div className="flex justify-between items-center">
                            <div>
                              <h4 className="text-sm font-medium text-muted-foreground">
                                Variações
                              </h4>
                              <p className="text-2xl font-semibold">
                                {selectedTest.variations.length}
                              </p>
                            </div>
                            <BarChart className="h-8 w-8 text-muted-foreground opacity-50" />
                          </div>
                        </Card>

                        <Card className="p-4">
                          <div className="flex justify-between items-center">
                            <div>
                              <h4 className="text-sm font-medium text-muted-foreground">
                                Dias Ativos
                              </h4>
                              <p className="text-2xl font-semibold">
                                {Math.ceil(
                                  (new Date().getTime() -
                                    new Date(selectedTest.startDate).getTime()) /
                                    (1000 * 60 * 60 * 24)
                                )}
                              </p>
                            </div>
                            <LineChart className="h-8 w-8 text-muted-foreground opacity-50" />
                          </div>
                        </Card>

                        <Card className="p-4">
                          <div className="flex justify-between items-center">
                            <div>
                              <h4 className="text-sm font-medium text-muted-foreground">
                                Distribuição
                              </h4>
                              <p className="text-2xl font-semibold">
                                {selectedTest.variations
                                  .map(v => v.trafficPercentage || 0)
                                  .reduce((a, b) => a + b, 0)}
                                %
                              </p>
                            </div>
                            <PieChart className="h-8 w-8 text-muted-foreground opacity-50" />
                          </div>
                        </Card>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-lg font-medium mb-4">Variações</h3>

                      <div className="space-y-4">
                        {selectedTest.variations.map(variation => (
                          <Card key={variation.id} className="p-4">
                            <div className="flex flex-col md:flex-row justify-between md:items-center">
                              <div>
                                <h4 className="font-medium">{variation.name}</h4>
                                <div className="flex items-center mt-1 text-sm text-muted-foreground">
                                  <div className="flex items-center mr-4">
                                    <BarChart className="h-4 w-4 mr-1" />
                                    <span>{variation.trafficPercentage || 0}% do tráfego</span>
                                  </div>

                                  {variation.domain && (
                                    <div className="flex items-center">
                                      <Globe className="h-4 w-4 mr-1" />
                                      <span>{variation.domain}</span>
                                    </div>
                                  )}
                                </div>
                              </div>

                              <div className="mt-2 md:mt-0 flex flex-wrap gap-2">
                                <div className="bg-[#B89B7A]/10 text-[#A38A69] px-2.5 py-0.5 rounded-full text-xs">
                                  CR: {getConversionRate(selectedTest.id, variation.id)}
                                </div>

                                {(variation.content?.checkoutUrl as string) && (
                                  <a
                                    href={variation.content?.checkoutUrl as string}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center text-xs text-[#B89B7A] hover:underline"
                                  >
                                    <ExternalLink className="h-3 w-3 mr-1" />
                                    Abrir checkout
                                  </a>
                                )}
                              </div>
                            </div>
                          </Card>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ) : (
            <div className="flex items-center justify-center h-64 bg-muted rounded-lg">
              <div className="text-center">
                <h3 className="text-lg font-medium text-muted-foreground mb-2">
                  Nenhum teste selecionado
                </h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Selecione um teste existente ou crie um novo para começar.
                </p>
                <Button onClick={handleCreateTest}>
                  <Plus className="h-4 w-4 mr-2" />
                  Criar Novo Teste
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ABTestManagerPage;
