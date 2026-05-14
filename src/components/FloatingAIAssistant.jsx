import { Bot, Sparkles, X } from 'lucide-react';
import { useMemo } from 'react';
import { useOperationsStore } from '../store/index.js';

function buildAssistantSummary(kpis) {
  return `Monitoring ${kpis.activeShipments} active shipments, ${kpis.delayedShipments} delayed, risk index ${kpis.riskIndex}.`;
}

export default function FloatingAIAssistant() {
  const isOpen = useOperationsStore((state) => state.aiPanelOpen);
  const toggle = useOperationsStore((state) => state.toggleAiPanel);
  const insights = useOperationsStore((state) => state.insights);
  const kpis = useOperationsStore((state) => state.kpis);

  const summary = useMemo(() => buildAssistantSummary(kpis), [kpis]);

  return (
    <aside className={isOpen ? 'vt-ai-panel is-open' : 'vt-ai-panel'}>
      <button
        type="button"
        className="vt-ai-trigger"
        onClick={toggle}
        aria-expanded={isOpen}
        aria-controls="vt-ai-console"
      >
        <Bot size={18} aria-hidden="true" />
        <span>Vanguard AI</span>
      </button>

      {isOpen && (
        <section id="vt-ai-console" className="vt-ai-console">
          <header>
            <div>
              <p>AI Logistics Assistant</p>
              <strong>Operational Intelligence</strong>
            </div>
            <button type="button" onClick={toggle} aria-label="Close AI panel">
              <X size={15} aria-hidden="true" />
            </button>
          </header>

          <p className="vt-ai-summary">
            <Sparkles size={14} aria-hidden="true" />
            {summary}
          </p>

          <ul>
            {insights.map((line) => (
              <li key={line}>{line}</li>
            ))}
          </ul>
        </section>
      )}
    </aside>
  );
}
