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
    // Production'da her zaman mockData ile başlat (seedle)
    const isProd = typeof window !== 'undefined' && window.location.hostname !== 'localhost';
    if (isProd) {
      localStorage.setItem(STORAGE_KEYS.AGENTS, JSON.stringify(mockAgents));
      localStorage.setItem(STORAGE_KEYS.PROPERTIES, JSON.stringify(mockProperties));
      localStorage.setItem(STORAGE_KEYS.PROJECTS, JSON.stringify(mockProjects));
      localStorage.setItem(STORAGE_KEYS.TESTIMONIALS, JSON.stringify(mockTestimonials));
      localStorage.setItem(STORAGE_KEYS.SLIDER, JSON.stringify(mockSliderItems));
      localStorage.setItem(STORAGE_KEYS.CONTACT_REQUESTS, JSON.stringify([]));
    }
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
  };

  const updateSliderItems = (newSliderItems: SliderItem[]) => {
    setSliderItems(newSliderItems);
    setStorageItem(STORAGE_KEYS.SLIDER, newSliderItems);
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
  };

  const updateContactRequests = (newRequests: ContactRequest[]) => {
    setContactRequests(newRequests);
    setStorageItem(STORAGE_KEYS.CONTACT_REQUESTS, newRequests);
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