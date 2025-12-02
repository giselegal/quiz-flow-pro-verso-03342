import { funnelService as canonicalFunnelService } from '@/services/canonical/FunnelService';
import { funnelService as editorFunnelService } from '@/services/funnel/FunnelService';

export type ServiceMap = {
  funnelService: typeof canonicalFunnelService;
  editorFunnelService: typeof editorFunnelService;
};

class ServiceRegistryImpl {
  private services: ServiceMap;

  constructor() {
    this.services = {
      funnelService: canonicalFunnelService,
      editorFunnelService,
    };
  }

  get<K extends keyof ServiceMap>(key: K): ServiceMap[K] {
    return this.services[key];
  }
}

export const ServiceRegistry = new ServiceRegistryImpl();
