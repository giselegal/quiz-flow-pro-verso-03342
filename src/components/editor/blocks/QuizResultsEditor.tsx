import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { CalculationMethod, QuizResult, QuizResultsConfig } from '@/hooks/useQuizResults';
import { MoveDown, MoveUp, Plus, Trash } from 'lucide-react';
import React, { useState } from 'react';

interface QuizResultsEditorProps {
  config: Partial<QuizResultsConfig>;
  onChange: (config: Partial<QuizResultsConfig>) => void;
}

const QuizResultsEditor: React.FC<QuizResultsEditorProps> = ({ config, onChange }) => {
  const [activeTab, setActiveTab] = useState('calculation');

  // Valores padrão para config
  const {
    calculationMethod = { type: 'sum' },
    results = [],
    showAllResults = false,
    showScores = true,
  } = config;

  // Atualizar método de cálculo
  const updateCalculationMethod = (updates: Partial<CalculationMethod>) => {
    onChange({
      ...config,
      calculationMethod: {
        ...calculationMethod,
        ...updates,
      },
    });
  };

  // Adicionar resultado
  const addResult = () => {
    const newResult: QuizResult = {
      id: `result-${Date.now()}`,
      title: 'Novo Resultado',
      description: 'Descrição do resultado',
      category: '',
      minScore: 0,
      maxScore: 100,
      displayOrder: results.length + 1,
    };

    onChange({
      ...config,
      results: [...results, newResult],
    });
  };

  // Atualizar resultado
  const updateResult = (index: number, updates: Partial<QuizResult>) => {
    const updatedResults = [...results];
    updatedResults[index] = { ...updatedResults[index], ...updates };

    onChange({
      ...config,
      results: updatedResults,
    });
  };

  // Remover resultado
  const removeResult = (index: number) => {
    const updatedResults = results.filter((_, i) => i !== index);

    onChange({
      ...config,
      results: updatedResults,
    });
  };

  // Mover resultado para cima
  const moveResultUp = (index: number) => {
    if (index <= 0) return;

    const updatedResults = [...results];
    const temp = updatedResults[index];
    updatedResults[index] = updatedResults[index - 1];
    updatedResults[index - 1] = temp;

    // Atualizar displayOrder
    updatedResults.forEach((result, i) => {
      result.displayOrder = i + 1;
    });

    onChange({
      ...config,
      results: updatedResults,
    });
  };

  // Mover resultado para baixo
  const moveResultDown = (index: number) => {
    if (index >= results.length - 1) return;

    const updatedResults = [...results];
    const temp = updatedResults[index];
    updatedResults[index] = updatedResults[index + 1];
    updatedResults[index + 1] = temp;

    // Atualizar displayOrder
    updatedResults.forEach((result, i) => {
      result.displayOrder = i + 1;
    });

    onChange({
      ...config,
      results: updatedResults,
    });
  };

  return (
    <div className="space-y-6">
      <Tabs defaultValue="calculation" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="w-full">
          <TabsTrigger value="calculation" className="flex-1">
            Método de Cálculo
          </TabsTrigger>
          <TabsTrigger value="results" className="flex-1">
            Resultados
          </TabsTrigger>
          <TabsTrigger value="display" className="flex-1">
            Exibição
          </TabsTrigger>
        </TabsList>

        <TabsContent value="calculation" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Método de Cálculo</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="calculation-type">Tipo de Cálculo</Label>
                <Select
                  value={calculationMethod.type}
                  onValueChange={value =>
                    updateCalculationMethod({ type: value as CalculationMethod['type'] })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o método de cálculo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="sum">Soma de Pontos</SelectItem>
                    <SelectItem value="average">Média de Pontos</SelectItem>
                    <SelectItem value="highest">Maior Pontuação</SelectItem>
                    <SelectItem value="majority">Maioria das Respostas</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {(calculationMethod.type === 'highest' || calculationMethod.type === 'majority') && (
                <div>
                  <Label htmlFor="primary-category">Categoria Prioritária (opcional)</Label>
                  <Input
                    id="primary-category"
                    value={calculationMethod.primaryCategory || ''}
                    onChange={e => updateCalculationMethod({ primaryCategory: e.target.value })}
                    placeholder="Ex: Elegante, Clássico, etc."
                  />
                  <p style={{ color: '#8B7355' }}>
                    Em caso de empate, esta categoria terá prioridade
                  </p>
                </div>
              )}

              <div>
                <Label htmlFor="tiebreaker">Critério de Desempate</Label>
                <Select
                  value={calculationMethod.tiebreaker || 'highest_score'}
                  onValueChange={value =>
                    updateCalculationMethod({
                      tiebreaker: value as CalculationMethod['tiebreaker'],
                    })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o critério de desempate" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="highest_score">Maior Pontuação</SelectItem>
                    <SelectItem value="first_category">Primeira Categoria</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="results" className="space-y-4 mt-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-medium">Resultados Possíveis</h3>
            <Button onClick={addResult} variant="outline" size="sm">
              <Plus className="w-4 h-4 mr-2" />
              Adicionar Resultado
            </Button>
          </div>

          {results.length === 0 && (
            <div style={{ backgroundColor: '#FAF9F7' }}>
              <p style={{ color: '#8B7355' }}>Nenhum resultado configurado</p>
              <Button onClick={addResult} variant="outline" size="sm" className="mt-2">
                <Plus className="w-4 h-4 mr-2" />
                Adicionar Resultado
              </Button>
            </div>
          )}

          {results.map((result, index) => (
            <Card key={result.id} className="relative">
              <CardHeader className="pb-2">
                <div className="flex justify-between items-center">
                  <CardTitle className="text-base">Resultado {index + 1}</CardTitle>
                  <div className="flex space-x-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => moveResultUp(index)}
                      disabled={index === 0}
                    >
                      <MoveUp className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => moveResultDown(index)}
                      disabled={index === results.length - 1}
                    >
                      <MoveDown className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      style={{ color: '#432818' }}
                      onClick={() => removeResult(index)}
                    >
                      <Trash className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <Label htmlFor={`result-${index}-title`}>Título</Label>
                  <Input
                    id={`result-${index}-title`}
                    value={result.title}
                    onChange={e => updateResult(index, { title: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor={`result-${index}-description`}>Descrição</Label>
                  <Textarea
                    id={`result-${index}-description`}
                    value={result.description}
                    onChange={e => updateResult(index, { description: e.target.value })}
                    rows={3}
                  />
                </div>
                <div className="flex gap-4">
                  <div className="flex-1">
                    <Label htmlFor={`result-${index}-category`}>Categoria</Label>
                    <Input
                      id={`result-${index}-category`}
                      value={result.category}
                      onChange={e => updateResult(index, { category: e.target.value })}
                      placeholder="Ex: Elegante, Clássico, etc."
                    />
                  </div>
                  <div className="flex-1">
                    <Label htmlFor={`result-${index}-image`}>URL da Imagem</Label>
                    <Input
                      id={`result-${index}-image`}
                      value={result.imageUrl || ''}
                      onChange={e => updateResult(index, { imageUrl: e.target.value })}
                      placeholder="https://exemplo.com/imagem.jpg"
                    />
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="flex-1">
                    <Label htmlFor={`result-${index}-min-score`}>Pontuação Mínima</Label>
                    <Input
                      id={`result-${index}-min-score`}
                      type="number"
                      value={result.minScore}
                      onChange={e => updateResult(index, { minScore: Number(e.target.value) })}
                    />
                  </div>
                  <div className="flex-1">
                    <Label htmlFor={`result-${index}-max-score`}>Pontuação Máxima</Label>
                    <Input
                      id={`result-${index}-max-score`}
                      type="number"
                      value={result.maxScore}
                      onChange={e => updateResult(index, { maxScore: Number(e.target.value) })}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="display" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Opções de Exibição</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="show-all-results">Mostrar Todos os Resultados</Label>
                <Switch
                  id="show-all-results"
                  checked={showAllResults}
                  onCheckedChange={checked => onChange({ ...config, showAllResults: checked })}
                />
              </div>
              <p style={{ color: '#8B7355' }}>
                Se ativado, mostra todos os resultados possíveis, não apenas o principal
              </p>

              <div className="flex items-center justify-between">
                <Label htmlFor="show-scores">Mostrar Pontuações</Label>
                <Switch
                  id="show-scores"
                  checked={showScores}
                  onCheckedChange={checked => onChange({ ...config, showScores: checked })}
                />
              </div>
              <p style={{ color: '#8B7355' }}>
                Se ativado, mostra as pontuações do usuário em cada categoria
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default QuizResultsEditor;
