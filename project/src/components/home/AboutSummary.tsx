import React from 'react';
import { Target, Eye, Award, Users } from 'lucide-react';

const AboutSummary: React.FC = () => {
  const stats = [
    { icon: Users, number: '500+', label: 'Mutlu Müşteri' },
    { icon: Award, number: '15+', label: 'Yıl Tecrübe' },
    { icon: Target, number: '1200+', label: 'Başarılı Satış' },
    { icon: Eye, number: '50+', label: 'Aktif Proje' },
  ];

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <div className="space-y-6">
            <div className="space-y-4">
              <span className="text-amber-500 font-semibold text-lg">Biz Kimiz</span>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 leading-tight">
                Adalar'ın Güvenilir Gayrimenkul Partneri
              </h2>
              <p className="text-gray-600 text-lg leading-relaxed">
                15 yılı aşkın deneyimimizle Adalar bölgesinde gayrimenkul sektöründe 
                öncü bir firmayız. Müşteri memnuniyetini her zaman ön planda tutarak, 
                hayallerinizdeki arsayı bulmanızda size eşlik ediyoruz.
              </p>
            </div>

            <div className="space-y-4">
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-amber-500 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Target className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Misyonumuz</h3>
                  <p className="text-gray-600">
                    Müşterilerimizin emlak yatırımlarında en doğru kararları vermelerini sağlamak.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-gray-900 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Eye className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Vizyonumuz</h3>
                  <p className="text-gray-600">
                    Adalar bölgesinde gayrimenkul sektörünün lider firması olmak.
                  </p>
                </div>
              </div>
            </div>

            <div className="pt-4">
              <a
                href="/biz-kimiz"
                className="bg-gray-900 text-white px-8 py-3 rounded-lg font-semibold hover:bg-gray-800 transform hover:scale-105 transition-all duration-300 shadow-md hover:shadow-lg inline-flex items-center"
              >
                Daha Fazla Bilgi
              </a>
            </div>
          </div>

          {/* Stats & Image */}
          <div className="space-y-8">
            <div className="relative">
              <img
                src="https://images.pexels.com/photos/1029599/pexels-photo-1029599.jpeg?auto=compress&cs=tinysrgb&w=800"
                alt="Adalar Gayrimenkul Ofis"
                className="w-full h-80 object-cover rounded-2xl shadow-xl"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-gray-900/50 to-transparent rounded-2xl" />
            </div>

            <div className="grid grid-cols-2 gap-6">
              {stats.map((stat, index) => (
                <div
                  key={index}
                  className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 text-center group hover:scale-105"
                >
                  <div className="w-12 h-12 bg-gradient-to-r from-amber-500 to-amber-600 rounded-lg flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                    <stat.icon className="w-6 h-6 text-white" />
                  </div>
                  <p className="text-2xl font-bold text-gray-900 mb-1">{stat.number}</p>
                  <p className="text-gray-600 text-sm font-medium">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSummary;