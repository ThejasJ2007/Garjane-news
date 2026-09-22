import { Metadata } from 'next';
import { Mail, Phone, MapPin, MessageSquare, Clock } from 'lucide-react';
import { ContactForm } from '@/components/contact/ContactForm';

export const metadata: Metadata = {
  title: 'ಸಂಪರ್ಕಿಸಿ | Contact Us - Garjane News',
  description: 'Contact Garjane News Nelamangala office for news tips, queries, and editorial feedback.',
};

export default function ContactPage() {
  return (
    <div className="w-full py-12 lg:py-16">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <span className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-garjane-primary/10 text-garjane-primary text-caption font-semibold mb-3">
            <MessageSquare className="w-4 h-4" /> 24x7 ಸುದ್ದಿ ಸಹಾಯವಾಣಿ
          </span>
          <h1 className="text-headline-2 lg:text-headline-1 font-heading font-bold text-garjane-text-primary dark:text-garjane-text-inverse mb-3">
            ನಮ್ಮನ್ನು ಸಂಪರ್ಕಿಸಿ / Contact Us
          </h1>
          <p className="text-body-lg text-garjane-text-secondary dark:text-garjane-text-muted">
            ನಿಮ್ಮ ಪ್ರದೇಶದ ಸುದ್ದಿ, ಸಮಸ್ಯೆ ಅಥವಾ ಸಲಹೆಗಳನ್ನು Garjane News ಸಂಪಾದಕೀಯ ಮಂಡಳಿಗೆ ತಲುಪಿಸಿ
          </p>
        </div>

        <div className="grid lg:grid-cols-12 gap-10">
          {/* Contact Details Column */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-garjane-background-card dark:bg-garjane-background-cardDark p-8 rounded-3xl border border-garjane-border-light dark:border-garjane-border-dark shadow-card space-y-6">
              <h2 className="text-headline-4 font-heading font-bold text-garjane-text-primary dark:text-garjane-text-inverse border-b border-garjane-border-light dark:border-garjane-border-dark pb-4">
                ಕಚೇರಿ ವಿಳಾಸ / Editorial Office
              </h2>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-garjane-primary/10 text-garjane-primary flex items-center justify-center flex-shrink-0 mt-1">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-semibold text-body">ಮುಖ್ಯ ಕಚೇರಿ / Head Office</h3>
                  <address className="not-italic text-body-sm text-garjane-text-muted mt-1 leading-relaxed">
                    Garjane News ಮೀಡಿಯಾ ಹೌಸ್,<br />
                    ಬೆಂಗಳೂರು-ತುಮಕೂರು ಮುಖ್ಯ ರಸ್ತೆ,<br />
                    ನೆಲಮಂಗಲ ಟೌನ್, ಬೆಂಗಳೂರು ಗ್ರಾಮಾಂತರ - 562123<br />
                    ಕರ್ನಾಟಕ, ಭಾರತ.
                  </address>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center flex-shrink-0 mt-1">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-semibold text-body">ದೂರವಾಣಿ / News Tips Hotline</h3>
                  <p className="text-body-sm text-garjane-text-muted mt-1">
                    <a href="tel:+919845012345" className="hover:text-garjane-primary font-medium">+91 98450 12345</a><br />
                    <span className="text-caption">WhatsApp: +91 98450 12345</span>
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center flex-shrink-0 mt-1">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-semibold text-body">ಇಮೇಲ್ ವಿಳಾಸ / Email</h3>
                  <p className="text-body-sm text-garjane-text-muted mt-1">
                    ಸಂಪಾದಕರು: <a href="mailto:editor@garjanenews.com" className="hover:text-garjane-primary font-medium">editor@garjanenews.com</a><br />
                    ಜಾಹೀರಾತು: <a href="mailto:ads@garjanenews.com" className="hover:text-garjane-primary font-medium">ads@garjanenews.com</a>
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-600 dark:text-purple-400 flex items-center justify-center flex-shrink-0 mt-1">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-semibold text-body">ಕಾರ್ಯನಿರ್ವಹಣಾ ಸಮಯ / Hours</h3>
                  <p className="text-body-sm text-garjane-text-muted mt-1">
                    ಸುದ್ದಿ ಡೆಸ್ಕ್: ದಿನದ 24 ಗಂಟೆಯೂ ಸಕ್ರಿಯ<br />
                    ಕಚೇರಿ ಭೇಟಿ: ಸೋಮ - ಶನಿ, ಬೆಳಗ್ಗೆ 9:30 - ಸಂಜೆ 6:30
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form Column */}
          <div className="lg:col-span-7">
            <div className="bg-garjane-background-card dark:bg-garjane-background-cardDark p-8 lg:p-10 rounded-3xl border border-garjane-border-light dark:border-garjane-border-dark shadow-card">
              <h2 className="text-headline-3 font-heading font-bold text-garjane-text-primary dark:text-garjane-text-inverse mb-2">
                ಸುದ್ದಿ ಅಥವಾ ಸಂದೇಶ ಕಳುಹಿಸಿ / Send a Message
              </h2>
              <p className="text-body-sm text-garjane-text-muted mb-8">
                ನಿಮ್ಮ ಸುದ್ದಿ ಮಾಹಿತಿಗಳನ್ನು ನಮ್ಮ ಸಂಪಾದಕೀಯ ತಂಡವು ಪರಿಶೀಲಿಸಿ ಪ್ರಕಟಿಸುತ್ತದೆ.
              </p>

              <ContactForm />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
