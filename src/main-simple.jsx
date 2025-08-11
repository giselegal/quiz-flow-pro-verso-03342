import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App.bypass";
import ClientLayout from "./components/ClientLayout";
import "./index.css";

console.log("🚀 Simple bypass mode - TypeScript TS6310 bypassed");

createRoot(document.getElementById("root")).render(
  <ClientLayout>
    <App />
  </ClientLayout>
);