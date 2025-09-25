/**
 * 🚀 ACTIVATED DASHBOARD - Phase 1 Quick Win Implementation
 * Demonstrating activated analytics features
 */

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useActivatedFeatures } from '@/hooks/useActivatedFeatures';

export const ActivatedDashboard: React.FC = () => {
  const { features, insights, isLoading } = useActivatedFeatures();

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-32 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">🚀 Activated Analytics</h1>
        <Badge variant="secondary" className="bg-green-100 text-green-800">
          Phase 1 Active
        </Badge>
      </div>

      {/* Feature Status Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">AI Insights</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-2">
              <div className={`w-2 h-2 rounded-full ${features.aiInsights ? 'bg-green-500' : 'bg-gray-300'}`}></div>
              <span className="text-xs">{features.aiInsights ? 'Active' : 'Inactive'}</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Real-time Analytics</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-2">
              <div className={`w-2 h-2 rounded-full ${features.realtimeAnalytics ? 'bg-green-500' : 'bg-gray-300'}`}></div>
              <span className="text-xs">{features.realtimeAnalytics ? 'Active' : 'Inactive'}</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">A/B Testing</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-2">
              <div className={`w-2 h-2 rounded-full ${features.abTesting ? 'bg-green-500' : 'bg-gray-300'}`}></div>
              <span className="text-xs">{features.abTesting ? 'Active' : 'Inactive'}</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Premium Templates</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-2">
              <div className={`w-2 h-2 rounded-full ${features.premiumTemplates ? 'bg-green-500' : 'bg-gray-300'}`}></div>
              <span className="text-xs">{features.premiumTemplates ? 'Active' : 'Inactive'}</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* AI Insights Section */}
      {insights && (
        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">🤖 AI Insights</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <h4 className="font-medium text-sm mb-1">Conversion Optimization</h4>
                <p className="text-sm text-gray-600">{insights.aiInsights?.conversionOptimization}</p>
              </div>
              <div>
                <h4 className="font-medium text-sm mb-1">User Segmentation</h4>
                <p className="text-sm text-gray-600">{insights.aiInsights?.userSegmentation}</p>
              </div>
              <div>
                <h4 className="font-medium text-sm mb-1">Predictive Analytics</h4>
                <p className="text-sm text-gray-600">{insights.aiInsights?.predictiveAnalytics}</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">📊 Premium Features</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <h4 className="font-medium text-sm mb-1">Heatmaps</h4>
                <Badge variant="outline" className="text-xs">Available</Badge>
              </div>
              <div>
                <h4 className="font-medium text-sm mb-1">Funnel Analysis</h4>
                <Badge variant="outline" className="text-xs">Available</Badge>
              </div>
              <div>
                <h4 className="font-medium text-sm mb-1">Cohort Analysis</h4>
                <Badge variant="outline" className="text-xs">Available</Badge>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Phase 2 Preview */}
      <Card className="border-dashed border-2">
        <CardHeader>
          <CardTitle className="text-lg flex items-center space-x-2">
            <span>🔮 Phase 2 Preview</span>
            <Badge variant="secondary">Coming Soon</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 md:grid-cols-3">
            <div className="text-center p-4 bg-gray-50 rounded">
              <div className="text-2xl mb-2">🎨</div>
              <h4 className="font-medium">Fashion AI</h4>
              <p className="text-xs text-gray-600">AI-generated style recommendations</p>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded">
              <div className="text-2xl mb-2">🔍</div>
              <h4 className="font-medium">Predictive Analytics</h4>
              <p className="text-xs text-gray-600">Behavior prediction & optimization</p>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded">
              <div className="text-2xl mb-2">⚡</div>
              <h4 className="font-medium">Auto Optimization</h4>
              <p className="text-xs text-gray-600">Self-improving quiz performance</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ActivatedDashboard;