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
  isOnline: boolean;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [agents, setAgents] = useState<Agent[]>([]);
  const [properties, setProperties] = useState<Property[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [sliderItems, setSliderItems] = useState<SliderItem[]>([]);
  const [contactRequests, setContactRequests] = useState<ContactRequest[]>([]);
  const [isOnline, setIsOnline] = useState(false);

  // Supabase client lazy loading
  const getSupabaseHelpers = async () => {
    try {
      const supabaseModule = await import('../utils/supabaseClient-new');
      return supabaseModule.dbHelpers;
    } catch (error) {
      console.warn('Supabase not available');
      return null;
    }
  };

  // Database'den veri yükle
  const loadData = async () => {
    try {
      const dbHelpers = await getSupabaseHelpers();
      
      if (dbHelpers) {
        console.log('🌐 Supabase\'den veri yükleniyor...');
        
        // Supabase'den verileri çek
        const [agentsRes, propertiesRes, projectsRes, testimonialsRes, sliderRes] = await Promise.all([
          dbHelpers.getAgents(),
          dbHelpers.getProperties(),
          dbHelpers.getProjects(),
          dbHelpers.getTestimonials(),
          dbHelpers.getSliderItems()
        ]);

        if (!agentsRes.error) setAgents(agentsRes.data);
        if (!propertiesRes.error) setProperties(propertiesRes.data);
        if (!projectsRes.error) setProjects(projectsRes.data);
        if (!testimonialsRes.error) setTestimonials(testimonialsRes.data);
        if (!sliderRes.error) setSliderItems(sliderRes.data);

        setIsOnline(true);
        console.log('✅ Supabase\'den veri yüklendi');
      } else {
        throw new Error('Supabase not available');
      }
    } catch (error) {
      console.warn('⚠️ Supabase hatası, local storage kullanılıyor:', error);
      
      // Fallback to local storage + mock data
      setAgents(getStorageItem(STORAGE_KEYS.AGENTS, mockAgents));
      setProperties(getStorageItem(STORAGE_KEYS.PROPERTIES, mockProperties));
      setProjects(getStorageItem(STORAGE_KEYS.PROJECTS, mockProjects));
      setTestimonials(getStorageItem(STORAGE_KEYS.TESTIMONIALS, mockTestimonials));
      setSliderItems(getStorageItem(STORAGE_KEYS.SLIDER, mockSliderItems));
      setContactRequests(getStorageItem(STORAGE_KEYS.CONTACT_REQUESTS, []));
      
      setIsOnline(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const updateAgents = async (newAgents: Agent[]) => {
    setAgents(newAgents);
    if (isOnline && dbHelpers) {
      try {
        // Supabase'e sync et
        console.log('Agents Supabase\'e sync ediliyor...');
      } catch (error) {
        console.warn('Supabase sync hatası:', error);
      }
    }
    setStorageItem(STORAGE_KEYS.AGENTS, newAgents);
  };

  const updateProperties = async (newProperties: Property[]) => {
    setProperties(newProperties);
    if (isOnline && dbHelpers) {
      try {
        console.log('Properties Supabase\'e sync ediliyor...');
      } catch (error) {
        console.warn('Supabase sync hatası:', error);
      }
    }
    setStorageItem(STORAGE_KEYS.PROPERTIES, newProperties);
  };

  const updateProjects = async (newProjects: Project[]) => {
    setProjects(newProjects);
    if (isOnline && dbHelpers) {
      try {
        console.log('Projects Supabase\'e sync ediliyor...');
      } catch (error) {
        console.warn('Supabase sync hatası:', error);
      }
    }
    setStorageItem(STORAGE_KEYS.PROJECTS, newProjects);
  };

  const updateTestimonials = async (newTestimonials: Testimonial[]) => {
    setTestimonials(newTestimonials);
    if (isOnline && dbHelpers) {
      try {
        // Yeni testimonial'ı Supabase'e ekle
        const latestTestimonial = newTestimonials[newTestimonials.length - 1];
        if (latestTestimonial && !latestTestimonial.id.includes('temp')) {
          await dbHelpers.addTestimonial({
            name: latestTestimonial.name,
            initials: latestTestimonial.initials,
            comment: latestTestimonial.comment,
            rating: latestTestimonial.rating,
            is_active: latestTestimonial.isActive
          });
          console.log('✅ Testimonial Supabase\'e eklendi');
        }
      } catch (error) {
        console.warn('Supabase sync hatası:', error);
      }
    }
    setStorageItem(STORAGE_KEYS.TESTIMONIALS, newTestimonials);
  };

  const updateSliderItems = async (newItems: SliderItem[]) => {
    setSliderItems(newItems);
    if (isOnline && dbHelpers) {
      try {
        console.log('Slider items Supabase\'e sync ediliyor...');
      } catch (error) {
        console.warn('Supabase sync hatası:', error);
      }
    }
    setStorageItem(STORAGE_KEYS.SLIDER, newItems);
  };

  const addContactRequest = async (request: Omit<ContactRequest, 'id' | 'date' | 'isRead'>) => {
    const newRequest: ContactRequest = {
      ...request,
      id: Date.now().toString(),
      date: new Date().toISOString(),
      isRead: false,
    };

    if (isOnline && dbHelpers) {
      try {
        await dbHelpers.addContactRequest({
          name: newRequest.name,
          email: newRequest.email,
          phone: newRequest.phone,
          message: newRequest.message
        });
        console.log('✅ Contact request Supabase\'e eklendi');
      } catch (error) {
        console.warn('Supabase sync hatası:', error);
      }
    }

    const updatedRequests = [...contactRequests, newRequest];
    setContactRequests(updatedRequests);
    setStorageItem(STORAGE_KEYS.CONTACT_REQUESTS, updatedRequests);
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
    isOnline
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