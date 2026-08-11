export default function SectionEyebrow({ children, className = "", tone = "gold" }) {
  const tones = {
    gold: "text-brand-gold",
    white: "text-brand-gold-soft",
    navy: "text-brand-navy",
  };

  return (
    <p
      className={[
        "text-xs font-semibold uppercase tracking-[0.18em] sm:text-sm",
        tones[tone] || tones.gold,
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {children}
    </p>
  );
}
