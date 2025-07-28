
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card';
import { Progress } from '../../ui/progress';
import { Button } from '../../ui/button';
import { Badge } from '../../ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import { TrendingUp, TrendingDown, Users, Eye, MousePointer, Clock } from 'lucide-react';

interface AnalyticsData {
  totalViews: number;
  totalConversions: number;
  conversionRate: number;
  averageTime: number;
  bounceRate: number;
  topFunnels: Array<{
    id: string;
    name: string;
    views: number;
    conversions: number;
    conversionRate: number;
  }>;
}

const AdvancedAnalytics: React.FC = () => {
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData>({
    totalViews: 0,
    totalConversions: 0,
    conversionRate: 0,
    averageTime: 0,
    bounceRate: 0,
    topFunnels: []
  });
  const [loading, setLoading] = useState(true);
  const [selectedDateRange, setSelectedDateRange] = useState('30d');

  useEffect(() => {
    fetchAnalyticsData();
  }, [selectedDateRange]);

  const fetchAnalyticsData = async () => {
    try {
      setLoading(true);
      
      // Fetch funnel data from existing tables
      const { data: funnels, error: funnelsError } = await supabase
        .from('funnels')
        .select('*')
        .eq('is_published', true);

      if (funnelsError) {
        console.error('Error fetching funnels:', funnelsError);
        return;
      }

      // Mock analytics data based on existing funnels
      const mockAnalytics: AnalyticsData = {
        totalViews: Math.floor(Math.random() * 10000) + 1000,
        totalConversions: Math.floor(Math.random() * 500) + 50,
        conversionRate: Math.random() * 20 + 5,
        averageTime: Math.floor(Math.random() * 300) + 120,
        bounceRate: Math.random() * 30 + 20,
        topFunnels: funnels?.map(funnel => ({
          id: funnel.id,
          name: funnel.name,
          views: Math.floor(Math.random() * 1000) + 100,
          conversions: Math.floor(Math.random() * 50) + 10,
          conversionRate: Math.random() * 15 + 5
        })) || []
      };

      setAnalyticsData(mockAnalytics);
    } catch (error) {
      console.error('Error fetching analytics data:', error);
    } finally {
      setLoading(false);
    }
  };

  const chartData = [
    { name: 'Jan', views: 4000, conversions: 240 },
    { name: 'Feb', views: 3000, conversions: 180 },
    { name: 'Mar', views: 2000, conversions: 120 },
    { name: 'Apr', views: 2780, conversions: 167 },
    { name: 'May', views: 1890, conversions: 113 },
    { name: 'Jun', views: 2390, conversions: 143 },
  ];

  const pieData = [
    { name: 'Desktop', value: 400 },
    { name: 'Mobile', value: 300 },
    { name: 'Tablet', value: 100 },
  ];

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28'];

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Advanced Analytics</h1>
        <div className="flex gap-2">
          <Button 
            variant={selectedDateRange === '7d' ? 'default' : 'outline'}
            onClick={() => setSelectedDateRange('7d')}
          >
            7 Days
          </Button>
          <Button 
            variant={selectedDateRange === '30d' ? 'default' : 'outline'}
            onClick={() => setSelectedDateRange('30d')}
          >
            30 Days
          </Button>
          <Button 
            variant={selectedDateRange === '90d' ? 'default' : 'outline'}
            onClick={() => setSelectedDateRange('90d')}
          >
            90 Days
          </Button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Views</CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analyticsData.totalViews.toLocaleString()}</div>
            <div className="flex items-center text-xs text-muted-foreground">
              <TrendingUp className="h-3 w-3 mr-1" />
              +12% from last month
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Conversions</CardTitle>
            <MousePointer className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analyticsData.totalConversions.toLocaleString()}</div>
            <div className="flex items-center text-xs text-muted-foreground">
              <TrendingUp className="h-3 w-3 mr-1" />
              +8% from last month
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Conversion Rate</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analyticsData.conversionRate.toFixed(1)}%</div>
            <div className="flex items-center text-xs text-muted-foreground">
              <TrendingDown className="h-3 w-3 mr-1" />
              -2% from last month
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg. Time</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{Math.floor(analyticsData.averageTime / 60)}m {analyticsData.averageTime % 60}s</div>
            <div className="flex items-center text-xs text-muted-foreground">
              <TrendingUp className="h-3 w-3 mr-1" />
              +5% from last month
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Bounce Rate</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analyticsData.bounceRate.toFixed(1)}%</div>
            <div className="flex items-center text-xs text-muted-foreground">
              <TrendingDown className="h-3 w-3 mr-1" />
              -3% from last month
            </div>
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
            <CardTitle>Device Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Top Funnels */}
      <Card>
        <CardHeader>
          <CardTitle>Top Performing Funnels</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {analyticsData.topFunnels.map((funnel) => (
              <div key={funnel.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex-1">
                  <h3 className="font-medium">{funnel.name}</h3>
                  <p className="text-sm text-muted-foreground">
                    {funnel.views.toLocaleString()} views • {funnel.conversions} conversions
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  <Badge variant="secondary">
                    {funnel.conversionRate.toFixed(1)}% CVR
                  </Badge>
                  <Progress value={funnel.conversionRate} className="w-20" />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdvancedAnalytics;
