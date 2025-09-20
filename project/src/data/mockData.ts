import { Agent, Property, Project, Testimonial, SliderItem, AdminUser } from '../types';

// FALLBACK DATA - Supabase çalışmazsa kullanılır
// Asıl veriler artık Supabase'de tutulur

export const mockAgents: Agent[] = [
  {
    id: 'fallback-1',
    name: 'Demo Agent',
    title: 'Gayrimenkul Danışmanı',
    image: '/placeholder-agent.jpg',
    phone: '+90 555 000 0000',
    email: 'demo@adalargayrimenkul.com',
    experience: '1 yıl',
    specialties: ['Genel Danışmanlık'],
    isActive: true,
    isFeatured: false,
  }
];

export const mockProperties: Property[] = [
  {
    id: 'fallback-1',
    title: 'Demo Mülk',
    location: 'Demo Lokasyon',
    size: 100,
    price: 100000,
    image: '/placeholder-property.jpg',
    description: 'Demo açıklama',
    isActive: true,
    isFeatured: false,
  }
];

export const mockProjects: Project[] = [
  {
    id: 'fallback-1',
    logo: '/placeholder-logo.jpg',
    isActive: true,
  }
];

export const mockTestimonials: Testimonial[] = [
  {
    id: 'fallback-1',
    name: 'Demo Müşteri',
    initials: 'DM',
    comment: 'Demo yorum.',
    rating: 5,
    isActive: true,
  }
];

export const mockSliderItems: SliderItem[] = [
  {
    id: 'fallback-1',
    title: 'DEMO BAŞLIK',
    subtitle: 'Demo alt başlık',
    location: 'Demo Lokasyon',
    image: '/placeholder-slider.jpg',
    isActive: true,
  }
];

export const mockAdminUser: AdminUser = {
  username: 'admin',
  password: 'admin123',
};