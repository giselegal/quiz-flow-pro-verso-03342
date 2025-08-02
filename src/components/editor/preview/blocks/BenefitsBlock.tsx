import React from 'react';
import { BlockComponentProps } from '@/types/blocks';

interface BenefitsBlockProps extends BlockComponentProps {
  benefits?: Array<{
    title: string;
    description: string;
  }>;
}

const BenefitsBlock: React.FC<BenefitsBlockProps> = ({ 
  block, 
  benefits = [],
  ...props 
}) => {
  const blockBenefits = block?.content?.benefits || benefits || [];

  return (
    <div className="space-y-4">
      {blockBenefits.map((item: any, index: number) => (
        <div key={index} className="flex items-start space-x-3">
          <div className="flex-shrink-0 w-5 h-5 bg-green-500 rounded-full flex items-center justify-center mt-0.5">
            <span className="text-white text-xs">✓</span>
          </div>
          <div>
            <h3 className="font-medium">{item.title}</h3>
            <p className="text-gray-600 mt-1">{item.description}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default BenefitsBlock;
