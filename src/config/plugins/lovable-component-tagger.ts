/**
 * 🚫 PLUGIN DESATIVADO - Lovable integration removed
 * 
 * Este plugin foi desativado como parte da remoção da integração
 * com a plataforma Lovable.
 * 
 * @deprecated Lovable integration has been disabled
 */
import { Plugin } from 'vite';

export function componentTagger(): Plugin {
  return {
    name: 'lovable-component-tagger-disabled',
    // No-op plugin - does nothing
    transform() {
      return null;
    },
  };
}
