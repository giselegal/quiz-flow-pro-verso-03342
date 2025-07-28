
import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { CheckCircle, AlertCircle, ExternalLink, Settings } from 'lucide-react';

interface FacebookPixelSettings {
  pixelId: string;
  accessToken: string;
  testEventCode: string;
  enabled: boolean;
}

interface FacebookPixelCardProps {
  onSave?: (settings: FacebookPixelSettings) => void;
}

const FacebookPixelCard: React.FC<FacebookPixelCardProps> = ({ onSave }) => {
  const [settings, setSettings] = useState<FacebookPixelSettings>({
    pixelId: '',
    accessToken: '',
    testEventCode: '',
    enabled: false
  });
  const [isConnected, setIsConnected] = useState(false);
  const [isConfiguring, setIsConfiguring] = useState(false);
  const [testStatus, setTestStatus] = useState<'idle' | 'testing' | 'success' | 'error'>('idle');

  const handleConnect = async () => {
    try {
      setIsConnected(true);
      setIsConfiguring(false);
      if (onSave) {
        onSave({ ...settings, enabled: true });
      }
    } catch (error) {
      console.error('Failed to connect Facebook Pixel:', error);
    }
  };

  const handleDisconnect = () => {
    setIsConnected(false);
    setSettings({
      pixelId: '',
      accessToken: '',
      testEventCode: '',
      enabled: false
    });
  };

  const handleTestEvent = async () => {
    setTestStatus('testing');
    
    // Simulate API call
    setTimeout(() => {
      setTestStatus('success');
      setTimeout(() => setTestStatus('idle'), 2000);
    }, 2000);
  };

  const handleSettingsChange = (field: keyof FacebookPixelSettings, value: string | boolean) => {
    setSettings(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="text-2xl">📘</div>
          <div>
            <h3 className="font-semibold">Facebook Pixel</h3>
            <p className="text-sm text-gray-600">
              Track conversions and optimize Facebook ads
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          {isConnected ? (
            <Badge variant="default" className="bg-green-100 text-green-800">
              <CheckCircle className="w-3 h-3 mr-1" />
              Connected
            </Badge>
          ) : (
            <Badge variant="destructive">
              <AlertCircle className="w-3 h-3 mr-1" />
              Disconnected
            </Badge>
          )}
        </div>
      </div>

      {!isConnected ? (
        <div className="space-y-4">
          <div className="bg-blue-50 p-4 rounded-lg">
            <h4 className="font-medium text-blue-900">Why connect Facebook Pixel?</h4>
            <ul className="text-sm text-blue-800 mt-2 space-y-1">
              <li>• Track quiz completions and conversions</li>
              <li>• Create custom audiences for retargeting</li>
              <li>• Optimize ad delivery for better results</li>
              <li>• Measure return on ad spend (ROAS)</li>
            </ul>
          </div>

          <div className="space-y-3">
            <div>
              <Label htmlFor="pixelId">Facebook Pixel ID</Label>
              <Input
                id="pixelId"
                value={settings.pixelId}
                onChange={(e) => handleSettingsChange('pixelId', e.target.value)}
                placeholder="123456789012345"
              />
            </div>

            <div>
              <Label htmlFor="accessToken">Access Token (Optional)</Label>
              <Input
                id="accessToken"
                type="password"
                value={settings.accessToken}
                onChange={(e) => handleSettingsChange('accessToken', e.target.value)}
                placeholder="Your Facebook API access token"
              />
            </div>

            <div>
              <Label htmlFor="testEventCode">Test Event Code (Optional)</Label>
              <Input
                id="testEventCode"
                value={settings.testEventCode}
                onChange={(e) => handleSettingsChange('testEventCode', e.target.value)}
                placeholder="TEST12345"
              />
            </div>
          </div>

          <div className="flex space-x-2">
            <Button 
              onClick={handleConnect}
              disabled={!settings.pixelId}
              className="flex-1"
            >
              Connect Facebook Pixel
            </Button>
            <Button 
              variant="outline"
              onClick={() => window.open('https://developers.facebook.com/docs/facebook-pixel', '_blank')}
            >
              <ExternalLink className="w-4 h-4 mr-2" />
              Documentation
            </Button>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {/* Connected Status */}
          <div className="bg-green-50 p-4 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium text-green-900">Successfully Connected</h4>
                <p className="text-sm text-green-800">
                  Pixel ID: {settings.pixelId}
                </p>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsConfiguring(!isConfiguring)}
              >
                <Settings className="w-4 h-4 mr-2" />
                Configure
              </Button>
            </div>
          </div>

          {/* Configuration Panel */}
          {isConfiguring && (
            <div className="space-y-3 p-4 bg-gray-50 rounded-lg">
              <div>
                <Label htmlFor="pixelIdEdit">Pixel ID</Label>
                <Input
                  id="pixelIdEdit"
                  value={settings.pixelId}
                  onChange={(e) => handleSettingsChange('pixelId', e.target.value)}
                />
              </div>

              <div>
                <Label htmlFor="accessTokenEdit">Access Token</Label>
                <Input
                  id="accessTokenEdit"
                  type="password"
                  value={settings.accessToken}
                  onChange={(e) => handleSettingsChange('accessToken', e.target.value)}
                />
              </div>

              <div>
                <Label htmlFor="testEventCodeEdit">Test Event Code</Label>
                <Input
                  id="testEventCodeEdit"
                  value={settings.testEventCode}
                  onChange={(e) => handleSettingsChange('testEventCode', e.target.value)}
                />
              </div>

              <div className="flex space-x-2">
                <Button size="sm" onClick={handleConnect}>
                  Save Changes
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => setIsConfiguring(false)}
                >
                  Cancel
                </Button>
              </div>
            </div>
          )}

          {/* Test Event */}
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div>
              <h4 className="font-medium">Test Event</h4>
              <p className="text-sm text-gray-600">
                Send a test event to verify tracking
              </p>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={handleTestEvent}
              disabled={testStatus === 'testing'}
            >
              {testStatus === 'testing' ? 'Testing...' : 'Send Test Event'}
            </Button>
          </div>

          {testStatus === 'success' && (
            <div className="bg-green-50 p-3 rounded-lg">
              <p className="text-sm text-green-800">
                ✅ Test event sent successfully! Check your Facebook Events Manager.
              </p>
            </div>
          )}

          {/* Actions */}
          <div className="flex space-x-2">
            <Button
              variant="outline"
              onClick={() => window.open('https://www.facebook.com/events_manager2', '_blank')}
            >
              <ExternalLink className="w-4 h-4 mr-2" />
              View Events Manager
            </Button>
            <Button
              variant="destructive"
              onClick={handleDisconnect}
            >
              Disconnect
            </Button>
          </div>
        </div>
      )}
    </Card>
  );
};

export default FacebookPixelCard;
