/**
 * PAINEL DE PROPRIEDADES AVANÇADO PARA QUESTÕES
 * Permite configurar imagens, pontuação e categorias das opções
 */

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { 
  Plus, 
  Trash2, 
  Image as ImageIcon, 
  Star, 
  Tag, 
  Settings,
  Upload,
  Eye,
  EyeOff
} from 'lucide-react';

// Categorias de estilo disponíveis
const STYLE_CATEGORIES = [
  { id: 'Natural', name: 'Natural', color: '#8B7355' },
  { id: 'Clássico', name: 'Clássico', color: '#4A4A4A' },
  { id: 'Contemporâneo', name: 'Contemporâneo', color: '#2563EB' },
  { id: 'Elegante', name: 'Elegante', color: '#7C3AED' },
  { id: 'Romântico', name: 'Romântico', color: '#EC4899' },
  { id: 'Sexy', name: 'Sexy', color: '#EF4444' },
  { id: 'Dramático', name: 'Dramático', color: '#1F2937' },
  { id: 'Criativo', name: 'Criativo', color: '#F59E0B' },
];

interface QuestionOption {
  id: string;
  text: string;
  imageUrl?: string;
  styleCategory: string;
  points: number;
  keywords: string[];
}

interface QuestionPropertiesPanelProps {
  block: any;
  onPropertyChange: (key: string, value: any) => void;
  onClose?: () => void;
}

