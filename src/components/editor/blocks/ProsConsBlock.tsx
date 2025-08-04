import React from 'react';
import { Check, X, Star, Shield, Zap } from 'lucide-react';
import type { BlockComponentProps, BlockData } from '@/types/blocks';

interface ProsConsBlockProps extends BlockComponentProps {
  block: BlockData & {
    type: 'pros-cons';
    properties: {
      title?: string;
      subtitle?: string;
      prosTitle?: string;
      consTitle?: string;
      pros: Array<{
        id: string;
        text: string;
        icon?: string;
        highlight?: boolean;
      }>;
      cons: Array<{
        id: string;
        text: string;
        icon?: string;
        severity?: 'low' | 'medium' | 'high';
      }>;
      layout?: 'side-by-side' | 'stacked';
      showIcons?: boolean;
      prosColor?: string;
      consColor?: string;
      backgroundColor?: string;
      textColor?: string;
    };
  };
}

const ProsConsBlock: React.FC<ProsConsBlockProps> = ({ block, isSelected = false, onClick, className = '' }) => {
  const {
    title = 'Prós e Contras',
    subtitle = '',
    prosTitle = 'Vantagens',
    consTitle = 'Desvantagens',
    pros = [],
    cons = [],
    layout = 'side-by-side',
    showIcons = true,
    prosColor = '#10b981',
    consColor = '#ef4444',
    backgroundColor = '#ffffff',
    textColor = '#374151',
  } = block.properties;

  const getIcon = (iconName?: string, isPositive: boolean = true) => {
    const iconProps = {
      className: 'w-5 h-5',
      style: { color: isPositive ? prosColor : consColor },
    };

    switch (iconName) {
      case 'star':
        return <Star {...iconProps} />;
      case 'shield':
        return <Shield {...iconProps} />;
      case 'zap':
        return <Zap {...iconProps} />;
      default:
        return isPositive ? <Check {...iconProps} /> : <X {...iconProps} />;
    }
  };

  const getSeverityColor = (severity?: string) => {
    switch (severity) {
      case 'low':
        return '#f59e0b';
      case 'medium':
        return '#f97316';
      case 'high':
        return '#dc2626';
      default:
        return consColor;
    }
  };

  const ProsSection = () => (
    <div className="bg-green-50 rounded-lg p-6 border border-green-200">
      <h3 className="text-xl font-semibold mb-4 flex items-center gap-2" style={{ color: prosColor }}>
        {showIcons && <Check className="w-6 h-6" />}
        {prosTitle}
      </h3>
      <ul className="space-y-3">
        {pros.map(pro => (
          <li
            key={pro.id}
            className={`flex items-start gap-3 p-3 rounded-lg ${
              pro.highlight ? 'bg-green-100 border border-green-300' : 'bg-white'
            }`}
          >
            {showIcons && <div className="flex-shrink-0 mt-0.5">{getIcon(pro.icon, true)}</div>}
            <span className={`${pro.highlight ? 'font-medium' : ''}`} style={{ color: textColor }}>
              {pro.text}
            </span>
            {pro.highlight && <Star className="w-4 h-4 text-yellow-500 fill-current flex-shrink-0" />}
          </li>
        ))}
      </ul>
    </div>
  );

  const ConsSection = () => (
    <div className="bg-red-50 rounded-lg p-6 border border-red-200">
      <h3 className="text-xl font-semibold mb-4 flex items-center gap-2" style={{ color: consColor }}>
        {showIcons && <X className="w-6 h-6" />}
        {consTitle}
      </h3>
      <ul className="space-y-3">
        {cons.map(con => (
          <li key={con.id} className="flex items-start gap-3 p-3 bg-white rounded-lg">
            {showIcons && (
              <div className="flex-shrink-0 mt-0.5">
                <X className="w-5 h-5" style={{ color: getSeverityColor(con.severity) }} />
              </div>
            )}
            <span style={{ color: textColor }}>{con.text}</span>
            {con.severity && con.severity !== 'low' && (
              <div
                className={`px-2 py-1 rounded-full text-xs font-medium text-white flex-shrink-0 ${
                  con.severity === 'high' ? 'bg-red-500' : 'bg-orange-500'
                }`}
              >
                {con.severity === 'high' ? 'Alto' : 'Médio'}
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );

  return (
    <div
      className={`
        w-full p-6 rounded-lg cursor-pointer transition-all duration-200
        ${
          isSelected
            ? 'border-2 border-blue-500 bg-blue-50'
            : 'border-2 border-dashed border-[#B89B7A]/40 hover:bg-[#FAF9F7]'
        }
        ${className}
      `}
      style={{ backgroundColor, color: textColor }}
      onClick={onClick}
      data-block-id={block.id}
      data-block-type={block.type}
    >
      {/* Header */}
      {(title || subtitle) && (
        <div className="text-center mb-8">
          {title && (
            <h2 className="text-2xl md:text-3xl font-bold mb-2" style={{ color: textColor }}>
              {title}
            </h2>
          )}
          {subtitle && <p className="text-lg text-gray-600 max-w-2xl mx-auto">{subtitle}</p>}
        </div>
      )}

      {/* Content */}
      <div
        className={`
        ${layout === 'side-by-side' ? 'grid grid-cols-1 lg:grid-cols-2 gap-6' : 'space-y-6'}
      `}
      >
        <ProsSection />
        <ConsSection />
      </div>

      {/* Summary */}
      {pros.length > 0 && cons.length > 0 && (
        <div className="mt-6 p-4 bg-gray-100 rounded-lg text-center">
          <p className="text-sm text-gray-600">
            <span className="font-medium" style={{ color: prosColor }}>
              {pros.length} vantagens
            </span>
            {' vs '}
            <span className="font-medium" style={{ color: consColor }}>
              {cons.length} desvantagens
            </span>
          </p>
        </div>
      )}
    </div>
  );
};

export default ProsConsBlock;
