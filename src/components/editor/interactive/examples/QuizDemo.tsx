import React from 'react';

export const QuizDemo: React.FC = () => {
  return (
    <div className="p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-4">Quiz Demo</h2>
      <p className="text-gray-600 mb-4">
        This is a demo quiz component. Replace this with your actual quiz implementation.
      </p>
      <div className="space-y-4">
        <div className="p-4 border rounded-lg">
          <h3 className="font-semibold mb-2">Sample Question 1</h3>
          <div className="space-y-2">
            <button className="w-full p-2 text-left border rounded hover:bg-gray-50">
              Option A
            </button>
            <button className="w-full p-2 text-left border rounded hover:bg-gray-50">
              Option B
            </button>
            <button className="w-full p-2 text-left border rounded hover:bg-gray-50">
              Option C
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};