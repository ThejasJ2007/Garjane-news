'use client';

import Link from 'next/link';
import { Mail, Phone, MapPin, Linkedin, Github } from 'lucide-react';
import { getSiteSettings } from '@/lib/data';

function FacebookIcon({ className = 'w-6 h-6' }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      width="24"
      height="24"
      className={className}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      focusable="false"
    >
      <circle cx="12" cy="12" r="12" fill="#1877F2" />
      <path
        d="M16.671 15.457l.532-3.47h-3.328v-2.25c0-.949.465-1.874 1.956-1.874h1.514V4.91s-1.374-.235-2.686-.235c-2.741 0-4.533 1.662-4.533 4.669v2.643H7.078v3.47h3.047v8.385a12.09 12.09 0 003.75 0v-8.385h2.796z"
        fill="#FFFFFF"
      />
    </svg>
  );
}

function XTwitterIcon({ className = 'w-[22px] h-[22px]' }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      width="22"
      height="22"
      className={className}
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      focusable="false"
    >
      <path
        d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"
        fill="#000000"
      />
    </svg>
  );
}

function InstagramIcon({ className = 'w-6 h-6' }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      width="24"
      height="24"
      className={className}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      focusable="false"
    >
      <defs>
        <linearGradient id="garjane-instagram-gradient" x1="0%" y1="100%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#fdf497" />
          <stop offset="5%" stopColor="#fdf497" />
          <stop offset="45%" stopColor="#fd5949" />
          <stop offset="60%" stopColor="#d6249f" />
          <stop offset="90%" stopColor="#285AEB" />
        </linearGradient>
      </defs>
      <rect width="24" height="24" rx="6.5" fill="url(#garjane-instagram-gradient)" />
      <rect
        x="5.25"
        y="5.25"
        width="13.5"
        height="13.5"
        rx="3.75"
        stroke="#FFFFFF"
        strokeWidth="1.75"
        fill="none"
      />
      <circle cx="12" cy="12" r="3.25" stroke="#FFFFFF" strokeWidth="1.75" fill="none" />
      <circle cx="15.8" cy="8.2" r="0.95" fill="#FFFFFF" />
    </svg>
  );
}

function YouTubeIcon({ className = 'w-6 h-6' }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      width="24"
      height="24"
      className={className}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      focusable="false"
    >
      <path
        d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814z"
        fill="#FF0000"
      />
      <path d="M9.545 15.568V8.432L15.818 12l-6.273 3.568z" fill="#FFFFFF" />
    </svg>
  );
}

interface FooterProps {
  siteSettings?: Awaited<ReturnType<typeof getSiteSettings>> | null;
}

