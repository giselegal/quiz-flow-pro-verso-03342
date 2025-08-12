/**
 * EXEMPLO DE USO - COMPONENTE CONFIGURÁVEL DE QUESTÕES
 * Demonstra como usar o QuizQuestionBlockConfigurable no editor
 */

import React, { useState } from 'react';
import { BlockData } from '@/types/blocks';
import { Button } from '@/components/ui/button';

// Exemplo de estrutura de dados para uma questão configurada
const exemploQuestaoConfigurada = {
  id: 'questao-estilo-1',
  type: 'quiz-question-configurable',
  props: {
    question: 'Qual dessas opções representa melhor seu estilo pessoal?',
    questionId: 'estilo-personal-q1',
    allowMultiple: true,
    maxSelections: 2,
    showImages: true,
    autoAdvance: false,
    options: [
      {
        id: 'opt-1',
        text: 'Elegante e sofisticado',
        imageUrl: 'https://exemplo.com/elegante.jpg',
        styleCategory: 'Clássico',
        points: 3,
        keywords: ['elegante', 'sofisticado', 'formal', 'atemporal'],
      },
      {
        id: 'opt-2',
        text: 'Moderno e inovador',
        imageUrl: 'https://exemplo.com/moderno.jpg',
        styleCategory: 'Contemporâneo',
        points: 4,
        keywords: ['moderno', 'inovador', 'tecnológico', 'futurista'],
      },
      {
        id: 'opt-3',
        text: 'Natural e autêntico',
        imageUrl: 'https://exemplo.com/natural.jpg',
        styleCategory: 'Natural',
        points: 2,
        keywords: ['natural', 'autêntico', 'orgânico', 'sustentável'],
      },
      {
        id: 'opt-4',
        text: 'Dramático e marcante',
        imageUrl: 'https://exemplo.com/dramatico.jpg',
        styleCategory: 'Dramático',
        points: 5,
        keywords: ['dramático', 'marcante', 'ousado', 'impactante'],
      },
    ],
  },
};

