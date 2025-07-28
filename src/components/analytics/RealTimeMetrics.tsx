
import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { TrendingUp, TrendingDown, Users, Activity, Target, Clock } from 'lucide-react';

interface RealTimeEvent {
  id: string;
  type: string;
  timestamp: string;
  utm_source?: string;
  utm_campaign?: string;
  page: string;
  user_id: string;
}

interface RealTimeMetric {
  name: string;
  value: number;
  change: number;
  trend: 'up' | 'down' | 'stable';
  icon: React.ReactNode;
}

interface RealTimeMetricsProps {
  funnelId?: string;
}

const RealTimeMetrics: React.FC<RealTimeMetricsProps> = ({ funnelId }) => {
  const [events, setEvents] = useState<RealTimeEvent[]>([]);
  const [metrics, setMetrics] = useState<RealTimeMetric[]>([]);
  const [isLive, setIsLive] = useState(true);

  useEffect(() => {
    if (isLive) {
      const interval = setInterval(() => {
        generateMockEvent();
        updateMetrics();
      }, 2000);

      return () => clearInterval(interval);
    }
  }, [isLive]);

  const generateMockEvent = () => {
    const eventTypes = ['page_view', 'quiz_start', 'quiz_complete', 'lead_capture', 'conversion'];
    const pages = ['landing', 'quiz', 'results', 'offer', 'thank-you'];
    const sources = ['google', 'facebook', 'direct', 'email', 'instagram'];
    const campaigns = ['summer-sale', 'retargeting', 'lookalike', 'brand-awareness'];

    const newEvent: RealTimeEvent = {
      id: Date.now().toString(),
      type: eventTypes[Math.floor(Math.random() * eventTypes.length)],
      timestamp: new Date().toISOString(),
      utm_source: sources[Math.floor(Math.random() * sources.length)],
      utm_campaign: campaigns[Math.floor(Math.random() * campaigns.length)],
      page: pages[Math.floor(Math.random() * pages.length)],
      user_id: `user_${Math.floor(Math.random() * 10000)}`
    };

    setEvents(prev => [newEvent, ...prev.slice(0, 19)]);
  };

  const updateMetrics = () => {
    const mockMetrics: RealTimeMetric[] = [
      {
        name: 'Active Users',
        value: Math.floor(Math.random() * 50) + 20,
        change: Math.floor(Math.random() * 10) - 5,
        trend: Math.random() > 0.5 ? 'up' : 'down',
        icon: <Users className="w-4 h-4" />
      },
      {
        name: 'Conversions/Hour',
        value: Math.floor(Math.random() * 20) + 5,
        change: Math.floor(Math.random() * 5) - 2,
        trend: Math.random() > 0.5 ? 'up' : 'down',
        icon: <Target className="w-4 h-4" />
      },
      {
        name: 'Page Views/Min',
        value: Math.floor(Math.random() * 100) + 50,
        change: Math.floor(Math.random() * 20) - 10,
        trend: Math.random() > 0.5 ? 'up' : 'down',
        icon: <Activity className="w-4 h-4" />
      },
      {
        name: 'Avg Session Time',
        value: Math.floor(Math.random() * 300) + 120,
        change: Math.floor(Math.random() * 30) - 15,
        trend: Math.random() > 0.5 ? 'up' : 'down',
        icon: <Clock className="w-4 h-4" />
      }
    ];

    setMetrics(mockMetrics);
  };

  useEffect(() => {
    updateMetrics();
  }, []);

  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString();
  };

  const getEventIcon = (type: string) => {
    switch (type) {
      case 'page_view':
        return '👁️';
      case 'quiz_start':
        return '🎯';
      case 'quiz_complete':
        return '✅';
      case 'lead_capture':
        return '📧';
      case 'conversion':
        return '💰';
      default:
        return '📊';
    }
  };

  const getEventColor = (type: string) => {
    switch (type) {
      case 'conversion':
        return 'bg-green-100 text-green-800';
      case 'lead_capture':
        return 'bg-blue-100 text-blue-800';
      case 'quiz_complete':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up':
        return <TrendingUp className="w-4 h-4 text-green-500" />;
      case 'down':
        return <TrendingDown className="w-4 h-4 text-red-500" />;
      default:
        return <Activity className="w-4 h-4 text-gray-500" />;
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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-semibold">Real-Time Analytics</h3>
          <p className="text-sm text-gray-600">
            Live activity on your funnel
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <div className="flex items-center space-x-2">
            <div className={`w-2 h-2 rounded-full ${isLive ? 'bg-green-500' : 'bg-gray-500'}`}></div>
            <span className="text-sm">{isLive ? 'Live' : 'Paused'}</span>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsLive(!isLive)}
          >
            {isLive ? 'Pause' : 'Resume'}
          </Button>
        </div>
      </div>

      {/* Real-Time Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {metrics.map((metric) => (
          <Card key={metric.name} className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                {metric.icon}
                <span className="text-sm font-medium">{metric.name}</span>
              </div>
              <div className="flex items-center space-x-1">
                {getTrendIcon(metric.trend)}
                <span className={`text-sm ${getTrendColor(metric.trend)}`}>
                  {metric.change > 0 ? '+' : ''}{metric.change}
                </span>
              </div>
            </div>
            <div className="mt-2">
              <p className="text-2xl font-bold">
                {metric.name === 'Avg Session Time' 
                  ? `${Math.floor(metric.value / 60)}:${(metric.value % 60).toString().padStart(2, '0')}`
                  : metric.value
                }
              </p>
            </div>
          </Card>
        ))}
      </div>

      {/* Event Stream */}
      <Card className="p-4">
        <div className="flex justify-between items-center mb-4">
          <h4 className="font-medium">Live Event Stream</h4>
          <Badge variant="outline" className="text-xs">
            {events.length} events
          </Badge>
        </div>
        
        <div className="space-y-2 max-h-96 overflow-y-auto">
          {events.map((event) => (
            <div key={event.id} className="flex items-center justify-between p-2 bg-gray-50 rounded">
              <div className="flex items-center space-x-3">
                <span className="text-lg">{getEventIcon(event.type)}</span>
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm font-medium">{event.type.replace('_', ' ')}</span>
                    <Badge variant="outline" className={`text-xs ${getEventColor(event.type)}`}>
                      {event.page}
                    </Badge>
                  </div>
                  <div className="flex items-center space-x-2 text-xs text-gray-500">
                    <span>User: {event.user_id}</span>
                    {event.utm_source && (
                      <span>• Source: {event.utm_source}</span>
                    )}
                    {event.utm_campaign && (
                      <span>• Campaign: {event.utm_campaign}</span>
                    )}
                  </div>
                </div>
              </div>
              <span className="text-xs text-gray-500">
                {formatTime(event.timestamp)}
              </span>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};

export default RealTimeMetrics;