export function Footer({ siteSettings }: FooterProps) {
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

  return (
    <footer className="bg-white text-[#172B4D] subpixel-antialiased border-t border-garjane-border-light" role="contentinfo">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 py-12 lg:py-16">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8 lg:gap-10">
          {/* Brand Column */}
          <div className="col-span-2 lg:col-span-2">
            <Link href="/" className="flex items-center gap-3 mb-5" aria-label="Garjane News Home">
              <div className="w-12 h-12 rounded-xl bg-garjane-primary flex items-center justify-center flex-shrink-0">
                <span className="text-garjane-primary-foreground font-heading font-bold text-2xl">ಗ</span>
              </div>
              <span className="font-heading font-bold text-headline-3 text-[#172B4D]">Garjane News</span>
            </Link>
            <p className="text-[#172B4D] text-body-sm font-medium mb-6 leading-relaxed max-w-xs font-kannada">
              {siteSettings?.taglineKn || 'ನಿಮ್ಮ ಊರಿನ ಸುದ್ದಿ, ನಿಮ್ಮ ಧ್ವನಿ'}
            </p>
            <div className="flex items-center gap-4">
              {/* Facebook */}
              <div className="relative group inline-flex items-center justify-center">
                <a
                  href={FACEBOOK_PAGE_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center rounded-full transition-all duration-200 ease-out hover:scale-[1.12] hover:drop-shadow-[0_0_16px_rgba(24,119,242,0.55)] active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-garjane-primary focus-visible:ring-offset-2"
                  aria-label="Facebook"
                >
                  <FacebookIcon className="w-6 h-6" />
                </a>
                <div
                  role="tooltip"
                  className="pointer-events-none absolute bottom-full left-1/2 z-30 mb-3 -translate-x-1/2 translate-y-1 scale-95 opacity-0 transition-all duration-200 ease-out group-hover:translate-y-0 group-hover:scale-100 group-hover:opacity-100"
                >
                  <div className="social-tooltip social-tooltip-facebook">
                    <span className="text-[13px] font-semibold text-[#0F172A] leading-tight whitespace-nowrap">
                      Follow us on
                    </span>
                    <span className="text-[14px] font-bold text-[#0F172A] leading-tight whitespace-nowrap">
                      Facebook
                    </span>
                    <svg
                      className="absolute -bottom-[8px] left-1/2 -translate-x-1/2 pointer-events-none"
                      width="18"
                      height="9"
                      viewBox="0 0 18 9"
                      fill="none"
                      aria-hidden="true"
                    >
                      <path
                        d="M1 0 L9 8 L17 0"
                        stroke="#1877f2"
                        strokeWidth="2"
                        fill="#ffffff"
                        strokeLinejoin="round"
                      />
                      <line x1="2" y1="0" x2="16" y2="0" stroke="#ffffff" strokeWidth="3" />
                    </svg>
                  </div>
                </div>
              </div>

              {/* X / Twitter */}
              <div className="relative group inline-flex items-center justify-center">
                <a
                  href={TWITTER_PAGE_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center rounded-sm transition-all duration-200 ease-out hover:scale-[1.12] hover:drop-shadow-[0_0_12px_rgba(0,0,0,0.35)] active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-garjane-primary focus-visible:ring-offset-2"
                  aria-label="X / Twitter"
                >
                  <XTwitterIcon className="w-[22px] h-[22px]" />
                </a>
                <div
                  role="tooltip"
                  className="pointer-events-none absolute bottom-full left-1/2 z-30 mb-3 -translate-x-1/2 translate-y-1 scale-95 opacity-0 transition-all duration-200 ease-out group-hover:translate-y-0 group-hover:scale-100 group-hover:opacity-100"
                >
                  <div className="social-tooltip social-tooltip-twitter">
                    <span className="text-[13px] font-semibold text-[#0F172A] leading-tight whitespace-nowrap">
                      Follow us on
                    </span>
                    <span className="text-[14px] font-bold text-[#0F172A] leading-tight whitespace-nowrap">
                      X
                    </span>
                    <svg
                      className="absolute -bottom-[8px] left-1/2 -translate-x-1/2 pointer-events-none"
                      width="18"
                      height="9"
                      viewBox="0 0 18 9"
                      fill="none"
                      aria-hidden="true"
                    >
                      <path
                        d="M1 0 L9 8 L17 0"
                        stroke="#000000"
                        strokeWidth="2"
                        fill="#ffffff"
                        strokeLinejoin="round"
                      />
                      <line x1="2" y1="0" x2="16" y2="0" stroke="#ffffff" strokeWidth="3" />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Instagram */}
              <div className="relative group inline-flex items-center justify-center">
                <a
                  href={INSTAGRAM_PAGE_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center rounded-[6px] transition-all duration-200 ease-out hover:scale-[1.12] hover:drop-shadow-[0_0_16px_rgba(214,41,159,0.60)] active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-garjane-primary focus-visible:ring-offset-2"
                  aria-label="Instagram"
                >
                  <InstagramIcon className="w-6 h-6" />
                </a>
                <div
                  role="tooltip"
                  className="pointer-events-none absolute bottom-full left-1/2 z-30 mb-3 -translate-x-1/2 translate-y-1 scale-95 opacity-0 transition-all duration-200 ease-out group-hover:translate-y-0 group-hover:scale-100 group-hover:opacity-100"
                >
                  <div className="social-tooltip social-tooltip-instagram">
                    <span className="text-[13px] font-semibold text-[#0F172A] leading-tight whitespace-nowrap">
                      Follow us on
                    </span>
                    <span className="text-[14px] font-bold text-[#0F172A] leading-tight whitespace-nowrap">
                      Instagram
                    </span>
                    <svg
                      className="absolute -bottom-[8px] left-1/2 -translate-x-1/2 pointer-events-none"
                      width="18"
                      height="9"
                      viewBox="0 0 18 9"
                      fill="none"
                      aria-hidden="true"
                    >
                      <path
                        d="M1 0 L9 8 L17 0"
                        stroke="#d6249f"
                        strokeWidth="2"
                        fill="#ffffff"
                        strokeLinejoin="round"
                      />
                      <line x1="2" y1="0" x2="16" y2="0" stroke="#ffffff" strokeWidth="3" />
                    </svg>
                  </div>
                </div>
              </div>

              {/* YouTube */}
              <div className="relative group inline-flex items-center justify-center">
                <a
                  href={YOUTUBE_PAGE_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center rounded-[6px] transition-all duration-200 ease-out hover:scale-[1.12] hover:drop-shadow-[0_0_16px_rgba(255,0,0,0.60)] active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-garjane-primary focus-visible:ring-offset-2"
                  aria-label="YouTube"
                >
                  <YouTubeIcon className="w-6 h-6" />
                </a>
                <div
                  role="tooltip"
                  className="pointer-events-none absolute bottom-full left-1/2 z-30 mb-3 -translate-x-1/2 translate-y-1 scale-95 opacity-0 transition-all duration-200 ease-out group-hover:translate-y-0 group-hover:scale-100 group-hover:opacity-100"
                >
                  <div className="social-tooltip social-tooltip-youtube">
                    <span className="text-[13px] font-semibold text-[#0F172A] leading-tight whitespace-nowrap">
                      Subscribe on
                    </span>
                    <span className="text-[14px] font-bold text-[#0F172A] leading-tight whitespace-nowrap">
                      YouTube
                    </span>
                    <svg
                      className="absolute -bottom-[8px] left-1/2 -translate-x-1/2 pointer-events-none"
                      width="18"
                      height="9"
                      viewBox="0 0 18 9"
                      fill="none"
                      aria-hidden="true"
                    >
                      <path
                        d="M1 0 L9 8 L17 0"
                        stroke="#ff0000"
                        strokeWidth="2"
                        fill="#ffffff"
                        strokeLinejoin="round"
                      />
                      <line x1="2" y1="0" x2="16" y2="0" stroke="#ffffff" strokeWidth="3" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Company Links */}
          <nav aria-label="Company">
            <h3 className="font-heading font-semibold text-lg text-[#172B4D] mb-4 relative pb-2">
              Company
              <span className="absolute bottom-0 left-0 w-6 h-0.5 bg-garjane-primary rounded-full" aria-hidden="true" />
            </h3>
            <ul className="space-y-3" role="list">
              {footerLinks.company.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-[#172B4D] hover:text-garjane-primary transition-colors duration-200 text-body-sm font-medium font-kannada">
                    {link.labelKn}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Editorial Links */}
          <nav aria-label="Editorial">
            <h3 className="font-heading font-semibold text-lg text-[#172B4D] mb-4 relative pb-2">
              Editorial
              <span className="absolute bottom-0 left-0 w-6 h-0.5 bg-garjane-primary rounded-full" aria-hidden="true" />
            </h3>
            <ul className="space-y-3" role="list">
              {footerLinks.editorial.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-[#172B4D] hover:text-garjane-primary transition-colors duration-200 text-body-sm font-medium font-kannada">
                    {link.labelKn}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Legal Links */}
          <nav aria-label="Legal">
            <h3 className="font-heading font-semibold text-lg text-[#172B4D] mb-4 relative pb-2">
              Legal
              <span className="absolute bottom-0 left-0 w-6 h-0.5 bg-garjane-primary rounded-full" aria-hidden="true" />
            </h3>
            <ul className="space-y-3" role="list">
              {footerLinks.legal.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-[#172B4D] hover:text-garjane-primary transition-colors duration-200 text-body-sm font-medium font-kannada">
                    {link.labelKn}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* For You Links */}
          <nav aria-label="For You">
            <h3 className="font-heading font-semibold text-lg text-[#172B4D] mb-4 relative pb-2">
              For You
              <span className="absolute bottom-0 left-0 w-6 h-0.5 bg-garjane-primary rounded-full" aria-hidden="true" />
            </h3>
            <ul className="space-y-3" role="list">
              {footerLinks.audience.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-[#172B4D] hover:text-garjane-primary transition-colors duration-200 text-body-sm font-medium font-kannada">
                    {link.labelKn}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Contact Us */}
          <div>
            <h3 className="font-heading font-semibold text-lg text-[#172B4D] mb-4 relative pb-2">
              Contact Us
              <span className="absolute bottom-0 left-0 w-6 h-0.5 bg-garjane-primary rounded-full" aria-hidden="true" />
            </h3>
            <address className="not-italic text-body-sm text-[#172B4D] space-y-3 font-kannada">
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 mt-0.5 flex-shrink-0 text-[#172B4D]" aria-hidden="true" />
                <span className="text-[#172B4D] font-medium leading-relaxed">{siteSettings?.descriptionKn || 'ನೆಲಮಂಗಲ, ಬೆಂಗಳೂರು ಗ್ರಾಮಾಂತರ ಹಾಗೂ ಕರ್ನಾಟಕದ ಸಮಗ್ರ, ನಿಖರ ಮತ್ತು ವಸ್ತುನಿಷ್ಠ ಸುದ್ದಿಗಳ ಮುಂಚೂಣಿ ತಾಣ.'}</span>
              </div>
              {contactEmail && (
                <a href={`mailto:${contactEmail}`} className="flex items-center gap-3 text-[#172B4D] hover:text-garjane-primary transition-colors duration-200">
                  <Mail className="w-5 h-5 flex-shrink-0 text-[#172B4D]" aria-hidden="true" />
                  <span className="text-[#172B4D] font-medium">{contactEmail}</span>
                </a>
              )}
              {contactPhone && (
                <a href={contactPhoneHref} className="flex items-center gap-3 text-[#172B4D] hover:text-garjane-primary transition-colors duration-200">
                  <Phone className="w-5 h-5 flex-shrink-0 text-[#172B4D]" aria-hidden="true" />
                  <span className="whitespace-nowrap text-[#172B4D] font-medium">{contactPhone}</span>
                </a>
              )}
            </address>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-10 lg:mt-12 pt-8 border-t border-garjane-border-light flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="text-center md:text-left">
            <p className="text-[#172B4D] text-body-sm font-medium text-center md:text-left font-kannada">
              © {currentYear} {siteSettings?.siteNameKn || 'ಗರ್ಜನೆ ನ್ಯೂಸ್'}. All rights reserved.
            </p>

            {/* Developer Credit */}
            <div className="mt-4 pl-4 border-l-2 border-garjane-border-light">
              <p className="text-body-sm font-heading font-bold text-[#172B4D]">Website Developer</p>
              <p className="text-body-sm text-[#172B4D] font-medium">
                <span className="font-semibold text-[#172B4D]">Thejas</span> — Web Developer &amp; Designer
              </p>
              <a
                href="mailto:thejasj2007@gmail.com"
                className="mt-2 flex items-center justify-center md:justify-start gap-2 text-body-sm text-[#172B4D] font-medium hover:text-garjane-primary transition-colors duration-200"
              >
                <Mail className="w-4 h-4 flex-shrink-0 text-[#172B4D]" aria-hidden="true" />
                <span className="text-[#172B4D]">thejasj2007@gmail.com</span>
              </a>
              <a
                href="tel:9343388333"
                className="flex items-center justify-center md:justify-start gap-2 text-body-sm text-[#172B4D] font-medium hover:text-garjane-primary transition-colors duration-200"
              >
                <Phone className="w-4 h-4 flex-shrink-0 text-[#172B4D]" aria-hidden="true" />
                <span className="text-[#172B4D]">9343388333</span>
              </a>
              <a
                href="https://www.linkedin.com/in/thejas-j-176855381/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center md:justify-start gap-2 text-body-sm text-[#172B4D] font-medium hover:text-garjane-primary transition-colors duration-200"
              >
                <Linkedin className="w-4 h-4 flex-shrink-0 text-[#172B4D]" aria-hidden="true" />
                <span className="text-[#172B4D]">LinkedIn</span>
              </a>
              <a
                href="https://github.com/ThejasJ2007"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center md:justify-start gap-2 text-body-sm text-[#172B4D] font-medium hover:text-garjane-primary transition-colors duration-200"
              >
                <Github className="w-4 h-4 flex-shrink-0 text-[#172B4D]" aria-hidden="true" />
                <span className="text-[#172B4D]">GitHub</span>
              </a>
              <p className="mt-3 text-body-sm text-[#172B4D] font-medium">Designed &amp; Developed by Thejas</p>
            </div>
          </div>
          <div className="flex items-center gap-4 text-body-sm text-[#172B4D] font-medium font-kannada">
            <Link href="/privacy" className="text-[#172B4D] hover:text-garjane-primary transition-colors duration-200">Privacy</Link>
            <span className="text-[#172B4D]" aria-hidden="true">|</span>
            <Link href="/terms" className="text-[#172B4D] hover:text-garjane-primary transition-colors duration-200">Terms</Link>
            <span className="text-[#172B4D]" aria-hidden="true">|</span>
            <Link href="/sitemap.xml" className="text-[#172B4D] hover:text-garjane-primary transition-colors duration-200">Sitemap</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}