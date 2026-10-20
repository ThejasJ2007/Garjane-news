'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Mail, Phone, MapPin, Linkedin, Github } from 'lucide-react';
import { getSiteSettings } from '@/lib/data';
import { useLanguage } from '@/contexts/LanguageContext';
import { cn } from '@/lib/utils';

import {
  SocialMediaIcons,
  FacebookIcon,
  XTwitterIcon,
  InstagramIcon,
  YouTubeIcon,
} from '@/components/common/SocialMediaIcons';

export { FacebookIcon, XTwitterIcon, InstagramIcon, YouTubeIcon };

interface FooterProps {
  siteSettings?: Awaited<ReturnType<typeof getSiteSettings>> | null;
}

export function Footer({ siteSettings }: FooterProps) {
  const { language, t } = useLanguage();
  const socialLinks = siteSettings?.socialLinks as Record<string, string> | null;
  const FACEBOOK_PAGE_URL = 'https://www.facebook.com/profile.php?id=61563431741881';
  const TWITTER_PAGE_URL = socialLinks?.twitter || 'https://twitter.com/garjanenews';
  const INSTAGRAM_PAGE_URL =
    socialLinks?.instagram && socialLinks.instagram !== 'https://instagram.com/garjanenews'
      ? socialLinks.instagram
      : 'https://www.instagram.com/garjanenews_kannada/';
  const YOUTUBE_PAGE_URL = 'https://www.youtube.com/@GarjaneNews1';
  const contactEmail = socialLinks?.email || 'v4news@gmail.com';
  const contactPhone = socialLinks?.phone || '9019987639 / 9743519979';
  const contactPhoneClean = contactPhone.split('/')[0].trim();
  const contactPhoneHref = `tel:${contactPhoneClean.replace(/[^0-9+]/g, '')}`;
  const contactAddress = language === 'en'
    ? (socialLinks?.address || t.footer.addressDefault)
    : (socialLinks?.addressKn || t.footer.addressDefault);
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    company: [
      { label: 'About Us', labelKn: 'ನಮ್ಮ ಬಗ್ಗೆ', href: '/about' },
      { label: 'Contact', labelKn: 'ಸಂಪರ್ಕ', href: '/contact' },
      { label: 'Editorial Policy', labelKn: 'ಸಂಪಾದಕೀಯ ನೀತಿ', href: '/editorial-policy' },
    ],
    editorial: [
      { label: 'Editorial Policy', labelKn: 'ಸಂಪಾದಕೀಯ ನೀತಿ', href: '/editorial-policy' },
      { label: 'Ethics & Standards', labelKn: 'ನೈತಿಕತೆ ಮತ್ತು ಮಾನದಂಡ', href: '/editorial-policy' },
      { label: 'Corrections Policy', labelKn: 'ತಿದ್ದುಪಡಿ ನೀತಿ', href: '/editorial-policy' },
      { label: 'Letters to Editor', labelKn: 'ಸಂಪಾದಕರಿಗೆ ಪತ್ರಗಳು', href: '/contact' },
    ],
    legal: [
      { label: 'Privacy Policy', labelKn: 'ಗೌಪ್ಯತಾ ನೀತಿ', href: '/privacy' },
      { label: 'Terms of Service', labelKn: 'ಸೇವಾ ಷರತ್ತುಗಳು', href: '/terms' },
    ],
    audience: [
      { label: 'Advertise with Us', labelKn: 'ಜಾಹೀರಾತು ನೀಡಿ', href: '/contact' },
      { label: 'Newsletter', labelKn: 'ನ್ಯೂಸ್‌ಲೆಟರ್', href: '/newsletter' },
      { label: 'Photo Galleries', labelKn: 'ಚಿತ್ರಾವಳಿ', href: '/gallery' },
      { label: 'Videos', labelKn: 'ವೀಡಿಯೋಗಳು', href: '/video' },
    ],
  };

  const displayTagline = language === 'en'
    ? (siteSettings?.tagline || t.footer.taglineDefault)
    : (siteSettings?.taglineKn || t.footer.taglineDefault);

  const followUsText = language === 'kn' ? 'ಫಾಲೋ ಮಾಡಿ' : 'Follow us on';
  const subscribeOnText = language === 'kn' ? 'ಚಂದಾದಾರರಾಗಿ' : 'Subscribe on';

  return (
    <footer className="bg-white dark:bg-garjane-background-dark/95 text-[#172B4D] dark:text-slate-200 subpixel-antialiased border-t border-garjane-border-light dark:border-garjane-border-dark transition-colors" role="contentinfo">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 py-12 lg:py-16">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8 lg:gap-10">
          {/* Brand Column */}
          <div className="col-span-2 lg:col-span-2">
            <Link href="/" className="flex items-center gap-3 mb-5" aria-label={t.common.brandName}>
              <Image
                src="/images/Garjane-news-logo.png?v=3"
                alt={t.common.brandName}
                width={48}
                height={48}
                className="w-10 h-10 lg:w-12 lg:h-12 object-cover flex-shrink-0"
                priority
              />
              <span className={cn(
                "font-heading font-bold text-headline-3 text-[#172B4D] dark:text-white",
                language === 'kn' && 'font-kannada'
              )}>
                {t.common.brandName}
              </span>
            </Link>
            <p className={cn("text-[#172B4D] dark:text-slate-300 text-body-sm font-medium mb-6 leading-relaxed max-w-xs", language === 'kn' && 'font-kannada')}>
              {displayTagline}
            </p>
            <SocialMediaIcons
              facebookUrl={FACEBOOK_PAGE_URL}
              twitterUrl={TWITTER_PAGE_URL}
              instagramUrl={INSTAGRAM_PAGE_URL}
              youtubeUrl={YOUTUBE_PAGE_URL}
              followUsText={followUsText}
              subscribeOnText={subscribeOnText}
            />
          </div>

          {/* Company Links */}
          <nav aria-label={t.footer.company}>
            <h3 className="font-heading font-semibold text-lg text-[#172B4D] dark:text-white mb-4 relative pb-2">
              {t.footer.company}
              <span className="absolute bottom-0 left-0 w-6 h-0.5 bg-garjane-primary rounded-full" aria-hidden="true" />
            </h3>
            <ul className="space-y-3" role="list">
              {footerLinks.company.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className={cn("text-[#172B4D] dark:text-slate-300 hover:text-garjane-primary dark:hover:text-garjane-primary-light transition-colors duration-200 text-body-sm font-medium", language === 'kn' && 'font-kannada')}>
                    {language === 'en' ? link.label : link.labelKn}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Editorial Links */}
          <nav aria-label={t.footer.editorial}>
            <h3 className="font-heading font-semibold text-lg text-[#172B4D] dark:text-white mb-4 relative pb-2">
              {t.footer.editorial}
              <span className="absolute bottom-0 left-0 w-6 h-0.5 bg-garjane-primary rounded-full" aria-hidden="true" />
            </h3>
            <ul className="space-y-3" role="list">
              {footerLinks.editorial.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className={cn("text-[#172B4D] dark:text-slate-300 hover:text-garjane-primary dark:hover:text-garjane-primary-light transition-colors duration-200 text-body-sm font-medium", language === 'kn' && 'font-kannada')}>
                    {language === 'en' ? link.label : link.labelKn}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Legal Links */}
          <nav aria-label={t.footer.legal}>
            <h3 className="font-heading font-semibold text-lg text-[#172B4D] dark:text-white mb-4 relative pb-2">
              {t.footer.legal}
              <span className="absolute bottom-0 left-0 w-6 h-0.5 bg-garjane-primary rounded-full" aria-hidden="true" />
            </h3>
            <ul className="space-y-3" role="list">
              {footerLinks.legal.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className={cn("text-[#172B4D] dark:text-slate-300 hover:text-garjane-primary dark:hover:text-garjane-primary-light transition-colors duration-200 text-body-sm font-medium", language === 'kn' && 'font-kannada')}>
                    {language === 'en' ? link.label : link.labelKn}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* For You Links */}
          <nav aria-label={t.footer.forYou}>
            <h3 className="font-heading font-semibold text-lg text-[#172B4D] dark:text-white mb-4 relative pb-2">
              {t.footer.forYou}
              <span className="absolute bottom-0 left-0 w-6 h-0.5 bg-garjane-primary rounded-full" aria-hidden="true" />
            </h3>
            <ul className="space-y-3" role="list">
              {footerLinks.audience.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className={cn("text-[#172B4D] dark:text-slate-300 hover:text-garjane-primary dark:hover:text-garjane-primary-light transition-colors duration-200 text-body-sm font-medium", language === 'kn' && 'font-kannada')}>
                    {language === 'en' ? link.label : link.labelKn}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Contact Us */}
          <div>
            <h3 className="font-heading font-semibold text-lg text-[#172B4D] dark:text-white mb-4 relative pb-2">
              {t.footer.contactUs}
              <span className="absolute bottom-0 left-0 w-6 h-0.5 bg-garjane-primary rounded-full" aria-hidden="true" />
            </h3>
            <address className={cn("not-italic text-body-sm text-[#172B4D] dark:text-slate-300 space-y-3", language === 'kn' && 'font-kannada')}>
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 mt-0.5 flex-shrink-0 text-garjane-primary" aria-hidden="true" />
                <span className="text-[#172B4D] dark:text-slate-300 font-medium leading-relaxed">
                  {contactAddress}
                </span>
              </div>
              {contactEmail && (
                <a href={`mailto:${contactEmail}`} className="flex items-center gap-3 text-[#172B4D] dark:text-slate-300 hover:text-garjane-primary dark:hover:text-garjane-primary-light transition-colors duration-200">
                  <Mail className="w-5 h-5 flex-shrink-0 text-garjane-primary" aria-hidden="true" />
                  <span className="text-[#172B4D] dark:text-slate-300 font-medium">{contactEmail}</span>
                </a>
              )}
              {contactPhone && (
                <a href={contactPhoneHref} className="flex items-center gap-3 text-[#172B4D] dark:text-slate-300 hover:text-garjane-primary dark:hover:text-garjane-primary-light transition-colors duration-200">
                  <Phone className="w-5 h-5 flex-shrink-0 text-garjane-primary" aria-hidden="true" />
                  <span className="whitespace-nowrap text-[#172B4D] dark:text-slate-300 font-medium">{contactPhone}</span>
                </a>
              )}
            </address>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-10 lg:mt-12 pt-8 border-t border-garjane-border-light dark:border-garjane-border-dark flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="text-center md:text-left">
            <p className={cn("text-[#172B4D] dark:text-slate-400 text-body-sm font-medium text-center md:text-left", language === 'kn' && 'font-kannada')}>
              © {currentYear} {t.common.brandName}. {t.footer.rightsReserved}
            </p>

            {/* Developer Credit */}
            <div className="mt-4 pl-4 border-l-2 border-garjane-border-light dark:border-garjane-border-dark">
              <p className="text-body-sm font-heading font-bold text-[#172B4D] dark:text-white">{t.footer.websiteDeveloper}</p>
              <p className="text-body-sm text-[#172B4D] dark:text-slate-300 font-medium">
                <span className="font-semibold text-[#172B4D] dark:text-white">Thejas</span> — {t.footer.webDeveloperTitle}
              </p>
              <a
                href="mailto:thejasj2007@gmail.com"
                className="mt-2 flex items-center justify-center md:justify-start gap-2 text-body-sm text-[#172B4D] dark:text-slate-300 font-medium hover:text-garjane-primary dark:hover:text-garjane-primary-light transition-colors duration-200"
              >
                <Mail className="w-4 h-4 flex-shrink-0 text-garjane-primary" aria-hidden="true" />
                <span>thejasj2007@gmail.com</span>
              </a>
              <a
                href="tel:9343388333"
                className="flex items-center justify-center md:justify-start gap-2 text-body-sm text-[#172B4D] dark:text-slate-300 font-medium hover:text-garjane-primary dark:hover:text-garjane-primary-light transition-colors duration-200"
              >
                <Phone className="w-4 h-4 flex-shrink-0 text-garjane-primary" aria-hidden="true" />
                <span>9343388333</span>
              </a>
              <a
                href="https://www.linkedin.com/in/thejas-j-176855381/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center md:justify-start gap-2 text-body-sm text-[#172B4D] dark:text-slate-300 font-medium hover:text-garjane-primary dark:hover:text-garjane-primary-light transition-colors duration-200"
              >
                <Linkedin className="w-4 h-4 flex-shrink-0 text-garjane-primary" aria-hidden="true" />
                <span>LinkedIn</span>
              </a>
              <a
                href="https://github.com/ThejasJ2007"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center md:justify-start gap-2 text-body-sm text-[#172B4D] dark:text-slate-300 font-medium hover:text-garjane-primary dark:hover:text-garjane-primary-light transition-colors duration-200"
              >
                <Github className="w-4 h-4 flex-shrink-0 text-garjane-primary" aria-hidden="true" />
                <span>GitHub</span>
              </a>
              <p className="mt-3 text-body-sm text-[#172B4D] dark:text-slate-400 font-medium">{t.footer.designedAndDevelopedBy}</p>
            </div>
          </div>
          <div className="flex items-center gap-4 text-body-sm text-[#172B4D] dark:text-slate-400 font-medium">
            <Link href="/privacy" className="text-[#172B4D] dark:text-slate-400 hover:text-garjane-primary dark:hover:text-garjane-primary-light transition-colors duration-200">{t.footer.privacy}</Link>
            <span className="text-[#172B4D] dark:text-slate-600" aria-hidden="true">|</span>
            <Link href="/terms" className="text-[#172B4D] dark:text-slate-400 hover:text-garjane-primary dark:hover:text-garjane-primary-light transition-colors duration-200">{t.footer.terms}</Link>
            <span className="text-[#172B4D] dark:text-slate-600" aria-hidden="true">|</span>
            <Link href="/sitemap.xml" className="text-[#172B4D] dark:text-slate-400 hover:text-garjane-primary dark:hover:text-garjane-primary-light transition-colors duration-200">{t.footer.sitemap}</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}