
import React from 'react';
import { useNode } from '@craftjs/core';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface CraftQuizQuestionBlockProps {
  question: string;
  options: string[];
}

export const CraftQuizQuestionBlock: React.FC<CraftQuizQuestionBlockProps> = ({
  question = 'Sua pergunta aqui',
  options = ['Opção 1', 'Opção 2', 'Opção 3']
}) => {
  const { connectors: { connect, drag } } = useNode();

  return (
    <div
      ref={(ref) => ref && connect(drag(ref))}
      className="relative group p-6 border rounded-lg"
    >
      <h3 className="text-lg font-semibold mb-4">{question}</h3>
      <div className="space-y-2">
        {options.map((option, index) => (
          <div key={index} className="p-3 border rounded cursor-pointer hover:bg-gray-50">
            {option}
          </div>
        ))}
      </div>
    </div>
  );
};

const CraftQuizQuestionBlockSettings = () => {
  const { actions: { setProp }, props } = useNode((node) => ({
    props: node.data.props
  }));

  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="question">Pergunta</Label>
        <Input
          id="question"
          value={props.question}
          onChange={(e) => setProp((props: CraftQuizQuestionBlockProps) => props.question = e.target.value)}
          className="mt-1"
        />
      </div>
    </div>
  );
};

(CraftQuizQuestionBlock as any).craft = {
  displayName: 'Questão Quiz',
  props: {
    question: 'Sua pergunta aqui',
    options: ['Opção 1', 'Opção 2', 'Opção 3']
  },
  related: {
    settings: CraftQuizQuestionBlockSettings
  }
};
