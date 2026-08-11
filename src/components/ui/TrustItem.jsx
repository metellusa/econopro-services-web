export default function TrustItem({ icon: Icon, title, description }) {
  return (
    <div className="flex items-start gap-3 sm:items-center sm:gap-4">
      {Icon ? (
        <div className="inline-flex shrink-0 rounded-xl bg-brand-cream p-2.5 text-brand-navy">
          <Icon size={18} aria-hidden="true" />
        </div>
      ) : null}
      <div>
        <p className="text-sm font-semibold text-brand-navy">{title}</p>
        {description ? (
          <p className="mt-1 text-xs leading-5 text-brand-muted sm:text-sm">{description}</p>
        ) : null}
      </div>
    </div>
  );
}
