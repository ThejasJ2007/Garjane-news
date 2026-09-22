'use client';

import { Tv, Play } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

export function VideoHero() {
  const { language } = useLanguage();

  return (
    <div className="bg-gradient-to-r from-garjane-secondary via-garjane-secondary-light/10 to-garjane-secondary text-white py-10 lg:py-14 border-b border-garjane-border-dark">
      <div className="container mx-auto px-4">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 rounded-xl bg-garjane-primary flex items-center justify-center text-white">
            <Tv className="w-5 h-5" />
          </div>
          <span className="text-garjane-accent font-semibold tracking-wider uppercase text-caption">
            Garjane Video Desk
          </span>
        </div>
        <h1 className="text-headline-2 lg:text-headline-1 font-heading font-bold text-white mb-2">
          {language === 'kn' ? 'ಗರ್ಜನೆ ವೀಡಿಯೋಗಳು' : 'Video Reports'}
        </h1>
        <p className="text-body-lg text-white/80 max-w-2xl">
          {language === 'kn'
            ? 'ನೆಲಮಂಗಲ ಹಾಗೂ ಕರ್ನಾಟಕದ ಪ್ರಮುಖ ಘಟನೆಗಳ ಗ್ರೌಂಡ್ ರಿಪೋರ್ಟ್, ತನಿಖಾ ವರದಿಗಳು ಮತ್ತು ವೀಡಿಯೋ ಸುದ್ದಿಗಳು'
            : 'Ground reports, investigative coverage, and video news from Nelamangala and across Karnataka.'}
        </p>
      </div>
    </div>
  );
}

export function FeaturedVideoBadge() {
  const { language } = useLanguage();
  return (
    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-caption font-semibold bg-garjane-primary/10 text-garjane-primary">
      <Play className="w-3.5 h-3.5" /> {language === 'kn' ? 'ಪ್ರಮುಖ ವೀಡಿಯೋ' : 'Featured Report'}
    </span>
  );
}
