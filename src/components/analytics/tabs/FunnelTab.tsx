
import React, { useState, useEffect } from 'react';
import { Progress } from '@/components/ui/progress';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ArrowRight, TrendingUp, TrendingDown } from 'lucide-react';

interface FunnelStep {
  name: string;
  visitors: number;
  conversions: number;
  conversionRate: number;
}

interface FunnelTabProps {
  funnelId?: string;
  timeRange?: string;
}

const FunnelTab: React.FC<FunnelTabProps> = ({ funnelId, timeRange = '7d' }) => {
  const [funnelData, setFunnelData] = useState<FunnelStep[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadFunnelData();
  }, [funnelId, timeRange]);

  const loadFunnelData = async () => {
    try {
      setLoading(true);
      
      // Mock data for demonstration
      const mockData: FunnelStep[] = [
        {
          name: 'Landing Page',
          visitors: 1000,
          conversions: 850,
          conversionRate: 85.0
        },
        {
          name: 'Quiz Start',
          visitors: 850,
          conversions: 680,
          conversionRate: 80.0
        },
        {
          name: 'Quiz Questions',
          visitors: 680,
          conversions: 544,
          conversionRate: 80.0
        },
        {
          name: 'Results Page',
          visitors: 544,
          conversions: 435,
          conversionRate: 80.0
        },
        {
          name: 'Offer Page',
          visitors: 435,
          conversions: 87,
          conversionRate: 20.0
        }
      ];

      setFunnelData(mockData);
    } catch (error) {
      console.error('Error loading funnel data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getTotalConversionRate = () => {
    if (funnelData.length === 0) return 0;
    const firstStep = funnelData[0];
    const lastStep = funnelData[funnelData.length - 1];
    return ((lastStep.conversions / firstStep.visitors) * 100).toFixed(1);
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-16 bg-gray-200 rounded"></div>
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
          <h3 className="text-lg font-semibold">Funnel Performance</h3>
          <p className="text-sm text-gray-600">
            Overall conversion rate: {getTotalConversionRate()}%
          </p>
        </div>
        <Button variant="outline" size="sm">
          Export Data
        </Button>
      </div>

      {/* Funnel Steps */}
      <div className="space-y-4">
        {funnelData.map((step, index) => (
          <Card key={step.name} className="p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-3">
                <div className="flex items-center justify-center w-8 h-8 bg-blue-100 rounded-full">
                  <span className="text-sm font-medium text-blue-600">{index + 1}</span>
                </div>
                <div>
                  <h4 className="font-medium">{step.name}</h4>
                  <p className="text-sm text-gray-500">
                    {step.visitors.toLocaleString()} visitors
                  </p>
                </div>
              </div>
              <div className="text-right">
                <div className="flex items-center space-x-2">
                  <Badge variant={step.conversionRate >= 60 ? 'default' : 'destructive'}>
                    {step.conversionRate}%
                  </Badge>
                  <span className="text-sm text-gray-500">
                    {step.conversions.toLocaleString()} converted
                  </span>
                </div>
              </div>
            </div>

            <Progress 
              percent={step.conversionRate} 
              className="h-2"
            />

            {/* Drop-off indicator */}
            {index < funnelData.length - 1 && (
              <div className="mt-3 flex items-center justify-center">
                <div className="flex items-center space-x-2 text-sm text-gray-500">
                  <ArrowRight className="w-4 h-4" />
                  <span>
                    {((step.conversions - funnelData[index + 1].visitors) / step.conversions * 100).toFixed(1)}% drop-off
                  </span>
                </div>
              </div>
            )}
          </Card>
        ))}
      </div>

      {/* Summary */}
      <Card className="p-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center">
            <p className="text-sm text-gray-600">Total Visitors</p>
            <p className="text-2xl font-bold">
              {funnelData[0]?.visitors.toLocaleString() || 0}
            </p>
          </div>
          <div className="text-center">
            <p className="text-sm text-gray-600">Final Conversions</p>
            <p className="text-2xl font-bold">
              {funnelData[funnelData.length - 1]?.conversions.toLocaleString() || 0}
            </p>
          </div>
          <div className="text-center">
            <p className="text-sm text-gray-600">Overall Rate</p>
            <p className="text-2xl font-bold">{getTotalConversionRate()}%</p>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default FunnelTab;