// Exemplo de como usar o componente no editor
const ExemploEditorQuestao: React.FC = () => {
  const [block, setBlock] = useState(exemploQuestaoConfigurada);
  const [isEditing, setIsEditing] = useState(false);
  const [showProperties, setShowProperties] = useState(false);

  // Handler para mudanças nas propriedades
  const handlePropertyChange = (key: string, value: any) => {
    setBlock(prevBlock => ({
      ...prevBlock,
      props: {
        ...prevBlock.props,
        [key]: value,
      },
    }));

    console.log(`Propriedade alterada: ${key}`, value);
  };

  // Simular salvamento
  const handleSave = () => {
    console.log('Salvando configuração da questão:', block);
    // Aqui seria chamado o serviço de salvamento real
    alert('Questão salva com sucesso!');
  };

  return (
    <div style={{ backgroundColor: '#FAF9F7' }}>
      {/* Controles do exemplo */}
      <div className="bg-white border-b p-4 flex justify-between items-center">
        <h1 style={{ color: '#432818' }}>Exemplo: Questão Configurável</h1>

        <div className="flex gap-2">
          <Button
            variant={isEditing ? 'default' : 'outline'}
            onClick={() => setIsEditing(!isEditing)}
          >
            {isEditing ? 'Modo Preview' : 'Modo Edição'}
          </Button>

          {isEditing && (
            <Button variant="outline" onClick={() => setShowProperties(!showProperties)}>
              {showProperties ? 'Ocultar Propriedades' : 'Mostrar Propriedades'}
            </Button>
          )}

          <Button onClick={handleSave}>Salvar Questão</Button>
        </div>
      </div>

      {/* Resumo da configuração atual */}
      {isEditing && (
        <div className="bg-[#B89B7A]/10 border-b p-4">
          <h3 className="font-semibold text-[#432818] mb-2">Configuração Atual:</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div>
              <span className="font-medium">Pergunta:</span>
              <br />
              <span style={{ color: '#6B4F43' }}>{block.props.question}</span>
            </div>
            <div>
              <span className="font-medium">Opções:</span>
              <br />
              <span style={{ color: '#6B4F43' }}>{block.props.options.length} opções</span>
            </div>
            <div>
              <span className="font-medium">Pontos Total:</span>
              <br />
              <span style={{ color: '#6B4F43' }}>
                {block.props.options.reduce((total: number, opt: any) => total + opt.points, 0)}{' '}
                pontos
              </span>
            </div>
            <div>
              <span className="font-medium">Categorias:</span>
              <br />
              <span style={{ color: '#6B4F43' }}>
                {
                  Array.from(new Set(block.props.options.map((opt: any) => opt.styleCategory)))
                    .length
                }{' '}
                categorias
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Componente configurável */}
      <div className="relative">
        <div className="min-h-screen p-4">
          <p style={{ color: '#8B7355' }}>
            Component placeholder - QuizQuestionBlockConfigurable not available
          </p>
          <pre className="text-sm">{JSON.stringify(block, null, 2)}</pre>
        </div>
      </div>

      {/* Debug info (apenas no modo edição) */}
      {isEditing && (
        <div className="fixed bottom-4 left-4 bg-white p-3 rounded-lg shadow-lg border max-w-sm">
          <h4 style={{ color: '#432818' }}>🛠️ Debug Info</h4>
          <div style={{ color: '#6B4F43' }}>
            <div>ID: {block.id}</div>
            <div>Tipo: {block.type}</div>
            <div>Editando: {isEditing ? 'Sim' : 'Não'}</div>
            <div>Painel: {showProperties ? 'Aberto' : 'Fechado'}</div>
            <div>Múltiplas: {block.props.allowMultiple ? 'Sim' : 'Não'}</div>
            <div>Max. Seleções: {block.props.maxSelections}</div>
          </div>
        </div>
      )}
    </div>
  );
};

// Exemplo de configuração avançada com múltiplas categorias
const exemploQuestaoAvancada = {
  question: 'Em qual ambiente você se sente mais confortável?',
  questionId: 'ambiente-conforto-q2',
  allowMultiple: false,
  maxSelections: 1,
  showImages: true,
  autoAdvance: true,
  autoAdvanceDelay: 2000,
  options: [
    {
      id: 'amb-1',
      text: 'Café aconchegante com livros e música suave',
      imageUrl: 'https://exemplo.com/cafe-aconchegante.jpg',
      styleCategory: 'Romântico',
      points: 2,
      keywords: ['aconchegante', 'romântico', 'intimista', 'calmo'],
    },
    {
      id: 'amb-2',
      text: 'Escritório moderno com tecnologia de ponta',
      imageUrl: 'https://exemplo.com/escritorio-moderno.jpg',
      styleCategory: 'Contemporâneo',
      points: 4,
      keywords: ['moderno', 'tecnológico', 'eficiente', 'produtivo'],
    },
    {
      id: 'amb-3',
      text: 'Jardim ao ar livre em meio à natureza',
      imageUrl: 'https://exemplo.com/jardim-natureza.jpg',
      styleCategory: 'Natural',
      points: 1,
      keywords: ['natural', 'ar livre', 'tranquilo', 'orgânico'],
    },
    {
      id: 'amb-4',
      text: 'Galeria de arte com exposições impactantes',
      imageUrl: 'https://exemplo.com/galeria-arte.jpg',
      styleCategory: 'Criativo',
      points: 3,
      keywords: ['criativo', 'artístico', 'inspirador', 'cultural'],
    },
  ],
};

// Configuração para diferentes tipos de negócio
const templatesQuestoes = {
  moda: {
    question: 'Qual look representa melhor seu estilo?',
    categories: ['Clássico', 'Romântico', 'Contemporâneo', 'Dramático'],
    keywords: ['elegante', 'casual', 'formal', 'descolado'],
  },

  decoracao: {
    question: 'Como você imagina sua casa ideal?',
    categories: ['Natural', 'Contemporâneo', 'Clássico', 'Criativo'],
    keywords: ['aconchegante', 'moderno', 'tradicional', 'inovador'],
  },

  lifestyle: {
    question: 'Qual atividade mais combina com você?',
    categories: ['Natural', 'Elegante', 'Sexy', 'Criativo'],
    keywords: ['aventura', 'sofisticação', 'ousadia', 'expressão'],
  },
};

export default ExemploEditorQuestao;
export { exemploQuestaoConfigurada, exemploQuestaoAvancada, templatesQuestoes };
