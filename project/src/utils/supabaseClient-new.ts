// Supabase client konfigürasyonu
import { createClient } from '@supabase/supabase-js'

// Vite environment variables için
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string || 'https://your-project.supabase.co'
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string || 'your-anon-key'

console.log('🔧 Supabase Configuration:', {
  url: supabaseUrl,
  keyLength: supabaseKey.length,
  keyPreview: supabaseKey.substring(0, 20) + '...'
});

export const supabase = createClient(supabaseUrl, supabaseKey)

// Database helper functions
export const dbHelpers = {
  // Agents
  async getAgents(options: { includeInactive?: boolean } = {}) {
    console.log('🔍 getAgents() çağrıldı', options);
    let query = supabase.from('agents').select('*');
    if (!options.includeInactive) {
      query = query.eq('is_active', true);
    }
    const { data, error } = await query;
    console.log('👥 Agents sorgu sonucu:', { count: data?.length, includeInactive: options.includeInactive, error });
    return { data: data || [], error };
  },

  async addAgent(agent: any) {
    const { data, error } = await supabase
      .from('agents')
      .insert([agent])
    return { data, error }
  },

  async updateAgent(id: string, agent: any) {
    const { data, error } = await supabase
      .from('agents')
      .update(agent)
      .eq('id', id)
    return { data, error }
  },

  async deleteAgent(id: string) {
    const { data, error } = await supabase
      .from('agents')
      .update({ is_active: false })
      .eq('id', id)
    return { data, error }
  },

  // Properties
  async getProperties() {
    const { data, error } = await supabase
      .from('properties')
      .select('*')
      .eq('is_active', true)
    return { data: data || [], error }
  },

  async addProperty(property: any) {
    const { data, error } = await supabase
      .from('properties')
      .insert([property])
    return { data, error }
  },

  async updateProperty(id: string, property: any) {
    const { data, error } = await supabase
      .from('properties')
      .update(property)
      .eq('id', id)
    return { data, error }
  },

  async deleteProperty(id: string) {
    const { data, error } = await supabase
      .from('properties')
      .update({ is_active: false })
      .eq('id', id)
    return { data, error }
  },

  // Testimonials
  async getTestimonials() {
    const { data, error } = await supabase
      .from('testimonials')
      .select('*')
      .eq('is_active', true)
    return { data: data || [], error }
  },

  // Admin için tüm testimonials (aktif/pasif fark etmeksizin)
  async getAllTestimonials() {
    const { data, error } = await supabase
      .from('testimonials')
      .select('*')
      .order('created_at', { ascending: false })
    return { data: data || [], error }
  },

  async addTestimonial(testimonial: any) {
    const { data, error } = await supabase
      .from('testimonials')
      .insert([testimonial])
    return { data, error }
  },

  async updateTestimonial(id: string, testimonial: any) {
    const { data, error } = await supabase
      .from('testimonials')
      .update(testimonial)
      .eq('id', id)
    return { data, error }
  },

  async deleteTestimonial(id: string) {
    const { data, error } = await supabase
      .from('testimonials')
      .update({ is_active: false })
      .eq('id', id)
    return { data, error }
  },

  // Contact Requests
  async addContactRequest(contact: any) {
    const { data, error } = await supabase
      .from('contact_requests')
      .insert([contact])
    return { data, error }
  },

  async getContactRequests() {
    const { data, error } = await supabase
      .from('contact_requests')
      .select('*')
      .order('created_at', { ascending: false })
    return { data: data || [], error }
  },

  // Projects
  async getProjects() {
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .eq('is_active', true)
    return { data: data || [], error }
  },

  // Slider Items
  async getSliderItems() {
    const { data, error } = await supabase
      .from('slider_items')
      .select('*')
      .eq('is_active', true)
      .order('sort_order')
    return { data: data || [], error }
  },

  async addSliderItem(item: any) {
    const { data, error } = await supabase
      .from('slider_items')
      .insert([item])
      .select()
    return { data, error }
  },

  async updateSliderItem(id: string, item: any) {
    const { data, error } = await supabase
      .from('slider_items')
      .update(item)
      .eq('id', id)
    return { data, error }
  }
}