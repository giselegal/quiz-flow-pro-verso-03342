
import React, { useState, useEffect } from 'react';
import { Progress } from '@/components/ui/progress';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { supabase } from '@/lib/supabase';
import { ArrowRight, Users, Target, TrendingUp } from 'lucide-react';

interface FunnelStep {
  name: string;
  visitors: number;
  conversions: number;
  conversionRate: number;
  dropOffRate: number;
}

interface AdvancedFunnelProps {
  funnelId?: string;
  timeRange?: string;
}

const AdvancedFunnel: React.FC<AdvancedFunnelProps> = ({ funnelId, timeRange = '7d' }) => {
  const [funnelData, setFunnelData] = useState<FunnelStep[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedStep, setSelectedStep] = useState<string | null>(null);

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
          conversionRate: 85.0,
          dropOffRate: 15.0
        },
        {
          name: 'Quiz Start',
          visitors: 850,
          conversions: 680,
          conversionRate: 80.0,
          dropOffRate: 20.0
        },
        {
          name: 'Quiz Questions',
          visitors: 680,
          conversions: 544,
          conversionRate: 80.0,
          dropOffRate: 20.0
        },
        {
          name: 'Results Page',
          visitors: 544,
          conversions: 435,
          conversionRate: 80.0,
          dropOffRate: 20.0
        },
        {
          name: 'Offer Page',
          visitors: 435,
          conversions: 87,
          conversionRate: 20.0,
          dropOffRate: 80.0
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

  const getStepColor = (conversionRate: number) => {
    if (conversionRate >= 80) return 'bg-green-500';
    if (conversionRate >= 60) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  if (loading) {
    return (
      <Card className="p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-6 bg-gray-200 rounded w-1/4"></div>
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-16 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Advanced Funnel Analysis</h2>
          <p className="text-gray-600">
            Overall conversion rate: {getTotalConversionRate()}%
          </p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" size="sm">
            Export Data
          </Button>
          <Button variant="outline" size="sm">
            Configure Steps
          </Button>
        </div>
      </div>

      {/* Funnel Visualization */}
      <Card className="p-6">
        <div className="space-y-4">
          {funnelData.map((step, index) => (
            <div
              key={step.name}
              className={`relative p-4 rounded-lg border-2 transition-all cursor-pointer ${
                selectedStep === step.name 
                  ? 'border-blue-500 bg-blue-50' 
                  : 'border-gray-200 hover:border-gray-300'
              }`}
              onClick={() => setSelectedStep(selectedStep === step.name ? null : step.name)}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-3">
                  <div className="flex items-center justify-center w-8 h-8 bg-blue-100 rounded-full">
                    <span className="text-sm font-medium text-blue-600">{index + 1}</span>
                  </div>
                  <div>
                    <h3 className="font-semibold">{step.name}</h3>
                    <p className="text-sm text-gray-600">
                      {step.visitors.toLocaleString()} visitors
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="flex items-center space-x-2">
                    <Badge variant={step.conversionRate >= 60 ? 'default' : 'destructive'}>
                      {step.conversionRate}% conversion
                    </Badge>
                    <span className="text-sm text-gray-500">
                      {step.conversions.toLocaleString()} converted
                    </span>
                  </div>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="mb-3">
                <Progress 
                  percent={step.conversionRate} 
                  className="h-2" 
                />
              </div>

              {/* Drop-off indicator */}
              {index < funnelData.length - 1 && (
                <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2">
                  <div className="flex items-center space-x-2 bg-white border rounded-full px-3 py-1">
                    <ArrowRight className="w-4 h-4 text-gray-400" />
                    <span className="text-xs text-red-500">
                      -{step.dropOffRate}% drop-off
                    </span>
                  </div>
                </div>
              )}

              {/* Expanded Details */}
              {selectedStep === step.name && (
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="flex items-center space-x-2">
                      <Users className="w-4 h-4 text-blue-500" />
                      <div>
                        <p className="text-sm font-medium">Total Visitors</p>
                        <p className="text-lg font-bold">{step.visitors.toLocaleString()}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Target className="w-4 h-4 text-green-500" />
                      <div>
                        <p className="text-sm font-medium">Conversions</p>
                        <p className="text-lg font-bold">{step.conversions.toLocaleString()}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <TrendingUp className="w-4 h-4 text-purple-500" />
                      <div>
                        <p className="text-sm font-medium">Conversion Rate</p>
                        <p className="text-lg font-bold">{step.conversionRate}%</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </Card>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="text-center">
            <p className="text-sm text-gray-600">Total Visitors</p>
            <p className="text-2xl font-bold">
              {funnelData[0]?.visitors.toLocaleString() || 0}
            </p>
          </div>
        </Card>
        <Card className="p-4">
          <div className="text-center">
            <p className="text-sm text-gray-600">Final Conversions</p>
            <p className="text-2xl font-bold">
              {funnelData[funnelData.length - 1]?.conversions.toLocaleString() || 0}
            </p>
          </div>
        </Card>
        <Card className="p-4">
          <div className="text-center">
            <p className="text-sm text-gray-600">Overall Rate</p>
            <p className="text-2xl font-bold">{getTotalConversionRate()}%</p>
          </div>
        </Card>
        <Card className="p-4">
          <div className="text-center">
            <p className="text-sm text-gray-600">Biggest Drop-off</p>
            <p className="text-2xl font-bold">
              {Math.max(...funnelData.map(s => s.dropOffRate))}%
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default AdvancedFunnel;
