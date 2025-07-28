
import React, { useState, useEffect } from 'react';
import { Progress } from '@/components/ui/progress';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { supabase } from '@/integrations/supabase/client';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import { Download, Filter, Calendar, TrendingUp, Users, MousePointer, Eye, Target } from 'lucide-react';

// Define proper types for our data
interface FunnelData {
  id: string;
  name: string;
  description: string | null;
  is_published: boolean | null;
  version: number | null;
  created_at: string | null;
  updated_at: string | null;
  user_id: string | null;
  settings: any;
}

interface AnalyticsEvent {
  id: number;
  funnel_id: string;
  event_type: string;
  user_session: string;
  created_at: string;
  metadata: {
    page?: string;
    step?: number;
    result?: string;
  };
}

const AdvancedAnalytics = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [dateRange, setDateRange] = useState({ from: '2024-01-01', to: new Date().toISOString().split('T')[0] });
  const [selectedFunnel, setSelectedFunnel] = useState<string | null>(null);
  const [funnels, setFunnels] = useState<FunnelData[]>([]);
  const [analyticsData, setAnalyticsData] = useState<AnalyticsEvent[]>([]);

  useEffect(() => {
    loadFunnels();
    loadAnalyticsData();
  }, [dateRange, selectedFunnel]);

  const loadFunnels = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('funnels')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setFunnels(data || []);
    } catch (err) {
      console.error('Error loading funnels:', err);
      setError('Failed to load funnels');
      // Use mock data as fallback
      setFunnels([
        {
          id: '1',
          name: 'Lead Generation Funnel',
          description: 'Main lead generation funnel',
          is_published: true,
          version: 1,
          created_at: '2024-01-01T00:00:00Z',
          updated_at: '2024-01-01T00:00:00Z',
          user_id: 'user1',
          settings: {}
        },
        {
          id: '2',
          name: 'Product Sales Funnel',
          description: 'E-commerce product sales',
          is_published: true,
          version: 2,
          created_at: '2024-01-02T00:00:00Z',
          updated_at: '2024-01-02T00:00:00Z',
          user_id: 'user1',
          settings: {}
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const loadAnalyticsData = async () => {
    try {
      setLoading(true);
      // Using mock data since the analytics tables don't exist in the current schema
      const mockAnalyticsData: AnalyticsEvent[] = [
        {
          id: 1,
          funnel_id: '1',
          event_type: 'page_view',
          user_session: 'session_1',
          created_at: '2024-01-01T10:00:00Z',
          metadata: { page: 'intro' }
        },
        {
          id: 2,
          funnel_id: '1',
          event_type: 'step_completed',
          user_session: 'session_1',
          created_at: '2024-01-01T10:05:00Z',
          metadata: { step: 1 }
        },
        {
          id: 3,
          funnel_id: '1',
          event_type: 'conversion',
          user_session: 'session_1',
          created_at: '2024-01-01T10:10:00Z',
          metadata: { result: 'success' }
        }
      ];

      setAnalyticsData(mockAnalyticsData);
      
      // Calculate metrics
      const views = mockAnalyticsData.filter(event => event.event_type === 'page_view').length;
      const conversions = mockAnalyticsData.filter(event => event.event_type === 'conversion').length;
      const stepCompletions = mockAnalyticsData.filter(event => event.event_type === 'step_completed').length;
      
      console.log('Analytics loaded:', { views, conversions, stepCompletions });
    } catch (err) {
      console.error('Error loading analytics:', err);
      setError('Failed to load analytics data');
    } finally {
      setLoading(false);
    }
  };

  const calculateMetrics = () => {
    if (!analyticsData.length) return {
      totalViews: 0,
      totalConversions: 0,
      conversionRate: 0,
      avgTimeOnPage: 0,
      bounceRate: 0,
      topFunnels: []
    };

    const totalViews = analyticsData.filter(event => event.event_type === 'page_view').length;
    const totalConversions = analyticsData.filter(event => event.event_type === 'conversion').length;
    const conversionRate = totalViews > 0 ? (totalConversions / totalViews) * 100 : 0;

    return {
      totalViews,
      totalConversions,
      conversionRate,
      avgTimeOnPage: 145, // mock data
      bounceRate: 35, // mock data
      topFunnels: funnels.slice(0, 3).map(funnel => ({
        id: funnel.id,
        name: funnel.name,
        views: Math.floor(Math.random() * 1000),
        conversions: Math.floor(Math.random() * 100)
      }))
    };
  };

  const getChartData = () => {
    // Mock chart data since we don't have real analytics tables
    return [
      { name: 'Jan', views: 4000, conversions: 240 },
      { name: 'Feb', views: 3000, conversions: 139 },
      { name: 'Mar', views: 2000, conversions: 980 },
      { name: 'Apr', views: 2780, conversions: 390 },
      { name: 'May', views: 1890, conversions: 480 },
      { name: 'Jun', views: 2390, conversions: 380 },
    ];
  };

  const metrics = calculateMetrics();
  const chartData = getChartData();

  if (loading) {
    return <div className="p-6">Loading analytics...</div>;
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="text-red-500 mb-4">Error: {error}</div>
        <Button onClick={() => { setError(null); loadFunnels(); loadAnalyticsData(); }}>
          Retry
        </Button>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Advanced Analytics</h1>
          <p className="text-gray-600">Comprehensive funnel performance insights</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Filter className="w-4 h-4 mr-2" />
            Filter
          </Button>
          <Button variant="outline" size="sm">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Views</CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.totalViews.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">+20.1% from last month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Conversions</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.totalConversions.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">+12.5% from last month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Conversion Rate</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.conversionRate.toFixed(1)}%</div>
            <p className="text-xs text-muted-foreground">+0.5% from last month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg. Time on Page</CardTitle>
            <MousePointer className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.avgTimeOnPage}s</div>
            <p className="text-xs text-muted-foreground">+8.2% from last month</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Views vs Conversions</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="views" fill="#8884d8" />
                <Bar dataKey="conversions" fill="#82ca9d" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Conversion Trend</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="conversions" stroke="#8884d8" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Funnel Performance */}
      <Card>
        <CardHeader>
          <CardTitle>Funnel Performance</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {funnels.map((funnel) => (
              <div key={funnel.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex-1">
                  <h3 className="font-semibold">{funnel.name}</h3>
                  <p className="text-sm text-gray-600">{funnel.description || 'No description'}</p>
                  <div className="flex items-center gap-4 mt-2">
                    <Badge variant={funnel.is_published ? "default" : "secondary"}>
                      {funnel.is_published ? 'Published' : 'Draft'}
                    </Badge>
                    <span className="text-sm text-gray-500">Version {funnel.version || 1}</span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold">
                    {Math.floor(Math.random() * 1000)}
                  </div>
                  <div className="text-sm text-gray-500">Views</div>
                  <Progress percent={Math.floor(Math.random() * 100)} className="mt-2" />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Detailed Analytics */}
      <Tabs defaultValue="overview" className="w-full">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="funnels">Funnels</TabsTrigger>
          <TabsTrigger value="events">Events</TabsTrigger>
          <TabsTrigger value="users">Users</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Top Performing Funnels</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {metrics.topFunnels.map((funnel) => (
                    <div key={funnel.id} className="flex justify-between items-center">
                      <span className="font-medium">{funnel.name}</span>
                      <div className="text-right">
                        <div className="text-sm font-semibold">{funnel.views} views</div>
                        <div className="text-xs text-gray-500">{funnel.conversions} conversions</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Recent Events</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {analyticsData.slice(0, 5).map((event) => (
                    <div key={event.id} className="flex justify-between items-center text-sm">
                      <div>
                        <Badge variant="outline" className="mr-2">
                          {event.event_type === 'page_view' ? 'View' : 
                           event.event_type === 'step_completed' ? 'Step' : 
                           event.event_type === 'conversion' ? 'Convert' : event.event_type}
                        </Badge>
                        <span>Session {event.user_session}</span>
                      </div>
                      <span className="text-gray-500">
                        {new Date(event.created_at).toLocaleTimeString()}
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="funnels">
          <Card>
            <CardHeader>
              <CardTitle>Funnel Details</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {funnels.map((funnel) => (
                  <div key={funnel.id} className="border rounded-lg p-4">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h3 className="font-semibold text-lg">{funnel.name}</h3>
                        <p className="text-gray-600">{funnel.description || 'No description'}</p>
                      </div>
                      <Badge variant={funnel.is_published ? "default" : "secondary"}>
                        {funnel.is_published ? 'Published' : 'Draft'}
                      </Badge>
                    </div>
                    <div className="grid grid-cols-3 gap-4 text-sm">
                      <div>
                        <span className="text-gray-500">Views:</span>
                        <div className="font-semibold">{Math.floor(Math.random() * 1000)}</div>
                      </div>
                      <div>
                        <span className="text-gray-500">Conversions:</span>
                        <div className="font-semibold">{Math.floor(Math.random() * 100)}</div>
                      </div>
                      <div>
                        <span className="text-gray-500">Rate:</span>
                        <div className="font-semibold">{Math.floor(Math.random() * 20)}%</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="events">
          <Card>
            <CardHeader>
              <CardTitle>Event Log</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {analyticsData.map((event) => (
                  <div key={event.id} className="flex justify-between items-center p-3 border rounded">
                    <div className="flex items-center gap-3">
                      <Badge variant="outline">
                        {event.event_type}
                      </Badge>
                      <span className="text-sm">Session: {event.user_session}</span>
                    </div>
                    <span className="text-sm text-gray-500">
                      {new Date(event.created_at).toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="users">
          <Card>
            <CardHeader>
              <CardTitle>User Analytics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center text-gray-500 py-8">
                User analytics data will be displayed here when available.
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdvancedAnalytics;
