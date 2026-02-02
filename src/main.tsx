import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { initGlitchTip, Sentry } from "@/lib/glitchtip";

initGlitchTip();

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Sentry.ErrorBoundary fallback={<div>Something went wrong</div>}>
      <App />
    </Sentry.ErrorBoundary>
  </React.StrictMode>
);
