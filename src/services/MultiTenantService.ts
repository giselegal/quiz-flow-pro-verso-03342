/**
 * 🏗️ MULTI-TENANT ARCHITECTURE - Enterprise Service
 * ROI Projetado: $8k-20k/mês
 */

export interface TenantConfig {
  id: string;
  name: string;
  domain: string;
  brandColors: {
    primary: string;
    secondary: string;
    accent: string;
  };
  features: {
    aiPersonalization: boolean;
    advancedAnalytics: boolean;
    whiteLabel: boolean;
    customIntegrations: boolean;
  };
  limits: {
    maxUsers: number;
    maxFunnels: number;
    maxStorageGB: number;
  };
  billing: {
    plan: 'starter' | 'professional' | 'enterprise';
    monthlyRevenue: number;
    users: number;
  };
}

export class MultiTenantService {
  private static instance: MultiTenantService;
  private tenants: Map<string, TenantConfig> = new Map();

  static getInstance(): MultiTenantService {
    if (!MultiTenantService.instance) {
      MultiTenantService.instance = new MultiTenantService();
    }
    return MultiTenantService.instance;
  }

  // 🏢 GESTÃO DE TENANTS
  async createTenant(config: Omit<TenantConfig, 'id'>): Promise<TenantConfig> {
    const tenant: TenantConfig = {
      id: `tenant-${Date.now()}`,
      ...config
    };

    this.tenants.set(tenant.id, tenant);

    console.log('🏢 Novo tenant criado:', {
      id: tenant.id,
      name: tenant.name,
      plan: tenant.billing.plan,
      projectedRevenue: tenant.billing.monthlyRevenue
    });

    return tenant;
  }

  async getTenant(tenantId: string): Promise<TenantConfig | null> {
    return this.tenants.get(tenantId) || null;
  }

  async getTenantByDomain(domain: string): Promise<TenantConfig | null> {
    for (const tenant of this.tenants.values()) {
      if (tenant.domain === domain) {
        return tenant;
      }
    }
    return null;
  }

  // 🎨 CUSTOMIZAÇÃO POR TENANT
  getThemeForTenant(tenantId: string): any {
    const tenant = this.tenants.get(tenantId);
    if (!tenant) return this.getDefaultTheme();

    return {
      colors: {
        primary: tenant.brandColors.primary,
        secondary: tenant.brandColors.secondary,
        accent: tenant.brandColors.accent,
      },
      features: tenant.features,
      whiteLabel: tenant.features.whiteLabel
    };
  }

  // 📊 ANALYTICS POR TENANT
  getTenantAnalytics(tenantId: string) {
    const tenant = this.tenants.get(tenantId);
    if (!tenant) return null;

    return {
      revenue: tenant.billing.monthlyRevenue,
      users: tenant.billing.users,
      plan: tenant.billing.plan,
      utilizacao: {
        users: (tenant.billing.users / tenant.limits.maxUsers) * 100,
        storage: 65, // Simulado
        funnels: 45  // Simulado
      },
      roi: this.calculateTenantROI(tenant)
    };
  }

  private calculateTenantROI(tenant: TenantConfig): number {
    const baseROI = tenant.billing.monthlyRevenue * 0.3; // 30% margin base
    const featureMultiplier = Object.values(tenant.features).filter(Boolean).length * 0.1;
    return Math.round(baseROI * (1 + featureMultiplier));
  }

  private getDefaultTheme() {
    return {
      colors: {
        primary: '#B89B7A',
        secondary: '#432818',
        accent: '#8F7A6A'
      },
      features: {
        aiPersonalization: false,
        advancedAnalytics: false,
        whiteLabel: false,
        customIntegrations: false
      }
    };
  }

  // 🚀 FEATURE FLAGS POR TENANT
  hasFeature(tenantId: string, feature: keyof TenantConfig['features']): boolean {
    const tenant = this.tenants.get(tenantId);
    return tenant?.features[feature] || false;
  }

  // 📈 MÉTRICAS AGREGADAS
  getGlobalMetrics() {
    const tenants = Array.from(this.tenants.values());
    
    return {
      totalTenants: tenants.length,
      totalRevenue: tenants.reduce((sum, t) => sum + t.billing.monthlyRevenue, 0),
      totalUsers: tenants.reduce((sum, t) => sum + t.billing.users, 0),
      planDistribution: {
        starter: tenants.filter(t => t.billing.plan === 'starter').length,
        professional: tenants.filter(t => t.billing.plan === 'professional').length,
        enterprise: tenants.filter(t => t.billing.plan === 'enterprise').length,
      },
      avgRevenuePerTenant: tenants.length > 0 
        ? Math.round(tenants.reduce((sum, t) => sum + t.billing.monthlyRevenue, 0) / tenants.length)
        : 0
    };
  }
}

// 🎯 TENANT CONTEXT HOOK
export const useTenant = () => {
  const service = MultiTenantService.getInstance();
  
  const getCurrentTenant = async (): Promise<TenantConfig | null> => {
    const domain = window.location.hostname;
    return await service.getTenantByDomain(domain);
  };

  return {
    service,
    getCurrentTenant,
  };
};