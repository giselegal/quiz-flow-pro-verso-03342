
import React from 'react';
import { useNode } from '@craftjs/core';
import { cn } from '@/lib/utils';

interface CraftContainerProps {
  children: React.ReactNode;
  className?: string;
  padding?: number;
  margin?: number;
  backgroundColor?: string;
}

export const CraftContainer: React.FC<CraftContainerProps> = ({
  children,
  className = '',
  padding = 16,
  margin = 0,
  backgroundColor = 'transparent'
}) => {
  const { connectors: { connect, drag } } = useNode();

  return (
    <div
      ref={(ref) => connect(drag(ref))}
      className={cn('relative', className)}
      style={{
        padding: `${padding}px`,
        margin: `${margin}px`,
        backgroundColor
      }}
    >
      {children}
    </div>
  );
};

CraftContainer.craft = {
  displayName: 'Container',
  props: {
    padding: 16,
    margin: 0,
    backgroundColor: 'transparent'
  },
  related: {
    settings: () => (
      <div className="space-y-4">
        <div>
          <label className="text-sm font-medium">Padding</label>
          <input 
            type="number" 
            className="w-full mt-1 px-3 py-2 border rounded-md"
            defaultValue={16}
          />
        </div>
        <div>
          <label className="text-sm font-medium">Margin</label>
          <input 
            type="number" 
            className="w-full mt-1 px-3 py-2 border rounded-md"
            defaultValue={0}
          />
        </div>
        <div>
          <label className="text-sm font-medium">Background</label>
          <input 
            type="color" 
            className="w-full mt-1 h-10 border rounded-md"
            defaultValue="#ffffff"
          />
        </div>
      </div>
    )
  }
};
