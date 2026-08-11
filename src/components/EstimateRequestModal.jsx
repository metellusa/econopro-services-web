import { X } from "lucide-react";
import EstimateRequestForm from "./EstimateRequestForm";
import { useEffect, useRef } from "react";

export default function EstimateRequestModal({ open, onClose }) {
  const closeButtonRef = useRef(null);

  useEffect(() => {
    if (!open) return;
    closeButtonRef.current?.focus();
  }, [open]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[120] flex items-end justify-center bg-black/60 p-0 backdrop-blur-sm sm:items-center sm:p-6"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="estimate-modal-title"
    >
      <div
        className="flex max-h-[92vh] w-full max-w-2xl flex-col overflow-hidden rounded-t-[1.75rem] bg-white shadow-soft sm:rounded-section"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-4 border-b border-brand-border px-5 py-4 sm:px-8 sm:py-5">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand-gold">
              Request an Estimate
            </p>
            <h2
              id="estimate-modal-title"
              className="mt-2 font-display text-2xl font-semibold text-brand-navy"
            >
              Tell us about your project
            </h2>
            <p className="mt-2 text-sm leading-6 text-brand-muted">
              We’ll review your request and follow up to confirm the details.
            </p>
          </div>
          <button
            ref={closeButtonRef}
            type="button"
            onClick={onClose}
            className="rounded-full border border-brand-border bg-brand-cream p-2 text-brand-navy transition hover:bg-white"
            aria-label="Close estimate form"
          >
            <X size={20} aria-hidden="true" />
          </button>
        </div>

        <div className="overflow-y-auto px-5 py-5 sm:px-8 sm:py-6">
          <EstimateRequestForm
            idPrefix="modal-estimate"
            compact
            onSuccess={onClose}
            buttonVariant="primary"
          />
        </div>
      </div>
    </div>
  );
}
