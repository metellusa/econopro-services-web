export default function Container({ children, className = "", as: Tag = "div" }) {
  return (
    <Tag className={["mx-auto w-full max-w-7xl px-6 lg:px-8", className].filter(Boolean).join(" ")}>
      {children}
    </Tag>
  );
}
