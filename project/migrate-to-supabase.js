// Mevcut verilerinizi Supabase'e aktaran script
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

// Environment variables'ları yükle
dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ VITE_SUPABASE_URL ve VITE_SUPABASE_ANON_KEY environment variables gerekli!');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

// Mock data'dan mevcut verileriniz
const mockData = {
  agents: [
    {
      name: 'Ahmet Yılmaz',
      title: 'Kıdemli Gayrimenkul Danışmanı',
      experience: '8 yıllık deneyim',
      phone: '+90 532 123 4567',
      email: 'ahmet@adalar.com',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
      initials: 'AY',
      is_featured: true,
      is_active: true
    },
    {
      name: 'Fatma Demir',
      title: 'Emlak Uzmanı',
      experience: '5 yıllık deneyim',
      phone: '+90 535 987 6543',
      email: 'fatma@adalar.com',
      image: 'https://images.unsplash.com/photo-1494790108755-2616b95b2b0b?w=150',
      initials: 'FD',
      is_featured: false,
      is_active: true
    },
    {
      name: 'Mehmet Kaya',
      title: 'Satış Temsilcisi',
      experience: '3 yıllık deneyim',
      phone: '+90 533 456 7890',
      email: 'mehmet@adalar.com',
      image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150',
      initials: 'MK',
      is_featured: true,
      is_active: true
    }
  ],
  testimonials: [
    {
      name: 'Mehmet Özkan',
      initials: 'MÖ',
      comment: 'Çok profesyonel hizmet aldık. Kesinlikle tavsiye ederim!',
      rating: 5,
      is_active: true
    },
    {
      name: 'Ayşe Kaya',
      initials: 'AK',
      comment: 'Harika bir deneyimdi. Çok memnun kaldık.',
      rating: 4,
      is_active: true
    },
    {
      name: 'Ali Veli',
      initials: 'AV',
      comment: 'Emlak konusunda gerçekten uzmanlar. Teşekkürler!',
      rating: 5,
      is_active: true
    },
    {
      name: 'Zeynep Yıldız',
      initials: 'ZY',
      comment: 'Çok güler yüzlü ve yardımcı oldular.',
      rating: 4,
      is_active: true
    }
  ],
  projects: [
    {
      name: 'Nidapark',
      logo: '/img/nidapark.jpg',
      description: 'Premium konut projesi',
      is_active: true
    },
    {
      name: 'Başakşehir Evleri',
      logo: 'https://via.placeholder.com/200x100?text=Başakşehir',
      description: 'Modern yaşam kompleksi',
      is_active: true
    },
    {
      name: 'İstanbul Marina',
      logo: 'https://via.placeholder.com/200x100?text=İstanbul+Marina',
      description: 'Deniz manzaralı lüks konutlar',
      is_active: true
    }
  ],
  sliderItems: [
    {
      title: 'Adalar Gayrimenkul',
      subtitle: 'Geleceğin Değerli Toprakları',
      image: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=1920',
      location: 'İstanbul',
      is_active: true,
      sort_order: 1
    },
    {
      title: 'Premium Konutlar',
      subtitle: 'Hayalinizdeki Ev Burada',
      image: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=1920',
      location: 'Adalar',
      is_active: true,
      sort_order: 2
    },
    {
      title: 'Yatırım Fırsatları',
      subtitle: 'Güvenli Yatırımın Adresi',
      image: 'https://images.unsplash.com/photo-1582407947304-fd86f028f716?w=1920',
      location: 'Marmara',
      is_active: true,
      sort_order: 3
    }
  ],
  properties: [
    {
      title: 'Deniz Manzaralı Villa',
      price: 2500000,
      location: 'Büyükada',
      size: '300 m²',
      type: 'Villa',
      description: 'Muhteşem deniz manzaralı özel villa',
      image: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800',
      is_featured: true,
      is_active: true
    },
    {
      title: 'Modern Daire',
      price: 850000,
      location: 'Heybeliada',
      size: '120 m²',
      type: 'Daire',
      description: 'Yeni yapım modern daire',
      image: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800',
      is_featured: false,
      is_active: true
    },
    {
      title: 'Tarihi Konak',
      price: 1800000,
      location: 'Kınalıada',
      size: '250 m²',
      type: 'Konak',
      description: 'Restore edilmiş tarihi konak',
      image: 'https://images.unsplash.com/photo-1605146769289-440113cc3d00?w=800',
      is_featured: true,
      is_active: true
    }
  ]
};

async function migrateData() {
  console.log('🚀 Veriler Supabase\'e aktarılıyor...');

  try {
    // Agents verilerini aktar
    console.log('📝 Agents verisi aktarılıyor...');
    const { error: agentsError } = await supabase
      .from('agents')
      .insert(mockData.agents);
    
    if (agentsError) throw agentsError;
    console.log('✅ Agents başarıyla aktarıldı');

    // Testimonials verilerini aktar
    console.log('📝 Testimonials verisi aktarılıyor...');
    const { error: testimonialsError } = await supabase
      .from('testimonials')
      .insert(mockData.testimonials);
    
    if (testimonialsError) throw testimonialsError;
    console.log('✅ Testimonials başarıyla aktarıldı');

    // Projects verilerini aktar
    console.log('📝 Projects verisi aktarılıyor...');
    const { error: projectsError } = await supabase
      .from('projects')
      .insert(mockData.projects);
    
    if (projectsError) throw projectsError;
    console.log('✅ Projects başarıyla aktarıldı');

    // Slider Items verilerini aktar
    console.log('📝 Slider Items verisi aktarılıyor...');
    const { error: sliderError } = await supabase
      .from('slider_items')
      .insert(mockData.sliderItems);
    
    if (sliderError) throw sliderError;
    console.log('✅ Slider Items başarıyla aktarıldı');

    // Properties verilerini aktar
    console.log('📝 Properties verisi aktarılıyor...');
    const { error: propertiesError } = await supabase
      .from('properties')
      .insert(mockData.properties);
    
    if (propertiesError) throw propertiesError;
    console.log('✅ Properties başarıyla aktarıldı');

    console.log('🎉 Tüm veriler başarıyla Supabase\'e aktarıldı!');
    
  } catch (error) {
    console.error('❌ Veri aktarım hatası:', error);
  }
}

migrateData();