import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// Dil tipleri
export type Language = 'tr' | 'en';

// Çeviri anahtarları interface'i
export interface Translations {
  // Header
  home: string;
  properties: string;
  agents: string;
  about: string;
  contact: string;
  
  // Hero Section
  hero: {
    location: string;
    subtitle: string;
  };
  
  // Buttons
  buttons: {
    call: string;
    contact: string;
    profile: string;
    viewAll: string;
    send: string;
    login: string;
    more: string;
    portfolio: string;
    explore: string;
    viewAllAgents: string;
  };
  
  // Properties
  property: {
    title: string;
    featuredProperties: string;
    allProperties: string;
    price: string;
    area: string;
    type: string;
    status: string;
    location: string;
    description: string;
  };
  
  // Agents
  agent: {
    title: string;
    featuredAgents: string;
    allAgents: string;
    experience: string;
    specialist: string;
    phone: string;
    email: string;
  };
  
  // About
  aboutPage: {
    title: string;
    subtitle: string;
    heroDescription: string;
    mission: string;
    missionDescription: string;
    vision: string;
    visionDescription: string;
    values: string;
    valuesDescription: string;
    ourStory: string;
    storyDescription: string;
    companyHistory: string;
    sectorExperience: string;
    experience: string;
    projects: string;
    clients: string;
    awards: string;
    reliability: {
      title: string;
      description: string;
    };
    customerFocus: {
      title: string;
      description: string;
    };
    professionalism: {
      title: string;
      description: string;
    };
    teamwork: {
      title: string;
      description: string;
    };
  };
  
  // Contact
  contactPage: {
    title: string;
    subtitle: string;
    heroSubtitle: string;
    address: string;
    phone: string;
    email: string;
    workingHours: string;
    showOnMap: string;
    monday: string;
    tuesday: string;
    wednesday: string;
    thursday: string;
    friday: string;
    saturday: string;
    sunday: string;
    responseMessage: string;
    officeLocation: string;
    locationDescription: string;
    form: {
      name: string;
      nameRequired: string;
      phoneNumber: string;
      phoneRequired: string;
      message: string;
      messageRequired: string;
      namePlaceholder: string;
      emailPlaceholder: string;
      phonePlaceholder: string;
      messagePlaceholder: string;
      sendMessage: string;
      successMessage: string;
    };
  };
  
  // Admin
  admin: {
    title: string;
    username: string;
    password: string;
    login: string;
    panel: string;
  };
  
  // Common
  common: {
    loading: string;
    error: string;
    success: string;
    companyName: string;
    welcomeMessage: string;
    successfulSales: string;
    activeProjects: string;
    premiumCollection: string;
    quickAccess: string;
    rights: string;
    customerTestimonials: string;
    contactInfo: string;
  };
  
  // Footer
  footer: {
    rights: string;
    designedBy: string;
  };
}

// Context tipi
interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: Translations;
}

// Context oluştur
const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

// Hook
export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

// Provider props
interface LanguageProviderProps {
  children: ReactNode;
}

