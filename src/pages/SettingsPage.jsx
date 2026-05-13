import { useEffect } from 'react';
import { FileUpload, SectionHeader } from '../components/index.js';
import { ShellLayout } from '../layouts/index.js';
import { getSettings, upsertSettings } from '../services/index.js';
import { useAuthStore } from '../store/index.js';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import toast from 'react-hot-toast';

const defaultValues = {
  alertThresholdMs: 2500,
  retentionDays: 30,
  preferredCorridor: 'North Sea N1',
  weeklyDigestEnabled: true,
};

const settingsSchema = z.object({
  alertThresholdMs: z.coerce
    .number()
    .int('Threshold must be a whole number')
    .min(500, 'Threshold must be at least 500ms')
    .max(10000, 'Threshold cannot exceed 10000ms'),
  retentionDays: z.coerce
    .number()
    .int('Retention must be a whole number')
    .min(7, 'Retention must be at least 7 days')
    .max(180, 'Retention cannot exceed 180 days'),
  preferredCorridor: z
    .string()
    .trim()
    .min(2, 'Preferred corridor is required')
    .max(64, 'Preferred corridor is too long'),
  weeklyDigestEnabled: z.boolean(),
});

export default function SettingsPage() {
  const userId = useAuthStore((state) => state.user?.id);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(settingsSchema),
    defaultValues,
  });

  useEffect(() => {
    let mounted = true;

    async function loadSettings() {
      if (!userId) {
        reset(defaultValues);
        return;
      }

      const { data, error } = await getSettings(userId);
      if (!mounted || error) return;
      if (!data) return;

      reset({
        alertThresholdMs: data.alert_threshold_ms ?? defaultValues.alertThresholdMs,
        retentionDays: data.report_retention_days ?? defaultValues.retentionDays,
        preferredCorridor: data.preferred_corridor ?? defaultValues.preferredCorridor,
        weeklyDigestEnabled:
          data.weekly_digest_enabled ?? defaultValues.weeklyDigestEnabled,
      });
    }

    loadSettings();

    return () => {
      mounted = false;
    };
  }, [reset, userId]);

  async function onSubmit(values) {
    if (!userId) {
      toast.error('Sign in required to save settings.');
      return;
    }

    const { error } = await upsertSettings(userId, values);
    if (error) {
      toast.error(error.message || 'Could not save settings.');
      return;
    }

    toast.success(
      `Saved: ${values.alertThresholdMs}ms threshold, ${values.retentionDays} day retention.`,
    );
  }

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

          <form className="action-form" onSubmit={handleSubmit(onSubmit)}>
            <label className="form-label" htmlFor="alertThresholdMs">
              Alert threshold (ms)
            </label>
            <input
              id="alertThresholdMs"
              className="form-input"
              type="number"
              {...register('alertThresholdMs')}
            />
            {errors.alertThresholdMs ? (
              <p className="form-error">{errors.alertThresholdMs.message}</p>
            ) : null}

            <label className="form-label" htmlFor="retentionDays">
              Trace retention (days)
            </label>
            <input
              id="retentionDays"
              className="form-input"
              type="number"
              {...register('retentionDays')}
            />
            {errors.retentionDays ? (
              <p className="form-error">{errors.retentionDays.message}</p>
            ) : null}

            <label className="form-label" htmlFor="preferredCorridor">
              Preferred corridor
            </label>
            <input
              id="preferredCorridor"
              className="form-input"
              type="text"
              {...register('preferredCorridor')}
            />
            {errors.preferredCorridor ? (
              <p className="form-error">{errors.preferredCorridor.message}</p>
            ) : null}

            <label className="checkbox-row" htmlFor="weeklyDigestEnabled">
              <input
                id="weeklyDigestEnabled"
                type="checkbox"
                {...register('weeklyDigestEnabled')}
              />
              Weekly digest enabled
            </label>

            <div className="form-row">
              <button
                className="form-button"
                type="submit"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Saving...' : 'Save settings'}
              </button>
              <button
                className="form-button form-button-secondary"
                type="button"
                onClick={() => reset(defaultValues)}
              >
                Reset defaults
              </button>
            </div>
          </form>
        </section>
      </div>
    </ShellLayout>
  );
}
