import * as Sentry from "@sentry/react";

export function initGlitchTip() {
  Sentry.init({
    dsn: import.meta.env.VITE_GLITCHTIP_DSN,
    environment: import.meta.env.MODE,
    tracesSampleRate: 1.0,
  });
}

export { Sentry };
