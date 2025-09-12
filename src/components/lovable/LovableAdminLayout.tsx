import React from 'react';

export const LovableAdminLayout: React.FC<{children: React.ReactNode}> = ({ children }) => {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto py-6 px-4">
        {children}
      </div>
    </div>
  );
};