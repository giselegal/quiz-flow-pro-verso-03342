
import React, { useState, useEffect } from 'react';
import { Card, Form, Typography, Space, Divider, Checkbox } from 'antd';
import { Button } from '../ui-new/Button';
import { Input, TextArea, NumberInput } from '../ui-new/Input';
import { Select } from '../ui-new/Select';
import { Badge } from '../ui-new/Badge';
import { Trash2, Plus, GripVertical } from 'lucide-react';

const { Title, Text } = Typography;

interface Question {
  id: string;
  text: string;
  type: 'multiple_choice' | 'single_choice' | 'text' | 'rating';
  options?: string[];
  required: boolean;
  category?: string;
  points?: number;
}

interface QuestionEditorProps {
  question: Question;
  index: number;
  onUpdate: (question: Question) => void;
  onDelete: () => void;
  onDuplicate: () => void;
}

export const QuestionEditor: React.FC<QuestionEditorProps> = ({
  question,
  index,
  onUpdate,
  onDelete,
  onDuplicate
}) => {
  const [localQuestion, setLocalQuestion] = useState<Question>(question);
  
  useEffect(() => {
    setLocalQuestion(question);
  }, [question]);

  const handleTextChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const updatedQuestion = { ...localQuestion, text: e.target.value };
    setLocalQuestion(updatedQuestion);
    onUpdate(updatedQuestion);
  };

  const handleTypeChange = (value: string) => {
    const updatedQuestion = { 
      ...localQuestion, 
      type: value as Question['type'],
      options: value === 'multiple_choice' || value === 'single_choice' ? ['Opção 1', 'Opção 2'] : undefined
    };
    setLocalQuestion(updatedQuestion);
    onUpdate(updatedQuestion);
  };

  const handleOptionChange = (index: number, value: string) => {
    if (!localQuestion.options) return;
    
    const newOptions = [...localQuestion.options];
    newOptions[index] = value;
    const updatedQuestion = { ...localQuestion, options: newOptions };
    setLocalQuestion(updatedQuestion);
    onUpdate(updatedQuestion);
  };

  const handleRequiredChange = (checked: boolean) => {
    const updatedQuestion = { ...localQuestion, required: checked };
    setLocalQuestion(updatedQuestion);
    onUpdate(updatedQuestion);
  };

  const handleCategoryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const updatedQuestion = { ...localQuestion, category: e.target.value };
    setLocalQuestion(updatedQuestion);
    onUpdate(updatedQuestion);
  };

  const addOption = () => {
    if (!localQuestion.options) return;
    
    const newOptions = [...localQuestion.options, `Opção ${localQuestion.options.length + 1}`];
    const updatedQuestion = { ...localQuestion, options: newOptions };
    setLocalQuestion(updatedQuestion);
    onUpdate(updatedQuestion);
  };

  const removeOption = (index: number) => {
    if (!localQuestion.options || localQuestion.options.length <= 2) return;
    
    const newOptions = localQuestion.options.filter((_, i) => i !== index);
    const updatedQuestion = { ...localQuestion, options: newOptions };
    setLocalQuestion(updatedQuestion);
    onUpdate(updatedQuestion);
  };

  const handlePointsChange = (value: number | null) => {
    const points = value || 0;
    const updatedQuestion = { ...localQuestion, points };
    setLocalQuestion(updatedQuestion);
    onUpdate(updatedQuestion);
  };

  return (
    <Card style={{ marginBottom: 16 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <Title level={4} style={{ margin: 0 }}>
          Pergunta {index + 1}
        </Title>
        <Space>
          <Button variant="ghost" size="small" icon={<GripVertical size={16} />} />
          <Button variant="ghost" size="small" icon={<Plus size={16} />} onClick={onDuplicate} />
          <Button variant="ghost" size="small" icon={<Trash2 size={16} />} onClick={onDelete} />
        </Space>
      </div>
      
      <Form layout="vertical">
        {/* Question Text */}
        <Form.Item label="Texto da Pergunta">
          <TextArea
            value={localQuestion.text}
            onChange={handleTextChange}
            placeholder="Digite sua pergunta aqui..."
            rows={3}
          />
        </Form.Item>

        {/* Question Type */}
        <Form.Item label="Tipo de Pergunta">
          <Select 
            value={localQuestion.type} 
            onChange={handleTypeChange}
            options={[
              { value: 'multiple_choice', label: 'Múltipla Escolha' },
              { value: 'single_choice', label: 'Escolha Única' },
              { value: 'text', label: 'Texto Livre' },
              { value: 'rating', label: 'Avaliação' }
            ]}
          />
        </Form.Item>

        {/* Options for multiple/single choice */}
        {(localQuestion.type === 'multiple_choice' || localQuestion.type === 'single_choice') && (
          <Form.Item label="Opções">
            <Space direction="vertical" style={{ width: '100%' }}>
              {localQuestion.options?.map((option, optIndex) => (
                <Space key={optIndex} style={{ display: 'flex', width: '100%' }}>
                  <Input
                    value={option}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleOptionChange(optIndex, e.target.value)}
                    placeholder={`Opção ${optIndex + 1}`}
                    style={{ flex: 1 }}
                  />
                  {localQuestion.options && localQuestion.options.length > 2 && (
                    <Button
                      variant="ghost"
                      size="small"
                      onClick={() => removeOption(optIndex)}
                      icon={<Trash2 size={16} />}
                    />
                  )}
                </Space>
              ))}
              <Button variant="secondary" size="small" onClick={addOption} icon={<Plus size={16} />}>
                Adicionar Opção
              </Button>
            </Space>
          </Form.Item>
        )}

        {/* Additional Settings */}
        <Space>
          <Checkbox
            checked={localQuestion.required}
            onChange={(e) => handleRequiredChange(e.target.checked)}
          >
            Obrigatória
          </Checkbox>
          
          <Space>
            <Text>Pontos:</Text>
            <NumberInput
              value={localQuestion.points || 0}
              onChange={handlePointsChange}
              min={0}
              style={{ width: 80 }}
            />
          </Space>
        </Space>

        {/* Category */}
        <Form.Item label="Categoria">
          <Input
            value={localQuestion.category || ''}
            onChange={handleCategoryChange}
            placeholder="Digite a categoria..."
          />
        </Form.Item>

        {/* Question Stats */}
        <Space wrap>
          <Badge variant="secondary">
            Tipo: {localQuestion.type === 'multiple_choice' ? 'Múltipla Escolha' : 
                   localQuestion.type === 'single_choice' ? 'Escolha Única' : 
                   localQuestion.type === 'text' ? 'Texto' : 'Avaliação'}
          </Badge>
          {localQuestion.required && (
            <Badge variant="danger">Obrigatória</Badge>
          )}
          {localQuestion.points && localQuestion.points > 0 && (
            <Badge variant="info">{localQuestion.points} pontos</Badge>
          )}
        </Space>
      </Form>
    </Card>
  );
};

export default QuestionEditor;
