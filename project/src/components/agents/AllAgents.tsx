import React, { useState } from 'react';
import { Phone, Mail, User, ChevronLeft, ChevronRight } from 'lucide-react';
import { useData } from '../../contexts/DataContext';

const AllAgents: React.FC = () => {
  const { agents } = useData();
  const [currentPage, setCurrentPage] = useState(0);
  const activeAgents = agents.filter(agent => agent.isActive && !agent.isFeatured);
  const itemsPerPage = 6;
  const totalPages = Math.ceil(activeAgents.length / itemsPerPage);
  
  const currentAgents = activeAgents.slice(
    currentPage * itemsPerPage,
    (currentPage + 1) * itemsPerPage
  );

  const nextPage = () => {
    setCurrentPage((prev) => (prev + 1) % totalPages);
  };

  const prevPage = () => {
    setCurrentPage((prev) => (prev - 1 + totalPages) % totalPages);
  };

  if (activeAgents.length === 0) {
    return (
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="bg-white rounded-2xl shadow-lg p-12">
            <User className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-gray-900 mb-2">Henüz Danışman Eklenmedi</h3>
            <p className="text-gray-600">Yakında uzman danışmanlarımızla tanışacaksınız.</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-blue-900 mb-4">
            Tüm Danışmanlarımız
          </h2>
          <p className="text-gray-600 text-lg">
            Deneyimli ekibimizle size en iyi hizmeti sunuyoruz
          </p>
        </div>

        {/* Desktop Grid */}
        <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {currentAgents.map((agent, index) => (
            <div
              key={agent.id}
              className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden group transform hover:scale-105"
              style={{
                animationDelay: `${index * 100}ms`,
                animation: 'fadeInUp 0.6s ease-out both',
              }}
            >
              <div className="relative h-64 overflow-hidden">
                <img
                  src={agent.image}
                  alt={agent.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
                <div className="absolute top-4 right-4 bg-amber-500 text-white px-2 py-1 rounded-full text-xs font-semibold">
                  {agent.experience}
                </div>
              </div>
              
              <div className="p-6">
                <h3 className="text-xl font-bold text-blue-900 mb-1">{agent.name}</h3>
                <p className="text-gray-600 mb-3 text-sm">{agent.title}</p>
                
                <div className="flex flex-wrap gap-1 mb-4">
                  {(agent.specialties || []).slice(0, 2).map((specialty, idx) => (
                    <span
                      key={idx}
                      className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs font-medium"
                    >
                      {specialty}
                    </span>
                  ))}
                </div>
                
                <div className="space-y-2 mb-4">
                  <div className="flex items-center text-gray-600 text-xs">
                    <Phone className="w-3 h-3 mr-2 text-amber-500" />
                    {agent.phone}
                  </div>
                  <div className="flex items-center text-gray-600 text-xs">
                    <Mail className="w-3 h-3 mr-2 text-amber-500" />
                    {agent.email}
                  </div>
                </div>
                
                <div className="flex space-x-2">
                  <a
                    href={`tel:${agent.phone}`}
                    className="flex-1 bg-amber-500 text-white py-2 px-3 rounded-lg font-semibold hover:bg-amber-600 transition-colors duration-300 text-center text-sm"
                  >
                    Ara
                  </a>
                  <a
                    href={`/danismanlar/${agent.id}`}
                    className="flex-1 border-2 border-blue-900 text-blue-900 py-2 px-3 rounded-lg font-semibold hover:bg-blue-900 hover:text-white transition-colors duration-300 text-center text-sm"
                  >
                    Profil
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Mobile Swiper */}
        <div className="md:hidden">
          <div className="relative overflow-hidden">
            <div
              className="flex transition-transform duration-500"
              style={{ transform: `translateX(-${currentPage * 100}%)` }}
            >
              {Array.from({ length: totalPages }).map((_, pageIndex) => (
                <div key={pageIndex} className="w-full flex-shrink-0 px-4">
                  <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
                    {activeAgents.slice(pageIndex * itemsPerPage, (pageIndex + 1) * itemsPerPage).map((agent) => (
                      <div key={agent.id} className="border-b border-gray-200 last:border-b-0 p-6">
                        <div className="flex items-center space-x-4">
                          <img
                            src={agent.image}
                            alt={agent.name}
                            className="w-16 h-16 rounded-full object-cover"
                          />
                          <div className="flex-1">
                            <h3 className="font-bold text-blue-900">{agent.name}</h3>
                            <p className="text-gray-600 text-sm">{agent.title}</p>
                            <p className="text-amber-600 text-xs font-semibold">{agent.experience}</p>
                          </div>
                        </div>
                        <div className="mt-4 flex space-x-2">
                          <a
                            href={`tel:${agent.phone}`}
                            className="flex-1 bg-amber-500 text-white py-2 px-3 rounded-lg text-center text-sm font-semibold"
                          >
                            Ara
                          </a>
                          <a
                            href={`/danismanlar/${agent.id}`}
                            className="flex-1 border border-blue-900 text-blue-900 py-2 px-3 rounded-lg text-center text-sm font-semibold"
                          >
                            Profil
                          </a>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Mobile Navigation */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center space-x-4 mt-6">
              <button
                onClick={prevPage}
                className="p-2 bg-blue-900 text-white rounded-lg hover:bg-blue-800 transition-colors"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <span className="text-gray-600">
                {currentPage + 1} / {totalPages}
              </span>
              <button
                onClick={nextPage}
                className="p-2 bg-blue-900 text-white rounded-lg hover:bg-blue-800 transition-colors"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          )}
        </div>

        {/* Desktop Pagination */}
        {totalPages > 1 && (
          <div className="hidden md:flex justify-center items-center space-x-4 mt-12">
            <button
              onClick={prevPage}
              disabled={currentPage === 0}
              className="px-4 py-2 bg-blue-900 text-white rounded-lg hover:bg-blue-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Önceki
            </button>
            
            <div className="flex space-x-2">
              {Array.from({ length: totalPages }).map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentPage(index)}
                  className={`w-10 h-10 rounded-lg font-semibold transition-colors ${
                    index === currentPage
                      ? 'bg-amber-500 text-white'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  {index + 1}
                </button>
              ))}
            </div>
            
            <button
              onClick={nextPage}
              disabled={currentPage === totalPages - 1}
              className="px-4 py-2 bg-blue-900 text-white rounded-lg hover:bg-blue-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Sonraki
            </button>
          </div>
        )}
      </div>

      <style>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
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

export default AllAgents;