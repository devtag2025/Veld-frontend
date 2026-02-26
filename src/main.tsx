import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { initGlitchTip, Sentry } from "@/lib/glitchtip";
import ReactQueryProvider from "./lib/react-query-provider";
import ToastProvider from "./lib/toast-provider";
import { useAuthStore } from "@/stores/auth.store";
import "@/index.css";

initGlitchTip();

// Restore auth state from localStorage on app startup
useAuthStore.getState().initAuth();

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ReactQueryProvider>
      <ToastProvider />
      <Sentry.ErrorBoundary fallback={<div>Something went wrong</div>}>
        <App />
      </Sentry.ErrorBoundary>
    </ReactQueryProvider>
  </React.StrictMode>,
);
