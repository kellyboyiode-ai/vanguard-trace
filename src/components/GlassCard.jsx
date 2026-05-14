export default function GlassCard({
  title,
  eyebrow,
  children,
  className = '',
}) {
  return (
    <section className={`vt-glass-card ${className}`.trim()}>
      {(eyebrow || title) && (
        <header className="vt-glass-card-header">
          {eyebrow ? <p>{eyebrow}</p> : null}
          {title ? <h3>{title}</h3> : null}
        </header>
      )}
      {children}
    </section>
  );
}
