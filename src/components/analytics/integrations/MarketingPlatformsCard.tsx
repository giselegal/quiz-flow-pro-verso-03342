import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export const MarketingPlatformsCard: React.FC = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>More Marketing Platforms</CardTitle>
        <CardDescription>Connect additional marketing and advertising platforms</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground">
          Google Ads, TikTok Pixel, LinkedIn Insight Tag, and other platform integrations coming
          soon.
        </p>
      </CardContent>
    </Card>
  );
};
