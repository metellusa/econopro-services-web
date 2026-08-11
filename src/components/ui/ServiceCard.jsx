import { Link } from "react-router-dom";

export default function ServiceCard({
  icon: Icon,
  title,
  description,
  bullets = [],
  image,
  href,
  to,
  linkLabel = "Learn More",
}) {
  const content = (
    <>
      {image ? (
        <div className="aspect-[4/3] overflow-hidden rounded-2xl bg-brand-cream-dark">
          <img
            src={image}
            alt=""
            className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
            loading="lazy"
          />
        </div>
      ) : Icon ? (
        <div className="mb-5 inline-flex rounded-2xl bg-brand-cream p-3 text-brand-navy">
          <Icon size={24} strokeWidth={2} aria-hidden="true" />
        </div>
      ) : null}

      <div className={image ? "mt-5" : ""}>
        <h3 className="font-display text-xl font-semibold text-brand-navy">{title}</h3>
        {description ? (
          <p className="mt-3 text-sm leading-7 text-brand-muted">{description}</p>
        ) : null}

        {bullets.length ? (
          <ul className="mt-5 space-y-2 text-sm text-slate-700">
            {bullets.map((bullet) => (
              <li key={bullet} className="flex items-start gap-3">
                <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-brand-gold" aria-hidden="true" />
                <span>{bullet}</span>
              </li>
            ))}
          </ul>
        ) : null}

        {to || href ? (
          <p className="mt-5 text-sm font-semibold text-brand-navy">
            {linkLabel}
            <span aria-hidden="true"> →</span>
          </p>
        ) : null}
      </div>
    </>
  );

  const className =
    "group flex h-full flex-col rounded-card border border-brand-border/80 bg-white p-6 shadow-card transition duration-300 hover:-translate-y-1 hover:shadow-soft sm:p-7";

  if (to) {
    return (
      <Link to={to} className={className}>
        {content}
      </Link>
    );
  }

  if (href) {
    return (
      <a href={href} className={className}>
        {content}
      </a>
    );
  }

  return <div className={className}>{content}</div>;
}
