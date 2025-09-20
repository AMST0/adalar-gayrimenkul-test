import React from 'react';
import { Phone, Mail, Star, Award } from 'lucide-react';
import { useData } from '../../contexts/DataContext';

const FeaturedAgentCards: React.FC = () => {
  const { agents } = useData();
  const featuredAgents = agents.filter(agent => agent.isActive && agent.isFeatured);

  if (featuredAgents.length === 0) return null;

  return (
    <section className="py-16 bg-gradient-to-br from-blue-900 via-blue-800 to-blue-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            BROKERLARIMIZ
          </h2>
          <p className="text-blue-200 text-lg max-w-2xl mx-auto">
            Alanında uzman, deneyimli danışmanlarımız sizin için en uygun çözümleri üretiyor
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {featuredAgents.map((agent, index) => (
            <div
              key={agent.id}
              className="group relative"
              style={{
                animationDelay: `${index * 200}ms`,
                animation: 'fadeInUp 0.8s ease-out both',
              }}
            >
              <div className="bg-white text-gray-900 rounded-3xl overflow-hidden shadow-2xl hover:shadow-3xl transition-all duration-700 transform hover:scale-105">
                {/* Agent Image */}
                <div className="relative h-80 overflow-hidden">
                  <img
                    src={agent.image}
                    alt={agent.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                  
                  {/* Experience Badge */}
                  <div className="absolute top-4 right-4 bg-amber-500 text-white px-3 py-1 rounded-full text-sm font-bold flex items-center">
                    <Star className="w-4 h-4 mr-1" />
                    {agent.experience}
                  </div>

                  {/* Contact Overlay */}
                  <div className="absolute bottom-4 left-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                    <div className="flex space-x-2">
                      <a
                        href={`tel:${agent.phone}`}
                        className="flex-1 bg-amber-500 text-white py-2 px-3 rounded-lg font-semibold text-center text-sm hover:bg-amber-600 transition-colors"
                      >
                        Ara
                      </a>
                      <a
                        href={`mailto:${agent.email}`}
                        className="flex-1 bg-blue-900 text-white py-2 px-3 rounded-lg font-semibold text-center text-sm hover:bg-blue-800 transition-colors"
                      >
                        Mail
                      </a>
                    </div>
                  </div>
                </div>

                {/* Agent Info */}
                <div className="p-6">
                  <div className="flex items-center mb-3">
                    <Award className="w-5 h-5 text-amber-500 mr-2" />
                    <span className="text-amber-600 font-semibold text-sm">Uzman Danışman</span>
                  </div>
                  
                  <h3 className="text-2xl font-bold text-blue-900 mb-2">{agent.name}</h3>
                  <p className="text-gray-600 mb-4">{agent.title}</p>

                  {/* Specialties */}
                  <div className="flex flex-wrap gap-2 mb-6">
                    {agent.specialties.map((specialty, idx) => (
                      <span
                        key={idx}
                        className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-xs font-medium"
                      >
                        {specialty}
                      </span>
                    ))}
                  </div>

                  {/* Contact Info */}
                  <div className="space-y-2">
                    <div className="flex items-center text-gray-600 text-sm">
                      <Phone className="w-4 h-4 mr-2 text-amber-500" />
                      {agent.phone}
                    </div>
                    <div className="flex items-center text-gray-600 text-sm">
                      <Mail className="w-4 h-4 mr-2 text-amber-500" />
                      {agent.email}
                    </div>
                  </div>

                  {/* Portfolio Link */}
                  <div className="mt-6">
                    <a
                      href={agent.portfolioUrl || 'https://adalargayrimenkul.sahibinden.com/'}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full block py-4 px-6 rounded-lg transition-transform duration-300 text-center transform hover:scale-105 flex items-center justify-center min-h-[60px]"
                      style={{ backgroundColor: 'rgba(253, 231, 4)' }}
                    >
                      <img 
                        src="https://i.tgrthaber.com/images/haberler/2021_09/xbuyuk/sahibinden-kimin-kime-ait-taner-aksoy-kimdir--1632839994.jpg"
                        alt="Sahibinden.com Portföyü"
                        className="h-10 w-full object-contain rounded"
                      />
                    </a>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <style>{`
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
      `}</style>
    </section>
  );
};

export default FeaturedAgentCards;