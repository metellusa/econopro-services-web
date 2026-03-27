export default function ServiceCard({ icon: Icon, title, description, bullets = [] }) {
  return (
    <div className="h-full rounded-3xl border border-white/60 bg-white p-7 shadow-soft transition duration-300 hover:-translate-y-1">
      <div className="mb-5 inline-flex rounded-2xl bg-brand-cream p-3 text-brand-navy">
        <Icon size={24} strokeWidth={2} />
      </div>
      <h3 className="text-xl font-semibold text-brand-navy">{title}</h3>
      <p className="mt-3 text-sm leading-7 text-slate-600">{description}</p>
      {bullets.length ? (
        <ul className="mt-5 space-y-2 text-sm text-slate-700">
          {bullets.map((bullet) => (
            <li key={bullet} className="flex items-start gap-3">
              <span className="mt-2 h-2 w-2 rounded-full bg-brand-gold" />
              <span>{bullet}</span>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  )
}
