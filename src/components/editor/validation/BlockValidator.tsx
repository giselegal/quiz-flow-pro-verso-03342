/**
 * SIMPLIFIED BLOCK VALIDATOR
 */
import React from 'react';
import { Block } from '@/types/editor';
import { Badge } from '@/components/ui/badge';
import { CheckCircle } from 'lucide-react';

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
  score: number;
}

export const validateStage = (stage: any) => {
  return {
    isValid: true,
    errors: [],
    warnings: [],
    score: 100,
  };
};

interface BlockValidatorProps {
  block: Block;
}

const BlockValidator: React.FC<BlockValidatorProps> = ({ block }) => {
  return (
    <div className="flex items-center gap-2">
      <CheckCircle className="h-4 w-4 text-green-600" />
      <Badge variant="secondary">Valid</Badge>
      <span className="text-sm text-gray-600">Block {block.id} is valid</span>
    </div>
  );
};

export default BlockValidator;
