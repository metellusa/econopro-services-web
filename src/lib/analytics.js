/**
 * Lightweight analytics abstraction.
 * Wire a real provider ID later. Do not invent credentials.
 */
export function trackEvent(eventName, payload = {}) {
  if (!eventName) return;

  const detail = { event: eventName, ...payload, timestamp: Date.now() };

  if (typeof window === "undefined") return;

  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push(detail);

  if (typeof window.gtag === "function") {
    window.gtag("event", eventName, payload);
  }

  if (import.meta.env.DEV) {
    // Helpful during local QA; no network calls.
    console.info("[analytics]", eventName, payload);
  }
}

export const AnalyticsEvents = {
  ESTIMATE_STARTED: "estimate_started",
  ESTIMATE_SUBMITTED: "estimate_submitted",
  CLEANING_REQUEST_STARTED: "cleaning_request_started",
  CLEANING_REQUEST_SUBMITTED: "cleaning_request_submitted",
  PHONE_CLICKED: "phone_clicked",
  FINANCING_CLICKED: "financing_clicked",
  PROJECT_CTA_CLICKED: "project_cta_clicked",
  SERVICE_CTA_CLICKED: "service_cta_clicked",
};
