import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export const ApiTokensCard: React.FC = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>API Tokens</CardTitle>
        <CardDescription>Manage API tokens for direct access to analytics data</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-muted-foreground mb-2">
          Create and manage API tokens to access your analytics data programmatically.
        </p>
        <Button variant="outline">Generate New API Token</Button>
      </CardContent>
    </Card>
  );
};
