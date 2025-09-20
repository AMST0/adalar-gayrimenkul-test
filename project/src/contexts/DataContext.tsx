import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Agent, Property, Project, Testimonial, SliderItem, ContactRequest } from '../types';
import { getStorageItem, setStorageItem, STORAGE_KEYS } from '../utils/storage';
import { mockAgents, mockProperties, mockProjects, mockTestimonials, mockSliderItems } from '../data/mockData';
import { dbHelpers } from '../utils/supabaseClient-new';

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
  deleteAgent: (id: string) => void;
  deleteProperty: (id: string) => void;
  deleteTestimonial: (id: string) => void;
  addContactRequest: (request: Omit<ContactRequest, 'id' | 'date' | 'isRead'>) => void;
  updateContactRequests: (requests: ContactRequest[]) => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [agents, setAgents] = useState<Agent[]>([]);
  const [properties, setProperties] = useState<Property[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [sliderItems, setSliderItems] = useState<SliderItem[]>([]);
  const [contactRequests, setContactRequests] = useState<ContactRequest[]>([]);

  useEffect(() => {
    const loadData = async () => {
      console.log('🔄 DataContext: Veri yükleme başladı...');
      try {
        // Önce Supabase'den veri çekmeyi dene
        console.log('📡 Supabase bağlantısı deneniyor...');
        const [
          agentsResult,
          propertiesResult, 
          projectsResult,
          testimonialsResult,
          sliderItemsResult,
          contactRequestsResult
        ] = await Promise.all([
          dbHelpers.getAgents(),
          dbHelpers.getProperties(),
          dbHelpers.getProjects(), 
          dbHelpers.getTestimonials(),
          dbHelpers.getSliderItems(),
          dbHelpers.getContactRequests()
        ]);

        console.log('📊 Supabase sonuçları:', {
          agents: agentsResult,
          properties: propertiesResult,
          projects: projectsResult,
          testimonials: testimonialsResult,
          sliderItems: sliderItemsResult,
          contactRequests: contactRequestsResult
        });

        // Supabase'den veri geldi mi kontrol et
        if (agentsResult.data && agentsResult.data.length > 0) {
          console.log('✅ Supabase\'den veriler yüklendi', agentsResult.data.length, 'agents bulundu');
          
          // Supabase verilerini TypeScript tiplerle eşle
          const mappedAgents = agentsResult.data.map((agent: any) => ({
            id: agent.id,
            name: agent.name,
            title: agent.title,
            image: agent.image,
            phone: agent.phone,
            email: agent.email,
            experience: agent.experience,
            specialties: agent.specialties || ['Gayrimenkul Danışmanlığı'], // Fallback
            isActive: agent.is_active,
            isFeatured: agent.is_featured,
            portfolioUrl: agent.portfolio_url
          }));

          const mappedTestimonials = (testimonialsResult.data || []).map((testimonial: any) => ({
            id: testimonial.id,
            name: testimonial.name,
            initials: testimonial.initials,
            comment: testimonial.comment,
            rating: testimonial.rating,
            isActive: testimonial.is_active
          }));

          const mappedProperties = (propertiesResult.data || []).map((property: any) => ({
            id: property.id,
            title: property.title,
            location: property.location,
            size: property.size, // Artık VARCHAR formatında "300 m²"
            price: property.price,
            image: property.image,
            description: property.description,
            isActive: property.is_active,
            isFeatured: property.is_featured
          }));

          const mappedProjects = (projectsResult.data || []).map((project: any) => ({
            id: project.id,
            logo: project.logo,
            isActive: project.is_active
          }));

          const mappedSliderItems = (sliderItemsResult.data || []).map((item: any) => ({
            id: item.id,
            title: item.title,
            subtitle: item.subtitle,
            location: item.location,
            image: item.image,
            isActive: item.is_active
          }));

          const mappedContactRequests = (contactRequestsResult.data || []).map((request: any) => ({
            id: request.id,
            name: request.name,
            email: request.email,
            phone: request.phone || '',
            message: request.message,
            date: request.created_at,
            isRead: request.is_read
          }));

          setAgents(mappedAgents);
          setProperties(mappedProperties);
          setProjects(mappedProjects);
          setTestimonials(mappedTestimonials);
          setSliderItems(mappedSliderItems);
          setContactRequests(mappedContactRequests);
        } else {
          // Supabase'de veri yok, fallback olarak localStorage kullan
          console.log('⚠️ Supabase\'de veri yok, localStorage kullanılıyor');
          console.log('agentsResult:', agentsResult);
          const loadedAgents = getStorageItem(STORAGE_KEYS.AGENTS, mockAgents);
          const loadedProperties = getStorageItem(STORAGE_KEYS.PROPERTIES, mockProperties);
          const loadedProjects = getStorageItem(STORAGE_KEYS.PROJECTS, mockProjects);
          const loadedTestimonials = getStorageItem(STORAGE_KEYS.TESTIMONIALS, mockTestimonials);
          const loadedSliderItems = getStorageItem(STORAGE_KEYS.SLIDER, mockSliderItems);
          const loadedContactRequests = getStorageItem(STORAGE_KEYS.CONTACT_REQUESTS, [] as ContactRequest[]);

          console.log('📦 LocalStorage\'dan yüklenen veriler:', {
            agents: loadedAgents.length,
            properties: loadedProperties.length,
            projects: loadedProjects.length,
            testimonials: loadedTestimonials.length,
            sliderItems: loadedSliderItems.length
          });

          setAgents(loadedAgents);
          setProperties(loadedProperties);
          setProjects(loadedProjects);
          setTestimonials(loadedTestimonials);
          setSliderItems(loadedSliderItems);
          setContactRequests(loadedContactRequests);
        }
      } catch (error) {
        // Supabase bağlantı hatası, localStorage kullan
        console.log('❌ Supabase bağlantı hatası, localStorage kullanılıyor:', error);
        const loadedAgents = getStorageItem(STORAGE_KEYS.AGENTS, mockAgents);
        const loadedProperties = getStorageItem(STORAGE_KEYS.PROPERTIES, mockProperties);
        const loadedProjects = getStorageItem(STORAGE_KEYS.PROJECTS, mockProjects);
        const loadedTestimonials = getStorageItem(STORAGE_KEYS.TESTIMONIALS, mockTestimonials);
        const loadedSliderItems = getStorageItem(STORAGE_KEYS.SLIDER, mockSliderItems);
        const loadedContactRequests = getStorageItem(STORAGE_KEYS.CONTACT_REQUESTS, [] as ContactRequest[]);

        setAgents(loadedAgents);
        setProperties(loadedProperties);
        setProjects(loadedProjects);
        setTestimonials(loadedTestimonials);
        setSliderItems(loadedSliderItems);
        setContactRequests(loadedContactRequests);
      }
    };

    loadData();
  }, []);

  const updateAgents = async (newAgents: Agent[]) => {
    setAgents(newAgents);
    setStorageItem(STORAGE_KEYS.AGENTS, newAgents);
    
    // Supabase'e de kaydet
    try {
      for (const agent of newAgents) {
        if (agent.id.includes('-supabase')) {
          // Mevcut Supabase kaydını güncelle
          await dbHelpers.updateAgent(agent.id.replace('-supabase', ''), {
            name: agent.name,
            title: agent.title,
            image: agent.image,
            phone: agent.phone,
            email: agent.email,
            experience: agent.experience,
            specialties: agent.specialties || [],
            is_featured: agent.isFeatured || false,
            is_active: agent.isActive
          });
        }
      }
    } catch (error) {
      console.log('Supabase agent güncelleme hatası:', error);
    }
  };

  const updateProperties = async (newProperties: Property[]) => {
    setProperties(newProperties);
    setStorageItem(STORAGE_KEYS.PROPERTIES, newProperties);
    
    // Supabase'e de kaydet
    try {
      for (const property of newProperties) {
        if (property.id.includes('-supabase')) {
          // Mevcut Supabase kaydını güncelle
          await dbHelpers.updateProperty(property.id.replace('-supabase', ''), {
            title: property.title,
            location: property.location,
            size: property.size?.toString() || '',
            price: property.price,
            image: property.image,
            description: property.description,
            property_type: 'Arsa',
            is_featured: property.isFeatured || false,
            is_active: property.isActive
          });
        }
      }
    } catch (error) {
      console.log('Supabase property güncelleme hatası:', error);
    }
  };

  const updateProjects = (newProjects: Project[]) => {
    setProjects(newProjects);
    setStorageItem(STORAGE_KEYS.PROJECTS, newProjects);
  };

  const updateTestimonials = async (newTestimonials: Testimonial[]) => {
    setTestimonials(newTestimonials);
    setStorageItem(STORAGE_KEYS.TESTIMONIALS, newTestimonials);
    
    // Supabase'e de kaydet
    try {
      for (const testimonial of newTestimonials) {
        if (testimonial.id.includes('-supabase')) {
          // Mevcut Supabase kaydını güncelle
          await dbHelpers.updateTestimonial(testimonial.id.replace('-supabase', ''), {
            name: testimonial.name,
            initials: testimonial.initials,
            comment: testimonial.comment,
            rating: testimonial.rating,
            is_active: testimonial.isActive
          });
        } else if (!testimonial.id.includes('fallback')) {
          // Yeni kayıt ekle
          await dbHelpers.addTestimonial({
            name: testimonial.name,
            initials: testimonial.initials,
            comment: testimonial.comment,
            rating: testimonial.rating,
            is_active: testimonial.isActive || false
          });
        }
      }
    } catch (error) {
      console.log('Supabase testimonial güncelleme hatası:', error);
    }
  };

  const updateSliderItems = async (newSliderItems: SliderItem[]) => {
    setSliderItems(newSliderItems);
    setStorageItem(STORAGE_KEYS.SLIDER, newSliderItems);
    
    // Supabase'e de kaydet
    try {
      for (const item of newSliderItems) {
        if (item.id.includes('-supabase')) {
          // Mevcut Supabase kaydını güncelle
          await dbHelpers.updateSliderItem(item.id.replace('-supabase', ''), {
            title: item.title,
            subtitle: item.subtitle,
            location: item.location,
            image: item.image,
            sort_order: parseInt(item.id) || 1,
            is_active: item.isActive
          });
        }
      }
    } catch (error) {
      console.log('Supabase slider güncelleme hatası:', error);
    }
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
    
    // Supabase'e de ekle
    dbHelpers.addContactRequest({
      name: request.name,
      email: request.email,
      phone: request.phone || '',
      message: request.message,
      is_read: false
    }).catch(error => console.log('Supabase contact request ekleme hatası:', error));
  };

  const updateContactRequests = (newRequests: ContactRequest[]) => {
    setContactRequests(newRequests);
    setStorageItem(STORAGE_KEYS.CONTACT_REQUESTS, newRequests);
  };

  // Silme fonksiyonları
  const deleteAgent = async (id: string) => {
    const updatedAgents = agents.filter(agent => agent.id !== id);
    setAgents(updatedAgents);
    setStorageItem(STORAGE_KEYS.AGENTS, updatedAgents);
    
    // Supabase'den de sil
    if (id.includes('-supabase')) {
      try {
        await dbHelpers.deleteAgent(id.replace('-supabase', ''));
      } catch (error) {
        console.log('Supabase agent silme hatası:', error);
      }
    }
  };

  const deleteProperty = async (id: string) => {
    const updatedProperties = properties.filter(property => property.id !== id);
    setProperties(updatedProperties);
    setStorageItem(STORAGE_KEYS.PROPERTIES, updatedProperties);
    
    // Supabase'den de sil
    if (id.includes('-supabase')) {
      try {
        await dbHelpers.deleteProperty(id.replace('-supabase', ''));
      } catch (error) {
        console.log('Supabase property silme hatası:', error);
      }
    }
  };

  const deleteTestimonial = async (id: string) => {
    const updatedTestimonials = testimonials.filter(testimonial => testimonial.id !== id);
    setTestimonials(updatedTestimonials);
    setStorageItem(STORAGE_KEYS.TESTIMONIALS, updatedTestimonials);
    
    // Supabase'den de sil
    if (id.includes('-supabase')) {
      try {
        await dbHelpers.deleteTestimonial(id.replace('-supabase', ''));
      } catch (error) {
        console.log('Supabase testimonial silme hatası:', error);
      }
    }
  };

  return (
    <DataContext.Provider
      value={{
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
        deleteAgent,
        deleteProperty,
        deleteTestimonial,
        addContactRequest,
        updateContactRequests,
      }}
    >
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};