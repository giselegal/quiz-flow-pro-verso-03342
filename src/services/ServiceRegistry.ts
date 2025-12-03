import { funnelServiceCompat } from '@/services/adapters/FunnelServiceCompatAdapter';
import { funnelService as editorFunnelService } from '@/services/funnel/FunnelService';

export type ServiceMap = {
  funnelService: typeof funnelServiceCompat;
  editorFunnelService: typeof editorFunnelService;
};

class ServiceRegistryImpl {
  private services: ServiceMap;

  constructor() {
    this.services = {
      funnelService: funnelServiceCompat,
      editorFunnelService,
    };
  }

  get<K extends keyof ServiceMap>(key: K): ServiceMap[K] {
    return this.services[key];
  }
}

export const ServiceRegistry = new ServiceRegistryImpl();
