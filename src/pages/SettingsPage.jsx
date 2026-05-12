import { FileUpload, SectionHeader } from '../components/index.js';
import { ShellLayout } from '../layouts/index.js';

export default function SettingsPage() {
  return (
    <ShellLayout
      eyebrow="Workspace settings"
      title="Tune alerts and reporting"
      description="Start with the defaults, then tighten thresholds once the trace baseline settles."
    >
      <div className="panel-grid single-column">
        <section className="panel">
          <SectionHeader
            title="Defaults"
            subtitle="Optimized for a fresh Vite app"
          />

          <div className="settings-grid">
            <div>
              <span>Alert threshold</span>
              <strong>2.5s LCP</strong>
            </div>
            <div>
              <span>Weekly digest</span>
              <strong>On</strong>
            </div>
            <div>
              <span>Trace retention</span>
              <strong>30 days</strong>
            </div>
          </div>

          <div className="form-block">
            <FileUpload />
          </div>
        </section>
      </div>
    </ShellLayout>
  );
}
