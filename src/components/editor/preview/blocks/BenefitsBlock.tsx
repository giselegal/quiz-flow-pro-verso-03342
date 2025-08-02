
import React from 'react';

interface BenefitsBlockProps {
  content: {
    title?: string;
    benefits?: Array<{
      title: string;
      description: string;
      icon?: string;
    }>;
  };
  onClick?: () => void;
}

const BenefitsBlock: React.FC<BenefitsBlockProps> = ({ content, onClick }) => {
  const benefits = content?.benefits || [];
  const title = content?.title || 'Benefícios';

  return (
    <div 
      className="p-6 bg-white border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50" 
      onClick={onClick}
    >
      <h3 className="text-xl font-semibold text-gray-900 mb-4">{title}</h3>
      
      {benefits.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {benefits.map((benefit: any, index: number) => (
            <div key={index} className="flex items-start space-x-3">
              {benefit.icon && (
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-blue-600 text-sm">{benefit.icon}</span>
                </div>
              )}
              <div>
                <h4 className="font-medium text-gray-900">{benefit.title}</h4>
                <p className="text-gray-600 text-sm mt-1">{benefit.description}</p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-8">
          <p className="text-gray-500">Clique para adicionar benefícios</p>
        </div>
      )}
    </div>
  );
};

export default BenefitsBlock;
