import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { Link } from 'wouter';

export const MarketingTab: React.FC = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>UTM Configuration</CardTitle>
        <CardDescription>Configure UTM parameter tracking</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground">
          UTM parameters help track the effectiveness of your marketing campaigns.
        </p>

        <div className="space-y-4">
          <div>
            <Label className="text-base">Default UTM Sources</Label>
            <p className="text-sm text-muted-foreground mb-2">
              These sources are automatically tracked when present in URLs.
            </p>
            <div className="grid grid-cols-2 gap-2">
              <div className="flex items-center space-x-2">
                <Switch id="utm-google" defaultChecked={true} />
                <Label htmlFor="utm-google">Google (utm_source=google)</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Switch id="utm-facebook" defaultChecked={true} />
                <Label htmlFor="utm-facebook">Facebook (utm_source=facebook)</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Switch id="utm-instagram" defaultChecked={true} />
                <Label htmlFor="utm-instagram">Instagram (utm_source=instagram)</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Switch id="utm-email" defaultChecked={true} />
                <Label htmlFor="utm-email">Email (utm_source=email)</Label>
              </div>
            </div>
          </div>

          <Separator />

          <div>
            <Label className="text-base">Analytics Integration</Label>
            <div className="flex items-center space-x-2 mt-2">
              <Switch id="utm-to-ga" defaultChecked={true} />
              <Label htmlFor="utm-to-ga">Send UTM data to Google Analytics</Label>
            </div>
            <div className="flex items-center space-x-2 mt-2">
              <Switch id="utm-to-fb" defaultChecked={true} />
              <Label htmlFor="utm-to-fb">Send UTM data to Facebook Pixel</Label>
            </div>
          </div>
        </div>

        <Button className="mt-4 bg-[#B89B7A] hover:bg-[#A38A69]">Save UTM Settings</Button>

        <div className="mt-6">
          <Button variant="outline" asChild>
            <Link to="/admin/analytics?tab=utm">View UTM Analytics</Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
