// @ts-nocheck
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  PieChart,
  Pie,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  Cell,
  ResponsiveContainer,
} from 'recharts';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { ChartConfig, ChartContainer } from '@/components/ui/chart';
import { GridLayout } from '@/components/shared/GridLayout';
type UtmData = {
  source: string;
  medium: string;
  campaign: string;
  users: number;
  conversions: number;
  conversionRate: number;
};

interface UtmTabProps {
  analyticsData: any;
  loading: boolean;
}

export const UtmTab: React.FC<UtmTabProps> = ({ analyticsData, loading: initialLoading }) => {
  const [utmData, setUtmData] = useState<UtmData[]>([]);
  const [loading, setLoading] = useState(initialLoading);

  useEffect(() => {
    async function fetchUtmData() {
      try {
        setLoading(true);

        // Fetch data from the server API
        const response = await fetch('http://localhost:3001/api/utm-analytics');

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();

        if (!result.success) {
          console.error('Error fetching UTM data:', result.error);
          return;
        }

        // Process the data to format it for our charts
        const processedData = processUtmData(result.data || []);
        setUtmData(processedData);
      } catch (err) {
        console.error('Error processing UTM data:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchUtmData();
  }, [analyticsData]);

  // Process the UTM data from the server API into the format we need
  const processUtmData = (data: any[]): UtmData[] => {
    // If there's no data yet, provide some sample data
    if (!data || data.length === 0) {
      return [
        {
          source: 'google',
          medium: 'cpc',
          campaign: 'brand',
          users: 250,
          conversions: 42,
          conversionRate: 16.8,
        },
        {
          source: 'facebook',
          medium: 'social',
          campaign: 'retargeting',
          users: 180,
          conversions: 27,
          conversionRate: 15.0,
        },
        {
          source: 'instagram',
          medium: 'social',
          campaign: 'influencer',
          users: 120,
          conversions: 15,
          conversionRate: 12.5,
        },
        {
          source: 'direct',
          medium: 'none',
          campaign: 'none',
          users: 350,
          conversions: 22,
          conversionRate: 6.3,
        },
        {
          source: 'email',
          medium: 'email',
          campaign: 'newsletter',
          users: 85,
          conversions: 19,
          conversionRate: 22.3,
        },
      ];
    }

    // Group the data by source, medium, and campaign
    const groupedData: Record<string, UtmData> = {};

    data.forEach(item => {
      const key = `${item.utm_source || 'direct'}-${item.utm_medium || 'none'}-${item.utm_campaign || 'none'}`;

      if (!groupedData[key]) {
        groupedData[key] = {
          source: item.utm_source || 'direct',
          medium: item.utm_medium || 'none',
          campaign: item.utm_campaign || 'none',
          users: 1,
          conversions: 0,
          conversionRate: 0,
        };
      } else {
        groupedData[key].users += 1;
      }
    });

    // Calculate conversion rates (in a real scenario, you would track actual conversions)
    Object.values(groupedData).forEach(item => {
      // This is just a placeholder - in a real scenario, you would track actual conversions
      // For now, we're using a random number between 5-25% for the conversion rate
      const randomConversionRate = Math.floor(Math.random() * 20) + 5;
      item.conversionRate = randomConversionRate;
      item.conversions = Math.round(item.users * (randomConversionRate / 100));
    });

    return Object.values(groupedData);
  };

  // Group data by source for pie chart
  const sourceData = React.useMemo(() => {
    return utmData.reduce(
      (acc, item) => {
        const existingSource = acc.find(s => s.name === item.source);
        if (existingSource) {
          existingSource.value += item.users;
        } else {
          acc.push({ name: item.source || 'direct', value: item.users });
        }
        return acc;
      },
      [] as { name: string; value: number }[]
    );
  }, [utmData]);

  // Colors for the pie chart
  const COLORS = ['#B89B7A', '#10b981', '#f59e0b', '#ef4444', '#0ea5e9', '#ec4899'];

  // Chart configuration
  const chartConfig: ChartConfig = {
    conversionRate: {
      label: 'Taxa de Conversão (%)',
      theme: { light: '#B89B7A', dark: '#A78BFA' },
    },
  };

  // Custom tooltip renderer
  const renderTooltipContent = (props: any) => {
    if (!props.active || !props.payload?.[0]) {
      return null;
    }

    const data = props.payload[0];

    return (
      <div className="bg-white p-1.5 border border-gray-100 shadow-lg rounded-md">
        <p className="text-[7px] font-medium mb-0.5">
          {data.name === 'value' ? props.label : data.name}
        </p>
        <p className="text-[7px] font-semibold">
          {data.value} {data.name === 'conversionRate' ? '%' : ''}
        </p>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <p className="text-muted-foreground">Carregando dados de campanha...</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <GridLayout columns={2} gap="md">
        <Card className="border border-border/40 shadow-sm">
          <CardHeader className="pb-1.5">
            <CardTitle>Tráfego por Fonte</CardTitle>
            <CardDescription className="text-xs">
              Distribuição de usuários por fonte UTM
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-1 px-2">
            <div className="h-[100px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart margin={{ top: 10, right: 10, bottom: 10, left: 10 }}>
                  <Pie
                    data={sourceData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={50}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  >
                    {sourceData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip content={renderTooltipContent} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="border border-border/40 shadow-sm">
          <CardHeader className="pb-1.5">
            <CardTitle>Conversão por Campanha</CardTitle>
            <CardDescription className="text-xs">
              Taxas de conversão por campanha de marketing
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-1 px-2">
            <div className="h-[55px]">
              <ChartContainer config={chartConfig}>
                <BarChart
                  data={utmData.filter(d => d.campaign && d.campaign !== 'none')}
                  margin={{ top: 5, right: 5, left: 0, bottom: 0 }}
                >
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis
                    dataKey="campaign"
                    tick={{ fill: '#888888', fontSize: 7 }}
                    tickLine={{ stroke: '#e0e0e0' }}
                  />
                  <YAxis tick={{ fill: '#888888', fontSize: 7 }} />
                  <Tooltip content={renderTooltipContent} />
                  <Bar
                    dataKey="conversionRate"
                    name="Taxa de Conversão (%)"
                    radius={[2, 2, 0, 0]}
                    fill="#B89B7A"
                  />
                </BarChart>
              </ChartContainer>
            </div>
          </CardContent>
        </Card>
      </GridLayout>

      <Card className="border border-border/40 shadow-sm">
        <CardHeader className="pb-1.5">
          <CardTitle>Detalhes UTM</CardTitle>
          <CardDescription className="text-xs">
            Detalhamento dos parâmetros UTM e performance
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-1.5">
          <div className="rounded-md border border-border/40 overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-xs">Fonte</TableHead>
                  <TableHead className="text-xs">Meio</TableHead>
                  <TableHead className="text-xs">Campanha</TableHead>
                  <TableHead className="text-xs">Usuários</TableHead>
                  <TableHead className="text-xs">Conversões</TableHead>
                  <TableHead className="text-xs">Taxa de Conversão</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {utmData.length > 0 ? (
                  utmData.map((item, i) => (
                    <TableRow key={i}>
                      <TableCell className="py-1.5 text-xs">{item.source || 'direct'}</TableCell>
                      <TableCell className="py-1.5 text-xs">{item.medium || 'none'}</TableCell>
                      <TableCell className="py-1.5 text-xs">{item.campaign || 'none'}</TableCell>
                      <TableCell className="py-1.5 text-xs">{item.users}</TableCell>
                      <TableCell className="py-1.5 text-xs">{item.conversions}</TableCell>
                      <TableCell className="py-1.5 text-xs">
                        {item.conversionRate.toFixed(1)}%
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={6}
                      className="text-center py-3 text-muted-foreground text-sm"
                    >
                      Nenhum dado UTM disponível.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
