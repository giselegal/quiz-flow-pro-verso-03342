// @ts-nocheck
import React, { useState } from 'react';
import { useDraggable } from '@dnd-kit/core';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Search, Lock } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import {
  getAvailableComponents,
  COMPONENT_CATEGORIES,
  type ComponentDefinition,
} from './ComponentRegistry';

interface ComponentToolbarProps {
  categories: any[];
  components: ComponentDefinition[];
  collapsed?: boolean;
}

interface DraggableComponentProps {
  component: ComponentDefinition;
  isLocked?: boolean;
}

const DraggableComponent: React.FC<DraggableComponentProps> = ({ component, isLocked = false }) => {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: component.id,
    data: {
      type: 'component',
      component: component,
    },
    disabled: isLocked,
  });

  const style = transform
    ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
      }
    : undefined;

  const Icon = component.icon;

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...(isLocked ? {} : { ...listeners, ...attributes })}
      className={`
        p-3 border border-[#D4C4A0] rounded-lg transition-all duration-200 
        ${
          isLocked
            ? 'cursor-not-allowed opacity-50 bg-gray-100'
            : 'cursor-grab hover:shadow-md hover:border-[#B89B7A] bg-white active:cursor-grabbing'
        }
        ${isDragging ? 'opacity-50' : ''}
      `}
    >
      <div className="flex items-center gap-2 mb-2">
        <Icon className={`w-4 h-4 ${isLocked ? 'text-gray-400' : 'text-[#B89B7A]'}`} />
        <span className={`font-medium text-sm ${isLocked ? 'text-gray-400' : 'text-[#432818]'}`}>
          {component.label}
        </span>
        {component.isPremium && (
          <Badge
            variant="outline"
            className={`text-xs ${isLocked ? 'border-gray-300 text-gray-400' : 'border-yellow-400 text-stone-700'}`}
          >
            {isLocked ? <Lock className="w-3 h-3" /> : 'PRO'}
          </Badge>
        )}
      </div>
      <p className={`text-xs ${isLocked ? 'text-gray-400' : 'text-[#B89B7A]'}`}>
        {component.description}
      </p>
    </div>
  );
};

export const ComponentToolbar: React.FC<ComponentToolbarProps> = ({
  categories,
  components,
  collapsed = false,
}) => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const { user } = useAuth();

  // Mock auth features for now
  const hasPremiumFeatures = user?.email?.includes('premium') || false;
  const userFeatures = ['basic_components'];
  const userPlan = 'FREE';

  const availableComponents = getAvailableComponents(userFeatures, hasPremiumFeatures);

  const { available, locked } = components.reduce(
    (acc, component) => {
      const isAvailable = availableComponents.find(c => c.id === component.id);
      if (isAvailable) {
        acc.available.push(component);
      } else if (component.isPremium) {
        acc.locked.push(component);
      }
      return acc;
    },
    {
      available: [] as ComponentDefinition[],
      locked: [] as ComponentDefinition[],
    }
  );

  const filteredComponents = [...available, ...locked].filter(component => {
    const matchesCategory = selectedCategory === 'all' || component.category === selectedCategory;
    const matchesSearch =
      component.label.toLowerCase().includes(searchTerm.toLowerCase()) ||
      component.description?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  if (collapsed) {
    return (
      <div className="p-4">
        <div className="grid grid-cols-2 gap-2">
          {available.slice(0, 4).map(component => (
            <DraggableComponent key={component.id} component={component} />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      <div className="p-4 border-b border-[#D4C4A0]">
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#B89B7A] w-4 h-4" />
          <Input
            placeholder="Buscar componentes..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="pl-10 border-[#D4C4A0] focus:border-[#B89B7A] text-[#432818]"
          />
        </div>

        <div className="mb-4 p-3 bg-[#F5F2E9] rounded-lg">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-[#432818]">Plano: {userPlan}</span>
            <Badge
              variant="outline"
              className={`${
                hasPremiumFeatures
                  ? 'border-green-500 text-green-700 bg-green-50'
                  : 'border-yellow-500 text-stone-700 bg-stone-50'
              }`}
            >
              {hasPremiumFeatures ? 'Premium' : 'Básico'}
            </Badge>
          </div>
          <p className="text-xs text-[#B89B7A] mt-1">{available.length} componentes disponíveis</p>
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
              selectedCategory === 'all'
                ? 'bg-[#B89B7A] text-[#432818]'
                : 'bg-[#F5F2E9] text-[#B89B7A] hover:bg-[#D4C4A0]'
            }`}
          >
            Todos ({filteredComponents.length})
          </button>
          {COMPONENT_CATEGORIES.map(category => {
            const categoryCount = filteredComponents.filter(c => c.category === category.id).length;
            if (categoryCount === 0) return null;

            return (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                  selectedCategory === category.id
                    ? 'bg-[#B89B7A] text-[#432818]'
                    : 'bg-[#F5F2E9] text-[#B89B7A] hover:bg-[#D4C4A0]'
                }`}
              >
                {category.name} ({categoryCount})
              </button>
            );
          })}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        {filteredComponents.length === 0 ? (
          <div className="text-center py-8 text-[#B89B7A]">
            <Search className="w-8 h-8 mx-auto mb-2 opacity-50" />
            <p className="text-sm">Nenhum componente encontrado</p>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredComponents
              .filter(c => available.find(a => a.id === c.id))
              .map(component => (
                <DraggableComponent key={component.id} component={component} />
              ))}

            {filteredComponents
              .filter(c => locked.find(l => l.id === c.id))
              .map(component => (
                <DraggableComponent key={component.id} component={component} isLocked={true} />
              ))}
          </div>
        )}

        {locked.length > 0 && !hasPremiumFeatures && (
          <div style={{ borderColor: '#E5DDD5' }}>
            <h4 className="font-semibold text-stone-700 mb-2">🚀 Desbloqueie Mais Componentes</h4>
            <p className="text-sm text-stone-700 mb-3">
              Upgrade para o plano Professional e tenha acesso a {locked.length} componentes
              premium:
            </p>
            <ul className="text-xs text-stone-600 mb-3 space-y-1">
              <li>• Vídeos e áudios</li>
              <li>• Gráficos e carrosseis</li>
              <li>• Componentes de preço</li>
              <li>• Animações avançadas</li>
            </ul>
            <button className="w-full bg-yellow-600 hover:bg-yellow-700 text-white text-sm font-medium py-2 px-4 rounded-lg transition-colors">
              Fazer Upgrade
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
