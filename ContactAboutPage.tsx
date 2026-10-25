import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Mail, 
  Phone, 
  MapPin, 
  Clock, 
  Send, 
  ArrowUpRight, 
  CheckCircle2, 
  Edit3, 
  Save, 
  Globe2,
  ShieldCheck,
  Building
} from 'lucide-react';

export const ContactAboutPage: React.FC = () => {
  const { t, language, showToast } = useApp();

  // Contact Form
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  // Configurable Social Links (with live editing for the gallery owner)
  const [isEditingSocials, setIsEditingSocials] = useState(false);
  const [socialLinks, setSocialLinks] = useState({
    telegram: 'https://t.me/binitartvista',
    youtube: 'https://youtube.com/@binitartvista',
    facebook: 'https://facebook.com/binitartvista',
    instagram: 'https://instagram.com/binit_artvista',
    tiktok: 'https://tiktok.com/@binitartvista'
  });

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !message) return;
    setSubmitted(true);
    showToast(t.contact.msgSent);
    setName('');
    setEmail('');
    setSubject('');
    setMessage('');
  };

  const handleSaveSocials = (e: React.FormEvent) => {
    e.preventDefault();
    setIsEditingSocials(false);
    showToast('Social channel links updated successfully!');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-14">
      {/* 1. Curatorial Mission & About the Gallery */}
      <section className="bg-white rounded-2xl p-6 sm:p-10 border border-stone-200/90 shadow-xs">
        <div className="max-w-3xl space-y-4">
          <span className="text-xs uppercase tracking-widest text-amber-800 font-semibold block">
            Curatorial Statement & Heritage
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-stone-900 tracking-tight leading-tight">
            About BiniT ArtVista Gallery
          </h1>
          <p className="text-sm sm:text-base text-stone-700 leading-relaxed">
            {language === 'am'
              ? 'ቢኒት አርትቪስታ ጋለሪ በኢትዮጵያና በመላው አፍሪካ የሚገኙ ድንቅ የጥበብ ሰዎችን ስራዎች ለዓለም የሚያስተዋውቅና የሚያገናኝ የጥበብ ማዕከል ነው። ከባህላዊ የቡና ሥነ-ስርዓት ሥዕሎች ጀምሮ እስከ ታሪካዊ የላሊበላና የሰሜን ተራሮች የፎቶግራፍ ድንቅ እይታዎች፣ የቀጥታ የስቱዲዮ ቪዲዮዎችና ዲጂታል ስብስቦች ድረስ በጥራት አዘጋጅተን እናቀርባለን።'
              : 'Founded as a bridge between age-old Ethiopian cultural iconography and the contemporary global marketplace, BiniT ArtVista Gallery curates rare oil on hand-woven linen, selenium-toned darkroom photography, lost-wax bronze sculptures, and master digital assets.'}
          </p>
          <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
            Every original physical piece is crated in compliance with international conservation standards, accompanied by a verified Certificate of Authenticity and an unbroken provenance record.
          </p>
        </div>

        {/* Gallery Attributes */}
        <div className="mt-8 pt-6 border-t border-stone-100 grid grid-cols-1 sm:grid-cols-3 gap-6 text-xs">
          <div className="flex items-start gap-3">
            <Building className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
            <div>
              <strong className="text-stone-900 block font-serif text-sm">Addis Ababa Pavilion</strong>
              <p className="text-stone-500 mt-0.5">Physical gallery space for private viewing and vernissages.</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <ShieldCheck className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
            <div>
              <strong className="text-stone-900 block font-serif text-sm">Authenticity Guarantee</strong>
              <p className="text-stone-500 mt-0.5">Dual-embossed provenance certificates on archival cotton rag.</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <Globe2 className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
            <div>
              <strong className="text-stone-900 block font-serif text-sm">Global Insured Dispatch</strong>
              <p className="text-stone-500 mt-0.5">Climate-controlled international logistics and tracking.</p>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Contact Details & Configurable Social Links */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left: Contact Info & Configurable Social Links */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-stone-900 text-stone-200 rounded-2xl p-6 sm:p-8 space-y-6">
            <h2 className="font-serif text-2xl font-bold text-white">
              {t.contact.title}
            </h2>

            <div className="space-y-4 text-xs sm:text-sm">
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-white block font-medium">{t.contact.location}</strong>
                  <p className="text-stone-400 mt-0.5 leading-relaxed">{t.contact.locationAddress}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Clock className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-white block font-medium">{t.contact.hours}</strong>
                  <p className="text-stone-400 mt-0.5">{t.contact.hoursDetails}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Mail className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-white block font-medium">Email</strong>
                  <p className="text-stone-400 mt-0.5">{t.contact.email}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Phone className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-white block font-medium">Telephone</strong>
                  <p className="text-stone-400 mt-0.5">{t.contact.phone}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Official Social Links (Configurable with edit option) */}
          <div className="bg-white rounded-2xl p-6 border border-stone-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-stone-100">
              <h3 className="font-serif text-lg font-bold text-stone-900">
                {t.contact.socialLinks}
              </h3>
              <button
                onClick={() => setIsEditingSocials(!isEditingSocials)}
                className="text-xs text-amber-800 hover:text-amber-900 font-semibold flex items-center gap-1 cursor-pointer"
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>{isEditingSocials ? 'Cancel' : 'Configure URLs'}</span>
              </button>
            </div>

            {isEditingSocials ? (
              <form onSubmit={handleSaveSocials} className="space-y-3 text-xs">
                <div>
                  <label className="block text-stone-600 mb-1 font-mono">Telegram URL</label>
                  <input
                    type="url"
                    value={socialLinks.telegram}
                    onChange={(e) => setSocialLinks({ ...socialLinks, telegram: e.target.value })}
                    className="w-full bg-[#FAF8F5] border border-stone-300 rounded-lg p-2 text-stone-900"
                  />
                </div>
                <div>
                  <label className="block text-stone-600 mb-1 font-mono">YouTube URL</label>
                  <input
                    type="url"
                    value={socialLinks.youtube}
                    onChange={(e) => setSocialLinks({ ...socialLinks, youtube: e.target.value })}
                    className="w-full bg-[#FAF8F5] border border-stone-300 rounded-lg p-2 text-stone-900"
                  />
                </div>
                <div>
                  <label className="block text-stone-600 mb-1 font-mono">TikTok URL</label>
                  <input
                    type="url"
                    value={socialLinks.tiktok}
                    onChange={(e) => setSocialLinks({ ...socialLinks, tiktok: e.target.value })}
                    className="w-full bg-[#FAF8F5] border border-stone-300 rounded-lg p-2 text-stone-900"
                  />
                </div>
                <div>
                  <label className="block text-stone-600 mb-1 font-mono">Instagram URL</label>
                  <input
                    type="url"
                    value={socialLinks.instagram}
                    onChange={(e) => setSocialLinks({ ...socialLinks, instagram: e.target.value })}
                    className="w-full bg-[#FAF8F5] border border-stone-300 rounded-lg p-2 text-stone-900"
                  />
                </div>
                <div>
                  <label className="block text-stone-600 mb-1 font-mono">Facebook URL</label>
                  <input
                    type="url"
                    value={socialLinks.facebook}
                    onChange={(e) => setSocialLinks({ ...socialLinks, facebook: e.target.value })}
                    className="w-full bg-[#FAF8F5] border border-stone-300 rounded-lg p-2 text-stone-900"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-2 bg-stone-900 text-white rounded-lg font-semibold flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Save className="w-3.5 h-3.5 text-amber-400" />
                  <span>Save Official URLs</span>
                </button>
              </form>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                {[
                  { name: 'Telegram', url: socialLinks.telegram },
                  { name: 'YouTube', url: socialLinks.youtube },
                  { name: 'TikTok', url: socialLinks.tiktok },
                  { name: 'Instagram', url: socialLinks.instagram },
                  { name: 'Facebook', url: socialLinks.facebook }
                ].map((channel) => (
                  <a
                    key={channel.name}
                    href={channel.url}
                    target="_blank"
                    rel="noreferrer"
                    className="p-2.5 rounded-lg border border-stone-200 bg-stone-50 hover:bg-stone-100 flex items-center justify-between text-stone-800 transition-colors"
                  >
                    <span className="font-medium">{channel.name}</span>
                    <ArrowUpRight className="w-3.5 h-3.5 text-stone-400" />
                  </a>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right: Interactive Contact Form */}
        <div className="lg:col-span-7 bg-white rounded-2xl p-6 sm:p-8 border border-stone-200 shadow-xs">
          <h2 className="font-serif text-2xl font-bold text-stone-900 mb-2">
            {t.contact.sendMessage}
          </h2>
          <p className="text-xs text-stone-500 mb-6">
            Inquire about upcoming exhibitions, request a catalog dossier, or connect with our curatorial directors.
          </p>

          {submitted && (
            <div className="mb-6 p-4 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center gap-3 text-xs text-emerald-900 animate-in fade-in">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
              <div>
                <strong>Message Dispatched</strong>
                <p className="mt-0.5">{t.contact.msgSent}</p>
              </div>
            </div>
          )}

          <form onSubmit={handleSendMessage} className="space-y-4 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-stone-700 font-medium mb-1">
                  {t.contact.nameField} *
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Almaz Tadesse"
                  className="w-full bg-[#FAF8F5] border border-stone-300 rounded-xl px-3.5 py-2.5 text-stone-900 focus:outline-stone-900 text-xs sm:text-sm"
                />
              </div>

              <div>
                <label className="block text-stone-700 font-medium mb-1">
                  {t.contact.emailField} *
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="almaz@example.com"
                  className="w-full bg-[#FAF8F5] border border-stone-300 rounded-xl px-3.5 py-2.5 text-stone-900 focus:outline-stone-900 text-xs sm:text-sm"
                />
              </div>
            </div>

            <div>
              <label className="block text-stone-700 font-medium mb-1">
                {t.contact.subjectField}
              </label>
              <input
                type="text"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="Private acquisition inquiry / Exhibition curation"
                className="w-full bg-[#FAF8F5] border border-stone-300 rounded-xl px-3.5 py-2.5 text-stone-900 focus:outline-stone-900 text-xs sm:text-sm"
              />
            </div>

            <div>
              <label className="block text-stone-700 font-medium mb-1">
                {t.contact.messageField} *
              </label>
              <textarea
                required
                rows={5}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Type your message, questions regarding provenance, framing, or custom inquiries..."
                className="w-full bg-[#FAF8F5] border border-stone-300 rounded-xl px-3.5 py-2.5 text-stone-900 focus:outline-stone-900 leading-relaxed text-xs sm:text-sm"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-stone-900 hover:bg-stone-800 text-white font-semibold rounded-xl flex items-center justify-center gap-2 transition-colors cursor-pointer shadow-sm text-sm"
            >
              <Send className="w-4 h-4 text-amber-400" />
              <span>{t.contact.sendBtn}</span>
            </button>
          </form>
        </div>
      </section>
    </div>
  );
};
