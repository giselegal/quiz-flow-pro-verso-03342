import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

// Filtro de segurança para scripts externos (deve ser carregado primeiro)
import "./utils/scriptFilter";

// Otimizações de performance para desenvolvimento
import "./utils/devPerformanceOptimizer";

console.log('🚀 Aplicação iniciando...');

createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
