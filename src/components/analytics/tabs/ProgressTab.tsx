
import React, { useState, useEffect } from 'react';
import { Progress } from '@/components/ui/progress';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { TrendingUp, TrendingDown, Clock, Target } from 'lucide-react';

interface ProgressMetric {
  name: string;
  current: number;
  target: number;
  percentage: number;
  trend: 'up' | 'down' | 'stable';
  change: number;
}

interface ProgressTabProps {
  funnelId?: string;
  timeRange?: string;
}

const ProgressTab: React.FC<ProgressTabProps> = ({ funnelId, timeRange = '7d' }) => {
  const [metrics, setMetrics] = useState<ProgressMetric[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProgressData();
  }, [funnelId, timeRange]);

  const loadProgressData = async () => {
    try {
      setLoading(true);
      
      // Mock data for demonstration
      const mockMetrics: ProgressMetric[] = [
        {
          name: 'Conversion Rate',
          current: 12.5,
          target: 15.0,
          percentage: 83.3,
          trend: 'up',
          change: 2.1
        },
        {
          name: 'Lead Generation',
          current: 85,
          target: 100,
          percentage: 85.0,
          trend: 'up',
          change: 5.2
        },
        {
          name: 'Quiz Completion',
          current: 78,
          target: 90,
          percentage: 86.7,
          trend: 'down',
          change: -3.1
        },
        {
          name: 'Email Signups',
          current: 45,
          target: 60,
          percentage: 75.0,
          trend: 'stable',
          change: 0.5
        },
        {
          name: 'Sales Conversion',
          current: 8.2,
          target: 10.0,
          percentage: 82.0,
          trend: 'up',
          change: 1.8
        }
      ];

      setMetrics(mockMetrics);
    } catch (error) {
      console.error('Error loading progress data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up':
        return <TrendingUp className="w-4 h-4 text-green-500" />;
      case 'down':
        return <TrendingDown className="w-4 h-4 text-red-500" />;
      default:
        return <Clock className="w-4 h-4 text-gray-500" />;
    }
  };

  const getTrendColor = (trend: string) => {
    switch (trend) {
      case 'up':
        return 'text-green-500';
      case 'down':
        return 'text-red-500';
      default:
        return 'text-gray-500';
    }
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-24 bg-gray-200 rounded"></div>
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
          <h3 className="text-lg font-semibold">Progress Tracking</h3>
          <p className="text-sm text-gray-600">
            Monitor your funnel performance against targets
          </p>
        </div>
        <Button variant="outline" size="sm">
          Set Targets
        </Button>
      </div>

      {/* Progress Metrics */}
      <div className="space-y-4">
        {metrics.map((metric) => (
          <Card key={metric.name} className="p-4">
            <div className="flex items-center justify-between mb-3">
              <div>
                <h4 className="font-medium">{metric.name}</h4>
                <p className="text-sm text-gray-500">
                  {metric.current}% of {metric.target}% target
                </p>
              </div>
              <div className="flex items-center space-x-2">
                {getTrendIcon(metric.trend)}
                <span className={`text-sm font-medium ${getTrendColor(metric.trend)}`}>
                  {metric.change > 0 ? '+' : ''}{metric.change}%
                </span>
              </div>
            </div>

            <div className="mb-3">
              <div className="flex justify-between text-sm text-gray-600 mb-1">
                <span>Progress</span>
                <span>{metric.percentage}%</span>
              </div>
              <Progress 
                percent={metric.percentage} 
                className="h-2"
              />
            </div>

            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center space-x-2">
                <Target className="w-4 h-4 text-gray-400" />
                <span className="text-gray-600">Target: {metric.target}%</span>
              </div>
              <Badge variant={metric.percentage >= 80 ? 'default' : 'destructive'}>
                {metric.percentage >= 80 ? 'On Track' : 'Needs Attention'}
              </Badge>
            </div>
          </Card>
        ))}
      </div>

      {/* Summary */}
      <Card className="p-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center">
            <p className="text-sm text-gray-600">Targets Met</p>
            <p className="text-2xl font-bold">
              {metrics.filter(m => m.percentage >= 100).length}/{metrics.length}
            </p>
          </div>
          <div className="text-center">
            <p className="text-sm text-gray-600">On Track</p>
            <p className="text-2xl font-bold">
              {metrics.filter(m => m.percentage >= 80).length}/{metrics.length}
            </p>
          </div>
          <div className="text-center">
            <p className="text-sm text-gray-600">Avg Progress</p>
            <p className="text-2xl font-bold">
              {(metrics.reduce((sum, m) => sum + m.percentage, 0) / metrics.length).toFixed(1)}%
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default ProgressTab;
