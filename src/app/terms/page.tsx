import { Metadata } from 'next';
import { FileText } from 'lucide-react';

export const metadata: Metadata = {
  title: 'ಸೇವಾ ಷರತ್ತುಗಳು | Terms of Service - Garjane News',
  description: 'Terms and conditions for reading and interacting on Garjane News.',
};

export default function TermsPage() {
  return (
    <div className="w-full py-12 lg:py-16">
      <div className="container mx-auto px-4 max-w-4xl space-y-8">
        <div className="border-b border-garjane-border-light dark:border-garjane-border-dark pb-6">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-garjane-primary/10 text-garjane-primary text-caption font-semibold mb-3">
            <FileText className="w-4 h-4" /> ಕಾನೂನು ನಿಯಮಗಳು
          </span>
          <h1 className="text-headline-2 font-heading font-bold text-garjane-text-primary dark:text-garjane-text-inverse mb-2">
            ಸೇವಾ ಷರತ್ತುಗಳು / Terms of Service
          </h1>
          <p className="text-body-sm text-garjane-text-muted">ಕೊನೆಯ ನವೀಕರಣ: 2026</p>
        </div>

        <div className="bg-garjane-background-card dark:bg-garjane-background-cardDark p-8 rounded-3xl border border-garjane-border-light dark:border-garjane-border-dark space-y-6 text-body leading-relaxed text-garjane-text-secondary dark:text-garjane-text-muted">
          <div>
            <h2 className="text-headline-4 font-bold text-garjane-text-primary dark:text-garjane-text-inverse mb-2">
              1. ಹಕ್ಕುಸ್ವಾಮ್ಯ (Copyright & Content)
            </h2>
            <p>
              Garjane News ವೆಬ್‌ಸೈಟ್‌ನಲ್ಲಿ ಪ್ರಕಟವಾಗುವ ಎಲ್ಲ ಲೇಖನಗಳು, ವಿಡಿಯೋಗಳು, ಛಾಯಾಚಿತ್ರಗಳು ಮತ್ತು ವಿನ್ಯಾಸದ ಹಕ್ಕುಸ್ವಾಮ್ಯವು Garjane News‌ಗೆ ಸೇರಿದೆ. ಪೂರ್ವಾನುಮತಿಯಿಲ್ಲದೆ ಪೂರ್ಣ ಪ್ರಮಾಣದಲ್ಲಿ ನಕಲು ಮಾಡುವುದು ಅಥವಾ ಮರುಪ್ರಕಟಿಸುವುದು ನಿಷೇಧಿಸಲಾಗಿದೆ.
            </p>
          </div>

          <div>
            <h2 className="text-headline-4 font-bold text-garjane-text-primary dark:text-garjane-text-inverse mb-2">
              2. ಬಳಕೆದಾರರ ನಡಾವಳಿ ಮತ್ತು ಕಾಮೆಂಟ್‌ಗಳು (User Conduct)
            </h2>
            <p>
              ಓದುಗರು ಲೇಖನಗಳ ಕೆಳಗೆ ಕಾಮೆಂಟ್ ಮಾಡುವಾಗ ಸಭ್ಯತೆಯನ್ನು ಕಾಪಾಡಿಕೊಳ್ಳಬೇಕು. ದ್ವೇಷಪೂರಿತ ಭಾಷಣ, ಅವಹೇಳನಕಾರಿ ಮಾತುಗಳು, ಅಶ್ಲೀಲತೆ ಅಥವಾ ತಪ್ಪು ಮಾಹಿತಿಗಳನ್ನು ಪ್ರಕಟಿಸಲು ಅವಕಾಶವಿಲ್ಲ. ಅಂತಹ ಕಾಮೆಂಟ್‌ಗಳನ್ನು ಮುನ್ಸೂಚನೆಯಿಲ್ಲದೆ ತೆಗೆದುಹಾಕಲಾಗುತ್ತದೆ.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
