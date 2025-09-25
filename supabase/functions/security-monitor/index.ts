/**
 * Edge Function: Security Monitor
 * Monitora métricas de segurança e performance do sistema
 */

import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface SecurityMetric {
  service_name: string;
  metric_name: string;
  metric_value: number;
  metric_unit?: string;
  status?: 'healthy' | 'warning' | 'critical';
  metadata?: Record<string, any>;
}

interface SecurityEvent {
  event_type: string;
  event_data?: Record<string, any>;
  severity?: 'low' | 'medium' | 'high' | 'critical';
}

interface MetricRecord {
  status: string;
  [key: string]: any;
}

interface EventRecord {
  severity: string;
  [key: string]: any;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const url = new URL(req.url);
    const action = url.pathname.split('/').pop();

    switch (action) {
      case 'health-check':
        return await handleHealthCheck(supabase);
      
      case 'record-metric':
        return await handleRecordMetric(req, supabase);
      
      case 'log-security-event':
        return await handleLogSecurityEvent(req, supabase);
      
      case 'get-metrics':
        return await handleGetMetrics(req, supabase);
      
      case 'system-status':
        return await handleSystemStatus(supabase);
      
      default:
        return new Response(
          JSON.stringify({ error: 'Invalid action' }),
          { 
            status: 400, 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
          }
        );
    }

  } catch (error) {
    console.error('Security Monitor Error:', error);
    return new Response(
      JSON.stringify({ 
        error: 'Internal server error',
        message: error instanceof Error ? error.message : String(error)
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});

async function handleHealthCheck(supabase: any) {
  const startTime = Date.now();
  
  try {
    // Test database connectivity
    const { data: dbTest, error: dbError } = await supabase
      .from('system_health_metrics')
      .select('count')
      .limit(1);

    const dbLatency = Date.now() - startTime;
    
    // Test edge functions connectivity  
    const funcStartTime = Date.now();
    const { data: funcTest, error: funcError } = await supabase.functions.invoke('security-monitor');
    const funcLatency = Date.now() - funcStartTime;

    const status = {
      timestamp: new Date().toISOString(),
      services: {
        database: {
          status: dbError ? 'critical' : 'healthy',
          latency: dbLatency,
          error: dbError?.message
        },
        edge_functions: {
          status: funcError ? 'warning' : 'healthy',
          latency: funcLatency,
          error: funcError?.message
        }
      },
      overall_status: (dbError || funcError) ? 'degraded' : 'healthy'
    };

    // Record health metrics
    await supabase.rpc('record_system_metric', {
      p_service_name: 'health-check',
      p_metric_name: 'database_latency',
      p_metric_value: dbLatency,
      p_metric_unit: 'ms',
      p_status: status.services.database.status
    });

    return new Response(
      JSON.stringify(status),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );

  } catch (error) {
    console.error('Health check failed:', error);
    return new Response(
      JSON.stringify({ 
        status: 'critical',
        error: error instanceof Error ? error.message : String(error),
        timestamp: new Date().toISOString()
      }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
}

async function handleRecordMetric(req: Request, supabase: any) {
  const metric: SecurityMetric = await req.json();
  
  try {
    const { data, error } = await supabase.rpc('record_system_metric', {
      p_service_name: metric.service_name,
      p_metric_name: metric.metric_name,
      p_metric_value: metric.metric_value,
      p_metric_unit: metric.metric_unit || 'ms',
      p_status: metric.status || 'healthy',
      p_metadata: metric.metadata || {}
    });

    if (error) throw error;

    return new Response(
      JSON.stringify({ success: true, metric_id: data }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Failed to record metric:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : String(error) }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
}

async function handleLogSecurityEvent(req: Request, supabase: any) {
  const event: SecurityEvent = await req.json();
  
  try {
    const { data, error } = await supabase.rpc('log_security_event', {
      p_event_type: event.event_type,
      p_event_data: event.event_data || {},
      p_severity: event.severity || 'medium'
    });

    if (error) throw error;

    return new Response(
      JSON.stringify({ success: true, event_id: data }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Failed to log security event:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : String(error) }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
}

async function handleGetMetrics(req: Request, supabase: any) {
  const url = new URL(req.url);
  const serviceName = url.searchParams.get('service');
  const hours = parseInt(url.searchParams.get('hours') || '24');
  
  try {
    let query = supabase
      .from('system_health_metrics')
      .select('*')
      .gte('recorded_at', new Date(Date.now() - hours * 60 * 60 * 1000).toISOString())
      .order('recorded_at', { ascending: false });

    if (serviceName) {
      query = query.eq('service_name', serviceName);
    }

    const { data, error } = await query.limit(1000);
    
    if (error) throw error;

    return new Response(
      JSON.stringify({ metrics: data }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Failed to get metrics:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : String(error) }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
}

async function handleSystemStatus(supabase: any) {
  try {
    // Get recent metrics summary
    const { data: metrics, error: metricsError } = await supabase
      .from('system_health_metrics')
      .select('service_name, metric_name, metric_value, status, recorded_at')
      .gte('recorded_at', new Date(Date.now() - 60 * 60 * 1000).toISOString()) // Last hour
      .order('recorded_at', { ascending: false });

    if (metricsError) throw metricsError;

    // Get recent security events
    const { data: events, error: eventsError } = await supabase
      .from('security_audit_logs')
      .select('event_type, severity, created_at')
      .gte('created_at', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()) // Last 24 hours
      .order('created_at', { ascending: false })
      .limit(100);

    if (eventsError) throw eventsError;

    // Analyze system status
    const criticalMetrics = (metrics as MetricRecord[])?.filter((m: MetricRecord) => m.status === 'critical') || [];
    const warningMetrics = (metrics as MetricRecord[])?.filter((m: MetricRecord) => m.status === 'warning') || [];
    const criticalEvents = (events as EventRecord[])?.filter((e: EventRecord) => e.severity === 'critical') || [];
    const highEvents = (events as EventRecord[])?.filter((e: EventRecord) => e.severity === 'high') || [];

    const overallStatus = criticalMetrics.length > 0 || criticalEvents.length > 0 
      ? 'critical'
      : warningMetrics.length > 0 || highEvents.length > 0
      ? 'warning' 
      : 'healthy';

    const status = {
      overall_status: overallStatus,
      timestamp: new Date().toISOString(),
      summary: {
        metrics_count: metrics?.length || 0,
        critical_metrics: criticalMetrics.length,
        warning_metrics: warningMetrics.length,
        security_events: events?.length || 0,
        critical_events: criticalEvents.length,
        high_severity_events: highEvents.length
      },
      recent_critical_metrics: criticalMetrics.slice(0, 5),
      recent_critical_events: criticalEvents.slice(0, 5)
    };

    return new Response(
      JSON.stringify(status),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Failed to get system status:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : String(error) }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
}