import { useState } from 'react';
import { ShellLayout } from '../layouts/index.js';
import { submitContactSubmission } from '../services/index.js';
import '../styles/trackingLayout.css';

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [submitState, setSubmitState] = useState({
    status: 'idle',
    message: '',
  });

  function handleChange(event) {
    const { name, value } = event.target;
    setFormData((current) => ({
      ...current,
      [name]: value,
    }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setSubmitState({ status: 'submitting', message: '' });

    const result = await submitContactSubmission(formData);

    if (result.accepted) {
      setFormData({ name: '', email: '', subject: '', message: '' });
      setSubmitState({
        status: 'success',
        message:
          result.source === 'supabase'
            ? 'Your message was submitted to the live support queue.'
            : 'Demo mode: your message was captured locally.',
      });
      return;
    }

    setSubmitState({
      status: 'error',
      message: result.error || 'Could not submit your message.',
    });
  }

  return (
    <ShellLayout
      eyebrow="Contact"
      title="Reach Vanguard operations"
      description="Connect with support and command teams for incident response, onboarding, and deployment assistance."
    >
      <div className="panel-grid single-column">
        <section className="panel">
          <div className="panel-header">
            <h2>Operations contacts</h2>
            <p>Global coverage for trace response teams</p>
          </div>

          <ul className="route-list">
            <li>
              <span>Command desk</span>
              <span>+1 (800) 010-TRACE</span>
            </li>
            <li>
              <span>Incident channel</span>
              <span>ops@vanguardtrace.io</span>
            </li>
            <li>
              <span>Regional dispatch</span>
              <span>24/7 availability</span>
            </li>
          </ul>

          <form className="action-form" onSubmit={handleSubmit}>
            <label className="form-label" htmlFor="name">
              Send a support message
            </label>

            <input
              className="form-input"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Full name"
            />

            <input
              className="form-input"
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="you@company.com"
            />

            <input
              className="form-input"
              id="subject"
              name="subject"
              value={formData.subject}
              onChange={handleChange}
              placeholder="Subject"
            />

            <textarea
              className="form-input form-textarea"
              id="message"
              name="message"
              value={formData.message}
              onChange={handleChange}
              placeholder="Describe your request"
            />

            <button
              className="form-button"
              type="submit"
              disabled={submitState.status === 'submitting'}
            >
              {submitState.status === 'submitting'
                ? 'Submitting...'
                : 'Submit message'}
            </button>

            {submitState.message ? (
              <p
                className={
                  submitState.status === 'error' ? 'form-error' : 'form-hint'
                }
              >
                {submitState.message}
              </p>
            ) : null}
          </form>
        </section>
      </div>
    </ShellLayout>
  );
}
