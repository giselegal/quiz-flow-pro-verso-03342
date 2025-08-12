import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export const AdvancedTab: React.FC = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Advanced Settings</CardTitle>
        <CardDescription>Options for experienced users</CardDescription>
      </CardHeader>
      <CardContent>
        <p>Coming soon: advanced settings such as SEO, Google Analytics, etc.</p>
      </CardContent>
    </Card>
  );
};
