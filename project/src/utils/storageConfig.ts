// Supabase Storage sabitleri
export const STORAGE_CONFIG = {
  // Varsayılan görsel URL'i
  DEFAULT_PROPERTY_IMAGE: `${import.meta.env.VITE_SUPABASE_URL}/storage/v1/object/public/property-images/properties/default-property.jpg`,
  
  // Bucket adları
  BUCKETS: {
    PROPERTY_IMAGES: 'property-images',
    AGENT_IMAGES: 'agent-images',
    SLIDER_IMAGES: 'slider-images'
  },
  
  // Dosya limitleri
  LIMITS: {
    MAX_FILE_SIZE: 10 * 1024 * 1024, // 10MB
    MAX_FILES_PER_UPLOAD: 10,
    ALLOWED_TYPES: ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp']
  },
  
  // URL Helper fonksiyonları
  getPublicUrl: (bucket: string, path: string) => 
    `${import.meta.env.VITE_SUPABASE_URL}/storage/v1/object/public/${bucket}/${path}`,
    
  getDefaultImageUrl: () => 
    `${import.meta.env.VITE_SUPABASE_URL}/storage/v1/object/public/property-images/properties/default-property.jpg`
};