import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

<<<<<<< HEAD
=======
// Filtro de segurança para scripts externos (deve ser carregado primeiro)
import "./utils/scriptFilter";

// Otimizações de performance para desenvolvimento
import "./utils/devPerformanceOptimizer";

>>>>>>> 4b302df3f2fec3830224ffaa384a8925ca4412e3
console.log('🚀 Aplicação iniciando...');

createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
