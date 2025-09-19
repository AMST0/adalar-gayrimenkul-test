export interface Agent {
  id: string;
  name: string;
  title: string;
  image: string;
  phone: string;
  email: string;
  experience: string;
  specialties: string[];
  isActive: boolean;
  isFeatured: boolean;
  portfolioUrl?: string;
}

export interface Property {
  id: string;
  title: string;
  location: string;
  size: number;
  price: number;
  image: string;
  description: string;
  isActive: boolean;
  isFeatured: boolean;
}

export interface Project {
  id: string;
  logo: string;
  isActive: boolean;
}

export interface Testimonial {
  id: string;
  name: string;
  initials: string;
  comment: string;
  rating?: number;
  isActive: boolean;
}

export interface SliderItem {
  id: string;
  title: string;
  subtitle: string;
  location: string;
  image: string;
  isActive: boolean;
}

export interface ContactRequest {
  id: string;
  name: string;
  email: string;
  phone: string;
  message: string;
  date: string;
  isRead: boolean;
}

export interface AdminUser {
  username: string;
  password: string;
}