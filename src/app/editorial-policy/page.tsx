import { Metadata } from 'next';
import { Shield, CheckCircle2, FileCheck, RefreshCw } from 'lucide-react';

export const metadata: Metadata = {
  title: 'ಸಂಪಾದಕೀಯ ನೀತಿ | Editorial Policy - Garjane News',
  description: 'Garjane News editorial standards, ethics, verification process and correction policy.',
};

export default function EditorialPolicyPage() {
  return (
    <div className="w-full py-12 lg:py-16">
      <div className="container mx-auto px-4 max-w-4xl space-y-10">
        <div className="border-b border-garjane-border-light dark:border-garjane-border-dark pb-8">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-garjane-primary/10 text-garjane-primary text-caption font-semibold mb-3">
            <Shield className="w-4 h-4" /> ಪತ್ರಿಕೋದ್ಯಮ ಮೌಲ್ಯಗಳು
          </span>
          <h1 className="text-headline-2 lg:text-headline-1 font-heading font-bold text-garjane-text-primary dark:text-garjane-text-inverse mb-3">
            ಸಂಪಾದಕೀಯ ನೀತಿ / Editorial Policy
          </h1>
          <p className="text-body-lg text-garjane-text-secondary dark:text-garjane-text-muted">
            ಗರ್ಜನೆ ನ್ಯೂಸ್ ಸತ್ಯನಿಷ್ಠ, ನಿಷ್ಪಕ್ಷಪಾತ ಹಾಗೂ ಜವಾಬ್ದಾರಿಯುತ ಪತ್ರಿಕೋದ್ಯಮ ಬದ್ಧತೆಯ ವಿವರ
          </p>
        </div>

        <div className="prose prose-lg dark:prose-invert max-w-none space-y-8 text-garjane-text-secondary dark:text-garjane-text-muted">
          <section className="bg-garjane-background-card dark:bg-garjane-background-cardDark p-8 rounded-3xl border border-garjane-border-light dark:border-garjane-border-dark shadow-card">
            <h2 className="text-headline-3 font-heading font-bold text-garjane-text-primary dark:text-garjane-text-inverse mb-4 flex items-center gap-2">
              <CheckCircle2 className="w-6 h-6 text-garjane-primary" /> 1. ಸತ್ಯಾಸತ್ಯತೆ ಮತ್ತು ಪರಿಶೀಲನೆ (Verification)
            </h2>
            <p className="text-body leading-relaxed">
              ಗರ್ಜನೆ ನ್ಯೂಸ್‌ನಲ್ಲಿ ಪ್ರಕಟವಾಗುವ ಪ್ರತಿಯೊಂದು ಸುದ್ದಿಯನ್ನೂ ಕನಿಷ್ಠ ಎರಡು ಸ್ವತಂತ್ರ ಮೂಲಗಳಿಂದ ಅಥವಾ ಅಧಿಕೃತ ದಾಖಲೆಗಳಿಂದ ಪರಿಶೀಲಿಸಲಾಗುತ್ತದೆ. ಯಾವುದೇ ಊಹಾಪೋಹ, ಗಾಳಿ ಸುದ್ದಿ ಅಥವಾ ದೃಢೀಕರಿಸದ ಮಾಹಿತಿಗಳಿಗೆ ನಮ್ಮ ವೇದಿಕೆಯಲ್ಲಿ ಅವಕಾಶವಿಲ್ಲ.
            </p>
          </section>

          <section className="bg-garjane-background-card dark:bg-garjane-background-cardDark p-8 rounded-3xl border border-garjane-border-light dark:border-garjane-border-dark shadow-card">
            <h2 className="text-headline-3 font-heading font-bold text-garjane-text-primary dark:text-garjane-text-inverse mb-4 flex items-center gap-2">
              <FileCheck className="w-6 h-6 text-emerald-500" /> 2. ನಿಷ್ಪಕ್ಷಪಾತ ವರದಿಗಾರಿಕೆ (Impartiality & Independence)
            </h2>
            <p className="text-body leading-relaxed">
              ನಮ್ಮ ವರದಿಗಾರರು ಮತ್ತು ಸಂಪಾದಕರು ಯಾವುದೇ ರಾಜಕೀಯ ಪಕ್ಷ, ಜಾತಿ, ಧರ್ಮ ಅಥವಾ ವಾಣಿಜ್ಯ ಸಂಸ್ಥೆಗಳ ಪ್ರಭಾವಕ್ಕೆ ಒಳಗಾಗುವುದಿಲ್ಲ. ಯಾವುದೇ ವಿವಾದಾತ್ಮಕ ವಿಷಯಗಳಲ್ಲಿ ಎಲ್ಲ ಸಂಬಂಧಪಟ್ಟ ಪಕ್ಷಗಳ ಅಭಿಪ್ರಾಯವನ್ನು ಸಮಾನವಾಗಿ ಪ್ರಸ್ತುತಪಡಿಸಲು ನಾವು ಬದ್ಧರಾಗಿದ್ದೇವೆ.
            </p>
          </section>

          <section className="bg-garjane-background-card dark:bg-garjane-background-cardDark p-8 rounded-3xl border border-garjane-border-light dark:border-garjane-border-dark shadow-card">
            <h2 className="text-headline-3 font-heading font-bold text-garjane-text-primary dark:text-garjane-text-inverse mb-4 flex items-center gap-2">
              <RefreshCw className="w-6 h-6 text-blue-500" /> 3. ತಿದ್ದುಪಡಿ ನೀತಿ (Corrections & Updates)
            </h2>
            <p className="text-body leading-relaxed">
              ವರದಿಯಲ್ಲಿ ಅಚಾತುರ್ಯದಿಂದ ಯಾವುದೇ ತಪ್ಪು ಅಥವಾ ಅಪೂರ್ಣ ಮಾಹಿತಿ ಪ್ರಕಟವಾದಲ್ಲಿ, ಅದನ್ನು ಕೂಡಲೇ ತಿದ್ದಿ ಲೇಖನದ ಕೆಳಗೆ ತಿದ್ದುಪಡಿ ವಿವರಣೆಯನ್ನು ಪ್ರಕಟಿಸಲಾಗುವುದು. ಓದುಗರು ದೋಷಗಳನ್ನು ಗಮನಕ್ಕೆ ತಂದರೆ ತುರ್ತಾಗಿ ಪರಿಶೀಲಿಸಿ ಕ್ರಮ ಕೈಗೊಳ್ಳಲಾಗುವುದು.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
