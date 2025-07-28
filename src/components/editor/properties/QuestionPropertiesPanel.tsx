
import React, { useState } from 'react';
import { Block } from '@/types/editor';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { CORRECT_QUIZ_QUESTIONS, STYLE_CATEGORIES } from '@/data/correctQuizQuestions';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface QuestionPropertiesPanelProps {
  selectedBlock: Block;
  onBlockPropertyChange: (property: string, value: any) => void;
  onNestedPropertyChange: (path: string, value: any) => void;
}

const CATEGORY_COLORS = {
  'Natural': '#8B7355',
  'Clássico': '#4A4A4A',
  'Contemporâneo': '#2563EB',
  'Elegante': '#7C3AED',
  'Romântico': '#EC4899',
  'Sexy': '#EF4444',
  'Dramático': '#1F2937',
  'Criativo': '#F59E0B'
};

export const QuestionPropertiesPanel: React.FC<QuestionPropertiesPanelProps> = ({
  selectedBlock,
  onBlockPropertyChange,
  onNestedPropertyChange
}) => {
  const [selectedQuestionIndex, setSelectedQuestionIndex] = useState(0);
  
  const questionData = selectedBlock.content?.questionData || CORRECT_QUIZ_QUESTIONS[0];
  const showImages = selectedBlock.content?.showImages ?? true;
  const allowMultiple = selectedBlock.content?.allowMultiple ?? false;
  const maxSelections = selectedBlock.content?.maxSelections ?? 1;
  const autoAdvance = selectedBlock.content?.autoAdvance ?? false;
  const questionId = selectedBlock.content?.questionId || 'q1';

  const handleQuestionSelect = (index: number) => {
    setSelectedQuestionIndex(index);
    onBlockPropertyChange('questionData', CORRECT_QUIZ_QUESTIONS[index]);
    onBlockPropertyChange('questionId', `q${index + 1}`);
  };

  const handleOptionUpdate = (optionIndex: number, field: string, value: any) => {
    const updatedOptions = [...questionData.options];
    updatedOptions[optionIndex] = {
      ...updatedOptions[optionIndex],
      [field]: value
    };
    
    const updatedQuestionData = {
      ...questionData,
      options: updatedOptions
    };
    
    onBlockPropertyChange('questionData', updatedQuestionData);
  };

  return (
    <div className="space-y-6">
      <Tabs defaultValue="basic" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="basic">Básico</TabsTrigger>
          <TabsTrigger value="options">Opções</TabsTrigger>
          <TabsTrigger value="advanced">Avançado</TabsTrigger>
        </TabsList>
        
        <TabsContent value="basic" className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="questionSelect">Questão Original</Label>
            <Select
              value={selectedQuestionIndex.toString()}
              onValueChange={(value) => handleQuestionSelect(parseInt(value))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione uma questão" />
              </SelectTrigger>
              <SelectContent>
                {CORRECT_QUIZ_QUESTIONS.map((question, index) => (
                  <SelectItem key={index} value={index.toString()}>
                    Questão {index + 1}: {question.question.substring(0, 50)}...
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="questionText">Texto da Questão</Label>
            <Input
              id="questionText"
              value={questionData.question}
              onChange={(e) => onNestedPropertyChange('questionData.question', e.target.value)}
              placeholder="Digite a pergunta..."
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="questionId">ID da Questão</Label>
            <Input
              id="questionId"
              value={questionId}
              onChange={(e) => onBlockPropertyChange('questionId', e.target.value)}
              placeholder="q1"
            />
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              id="allowMultiple"
              checked={allowMultiple}
              onCheckedChange={(checked) => onBlockPropertyChange('allowMultiple', checked)}
            />
            <Label htmlFor="allowMultiple">Permitir múltiplas seleções</Label>
          </div>

          {allowMultiple && (
            <div className="space-y-2">
              <Label htmlFor="maxSelections">Máximo de seleções</Label>
              <Input
                id="maxSelections"
                type="number"
                min="1"
                max={questionData.options.length}
                value={maxSelections}
                onChange={(e) => onBlockPropertyChange('maxSelections', parseInt(e.target.value))}
              />
            </div>
          )}

          <div className="flex items-center space-x-2">
            <Switch
              id="showImages"
              checked={showImages}
              onCheckedChange={(checked) => onBlockPropertyChange('showImages', checked)}
            />
            <Label htmlFor="showImages">Mostrar imagens</Label>
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              id="autoAdvance"
              checked={autoAdvance}
              onCheckedChange={(checked) => onBlockPropertyChange('autoAdvance', checked)}
            />
            <Label htmlFor="autoAdvance">Avançar automaticamente</Label>
          </div>
        </TabsContent>
        
        <TabsContent value="options" className="space-y-4">
          <div className="space-y-4">
            <h4 className="font-medium text-[#432818]">Configuração das Opções</h4>
            
            {questionData.options.map((option, index) => (
              <Card key={index} className="p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <h5 className="font-medium text-sm">Opção {index + 1}</h5>
                  {option.styleCategory && (
                    <Badge 
                      style={{ 
                        backgroundColor: CATEGORY_COLORS[option.styleCategory] || '#B89B7A',
                        color: 'white'
                      }}
                    >
                      {option.styleCategory}
                    </Badge>
                  )}
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor={`option-text-${index}`}>Texto</Label>
                  <Input
                    id={`option-text-${index}`}
                    value={option.text}
                    onChange={(e) => handleOptionUpdate(index, 'text', e.target.value)}
                    placeholder="Texto da opção"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor={`option-image-${index}`}>URL da Imagem</Label>
                  <Input
                    id={`option-image-${index}`}
                    value={option.imageUrl || ''}
                    onChange={(e) => handleOptionUpdate(index, 'imageUrl', e.target.value)}
                    placeholder="https://exemplo.com/imagem.jpg"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor={`option-category-${index}`}>Categoria de Estilo</Label>
                  <Select
                    value={option.styleCategory || ''}
                    onValueChange={(value) => handleOptionUpdate(index, 'styleCategory', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione uma categoria" />
                    </SelectTrigger>
                    <SelectContent>
                      {STYLE_CATEGORIES.map((category) => (
                        <SelectItem key={category} value={category}>
                          <div className="flex items-center gap-2">
                            <div 
                              className="w-3 h-3 rounded-full"
                              style={{ backgroundColor: CATEGORY_COLORS[category] }}
                            />
                            {category}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor={`option-points-${index}`}>Pontuação</Label>
                  <Input
                    id={`option-points-${index}`}
                    type="number"
                    min="0"
                    max="10"
                    value={option.points || 0}
                    onChange={(e) => handleOptionUpdate(index, 'points', parseInt(e.target.value))}
                  />
                </div>
              </Card>
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="advanced" className="space-y-4">
          <div className="space-y-4">
            <h4 className="font-medium text-[#432818]">Configurações Avançadas</h4>
            
            <Card className="p-4">
              <h5 className="font-medium text-sm mb-3">Estatísticas da Questão</h5>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-[#8F7A6A]">Total de opções:</span>
                  <span className="ml-2 font-medium">{questionData.options.length}</span>
                </div>
                <div>
                  <span className="text-[#8F7A6A]">Total de pontos:</span>
                  <span className="ml-2 font-medium">
                    {questionData.options.reduce((sum, opt) => sum + (opt.points || 0), 0)}
                  </span>
                </div>
                <div>
                  <span className="text-[#8F7A6A]">Categorias ativas:</span>
                  <span className="ml-2 font-medium">
                    {new Set(questionData.options.map(opt => opt.styleCategory).filter(Boolean)).size}
                  </span>
                </div>
                <div>
                  <span className="text-[#8F7A6A]">Com imagens:</span>
                  <span className="ml-2 font-medium">
                    {questionData.options.filter(opt => opt.imageUrl).length}
                  </span>
                </div>
              </div>
            </Card>
            
            <Card className="p-4">
              <h5 className="font-medium text-sm mb-3">Distribuição por Categoria</h5>
              <div className="space-y-2">
                {STYLE_CATEGORIES.map((category) => {
                  const count = questionData.options.filter(opt => opt.styleCategory === category).length;
                  if (count === 0) return null;
                  
                  return (
                    <div key={category} className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2">
                        <div 
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: CATEGORY_COLORS[category] }}
                        />
                        <span>{category}</span>
                      </div>
                      <span className="font-medium">{count} opções</span>
                    </div>
                  );
                })}
              </div>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};