// Türkçe çeviriler
const trTranslations: Translations = {
  home: 'Ana Sayfa',
  properties: 'Arsalar',
  agents: 'Danışmanlar',
  about: 'Hakkımızda',
  contact: 'İletişim',
  
  hero: {
    location: 'Adalar Gayrimenkul',
    subtitle: 'Hayalinizdeki arsayı bulun',
  },
  
  buttons: {
    call: 'Ara',
    contact: 'İletişim',
    profile: 'Profil',
    viewAll: 'Tümünü Gör',
    send: 'Gönder',
    login: 'Giriş Yap',
    more: 'Daha Fazla',
    portfolio: 'Portföy',
    explore: 'Keşfet',
    viewAllAgents: 'Tüm Danışmanları Gör',
  },
  
  property: {
    title: 'Arsalar',
    featuredProperties: 'Öne Çıkan Arsalar',
    allProperties: 'Tüm Arsalar',
    price: 'Fiyat',
    area: 'Alan',
    type: 'Tip',
    status: 'Durum',
    location: 'Konum',
    description: 'Açıklama',
  },
  
  agent: {
    title: 'Danışmanlar',
    featuredAgents: 'Uzman Danışmanlarımız',
    allAgents: 'Tüm Danışmanlarımız',
    experience: 'Deneyim',
    specialist: 'Uzman',
    phone: 'Telefon',
    email: 'E-posta',
  },
  
  aboutPage: {
    title: 'Hakkımızda',
    subtitle: 'Güvenilir Emlak Danışmanlığı',
    heroDescription: 'Adalar\'da 15 yılı aşkın deneyimimizle müşterilerimizin emlak yatırımlarında doğru seçimler yapmalarına yardımcı oluyoruz.',
    mission: 'Misyonumuz',
    missionDescription: 'Müşterilerimizin gayrimenkul yatırımlarında en doğru kararları vermelerini sağlamak, güvenilir ve profesyonel hizmet anlayışımızla sektörde fark yaratmak. Her müşterimizi özel hissettirerek, onların rüyalarını gerçeğe dönüştürmek.',
    vision: 'Vizyonumuz',
    visionDescription: 'Adalar bölgesinde gayrimenkul sektörünün lider firması olmak, yenilikçi çözümlerimiz ve müşteri odaklı yaklaşımımızla sektöre yön vermek. Sürdürülebilir büyüme ile bölgenin gayrimenkul değerlerine katkı sağlamak.',
    values: 'Değerlerimiz',
    valuesDescription: 'İş süreçlerimizde rehber olarak kabul ettiğimiz temel değerler',
    ourStory: 'Hikayemiz',
    storyDescription: 'Adalar Gayrimenkul, 2008 yılında Adalar bölgesinin eşsiz güzelliklerini ve yatırım potansiyelini fark eden deneyimli gayrimenkul uzmanları tarafından kuruldu. 15 yılı aşkın sürede, bölgedeki en önemli arsa satışlarında yer aldık ve binlerce müşterimizin hayallerini gerçeğe dönüştürdük. Her geçen gün büyüyen ekibimiz ve artan deneyimimizle sektörde öncü olmaya devam ediyoruz. Bugün, Adalar bölgesinin en güvenilir gayrimenkul firması olarak, müşterilerimize sadece arsa satışı değil, kapsamlı gayrimenkul danışmanlığı hizmeti sunuyoruz.',
    companyHistory: 'Adalar Gayrimenkul Hikayesi',
    sectorExperience: 'Sektör Deneyimi',
    experience: 'Yıl Deneyim',
    projects: 'Tamamlanan Proje',
    clients: 'Mutlu Müşteri',
    awards: 'Ödül',
    reliability: {
      title: 'Güvenilirlik',
      description: 'Müşterilerimizin güvenini kazanmak ve korumak için şeffaf ve dürüst hizmet veriyoruz.',
    },
    customerFocus: {
      title: 'Müşteri Odaklılık',
      description: 'Her müşterimizin ihtiyaçlarını anlayarak özel çözümler üretiyoruz.',
    },
    professionalism: {
      title: 'Profesyonellik',
      description: 'Sektördeki deneyimimiz ve uzmanlığımızla en iyi hizmeti sunuyoruz.',
    },
    teamwork: {
      title: 'Takım Çalışması',
      description: 'Güçlü ekibimizle müşterilerimize kapsamlı destek sağlıyoruz.',
    },
  },
  
  contactPage: {
    title: 'İletişim',
    subtitle: 'Bize Ulaşın',
    heroSubtitle: 'Rüya arsanızı bulmak için buradayız. Uzman ekibimiz size en uygun çözümleri sunacak.',
    address: 'Adres',
    phone: 'Telefon',
    email: 'E-posta',
    workingHours: 'Çalışma Saatleri',
    showOnMap: 'Haritada Göster',
    monday: 'Pazartesi',
    tuesday: 'Salı',
    wednesday: 'Çarşamba',
    thursday: 'Perşembe',
    friday: 'Cuma',
    saturday: 'Cumartesi',
    sunday: 'Pazar',
    responseMessage: 'Size en kısa sürede dönüş yapacağız',
    officeLocation: 'Ofis Konumumuz',
    locationDescription: 'Küçükyalı Nidapark konumumuzda sizleri bekliyoruz',
    form: {
      name: 'Adınız Soyadınız',
      nameRequired: 'Adınız Soyadınız *',
      phoneNumber: 'Telefon Numaranız',
      phoneRequired: 'Telefon Numaranız *',
      message: 'Mesajınız',
      messageRequired: 'Mesajınız *',
      namePlaceholder: 'Adınızı ve soyadınızı girin',
      emailPlaceholder: 'E-posta adresinizi girin',
      phonePlaceholder: 'Telefon numaranızı girin',
      messagePlaceholder: 'Nasıl yardımcı olabiliriz? Aradığınız arsa özelliklerini belirtir misiniz?',
      sendMessage: 'Mesaj Gönder',
      successMessage: 'Mesajınız başarıyla gönderildi! En kısa sürede size dönüş yapacağız.',
    },
  },
  
  admin: {
    title: 'Admin Paneli',
    username: 'Kullanıcı Adı',
    password: 'Şifre',
    login: 'Giriş Yap',
    panel: 'Admin Paneli',
  },
  
  common: {
    loading: 'Yükleniyor...',
    error: 'Hata',
    success: 'Başarılı',
    companyName: 'Adalar Gayrimenkul',
    welcomeMessage: 'Hoşgeldiniz',
    successfulSales: 'Başarılı Satış',
    activeProjects: 'Aktif Proje',
    premiumCollection: 'Premium Koleksiyon',
    quickAccess: 'Hızlı Erişim',
    rights: 'Tüm hakları saklıdır.',
    customerTestimonials: 'Müşteri Yorumları',
    contactInfo: 'İletişim Bilgileri',
  },
  
  footer: {
    rights: 'Tüm hakları saklıdır.',
    designedBy: 'Tasarım',
  },
};

