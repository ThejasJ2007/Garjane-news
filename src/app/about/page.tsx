import { Metadata } from 'next';
import Link from 'next/link';
import { Newspaper, Target, Users, MapPin, Award, CheckCircle2 } from 'lucide-react';

export const metadata: Metadata = {
  title: 'ನಮ್ಮ ಬಗ್ಗೆ | About Us - Garjane News',
  description: 'Garjane News - Nelamangala and Karnataka grassroots local journalism organisation.',
};

export default function AboutPage() {
  return (
    <div className="w-full py-12 lg:py-16">
      <div className="container mx-auto px-4 max-w-5xl space-y-16">
        {/* Hero Section */}
        <div className="text-center max-w-3xl mx-auto">
          <span className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-garjane-primary/10 text-garjane-primary text-caption font-semibold mb-4">
            <Newspaper className="w-4 h-4" /> ನಿಮ್ಮ ಊರಿನ ಸುದ್ದಿ, ನಿಮ್ಮ ಧ್ವನಿ
          </span>
          <h1 className="text-headline-2 lg:text-headline-1 font-heading font-bold text-garjane-text-primary dark:text-garjane-text-inverse mb-6">
            ಗರ್ಜನೆ ನ್ಯೂಸ್ ಬಗ್ಗೆ / About Garjane News
          </h1>
          <p className="text-body-lg text-garjane-text-secondary dark:text-garjane-text-muted leading-relaxed">
            ನೆಲಮಂಗಲ, ಬೆಂಗಳೂರು ಗ್ರಾಮಾಂತರ ಹಾಗೂ ಕರ್ನಾಟಕದ ಜನಸಾಮಾನ್ಯರ ದನಿಯಾಗಿ, ನೈಜ, ನಿಷ್ಪಕ್ಷಪಾತ ಹಾಗೂ ಜವಾಬ್ದಾರಿಯುತ ಸ್ಥಳೀಯ ಪತ್ರಿಕೋದ್ಯಮವನ್ನು ನಿಮ್ಮ ಮನೆಬಾಗಿಲಿಗೆ ತಲುಪಿಸುವ ಡಿಜಿಟಲ್ ಸುದ್ದಿ ಸಂಸ್ಥೆ.
          </p>
        </div>

        {/* Mission & Vision */}
        <div className="grid md:grid-cols-2 gap-8">
          <div className="bg-garjane-background-card dark:bg-garjane-background-cardDark p-8 rounded-3xl border border-garjane-border-light dark:border-garjane-border-dark shadow-card">
            <div className="w-12 h-12 rounded-2xl bg-garjane-primary/10 text-garjane-primary flex items-center justify-center mb-6">
              <Target className="w-6 h-6" />
            </div>
            <h2 className="text-headline-3 font-heading font-bold text-garjane-text-primary dark:text-garjane-text-inverse mb-4">
              ನಮ್ಮ ಧ್ಯೇಯ / Our Mission
            </h2>
            <p className="text-body text-garjane-text-secondary dark:text-garjane-text-muted leading-relaxed">
              ಸ್ಥಳೀಯ ಸಮಸ್ಯೆಗಳು, ಗ್ರಾಮೀಣ ರೈತರ ಸಂಕಷ್ಟಗಳು, ನಾಗರಿಕ ಸೌಲಭ್ಯಗಳು ಹಾಗೂ ಆಡಳಿತಾತ್ಮಕ ಪಾರದರ್ಶಕತೆಯ ಕುರಿತು ಯಾವುದೇ ರಾಜಕೀಯ ಅಥವಾ ವಾಣಿಜ್ಯ ಪ್ರಭಾವಕ್ಕೆ ಒಳಗಾಗದೆ ಸತ್ಯನಿಷ್ಠ ವರದಿಗಾರಿಕೆಯನ್ನು ನೀಡುವುದು ಗರ್ಜನೆ ನ್ಯೂಸ್‌ನ ಪ್ರಮುಖ ಗುರಿ.
            </p>
          </div>

          <div className="bg-garjane-background-card dark:bg-garjane-background-cardDark p-8 rounded-3xl border border-garjane-border-light dark:border-garjane-border-dark shadow-card">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mb-6">
              <Award className="w-6 h-6" />
            </div>
            <h2 className="text-headline-3 font-heading font-bold text-garjane-text-primary dark:text-garjane-text-inverse mb-4">
              ನಮ್ಮ ಮೌಲ್ಯಗಳು / Core Principles
            </h2>
            <ul className="space-y-3 text-body text-garjane-text-secondary dark:text-garjane-text-muted">
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                <span><strong>ವಸ್ತುನಿಷ್ಠತೆ (Objectivity):</strong> ಸುದ್ದಿಗಳನ್ನು ಯಾರ ಪರ ಅಥವಾ ವಿರೋಧವಿಲ್ಲದೆ ಸತ್ಯದ ನೆಲೆಯಲ್ಲಿ ಪ್ರಸ್ತುತಪಡಿಸುವುದು.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                <span><strong>ಸ್ಥಳೀಯ ಆದ್ಯತೆ (Hyperlocal Focus):</strong> ನೆಲಮಂಗಲ ತಾಲೂಕು ಮತ್ತು ಬೆಂಗಳೂರು ಗ್ರಾಮಾಂತರದ ಪ್ರತಿಯೊಂದು ಹಳ್ಳಿಯ ಧ್ವನಿಗೆ ಆದ್ಯತೆ.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                <span><strong>ತ್ವರಿತ & ನಿಖರ (Speed with Accuracy):</strong> ಬ್ರೇಕಿಂಗ್ ಸುದ್ದಿಗಳ ಜತೆಗೆ ನಿಖರವಾದ ಸತ್ಯಾಸತ್ಯತೆಯನ್ನು ಪರಿಶೀಲಿಸಿ ಪ್ರಕಟಿಸುವುದು.</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Coverage Areas */}
        <div className="bg-garjane-background-light/60 dark:bg-garjane-background-dark/60 rounded-3xl p-8 lg:p-12 border border-garjane-border-light dark:border-garjane-border-dark">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <h2 className="text-headline-3 font-heading font-bold text-garjane-text-primary dark:text-garjane-text-inverse mb-2">
              ಸುದ್ದಿ ವ್ಯಾಪ್ತಿ / Coverage Footprint
            </h2>
            <p className="text-body text-garjane-text-muted">
              ಗರ್ಜನೆ ನ್ಯೂಸ್ ವರದಿಗಾರರ ಜಾಲವು ಈ ಕೆಳಗಿನ ಪ್ರಮುಖ ಪ್ರದೇಶಗಳಲ್ಲಿ ನಿರಂತರವಾಗಿ ಕಾರ್ಯನಿರ್ವಹಿಸುತ್ತಿದೆ
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div className="bg-garjane-background-card dark:bg-garjane-background-cardDark p-5 rounded-2xl border border-garjane-border-light dark:border-garjane-border-dark">
              <MapPin className="w-6 h-6 text-garjane-primary mx-auto mb-2" />
              <h3 className="font-semibold text-body">ನೆಲಮಂಗಲ</h3>
              <p className="text-caption text-garjane-text-muted mt-1">Nelamangala Taluk</p>
            </div>
            <div className="bg-garjane-background-card dark:bg-garjane-background-cardDark p-5 rounded-2xl border border-garjane-border-light dark:border-garjane-border-dark">
              <MapPin className="w-6 h-6 text-garjane-primary mx-auto mb-2" />
              <h3 className="font-semibold text-body">ಬೆಂಗಳೂರು ಗ್ರಾಮಾಂತರ</h3>
              <p className="text-caption text-garjane-text-muted mt-1">Bengaluru Rural</p>
            </div>
            <div className="bg-garjane-background-card dark:bg-garjane-background-cardDark p-5 rounded-2xl border border-garjane-border-light dark:border-garjane-border-dark">
              <MapPin className="w-6 h-6 text-garjane-primary mx-auto mb-2" />
              <h3 className="font-semibold text-body">ಬೆಂಗಳೂರು ನಗರ</h3>
              <p className="text-caption text-garjane-text-muted mt-1">Bengaluru City</p>
            </div>
            <div className="bg-garjane-background-card dark:bg-garjane-background-cardDark p-5 rounded-2xl border border-garjane-border-light dark:border-garjane-border-dark">
              <MapPin className="w-6 h-6 text-garjane-primary mx-auto mb-2" />
              <h3 className="font-semibold text-body">ತುಮಕೂರು & ರಾಜ್ಯ</h3>
              <p className="text-caption text-garjane-text-muted mt-1">Statewide Coverage</p>
            </div>
          </div>
        </div>

        {/* Contact CTA */}
        <div className="text-center py-8">
          <h3 className="text-headline-3 font-heading font-bold text-garjane-text-primary dark:text-garjane-text-inverse mb-3">
            ನಮ್ಮೊಂದಿಗೆ ಸಂಪರ್ಕದಲ್ಲಿರಿ
          </h3>
          <p className="text-body text-garjane-text-muted mb-6">
            ಸುದ್ದಿ ಸಲಹೆಗಳು, ವರದಿಗಳು ಅಥವಾ ಜಾಹೀರಾತಿಗಾಗಿ ನಮ್ಮ ಕಚೇರಿಯನ್ನು ಸಂಪರ್ಕಿಸಿ
          </p>
          <div className="flex items-center justify-center gap-4">
            <Link href="/contact" className="px-6 py-3 bg-garjane-primary text-garjane-primary-foreground font-semibold rounded-xl hover:bg-garjane-primary-hover transition-colors text-body">
              ಸಂಪರ್ಕಿಸಿ / Contact Us
            </Link>
            <Link href="/newsletter" className="px-6 py-3 bg-garjane-background-card dark:bg-garjane-background-cardDark border border-garjane-border-light dark:border-garjane-border-dark text-garjane-text-primary dark:text-garjane-text-inverse font-semibold rounded-xl hover:border-garjane-primary transition-colors text-body">
              ನ್ಯೂಸ್‌ಲೆಟರ್ ಪಡೆಯಿರಿ / Newsletter
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
