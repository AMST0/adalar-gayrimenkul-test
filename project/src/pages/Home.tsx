import React from 'react';
import HeroSlider from '../components/home/HeroSlider';
import ProjectLogos from '../components/home/ProjectLogos';
import FeaturedAgents from '../components/home/FeaturedAgents';
import CustomerTestimonials from '../components/home/CustomerTestimonials';
import AboutSummary from '../components/home/AboutSummary';
import FeaturedProperties from '../components/home/FeaturedProperties';
import ContactForm from '../components/home/ContactForm';

const Home: React.FC = () => {
  return (
    <div className="min-h-screen">
      <HeroSlider />
      <ProjectLogos />
      <FeaturedAgents />
      <CustomerTestimonials />
      <AboutSummary />
      <FeaturedProperties />
      <ContactForm />
    </div>
  );
};

export default Home;