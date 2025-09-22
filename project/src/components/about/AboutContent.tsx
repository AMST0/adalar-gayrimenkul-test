import React from 'react';
import { Target, Eye, Award, Users, Shield, Handshake } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';

const AboutContent: React.FC = () => {
  const { t } = useLanguage();
  
  const values = [
    {
      icon: Shield,
      title: t.aboutPage.reliability.title,
      description: t.aboutPage.reliability.description,
    },
    {
      icon: Handshake,
      title: t.aboutPage.customerFocus.title,
      description: t.aboutPage.customerFocus.description,
    },
    {
      icon: Award,
      title: t.aboutPage.professionalism.title,
      description: t.aboutPage.professionalism.description,
    },
    {
      icon: Users,
      title: 'Takım Çalışması',
      description: 'Güçlü ekibimizle müşterilerimize kapsamlı destek sağlıyorız.',
    },
  ];

  return (
    <div className="pt-24 pb-16">
      {/* Hero Section */}
      <section className="py-16 bg-gradient-to-r from-gray-900 to-gray-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 animate-fade-in">
              {t.aboutPage.title}
            </h1>
            <p className="text-xl md:text-2xl text-blue-200 leading-relaxed animate-slide-up">
              {t.aboutPage.heroDescription}
            </p>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Mission */}
            <div className="group hover:scale-105 transition-transform duration-500">
              <div className="bg-gradient-to-br from-amber-50 to-amber-100 p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-500">
                <div className="w-16 h-16 bg-amber-500 rounded-2xl flex items-center justify-center mb-6 group-hover:rotate-12 transition-transform duration-300">
                  <Target className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-blue-900 mb-4">
                  {t.aboutPage.mission}
                </h3>
                <p className="text-gray-700 text-lg leading-relaxed">
                  {t.aboutPage.missionDescription}
                </p>
              </div>
            </div>

            {/* Vision */}
            <div className="group hover:scale-105 transition-transform duration-500">
              <div className="bg-gradient-to-br from-gray-50 to-gray-100 p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-500">
                <div className="w-16 h-16 bg-blue-900 rounded-2xl flex items-center justify-center mb-6 group-hover:rotate-12 transition-transform duration-300">
                  <Eye className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-blue-900 mb-4">Vizyonumuz</h3>
                <p className="text-gray-700 text-lg leading-relaxed">
                  Adalar bölgesinde gayrimenkul sektörünün lider firması olmak, 
                  yenilikçi çözümlerimiz ve müşteri odaklı yaklaşımımızla sektöre yön vermek. 
                  Sürdürülebilir büyüme ile bölgenin gayrimenkul değerlerine katkı sağlamak.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-blue-900 mb-4">
              Değerlerimiz
            </h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              İş süreçlerimizde rehber olarak kabul ettiğimiz temel değerler
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <div
                key={index}
                className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-500 text-center group hover:scale-105"
                style={{
                  animationDelay: `${index * 200}ms`,
                  animation: 'fadeInUp 0.8s ease-out both',
                }}
              >
                <div className="w-16 h-16 bg-gradient-to-r from-gray-900 to-gray-800 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                  <value.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-blue-900 mb-4">{value.title}</h3>
                <p className="text-gray-600 leading-relaxed">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Company Story */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h2 className="text-3xl md:text-4xl font-bold text-blue-900">
                Hikayemiz
              </h2>
              <div className="space-y-4 text-gray-700 text-lg leading-relaxed">
                <p>
                  Adalar Gayrimenkul, 2008 yılında Adalar bölgesinin eşsiz güzelliklerini 
                  ve yatırım potansiyelini fark eden deneyimli gayrimenkul uzmanları 
                  tarafından kuruldu.
                </p>
                <p>
                  15 yılı aşkın sürede, bölgedeki en önemli arsa satışlarında yer aldık 
                  ve binlerce müşterimizin hayallerini gerçeğe dönüştürdük. Her geçen 
                  gün büyüyen ekibimiz ve artan deneyimimizle sektörde öncü olmaya devam ediyoruz.
                </p>
                <p>
                  Bugün, Adalar bölgesinin en güvenilir gayrimenkul firması olarak, 
                  müşterilerimize sadece arsa satışı değil, kapsamlı gayrimenkul 
                  danışmanlığı hizmeti sunuyoruz.
                </p>
              </div>
            </div>

            <div className="relative">
              <img
                src="https://images.pexels.com/photos/1438832/pexels-photo-1438832.jpeg?auto=compress&cs=tinysrgb&w=800"
                alt="Adalar Gayrimenkul Hikayesi"
                className="w-full h-96 object-cover rounded-2xl shadow-xl"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-gray-900/30 to-transparent rounded-2xl" />
              <div className="absolute bottom-6 left-6 bg-white/90 backdrop-blur-sm p-4 rounded-lg">
                <p className="font-bold text-blue-900 text-lg">15+ Yıl</p>
                <p className="text-gray-700">Sektör Deneyimi</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Statistics */}
      <section className="py-16 bg-gradient-to-r from-gray-900 to-gray-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Başarılarımız Rakamlarla
            </h2>
            <p className="text-gray-200 text-lg">
              15 yıllık yolculuğumuzda elde ettiğimiz başarılar
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { number: '500+', label: t.aboutPage.clients },
              { number: '1200+', label: t.common.successfulSales },
              { number: '50+', label: t.common.activeProjects },
              { number: '15+', label: t.aboutPage.experience },
            ].map((stat, index) => (
              <div key={index} className="text-center group">
                <div className="text-4xl md:text-5xl font-bold text-amber-500 mb-2 group-hover:scale-110 transition-transform duration-300">
                  {stat.number}
                </div>
                <div className="text-blue-200 font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes fade-in {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes slide-up {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fade-in {
          animation: fade-in 1s ease-out;
        }

        .animate-slide-up {
          animation: slide-up 1s ease-out 0.3s both;
        }
      `}</style>
    </div>
  );
};

export default AboutContent;