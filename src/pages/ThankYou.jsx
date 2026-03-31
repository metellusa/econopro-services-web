import { CheckCircle2, Phone, Mail, ArrowRight } from "lucide-react";

export default function ThankYou() {
  return (
    <main className="min-h-[70vh] flex items-center justify-center bg-brand-cream px-6">
      <div className="max-w-xl text-center">
        {/* Icon */}
        <div className="flex justify-center">
          <div className="bg-white rounded-full p-4 shadow">
            <CheckCircle2 size={48} className="text-green-500" />
          </div>
        </div>

        {/* Heading */}
        <h1 className="mt-6 text-4xl font-bold text-brand-navy">
          Request Received
        </h1>

        {/* Message */}
        <p className="mt-4 text-lg text-slate-600">
          Thanks for reaching out to EconoPro Services. Your request has been
          successfully submitted.
        </p>

        <p className="mt-2 text-lg text-slate-600">
          We’ll review your details and follow up with you shortly to confirm
          your appointment.
        </p>

        {/* Expectation */}
        <div className="mt-8 bg-white rounded-2xl p-6 shadow-sm">
          <p className="text-sm text-slate-500">
            What happens next?
          </p>
          <ul className="mt-3 space-y-2 text-left text-slate-700">
            <li>• We review your request</li>
            <li>• We contact you to confirm details</li>
            <li>• We schedule your appointment</li>
          </ul>
        </div>

        {/* Contact fallback */}
        <div className="mt-8 space-y-3 text-sm text-slate-600">
          <p>If your request is urgent, feel free to reach out directly:</p>

          <div className="flex flex-col items-center gap-2">
            <div className="flex items-center gap-2">
              <Phone size={16} />
              <span>(813) 362-9287</span>
            </div>
            <div className="flex items-center gap-2">
              <Mail size={16} />
              <span>admin@econoproservices.com</span>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="mt-10 flex justify-center gap-4">
          <a
            href="/"
            className="px-6 py-3 rounded-full border font-semibold"
          >
            Back to Home
          </a>

          <a
            href="/services"
            className="px-6 py-3 rounded-full bg-brand-navy text-white font-semibold flex items-center"
          >
            View Services
            <ArrowRight size={16} className="ml-2" />
          </a>
        </div>
      </div>
    </main>
  );
}
