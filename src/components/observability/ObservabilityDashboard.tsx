/**
 * 📊 OBSERVABILITY DASHBOARD - PHASE 3: MONITORING UI
 * Interface administrativa para monitoramento em tempo real
 */

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Activity, 
  TrendingUp, 
  AlertTriangle, 
  CheckCircle, 
  Users, 
  Zap,
  Download,
  RefreshCw
} from 'lucide-react';

import { observabilityManager } from '@/core/observability/ObservabilityManager';

interface DashboardData {
  systemHealth: any;
  business: any;
  performance: any;
  realTimeStats: any;
}

export const ObservabilityDashboard: React.FC = () => {
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [autoRefresh, setAutoRefresh] = useState(true);

  useEffect(() => {
    refreshData();
    
    let interval: NodeJS.Timeout | null = null;
    if (autoRefresh) {
      interval = setInterval(refreshData, 10000); // Refresh every 10s
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [autoRefresh]);

  const refreshData = async () => {
    setIsRefreshing(true);
    try {
      const data = observabilityManager.getDashboardData();
      setDashboardData(data);
    } catch (error) {
      console.error('Failed to refresh dashboard data:', error);
    }
    setIsRefreshing(false);
  };

  const exportData = () => {
    const exportedData = observabilityManager.exportData();
    const blob = new Blob([JSON.stringify(exportedData, null, 2)], { 
      type: 'application/json' 
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `observability-data-${new Date().toISOString()}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  if (!dashboardData) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-2" />
          <p>Loading dashboard data...</p>
        </div>
      </div>
    );
  }

  const { systemHealth, business, performance, realTimeStats } = dashboardData;

  const getHealthIcon = (status: string) => {
    switch (status) {
      case 'healthy': return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'degraded': return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
      case 'critical': return <AlertTriangle className="h-4 w-4 text-red-500" />;
      default: return <Activity className="h-4 w-4" />;
    }
  };

  const getHealthColor = (status: string) => {
    switch (status) {
      case 'healthy': return 'bg-green-500';
      case 'degraded': return 'bg-yellow-500';
      case 'critical': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Observability Dashboard</h2>
          <p className="text-muted-foreground">
            Real-time monitoring and analytics for your application
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setAutoRefresh(!autoRefresh)}
          >
            {autoRefresh ? 'Disable' : 'Enable'} Auto Refresh
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={refreshData}
            disabled={isRefreshing}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={exportData}
          >
            <Download className="h-4 w-4 mr-2" />
            Export Data
          </Button>
        </div>
      </div>

      {/* System Health Alert */}
      {systemHealth.status !== 'healthy' && (
        <Alert variant={systemHealth.status === 'critical' ? 'destructive' : 'default'}>
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            System health is {systemHealth.status}. 
            {systemHealth.errors.count > 0 && ` ${systemHealth.errors.count} errors detected.`}
            {systemHealth.performance.recommendations.length > 0 && 
              ` Performance recommendations available.`
            }
          </AlertDescription>
        </Alert>
      )}

      {/* Overview Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">System Health</CardTitle>
            {getHealthIcon(systemHealth.status)}
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-2">
              <div className={`h-2 w-2 rounded-full ${getHealthColor(systemHealth.status)}`} />
              <span className="text-2xl font-bold capitalize">{systemHealth.status}</span>
            </div>
            <p className="text-xs text-muted-foreground">
              Performance Score: {systemHealth.performance.score}/100
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{systemHealth.business.activeUsers}</div>
            <p className="text-xs text-muted-foreground">
              Conversion Rate: {systemHealth.business.conversionRate.toFixed(1)}%
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Performance</CardTitle>
            <Zap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {systemHealth.performance.rating === 'good' ? 'Good' : 
               systemHealth.performance.rating === 'needs-improvement' ? 'Fair' : 'Poor'}
            </div>
            <Progress value={systemHealth.performance.score} className="mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Error Rate</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {realTimeStats.errorRate.toFixed(1)}%
            </div>
            <p className="text-xs text-muted-foreground">
              {systemHealth.errors.count} recent errors
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Metrics */}
      <div className="grid gap-4 md:grid-cols-2">
        {/* Business Metrics */}
        <Card>
          <CardHeader>
            <CardTitle>Business Metrics</CardTitle>
            <CardDescription>User interactions and conversion tracking</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-2">
              <div className="flex justify-between">
                <span className="text-sm">Total Interactions</span>
                <Badge variant="secondary">{business.overview.totalInteractions}</Badge>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">Avg Session Duration</span>
                <Badge variant="secondary">{business.overview.avgSessionDuration}</Badge>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">Conversion Rate</span>
                <Badge variant="secondary">{business.overview.conversionRate}</Badge>
              </div>
            </div>

            <div>
              <h4 className="text-sm font-medium mb-2">Top Actions</h4>
              <div className="space-y-1">
                {business.topActions.map((action: any, index: number) => (
                  <div key={index} className="flex justify-between text-sm">
                    <span>{action.action}</span>
                    <span className="text-muted-foreground">{action.count}</span>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Performance Metrics */}
        <Card>
          <CardHeader>
            <CardTitle>Core Web Vitals</CardTitle>
            <CardDescription>Performance metrics and recommendations</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-2">
              {performance.webVitals.lcp && (
                <div className="flex justify-between">
                  <span className="text-sm">LCP</span>
                  <Badge variant={performance.webVitals.lcp.rating === 'good' ? 'default' : 'destructive'}>
                    {performance.webVitals.lcp.value}ms
                  </Badge>
                </div>
              )}
              {performance.webVitals.fid && (
                <div className="flex justify-between">
                  <span className="text-sm">FID</span>
                  <Badge variant={performance.webVitals.fid.rating === 'good' ? 'default' : 'destructive'}>
                    {performance.webVitals.fid.value}ms
                  </Badge>
                </div>
              )}
              {performance.webVitals.cls && (
                <div className="flex justify-between">
                  <span className="text-sm">CLS</span>
                  <Badge variant={performance.webVitals.cls.rating === 'good' ? 'default' : 'destructive'}>
                    {performance.webVitals.cls.value}
                  </Badge>
                </div>
              )}
            </div>

            {systemHealth.performance.recommendations.length > 0 && (
              <div>
                <h4 className="text-sm font-medium mb-2">Recommendations</h4>
                <div className="space-y-1">
                  {systemHealth.performance.recommendations.map((rec: string, index: number) => (
                    <p key={index} className="text-xs text-muted-foreground">
                      • {rec}
                    </p>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity & Errors */}
      <div className="grid gap-4 md:grid-cols-2">
        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {business.recentActivity.map((activity: any, index: number) => (
                <div key={index} className="flex justify-between text-sm">
                  <div>
                    <span className="font-medium">{activity.action}</span>
                    <span className="text-muted-foreground ml-2">in {activity.component}</span>
                  </div>
                  <span className="text-muted-foreground">
                    {new Date(activity.timestamp).toLocaleTimeString()}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Errors */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Errors</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {systemHealth.errors.recentErrors.length === 0 ? (
                <p className="text-sm text-muted-foreground">No recent errors</p>
              ) : (
                systemHealth.errors.recentErrors.map((error: any, index: number) => (
                  <div key={index} className="text-sm">
                    <div className="font-medium text-red-600">{error.message}</div>
                    <div className="text-muted-foreground">
                      {error.component} • {new Date(error.timestamp).toLocaleTimeString()}
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ObservabilityDashboard;