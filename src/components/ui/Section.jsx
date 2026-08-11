export default function Section({
  children,
  className = "",
  tone = "cream",
  as: Tag = "section",
}) {
  const tones = {
    cream: "bg-brand-cream",
    white: "bg-white",
    navy: "bg-brand-navy text-white",
    muted: "bg-brand-cream-dark",
  };

  return (
    <Tag className={["py-16 sm:py-20", tones[tone] || tones.cream, className].filter(Boolean).join(" ")}>
      {children}
    </Tag>
  );
}
