
import React from 'react';

interface AnalyticsData {
  views: number;
  conversions: number;
  revenue: number;
  users: number;
}

interface AnalyticsDashboardProps {
  data?: AnalyticsData;
  className?: string;
}

export const AnalyticsDashboard: React.FC<AnalyticsDashboardProps> = ({ 
  data = { views: 0, conversions: 0, revenue: 0, users: 0 },
  className = '' 
}) => {
  return (
    <div className={`p-6 bg-white rounded-lg shadow ${className}`}>
      <h2 className="text-xl font-semibold mb-4">Analytics Dashboard</h2>
      <div className="grid grid-cols-2 gap-4">
        <div className="p-4 bg-blue-50 rounded">
          <h3 className="font-medium text-blue-900">Views</h3>
          <p className="text-2xl font-bold text-blue-600">{data.views}</p>
        </div>
        <div className="p-4 bg-green-50 rounded">
          <h3 className="font-medium text-green-900">Conversions</h3>
          <p className="text-2xl font-bold text-green-600">{data.conversions}</p>
        </div>
        <div className="p-4 bg-purple-50 rounded">
          <h3 className="font-medium text-purple-900">Revenue</h3>
          <p className="text-2xl font-bold text-purple-600">${data.revenue}</p>
        </div>
        <div className="p-4 bg-orange-50 rounded">
          <h3 className="font-medium text-orange-900">Users</h3>
          <p className="text-2xl font-bold text-orange-600">{data.users}</p>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsDashboard;
