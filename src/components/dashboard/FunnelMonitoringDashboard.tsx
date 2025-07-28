
import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus, TrendingUp, TrendingDown, AlertTriangle } from 'lucide-react';

interface FunnelMetrics {
  id: string;
  name: string;
  status: 'active' | 'paused' | 'error';
  visitors: number;
  conversions: number;
  conversionRate: number;
  revenue: number;
  lastUpdated: string;
}

interface FunnelMonitoringDashboardProps {
  onCreateFunnel?: () => void;
}

const FunnelMonitoringDashboard: React.FC<FunnelMonitoringDashboardProps> = ({ onCreateFunnel }) => {
  const [funnels, setFunnels] = useState<FunnelMetrics[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadFunnels();
  }, []);

  const loadFunnels = async () => {
    try {
      setLoading(true);
      
      // Mock data for demonstration
      const mockFunnels: FunnelMetrics[] = [
        {
          id: '1',
          name: 'Style Quiz Funnel',
          status: 'active',
          visitors: 1250,
          conversions: 185,
          conversionRate: 14.8,
          revenue: 2750,
          lastUpdated: '2 minutes ago'
        },
        {
          id: '2',
          name: 'Lead Generation Quiz',
          status: 'active',
          visitors: 890,
          conversions: 67,
          conversionRate: 7.5,
          revenue: 1340,
          lastUpdated: '5 minutes ago'
        },
        {
          id: '3',
          name: 'Product Recommendation',
          status: 'paused',
          visitors: 456,
          conversions: 23,
          conversionRate: 5.0,
          revenue: 460,
          lastUpdated: '1 hour ago'
        }
      ];

      setFunnels(mockFunnels);
    } catch (error) {
      console.error('Error loading funnels:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge variant="default" className="bg-green-100 text-green-800">Active</Badge>;
      case 'paused':
        return <Badge variant="outline">Paused</Badge>;
      case 'error':
        return <Badge variant="destructive">Error</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  const getTrendIcon = (conversionRate: number) => {
    if (conversionRate > 10) return <TrendingUp className="w-4 h-4 text-green-500" />;
    if (conversionRate < 5) return <TrendingDown className="w-4 h-4 text-red-500" />;
    return <AlertTriangle className="w-4 h-4 text-yellow-500" />;
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-48 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Funnel Monitoring</h1>
          <p className="text-gray-600">
            Monitor the performance of your quiz funnels
          </p>
        </div>
        <Button onClick={onCreateFunnel}>
          <Plus className="w-4 h-4 mr-2" />
          Create Funnel
        </Button>
      </div>

      {/* Funnel Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {funnels.map((funnel) => (
          <Card key={funnel.id} className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold">{funnel.name}</h3>
              {getStatusBadge(funnel.status)}
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Visitors</span>
                <span className="font-medium">{funnel.visitors.toLocaleString()}</span>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Conversions</span>
                <span className="font-medium">{funnel.conversions.toLocaleString()}</span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Conversion Rate</span>
                <div className="flex items-center space-x-2">
                  {getTrendIcon(funnel.conversionRate)}
                  <span className="font-medium">{funnel.conversionRate}%</span>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Revenue</span>
                <span className="font-medium">${funnel.revenue.toLocaleString()}</span>
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-gray-200">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-500">Last updated</span>
                <span className="text-gray-600">{funnel.lastUpdated}</span>
              </div>
            </div>

            <div className="mt-4 flex space-x-2">
              <Button variant="outline" size="sm" className="flex-1">
                View Details
              </Button>
              <Button variant="outline" size="sm" className="flex-1">
                Edit
              </Button>
            </div>
          </Card>
        ))}
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="text-center">
            <p className="text-sm text-gray-600">Total Funnels</p>
            <p className="text-2xl font-bold">{funnels.length}</p>
          </div>
        </Card>
        <Card className="p-4">
          <div className="text-center">
            <p className="text-sm text-gray-600">Total Visitors</p>
            <p className="text-2xl font-bold">
              {funnels.reduce((sum, f) => sum + f.visitors, 0).toLocaleString()}
            </p>
          </div>
        </Card>
        <Card className="p-4">
          <div className="text-center">
            <p className="text-sm text-gray-600">Total Conversions</p>
            <p className="text-2xl font-bold">
              {funnels.reduce((sum, f) => sum + f.conversions, 0).toLocaleString()}
            </p>
          </div>
        </Card>
        <Card className="p-4">
          <div className="text-center">
            <p className="text-sm text-gray-600">Total Revenue</p>
            <p className="text-2xl font-bold">
              ${funnels.reduce((sum, f) => sum + f.revenue, 0).toLocaleString()}
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default FunnelMonitoringDashboard;