export const QuestionPropertiesPanel: React.FC<QuestionPropertiesPanelProps> = ({
  block,
  onPropertyChange,
  onClose
}) => {
  const [activeTab, setActiveTab] = useState('basic');
  const [previewMode, setPreviewMode] = useState(false);

  // Props padrão do bloco
  const {
    question = 'Qual dessas opções representa melhor seu estilo?',
    options = [
      { id: '1', text: 'Opção 1', styleCategory: 'Natural', points: 1, keywords: [] },
      { id: '2', text: 'Opção 2', styleCategory: 'Clássico', points: 1, keywords: [] },
      { id: '3', text: 'Opção 3', styleCategory: 'Contemporâneo', points: 1, keywords: [] },
    ],
    allowMultiple = true,
    maxSelections = 3,
    showImages = true,
    autoAdvance = false,
    questionId = block?.id || 'question-1'
  } = block?.props || {};

  // Adicionar nova opção
  const addOption = () => {
    const newOption: QuestionOption = {
      id: `option-${Date.now()}`,
      text: 'Nova opção',
      styleCategory: 'Natural',
      points: 1,
      keywords: []
    };
    
    onPropertyChange('options', [...options, newOption]);
  };

  // Remover opção
  const removeOption = (optionId: string) => {
    onPropertyChange('options', options.filter((opt: QuestionOption) => opt.id !== optionId));
  };

  // Atualizar opção específica
  const updateOption = (optionId: string, field: string, value: any) => {
    const updatedOptions = options.map((opt: QuestionOption) => 
      opt.id === optionId ? { ...opt, [field]: value } : opt
    );
    onPropertyChange('options', updatedOptions);
  };

  // Adicionar palavra-chave
  const addKeyword = (optionId: string, keyword: string) => {
    if (!keyword.trim()) return;
    
    const option = options.find((opt: QuestionOption) => opt.id === optionId);
    if (option && !option.keywords.includes(keyword)) {
      updateOption(optionId, 'keywords', [...option.keywords, keyword]);
    }
  };

  // Remover palavra-chave
  const removeKeyword = (optionId: string, keyword: string) => {
    const option = options.find((opt: QuestionOption) => opt.id === optionId);
    if (option) {
      updateOption(optionId, 'keywords', option.keywords.filter(k => k !== keyword));
    }
  };

  const getCategoryColor = (categoryId: string) => {
    return STYLE_CATEGORIES.find(cat => cat.id === categoryId)?.color || '#6B7280';
  };

  return (
    <div className="w-80 bg-white border-l border-gray-200 overflow-y-auto">
      <div className="p-4 border-b bg-gray-50">
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-semibold text-gray-900">Propriedades da Questão</h3>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setPreviewMode(!previewMode)}
            >
              {previewMode ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </Button>
            {onClose && (
              <Button variant="ghost" size="sm" onClick={onClose}>
                ×
              </Button>
            )}
          </div>
        </div>
        <p className="text-sm text-gray-600">
          Configure pergunta, opções, pontuação e categorias
        </p>
      </div>

      <div className="p-4">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="basic">Básico</TabsTrigger>
            <TabsTrigger value="options">Opções</TabsTrigger>
            <TabsTrigger value="advanced">Avançado</TabsTrigger>
          </TabsList>

          {/* Configurações Básicas */}
          <TabsContent value="basic" className="space-y-4">
            <div>
              <Label htmlFor="question">Pergunta</Label>
              <Input
                id="question"
                value={question}
                onChange={(e) => onPropertyChange('question', e.target.value)}
                placeholder="Digite sua pergunta..."
              />
            </div>

            <div>
              <Label htmlFor="questionId">ID da Questão</Label>
              <Input
                id="questionId"
                value={questionId}
                onChange={(e) => onPropertyChange('questionId', e.target.value)}
                placeholder="question-1"
              />
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="allowMultiple"
                checked={allowMultiple}
                onCheckedChange={(checked) => onPropertyChange('allowMultiple', checked)}
              />
              <Label htmlFor="allowMultiple">Permitir múltiplas seleções</Label>
            </div>

            {allowMultiple && (
              <div>
                <Label htmlFor="maxSelections">Máximo de seleções</Label>
                <Select
                  value={maxSelections.toString()}
                  onValueChange={(value) => onPropertyChange('maxSelections', parseInt(value))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">1</SelectItem>
                    <SelectItem value="2">2</SelectItem>
                    <SelectItem value="3">3</SelectItem>
                    <SelectItem value="4">4</SelectItem>
                    <SelectItem value="5">5</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}

            <div className="flex items-center space-x-2">
              <Switch
                id="showImages"
                checked={showImages}
                onCheckedChange={(checked) => onPropertyChange('showImages', checked)}
              />
              <Label htmlFor="showImages">Mostrar imagens</Label>
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="autoAdvance"
                checked={autoAdvance}
                onCheckedChange={(checked) => onPropertyChange('autoAdvance', checked)}
              />
              <Label htmlFor="autoAdvance">Avançar automaticamente</Label>
            </div>
          </TabsContent>

          {/* Configuração de Opções */}
          <TabsContent value="options" className="space-y-4">
            <div className="flex items-center justify-between">
              <Label>Opções da Questão ({options.length})</Label>
              <Button onClick={addOption} size="sm">
                <Plus className="w-4 h-4 mr-1" />
                Adicionar
              </Button>
            </div>

            <div className="space-y-4 max-h-96 overflow-y-auto">
              {options.map((option: QuestionOption, index: number) => (
                <Card key={option.id} className="p-3">
                  <div className="space-y-3">
                    {/* Texto da opção */}
                    <div>
                      <Label className="text-xs">Texto da Opção {index + 1}</Label>
                      <Input
                        value={option.text}
                        onChange={(e) => updateOption(option.id, 'text', e.target.value)}
                        placeholder="Texto da opção..."
                        className="text-sm"
                      />
                    </div>

                    {/* Imagem da opção */}
                    {showImages && (
                      <div>
                        <Label className="text-xs flex items-center gap-1">
                          <ImageIcon className="w-3 h-3" />
                          URL da Imagem
                        </Label>
                        <div className="flex gap-2">
                          <Input
                            value={option.imageUrl || ''}
                            onChange={(e) => updateOption(option.id, 'imageUrl', e.target.value)}
                            placeholder="https://..."
                            className="text-sm"
                          />
                          <Button variant="outline" size="sm">
                            <Upload className="w-3 h-3" />
                          </Button>
                        </div>
                        {option.imageUrl && (
                          <div className="mt-2">
                            <img 
                              src={option.imageUrl} 
                              alt={option.text}
                              className="w-full h-20 object-cover rounded border"
                              onError={(e) => {
                                e.currentTarget.style.display = 'none';
                              }}
                            />
                          </div>
                        )}
                      </div>
                    )}

                    {/* Categoria de Estilo */}
                    <div>
                      <Label className="text-xs flex items-center gap-1">
                        <Tag className="w-3 h-3" />
                        Categoria de Estilo
                      </Label>
                      <Select
                        value={option.styleCategory}
                        onValueChange={(value) => updateOption(option.id, 'styleCategory', value)}
                      >
                        <SelectTrigger className="text-sm">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {STYLE_CATEGORIES.map((category) => (
                            <SelectItem key={category.id} value={category.id}>
                              <div className="flex items-center gap-2">
                                <div 
                                  className="w-3 h-3 rounded-full" 
                                  style={{ backgroundColor: category.color }}
                                />
                                {category.name}
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Pontuação */}
                    <div>
                      <Label className="text-xs flex items-center gap-1">
                        <Star className="w-3 h-3" />
                        Pontuação
                      </Label>
                      <Input
                        type="number"
                        min="0"
                        max="10"
                        value={option.points}
                        onChange={(e) => updateOption(option.id, 'points', parseInt(e.target.value) || 0)}
                        className="text-sm"
                      />
                    </div>

                    {/* Palavras-chave */}
                    <div>
                      <Label className="text-xs">Palavras-chave</Label>
                      <div className="flex flex-wrap gap-1 mb-2">
                        {option.keywords.map((keyword) => (
                          <Badge 
                            key={keyword} 
                            variant="secondary"
                            className="text-xs cursor-pointer"
                            onClick={() => removeKeyword(option.id, keyword)}
                          >
                            {keyword} ×
                          </Badge>
                        ))}
                      </div>
                      <Input
                        placeholder="Adicionar palavra-chave..."
                        className="text-sm"
                        onKeyPress={(e) => {
                          if (e.key === 'Enter') {
                            const input = e.target as HTMLInputElement;
                            addKeyword(option.id, input.value);
                            input.value = '';
                          }
                        }}
                      />
                    </div>

                    {/* Preview da categoria */}
                    <div className="flex items-center justify-between pt-2 border-t">
                      <Badge 
                        style={{ 
                          backgroundColor: getCategoryColor(option.styleCategory),
                          color: 'white'
                        }}
                      >
                        {option.styleCategory} • {option.points} pts
                      </Badge>
                      
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeOption(option.id)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Configurações Avançadas */}
          <TabsContent value="advanced" className="space-y-4">
            <Card className="p-3">
              <CardHeader className="p-0 pb-3">
                <CardTitle className="text-sm flex items-center gap-2">
                  <Settings className="w-4 h-4" />
                  Configurações de Cálculo
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0 space-y-3">
                <div>
                  <Label className="text-xs">Total de Pontos Possíveis</Label>
                  <div className="text-sm text-gray-600">
                    {options.reduce((total: number, opt: QuestionOption) => total + opt.points, 0)} pontos
                  </div>
                </div>
                
                <div>
                  <Label className="text-xs">Categorias Utilizadas</Label>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {Array.from(new Set(options.map((opt: QuestionOption) => opt.styleCategory))).map(category => (
                      <Badge 
                        key={category}
                        style={{ 
                          backgroundColor: getCategoryColor(category),
                          color: 'white'
                        }}
                        className="text-xs"
                      >
                        {category}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div>
                  <Label className="text-xs">Distribuição de Pontos</Label>
                  <div className="space-y-1 text-xs">
                    {STYLE_CATEGORIES.map(category => {
                      const categoryPoints = options
                        .filter((opt: QuestionOption) => opt.styleCategory === category.id)
                        .reduce((total: number, opt: QuestionOption) => total + opt.points, 0);
                      
                      if (categoryPoints > 0) {
                        return (
                          <div key={category.id} className="flex justify-between">
                            <span>{category.name}:</span>
                            <span className="font-medium">{categoryPoints} pts</span>
                          </div>
                        );
                      }
                      return null;
                    })}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Configurações de Preview */}
            <Card className="p-3">
              <CardHeader className="p-0 pb-3">
                <CardTitle className="text-sm">Preview da Questão</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="text-xs text-gray-600 mb-2">
                  {question}
                </div>
                <div className="text-xs">
                  • {options.length} opções
                  • {allowMultiple ? `Até ${maxSelections} seleções` : '1 seleção'}
                  • {showImages ? 'Com imagens' : 'Apenas texto'}
                  • {autoAdvance ? 'Auto-avanço' : 'Manual'}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default QuestionPropertiesPanel;
