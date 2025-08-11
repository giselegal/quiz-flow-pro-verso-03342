import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import ClientLayout from "./components/ClientLayout";
import "./index.css";

console.log("🚀 Bypass mode initialized");

createRoot(document.getElementById("root")).render(
  <ClientLayout>
    <App />
  </ClientLayout>
);