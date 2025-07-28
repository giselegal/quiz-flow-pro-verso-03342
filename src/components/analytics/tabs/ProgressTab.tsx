import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, Cell, ResponsiveContainer, LineChart, Line } from 'recharts';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ChartConfig, ChartContainer } from '@/components/ui/chart';
import { Progress } from '@/components/ui/progress';
import { GridLayout } from '@/components/shared/GridLayout';
import { getUserProgressData } from '@/utils/analyticsHelpers';

interface ProgressTabProps {
  analyticsData: any;
  loading: boolean;
}

export const ProgressTab: React.FC<ProgressTabProps> = ({
  analyticsData,
  loading
}) => {
  const userProgressData = React.useMemo(() => {
    if (!analyticsData?.events) return [];
    return getUserProgressData(analyticsData.events);
  }, [analyticsData]);
  
  // Calculate drop-off between questions for funnel visualization
  const dropoffData = React.useMemo(() => {
    if (!userProgressData || userProgressData.length < 2) return [];
    
    return userProgressData.map((item, index) => {
      const prevItem = index > 0 ? userProgressData[index - 1] : null;
      const nextItem = index < userProgressData.length - 1 ? userProgressData[index + 1] : null;
      
      const dropoffRate = nextItem ? 
        ((item.uniqueUsers - nextItem.uniqueUsers) / item.uniqueUsers * 100).toFixed(1) : 
        '0.0';
        
      const retentionFromStart = userProgressData[0] ? 
        ((item.uniqueUsers / userProgressData[0].uniqueUsers) * 100).toFixed(1) :
        '100.0';
        
      return {
        ...item,
        dropoffRate: parseFloat(dropoffRate),
        retentionFromStart: parseFloat(retentionFromStart)
      };
    });
  }, [userProgressData]);
  
  // Chart configurations
  const chartConfig: ChartConfig = {
    uniqueUsers: { 
      label: 'Usuários',
      theme: { light: '#8B5CF6', dark: '#A78BFA' }
    },
    retentionFromStart: {
      label: 'Retenção',
      theme: { light: '#10b981', dark: '#34d399' }
    }
  };
  
  // Color gradient for progress bars
  const getBarColor = (index: number, total: number) => {
    // Generate colors from purple to green
    const hue = 260 - (index / Math.max(1, total - 1) * 100);
    return `hsl(${hue}, 70%, 60%)`;
  };
  
  // Custom tooltip renderer
  const renderTooltipContent = (props: any) => {
    if (!props.active || !props.payload?.[0]) {
      return null;
    }
    
    const data = props.payload[0].payload;
    
    return (
      <div className="bg-white p-1.5 border border-gray-100 shadow-lg rounded-md">
        <p className="text-[7px] font-medium mb-0.5">Questão {data.questionId}</p>
        <p className="text-[7px] font-semibold">{data.uniqueUsers} usuários</p>
        <p className="text-[6px] text-gray-500 mt-0.5">{data.retentionFromStart}% retenção total</p>
        {data.dropoffRate > 0 && (
          <p className="text-[6px] text-rose-500 mt-0.5">{data.dropoffRate}% abandonaram aqui</p>
        )}
      </div>
    );
  };
  
  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <p className="text-muted-foreground">Carregando dados de progresso...</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <GridLayout columns={2} gap="md">
        <Card className="border border-border/40 shadow-sm">
          <CardHeader className="pb-1.5">
            <CardTitle>Progresso por Questão</CardTitle>
            <CardDescription className="text-xs">Usuários que alcançam cada pergunta</CardDescription>
          </CardHeader>
          <CardContent className="pt-1 px-2">
            <div className="h-[55px]">
              <ChartContainer config={chartConfig}>
                <BarChart 
                  data={userProgressData}
                  margin={{ top: 5, right: 5, left: 0, bottom: 0 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" vertical={false} />
                  <XAxis 
                    dataKey="questionId" 
                    stroke="#888888"
                    tick={{ fill: '#888888', fontSize: 7 }}
                    tickLine={{ stroke: '#e0e0e0' }}
                  />
                  <YAxis 
                    stroke="#888888"
                    tick={{ fill: '#888888', fontSize: 7 }}
                    tickLine={{ stroke: '#e0e0e0' }}
                  />
                  <Tooltip content={renderTooltipContent} />
                  <Bar 
                    dataKey="uniqueUsers" 
                    name="Usuários"
                    radius={[2, 2, 0, 0]}
                    animationDuration={1200}
                    animationEasing="ease-out"
                  >
                    {userProgressData.map((entry, index) => (
                      <Cell 
                        key={`cell-${index}`} 
                        fill={getBarColor(index, userProgressData.length)}
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ChartContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="border border-border/40 shadow-sm">
          <CardHeader className="pb-1.5">
            <CardTitle>Retenção do Funil</CardTitle>
            <CardDescription className="text-xs">Acompanhamento da retenção por etapa</CardDescription>
          </CardHeader>
          <CardContent className="pt-1 px-2">
            <div className="h-[55px]">
              <ChartContainer config={chartConfig}>
                <LineChart 
                  data={dropoffData}
                  margin={{ top: 5, right: 5, left: 0, bottom: 0 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                  <XAxis 
                    dataKey="questionId" 
                    stroke="#888888"
                    tick={{ fill: '#888888', fontSize: 7 }}
                    tickLine={{ stroke: '#e0e0e0' }}
                  />
                  <YAxis 
                    stroke="#888888"
                    tick={{ fill: '#888888', fontSize: 7 }}
                    tickLine={{ stroke: '#e0e0e0' }}
                  />
                  <Tooltip content={renderTooltipContent} />
                  <Line 
                    type="monotone" 
                    dataKey="retentionFromStart" 
                    stroke="#10b981" 
                    strokeWidth={1.5}
                    dot={{ r: 1.5, strokeWidth: 1 }}
                    activeDot={{ r: 3, strokeWidth: 0, fill: '#10b981' }}
                  />
                </LineChart>
              </ChartContainer>
            </div>
          </CardContent>
        </Card>
      </GridLayout>

      <Card className="border border-border/40 shadow-sm">
        <CardHeader className="pb-1.5">
          <CardTitle>Funil de Questões</CardTitle>
          <CardDescription className="text-xs">Taxas de queda por etapa do quiz</CardDescription>
        </CardHeader>
        <CardContent className="pt-1.5">
          <div className="rounded-md border border-border/40 overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[80px]">Questão</TableHead>
                  <TableHead className="w-[80px]">Usuários</TableHead>
                  <TableHead className="w-[90px]">Respostas</TableHead>
                  <TableHead>Taxa de Retenção</TableHead>
                  <TableHead>Abandono</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {dropoffData.map((item, index) => (
                  <TableRow key={item.questionId}>
                    <TableCell className="font-medium py-1.5 text-xs">
                      Q{index + 1}
                    </TableCell>
                    <TableCell className="py-1.5 text-xs">{item.uniqueUsers}</TableCell>
                    <TableCell className="py-1.5 text-xs">{item.totalAnswers}</TableCell>
                    <TableCell className="py-1.5">
                      <div className="flex items-center gap-2">
                        <Progress
                          value={item.retentionFromStart}
                          className="h-1.5 w-[40px]"
                          indicatorClassName=""
                          {...(item.retentionFromStart != null && { style: { '--tw-bg-opacity': '1', backgroundColor: getBarColor(index, dropoffData.length) } as React.CSSProperties })}
                        />
                        <span className="text-xs">{item.retentionFromStart}%</span>
                      </div>
                    </TableCell>
                    <TableCell className="py-1.5 text-xs">
                      {item.dropoffRate > 0 ? (
                        <span className="text-rose-500">{item.dropoffRate}%</span>
                      ) : (
                        <span className="text-muted-foreground">-</span>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
                {dropoffData.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-3 text-muted-foreground text-sm">
                      Nenhum dado de progresso disponível.
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
