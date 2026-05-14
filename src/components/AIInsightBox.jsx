import { Sparkles, TriangleAlert } from 'lucide-react';

export default function AIInsightBox({ title = 'AI Insight', line, severity = 'info' }) {
  const isWarning = severity === 'warning';

  return (
    <article className={isWarning ? 'vt-ai-insight is-warning' : 'vt-ai-insight'}>
      <header>
        {isWarning ? (
          <TriangleAlert size={15} aria-hidden="true" />
        ) : (
          <Sparkles size={15} aria-hidden="true" />
        )}
        <strong>{title}</strong>
      </header>
      <p>{line}</p>
    </article>
  );
}
