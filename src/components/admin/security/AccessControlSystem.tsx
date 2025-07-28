// Sistema de Controle de Acesso e Auditoria
import React, { useState, useEffect, useCallback, createContext, useContext } from 'react';
import { 
  Shield, 
  Eye, 
  Edit, 
  Trash2, 
  Settings, 
  Users, 
  Clock, 
  Filter,
  Search,
  Download,
  RefreshCw
} from 'lucide-react';
import { Button } from '../../ui/button';
import { Badge } from '../../ui/badge';
import { Input } from '../../ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../../ui/dialog';
import { supabase } from '../../../lib/supabase';

// Tipos para controle de acesso
export type UserRole = 'admin' | 'editor' | 'viewer';
export type Permission = 'create' | 'read' | 'update' | 'delete' | 'publish' | 'analytics';

export interface UserPermissions {
  userId: string;
  role: UserRole;
  funnels: {
    [key in Permission]?: string[] | boolean; // array de IDs ou boolean para todos
  };
  analytics: {
    view: boolean;
    export: boolean;
  };
  admin: {
    manageUsers: boolean;
    viewAuditLogs: boolean;
    systemSettings: boolean;
  };
}

// Tipos para auditoria
export type AuditAction = 
  | 'create_funnel' | 'update_funnel' | 'delete_funnel' | 'publish_funnel'
  | 'view_funnel' | 'duplicate_funnel' | 'archive_funnel'
  | 'login' | 'logout' | 'change_permissions' | 'view_analytics'
  | 'export_data' | 'system_setting_change';

export interface AuditLog {
  id: string;
  userId: string;
  userEmail: string;
  action: AuditAction;
  resourceType: 'funnel' | 'user' | 'system' | 'analytics';
  resourceId?: string;
  oldData?: any;
  newData?: any;
  ipAddress: string;
  userAgent: string;
  timestamp: Date;
  details?: string;
}

export interface AuditFilters {
  userId?: string;
  action?: AuditAction;
  resourceType?: string;
  dateRange: {
    start: Date;
    end: Date;
  };
  resourceId?: string;
}

// Contexto de Permissões
const PermissionsContext = createContext<{
  userPermissions: UserPermissions | null;
  hasPermission: (resource: string, action: Permission, resourceId?: string) => boolean;
  isAdmin: () => boolean;
  isEditor: () => boolean;
  logAction: (action: AuditAction, resourceType: string, resourceId?: string, details?: any) => Promise<void>;
}>({
  userPermissions: null,
  hasPermission: () => false,
  isAdmin: () => false,
  isEditor: () => false,
  logAction: async () => {}
});

// Provider de Permissões
export const PermissionsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [userPermissions, setUserPermissions] = useState<UserPermissions | null>(null);

  useEffect(() => {
    loadUserPermissions();
  }, []);

  const loadUserPermissions = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data: permissions } = await supabase
        .from('user_permissions')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (permissions) {
        setUserPermissions({
          userId: user.id,
          role: permissions.role,
          funnels: permissions.funnel_permissions || {},
          analytics: permissions.analytics_permissions || { view: false, export: false },
          admin: permissions.admin_permissions || { 
            manageUsers: false, 
            viewAuditLogs: false, 
            systemSettings: false 
          }
        });
      }
    } catch (error) {
      console.error('Error loading user permissions:', error);
    }
  };

  const hasPermission = useCallback((resource: string, action: Permission, resourceId?: string) => {
    if (!userPermissions) return false;

    // Admin tem acesso total
    if (userPermissions.role === 'admin') return true;

    // Verificar permissões específicas do recurso
    const resourcePermissions = userPermissions.funnels[action];
    
    if (typeof resourcePermissions === 'boolean') {
      return resourcePermissions;
    }

    if (Array.isArray(resourcePermissions) && resourceId) {
      return resourcePermissions.includes(resourceId);
    }

    return false;
  }, [userPermissions]);

  const isAdmin = useCallback(() => {
    return userPermissions?.role === 'admin' || false;
  }, [userPermissions]);

  const isEditor = useCallback(() => {
    return userPermissions?.role === 'editor' || userPermissions?.role === 'admin' || false;
  }, [userPermissions]);

  const logAction = useCallback(async (
    action: AuditAction, 
    resourceType: string, 
    resourceId?: string, 
    details?: any
  ) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Obter IP e User Agent (simulado para este exemplo)
      const ipAddress = '127.0.0.1'; // Em produção, obter do servidor
      const userAgent = navigator.userAgent;

      await supabase.from('audit_logs').insert({
        user_id: user.id,
        user_email: user.email,
        action,
        resource_type: resourceType,
        resource_id: resourceId,
        old_data: details?.oldData || null,
        new_data: details?.newData || null,
        ip_address: ipAddress,
        user_agent: userAgent,
        details: details?.description || null
      });
    } catch (error) {
      console.error('Error logging action:', error);
    }
  }, []);

  return (
    <PermissionsContext.Provider value={{
      userPermissions,
      hasPermission,
      isAdmin,
      isEditor,
      logAction
    }}>
      {children}
    </PermissionsContext.Provider>
  );
};

