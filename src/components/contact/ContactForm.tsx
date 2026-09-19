'use client';

import { useState } from 'react';
import { Send, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';
import { submitContactAction, type ContactActionResult } from '@/actions/contact';
import { Button } from '@/components/ui/Button';

export function ContactForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [result, setResult] = useState<ContactActionResult | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsSubmitting(true);
    setResult(null);

    const formData = new FormData(e.currentTarget);
    try {
      const res = await submitContactAction(formData);
      setResult(res);
      if (res.success) {
        (e.target as HTMLFormElement).reset();
      }
    } catch {
      setResult({
        error: 'ಸಂಪರ್ಕ ದೋಷ ಸಂಭವಿಸಿದೆ. ದಯವಿಟ್ಟು ಪುನಃ ಪ್ರಯತ್ನಿಸಿ. / Network error occurred. Please try again.',
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div>
      {result?.success && (
        <div className="mb-6 p-5 rounded-2xl bg-green-500/10 border border-green-500/30 text-green-700 dark:text-green-300 flex items-start gap-3" role="status">
          <CheckCircle2 className="w-5 h-5 flex-shrink-0 mt-0.5 text-green-600 dark:text-green-400" />
          <div className="space-y-1">
            <h4 className="font-semibold text-body">ಸಂದೇಶ ತಲುಪಿದೆ / Message Sent</h4>
            <p className="text-body-sm leading-relaxed">{result.message}</p>
          </div>
        </div>
      )}

      {result?.error && (
        <div className="mb-6 p-4 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/50 text-red-700 dark:text-red-300 text-body-sm flex items-center gap-2" role="alert">
          <AlertCircle className="w-5 h-5 flex-shrink-0 text-red-500" />
          <span>{result.error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="grid md:grid-cols-2 gap-5">
          <div>
            <label className="block text-body-sm font-medium mb-1.5 text-garjane-text-primary dark:text-garjane-text-inverse" htmlFor="contact-name">
              ನಿಮ್ಮ ಹೆಸರು / Name *
            </label>
            <input
              id="contact-name"
              name="name"
              type="text"
              required
              disabled={isSubmitting}
              placeholder="ನಿಮ್ಮ ಹೆಸರು"
              className="w-full px-4 py-2.5 rounded-xl border border-garjane-border-light dark:border-garjane-border-dark bg-garjane-background-light/50 dark:bg-garjane-background-dark/50 text-garjane-text-primary dark:text-garjane-text-inverse focus:outline-none focus:ring-2 focus:ring-garjane-primary/20 focus:border-garjane-primary text-body"
            />
          </div>

          <div>
            <label className="block text-body-sm font-medium mb-1.5 text-garjane-text-primary dark:text-garjane-text-inverse" htmlFor="contact-phone">
              ಮೊಬೈಲ್ ಸಂಖ್ಯೆ / Phone *
            </label>
            <input
              id="contact-phone"
              name="phone"
              type="tel"
              required
              disabled={isSubmitting}
              placeholder="+91 98450..."
              className="w-full px-4 py-2.5 rounded-xl border border-garjane-border-light dark:border-garjane-border-dark bg-garjane-background-light/50 dark:bg-garjane-background-dark/50 text-garjane-text-primary dark:text-garjane-text-inverse focus:outline-none focus:ring-2 focus:ring-garjane-primary/20 focus:border-garjane-primary text-body"
            />
          </div>
        </div>

        <div>
          <label className="block text-body-sm font-medium mb-1.5 text-garjane-text-primary dark:text-garjane-text-inverse" htmlFor="contact-email">
            ಇಮೇಲ್ ವಿಳಾಸ / Email (ಐಚ್ಛಿಕ / Optional)
          </label>
          <input
            id="contact-email"
            name="email"
            type="email"
            disabled={isSubmitting}
            placeholder="name@example.com"
            className="w-full px-4 py-2.5 rounded-xl border border-garjane-border-light dark:border-garjane-border-dark bg-garjane-background-light/50 dark:bg-garjane-background-dark/50 text-garjane-text-primary dark:text-garjane-text-inverse focus:outline-none focus:ring-2 focus:ring-garjane-primary/20 focus:border-garjane-primary text-body"
          />
        </div>

        <div>
          <label className="block text-body-sm font-medium mb-1.5 text-garjane-text-primary dark:text-garjane-text-inverse" htmlFor="contact-topic">
            ವಿಷಯ / Category
          </label>
          <select
            id="contact-topic"
            name="topic"
            disabled={isSubmitting}
            className="w-full px-4 py-2.5 rounded-xl border border-garjane-border-light dark:border-garjane-border-dark bg-garjane-background-light/50 dark:bg-garjane-background-dark/50 text-garjane-text-primary dark:text-garjane-text-inverse focus:outline-none focus:ring-2 focus:ring-garjane-primary/20 focus:border-garjane-primary text-body"
          >
            <option value="tip">ಸ್ಥಳೀಯ ಸುದ್ದಿ ಮಾಹಿತಿ / News Tip</option>
            <option value="issue">ನಾಗರಿಕ ಸಮಸ್ಯೆ / Civic Grievance</option>
            <option value="ad">ಜಾಹೀರಾತು ವಿಚಾರಣೆ / Advertisement</option>
            <option value="feedback">ಪ್ರತಿಕ್ರಿಯೆ / Editorial Feedback</option>
          </select>
        </div>

        <div>
          <label className="block text-body-sm font-medium mb-1.5 text-garjane-text-primary dark:text-garjane-text-inverse" htmlFor="contact-message">
            ಸಂದೇಶ ಅಥವಾ ಸುದ್ದಿ ವಿವರ / Message & News Details *
          </label>
          <textarea
            id="contact-message"
            name="message"
            required
            disabled={isSubmitting}
            rows={5}
            placeholder="ಘಟನೆಯ ಸ್ಥಳ, ದಿನಾಂಕ ಮತ್ತು ವಿವರಗಳನ್ನು ನಮೂದಿಸಿ..."
            className="w-full px-4 py-2.5 rounded-xl border border-garjane-border-light dark:border-garjane-border-dark bg-garjane-background-light/50 dark:bg-garjane-background-dark/50 text-garjane-text-primary dark:text-garjane-text-inverse focus:outline-none focus:ring-2 focus:ring-garjane-primary/20 focus:border-garjane-primary text-body resize-y"
          />
        </div>

        <Button
          type="submit"
          disabled={isSubmitting}
          className="w-full py-3.5 text-body-lg font-semibold flex items-center justify-center gap-2"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              <span>ಕಳುಹಿಸಲಾಗುತ್ತಿದೆ... / Sending...</span>
            </>
          ) : (
            <>
              <Send className="w-5 h-5" />
              <span>ಸಂದೇಶ ಕಳುಹಿಸಿ / Send Message</span>
            </>
          )}
        </Button>
      </form>
    </div>
  );
}
