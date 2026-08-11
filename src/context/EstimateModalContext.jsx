import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import EstimateRequestModal from "../components/EstimateRequestModal";
import { trackEvent, AnalyticsEvents } from "../lib/analytics";

const EstimateModalContext = createContext(null);

export function EstimateModalProvider({ children }) {
  const [isOpen, setIsOpen] = useState(false);

  const openEstimateModal = useCallback((source = "modal") => {
    trackEvent(AnalyticsEvents.ESTIMATE_STARTED, { source });
    setIsOpen(true);
  }, []);
  const closeEstimateModal = useCallback(() => setIsOpen(false), []);

  useEffect(() => {
    if (!isOpen) return undefined;

    const onKeyDown = (event) => {
      if (event.key === "Escape") closeEstimateModal();
    };

    document.addEventListener("keydown", onKeyDown);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [isOpen, closeEstimateModal]);

  const value = useMemo(
    () => ({
      isOpen,
      openEstimateModal,
      closeEstimateModal,
    }),
    [isOpen, openEstimateModal, closeEstimateModal]
  );

  return (
    <EstimateModalContext.Provider value={value}>
      {children}
      <EstimateRequestModal open={isOpen} onClose={closeEstimateModal} />
    </EstimateModalContext.Provider>
  );
}

export function useEstimateModal() {
  const context = useContext(EstimateModalContext);
  if (!context) {
    throw new Error("useEstimateModal must be used within EstimateModalProvider");
  }
  return context;
}
