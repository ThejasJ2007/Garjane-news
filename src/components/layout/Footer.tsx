'use client';

import Link from 'next/link';
import { Facebook, Twitter, Instagram, Youtube, Mail, Phone, MapPin } from 'lucide-react';
import { getSiteSettings } from '@/lib/data';

interface FooterProps {
  siteSettings?: Awaited<ReturnType<typeof getSiteSettings>> | null;
}

export function Footer({ siteSettings }: FooterProps) {
  const socialLinks = siteSettings?.socialLinks as Record<string, string> | null;
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
    <footer className="bg-garjane-secondary text-garjane-secondary-foreground" role="contentinfo">
      <div className="container mx-auto px-4 py-16 lg:py-20">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8 lg:gap-12">
          {/* Brand Column */}
          <div className="col-span-2 lg:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-4" aria-label="Garjane News Home">
              <div className="w-10 h-10 rounded-lg bg-garjane-primary flex items-center justify-center">
                <span className="text-garjane-primary-foreground font-heading font-bold text-2xl">ಗ</span>
              </div>
              <span className="font-heading font-bold text-headline-4">Garjane News</span>
            </Link>
            <p className="text-garjane-secondary-light/80 text-body-sm mb-6 leading-relaxed">
              {siteSettings?.taglineKn || 'ನಿಮ್ಮ ಊರಿನ ಸುದ್ದಿ, ನಿಮ್ಮ ಧ್ವನಿ'}
            </p>
            <div className="flex items-center gap-4">
              {socialLinks?.facebook && (
                <a href={socialLinks.facebook} target="_blank" rel="noopener noreferrer" className="text-garjane-secondary-light/60 hover:text-garjane-accent transition-colors" aria-label="Facebook">
                  <Facebook className="w-5 h-5" />
                </a>
              )}
              {socialLinks?.twitter && (
                <a href={socialLinks.twitter} target="_blank" rel="noopener noreferrer" className="text-garjane-secondary-light/60 hover:text-garjane-accent transition-colors" aria-label="Twitter">
                  <Twitter className="w-5 h-5" />
                </a>
              )}
              {socialLinks?.instagram && (
                <a href={socialLinks.instagram} target="_blank" rel="noopener noreferrer" className="text-garjane-secondary-light/60 hover:text-garjane-accent transition-colors" aria-label="Instagram">
                  <Instagram className="w-5 h-5" />
                </a>
              )}
              {socialLinks?.youtube && (
                <a href={socialLinks.youtube} target="_blank" rel="noopener noreferrer" className="text-garjane-secondary-light/60 hover:text-garjane-accent transition-colors" aria-label="YouTube">
                  <Youtube className="w-5 h-5" />
                </a>
              )}
            </div>
          </div>

          {/* Company Links */}
          <nav aria-label="Company">
            <h3 className="font-heading font-semibold text-lg mb-4">Company</h3>
            <ul className="space-y-2" role="list">
              {footerLinks.company.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-garjane-secondary-light/70 hover:text-garjane-accent transition-colors text-body-sm">
                    {link.labelKn}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Editorial Links */}
          <nav aria-label="Editorial">
            <h3 className="font-heading font-semibold text-lg mb-4">Editorial</h3>
            <ul className="space-y-2" role="list">
              {footerLinks.editorial.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-garjane-secondary-light/70 hover:text-garjane-accent transition-colors text-body-sm">
                    {link.labelKn}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Legal Links */}
          <nav aria-label="Legal">
            <h3 className="font-heading font-semibold text-lg mb-4">Legal</h3>
            <ul className="space-y-2" role="list">
              {footerLinks.legal.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-garjane-secondary-light/70 hover:text-garjane-accent transition-colors text-body-sm">
                    {link.labelKn}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Audience Links & Contact */}
          <div>
            <h3 className="font-heading font-semibold text-lg mb-4">For You</h3>
            <ul className="space-y-2 mb-6" role="list">
              {footerLinks.audience.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-garjane-secondary-light/70 hover:text-garjane-accent transition-colors text-body-sm">
                    {link.labelKn}
                  </Link>
                </li>
              ))}
            </ul>

            <h3 className="font-heading font-semibold text-lg mb-4">Contact Us</h3>
            <address className="not-italic text-body-sm text-garjane-secondary-light/70 space-y-2">
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" aria-hidden="true" />
                <span>{siteSettings?.descriptionKn || 'Karnataka, India'}</span>
              </div>
              {siteSettings?.socialLinks && (siteSettings.socialLinks as Record<string, string>).email && (
                <a href={`mailto:${(siteSettings.socialLinks as Record<string, string>).email}`} className="flex items-center gap-2 hover:text-garjane-accent transition-colors">
                  <Mail className="w-4 h-4 flex-shrink-0" aria-hidden="true" />
                  <span>{(siteSettings.socialLinks as Record<string, string>).email}</span>
                </a>
              )}
              {siteSettings?.socialLinks && (siteSettings.socialLinks as Record<string, string>).phone && (
                <a href={`tel:${(siteSettings.socialLinks as Record<string, string>).phone}`} className="flex items-center gap-2 hover:text-garjane-accent transition-colors">
                  <Phone className="w-4 h-4 flex-shrink-0" aria-hidden="true" />
                  <span>{(siteSettings.socialLinks as Record<string, string>).phone}</span>
                </a>
              )}
            </address>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-garjane-secondary-light/20 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-garjane-secondary-light/60 text-body-sm text-center md:text-left">
            © {currentYear} {siteSettings?.siteNameKn || 'Garjane News'}. All rights reserved.
          </p>
          <div className="flex items-center gap-6 text-body-sm text-garjane-secondary-light/60">
            <Link href="/privacy" className="hover:text-garjane-accent transition-colors">Privacy</Link>
            <Link href="/terms" className="hover:text-garjane-accent transition-colors">Terms</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}