// Hook para usar permissões
export const usePermissions = () => {
  const context = useContext(PermissionsContext);
  if (!context) {
    throw new Error('usePermissions must be used within PermissionsProvider');
  }
  return context;
};

// Componente de proteção por permissão
export const ProtectedComponent: React.FC<{
  resource: string;
  action: Permission;
  resourceId?: string;
  fallback?: React.ReactNode;
  children: React.ReactNode;
}> = ({ resource, action, resourceId, fallback = null, children }) => {
  const { hasPermission } = usePermissions();

  if (!hasPermission(resource, action, resourceId)) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
};

// Hook para logs de auditoria
export const useAuditLogs = () => {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState<AuditFilters>({
    dateRange: {
      start: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // 30 dias atrás
      end: new Date()
    }
  });

  const loadAuditLogs = useCallback(async (customFilters?: Partial<AuditFilters>) => {
    setLoading(true);
    try {
      const appliedFilters = { ...filters, ...customFilters };
      
      let query = supabase
        .from('audit_logs')
        .select(`
          *,
          users!audit_logs_user_id_fkey(email, raw_user_meta_data)
        `)
        .gte('created_at', appliedFilters.dateRange.start.toISOString())
        .lte('created_at', appliedFilters.dateRange.end.toISOString())
        .order('created_at', { ascending: false })
        .limit(100);

      if (appliedFilters.userId) {
        query = query.eq('user_id', appliedFilters.userId);
      }

      if (appliedFilters.action) {
        query = query.eq('action', appliedFilters.action);
      }

      if (appliedFilters.resourceType) {
        query = query.eq('resource_type', appliedFilters.resourceType);
      }

      if (appliedFilters.resourceId) {
        query = query.eq('resource_id', appliedFilters.resourceId);
      }

      const { data, error } = await query;

      if (error) throw error;

      const processedLogs: AuditLog[] = data?.map(log => ({
        id: log.id,
        userId: log.user_id,
        userEmail: log.user_email,
        action: log.action,
        resourceType: log.resource_type,
        resourceId: log.resource_id,
        oldData: log.old_data,
        newData: log.new_data,
        ipAddress: log.ip_address,
        userAgent: log.user_agent,
        timestamp: new Date(log.created_at),
        details: log.details
      })) || [];

      setLogs(processedLogs);
    } catch (error) {
      console.error('Error loading audit logs:', error);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  const exportLogs = useCallback(async (format: 'csv' | 'json' = 'csv') => {
    try {
      const logsToExport = logs.map(log => ({
        timestamp: log.timestamp.toISOString(),
        user: log.userEmail,
        action: log.action,
        resource: `${log.resourceType}${log.resourceId ? `:${log.resourceId}` : ''}`,
        ip_address: log.ipAddress,
        details: log.details || ''
      }));

      if (format === 'csv') {
        const headers = Object.keys(logsToExport[0]).join(',');
        const csvContent = [
          headers,
          ...logsToExport.map(log => Object.values(log).map(v => `"${v}"`).join(','))
        ].join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `audit-logs-${new Date().toISOString().split('T')[0]}.csv`;
        a.click();
        URL.revokeObjectURL(url);
      } else {
        const jsonContent = JSON.stringify(logsToExport, null, 2);
        const blob = new Blob([jsonContent], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `audit-logs-${new Date().toISOString().split('T')[0]}.json`;
        a.click();
        URL.revokeObjectURL(url);
      }
    } catch (error) {
      console.error('Error exporting logs:', error);
    }
  }, [logs]);

  return {
    logs,
    loading,
    filters,
    setFilters,
    loadAuditLogs,
    exportLogs
  };
};

// Componente de Dashboard de Auditoria
export const AuditDashboard: React.FC = () => {
  const { logs, loading, filters, setFilters, loadAuditLogs, exportLogs } = useAuditLogs();
  const { hasPermission } = usePermissions();

  useEffect(() => {
    if (hasPermission('admin', 'read')) {
      loadAuditLogs();
    }
  }, [hasPermission, loadAuditLogs]);

  const getActionBadge = (action: AuditAction) => {
    const actionColors = {
      create_funnel: 'bg-green-100 text-green-800',
      update_funnel: 'bg-blue-100 text-blue-800',
      delete_funnel: 'bg-red-100 text-red-800',
      publish_funnel: 'bg-purple-100 text-purple-800',
      view_funnel: 'bg-gray-100 text-gray-800',
      login: 'bg-green-100 text-green-800',
      logout: 'bg-gray-100 text-gray-800'
    };

    return (
      <Badge className={actionColors[action] || 'bg-gray-100 text-gray-800'}>
        {action.replace('_', ' ')}
      </Badge>
    );
  };

  if (!hasPermission('admin', 'read')) {
    return (
      <div className="p-6 text-center">
        <Shield className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <p className="text-gray-600">Você não tem permissão para visualizar logs de auditoria.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Logs de Auditoria</h1>
          <p className="text-gray-600">Histórico completo de atividades do sistema</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => exportLogs('csv')}>
            <Download className="h-4 w-4 mr-2" />
            Exportar CSV
          </Button>
          <Button variant="outline" onClick={() => loadAuditLogs()}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Atualizar
          </Button>
        </div>
      </div>

      {/* Filtros */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filtros
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Ação</label>
              <Select
                value={filters.action || ''}
                onValueChange={(value) => setFilters(prev => ({ 
                  ...prev, 
                  action: value as AuditAction || undefined 
                }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Todas as ações" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Todas as ações</SelectItem>
                  <SelectItem value="create_funnel">Criar Funil</SelectItem>
                  <SelectItem value="update_funnel">Atualizar Funil</SelectItem>
                  <SelectItem value="delete_funnel">Excluir Funil</SelectItem>
                  <SelectItem value="publish_funnel">Publicar Funil</SelectItem>
                  <SelectItem value="view_funnel">Visualizar Funil</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Tipo de Recurso</label>
              <Select
                value={filters.resourceType || ''}
                onValueChange={(value) => setFilters(prev => ({ 
                  ...prev, 
                  resourceType: value || undefined 
                }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Todos os tipos" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Todos os tipos</SelectItem>
                  <SelectItem value="funnel">Funil</SelectItem>
                  <SelectItem value="user">Usuário</SelectItem>
                  <SelectItem value="system">Sistema</SelectItem>
                  <SelectItem value="analytics">Analytics</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Data Início</label>
              <Input
                type="date"
                value={filters.dateRange.start.toISOString().split('T')[0]}
                onChange={(e) => setFilters(prev => ({
                  ...prev,
                  dateRange: {
                    ...prev.dateRange,
                    start: new Date(e.target.value)
                  }
                }))}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Data Fim</label>
              <Input
                type="date"
                value={filters.dateRange.end.toISOString().split('T')[0]}
                onChange={(e) => setFilters(prev => ({
                  ...prev,
                  dateRange: {
                    ...prev.dateRange,
                    end: new Date(e.target.value)
                  }
                }))}
              />
            </div>
          </div>

          <div className="mt-4">
            <Button onClick={() => loadAuditLogs()}>
              <Search className="h-4 w-4 mr-2" />
              Aplicar Filtros
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Tabela de Logs */}
      <Card>
        <CardHeader>
          <CardTitle>Registros de Atividade</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8">
              <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-4 text-gray-400" />
              <p className="text-gray-600">Carregando logs...</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Data/Hora</TableHead>
                  <TableHead>Usuário</TableHead>
                  <TableHead>Ação</TableHead>
                  <TableHead>Recurso</TableHead>
                  <TableHead>IP</TableHead>
                  <TableHead>Detalhes</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {logs.map((log) => (
                  <TableRow key={log.id}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-gray-400" />
                        <div>
                          <div className="font-medium">
                            {log.timestamp.toLocaleDateString()}
                          </div>
                          <div className="text-sm text-gray-600">
                            {log.timestamp.toLocaleTimeString()}
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Users className="h-4 w-4 text-gray-400" />
                        <span>{log.userEmail}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      {getActionBadge(log.action)}
                    </TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium">{log.resourceType}</div>
                        {log.resourceId && (
                          <div className="text-sm text-gray-600">
                            ID: {log.resourceId}
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="font-mono text-sm">
                      {log.ipAddress}
                    </TableCell>
                    <TableCell>
                      {log.details && (
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <Eye className="h-4 w-4" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Detalhes da Ação</DialogTitle>
                            </DialogHeader>
                            <div className="space-y-4">
                              <div>
                                <h4 className="font-medium mb-2">Informações</h4>
                                <p className="text-sm text-gray-600">{log.details}</p>
                              </div>
                              {log.oldData && (
                                <div>
                                  <h4 className="font-medium mb-2">Dados Anteriores</h4>
                                  <pre className="text-xs bg-gray-100 p-2 rounded overflow-auto">
                                    {JSON.stringify(log.oldData, null, 2)}
                                  </pre>
                                </div>
                              )}
                              {log.newData && (
                                <div>
                                  <h4 className="font-medium mb-2">Novos Dados</h4>
                                  <pre className="text-xs bg-gray-100 p-2 rounded overflow-auto">
                                    {JSON.stringify(log.newData, null, 2)}
                                  </pre>
                                </div>
                              )}
                            </div>
                          </DialogContent>
                        </Dialog>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}

          {!loading && logs.length === 0 && (
            <div className="text-center py-8">
              <Search className="h-8 w-8 mx-auto mb-4 text-gray-400" />
              <p className="text-gray-600">Nenhum log encontrado com os filtros aplicados.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default usePermissions;
