'use client';

import { Camera } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

export function GalleryHero() {
  const { language, t } = useLanguage();

  return (
    <div className="mb-10 text-center max-w-3xl mx-auto">
      <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-garjane-primary/10 text-garjane-primary text-caption font-semibold mb-3">
        <Camera className="w-4 h-4" />
        <span>{language === 'kn' ? 'ಚಿತ್ರಾವಳಿ ಸಂಗ್ರಹ' : 'Visual Stories'}</span>
      </div>
      <h1 className="text-headline-2 lg:text-headline-1 font-heading font-bold text-garjane-text-primary dark:text-garjane-text-inverse mb-3">
        {language === 'kn' ? 'ಫೋಟೋ ಗ್ಯಾಲರಿ' : 'Photo Galleries'}
      </h1>
      <p className="text-body-lg text-garjane-text-secondary dark:text-garjane-text-muted">
        {language === 'kn'
          ? 'ನೆಲಮಂಗಲ ಹಾಗೂ ಕರ್ನಾಟಕದ ಪ್ರಮುಖ ಘಟನೆಗಳು, ಸಂಸ್ಕೃತಿ ಮತ್ತು ಅಭಿವೃದ್ಧಿಯ ಅಪರೂಪದ ಚಿತ್ರ ಸಂಗ್ರಹ'
          : 'High-resolution photo galleries covering Nelamangala events, culture, infrastructure, and rural life in Karnataka.'}
      </p>
    </div>
  );
}
