export default function OptimizedImage({
  src,
  alt = "",
  className = "",
  loading = "lazy",
  decoding = "async",
  width,
  height,
  ...props
}) {
  if (!src) return null;

  const webpSrc = src.replace(/\.(png|jpe?g)$/i, ".webp");
  const hasWebpCandidate = webpSrc !== src;

  return (
    <picture>
      {hasWebpCandidate ? (
        <source srcSet={webpSrc} type="image/webp" />
      ) : null}
      <img
        src={src}
        alt={alt}
        className={className}
        loading={loading}
        decoding={decoding}
        width={width}
        height={height}
        {...props}
      />
    </picture>
  );
}
