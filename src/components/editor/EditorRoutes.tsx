import React from 'react';
import { Route, Switch } from 'wouter';
import EditorSimpleLoader from './EditorSimpleLoader';

/**
 * Rotas do editor simplificadas
 */
export const EditorRoutes: React.FC = () => {
  return (
    <Switch>
      <Route path="/editor/:funnelId?" component={EditorSimpleLoader} />
      <Route path="/editor" component={EditorSimpleLoader} />
    </Switch>
  );
};

export default EditorRoutes;