import { Star } from "lucide-react";

export default function ReviewCard({ quote, name, location, rating = 5 }) {
  return (
    <article className="flex h-full flex-col rounded-card border border-brand-border/80 bg-white p-6 shadow-card">
      <div className="flex gap-1 text-brand-gold" aria-label={`${rating} out of 5 stars`}>
        {Array.from({ length: rating }).map((_, index) => (
          <Star key={index} size={16} fill="currentColor" aria-hidden="true" />
        ))}
      </div>
      <p className="mt-4 flex-1 text-sm leading-7 text-slate-700">“{quote}”</p>
      <div className="mt-5">
        <p className="text-sm font-semibold text-brand-navy">{name}</p>
        {location ? <p className="mt-1 text-xs text-brand-muted">{location}</p> : null}
      </div>
    </article>
  );
}
