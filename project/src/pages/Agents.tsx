import React from 'react';
import FeaturedAgentCards from '../components/agents/FeaturedAgentCards';
import AllAgents from '../components/agents/AllAgents';

const Agents: React.FC = () => {
  return (
    <div className="pt-24 pb-16">
      {/* Page Header */}
      <section className="py-16 bg-gradient-to-r from-blue-900 to-blue-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Danışmanlarımız
          </h1>
          <p className="text-xl md:text-2xl text-blue-200 max-w-3xl mx-auto">
            Alanında uzman, deneyimli ekibimizle size en iyi gayrimenkul hizmetini sunuyoruz
          </p>
        </div>
      </section>

      <FeaturedAgentCards />
      <AllAgents />
    </div>
  );
};

export default Agents;