
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export const AccessControlSystem: React.FC = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Access Control System</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-gray-500">
          Access control functionality will be implemented here.
        </p>
      </CardContent>
    </Card>
  );
};

export default AccessControlSystem;
