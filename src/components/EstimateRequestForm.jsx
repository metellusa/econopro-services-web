import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Button from "./ui/Button";
import { FormField } from "./ui/FormControls";
import { COMPANY } from "../data/site";
import { trackEvent, AnalyticsEvents } from "../lib/analytics";

export const PROJECT_TYPES = [
  "Flooring Installation",
  "Flooring Repair",
  "Drywall Installation",
  "Drywall Repair",
  "Interior Painting",
  "Exterior Painting",
  "Interior Design",
  "Property Maintenance",
  "Other",
];

export const TIME_WINDOWS = [
  "8:00 AM - 10:00 AM",
  "10:00 AM - 12:00 PM",
  "12:00 PM - 2:00 PM",
  "2:00 PM - 4:00 PM",
  "4:00 PM - 6:00 PM",
  "6:00 PM - 8:00 PM",
];

export default function EstimateRequestForm({
  idPrefix = "estimate",
  onSuccess,
  className = "",
  buttonVariant = "secondary",
  compact = false,
}) {
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setSubmitting(true);

    const form = event.target;
    const formData = new FormData(form);

    try {
      const response = await fetch("/", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams(formData).toString(),
      });

      if (!response.ok) {
        throw new Error("Form submission failed");
      }

      trackEvent(AnalyticsEvents.ESTIMATE_SUBMITTED);

      if (onSuccess) {
        onSuccess();
      }

      navigate("/thank-you");
    } catch {
      setError(
        "Something went wrong submitting your request. Please try again or call us."
      );
      setSubmitting(false);
    }
  }

  return (
    <form
      name="onsite-estimate"
      method="POST"
      data-netlify="true"
      netlify-honeypot="bot-field"
      onSubmit={handleSubmit}
      className={["space-y-5", className].filter(Boolean).join(" ")}
    >
      <input type="hidden" name="form-name" value="onsite-estimate" />
      <input type="hidden" name="serviceType" value="Onsite Estimate" />
      <p className="hidden">
        <label>
          Don’t fill this out if you’re human: <input name="bot-field" />
        </label>
      </p>

      <div className="grid gap-5 sm:grid-cols-2">
        <FormField
          label="Full Name"
          name="fullName"
          id={`${idPrefix}-fullName`}
          required
          placeholder="Your full name"
        />
        <FormField
          label="Phone Number"
          name="phone"
          id={`${idPrefix}-phone`}
          type="tel"
          required
          placeholder="(555) 555-5555"
        />
      </div>

      <FormField
        label="Email Address"
        name="email"
        id={`${idPrefix}-email`}
        type="email"
        required
        placeholder="you@example.com"
      />

      <FormField
        label="Project Type"
        name="projectType"
        id={`${idPrefix}-projectType`}
        as="select"
        required
        defaultValue=""
      >
        <option value="" disabled>
          Select a project type
        </option>
        {PROJECT_TYPES.map((type) => (
          <option key={type}>{type}</option>
        ))}
      </FormField>

      <FormField
        label="Project Address"
        name="address"
        id={`${idPrefix}-address`}
        required
        placeholder="Street address"
      />

      <div className="grid gap-5 sm:grid-cols-2">
        <FormField
          label="Preferred Date"
          name="preferredDate"
          id={`${idPrefix}-preferredDate`}
          type="date"
          required
        />
        <FormField
          label="Preferred Time Window"
          name="preferredTime"
          id={`${idPrefix}-preferredTime`}
          as="select"
          required
          defaultValue=""
          hint={compact ? undefined : "Business hours: Mon–Fri 8am–8pm, Sat 8am–5pm"}
        >
          <option value="" disabled>
            Select a time window
          </option>
          {TIME_WINDOWS.map((window) => (
            <option key={window}>{window}</option>
          ))}
        </FormField>
      </div>

      <FormField
        label="Project Details"
        name="projectDetails"
        id={`${idPrefix}-projectDetails`}
        as="textarea"
        required
        rows={compact ? "4" : "5"}
        placeholder="Tell us about the scope, rooms, timeline, or anything else we should know."
      />

      {error ? (
        <div
          className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
          role="alert"
        >
          {error}{" "}
          <a href={`tel:${COMPANY.phoneTel}`} className="font-semibold underline">
            {COMPANY.phoneDisplay}
          </a>
        </div>
      ) : null}

      <Button
        type="submit"
        variant={buttonVariant}
        size="lg"
        className="w-full"
        disabled={submitting}
      >
        {submitting ? "Submitting…" : "Submit Estimate Request"}
      </Button>
    </form>
  );
}
