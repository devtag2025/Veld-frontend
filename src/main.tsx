import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { initGlitchTip, Sentry } from "@/lib/glitchtip";
import ReactQueryProvider from "./lib/react-query-provider";
import ToastProvider from "./lib/toast-provider";
import "@/index.css";

initGlitchTip();

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ReactQueryProvider>
      <ToastProvider />
    <Sentry.ErrorBoundary fallback={<div>Something went wrong</div>}>
      <App />
    </Sentry.ErrorBoundary>
    </ReactQueryProvider>
  </React.StrictMode>
);
