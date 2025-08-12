import AdminLayout from '@/components/admin/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts';

interface TestDataItem {
  name: string;
  value: number;
  color: string;
}

const CreativeAnalyticsPageNew: React.FC = () => {
  const renderCustomizedLabel = ({ cx, cy, index }: any) => {
    return (
      <text x={cx} y={cy} dy={-4} textAnchor="middle" fill={testData[index].color}>
        {testData[index].name}
      </text>
    );
  };

  const testData: TestDataItem[] = [
    { name: 'Natural', value: 25, color: '#8F7A6A' },
    { name: 'Clássico', value: 20, color: '#432818' },
    { name: 'Contemporâneo', value: 18, color: '#B89B7A' },
    { name: 'Elegante', value: 15, color: '#AA6B5D' },
    { name: 'Romântico', value: 12, color: '#D4A5A5' },
    { name: 'Sexy', value: 10, color: '#9E2B2B' },
  ];

  return (
    <AdminLayout title="Análises Criativas">
      <Card>
        <CardHeader>
          <CardTitle>Distribuição de Estilos</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={400}>
            <PieChart>
              <Pie
                data={testData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={renderCustomizedLabel}
                outerRadius={160}
                fill="#8884d8"
                dataKey="value"
              >
                {testData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </AdminLayout>
  );
};

export default CreativeAnalyticsPageNew;
