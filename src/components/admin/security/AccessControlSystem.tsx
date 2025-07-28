
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card';
import { Button } from '../../ui/button';
import { Badge } from '../../ui/badge';
import { Input } from '../../ui/input';
import { Label } from '../../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../ui/select';
import { Switch } from '../../ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../ui/tabs';
import { supabase } from '@/integrations/supabase/client';
import { Users, Shield, Key, Activity, AlertTriangle, CheckCircle } from 'lucide-react';

interface User {
  id: string;
  email: string;
  role: string;
  funnel_permissions: string[];
  analytics_permissions: string[];
  admin_permissions: string[];
  last_login: string;
  status: 'active' | 'inactive' | 'suspended';
}

interface AuditLog {
  id: string;
  user_id: string;
  user_email: string;
  action: string;
  resource: string;
  timestamp: string;
  ip_address: string;
  user_agent: string;
}

const AccessControlSystem: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [newUserEmail, setNewUserEmail] = useState('');
  const [newUserRole, setNewUserRole] = useState('viewer');

  useEffect(() => {
    fetchUsers();
    fetchAuditLogs();
  }, []);

  const fetchUsers = async () => {
    try {
      // Since we don't have a user_permissions table, we'll use mock data
      const mockUsers: User[] = [
        {
          id: '1',
          email: 'admin@example.com',
          role: 'admin',
          funnel_permissions: ['create', 'read', 'update', 'delete'],
          analytics_permissions: ['read', 'export'],
          admin_permissions: ['user_management', 'system_settings'],
          last_login: new Date().toISOString(),
          status: 'active'
        },
        {
          id: '2',
          email: 'editor@example.com',
          role: 'editor',
          funnel_permissions: ['create', 'read', 'update'],
          analytics_permissions: ['read'],
          admin_permissions: [],
          last_login: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
          status: 'active'
        },
        {
          id: '3',
          email: 'viewer@example.com',
          role: 'viewer',
          funnel_permissions: ['read'],
          analytics_permissions: ['read'],
          admin_permissions: [],
          last_login: new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString(),
          status: 'inactive'
        }
      ];

      setUsers(mockUsers);
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchAuditLogs = async () => {
    try {
      // Mock audit logs data
      const mockAuditLogs: AuditLog[] = [
        {
          id: '1',
          user_id: '1',
          user_email: 'admin@example.com',
          action: 'CREATE_FUNNEL',
          resource: 'funnel_123',
          timestamp: new Date().toISOString(),
          ip_address: '192.168.1.1',
          user_agent: 'Mozilla/5.0...'
        },
        {
          id: '2',
          user_id: '2',
          user_email: 'editor@example.com',
          action: 'UPDATE_FUNNEL',
          resource: 'funnel_456',
          timestamp: new Date(Date.now() - 60 * 60 * 1000).toISOString(),
          ip_address: '192.168.1.2',
          user_agent: 'Mozilla/5.0...'
        },
        {
          id: '3',
          user_id: '3',
          user_email: 'viewer@example.com',
          action: 'VIEW_ANALYTICS',
          resource: 'dashboard',
          timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
          ip_address: '192.168.1.3',
          user_agent: 'Mozilla/5.0...'
        }
      ];

      setAuditLogs(mockAuditLogs);
    } catch (error) {
      console.error('Error fetching audit logs:', error);
    }
  };

  const handleCreateUser = async () => {
    if (!newUserEmail || !newUserRole) return;

    const newUser: User = {
      id: Date.now().toString(),
      email: newUserEmail,
      role: newUserRole,
      funnel_permissions: newUserRole === 'admin' ? ['create', 'read', 'update', 'delete'] : ['read'],
      analytics_permissions: ['read'],
      admin_permissions: newUserRole === 'admin' ? ['user_management', 'system_settings'] : [],
      last_login: new Date().toISOString(),
      status: 'active'
    };

    setUsers([...users, newUser]);
    setNewUserEmail('');
    setNewUserRole('viewer');
  };

  const handleUpdateUserRole = async (userId: string, newRole: string) => {
    setUsers(users.map(user => 
      user.id === userId 
        ? { 
            ...user, 
            role: newRole,
            funnel_permissions: newRole === 'admin' ? ['create', 'read', 'update', 'delete'] : ['read'],
            admin_permissions: newRole === 'admin' ? ['user_management', 'system_settings'] : []
          }
        : user
    ));
  };

  const handleToggleUserStatus = async (userId: string) => {
    setUsers(users.map(user => 
      user.id === userId 
        ? { ...user, status: user.status === 'active' ? 'inactive' : 'active' }
        : user
    ));
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin': return 'bg-red-100 text-red-800';
      case 'editor': return 'bg-blue-100 text-blue-800';
      case 'viewer': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'inactive': return 'bg-yellow-100 text-yellow-800';
      case 'suspended': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Access Control System</h1>
        <Button onClick={() => window.location.reload()}>
          Refresh
        </Button>
      </div>

      <Tabs defaultValue="users" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="users">Users</TabsTrigger>
          <TabsTrigger value="permissions">Permissions</TabsTrigger>
          <TabsTrigger value="audit">Audit Logs</TabsTrigger>
        </TabsList>

        <TabsContent value="users" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Add New User</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="user@example.com"
                    value={newUserEmail}
                    onChange={(e) => setNewUserEmail(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="role">Role</Label>
                  <Select value={newUserRole} onValueChange={setNewUserRole}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="admin">Admin</SelectItem>
                      <SelectItem value="editor">Editor</SelectItem>
                      <SelectItem value="viewer">Viewer</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-end">
                  <Button onClick={handleCreateUser} className="w-full">
                    Add User
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Users</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {users.map((user) => (
                  <div key={user.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-4">
                      <div className="flex-shrink-0">
                        <Users className="h-8 w-8 text-muted-foreground" />
                      </div>
                      <div>
                        <h3 className="font-medium">{user.email}</h3>
                        <p className="text-sm text-muted-foreground">
                          Last login: {new Date(user.last_login).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className={getRoleColor(user.role)}>
                        {user.role}
                      </Badge>
                      <Badge className={getStatusColor(user.status)}>
                        {user.status}
                      </Badge>
                      <Select 
                        value={user.role} 
                        onValueChange={(value) => handleUpdateUserRole(user.id, value)}
                      >
                        <SelectTrigger className="w-32">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="admin">Admin</SelectItem>
                          <SelectItem value="editor">Editor</SelectItem>
                          <SelectItem value="viewer">Viewer</SelectItem>
                        </SelectContent>
                      </Select>
                      <Switch
                        checked={user.status === 'active'}
                        onCheckedChange={() => handleToggleUserStatus(user.id)}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="permissions" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Role Permissions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {['admin', 'editor', 'viewer'].map((role) => (
                  <div key={role} className="border rounded-lg p-4">
                    <h3 className="font-medium mb-3 capitalize">{role}</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <h4 className="text-sm font-medium mb-2">Funnel Permissions</h4>
                        <div className="space-y-2">
                          {['create', 'read', 'update', 'delete'].map((permission) => (
                            <div key={permission} className="flex items-center gap-2">
                              <input
                                type="checkbox"
                                id={`${role}-funnel-${permission}`}
                                checked={
                                  role === 'admin' || 
                                  (role === 'editor' && permission !== 'delete') ||
                                  (role === 'viewer' && permission === 'read')
                                }
                                disabled
                              />
                              <Label htmlFor={`${role}-funnel-${permission}`} className="text-sm">
                                {permission}
                              </Label>
                            </div>
                          ))}
                        </div>
                      </div>
                      <div>
                        <h4 className="text-sm font-medium mb-2">Analytics Permissions</h4>
                        <div className="space-y-2">
                          {['read', 'export'].map((permission) => (
                            <div key={permission} className="flex items-center gap-2">
                              <input
                                type="checkbox"
                                id={`${role}-analytics-${permission}`}
                                checked={
                                  role === 'admin' || 
                                  (permission === 'read')
                                }
                                disabled
                              />
                              <Label htmlFor={`${role}-analytics-${permission}`} className="text-sm">
                                {permission}
                              </Label>
                            </div>
                          ))}
                        </div>
                      </div>
                      <div>
                        <h4 className="text-sm font-medium mb-2">Admin Permissions</h4>
                        <div className="space-y-2">
                          {['user_management', 'system_settings'].map((permission) => (
                            <div key={permission} className="flex items-center gap-2">
                              <input
                                type="checkbox"
                                id={`${role}-admin-${permission}`}
                                checked={role === 'admin'}
                                disabled
                              />
                              <Label htmlFor={`${role}-admin-${permission}`} className="text-sm">
                                {permission.replace('_', ' ')}
                              </Label>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="audit" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Audit Logs</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {auditLogs.map((log) => (
                  <div key={log.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-4">
                      <div className="flex-shrink-0">
                        <Activity className="h-8 w-8 text-muted-foreground" />
                      </div>
                      <div>
                        <h3 className="font-medium">{log.user_email}</h3>
                        <p className="text-sm text-muted-foreground">
                          {log.action} on {log.resource}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(log.timestamp).toLocaleString()} • {log.ip_address}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary">
                        {log.action}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AccessControlSystem;
