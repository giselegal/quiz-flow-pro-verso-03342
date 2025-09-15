import React from 'react';
import { DraggableComponentItem } from '@/components/editor/dnd/DraggableComponentItem';

export interface ComponentDef {
  type: string;
  name: string;
  icon: string;
  category: string;
  description: string;
}

export interface ComponentsSidebarProps {
  groupedComponents: Record<string, ComponentDef[]>;
  renderIcon: (name: string, className?: string) => React.ReactNode;
  className?: string;
}

const ComponentsSidebarComponent: React.FC<ComponentsSidebarProps> = ({ groupedComponents, renderIcon, className = '' }) => {
  return (
    <div className={`w-full min-w-0 h-full bg-gray-900 border-r border-gray-800/50 flex flex-col ${className}`}>
      <div className="p-6 border-b border-gray-800/50 bg-gray-900">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-8 h-8 rounded-lg bg-gray-800/50 flex items-center justify-center">
            <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
          </div>
          <div>
            <h3 className="font-medium text-gray-200 text-base">Components</h3>
            <p className="text-xs text-gray-500">{Object.values(groupedComponents).flat().length} blocks available</p>
          </div>
        </div>
        <div className="relative">
          <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            placeholder="Search components..."
            className="w-full pl-10 pr-4 py-2.5 text-sm bg-gray-800/50 border border-gray-700/50 rounded-lg text-gray-300 placeholder-gray-500 focus:border-brand-brightBlue/50 focus:ring-1 focus:ring-brand-brightBlue/20"
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        <div className="p-4 space-y-6">
          {Object.entries(groupedComponents).map(([category, components]) => (
            <div key={category} className="group">
              <div className="flex items-center gap-2 mb-3 px-2">
                <div className="w-1 h-4 bg-gray-600 rounded-full" />
                <h4 className="text-xs font-medium text-gray-400 uppercase tracking-wider">{category}</h4>
                <div className="flex-1 h-px bg-gray-700" />
                <span className="text-xs text-gray-500 bg-gray-800/50 px-2 py-0.5 rounded-full">{components.length}</span>
              </div>
              <div className="grid grid-cols-1 gap-1.5">
                {components.map(component => (
                  <DraggableComponentItem
                    key={component.type}
                    blockType={component.type}
                    title={component.name}
                    description={component.description}
                    icon={renderIcon(component.icon as any, 'w-3.5 h-3.5')}
                    category={component.category}
                    className="bg-gray-800/30 border border-gray-700/50 rounded-md px-2 py-1.5 text-[11px] text-gray-300 hover:bg-gray-800/50 hover:border-gray-600/50 transition-colors"
                  />
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="p-4 border-t border-gray-800/50 bg-gray-900">
          <div className="flex items-center justify-center gap-2 text-xs text-gray-500">
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Drag components to canvas
          </div>
        </div>
      </div>
    </div>
  );
};

export const ComponentsSidebar = React.memo(ComponentsSidebarComponent);
export default ComponentsSidebar;
