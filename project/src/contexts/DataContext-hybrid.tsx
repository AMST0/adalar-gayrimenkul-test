import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Agent, Property, Project, Testimonial, SliderItem, ContactRequest } from '../types';
import { getStorageItem, setStorageItem, STORAGE_KEYS } from '../utils/storage';
import { mockAgents, mockProperties, mockProjects, mockTestimonials, mockSliderItems } from '../data/mockData';

interface DataContextType {
  agents: Agent[];
  properties: Property[];
  projects: Project[];
  testimonials: Testimonial[];
  sliderItems: SliderItem[];
  contactRequests: ContactRequest[];
  updateAgents: (agents: Agent[]) => void;
  updateProperties: (properties: Property[]) => void;
  updateProjects: (projects: Project[]) => void;
  updateTestimonials: (testimonials: Testimonial[]) => void;
  updateSliderItems: (items: SliderItem[]) => void;
  addContactRequest: (request: Omit<ContactRequest, 'id' | 'date' | 'isRead'>) => void;
  updateContactRequests: (requests: ContactRequest[]) => void;
  isSupabaseEnabled: boolean;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [agents, setAgents] = useState<Agent[]>([]);
  const [properties, setProperties] = useState<Property[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [sliderItems, setSliderItems] = useState<SliderItem[]>([]);
  const [contactRequests, setContactRequests] = useState<ContactRequest[]>([]);

  // Supabase'in kullanılabilir olup olmadığını kontrol et
  const isSupabaseEnabled = !!(
    import.meta.env.VITE_SUPABASE_URL && 
    import.meta.env.VITE_SUPABASE_ANON_KEY &&
    import.meta.env.VITE_SUPABASE_URL !== 'your_supabase_url_here'
  );

  console.log('🔧 Supabase Status:', isSupabaseEnabled ? 'Enabled' : 'Disabled (using mock data)');

  useEffect(() => {
    // İlk yüklemede mock data'yı kullan
    // Supabase integration sonraki aşamada yapılacak
    setAgents(getStorageItem(STORAGE_KEYS.AGENTS, mockAgents));
    setProperties(getStorageItem(STORAGE_KEYS.PROPERTIES, mockProperties));
    setProjects(getStorageItem(STORAGE_KEYS.PROJECTS, mockProjects));
    setTestimonials(getStorageItem(STORAGE_KEYS.TESTIMONIALS, mockTestimonials));
    setSliderItems(getStorageItem(STORAGE_KEYS.SLIDER, mockSliderItems));
    setContactRequests(getStorageItem(STORAGE_KEYS.CONTACT_REQUESTS, []));
  }, []);

  const updateAgents = (newAgents: Agent[]) => {
    setAgents(newAgents);
    setStorageItem(STORAGE_KEYS.AGENTS, newAgents);
  };

  const updateProperties = (newProperties: Property[]) => {
    setProperties(newProperties);
    setStorageItem(STORAGE_KEYS.PROPERTIES, newProperties);
  };

  const updateProjects = (newProjects: Project[]) => {
    setProjects(newProjects);
    setStorageItem(STORAGE_KEYS.PROJECTS, newProjects);
  };

  const updateTestimonials = (newTestimonials: Testimonial[]) => {
    setTestimonials(newTestimonials);
    setStorageItem(STORAGE_KEYS.TESTIMONIALS, newTestimonials);
    
    // Supabase sync (future implementation)
    if (isSupabaseEnabled) {
      console.log('📤 Testimonial would be synced to Supabase');
    }
  };

  const updateSliderItems = (newItems: SliderItem[]) => {
    setSliderItems(newItems);
    setStorageItem(STORAGE_KEYS.SLIDER, newItems);
  };

  const addContactRequest = (request: Omit<ContactRequest, 'id' | 'date' | 'isRead'>) => {
    const newRequest: ContactRequest = {
      ...request,
      id: Date.now().toString(),
      date: new Date().toISOString(),
      isRead: false,
    };

    const updatedRequests = [...contactRequests, newRequest];
    setContactRequests(updatedRequests);
    setStorageItem(STORAGE_KEYS.CONTACT_REQUESTS, updatedRequests);

    // Supabase sync (future implementation)
    if (isSupabaseEnabled) {
      console.log('📤 Contact request would be synced to Supabase');
    }

    // E-posta gönderimi (API endpoint'e)
    if (typeof window !== 'undefined') {
      fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(request)
      }).catch(error => {
        console.warn('E-posta gönderimi başarısız:', error);
      });
    }
  };

  const updateContactRequests = (requests: ContactRequest[]) => {
    setContactRequests(requests);
    setStorageItem(STORAGE_KEYS.CONTACT_REQUESTS, requests);
  };

  const value: DataContextType = {
    agents,
    properties,
    projects,
    testimonials,
    sliderItems,
    contactRequests,
    updateAgents,
    updateProperties,
    updateProjects,
    updateTestimonials,
    updateSliderItems,
    addContactRequest,
    updateContactRequests,
    isSupabaseEnabled
  };

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
};

export const useData = (): DataContextType => {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};