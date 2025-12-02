import { funnelService } from '@/services/canonical/FunnelService';

export type ServiceMap = {
  funnelService: typeof funnelService;
};

class ServiceRegistryImpl {
  private services: ServiceMap;

  constructor() {
    this.services = {
      funnelService,
    };
  }

  get<K extends keyof ServiceMap>(key: K): ServiceMap[K] {
    return this.services[key];
  }
}

export const ServiceRegistry = new ServiceRegistryImpl();
