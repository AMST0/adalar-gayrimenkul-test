import { Agent, Property, Project, Testimonial, SliderItem, ContactRequest, AdminUser } from '../types';

export const STORAGE_KEYS = {
  AGENTS: 'adalar_agents',
  PROPERTIES: 'adalar_properties',
  PROJECTS: 'adalar_projects',
  TESTIMONIALS: 'adalar_testimonials',
  SLIDER: 'adalar_slider',
  CONTACT_REQUESTS: 'adalar_contact_requests',
  ADMIN_USER: 'adalar_admin_user',
  ADMIN_SESSION: 'adalar_admin_session',
};

export const getStorageItem = <T>(key: string, defaultValue: T): T => {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch {
    return defaultValue;
  }
};

export const setStorageItem = <T>(key: string, value: T): void => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error('Error saving to localStorage:', error);
  }
};

export const removeStorageItem = (key: string): void => {
  try {
    localStorage.removeItem(key);
  } catch (error) {
    console.error('Error removing from localStorage:', error);
  }
};