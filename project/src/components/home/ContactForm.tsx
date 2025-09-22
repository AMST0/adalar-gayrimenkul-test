import React, { useState } from 'react';
import { Send, MapPin, Phone, Mail, Clock } from 'lucide-react';
import { useData } from '../../contexts/DataContext';
import Button from '../common/Button';
import { useLanguage } from '../../contexts/LanguageContext';

const ContactForm: React.FC = () => {
  const { addContactRequest } = useData();
  const { t } = useLanguage();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;

    setIsSubmitting(true);

    // Simulate form submission
    await new Promise(resolve => setTimeout(resolve, 1000));

    addContactRequest({
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      message: formData.message,
    });

    setFormData({ name: '', email: '', phone: '', message: '' });
              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                  {t.contactPage.form.phoneRequired}
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all duration-300"
                  placeholder={t.contactPage.form.phonePlaceholder}
                />
              </div>
    setIsSubmitted(true);
    setIsSubmitting(false);

    // Reset success message after 5 seconds
    setTimeout(() => setIsSubmitted(false), 5000);
  };

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-blue-900 mb-4">
            {t.contactPage.title}
          </h2>
          <p className="text-gray-600 text-lg">
            Size en uygun arsayı bulma konusunda yardımcı olmak için buradayız
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Form */}
          <div className="bg-white rounded-2xl shadow-xl p-8">
                          <h3 className="text-2xl font-bold text-blue-900 mb-6">{t.common.contactInfo}</h3>
            
            {isSubmitted && (
              <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg mb-6">
                {t.contactPage.form.successMessage}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                  {t.contactPage.form.name} *
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all duration-300"
                  placeholder={t.contactPage.form.namePlaceholder}
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  {t.contactPage.email} *
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all duration-300"
                  placeholder={t.contactPage.form.emailPlaceholder}
                />
              </div>


              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                  {t.contactPage.form.phoneRequired}
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all duration-300"
                  placeholder={t.contactPage.form.phonePlaceholder}
                />
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                  {t.contactPage.form.messageRequired}
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows={5}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all duration-300 resize-none"
                  placeholder={t.contactPage.form.messagePlaceholder}
                />
              </div>

              <Button
                type="submit"
                className="w-full flex items-center justify-center space-x-2"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <Send className="w-5 h-5" />
                    <span>{t.contactPage.form.sendMessage}</span>
                  </>
                )}
              </Button>
            </form>
          </div>

          {/* Contact Info & Map */}
          <div className="space-y-8">
            <div className="bg-white rounded-2xl shadow-xl p-8">
              <h3 className="text-2xl font-bold text-blue-900 mb-6">{t.common.contactInfo}</h3>
              
              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-amber-500 rounded-lg flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-blue-900 mb-1">Adres</h4>
                    <p className="text-gray-600">
                      Çınar Mahallesi, Rıfkı Tongsir Caddesi, <br />
                      Küçükyalı Nidapark Maltepe/İstanbul
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-gray-900 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Phone className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-blue-900 mb-1">{t.contactPage.phone}</h4>
                    <p className="text-gray-600">+90 216 382 1234</p>
                    <p className="text-gray-600">+90 555 123 4567</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-red-600 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Mail className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-blue-900 mb-1">{t.contactPage.email}</h4>
                    <p className="text-gray-600">info@adalargayrimenkul.com</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-green-600 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Clock className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-blue-900 mb-1">Çalışma Saatleri</h4>
                    <p className="text-gray-600">Pazartesi - Cumartesi: 09:00 - 18:00</p>
                    <p className="text-gray-600">Pazar: 10:00 - 16:00</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Google Maps */}
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d3014.592214979685!2d29.1201351!3d40.9473811!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x14cac763fb08f08b%3A0x699f8c8954c902a!2sAdalar+Gayrimenkul+Realty+World!5e0!3m2!1str!2str!4v1699000000000!5m2!1str!2str"
                width="100%"
                height="300"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Adalar Gayrimenkul Konum"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactForm;