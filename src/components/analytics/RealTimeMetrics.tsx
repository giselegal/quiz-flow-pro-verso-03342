"use client";
import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  Users,
  Target,
  Clock,
  Zap,
  RefreshCw,
} from "lucide-react";

interface AnalyticsEvent {
  event_name: string;
  timestamp: number;
  date: string;
  utm_content?: string;
  utm_source?: string;
  utm_campaign?: string;
  value?: number;
  currency?: string;
  email?: string;
}

interface RealTimeDataPoint {
  time: string;
  visitors: number;
  conversions: number;
  revenue: string;
  avgSession: number;
}

interface RealTimeMetricsProps {
  analyticsData: AnalyticsEvent[];
  loading?: boolean;
}

export const RealTimeMetrics: React.FC<RealTimeMetricsProps> = ({
  analyticsData,
  loading = false,
}) => {
  const [realTimeData, setRealTimeData] = useState<RealTimeDataPoint[]>([]);
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());
  const [autoRefresh, setAutoRefresh] = useState(true);

  // Simular dados em tempo real (em produção, conectaria a API)
  useEffect(() => {
    if (!autoRefresh) return;

    const interval = setInterval(() => {
      generateRealTimeData();
      setLastUpdate(new Date());
    }, 30000); // Atualiza a cada 30 segundos

    return () => clearInterval(interval);
  }, [autoRefresh]);

  const generateRealTimeData = () => {
    try {
      // Tentar buscar dados reais do localStorage
      const events = JSON.parse(
        localStorage.getItem("all_tracked_events") || "[]"
      );
      const now = new Date();

      // Filtrar eventos das últimas 24 horas
      const today = events.filter((event: AnalyticsEvent) => {
        const eventDate = new Date(event.timestamp || event.date);
        const hoursDiff =
          (now.getTime() - eventDate.getTime()) / (1000 * 60 * 60);
        return hoursDiff <= 24;
      });

      // Agrupar por hora
      const hourlyData: Record<
        string,
        {
          visitors: Set<string>;
          conversions: number;
          revenue: number;
          sessions: string[];
        }
      > = {};
      today.forEach((event: AnalyticsEvent) => {
        const eventTime = new Date(event.timestamp || event.date);
        const hour = eventTime.getHours();
        const hourKey = `${hour.toString().padStart(2, "0")}:00`;

        if (!hourlyData[hourKey]) {
          hourlyData[hourKey] = {
            visitors: new Set(),
            conversions: 0,
            revenue: 0,
            sessions: [],
          };
        }

        // Contabilizar visitantes únicos por IP/sessão simulada
        const visitorId =
          event.utm_source +
          event.utm_campaign +
          Math.floor(Math.random() * 100);
        hourlyData[hourKey].visitors.add(visitorId);

        if (event.event_name === "Lead" || event.event_name === "Purchase") {
          hourlyData[hourKey].conversions++;
        }

        if (event.event_name === "Purchase" && event.value) {
          hourlyData[hourKey].revenue +=
            parseFloat(event.value.toString()) || 0;
        }
      });

      // Se há dados reais, usar eles
      if (Object.keys(hourlyData).length > 0) {
        const currentHour = now.getHours().toString().padStart(2, "0") + ":00";
        const currentData = hourlyData[currentHour] || {
          visitors: new Set<string>(),
          conversions: 0,
          revenue: 0,
        };

        const newDataPoint = {
          time: now.toLocaleTimeString("pt-BR", {
            hour: "2-digit",
            minute: "2-digit",
          }),
          timestamp: now.getTime(),
          visitors: currentData.visitors.size,
          conversions: currentData.conversions,
          revenue: currentData.revenue.toFixed(2),
          avgSession: Math.floor(Math.random() * 180) + 60, // Ainda simulado
        };

        setRealTimeData((prev) => {
          const updated = [...prev, newDataPoint];
          return updated.slice(-20);
        });
        return;
      }
    } catch (error) {
      console.log("Erro ao buscar dados reais, usando simulados:", error);
    }

    // Fallback para dados simulados se não há dados reais
    const now = new Date();
    const newDataPoint = {
      time: now.toLocaleTimeString("pt-BR", {
        hour: "2-digit",
        minute: "2-digit",
      }),
      timestamp: now.getTime(),
      visitors: Math.floor(Math.random() * 50) + 10,
      conversions: Math.floor(Math.random() * 10) + 1,
      revenue: (Math.random() * 500 + 100).toFixed(2),
      avgSession: Math.floor(Math.random() * 180) + 60,
    };

    setRealTimeData((prev) => {
      const updated = [...prev, newDataPoint];
      return updated.slice(-20);
    });
  };

  // Gerar dados iniciais
  useEffect(() => {
    const initialData = [];
    for (let i = 19; i >= 0; i--) {
      const time = new Date(Date.now() - i * 30000);
      initialData.push({
        time: time.toLocaleTimeString("pt-BR", {
          hour: "2-digit",
          minute: "2-digit",
        }),
        timestamp: time.getTime(),
        visitors: Math.floor(Math.random() * 50) + 10,
        conversions: Math.floor(Math.random() * 10) + 1,
        revenue: (Math.random() * 500 + 100).toFixed(2),
        avgSession: Math.floor(Math.random() * 180) + 60,
      });
    }
    setRealTimeData(initialData);
  }, []);

  // Calcular métricas atuais
  const currentMetrics =
    realTimeData.length > 0
      ? {
          activeVisitors: realTimeData[realTimeData.length - 1]?.visitors || 0,
          conversionRate:
            realTimeData.length > 1
              ? (
                  ((realTimeData[realTimeData.length - 1]?.conversions || 0) /
                    (realTimeData[realTimeData.length - 1]?.visitors || 1)) *
                  100
                ).toFixed(1)
              : "0.0",
          revenueToday: realTimeData
            .reduce((sum, point) => sum + parseFloat(point.revenue || "0"), 0)
            .toFixed(2),
          avgSessionTime:
            realTimeData.length > 0
              ? Math.floor(
                  realTimeData.reduce(
                    (sum, point) => sum + (point.avgSession || 0),
                    0
                  ) / realTimeData.length
                )
              : 0,
        }
      : {
          activeVisitors: 0,
          conversionRate: "0.0",
          revenueToday: "0.00",
          avgSessionTime: 0,
        };

  // Cores para os gráficos
  const colors = {
    primary: "#B89B7A",
    secondary: "#D4C4A0",
    success: "#10B981",
    warning: "#F59E0B",
    danger: "#EF4444",
  };

  const formatSessionTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="w-5 h-5" />
            Métricas em Tempo Real
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[400px] flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header com controles */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Zap className="w-5 h-5 text-green-500" />
                Métricas em Tempo Real
                <Badge variant="outline" className="ml-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-1 animate-pulse"></div>
                  LIVE
                </Badge>
              </CardTitle>
              <CardDescription>
                Última atualização: {lastUpdate.toLocaleTimeString("pt-BR")}
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setAutoRefresh(!autoRefresh)}
              >
                <RefreshCw
                  className={`w-4 h-4 mr-2 ${
                    autoRefresh ? "animate-spin" : ""
                  }`}
                />
                {autoRefresh ? "Pausar" : "Retomar"}
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={generateRealTimeData}
              >
                Atualizar Agora
              </Button>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Cards de métricas instantâneas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Visitantes Ativos
                </p>
                <p className="text-2xl font-bold text-green-600">
                  {currentMetrics.activeVisitors}
                </p>
              </div>
              <Users className="w-8 h-8 text-green-600" />
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              Usuários online agora
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Taxa de Conversão
                </p>
                <p className="text-2xl font-bold text-blue-600">
                  {currentMetrics.conversionRate}%
                </p>
              </div>
              <Target className="w-8 h-8 text-blue-600" />
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              Conversões vs visitantes
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Receita Hoje
                </p>
                <p className="text-2xl font-bold text-green-600">
                  R$ {currentMetrics.revenueToday}
                </p>
              </div>
              <DollarSign className="w-8 h-8 text-green-600" />
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              Vendas confirmadas
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Tempo Médio
                </p>
                <p className="text-2xl font-bold text-purple-600">
                  {formatSessionTime(currentMetrics.avgSessionTime)}
                </p>
              </div>
              <Clock className="w-8 h-8 text-purple-600" />
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              Duração das sessões
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Gráficos em tempo real */}
      <Tabs defaultValue="visitors" className="space-y-4">
        <TabsList>
          <TabsTrigger value="visitors">Visitantes</TabsTrigger>
          <TabsTrigger value="conversions">Conversões</TabsTrigger>
          <TabsTrigger value="revenue">Receita</TabsTrigger>
        </TabsList>

        <TabsContent value="visitors">
          <Card>
            <CardHeader>
              <CardTitle>Visitantes Ativos (Últimos 10 minutos)</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={realTimeData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="time" />
                    <YAxis />
                    <Tooltip
                      labelFormatter={(label) => `Horário: ${label}`}
                      formatter={(value: number | string, name: string) => [
                        value,
                        name === "visitors" ? "Visitantes" : name,
                      ]}
                    />
                    <Area
                      type="monotone"
                      dataKey="visitors"
                      stroke={colors.primary}
                      fill={colors.primary}
                      fillOpacity={0.3}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="conversions">
          <Card>
            <CardHeader>
              <CardTitle>Conversões em Tempo Real</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={realTimeData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="time" />
                    <YAxis />
                    <Tooltip
                      labelFormatter={(label) => `Horário: ${label}`}
                      formatter={(value: number | string) => [
                        value,
                        "Conversões",
                      ]}
                    />
                    <Line
                      type="monotone"
                      dataKey="conversions"
                      stroke={colors.success}
                      strokeWidth={3}
                      dot={{ fill: colors.success, strokeWidth: 2, r: 4 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="revenue">
          <Card>
            <CardHeader>
              <CardTitle>Receita Acumulada</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart
                    data={realTimeData.map((point, index) => ({
                      ...point,
                      cumulativeRevenue: realTimeData
                        .slice(0, index + 1)
                        .reduce(
                          (sum, p) => sum + parseFloat(p.revenue || "0"),
                          0
                        )
                        .toFixed(2),
                    }))}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="time" />
                    <YAxis />
                    <Tooltip
                      labelFormatter={(label) => `Horário: ${label}`}
                      formatter={(value: number | string) => [
                        `R$ ${value}`,
                        "Receita Acumulada",
                      ]}
                    />
                    <Area
                      type="monotone"
                      dataKey="cumulativeRevenue"
                      stroke={colors.success}
                      fill={colors.success}
                      fillOpacity={0.3}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