// İngilizce çeviriler
const enTranslations: Translations = {
  home: 'Home',
  properties: 'Properties',
  agents: 'Agents',
  about: 'About Us',
  contact: 'Contact',
  
  hero: {
    location: 'Adalar Gayrimenkul',
    subtitle: 'Find your dream property',
  },
  
  buttons: {
    call: 'Call',
    contact: 'Contact',
    profile: 'Profile',
    viewAll: 'View All',
    send: 'Send',
    login: 'Login',
    more: 'More',
    portfolio: 'Portfolio',
    explore: 'Explore',
    viewAllAgents: 'View All Agents',
  },
  
  property: {
    title: 'Properties',
    featuredProperties: 'Featured Properties',
    allProperties: 'All Properties',
    price: 'Price',
    area: 'Area',
    type: 'Type',
    status: 'Status',
    location: 'Location',
    description: 'Description',
  },
  
  agent: {
    title: 'Agents',
    featuredAgents: 'Our Expert Agents',
    allAgents: 'All Our Agents',
    experience: 'Experience',
    specialist: 'Specialist',
    phone: 'Phone',
    email: 'Email',
  },
  
  aboutPage: {
    title: 'About Us',
    subtitle: 'Trusted Real Estate Consultancy',
    heroDescription: 'With over 15 years of experience in Adalar, we help our clients make the right choices in their real estate investments.',
    mission: 'Our Mission',
    missionDescription: 'To help our clients make the right decisions in their real estate investments, to make a difference in the sector with our reliable and professional service approach. To make each of our clients feel special and turn their dreams into reality.',
    vision: 'Our Vision',
    visionDescription: 'To be the leading company in the real estate sector in the Adalar region, to lead the sector with our innovative solutions and customer-focused approach. To contribute to the real estate values of the region through sustainable growth.',
    values: 'Our Values',
    valuesDescription: 'The core values that we accept as guides in our business processes',
    ourStory: 'Our Story',
    storyDescription: 'Adalar Gayrimenkul was founded in 2008 by experienced real estate professionals who recognized the unique beauty and investment potential of the Adalar region. Over 15 years, we have been involved in the most important land sales in the region and made the dreams of thousands of our customers come true. We continue to be pioneers in the sector with our growing team and increasing experience. Today, as the most reliable real estate company in the Adalar region, we offer our customers not only land sales but comprehensive real estate consultancy services.',
    companyHistory: 'Adalar Gayrimenkul Story',
    sectorExperience: 'Sector Experience',
    experience: 'Years Experience',
    projects: 'Completed Projects',
    clients: 'Happy Clients',
    awards: 'Awards',
    reliability: {
      title: 'Reliability',
      description: 'We provide transparent and honest service to gain and maintain the trust of our clients.',
    },
    customerFocus: {
      title: 'Customer Focus',
      description: 'We understand each client\'s needs and create special solutions.',
    },
    professionalism: {
      title: 'Professionalism',
      description: 'We provide the best service with our experience and expertise in the sector.',
    },
    teamwork: {
      title: 'Teamwork',
      description: 'We provide comprehensive support to our clients with our strong team.',
    },
  },
  
  contactPage: {
    title: 'Contact',
    subtitle: 'Get In Touch',
    heroSubtitle: 'We are here to help you find your dream land. Our expert team will provide you with the most suitable solutions.',
    address: 'Address',
    phone: 'Phone',
    email: 'Email',
    workingHours: 'Working Hours',
    showOnMap: 'Show on Map',
    monday: 'Monday',
    tuesday: 'Tuesday',
    wednesday: 'Wednesday',
    thursday: 'Thursday',
    friday: 'Friday',
    saturday: 'Saturday',
    sunday: 'Sunday',
    responseMessage: 'We will get back to you as soon as possible',
    officeLocation: 'Our Office Location',
    locationDescription: 'We are waiting for you at our Küçükyalı Nidapark location',
    form: {
      name: 'Your Name',
      nameRequired: 'Your Name *',
      phoneNumber: 'Your Phone Number',
      phoneRequired: 'Your Phone Number *',
      message: 'Your Message',
      messageRequired: 'Your Message *',
      namePlaceholder: 'Enter your full name',
      emailPlaceholder: 'Enter your email address',
      phonePlaceholder: 'Enter your phone number',
      messagePlaceholder: 'How can we help you? Please specify the property features you are looking for.',
      sendMessage: 'Send Message',
      successMessage: 'Your message has been sent successfully! We will get back to you shortly.',
    },
  },
  
  admin: {
    title: 'Admin Panel',
    username: 'Username',
    password: 'Password',
    login: 'Login',
    panel: 'Admin Panel',
  },
  
  common: {
    loading: 'Loading...',
    error: 'Error',
    success: 'Success',
    companyName: 'Adalar Gayrimenkul',
    welcomeMessage: 'Welcome',
    successfulSales: 'Successful Sales',
    activeProjects: 'Active Projects',
    premiumCollection: 'Premium Collection',
    quickAccess: 'Quick Access',
    rights: 'All rights reserved.',
    customerTestimonials: 'Customer Testimonials',
    contactInfo: 'Contact Information',
  },
  
  footer: {
    rights: 'All rights reserved.',
    designedBy: 'Design',
  },
};

// Çeviriler objesi
const translations = {
  tr: trTranslations,
  en: enTranslations,
};

// Provider komponenti
export const LanguageProvider: React.FC<LanguageProviderProps> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('tr');

  // LocalStorage'dan dil tercihi al
  useEffect(() => {
    const savedLanguage = localStorage.getItem('language') as Language;
    if (savedLanguage && (savedLanguage === 'tr' || savedLanguage === 'en')) {
      setLanguage(savedLanguage);
    }
  }, []);

  // Dil değiştiğinde localStorage'a kaydet
  const handleSetLanguage = (lang: Language) => {
    setLanguage(lang);
    localStorage.setItem('language', lang);
  };

  const value = {
    language,
    setLanguage: handleSetLanguage,
    t: translations[language],
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};