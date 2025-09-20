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
  loadAllTestimonialsForAdmin: () => Promise<void>;
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

        // Supabase'den veri geldi mi kontrol et (herhangi bir tablo veri döndürdüyse)
        const hasSupabaseData = (agentsResult.data && agentsResult.data.length > 0) ||
                               (testimonialsResult.data && testimonialsResult.data.length > 0) ||
                               (propertiesResult.data && propertiesResult.data.length > 0) ||
                               (projectsResult.data && projectsResult.data.length > 0) ||
                               (sliderItemsResult.data && sliderItemsResult.data.length > 0) ||
                               (contactRequestsResult.data && contactRequestsResult.data.length > 0);

        if (hasSupabaseData) {
          console.log('✅ Supabase\'den veriler yüklendi');
          
          // Supabase verilerini TypeScript tiplerle eşle (ID'lere -supabase eki ekle)
          const mappedAgents = (agentsResult.data || []).map((agent: any) => ({
            id: agent.id + '-supabase',
            name: agent.name,
            title: agent.title,
            image: agent.image,
            phone: agent.phone,
            email: agent.email,
            experience: agent.experience,
            specialties: agent.specialties || ['Gayrimenkul Danışmanlığı'], // Fallback
            isActive: agent.is_active,
            isFeatured: agent.is_featured,
            portfolioUrl: agent.portfolio_url || 'https://adalargayrimenkul.sahibinden.com/'
          }));

          const mappedTestimonials = (testimonialsResult.data || []).map((testimonial: any) => ({
            id: testimonial.id + '-supabase',
            name: testimonial.name,
            initials: testimonial.initials,
            comment: testimonial.comment,
            rating: testimonial.rating,
            isActive: testimonial.is_active
          }));

          const mappedProperties = (propertiesResult.data || []).map((property: any) => ({
            id: property.id + '-supabase',
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
            id: project.id + '-supabase',
            logo: project.logo,
            isActive: project.is_active
          }));

          const mappedSliderItems = (sliderItemsResult.data || []).map((item: any) => ({
            id: item.id + '-supabase',
            title: item.title,
            subtitle: item.subtitle,
            location: item.location,
            image: item.image,
            isActive: item.is_active
          }));

          const mappedContactRequests = (contactRequestsResult.data || []).map((request: any) => ({
            id: request.id + '-supabase',
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
          
          console.log('📊 DataContext state güncellendi:', {
            agents: mappedAgents.length,
            properties: mappedProperties.length,
            projects: mappedProjects.length,
            testimonials: mappedTestimonials.length,
            sliderItems: mappedSliderItems.length,
            contactRequests: mappedContactRequests.length
          });
        } else {
          // Supabase'de veri yok veya bağlantı sorunu var, fallback olarak localStorage + mockData kullan
          console.log('⚠️ Supabase\'de veri yok veya bağlantı sorunu, localStorage + mockData kullanılıyor');
          console.log('Supabase sonuçları:', { agentsResult, testimonialsResult, propertiesResult });
          
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
    
    // Sadece mevcut Supabase kayıtlarını güncelle, yeni ekleme yapma
    try {
      for (const agent of newAgents) {
        if (agent.id.includes('-supabase')) {
          // Sadece mevcut Supabase kaydını güncelle
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
        // Yeni ekleme kısmını kaldırdık - sadece direkt Supabase'a ekleme yapılacak
      }
    } catch (error) {
      console.log('Supabase agent güncelleme hatası:', error);
    }
  };

  const updateProperties = async (newProperties: Property[]) => {
    setProperties(newProperties);
    setStorageItem(STORAGE_KEYS.PROPERTIES, newProperties);
    
    // Sadece mevcut Supabase kayıtlarını güncelle, yeni ekleme yapma
    try {
      for (const property of newProperties) {
        if (property.id.includes('-supabase')) {
          // Sadece mevcut Supabase kaydını güncelle
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
        // Yeni ekleme kısmını kaldırdık - sadece direkt Supabase'a ekleme yapılacak
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
    
    // Sadece mevcut Supabase kayıtlarını güncelle, yeni ekleme yapma
    try {
      for (const testimonial of newTestimonials) {
        if (testimonial.id.includes('-supabase')) {
          // Sadece mevcut Supabase kaydını güncelle
          await dbHelpers.updateTestimonial(testimonial.id.replace('-supabase', ''), {
            name: testimonial.name,
            initials: testimonial.initials,
            comment: testimonial.comment,
            rating: testimonial.rating,
            is_active: testimonial.isActive
          });
        }
        // Yeni ekleme kısmını kaldırdık - sadece direkt Supabase'a ekleme yapılacak
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

  // Admin için tüm testimonials'ları yükle (aktif/pasif fark etmeksizin)
  const loadAllTestimonialsForAdmin = async () => {
    try {
      console.log('🔄 Admin için tüm testimonials yükleniyor...');
      const { data, error } = await dbHelpers.getAllTestimonials();
      
      if (error) {
        console.error('❌ Admin testimonials yükleme hatası:', error);
        return;
      }

      if (data && data.length > 0) {
        const mappedTestimonials = data.map((testimonial: any) => ({
          id: testimonial.id + '-supabase',
          name: testimonial.name,
          initials: testimonial.initials,
          comment: testimonial.comment,
          rating: testimonial.rating,
          isActive: testimonial.is_active
        }));
        
        console.log('✅ Admin testimonials yüklendi:', mappedTestimonials);
        setTestimonials(mappedTestimonials);
      }
    } catch (error) {
      console.error('❌ Admin testimonials yükleme hatası:', error);
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
        loadAllTestimonialsForAdmin,
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