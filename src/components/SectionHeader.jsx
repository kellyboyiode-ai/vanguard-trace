export default function SectionHeader({
  title,
  subtitle,
  className = 'panel-header',
}) {
  return (
    <header className={className}>
      <h2>{title}</h2>
      {subtitle ? <p>{subtitle}</p> : null}
    </header>
  );
}
