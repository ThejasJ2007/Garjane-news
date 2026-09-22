import { Metadata } from 'next';
import { Shield, Lock } from 'lucide-react';

export const metadata: Metadata = {
  title: 'ಗೌಪ್ಯತಾ ನೀತಿ | Privacy Policy - Garjane News',
  description: 'Garjane News privacy policy and data protection practices.',
};

export default function PrivacyPolicyPage() {
  return (
    <div className="w-full py-12 lg:py-16">
      <div className="container mx-auto px-4 max-w-4xl space-y-8">
        <div className="border-b border-garjane-border-light dark:border-garjane-border-dark pb-6">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-garjane-primary/10 text-garjane-primary text-caption font-semibold mb-3">
            <Lock className="w-4 h-4" /> ಡೇಟಾ ಸುರಕ್ಷತೆ
          </span>
          <h1 className="text-headline-2 font-heading font-bold text-garjane-text-primary dark:text-garjane-text-inverse mb-2">
            ಗೌಪ್ಯತಾ ನೀತಿ / Privacy Policy
          </h1>
          <p className="text-body-sm text-garjane-text-muted">ಕೊನೆಯ ನವೀಕರಣ: 2026</p>
        </div>

        <div className="bg-garjane-background-card dark:bg-garjane-background-cardDark p-8 rounded-3xl border border-garjane-border-light dark:border-garjane-border-dark space-y-6 text-body leading-relaxed text-garjane-text-secondary dark:text-garjane-text-muted">
          <div>
            <h2 className="text-headline-4 font-bold text-garjane-text-primary dark:text-garjane-text-inverse mb-2">
              1. ನಾವು ಸಂಗ್ರಹಿಸುವ ಮಾಹಿತಿಗಳು (Information We Collect)
            </h2>
            <p>
              Garjane News ವೆಬ್‌ಸೈಟ್‌ನಲ್ಲಿ ಓದುಗರು ನೋಂದಾಯಿಸುವಾಗ, ನ್ಯೂಸ್‌ಲೆಟರ್‌ಗೆ ಚಂದಾದಾರರಾಗುವಾಗ ಅಥವಾ ಕಾಮೆಂಟ್ ಬರೆಯುವಾಗ ನೀಡುವ ಹೆಸರು, ಇಮೇಲ್ ವಿಳಾಸ ಮತ್ತು ಪ್ರಾಶಸ್ತ್ಯಗಳನ್ನು ಮಾತ್ರ ಸಂಗ್ರಹಿಸಲಾಗುತ್ತದೆ.
            </p>
          </div>

          <div>
            <h2 className="text-headline-4 font-bold text-garjane-text-primary dark:text-garjane-text-inverse mb-2">
              2. ಮಾಹಿತಿಯ ಬಳಕೆ (Use of Information)
            </h2>
            <p>
              ಸಂಗ್ರಹಿಸಿದ ಮಾಹಿತಿಯನ್ನು ದೈನಂದಿನ ಸುದ್ದಿ ಅಪ್‌ಡೇಟ್‌ಗಳನ್ನು ಕಳುಹಿಸಲು, ತಾಣದ ಕಾರ್ಯಕ್ಷಮತೆಯನ್ನು ಸುಧಾರಿಸಲು ಮತ್ತು ಬಳಕೆದಾರರ ಅನುಭವವನ್ನು ಉತ್ತಮಗೊಳಿಸಲು ಮಾತ್ರ ಬಳಸಲಾಗುತ್ತದೆ. ಯಾವುದೇ ಕಾರಣಕ್ಕೂ ಮೂರನೇ ವ್ಯಕ್ತಿಗಳಿಗೆ ಡೇಟಾವನ್ನು ಮಾರಾಟ ಮಾಡಲಾಗುವುದಿಲ್ಲ.
            </p>
          </div>

          <div>
            <h2 className="text-headline-4 font-bold text-garjane-text-primary dark:text-garjane-text-inverse mb-2">
              3. ಕುಕೀಸ್ ಬಳಕೆ (Cookies Policy)
            </h2>
            <p>
              ವೆಬ್‌ಸೈಟ್‌ನ ಥೀಮ್ (ಡಾರ್ಕ್ ಮೋಡ್/ಲೈಟ್ ಮೋಡ್), ಭಾಷಾ ಆಯ್ಕೆ ಮತ್ತು ಲಾಗಿನ್ ಸ್ಥಿತಿಯನ್ನು ಉಳಿಸಿಕೊಳ್ಳಲು ಮಾತ್ರ ಕುಕೀಗಳನ್ನು ಬಳಸಲಾಗುತ್ತದೆ.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
