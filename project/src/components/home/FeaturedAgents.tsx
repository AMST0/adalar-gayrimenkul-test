import React from 'react';
import { Phone, Mail, Star } from 'lucide-react';
import { useData } from '../../contexts/DataContext';
import { useLanguage } from '../../contexts/LanguageContext';

const FeaturedAgents: React.FC = () => {
  const { agents } = useData();
  const { t } = useLanguage();
  const featuredAgents = agents.filter(agent => agent.isActive && agent.isFeatured);

  if (featuredAgents.length === 0) return null;

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            {t.agent.featuredAgents}
          </h2>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Adalar'ın en deneyimli gayrimenkul uzmanları ile rüya arsanızı bulun
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {featuredAgents.map((agent, index) => (
            <div
              key={agent.id}
              className="group bg-gradient-to-br from-white to-gray-50 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden transform hover:scale-105"
              style={{
                animationDelay: `${index * 200}ms`,
                animation: 'fadeInUp 0.8s ease-out both',
              }}
            >
              <div className="relative">
                <div className="h-64 overflow-hidden">
                  <img
                    src={agent.image}
                    alt={agent.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                </div>
                <div className="absolute top-4 right-4 bg-amber-500 text-white px-3 py-1 rounded-full text-sm font-semibold flex items-center">
                  <Star className="w-4 h-4 mr-1" />
                  {t.agent.specialist}
                </div>
              </div>
              
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-1">{agent.name}</h3>
                <p className="text-gray-600 mb-3">{agent.title}</p>
                <p className="text-sm text-amber-600 font-semibold mb-4">
                  {agent.experience} deneyim
                </p>
                
                <div className="flex flex-wrap gap-2 mb-4">
                  {agent.specialties.slice(0, 2).map((specialty, idx) => (
                    <span
                      key={idx}
                      className="bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-sm font-medium"
                    >
                      {specialty}
                    </span>
                  ))}
                </div>
                
                <div className="space-y-2 mb-6">
                  <div className="flex items-center text-gray-600 text-sm">
                    <Phone className="w-4 h-4 mr-2 text-amber-500" />
                    {agent.phone}
                  </div>
                  <div className="flex items-center text-gray-600 text-sm">
                    <Mail className="w-4 h-4 mr-2 text-amber-500" />
                    {agent.email}
                  </div>
                </div>
                
                <div className="flex space-x-3">
                  <a
                    href={`tel:${agent.phone}`}
                    className="flex-1 bg-amber-500 text-white py-2 px-4 rounded-lg font-semibold hover:bg-amber-600 transition-colors duration-300 text-center text-sm flex items-center justify-center"
                  >
                    {t.buttons.call}
                  </a>
                  <a
                    href={`/danismanlar/${agent.id}`}
                    className="flex-1 border-2 border-gray-900 text-gray-900 py-2 px-4 rounded-lg font-semibold hover:bg-gray-900 hover:text-white transition-colors duration-300 text-center text-sm"
                  >
                    {t.buttons.profile}
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <a
            href="/danismanlar"
            className="bg-gray-900 text-white px-8 py-3 rounded-lg font-semibold hover:bg-gray-800 transform hover:scale-105 transition-all duration-300 shadow-md hover:shadow-lg inline-flex items-center"
          >
            {t.buttons.viewAllAgents}
          </a>
        </div>
      </div>
    </section>
  );
};

export default FeaturedAgents;