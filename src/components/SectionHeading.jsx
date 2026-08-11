import SectionEyebrow from "./ui/SectionEyebrow";

export default function SectionHeading({
  eyebrow,
  title,
  description,
  centered = false,
  as: TitleTag = "h2",
  tone = "light",
}) {
  const isDark = tone === "dark";

  return (
    <div className={centered ? "mx-auto max-w-3xl text-center" : "max-w-3xl"}>
      {eyebrow ? (
        <SectionEyebrow tone={isDark ? "white" : "gold"} className="mb-3">
          {eyebrow}
        </SectionEyebrow>
      ) : null}
      <TitleTag
        className={[
          "font-display text-display-md text-balance",
          isDark ? "text-white" : "text-brand-navy",
        ].join(" ")}
      >
        {title}
      </TitleTag>
      {description ? (
        <p
          className={[
            "mt-4 text-base leading-7 sm:text-lg sm:leading-8",
            isDark ? "text-slate-300" : "text-brand-muted",
          ].join(" ")}
        >
          {description}
        </p>
      ) : null}
    </div>
  );
}
