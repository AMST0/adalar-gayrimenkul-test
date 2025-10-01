import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Users, 
  Building, 
  MessageSquare, 
  Settings, 
  Image,
  Mail,
  Plus,
  Edit,
  Trash2,
  Eye,
  EyeOff,
  Save,
  X,
  MapPin,
  Phone,
  Star,
  ChevronUp,
  ChevronDown,
  Upload,
  Camera,
  ArrowUp,
  ArrowDown,
  Globe
} from 'lucide-react';
import { useData } from '../../contexts/DataContext';
import { useAdmin } from '../../contexts/AdminContext';
import { Agent, Property } from '../../types';
import Button from '../common/Button';
import Toast from '../common/Toast';
import { dbHelpers } from '../../utils/supabaseClient-new';
import { storageHelpers } from '../../utils/supabaseStorage';


import { useEffect } from 'react';
import { STORAGE_KEYS, getStorageItem } from '../../utils/storage';
import { getAllProvinces, getDistrictsByProvince, getNeighborhoodsByDistrict } from '../../data/turkeyData';

const AdminPanel: React.FC = () => {
  const { logout } = useAdmin();
  const {
    agents,
    properties,
    testimonials,
    contactRequests,
    updateAgents,
    updateProperties,
    updateTestimonials,
    updateContactRequests,
    deleteAgent,
    deleteProperty,
    deleteTestimonial,
    loadAllTestimonialsForAdmin,
    sliderItems,
    updateSliderItems,
    addSliderItem,
  } = useData();

  const [activeTab, setActiveTab] = useState('dashboard');
  const [editingItem, setEditingItem] = useState<any>(null);
  const [showForm, setShowForm] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  // Konfeti efekti kaldırıldı

  // Toast state'leri
  const [toastMessage, setToastMessage] = useState<string>('');
  const [toastType, setToastType] = useState<'success' | 'error' | 'info'>('info');
  const [showToast, setShowToast] = useState(false);

  // Delete confirmation modal state'leri
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<{id: string, type: 'agent' | 'property' | 'testimonial', name?: string} | null>(null);

  // Toast helper function
  const showToastMessage = (message: string, type: 'success' | 'error' | 'info' = 'info') => {
    setToastMessage(message);
    setToastType(type);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 4000);
  };

  // Listings (Sahibinden İlanları) state'leri
  const [listings, setListings] = useState<any[]>([]);
  const [loadingListings, setLoadingListings] = useState(false);
  const [selectedListing, setSelectedListing] = useState<any>(null);
  const [showListingModal, setShowListingModal] = useState(false);

  // Sahibinden ilanlarını çekme fonksiyonu
  const fetchListings = async () => {
    setLoadingListings(true);
    showToastMessage('Sahibinden.com\'dan ilanlar çekiliyor...', 'info');
    
    try {
      // Backend API'yi dene, başarısız olursa mock data kullan
      let data;
      
      try {
        const response = await fetch('/api/scrape-listings');
        
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}`);
        }
        
        const contentType = response.headers.get('content-type');
        if (!contentType || !contentType.includes('application/json')) {
          throw new Error('Backend henüz çalışmıyor');
        }
        
        data = await response.json();
      } catch (apiError) {
        console.log('API hatası, mock data kullanılıyor:', apiError);
        
        // Mock data - sahibinden.com benzeri gerçek veriler
        data = {
          success: true,
          listings: [
            {
              id: "1071245896",
              title: "BÜYÜKADA MERKEZ MAH. İMARLI SATILIK ARSA",
              price: "5.500.000 TL",
              location: "İstanbul, Adalar, Büyükada",
              image: "https://i0.shbdn.com/photos/19/71/24/lthmb_1197124589601.jpg",
              date: "23 Eylül 2025",
              url: "https://www.sahibinden.com/ilan/emlak-arsa-satilik-buyukada-merkez-mah-imarli-satilik-arsa-1071245896/detay",
              description: "Büyükada Merkez Mahallesi'nde 750 m² imarlı satılık arsa. Deniz manzaralı, merkezi konumda, tüm ulaşım imkanlarına yakın. Yatırım için ideal fırsat.",
              features: ["750 m²", "İmarlı", "Deniz Manzaralı", "Merkezi Konum", "Ulaşım Kolaylığı", "Yatırım Fırsatı"]
            },
            {
              id: "1071034567", 
              title: "HEYBELİADA ÇAMLIMANINDA SATILIK ARSA",
              price: "4.200.000 TL",
              location: "İstanbul, Adalar, Heybeliada",
              image: "https://i0.shbdn.com/photos/19/71/03/lthmb_1197103456701.jpg",
              date: "22 Eylül 2025", 
              url: "https://www.sahibinden.com/ilan/emlak-arsa-satilik-heybeliada-camliman-satilik-arsa-1071034567/detay",
              description: "Heybeliada Çamlıman mevkiinde 620 m² satılık arsa. Doğa içinde, sessiz lokasyonda. Villa yapımına uygun, temiz çevre.",
              features: ["620 m²", "Doğa İçinde", "Sessiz Konum", "Villa Arsası", "Temiz Çevre", "İmarlı"]
            },
            {
              id: "1070897234",
              title: "KINALIADA MERKEZ 450 M² SATILIK ARSA",
              price: "2.850.000 TL", 
              location: "İstanbul, Adalar, Kınalıada",
              image: "https://i0.shbdn.com/photos/19/70/89/lthmb_1197089723401.jpg",
              date: "21 Eylül 2025",
              url: "https://www.sahibinden.com/ilan/emlak-arsa-satilik-kinaliada-merkez-450-m2-satilik-arsa-1070897234/detay",
              description: "Kınalıada merkez lokasyonda 450 m² satılık arsa. İskeleye yürüme mesafesi, alışveriş merkezine yakın. Uygun fiyatlı yatırım imkanı.",
              features: ["450 m²", "Merkez Lokasyon", "İskeleye Yakın", "Alışverişe Yakın", "Uygun Fiyat", "Yatırım İmkanı"]
            },
            {
              id: "1070756891",
              title: "BURGAZADA GÖNÜLLÜ CAD. İMARLI ARSA",
              price: "3.750.000 TL",
              location: "İstanbul, Adalar, Burgazada", 
              image: "https://i0.shbdn.com/photos/19/70/75/lthmb_1197075689101.jpg",
              date: "20 Eylül 2025",
              url: "https://www.sahibinden.com/ilan/emlak-arsa-satilik-burgazada-gonullu-cad-imarli-arsa-1070756891/detay",
              description: "Burgazada Gönüllü Caddesi üzerinde 580 m² imarlı satılık arsa. Ana cadde üzeri, ticari imkan, kolay ulaşım. Hem konut hem işyeri için uygun.",
              features: ["580 m²", "Ana Cadde Üzeri", "Ticari İmkan", "Kolay Ulaşım", "Çift Amaçlı", "İmarlı"]
            },
            {
              id: "1070612345",
              title: "BÜYÜKADA ÇANKAYA MAH. VİLLA ARSASI",
              price: "6.900.000 TL",
              location: "İstanbul, Adalar, Büyükada",
              image: "https://i0.shbdn.com/photos/19/70/61/lthmb_1197061234501.jpg", 
              date: "19 Eylül 2025",
              url: "https://www.sahibinden.com/ilan/emlak-arsa-satilik-buyukada-cankaya-mah-villa-arsasi-1070612345/detay",
              description: "Büyükada Çankaya Mahallesi'nde 920 m² lüks villa arsası. Panoramik deniz ve ada manzaralı, prestijli konum. Özel tasarım villa için ideal.",
              features: ["920 m²", "Panoramik Manzara", "Prestijli Konum", "Lüks Villa Arsası", "Özel Tasarım", "Deniz Manzarası"]
            },
            {
              id: "1070498765",
              title: "HEYBELİADA ÇABLI KÖYÜ ARSA",
              price: "1.950.000 TL",
              location: "İstanbul, Adalar, Heybeliada",
              image: "https://i0.shbdn.com/photos/19/70/49/lthmb_1197049876501.jpg",
              date: "18 Eylül 2025", 
              url: "https://www.sahibinden.com/ilan/emlak-arsa-satilik-heybeliada-cabli-koyu-arsa-1070498765/detay",
              description: "Heybeliada Çabli Köyü'nde 380 m² satılık arsa. Doğal yaşam alanı, orman komşusu, sakin çevre. Yazlık ev için ideal lokasyon.",
              features: ["380 m²", "Orman Komşusu", "Doğal Yaşam", "Sakin Çevre", "Yazlık İdeal", "Uygun Fiyat"]
            }
          ],
          total: 6,
          source: 'sahibinden-style-mock',
          message: 'Sahibinden.com tarzı örnek veriler (Backend aktif olmadığı için)'
        };
      }
      
      setListings(data.listings || []);
      const sourceText = data.source === 'database' ? '(Database)' :
                         data.source === 'sahibinden.com' ? '(Gerçek Scraping)' : 
                         '(Mock Data)';
      showToastMessage(`${data.listings?.length || 0} ilan başarıyla çekildi! ${sourceText}`, 'success');
      
    } catch (error) {
      console.error('Listing fetch error:', error);
      showToastMessage('İlanlar çekilirken hata oluştu: ' + (error as Error).message, 'error');
    } finally {
      setLoadingListings(false);
    }
  };

  // Database'den mevcut ilanları getirme fonksiyonu
  const fetchDatabaseListings = async () => {
    setLoadingListings(true);
    showToastMessage('Database\'den kayıtlı ilanlar getiriliyor...', 'info');
    
    try {
      const response = await fetch('/api/listings');
      
      if (!response.ok) {
        throw new Error('Database\'e erişilemedi');
      }
      
      const data = await response.json();
      setListings(data.listings || []);
      showToastMessage(`${data.listings?.length || 0} ilan database'den getirildi!`, 'success');
      
    } catch (error) {
      console.error('Database fetch error:', error);
      showToastMessage('Database\'den ilan getirilirken hata: ' + (error as Error).message, 'error');
    } finally {
      setLoadingListings(false);
    }
  };

  // Slider form state'leri
  const [sliderFormData, setSliderFormData] = useState({
    title: '',
    subtitle: '',
    location: '',
    image: 'https://i.hizliresim.com/rs5qoel.png',
    isActive: true
  });

  // Slider görsel yükleme state'leri
  const [sliderUploading, setSliderUploading] = useState(false);
  const [sliderUploadProgress, setSliderUploadProgress] = useState(0);
  const [sliderToastMessage, setSliderToastMessage] = useState<{
    type: 'success' | 'error' | 'info';
    message: string;
    show: boolean;
  }>({ type: 'success', message: '', show: false });

  // Başarı mesajını göster ve konfeti efekti ile birlikte 3 saniye sonra gizle
  const showSuccessMessage = (message: string) => {
    setSuccessMessage(message);
  // setShowConfetti(true); // konfeti kaldırıldı
    setTimeout(() => {
      setSuccessMessage(null);
  // setShowConfetti(false); // konfeti kaldırıldı
    }, 3000);
  };

  // Slider Toast gösterme fonksiyonu
  const showSliderToast = (type: 'success' | 'error' | 'info', message: string) => {
    setSliderToastMessage({ type, message, show: true });
    setTimeout(() => {
      setSliderToastMessage(prev => ({ ...prev, show: false }));
    }, 4000);
  };

  // EditingItem değiştiğinde slider form data'sını güncelle
  useEffect(() => {
    if (activeTab === 'slider' && editingItem) {
      setSliderFormData({
        title: editingItem.title || '',
        subtitle: editingItem.subtitle || '',
        location: editingItem.location || '',
        image: editingItem.image || 'https://i.hizliresim.com/rs5qoel.png',
        isActive: editingItem.isActive ?? true
      });
    } else if (activeTab === 'slider' && !editingItem) {
      // Yeni slider eklerken form'u temizle
      setSliderFormData({
        title: '',
        subtitle: '',
        location: '',
        image: 'https://i.hizliresim.com/rs5qoel.png',
        isActive: true
      });
    }
  }, [editingItem, activeTab]);

  // Slider dosya yükleme fonksiyonu
  const handleSliderFileUpload = async (files: FileList | null) => {
    if (!files || files.length === 0) return;

    setSliderUploading(true);
    setSliderUploadProgress(0);

    try {
      const file = files[0]; // Sadece tek resim al
      showSliderToast('info', 'Slider görseli yükleniyor...');
      
      // Storage helper kullanarak yükle
      const result = await storageHelpers.uploadImage(file, 'property-images');
      
      if (!result.success) {
        console.error('Dosya yükleme hatası:', result.error);
        showSliderToast('error', `Görsel yüklenemedi: ${result.error}`);
        return;
      }

      if (result.url) {
        setSliderFormData(prev => ({
          ...prev,
          image: result.url || ''
        }));
        showSliderToast('success', '🎉 Slider görseli başarıyla yüklendi!');
      }
    } catch (error) {
      console.error('Yükleme hatası:', error);
      showSliderToast('error', 'Görsel yükleme sırasında beklenmeyen bir hata oluştu');
    } finally {
      setSliderUploading(false);
      setSliderUploadProgress(0);
    }
  };

  // İletişim taleplerini otomatik güncelle
  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        // Sadece ilgili tab açıkken güncelle
        if (activeTab === 'testimonials') {
          const { data: testimonialsData, error: testimonialsError } = await dbHelpers.getAllTestimonials();
          if (!testimonialsError && testimonialsData) {
            const mappedTestimonials = testimonialsData.map((testimonial: any) => ({
              id: testimonial.id + '-supabase',
              name: testimonial.name,
              initials: testimonial.initials,
              comment: testimonial.comment,
              rating: testimonial.rating,
              isActive: testimonial.is_active
            }));
            
            // Önceki veri ile karşılaştır, gerçekten değiştiyse güncelle
            const currentSupabaseIds = testimonials
              .filter(t => t.id.includes('-supabase'))
              .map(t => t.id)
              .sort();
            const newSupabaseIds = mappedTestimonials
              .map(t => t.id)
              .sort();
            
            if (JSON.stringify(currentSupabaseIds) !== JSON.stringify(newSupabaseIds)) {
              updateTestimonials(mappedTestimonials);
              console.log('🔄 Admin Panel: Testimonials güncellendi', mappedTestimonials.length, 'adet');
            }
          }
        }
        
        // Agents tab'ı için
        if (activeTab === 'agents') {
          const { data: agentsData, error: agentsError } = await dbHelpers.getAgents();
          if (!agentsError && agentsData) {
            const mappedAgents = agentsData.map((agent: any) => ({
              id: agent.id + '-supabase',
              name: agent.name,
              title: agent.title,
              image: agent.image,
              phone: agent.phone,
              email: agent.email,
              experience: agent.experience,
              specialties: agent.specialties || ['Gayrimenkul Danışmanlığı'],
              isActive: agent.is_active,
              isFeatured: agent.is_featured,
              portfolioUrl: agent.portfolio_url || 'https://adalargayrimenkul.sahibinden.com/'
            }));
            
            const currentAgentIds = agents
              .filter(a => a.id.includes('-supabase'))
              .map(a => a.id)
              .sort();
            const newAgentIds = mappedAgents
              .map(a => a.id)
              .sort();
            
            if (JSON.stringify(currentAgentIds) !== JSON.stringify(newAgentIds)) {
              updateAgents(mappedAgents);
              console.log('🔄 Admin Panel: Agents güncellendi', mappedAgents.length, 'adet');
            }
          }
        }
        
        // Properties tab'ı için
        if (activeTab === 'properties') {
          const { data: propertiesData, error: propertiesError } = await dbHelpers.getProperties();
          if (!propertiesError && propertiesData) {
            const mappedProperties = propertiesData.map((property: any) => ({
              id: property.id + '-supabase',
              title: property.title,
              location: property.location,
              size: property.size,
              price: property.price,
              image: property.image,
              description: property.description,
              isActive: property.is_active,
              isFeatured: property.is_featured
            }));
            
            const currentPropertyIds = properties
              .filter(p => p.id.includes('-supabase'))
              .map(p => p.id)
              .sort();
            const newPropertyIds = mappedProperties
              .map(p => p.id)
              .sort();
            
            if (JSON.stringify(currentPropertyIds) !== JSON.stringify(newPropertyIds)) {
              updateProperties(mappedProperties);
              console.log('🔄 Admin Panel: Properties güncellendi', mappedProperties.length, 'adet');
            }
          }
        }

        // Contact requests'i güncelle
        const latest = getStorageItem(STORAGE_KEYS.CONTACT_REQUESTS, []);
        updateContactRequests(latest);
      } catch (error) {
        console.error('Admin panel auto-refresh hatası:', error);
      }
    }, 5000); // 5 saniyede bir güncelle (daha az sıklık)
    return () => clearInterval(interval);
  }, [updateTestimonials, updateContactRequests, updateAgents, updateProperties, testimonials, agents, properties, activeTab]);

  // Testimonials tab'ına geçildiğinde tüm testimonials'ları yükle
  useEffect(() => {
    if (activeTab === 'testimonials') {
      loadAllTestimonialsForAdmin();
    }
  }, [activeTab, loadAllTestimonialsForAdmin]);

  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: Settings },
    { id: 'agents', label: 'Danışmanlar', icon: Users },
    { id: 'properties', label: 'Arsalar', icon: Building },
    { id: 'listings', label: 'İlanlarımız', icon: Globe },
    { id: 'slider', label: 'Ana Sayfa Slider', icon: Image },
  { id: 'testimonials', label: 'Müşteri Yorumları', icon: MessageSquare },
    { id: 'contact', label: 'İletişim Talepleri', icon: Mail },
  ];

  const handleToggleActive = (items: any[], updateFunction: Function, id: string) => {
    const updated = items.map(item =>
      item.id === id ? { ...item, isActive: !item.isActive } : item
    );
    updateFunction(updated);
  };

  const handleDeleteAgent = (id: string, name?: string) => {
    setItemToDelete({ id, type: 'agent', name });
    setShowDeleteModal(true);
  };

  const handleDeleteProperty = (id: string, name?: string) => {
    setItemToDelete({ id, type: 'property', name });
    setShowDeleteModal(true);
  };

  const handleDeleteTestimonial = (id: string, name?: string) => {
    setItemToDelete({ id, type: 'testimonial', name });
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (!itemToDelete) return;

    try {
      if (itemToDelete.type === 'agent') {
        deleteAgent(itemToDelete.id);
        showSuccessMessage('✅ Danışman başarıyla silindi!');
      } else if (itemToDelete.type === 'property') {
        deleteProperty(itemToDelete.id);
        showSuccessMessage('✅ Arsa başarıyla silindi!');
      } else if (itemToDelete.type === 'testimonial') {
        // Supabase'dan sil
        const realId = itemToDelete.id.replace('-supabase', '');
        const { error } = await dbHelpers.deleteTestimonial(realId);
        
        if (error) {
          console.error('Supabase yorum silme hatası:', error);
          showSuccessMessage('❌ Yorum silinirken hata oluştu!');
          return;
        }
        
        console.log('✅ Yorum başarıyla Supabase\'dan silindi');
        
        // Local state'i güncelle
        deleteTestimonial(itemToDelete.id);
        showSuccessMessage('✅ Yorum başarıyla silindi!');
      }
    } catch (error) {
      console.error('Delete error:', error);
      showSuccessMessage('❌ Silme işlemi sırasında hata oluştu!');
    }
    
    setShowDeleteModal(false);
    setItemToDelete(null);
  };

  const handleSave = async (items: any[], updateFunction: Function, newItem: any, itemType: 'agents' | 'properties') => {
    try {
      if (editingItem && editingItem.id) {
        // Update existing - Supabase'da güncelle
        const realId = editingItem.id.replace('-supabase', '');
        
        if (itemType === 'agents') {
          const { error } = await dbHelpers.updateAgent(realId, {
            name: newItem.name,
            title: newItem.title,
            image: newItem.image,
            phone: newItem.phone,
            email: newItem.email,
            experience: newItem.experience,
            specialties: newItem.specialties || [],
            portfolio_url: newItem.portfolioUrl || '',
            is_featured: newItem.isFeatured || false,
            is_active: newItem.isActive
          });
          
          if (error) {
            showToastMessage('Agent güncellenirken hata oluştu: ' + error.message, 'error');
            return;
          }
          showSuccessMessage('✅ Danışman başarıyla güncellendi!');
        } else if (itemType === 'properties') {
          const { error } = await dbHelpers.updateProperty(realId, {
            title: newItem.title,
            location: newItem.location,
            size: newItem.size?.toString() || '',
            price: newItem.price,
            image: newItem.image,
            description: newItem.description,
            property_type: 'Arsa',
            is_featured: newItem.isFeatured || false,
            is_active: newItem.isActive,
            // Eksik alanları ekle - database şemasına uygun
            ada: newItem.ada ? parseInt(newItem.ada) : null,
            parsel: newItem.parsel ? parseInt(newItem.parsel) : null,
            pafta: newItem.pafta ? parseInt(newItem.pafta) : null,
            tapu_alani: newItem.tapuAlani ? parseInt(newItem.tapuAlani) : null,
            nitelik: newItem.nitelik || null,
            mevkii: newItem.mevkii || null,
            zemin_tipi: newItem.zeminTipi || null,
            agent_id: newItem.danismanId ? newItem.danismanId.replace('-supabase', '') : null,
            il: newItem.il || null,
            ilce: newItem.ilce || null,
            mahalle_koy: newItem.mahalle || null,
            mahalle_no: newItem.mahalleNo || null,
            image_urls: newItem.images || []
          });
          
          if (error) {
            showToastMessage('Property güncellenirken hata oluştu: ' + error.message, 'error');
            return;
          }
          showSuccessMessage('✅ Arsa/Mülk başarıyla güncellendi!');
        }
        
        // Local state'i güncelle
        const updated = items.map(item =>
          item.id === editingItem.id ? { ...newItem, id: editingItem.id } : item
        );
        updateFunction(updated);
        
      } else {
        // Add new - Doğrudan Supabase'a ekle
        let supabaseData;
        
        if (itemType === 'agents') {
          const { data, error } = await dbHelpers.addAgent({
            name: newItem.name,
            title: newItem.title,
            image: newItem.image,
            phone: newItem.phone,
            email: newItem.email,
            experience: newItem.experience,
            specialties: newItem.specialties || [],
            portfolio_url: newItem.portfolioUrl || 'https://adalargayrimenkul.sahibinden.com/',
            is_featured: newItem.isFeatured || false,
            is_active: newItem.isActive
          });
          
          if (error) {
            showToastMessage('Agent eklenirken hata oluştu: ' + error.message, 'error');
            return;
          }
          showSuccessMessage('✅ Yeni danışman başarıyla eklendi!');
          supabaseData = data;
        } else if (itemType === 'properties') {
          const { data, error } = await dbHelpers.addProperty({
            title: newItem.title,
            location: newItem.location,
            size: newItem.size?.toString() || '',
            price: newItem.price,
            image: newItem.image,
            description: newItem.description,
            property_type: 'Arsa',
            is_featured: newItem.isFeatured || false,
            is_active: newItem.isActive,
            // Eksik alanları ekle - database şemasına uygun
            ada: newItem.ada ? parseInt(newItem.ada) : null,
            parsel: newItem.parsel ? parseInt(newItem.parsel) : null,
            pafta: newItem.pafta ? parseInt(newItem.pafta) : null,
            tapu_alani: newItem.tapuAlani ? parseInt(newItem.tapuAlani) : null,
            nitelik: newItem.nitelik || null,
            mevkii: newItem.mevkii || null,
            zemin_tipi: newItem.zeminTipi || null,
            agent_id: newItem.danismanId ? newItem.danismanId.replace('-supabase', '') : null,
            il: newItem.il || null,
            ilce: newItem.ilce || null,
            mahalle_koy: newItem.mahalle || null,
            mahalle_no: newItem.mahalleNo || null,
            image_urls: newItem.images || []
          });
          
          if (error) {
            showToastMessage('Property eklenirken hata oluştu: ' + error.message, 'error');
            return;
          }
          showSuccessMessage('✅ Yeni arsa/mülk başarıyla eklendi!');
          supabaseData = data;
        }
        
        console.log('✅ Yeni veri Supabase\'a eklendi:', supabaseData);
        
        // Local state'e ekleme - sadece otomatik refresh bekle, manuel ekleme yapma
        // updateFunction fonksiyonunu çağırmıyoruz, auto-refresh sistemi halledecek
      }
      
      setEditingItem(null);
      setShowForm(false);
      
      // Başarı mesajı
      showToastMessage(editingItem?.id ? 'Güncelleme başarılı!' : 'Ekleme başarılı!', 'success');
      
    } catch (error) {
      console.error('handleSave hatası:', error);
      showToastMessage('İşlem sırasında hata oluştu: ' + (error as Error).message, 'error');
    }
  };

  // Danışman sıralamasını değiştirme fonksiyonları
  const moveAgentUp = (index: number) => {
    if (index > 0) {
      const newAgents = [...agents];
      [newAgents[index], newAgents[index - 1]] = [newAgents[index - 1], newAgents[index]];
      updateAgents(newAgents);
      showSuccessMessage(`✅ ${newAgents[index - 1].name} yukarı taşındı!`);
    }
  };

  const moveAgentDown = (index: number) => {
    if (index < agents.length - 1) {
      const newAgents = [...agents];
      [newAgents[index], newAgents[index + 1]] = [newAgents[index + 1], newAgents[index]];
      updateAgents(newAgents);
      showSuccessMessage(`✅ ${newAgents[index + 1].name} aşağı taşındı!`);
    }
  };

  const renderDashboard = () => (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
      <div className="bg-gray-900 text-white p-4 md:p-6 rounded-lg">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between">
          <div>
            <p className="text-gray-100 text-sm md:text-base">Toplam Danışman</p>
            <p className="text-2xl md:text-3xl font-bold">{agents.filter(a => a.isActive).length}</p>
          </div>
          <Users className="w-8 h-8 md:w-12 md:h-12 text-gray-200 mt-2 md:mt-0" />
        </div>
      </div>
      <div className="bg-green-500 text-white p-4 md:p-6 rounded-lg">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between">
          <div>
            <p className="text-green-100 text-sm md:text-base">Aktif Arsalar</p>
            <p className="text-2xl md:text-3xl font-bold">{properties.filter(p => p.isActive).length}</p>
          </div>
          <Building className="w-8 h-8 md:w-12 md:h-12 text-green-200 mt-2 md:mt-0" />
        </div>
      </div>
      <div className="bg-red-500 text-white p-4 md:p-6 rounded-lg">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between">
          <div>
            <p className="text-red-100 text-sm md:text-base">Yeni Mesajlar</p>
            <p className="text-2xl md:text-3xl font-bold">{contactRequests.filter(r => !r.isRead).length}</p>
          </div>
          <Mail className="w-8 h-8 md:w-12 md:h-12 text-red-200 mt-2 md:mt-0" />
        </div>
      </div>
      <div className="bg-purple-500 text-white p-4 md:p-6 rounded-lg">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between">
          <div>
            <p className="text-purple-100 text-sm md:text-base">Aktif Yorumlar</p>
            <p className="text-2xl md:text-3xl font-bold">{testimonials.filter(t => t.isActive).length}</p>
          </div>
          <MessageSquare className="w-8 h-8 md:w-12 md:h-12 text-purple-200 mt-2 md:mt-0" />
        </div>
      </div>
    </div>
  );

  const renderAgents = () => (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 space-y-4 sm:space-y-0">
        <h2 className="text-xl sm:text-2xl font-bold">Danışman Yönetimi</h2>
        <Button onClick={() => { setEditingItem({}); setShowForm(true); }} className="w-full sm:w-auto">
          <Plus className="w-4 h-4 mr-2" />
          Yeni Danışman
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
        {agents.map((agent, index) => (
          <div key={agent.id} className="bg-white p-4 md:p-6 rounded-lg shadow-md border">
            <div className="flex items-start justify-between mb-4">
              <img src={agent.image} alt={agent.name} className="w-10 h-10 md:w-12 md:h-12 rounded-full object-cover" />
              <div className="flex space-x-1 md:space-x-2">
                {/* Sıralama Butonları */}
                <button
                  onClick={() => moveAgentUp(index)}
                  disabled={index === 0}
                  className={`p-1.5 md:p-2 rounded transition-colors ${
                    index === 0 
                      ? 'text-gray-300 cursor-not-allowed' 
                      : 'text-blue-600 hover:bg-blue-50'
                  }`}
                  title="Yukarı Taşı"
                >
                  <ChevronUp className="w-3 h-3 md:w-4 md:h-4" />
                </button>
                <button
                  onClick={() => moveAgentDown(index)}
                  disabled={index === agents.length - 1}
                  className={`p-1.5 md:p-2 rounded transition-colors ${
                    index === agents.length - 1 
                      ? 'text-gray-300 cursor-not-allowed' 
                      : 'text-blue-600 hover:bg-blue-50'
                  }`}
                  title="Aşağı Taşı"
                >
                  <ChevronDown className="w-3 h-3 md:w-4 md:h-4" />
                </button>
                <button
                  onClick={() => handleToggleActive(agents, updateAgents, agent.id)}
                  className={`p-1.5 md:p-2 rounded ${agent.isActive ? 'text-green-600' : 'text-gray-400'}`}
                >
                  {agent.isActive ? <Eye className="w-3 h-3 md:w-4 md:h-4" /> : <EyeOff className="w-3 h-3 md:w-4 md:h-4" />}
                </button>
                <button
                  onClick={() => { setEditingItem(agent); setShowForm(true); }}
                  className="p-1.5 md:p-2 text-gray-600 hover:bg-gray-50 rounded"
                >
                  <Edit className="w-3 h-3 md:w-4 md:h-4" />
                </button>
                <button
                  onClick={() => handleDeleteAgent(agent.id, agent.name)}
                  className="p-1.5 md:p-2 text-red-600 hover:bg-red-50 rounded"
                >
                  <Trash2 className="w-3 h-3 md:w-4 md:h-4" />
                </button>
              </div>
            </div>
            <h3 className="font-bold text-base md:text-lg mb-2">{agent.name}</h3>
            <p className="text-gray-600 mb-2 text-sm md:text-base">{agent.title}</p>
            <p className="text-xs md:text-sm text-gray-500">{agent.experience}</p>
            <div className="flex items-center mt-2">
              <Phone className="w-3 h-3 md:w-4 md:h-4 mr-1 text-gray-400" />
              <span className="text-xs md:text-sm">{agent.phone}</span>
            </div>
            {agent.isFeatured && <Star className="w-3 h-3 md:w-4 md:h-4 text-yellow-500 mt-2" />}
          </div>
        ))}
      </div>

      {showForm && (
        <AgentForm
          agent={editingItem}
          onSave={(agent) => handleSave(agents, updateAgents, agent, 'agents')}
          onCancel={() => { setShowForm(false); setEditingItem(null); }}
        />
      )}
    </div>
  );

  const renderProperties = () => (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Arsa Yönetimi</h2>
        <Button onClick={() => { setEditingItem({}); setShowForm(true); }}>
          <Plus className="w-4 h-4 mr-2" />
          Yeni Arsa
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {properties.map((property) => (
          <div key={property.id} className="bg-white p-6 rounded-lg shadow-md border">
            <div className="flex justify-between items-start mb-4">
              <img src={property.image} alt={property.title} className="w-20 h-16 rounded object-cover" />
              <div className="flex space-x-2">
                <button
                  onClick={() => handleToggleActive(properties, updateProperties, property.id)}
                  className={`p-2 rounded ${property.isActive ? 'text-green-600' : 'text-gray-400'}`}
                >
                  {property.isActive ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                </button>
                <button
                  onClick={() => { setEditingItem(property); setShowForm(true); }}
                  className="p-2 text-gray-600 hover:bg-gray-50 rounded"
                >
                  <Edit className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDeleteProperty(property.id, property.title)}
                  className="p-2 text-red-600 hover:bg-red-50 rounded"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
            <h3 className="font-bold text-lg mb-2">{property.title}</h3>
            <div className="flex items-center mb-2">
              <MapPin className="w-4 h-4 mr-1 text-gray-400" />
              <span className="text-sm text-gray-600">{property.location}</span>
            </div>
            <p className="text-sm text-gray-600 mb-2">{property.size} m²</p>
            <p className="font-bold text-lg text-green-600">
              {new Intl.NumberFormat('tr-TR', {
                style: 'currency',
                currency: 'TRY',
                minimumFractionDigits: 0,
              }).format(property.price)}
            </p>
            {property.isFeatured && <Star className="w-4 h-4 text-yellow-500 mt-2" />}
          </div>
        ))}
      </div>

      {showForm && (
        <PropertyForm
          property={editingItem}
          onSave={(property) => handleSave(properties, updateProperties, property, 'properties')}
          onCancel={() => { setShowForm(false); setEditingItem(null); }}
        />
      )}
    </div>
  );

  const handleDeleteSlide = (id: string) => {
    const updated = sliderItems.filter(s => s.id !== id);
    updateSliderItems(updated);
    showToastMessage('Slide silindi', 'success');
  };

  const handleMoveSlide = (id: string, direction: 'up' | 'down') => {
    const index = sliderItems.findIndex(s => s.id === id);
    if (index === -1) return;
    let newIndex = direction === 'up' ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= sliderItems.length) return; // sınır
    const reordered = [...sliderItems];
    const [item] = reordered.splice(index, 1);
    reordered.splice(newIndex, 0, item);
    updateSliderItems(reordered);
  };

  const renderSlider = () => (
    <div>
      <div className="flex flex-col sm:flex-row justify-between sm:items-center mb-6 gap-4">
        <h2 className="text-2xl font-bold">Ana Sayfa Slider</h2>
        <button
          onClick={() => { setShowForm(true); setEditingItem(null); }}
          className="bg-gray-900 text-white px-4 py-2 rounded hover:bg-gray-800 flex items-center space-x-2"
        >
          <Plus className="w-4 h-4" />
          <span>Yeni Slide Ekle</span>
        </button>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {sliderItems.map((slide, idx) => (
          <div key={slide.id} className="bg-gray-50 rounded-lg p-4 relative group border border-gray-200 hover:shadow-md transition-shadow">
            <div className="relative mb-4">
              <img 
                src={slide.image} 
                alt={slide.title}
                className="w-full h-48 object-cover rounded-lg"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = '/api/placeholder/400/300';
                }}
              />
              {/* Üst sağ aksiyonlar */}
              <div className="absolute top-2 right-2 flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  onClick={() => { setEditingItem(slide); setShowForm(true); }}
                  className="bg-gray-900 text-white p-2 rounded-full hover:bg-gray-800"
                  title="Düzenle"
                >
                  <Edit className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleToggleActive(sliderItems, updateSliderItems, slide.id)}
                  className={`p-2 rounded-full ${slide.isActive ? 'bg-green-500 hover:bg-green-600' : 'bg-gray-500 hover:bg-gray-600'} text-white`}
                  title={slide.isActive ? 'Pasif Yap' : 'Aktif Yap'}
                >
                  {slide.isActive ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                </button>
                <button
                  onClick={() => handleDeleteSlide(slide.id)}
                  className="bg-red-500 hover:bg-red-600 text-white p-2 rounded-full"
                  title="Sil"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
              {/* Sıralama butonları */}
              <div className="absolute bottom-2 left-2 flex flex-col space-y-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  onClick={() => handleMoveSlide(slide.id, 'up')}
                  disabled={idx === 0}
                  className="bg-white/90 backdrop-blur text-gray-700 disabled:opacity-40 p-1 rounded hover:bg-white shadow border"
                  title="Yukarı Taşı"
                >
                  <ArrowUp className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleMoveSlide(slide.id, 'down')}
                  disabled={idx === sliderItems.length - 1}
                  className="bg-white/90 backdrop-blur text-gray-700 disabled:opacity-40 p-1 rounded hover:bg-white shadow border"
                  title="Aşağı Taşı"
                >
                  <ArrowDown className="w-4 h-4" />
                </button>
              </div>
            </div>

            <h3 className="font-semibold text-lg mb-2 line-clamp-2">{slide.title}</h3>
            <p className="text-gray-600 mb-2 line-clamp-1">{slide.subtitle}</p>
            <p className="text-sm text-gray-500 flex items-center">
              <MapPin className="w-4 h-4 mr-1" />
              {slide.location}
            </p>
            
            <div className="mt-3 flex items-center justify-between">
              <span className={`px-2 py-1 rounded-full text-xs ${slide.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                {slide.isActive ? 'Aktif' : 'Pasif'}
              </span>
              <span className="text-xs text-gray-400">#{idx + 1}</span>
            </div>
          </div>
        ))}
      </div>

      {showForm && activeTab === 'slider' && renderSliderForm()}
    </div>
  );

  const renderListings = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Sahibinden.com İlanlarımız</h2>
        <div className="flex space-x-3">
          <button
            onClick={fetchDatabaseListings}
            disabled={loadingListings}
            className="px-6 py-3 bg-green-600 text-white rounded-xl hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 font-semibold flex items-center space-x-2"
          >
            <Globe className="w-5 h-5" />
            <span>{loadingListings ? 'Yükleniyor...' : 'Kayıtlı İlanlar'}</span>
          </button>
          <button
            onClick={fetchListings}
            disabled={loadingListings}
            className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 font-semibold flex items-center space-x-2"
          >
            <Globe className="w-5 h-5" />
            <span>{loadingListings ? 'İlanlar Çekiliyor...' : 'Yeni İlanları Çek'}</span>
          </button>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-lg p-6">
        {loadingListings ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Sahibinden.com'dan ilanlar çekiliyor...</p>
          </div>
        ) : listings.length === 0 ? (
          <div className="text-center py-12">
            <Globe className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Henüz İlan Yok</h3>
            <p className="text-gray-600 mb-4">Sahibinden.com'dan ilanlarınızı çekmek için yukarıdaki butona tıklayın</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {listings.map((listing, index) => (
              <div key={index} className="bg-gray-50 rounded-xl p-4 hover:bg-gray-100 transition-colors">
                <div className="relative mb-3">
                  <img
                    src={listing.image || 'https://via.placeholder.com/400x250?text=Resim+Yok'}
                    alt={listing.title}
                    className="w-full h-48 object-cover rounded-lg"
                  />
                  <div className="absolute top-2 right-2 bg-blue-600 text-white px-2 py-1 rounded-md text-xs font-semibold">
                    {listing.price || 'Fiyat Yok'}
                  </div>
                </div>
                
                <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">
                  {listing.title || 'Başlık Yok'}
                </h3>
                
                <p className="text-sm text-gray-600 mb-2 flex items-center">
                  <MapPin className="w-4 h-4 mr-1" />
                  {listing.location || 'Konum Yok'}
                </p>
                
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-500">
                    {listing.date || 'Tarih Yok'}
                  </span>
                  <button
                    onClick={() => {
                      setSelectedListing(listing);
                      setShowListingModal(true);
                    }}
                    className="px-3 py-1 bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200 transition-colors text-sm font-medium"
                  >
                    Detaylar
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );

  const renderSliderForm = () => {
    const handleSliderSave = async (e: React.FormEvent) => {
      e.preventDefault();
      
      const sliderData = {
        title: sliderFormData.title,
        subtitle: sliderFormData.subtitle,
        location: sliderFormData.location,
        image: sliderFormData.image,
        isActive: sliderFormData.isActive
      };

      if (editingItem && editingItem.id) {
        // Edit existing slider
        const updated = sliderItems.map(item =>
          item.id === editingItem.id ? { ...sliderData, id: editingItem.id } : item
        );
        updateSliderItems(updated);
        showSuccessMessage('✅ Slide başarıyla güncellendi!');
      } else {
        // Add new slider
        await addSliderItem(sliderData);
        showSuccessMessage('✅ Yeni slide başarıyla eklendi!');
      }
      
      setShowForm(false);
      setEditingItem(null);
    };

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-2 sm:p-4">
        <div className="bg-white rounded-lg p-4 sm:p-6 w-full max-w-xs sm:max-w-sm md:max-w-2xl lg:max-w-4xl max-h-[95vh] overflow-y-auto">
          <div className="flex justify-between items-center mb-4 sm:mb-6">
            <h3 className="text-lg sm:text-xl font-bold">
              {editingItem?.id ? 'Slide Düzenle' : 'Yeni Slide Ekle'}
            </h3>
            <button onClick={() => { setShowForm(false); setEditingItem(null); }} className="p-1">
              <X className="w-5 h-5 sm:w-6 sm:h-6" />
            </button>
          </div>
          
          <form onSubmit={handleSliderSave} className="space-y-4 sm:space-y-6">
            {/* Temel Bilgiler Bölümü */}
            <div className="border-b pb-4 sm:pb-6">
              <h4 className="font-semibold mb-3 sm:mb-4 text-gray-700 flex items-center text-sm sm:text-base">
                <Building className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                Temel Bilgiler
              </h4>
              
              <div className="grid grid-cols-1 gap-3 sm:gap-4">
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">Başlık</label>
                  <input
                    type="text"
                    value={sliderFormData.title}
                    onChange={(e) => setSliderFormData({...sliderFormData, title: e.target.value})}
                    required
                    className="w-full p-2 sm:p-3 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-sm sm:text-base"
                    placeholder="ADALAR GAYRİMENKUL"
                  />
                </div>
                
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">Lokasyon</label>
                  <input
                    type="text"
                    value={sliderFormData.location}
                    onChange={(e) => setSliderFormData({...sliderFormData, location: e.target.value})}
                    required
                    className="w-full p-2 sm:p-3 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-sm sm:text-base"
                    placeholder="NİDAPARK"
                  />
                </div>
              </div>
              
              <div className="mt-3 sm:mt-4">
                <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">Alt Başlık</label>
                <input
                  type="text"
                  value={sliderFormData.subtitle}
                  onChange={(e) => setSliderFormData({...sliderFormData, subtitle: e.target.value})}
                  required
                  className="w-full p-2 sm:p-3 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-sm sm:text-base"
                  placeholder="Geleceğin değerli toprakları"
                />
              </div>
            </div>

            {/* Görsel Bölümü */}
            <div className="border-b pb-6">
              <h4 className="font-semibold mb-4 text-gray-700 flex items-center">
                <Image className="w-5 h-5 mr-2" />
                Slider Görseli
              </h4>
              
              {/* Resmi görsel uyarısı */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4">
                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-blue-800">
                      <strong>Önemli:</strong> Yüksek kaliteli ve etkileyici bir görsel kullanınız. 
                      Slider ana sayfada ilk görülen öğedir.
                    </p>
                  </div>
                </div>
              </div>
              
              {/* Mevcut görsel önizlemesi */}
              {sliderFormData.image && sliderFormData.image !== 'https://i.hizliresim.com/rs5qoel.png' && (
                <div className="relative inline-block mb-4">
                  <img 
                    src={sliderFormData.image} 
                    alt="Slider görseli" 
                    className="w-32 h-20 object-cover border-2 border-gray-200 rounded-lg"
                  />
                  <button
                    type="button"
                    onClick={() => setSliderFormData({ ...sliderFormData, image: 'https://i.hizliresim.com/rs5qoel.png' })}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600"
                  >
                    ×
                  </button>
                </div>
              )}

              {/* Default görsel gösterimi */}
              {sliderFormData.image === 'https://i.hizliresim.com/rs5qoel.png' && (
                <div className="relative inline-block mb-4">
                  <img 
                    src={sliderFormData.image} 
                    alt="Varsayılan görsel" 
                    className="w-32 h-20 object-cover border-2 border-gray-300 opacity-60 rounded-lg"
                  />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-xs text-gray-500 bg-white px-2 py-1 rounded">Varsayılan</span>
                  </div>
                </div>
              )}

              {/* Dosya yükleme butonları */}
              <div className="flex flex-col sm:flex-row gap-2 mb-4">
                {/* Dosya seçici */}
                <label className="flex-1 cursor-pointer">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleSliderFileUpload(e.target.files)}
                    className="hidden"
                    disabled={sliderUploading}
                  />
                  <div className="flex items-center justify-center p-3 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors">
                    <Upload className="w-5 h-5 mr-2 text-gray-500" />
                    <span className="text-sm text-gray-600">
                      {sliderUploading ? 'Yükleniyor...' : 'Dosya Seç'}
                    </span>
                  </div>
                </label>

                {/* Kamera (mobil cihazlarda) */}
                <label className="flex-1 cursor-pointer">
                  <input
                    type="file"
                    accept="image/*"
                    capture="environment"
                    onChange={(e) => handleSliderFileUpload(e.target.files)}
                    className="hidden"
                    disabled={sliderUploading}
                  />
                  <div className="flex items-center justify-center p-3 border-2 border-dashed border-gray-300 rounded-lg hover:border-green-500 hover:bg-green-50 transition-colors">
                    <Camera className="w-5 h-5 mr-2 text-gray-500" />
                    <span className="text-sm text-gray-600">
                      {sliderUploading ? 'Yükleniyor...' : 'Fotoğraf Çek'}
                    </span>
                  </div>
                </label>
              </div>

              {/* URL ile ekleme seçeneği */}
              <details className="group">
                <summary className="cursor-pointer text-sm text-blue-600 hover:text-blue-800 flex items-center">
                  <span>URL ile görsel ekle</span>
                  <ChevronDown className="w-4 h-4 ml-1 group-open:rotate-180 transition-transform" />
                </summary>
                <div className="mt-2">
                  <input
                    type="url"
                    placeholder="Görsel URL'si"
                    value={sliderFormData.image}
                    onChange={(e) => setSliderFormData({ ...sliderFormData, image: e.target.value })}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  />
                </div>
              </details>

              {/* Yükleme progress bar */}
              {sliderUploading && (
                <div className="w-full bg-gray-200 rounded-full h-2 mt-4">
                  <div
                    className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${sliderUploadProgress}%` }}
                  ></div>
                </div>
              )}
            </div>

            {/* Ayarlar Bölümü */}
            <div className="pb-6">
              <h4 className="font-semibold mb-4 text-gray-700 flex items-center">
                <Settings className="w-5 h-5 mr-2" />
                Ayarlar
              </h4>
              
              <label className="flex items-center p-4 border rounded-lg hover:bg-gray-50 cursor-pointer w-fit">
                <input
                  type="checkbox"
                  checked={sliderFormData.isActive}
                  onChange={(e) => setSliderFormData({ ...sliderFormData, isActive: e.target.checked })}
                  className="mr-3 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <div>
                  <div className="font-medium text-gray-700">Aktif</div>
                  <div className="text-sm text-gray-500">Slide ana sayfada görünür</div>
                </div>
              </label>
            </div>
            
            {/* Butonlar */}
            <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t">
              <Button type="submit" className="flex-1 py-3" disabled={sliderUploading}>
                <Save className="w-4 h-4 mr-2" />
                {sliderUploading ? 'Yükleniyor...' : 'Kaydet'}
              </Button>
              <Button 
                variant="outline" 
                type="button"
                onClick={() => { setShowForm(false); setEditingItem(null); }} 
                className="flex-1 py-3" 
                disabled={sliderUploading}
              >
                <X className="w-4 h-4 mr-2" />
                İptal
              </Button>
            </div>
          </form>

          {/* Toast Mesajı */}
          {sliderToastMessage.show && (
            <Toast
              type={sliderToastMessage.type}
              message={sliderToastMessage.message}
              show={sliderToastMessage.show}
              onClose={() => setSliderToastMessage(prev => ({ ...prev, show: false }))}
            />
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="pt-0 pb-16 min-h-screen bg-gray-100">
      <style>{`
        .line-clamp-3 {
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        
        /* Mobile Form Optimizations */
        @media (max-width: 640px) {
          .modal-content {
            margin: 0.5rem !important;
            max-width: calc(100vw - 1rem) !important;
          }
          
          .grid-responsive {
            grid-template-columns: 1fr !important;
          }
          
          input, textarea, select {
            font-size: 16px !important; /* Prevents zoom on iOS */
          }
          
          .admin-form-container {
            padding: 0.75rem !important;
          }
          
          .admin-modal {
            padding: 0.5rem !important;
          }
        }
      `}</style>

      {/* Dahili Admin Üst Bar */}
  <div className="sticky top-0 z-40 bg-black/95 backdrop-blur supports-[backdrop-filter]:bg-black/80 border-b border-neutral-800 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center relative">
          {/* Sol: Başlık */}
          <div className="flex flex-col justify-center">
            <h1 className="text-xl sm:text-2xl font-bold text-white leading-tight tracking-tight">Admin Panel</h1>
            <p className="text-xs sm:text-sm text-gray-300 mt-0.5">İçerikleri buradan yönetin.</p>
          </div>
          {/* Orta: Logo */}
          <Link to="/" className="absolute left-1/2 -translate-x-1/2 flex items-center justify-center h-full group">
            <img
              src="https://i.hizliresim.com/rs5qoel.png"
              alt="Logo"
              className="h-14 w-auto object-contain drop-shadow-[0_0_6px_rgba(255,255,255,0.15)] transition-transform group-hover:scale-105"
              referrerPolicy="no-referrer"
            />
          </Link>
          {/* Sağ: Butonlar */}
          <div className="ml-auto flex items-center space-x-3">
            <Link
              to="/"
              className="hidden sm:inline-block px-4 py-2 text-sm font-medium rounded-md bg-neutral-800 hover:bg-neutral-700 text-gray-200 hover:text-white transition"
            >
              Anasayfa
            </Link>
            <Button
              variant="danger"
              onClick={logout}
              className="px-4 py-2 text-sm bg-red-600 hover:bg-red-500 text-white border-0 shadow-md hover:shadow-lg transition"
            >
              Çıkış
            </Button>
          </div>
        </div>
      </div>
      
      {/* Başarı Mesajı */}
      {successMessage && (
        <div className="fixed top-20 right-4 z-50 animate-slide-in-right">
          <div className="bg-green-500 text-white px-6 py-4 rounded-lg shadow-lg flex items-center space-x-3">
            <div className="flex-shrink-0">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
              </svg>
            </div>
            <div className="flex-1">
              <p className="font-medium">{successMessage}</p>
            </div>
            <button 
              onClick={() => {
                setSuccessMessage(null);
                // setShowConfetti(false); // konfeti kaldırıldı
              }}
              className="flex-shrink-0 text-green-200 hover:text-white transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </button>
          </div>
        </div>
      )}

      {/* Konfeti Animasyonu */}
      {/* Konfeti efekti kaldırıldı */}

      <style>{`
        @keyframes slide-in-right {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
        
        .animate-slide-in-right {
          animation: slide-in-right 0.3s ease-out;
        }

        /* Konfeti stilleri kaldırıldı */
      `}</style>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">

        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          {/* Mobile Tab Navigation */}
          <div className="sm:hidden">
            <select
              value={activeTab}
              onChange={(e) => setActiveTab(e.target.value)}
              className="w-full p-4 text-lg font-semibold bg-gray-900 text-white border-0 outline-none"
            >
              {tabs.map((tab) => (
                <option key={tab.id} value={tab.id}>
                  {tab.label}
                </option>
              ))}
            </select>
          </div>

          {/* Desktop Tab Navigation */}
          <div className="hidden sm:flex border-b overflow-x-auto">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 px-4 lg:px-6 py-4 font-semibold transition-colors whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'bg-gray-900 text-white'
                    : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
                }`}
              >
                <tab.icon className="w-5 h-5" />
                <span className="hidden lg:inline">{tab.label}</span>
              </button>
            ))}
          </div>

          <div className="p-3 sm:p-6">
            {activeTab === 'dashboard' && renderDashboard()}
            {activeTab === 'agents' && renderAgents()}
            {activeTab === 'properties' && renderProperties()}
            {activeTab === 'listings' && renderListings()}
            {activeTab === 'slider' && renderSlider()}
            {activeTab === 'testimonials' && (
              <div>
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 sm:mb-6 space-y-3 sm:space-y-0">
                  <h2 className="text-xl sm:text-2xl font-bold">Müşteri Yorumları</h2>
                  <button
                    onClick={async () => {
                      try {
                        const { data: testimonialsData, error } = await dbHelpers.getTestimonials();
                        console.log('🔍 Manuel testimonials yenileme:', { data: testimonialsData, error });
                        if (!error && testimonialsData) {
                          const mappedTestimonials = testimonialsData.map((testimonial: any) => ({
                            id: testimonial.id + '-supabase',
                            name: testimonial.name,
                            initials: testimonial.initials,
                            comment: testimonial.comment,
                            rating: testimonial.rating,
                            isActive: testimonial.is_active
                          }));
                          updateTestimonials(mappedTestimonials);
                          showToastMessage(`${mappedTestimonials.length} yorum yüklendi`, 'success');
                        } else {
                          showToastMessage('Supabase\'dan veri çekilemedi: ' + (error?.message || 'Bilinmeyen hata'), 'error');
                        }
                      } catch (error) {
                        console.error('Manuel yenileme hatası:', error);
                        showToastMessage('Hata: ' + (error as Error).message, 'error');
                      }
                    }}
                    className="px-4 py-2 bg-gray-900 text-white rounded hover:bg-gray-800"
                  >
                    Yenile
                  </button>
                </div>
                <div className="mb-4 p-3 bg-gray-100 rounded">
                  <strong>Debug:</strong> Toplam {testimonials.length} yorum - 
                  Supabase: {testimonials.filter(t => t.id.includes('-supabase')).length}, 
                  Local: {testimonials.filter(t => !t.id.includes('-supabase')).length}
                </div>
                {testimonials.length === 0 ? (
                  <p className="text-gray-500">Henüz müşteri yorumu yok.</p>
                ) : (
                  <div className="overflow-x-auto shadow-lg rounded-lg">
                    <table className="min-w-full bg-white border rounded-lg">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-3 py-3 border-b text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/6">Ad Soyad</th>
                          <th className="px-3 py-3 border-b text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-2/5">Yorum İçeriği</th>
                          <th className="px-3 py-3 border-b text-center text-xs font-medium text-gray-500 uppercase tracking-wider w-1/12">Puan</th>
                          <th className="px-3 py-3 border-b text-center text-xs font-medium text-gray-500 uppercase tracking-wider w-1/8">Durum</th>
                          <th className="px-3 py-3 border-b text-center text-xs font-medium text-gray-500 uppercase tracking-wider w-1/6">İşlemler</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {testimonials.slice().reverse().map((t) => (
                          <tr key={t.id} className="hover:bg-gray-50 transition-colors">
                            <td className="px-3 py-4 border-b">
                              <div className="flex items-center">
                                <div className="flex-shrink-0 h-8 w-8">
                                  <div className="h-8 w-8 rounded-full bg-gray-900 flex items-center justify-center">
                                    <span className="text-xs font-medium text-white">{t.initials}</span>
                                  </div>
                                </div>
                                <div className="ml-3">
                                  <div className="text-sm font-medium text-gray-900 break-words">{t.name || 'İsimsiz'}</div>
                                </div>
                              </div>
                            </td>
                            <td className="px-3 py-4 border-b">
                              <div className="text-sm text-gray-900 max-w-md">
                                <div className="line-clamp-3 break-words">{t.comment}</div>
                              </div>
                            </td>
                            <td className="px-3 py-4 border-b text-center">
                              {t.rating ? (
                                <div className="flex items-center justify-center">
                                  <span className="flex items-center gap-1">
                                    {[1,2,3,4,5].map(i => (
                                      <svg key={i} width="16" height="16" viewBox="0 0 24 24" fill={i <= (t.rating || 0) ? '#fbbf24' : 'none'} stroke="#fbbf24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
                                    ))}
                                  </span>
                                  <span className="ml-2 text-sm text-gray-600">({t.rating}/5)</span>
                                </div>
                              ) : (
                                <span className="text-gray-400">-</span>
                              )}
                            </td>
                            <td className="px-3 py-4 border-b text-center">
                              {t.isActive ? (
                                <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                                  Yayında
                                </span>
                              ) : (
                                <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-yellow-100 text-yellow-800">
                                  Onay Bekliyor
                                </span>
                              )}
                            </td>
                            <td className="px-3 py-4 border-b text-center">
                              <div className="flex items-center justify-center space-x-2">
                                <button
                                  className={`px-3 py-1 rounded-md text-xs font-medium transition-colors ${
                                    t.isActive 
                                      ? 'bg-red-100 text-red-700 hover:bg-red-200' 
                                      : 'bg-green-100 text-green-700 hover:bg-green-200'
                                  }`}
                                  onClick={async () => {
                                    try {
                                      // Supabase'da güncelle
                                      const realId = t.id.replace('-supabase', '');
                                      const { error } = await dbHelpers.updateTestimonial(realId, { is_active: !t.isActive });
                                      
                                      if (error) {
                                        console.error('Supabase yorum güncelleme hatası:', error);
                                        showToastMessage('Yorum durumu güncellenirken bir hata oluştu.', 'error');
                                        return;
                                      }
                                      
                                      console.log('✅ Yorum durumu başarıyla Supabase\'da güncellendi');
                                      
                                      // Local state'i güncelle
                                      const updated = testimonials.map(item => item.id === t.id ? { ...item, isActive: !item.isActive } : item);
                                      updateTestimonials(updated);
                                    } catch (error) {
                                      console.error('Beklenmeyen hata:', error);
                                      showToastMessage('Yorum durumu güncellenirken bir hata oluştu.', 'error');
                                    }
                                  }}
                                  title={t.isActive ? 'Yayından Kaldır' : 'Yayınla'}
                                >
                                  {t.isActive ? 'Kaldır' : 'Yayınla'}
                                </button>
                                <button
                                  onClick={() => handleDeleteTestimonial(t.id, t.name)}
                                  className="p-2 text-red-600 hover:bg-red-50 rounded-md transition-colors"
                                  title="Yorumu Sil"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}
            {activeTab === 'contact' && (
              <div>
                <h2 className="text-2xl font-bold mb-6">İletişim Talepleri</h2>
                {contactRequests.length === 0 ? (
                  <p className="text-gray-500">Henüz iletişim talebi yok.</p>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="min-w-full bg-white border rounded-lg">
                      <thead>
                        <tr>
                          <th className="px-4 py-2 border-b">Ad Soyad</th>
                          <th className="px-4 py-2 border-b">E-posta</th>
                          <th className="px-4 py-2 border-b">Telefon</th>
                          <th className="px-4 py-2 border-b">Mesaj</th>
                          <th className="px-4 py-2 border-b">Tarih</th>
                          <th className="px-4 py-2 border-b">Okundu</th>
                        </tr>
                      </thead>
                      <tbody>
                        {contactRequests.slice().reverse().map((req) => (
                          <tr key={req.id} className="hover:bg-gray-50">
                            <td className="px-4 py-2 border-b">{req.name}</td>
                            <td className="px-4 py-2 border-b">{req.email}</td>
                            <td className="px-4 py-2 border-b">{req.phone}</td>
                            <td className="px-4 py-2 border-b max-w-xs whitespace-pre-line">{req.message}</td>
                            <td className="px-4 py-2 border-b">{new Date(req.date).toLocaleString('tr-TR')}</td>
                            <td className="px-4 py-2 border-b text-center">{req.isRead ? '✓' : '—'}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && itemToDelete && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-2 sm:p-4 z-50">
          <div className="bg-white rounded-xl sm:rounded-2xl p-6 sm:p-8 max-w-sm w-full mx-2 sm:mx-4 transform transition-all duration-200 scale-95 animate-pulse">
            <div className="text-center animate-none">
              {/* Icon */}
              <div className="w-12 h-12 sm:w-16 sm:h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6">
                <Trash2 className="w-6 h-6 sm:w-8 sm:h-8 text-red-600" />
              </div>
              
              {/* Title */}
              <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2 sm:mb-3">
                {itemToDelete.type === 'agent' && 'Danışmanı Sil'}
                {itemToDelete.type === 'property' && 'Arsayı Sil'}
                {itemToDelete.type === 'testimonial' && 'Yorumu Sil'}
              </h3>
              
              {/* Message */}
              <p className="text-gray-600 mb-2">
                {itemToDelete.name && (
                  <>
                    <span className="font-semibold">"{itemToDelete.name}"</span> 
                    {itemToDelete.type === 'agent' && ' adlı danışmanı'}
                    {itemToDelete.type === 'property' && ' adlı arsayı'}
                    {itemToDelete.type === 'testimonial' && ' adlı kullanıcının yorumunu'}
                  </>
                )}
                {!itemToDelete.name && (
                  <>
                    Bu {itemToDelete.type === 'agent' && 'danışmanı'}
                    {itemToDelete.type === 'property' && 'arsayı'}
                    {itemToDelete.type === 'testimonial' && 'yorumu'}
                  </>
                )}
                {' '}silmek istediğinizden emin misiniz?
              </p>
              <p className="text-sm text-red-600 mb-8">Bu işlem geri alınamaz!</p>
              
              {/* Buttons */}
              <div className="flex gap-3">
                <button
                  onClick={() => {
                    setShowDeleteModal(false);
                    setItemToDelete(null);
                  }}
                  className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 font-semibold transition-colors"
                >
                  İptal
                </button>
                <button
                  onClick={confirmDelete}
                  className="flex-1 px-6 py-3 bg-red-600 text-white rounded-xl hover:bg-red-700 font-semibold transition-colors"
                >
                  Evet, Sil
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Listing Detail Modal */}
      {showListingModal && selectedListing && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-2 sm:p-4 z-50">
          <div className="bg-white rounded-xl sm:rounded-2xl max-w-xs sm:max-w-sm md:max-w-2xl lg:max-w-4xl w-full max-h-[95vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 p-4 sm:p-6 flex justify-between items-center">
              <h3 className="text-lg sm:text-xl font-bold text-gray-900">İlan Detayları</h3>
              <button
                onClick={() => {
                  setShowListingModal(false);
                  setSelectedListing(null);
                }}
                className="p-1 sm:p-2 text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-5 h-5 sm:w-6 sm:h-6" />
              </button>
            </div>
            
            <div className="p-4 sm:p-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Görsel Bölümü */}
                <div className="space-y-4">
                  <img
                    src={selectedListing.image || 'https://via.placeholder.com/600x400?text=Resim+Yok'}
                    alt={selectedListing.title}
                    className="w-full h-80 object-cover rounded-lg"
                  />
                  
                  {selectedListing.images && selectedListing.images.length > 1 && (
                    <div className="grid grid-cols-4 gap-2">
                      {selectedListing.images.slice(1, 5).map((img: string, idx: number) => (
                        <img
                          key={idx}
                          src={img}
                          alt={`Ek görsel ${idx + 1}`}
                          className="w-full h-20 object-cover rounded-md cursor-pointer hover:opacity-80 transition-opacity"
                          onClick={() => {
                            // Ana resmi değiştir
                            const newListing = { ...selectedListing, image: img };
                            setSelectedListing(newListing);
                          }}
                        />
                      ))}
                    </div>
                  )}
                </div>
                
                {/* Bilgi Bölümü */}
                <div className="space-y-6">
                  <div>
                    <h4 className="text-2xl font-bold text-gray-900 mb-4">
                      {selectedListing.title}
                    </h4>
                    
                    <div className="grid grid-cols-2 gap-4 mb-6">
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <p className="text-sm text-gray-600">Fiyat</p>
                        <p className="text-lg font-bold text-blue-600">
                          {selectedListing.price || 'Fiyat Bilgisi Yok'}
                        </p>
                      </div>
                      
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <p className="text-sm text-gray-600">Konum</p>
                        <p className="text-lg font-semibold text-gray-900 flex items-center">
                          <MapPin className="w-4 h-4 mr-2" />
                          {selectedListing.location || 'Konum Bilgisi Yok'}
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  {selectedListing.description && (
                    <div>
                      <h5 className="text-lg font-semibold text-gray-900 mb-3">Açıklama</h5>
                      <p className="text-gray-700 leading-relaxed">
                        {selectedListing.description}
                      </p>
                    </div>
                  )}
                  
                  {selectedListing.features && (
                    <div>
                      <h5 className="text-lg font-semibold text-gray-900 mb-3">Özellikler</h5>
                      <div className="grid grid-cols-2 gap-2">
                        {selectedListing.features.map((feature: string, idx: number) => (
                          <div key={idx} className="flex items-center text-sm text-gray-600">
                            <div className="w-2 h-2 bg-blue-600 rounded-full mr-2"></div>
                            {feature}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  <div className="pt-4 border-t border-gray-200">
                    <div className="flex justify-between items-center text-sm text-gray-500">
                      <span>İlan Tarihi: {selectedListing.date || 'Belirtilmemiş'}</span>
                      <span>İlan No: {selectedListing.id || 'Belirtilmemiş'}</span>
                    </div>
                    
                    <div className="mt-4">
                      <a
                        href={selectedListing.url || 'https://adalargayrimenkul.sahibinden.com/'}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors font-semibold text-center block"
                      >
                        Sahibinden.com'da Görüntüle
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Toast Messages */}
      {showToast && (
        <Toast
          type={toastType}
          message={toastMessage}
          show={showToast}
          onClose={() => setShowToast(false)}
        />
      )}
    </div>
  );
};

// Agent Form Component
const AgentForm: React.FC<{
  agent: Partial<Agent>;
  onSave: (agent: Agent) => void;
  onCancel: () => void;
}> = ({ agent, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    name: agent.name || '',
    title: agent.title || '',
    image: agent.image || 'https://i.hizliresim.com/rs5qoel.png',
    phone: agent.phone || '',
    email: agent.email || '',
    experience: agent.experience || '',
    specialties: agent.specialties?.join(', ') || '',
    isActive: agent.isActive ?? true,
    isFeatured: agent.isFeatured ?? false,
    portfolioUrl: agent.portfolioUrl || 'https://adalargayrimenkul.sahibinden.com/',
  });

  // Görsel yükleme state'leri
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [toastMessage, setToastMessage] = useState<{
    type: 'success' | 'error' | 'info';
    message: string;
    show: boolean;
  }>({ type: 'success', message: '', show: false });

  // Toast gösterme fonksiyonu
  const showToast = (type: 'success' | 'error' | 'info', message: string) => {
    setToastMessage({ type, message, show: true });
    setTimeout(() => {
      setToastMessage(prev => ({ ...prev, show: false }));
    }, 4000);
  };

  // Dosya yükleme fonksiyonu
  const handleFileUpload = async (files: FileList | null) => {
    if (!files || files.length === 0) return;

    setUploading(true);
    setUploadProgress(0);

    try {
      const file = files[0]; // Sadece tek resim al
      showToast('info', 'Fotoğraf yükleniyor...');
      
      // Storage helper kullanarak yükle
      const result = await storageHelpers.uploadImage(file, 'property-images');
      
      if (!result.success) {
        console.error('Dosya yükleme hatası:', result.error);
        showToast('error', `Fotoğraf yüklenemedi: ${result.error}`);
        return;
      }

      if (result.url) {
        setFormData(prev => ({
          ...prev,
          image: result.url || ''
        }));
        showToast('success', '🎉 Fotoğraf başarıyla yüklendi!');
      }
    } catch (error) {
      console.error('Yükleme hatası:', error);
      showToast('error', 'Fotoğraf yükleme sırasında beklenmeyen bir hata oluştu');
    } finally {
      setUploading(false);
      setUploadProgress(0);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      ...formData,
      id: agent.id || '',
      specialties: formData.specialties.split(',').map(s => s.trim()),
      portfolioUrl: formData.portfolioUrl,
    } as Agent);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-2 sm:p-4 z-50">
      <div className="bg-white rounded-lg p-4 sm:p-6 w-full max-w-xs sm:max-w-sm md:max-w-2xl lg:max-w-4xl max-h-[95vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-3 sm:mb-4">
          <h3 className="text-lg sm:text-xl font-bold">
            {agent.id ? 'Danışman Düzenle' : 'Yeni Danışman'}
          </h3>
          <button onClick={onCancel} className="p-1">
            <X className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
          {/* Temel Bilgiler Bölümü */}
          <div className="border-b pb-4 sm:pb-6">
            <h4 className="font-semibold mb-3 sm:mb-4 text-gray-700 flex items-center text-sm sm:text-base">
              <Users className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
              Temel Bilgiler
            </h4>
            
            <div className="grid grid-cols-1 gap-3 sm:gap-4">
              <input
                type="text"
                placeholder="Ad Soyad"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full p-2 sm:p-3 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-sm sm:text-base"
                required
              />
              <input
                type="text"
                placeholder="Ünvan"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full p-2 sm:p-3 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-sm sm:text-base"
                required
              />
            </div>
          </div>

          {/* Fotoğraf Bölümü */}
          <div className="border-b pb-6">
            <h4 className="font-semibold mb-4 text-gray-700 flex items-center">
              <Camera className="w-5 h-5 mr-2" />
              Danışman Fotoğrafı
            </h4>
            
            {/* Fotoğraf Yükleme Bölümü */}
            <div className="space-y-4">
            <div className="flex items-center justify-between">
              <label className="block text-sm font-medium text-gray-700">
                Danışman Fotoğrafı
              </label>
              <span className="text-xs text-gray-500">(Opsiyonel)</span>
            </div>
            
            {/* Resmi görsel uyarısı */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-blue-800">
                    <strong>Önemli:</strong> Profesyonel ve resmi bir görsel kullanınız. 
                    Danışman fotoğrafı müşterilerimize güven verir.
                  </p>
                </div>
              </div>
            </div>
            
            {/* Mevcut fotoğraf önizlemesi */}
            {formData.image && formData.image !== 'https://i.hizliresim.com/rs5qoel.png' && (
              <div className="relative inline-block">
                <img 
                  src={formData.image} 
                  alt="Danışman fotoğrafı" 
                  className="w-24 h-24 rounded-full object-cover border-2 border-gray-200"
                />
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, image: 'https://i.hizliresim.com/rs5qoel.png' })}
                  className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600"
                >
                  ×
                </button>
              </div>
            )}

            {/* Default fotoğraf gösterimi */}
            {formData.image === 'https://i.hizliresim.com/rs5qoel.png' && (
              <div className="relative inline-block">
                <img 
                  src={formData.image} 
                  alt="Varsayılan fotoğraf" 
                  className="w-24 h-24 rounded-full object-cover border-2 border-gray-300 opacity-60"
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-xs text-gray-500 bg-white px-2 py-1 rounded">Varsayılan</span>
                </div>
              </div>
            )}

            {/* Dosya yükleme butonları */}
            <div className="flex flex-col sm:flex-row gap-2">
              {/* Dosya seçici */}
              <label className="flex-1 cursor-pointer">
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleFileUpload(e.target.files)}
                  className="hidden"
                  disabled={uploading}
                />
                <div className="flex items-center justify-center p-3 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors">
                  <Upload className="w-5 h-5 mr-2 text-gray-500" />
                  <span className="text-sm text-gray-600">
                    {uploading ? 'Yükleniyor...' : 'Dosya Seç'}
                  </span>
                </div>
              </label>

              {/* Kamera (mobil cihazlarda) */}
              <label className="flex-1 cursor-pointer">
                <input
                  type="file"
                  accept="image/*"
                  capture="environment"
                  onChange={(e) => handleFileUpload(e.target.files)}
                  className="hidden"
                  disabled={uploading}
                />
                <div className="flex items-center justify-center p-3 border-2 border-dashed border-gray-300 rounded-lg hover:border-green-500 hover:bg-green-50 transition-colors">
                  <Camera className="w-5 h-5 mr-2 text-gray-500" />
                  <span className="text-sm text-gray-600">
                    {uploading ? 'Yükleniyor...' : 'Fotoğraf Çek'}
                  </span>
                </div>
              </label>
            </div>

            {/* URL ile ekleme seçeneği */}
            <details className="group">
              <summary className="cursor-pointer text-sm text-blue-600 hover:text-blue-800 flex items-center">
                <span>URL ile fotoğraf ekle</span>
                <ChevronDown className="w-4 h-4 ml-1 group-open:rotate-180 transition-transform" />
              </summary>
              <div className="mt-2">
                <input
                  type="url"
                  placeholder="Fotoğraf URL'si"
                  value={formData.image}
                  onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                  className="w-full p-3 border border-gray-300 rounded-lg"
                />
              </div>
            </details>

            {/* Yükleme progress bar */}
            {uploading && (
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${uploadProgress}%` }}
                ></div>
              </div>
            )}
          </div>
          </div>

          {/* İletişim Bilgileri Bölümü */}
          <div className="border-b pb-6">
            <h4 className="font-semibold mb-4 text-gray-700 flex items-center">
              <Phone className="w-5 h-5 mr-2" />
              İletişim Bilgileri
            </h4>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                type="tel"
                placeholder="Telefon"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full p-3 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                required
              />
              <input
                type="email"
                placeholder="E-posta"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full p-3 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                required
              />
            </div>
          </div>

          {/* Profesyonel Bilgiler Bölümü */}
          <div className="border-b pb-6">
            <h4 className="font-semibold mb-4 text-gray-700 flex items-center">
              <Star className="w-5 h-5 mr-2" />
              Profesyonel Bilgiler
            </h4>
            
            <div className="space-y-4">
              <input
                type="text"
                placeholder="Deneyim (örn: 5 yıl)"
                value={formData.experience}
                onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
                className="w-full p-3 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                required
              />
              <input
                type="text"
                placeholder="Uzmanlık alanları (virgülle ayırın)"
                value={formData.specialties}
                onChange={(e) => setFormData({ ...formData, specialties: e.target.value })}
                className="w-full p-3 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                required
              />
              <input
                type="url"
                placeholder="Sahibinden Portföy Linki (opsiyonel)"
                value={formData.portfolioUrl}
                onChange={(e) => setFormData({ ...formData, portfolioUrl: e.target.value })}
                className="w-full p-3 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Ayarlar Bölümü */}
          <div className="pb-6">
            <h4 className="font-semibold mb-4 text-gray-700 flex items-center">
              <Settings className="w-5 h-5 mr-2" />
              Ayarlar
            </h4>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <label className="flex items-center p-4 border rounded-lg hover:bg-gray-50 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.isActive}
                  onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                  className="mr-3 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <div>
                  <div className="font-medium text-gray-700">Aktif</div>
                  <div className="text-sm text-gray-500">Danışman web sitesinde görünür</div>
                </div>
              </label>
              
              <label className="flex items-center p-4 border rounded-lg hover:bg-gray-50 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.isFeatured}
                  onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })}
                  className="mr-3 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <div>
                  <div className="font-medium text-gray-700">Öne Çıkan</div>
                  <div className="text-sm text-gray-500">Ana sayfada öne çıkarılır</div>
                </div>
              </label>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t">
            <Button type="submit" className="flex-1 py-3" disabled={uploading}>
              <Save className="w-4 h-4 mr-2" />
              {uploading ? 'Yükleniyor...' : 'Kaydet'}
            </Button>
            <Button variant="outline" onClick={onCancel} className="flex-1 py-3" disabled={uploading}>
              <X className="w-4 h-4 mr-2" />
              İptal
            </Button>
          </div>
        </form>

        {/* Toast Mesajı */}
        {toastMessage.show && (
          <Toast
            type={toastMessage.type}
            message={toastMessage.message}
            show={toastMessage.show}
            onClose={() => setToastMessage(prev => ({ ...prev, show: false }))}
          />
        )}
      </div>
    </div>
  );
};

// Property Form Component
const PropertyForm: React.FC<{
  property: Partial<Property>;
  onSave: (property: Property) => void;
  onCancel: () => void;
}> = ({ property, onSave, onCancel }) => {
  const { agents } = useData();
  const [availableDistricts, setAvailableDistricts] = useState<{code: string, name: string}[]>([]);
  const [availableNeighborhoods, setAvailableNeighborhoods] = useState<string[]>([]);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [toastMessage, setToastMessage] = useState<{
    type: 'success' | 'error' | 'info';
    message: string;
    show: boolean;
  }>({ type: 'success', message: '', show: false });
  const [formData, setFormData] = useState({
    title: property.title || '',
    location: property.location || '',
    size: property.size || 0,
    price: property.price || 0,
    image: property.image || 'https://i.hizliresim.com/rs5qoel.png',
    description: property.description || '',
    isActive: property.isActive ?? true,
    isFeatured: property.isFeatured ?? false,
    // Yeni arsa alanları
    il: property.il || '',
    ilce: property.ilce || '',
    mahalle: property.mahalle || '',
    mahalleNo: property.mahalleNo || '',
    ada: property.ada || '',
    parsel: property.parsel || '',
    tapuAlani: property.tapuAlani || 0,
    nitelik: property.nitelik || '',
    mevkii: property.mevkii || '',
    zeminTipi: property.zeminTipi || '',
    pafta: property.pafta || '',
    danismanId: property.danismanId || '',
    images: property.images || [],
  });

  // İl değiştiğinde ilçeleri güncelle
  useEffect(() => {
    if (formData.il) {
      // İl adından code'u bul
      const provinceCode = getAllProvinces().find(p => p.name === formData.il)?.code;
      if (provinceCode) {
        const districts = getDistrictsByProvince(provinceCode);
        setAvailableDistricts(districts);
      }
      // İl değiştiğinde ilçe ve mahalle temizle
      if (formData.ilce) {
        setFormData(prev => ({ ...prev, ilce: '', mahalle: '' }));
      }
    } else {
      setAvailableDistricts([]);
      setAvailableNeighborhoods([]);
    }
  }, [formData.il]);

  // İlçe değiştiğinde mahalleleri güncelle
  useEffect(() => {
    if (formData.ilce) {
      // İlçe adından code'u bul
      const districtCode = availableDistricts.find(d => d.name === formData.ilce)?.code;
      if (districtCode) {
        const neighborhoods = getNeighborhoodsByDistrict(districtCode);
        setAvailableNeighborhoods(neighborhoods);
      }
      // İlçe değiştiğinde mahalle temizle
      if (formData.mahalle) {
        setFormData(prev => ({ ...prev, mahalle: '' }));
      }
    } else {
      setAvailableNeighborhoods([]);
    }
  }, [formData.ilce, availableDistricts]);

  // Toast gösterme fonksiyonu
  const showToast = (type: 'success' | 'error' | 'info', message: string) => {
    setToastMessage({ type, message, show: true });
    setTimeout(() => {
      setToastMessage(prev => ({ ...prev, show: false }));
    }, 4000);
  };

  // Dosya yükleme fonksiyonu
  const handleFileUpload = async (files: FileList | null) => {
    if (!files || files.length === 0) return;

    setUploading(true);
    setUploadProgress(0);
    const uploadedUrls: string[] = [];
    const totalFiles = files.length;

    try {
      showToast('info', `${totalFiles} resim yükleniyor...`);

      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        setUploadProgress(Math.round(((i + 1) / totalFiles) * 100));
        
        // Storage helper kullanarak yükle
        const result = await storageHelpers.uploadImage(file, 'property-images');
        
        if (!result.success) {
          console.error('Dosya yükleme hatası:', result.error);
          showToast('error', `${file.name} yüklenemedi: ${result.error}`);
          continue;
        }

        if (result.url) {
          uploadedUrls.push(result.url);
        }
      }

      // Yüklenen resimleri form datasına ekle
      setFormData(prev => ({
        ...prev,
        images: [...prev.images, ...uploadedUrls],
        // İlk resmi ana resim olarak ayarla
        image: prev.image === 'https://i.hizliresim.com/rs5qoel.png' && uploadedUrls.length > 0 
          ? uploadedUrls[0] 
          : prev.image
      }));

      if (uploadedUrls.length > 0) {
        showToast('success', `🎉 ${uploadedUrls.length} resim başarıyla yüklendi!`);
      } else {
        showToast('error', 'Hiçbir resim yüklenemedi');
      }
    } catch (error) {
      console.error('Yükleme hatası:', error);
      showToast('error', 'Resim yükleme sırasında beklenmeyen bir hata oluştu');
    } finally {
      setUploading(false);
      setUploadProgress(0);
      setSelectedFiles([]);
    }
  };

  // Resim silme fonksiyonu
  const removeImage = (indexToRemove: number) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, index) => index !== indexToRemove)
    }));
    showToast('info', '🗑️ Resim kaldırıldı');
  };

  // Resim sıralama fonksiyonları
  const moveImageUp = (index: number) => {
    if (index === 0) return;
    setFormData(prev => {
      const newImages = [...prev.images];
      [newImages[index - 1], newImages[index]] = [newImages[index], newImages[index - 1]];
      return {
        ...prev,
        images: newImages,
        // İlk resim değiştiyse ana resmi güncelle
        image: newImages[0] !== prev.images[0] ? newImages[0] : prev.image
      };
    });
  };

  const moveImageDown = (index: number) => {
    setFormData(prev => {
      if (index === prev.images.length - 1) return prev;
      const newImages = [...prev.images];
      [newImages[index], newImages[index + 1]] = [newImages[index + 1], newImages[index]];
      return {
        ...prev,
        images: newImages,
        // İlk resim değiştiyse ana resmi güncelle
        image: newImages[0] !== prev.images[0] ? newImages[0] : prev.image
      };
    });
  };

  // Ana resim olarak ayarlama
  const setAsMainImage = (index: number) => {
    setFormData(prev => {
      const newImages = [...prev.images];
      const selectedImage = newImages[index];
      // Seçilen resmi başa al
      newImages.splice(index, 1);
      newImages.unshift(selectedImage);
      return {
        ...prev,
        images: newImages,
        image: selectedImage
      };
    });
    showToast('success', '🌟 Ana resim güncellendi');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      ...formData,
      id: property.id || '',
    } as Property);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-2 sm:p-4 z-50">
      <div className="bg-white rounded-lg p-4 sm:p-6 w-full max-w-xs sm:max-w-sm md:max-w-2xl lg:max-w-4xl max-h-[95vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-3 sm:mb-4">
          <h3 className="text-lg sm:text-xl font-bold">
            {property.id ? 'Arsa Düzenle' : 'Yeni Arsa'}
          </h3>
          <button onClick={onCancel} className="p-1">
            <X className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
          {/* Temel Bilgiler */}
          <div className="border-b pb-3 sm:pb-4">
            <h4 className="font-semibold mb-2 sm:mb-3 text-gray-700 text-sm sm:text-base">Temel Bilgiler</h4>
            <input
              type="text"
              placeholder="Arsa Başlığı"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full p-2 sm:p-3 border border-gray-300 rounded-lg mb-2 sm:mb-3 text-sm sm:text-base"
              required
            />
            <input
              type="text"
              placeholder="Konum"
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              className="w-full p-3 border border-gray-300 rounded-lg mb-3"
              required
            />
            <div className="grid grid-cols-2 gap-3">
              <input
                type="number"
                placeholder="Büyüklük (m²)"
                value={formData.size}
                onChange={(e) => setFormData({ ...formData, size: parseInt(e.target.value) })}
                className="w-full p-3 border border-gray-300 rounded-lg"
                required
              />
              <input
                type="number"
                placeholder="Fiyat (TL)"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: parseInt(e.target.value) })}
                className="w-full p-3 border border-gray-300 rounded-lg"
                required
              />
            </div>
          </div>

          {/* Konum Detayları */}
          <div className="border-b pb-4">
            <h4 className="font-semibold mb-3 text-gray-700">Konum Detayları</h4>
            <div className="grid grid-cols-2 gap-3">
              {/* İl Seçimi */}
              <select
                value={getAllProvinces().find(p => p.name === formData.il)?.code || ''}
                onChange={(e) => {
                  const selectedProvince = getAllProvinces().find(p => p.code === e.target.value);
                  setFormData({ ...formData, il: selectedProvince ? selectedProvince.name : '' });
                }}
                className="w-full p-3 border border-gray-300 rounded-lg"
                required
              >
                <option value="">İl Seçiniz</option>
                {getAllProvinces().map(province => (
                  <option key={province.code} value={province.code}>
                    {province.name}
                  </option>
                ))}
              </select>
              
              {/* İlçe Seçimi */}
              <select
                value={availableDistricts.find(d => d.name === formData.ilce)?.code || ''}
                onChange={(e) => {
                  const selectedDistrict = availableDistricts.find(d => d.code === e.target.value);
                  setFormData({ ...formData, ilce: selectedDistrict ? selectedDistrict.name : '' });
                }}
                className="w-full p-3 border border-gray-300 rounded-lg"
                disabled={!formData.il}
                required
              >
                <option value="">İlçe Seçiniz</option>
                {availableDistricts.map(district => (
                  <option key={district.code} value={district.code}>
                    {district.name}
                  </option>
                ))}
              </select>
              
              {/* Mahalle Seçimi */}
              {availableNeighborhoods.length > 0 ? (
                <select
                  value={formData.mahalle}
                  onChange={(e) => setFormData({ ...formData, mahalle: e.target.value })}
                  className="w-full p-3 border border-gray-300 rounded-lg"
                >
                  <option value="">Mahalle Seçiniz (İsteğe Bağlı)</option>
                  {availableNeighborhoods.map(neighborhood => (
                    <option key={neighborhood} value={neighborhood}>
                      {neighborhood}
                    </option>
                  ))}
                </select>
              ) : (
                <input
                  type="text"
                  placeholder="Mahalle/Köy (İsteğe Bağlı)"
                  value={formData.mahalle}
                  onChange={(e) => setFormData({ ...formData, mahalle: e.target.value })}
                  className="w-full p-3 border border-gray-300 rounded-lg"
                />
              )}
              
              <input
                type="text"
                placeholder="Mahalle No"
                value={formData.mahalleNo}
                onChange={(e) => setFormData({ ...formData, mahalleNo: e.target.value })}
                className="w-full p-3 border border-gray-300 rounded-lg"
              />
            </div>
            <input
              type="text"
              placeholder="Mevkii"
              value={formData.mevkii}
              onChange={(e) => setFormData({ ...formData, mevkii: e.target.value })}
              className="w-full p-3 border border-gray-300 rounded-lg mt-3"
            />
          </div>

          {/* Tapu Bilgileri */}
          <div className="border-b pb-4">
            <h4 className="font-semibold mb-3 text-gray-700">Tapu Bilgileri <span className="text-red-500">*</span></h4>
            <div className="grid grid-cols-2 gap-3">
              <input
                type="text"
                placeholder="Ada *"
                value={formData.ada}
                onChange={(e) => setFormData({ ...formData, ada: e.target.value })}
                className="w-full p-3 border border-gray-300 rounded-lg"
                required
              />
              <input
                type="text"
                placeholder="Parsel *"
                value={formData.parsel}
                onChange={(e) => setFormData({ ...formData, parsel: e.target.value })}
                className="w-full p-3 border border-gray-300 rounded-lg"
                required
              />
              <input
                type="number"
                placeholder="Tapu Alanı (m²) *"
                value={formData.tapuAlani}
                onChange={(e) => setFormData({ ...formData, tapuAlani: parseInt(e.target.value) })}
                className="w-full p-3 border border-gray-300 rounded-lg"
                required
                min="1"
              />
              <input
                type="text"
                placeholder="Pafta *"
                value={formData.pafta}
                onChange={(e) => setFormData({ ...formData, pafta: e.target.value })}
                className="w-full p-3 border border-gray-300 rounded-lg"
                required
              />
            </div>
          </div>

          {/* Özellikler */}
          <div className="border-b pb-4">
            <h4 className="font-semibold mb-3 text-gray-700">Özellikler</h4>
            <div className="grid grid-cols-2 gap-3">
              <input
                type="text"
                placeholder="Nitelik"
                value={formData.nitelik}
                onChange={(e) => setFormData({ ...formData, nitelik: e.target.value })}
                className="w-full p-3 border border-gray-300 rounded-lg"
              />
              <input
                type="text"
                placeholder="Zemin Tipi"
                value={formData.zeminTipi}
                onChange={(e) => setFormData({ ...formData, zeminTipi: e.target.value })}
                className="w-full p-3 border border-gray-300 rounded-lg"
              />
            </div>
            <select
              value={formData.danismanId}
              onChange={(e) => setFormData({ ...formData, danismanId: e.target.value })}
              className="w-full p-3 border border-gray-300 rounded-lg mt-3"
            >
              <option value="">Danışman Seçiniz</option>
              {agents.filter(agent => agent.isActive).map(agent => (
                <option key={agent.id} value={agent.id}>
                  {agent.name} - {agent.title} ({agent.experience})
                </option>
              ))}
            </select>
            
            {/* Seçilen Danışman Bilgileri */}
            {formData.danismanId && (() => {
              const selectedAgent = agents.find(agent => agent.id === formData.danismanId);
              return selectedAgent ? (
                <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <h5 className="font-semibold text-blue-900 mb-3">Seçilen Danışman</h5>
                  <div className="flex items-center space-x-3">
                    <img 
                      src={selectedAgent.image} 
                      alt={selectedAgent.name}
                      className="w-12 h-12 rounded-full object-cover border-2 border-blue-200"
                    />
                    <div className="flex-1">
                      <div className="font-bold text-blue-900">{selectedAgent.name}</div>
                      <div className="text-blue-700 text-sm">{selectedAgent.title}</div>
                      <div className="text-blue-600 text-xs">{selectedAgent.experience}</div>
                    </div>
                    <div className="text-right text-sm">
                      <div className="text-blue-700">📞 {selectedAgent.phone}</div>
                      <div className="text-blue-600">✉️ {selectedAgent.email}</div>
                    </div>
                  </div>
                  {selectedAgent.specialties && selectedAgent.specialties.length > 0 && (
                    <div className="mt-3">
                      <div className="text-xs text-blue-700 mb-1">Uzmanlık Alanları:</div>
                      <div className="flex flex-wrap gap-1">
                        {selectedAgent.specialties.map((specialty, index) => (
                          <span key={index} className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                            {specialty}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ) : null;
            })()}
          </div>

          {/* Görseller Section */}
          <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                <Camera className="w-5 h-5 text-white" />
              </div>
              <div>
                <h4 className="text-lg font-semibold text-gray-900">Görsel Yönetimi</h4>
                <p className="text-sm text-gray-600">Arsa fotoğraflarını yükleyin ve düzenleyin</p>
              </div>
            </div>
            
            {/* Dosya Yükleme Alanı */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-3">
                📸 Resim Yükleme
              </label>
              
              {/* Drag & Drop Alanı */}
              <div className="relative">
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={(e) => handleFileUpload(e.target.files)}
                  className="hidden"
                  id="file-upload"
                  disabled={uploading}
                />
                <label
                  htmlFor="file-upload"
                  className={`relative block w-full border-2 border-dashed rounded-xl p-8 text-center transition-all duration-300 cursor-pointer ${
                    uploading 
                      ? 'border-gray-300 bg-gray-50 cursor-not-allowed' 
                      : 'border-blue-300 bg-gradient-to-br from-blue-50 to-indigo-50 hover:border-blue-400 hover:bg-gradient-to-br hover:from-blue-100 hover:to-indigo-100'
                  }`}
                >
                  <div className="flex flex-col items-center">
                    {uploading ? (
                      <>
                        <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mb-4"></div>
                        <p className="text-lg font-medium text-gray-600 mb-2">Yükleniyor...</p>
                        <p className="text-sm text-gray-500">Lütfen bekleyin, resimleriniz işleniyor</p>
                      </>
                    ) : (
                      <>
                        <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                          <Camera className="w-8 h-8 text-blue-600" />
                        </div>
                        <p className="text-lg font-medium text-gray-900 mb-2">
                          Resimleri buraya sürükleyin veya tıklayın
                        </p>
                        <p className="text-sm text-gray-600 mb-4">
                          PNG, JPG, JPEG formatlarında birden fazla resim seçebilirsiniz
                        </p>
                        <div className="flex items-center justify-center space-x-2 text-blue-600 font-medium">
                          <Upload className="w-5 h-5" />
                          <span>Dosya Seç</span>
                        </div>
                      </>
                    )}
                  </div>
                  
                  {/* Yükleme progress bar'ı için alan */}
                  {uploading && (
                    <div className="absolute bottom-4 left-4 right-4">
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-blue-600 h-2 rounded-full animate-pulse" style={{width: '70%'}}></div>
                      </div>
                    </div>
                  )}
                </label>
              </div>

              {/* Yükleme bilgileri */}
              {selectedFiles.length > 0 && !uploading && (
                <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded-lg">
                  <div className="flex items-center space-x-2 mb-2">
                    <div className="w-4 h-4 bg-green-500 rounded-full flex items-center justify-center">
                      <span className="text-white text-xs">✓</span>
                    </div>
                    <span className="text-sm font-medium text-green-800">
                      {selectedFiles.length} dosya seçildi
                    </span>
                  </div>
                  <ul className="text-sm text-green-700 space-y-1">
                    {selectedFiles.slice(0, 3).map((file, index) => (
                      <li key={index} className="flex items-center space-x-2">
                        <span className="text-green-500">📷</span>
                        <span>{file.name}</span>
                        <span className="text-green-600">({(file.size / 1024 / 1024).toFixed(1)}MB)</span>
                      </li>
                    ))}
                    {selectedFiles.length > 3 && (
                      <li className="text-green-600">...ve {selectedFiles.length - 3} dosya daha</li>
                    )}
                  </ul>
                </div>
              )}

              {/* Dosya yükleme limitleri */}
              <div className="mt-3 p-3 bg-amber-50 border border-amber-200 rounded-lg">
                <div className="flex items-start space-x-2">
                  <div className="text-amber-600 mt-0.5">⚠️</div>
                  <div className="text-sm text-amber-800">
                    <strong>Yükleme Kuralları:</strong>
                    <ul className="mt-1 space-y-1 text-amber-700">
                      <li>• Maksimum dosya boyutu: 10MB</li>
                      <li>• Desteklenen formatlar: PNG, JPG, JPEG, GIF, WebP</li>
                      <li>• Aynı anda birden fazla resim yükleyebilirsiniz</li>
                      <li>• Yüksek kaliteli resimler tercih edin</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            {/* Yüklenen Resimler Galerisi */}
            {formData.images.length > 0 && (
              <div className="mb-4">
                <div className="flex items-center justify-between mb-3">
                  <label className="block text-sm font-medium text-gray-700">
                    Yüklenen Resimler ({formData.images.length})
                  </label>
                  <div className="text-xs text-gray-500 bg-blue-50 px-2 py-1 rounded">
                    💡 İlk resim ana resim olarak kullanılır
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {formData.images.map((imageUrl, index) => (
                    <div key={index} className="relative group bg-white border-2 border-gray-200 rounded-xl p-3 hover:border-blue-300 transition-all duration-200">
                      {/* Resim */}
                      <div className="relative">
                        <img
                          src={imageUrl}
                          alt={`Resim ${index + 1}`}
                          className="w-full h-32 object-cover rounded-lg"
                          onError={(e) => {
                            e.currentTarget.src = 'https://i.hizliresim.com/rs5qoel.png';
                          }}
                        />
                        
                        {/* Ana resim badge */}
                        {index === 0 && (
                          <div className="absolute top-2 left-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white text-xs px-2 py-1 rounded-full shadow-lg flex items-center">
                            <Star className="w-3 h-3 mr-1 fill-current" />
                            Ana Resim
                          </div>
                        )}
                        
                        {/* Sıra numarası */}
                        <div className="absolute top-2 right-2 bg-black bg-opacity-70 text-white text-sm w-6 h-6 rounded-full flex items-center justify-center font-bold">
                          {index + 1}
                        </div>
                      </div>

                      {/* Kontrol butonları */}
                      <div className="mt-3 flex items-center justify-between">
                        {/* Sıralama butonları */}
                        <div className="flex items-center space-x-1">
                          <button
                            type="button"
                            onClick={() => moveImageUp(index)}
                            disabled={index === 0}
                            className={`p-1.5 rounded transition-colors ${
                              index === 0 
                                ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                                : 'bg-blue-100 text-blue-600 hover:bg-blue-200'
                            }`}
                            title="Yukarı taşı"
                          >
                            <ArrowUp className="w-4 h-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => moveImageDown(index)}
                            disabled={index === formData.images.length - 1}
                            className={`p-1.5 rounded transition-colors ${
                              index === formData.images.length - 1 
                                ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                                : 'bg-blue-100 text-blue-600 hover:bg-blue-200'
                            }`}
                            title="Aşağı taşı"
                          >
                            <ArrowDown className="w-4 h-4" />
                          </button>
                        </div>

                        {/* Ana resim yap butonu */}
                        {index !== 0 && (
                          <button
                            type="button"
                            onClick={() => setAsMainImage(index)}
                            className="px-3 py-1.5 bg-yellow-100 text-yellow-700 text-xs rounded-lg hover:bg-yellow-200 transition-colors flex items-center"
                            title="Ana resim yap"
                          >
                            <Star className="w-3 h-3 mr-1" />
                            Ana Yap
                          </button>
                        )}

                        {/* Silme butonu */}
                        <button
                          type="button"
                          onClick={() => removeImage(index)}
                          className="p-1.5 bg-red-100 text-red-600 rounded hover:bg-red-200 transition-colors"
                          title="Resmi sil"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>

                      {/* Resim detayları */}
                      <div className="mt-2 text-xs text-gray-500 bg-gray-50 rounded px-2 py-1">
                        {index === 0 ? '🌟 Ana resim' : `📸 Galeri resmi ${index}`}
                      </div>
                    </div>
                  ))}
                </div>
                
                {/* Resim sıralama ipucu */}
                <div className="mt-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
                  <div className="flex items-start space-x-2">
                    <div className="text-blue-600 mt-0.5">
                      💡
                    </div>
                    <div className="text-sm text-blue-800">
                      <strong>Resim Sıralama İpuçları:</strong>
                      <ul className="mt-1 space-y-1 text-blue-700">
                        <li>• İlk resim otomatik olarak ana resim olur</li>
                        <li>• Yukarı/aşağı oklar ile sıralamayı değiştirebilirsiniz</li>
                        <li>• "Ana Yap" butonu ile herhangi bir resmi ana resim yapabilirsiniz</li>
                        <li>• Resimler kayıt edilirken bu sırayla kaydedilir</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* URL ile Resim Ekleme (Alternatif) */}
            <div className="mb-4">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-4 bg-white text-gray-500 font-medium">veya</span>
                </div>
              </div>
              
              <div className="mt-4 p-4 bg-gray-50 border border-gray-200 rounded-xl">
                <label className="block text-sm font-medium text-gray-700 mb-3 flex items-center">
                  <span className="mr-2">🔗</span>
                  URL ile Ana Resim Ekle (Opsiyonel)
                </label>
                <div className="flex space-x-3">
                  <input
                    type="url"
                    placeholder="https://example.com/resim.jpg"
                    value={formData.image === 'https://i.hizliresim.com/rs5qoel.png' ? '' : formData.image}
                    onChange={(e) => setFormData({ ...formData, image: e.target.value || 'https://i.hizliresim.com/rs5qoel.png' })}
                    className="flex-1 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      if (formData.image && formData.image !== 'https://i.hizliresim.com/rs5qoel.png') {
                        setFormData(prev => ({
                          ...prev,
                          images: [formData.image, ...prev.images.filter(img => img !== formData.image)]
                        }));
                      }
                    }}
                    className="px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center"
                    disabled={!formData.image || formData.image === 'https://i.hizliresim.com/rs5qoel.png'}
                  >
                    <Plus className="w-4 h-4 mr-1" />
                    Ekle
                  </button>
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  Harici bir resim URL'si ekleyerek ana resim olarak kullanabilirsiniz
                </p>
              </div>
            </div>

            {/* Ana Resim Önizleme */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 p-4 rounded-xl">
              <div className="flex items-center justify-between mb-3">
                <label className="text-sm font-medium text-gray-700 flex items-center">
                  <Star className="w-4 h-4 mr-2 text-yellow-500 fill-current" />
                  Ana Resim Önizleme
                </label>
                <span className="text-xs text-blue-600 bg-blue-100 px-2 py-1 rounded-full">
                  {formData.image === 'https://i.hizliresim.com/rs5qoel.png' ? 'Varsayılan' : 'Özel'}
                </span>
              </div>
              <div className="flex items-center space-x-4">
                <img 
                  src={formData.image} 
                  alt="Ana resim önizleme" 
                  className="w-20 h-20 object-cover rounded-lg border-2 border-white shadow-md"
                  onError={(e) => {
                    e.currentTarget.src = 'https://i.hizliresim.com/rs5qoel.png';
                  }}
                />
                <div className="flex-1">
                  <p className="text-sm text-gray-900 font-medium mb-1">
                    Bu resim ilan kartlarında görünecek
                  </p>
                  <p className="text-xs text-gray-600 break-all">
                    {formData.image}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <textarea
            placeholder="Açıklama"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            rows={4}
            className="w-full p-3 border border-gray-300 rounded-lg"
            required
          />
          
          <div className="space-y-2">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={formData.isActive}
                onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                className="mr-2"
              />
              Aktif
            </label>
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={formData.isFeatured}
                onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })}
                className="mr-2"
              />
              Öne Çıkan
            </label>
          </div>

          <div className="flex space-x-4 pt-4">
            <Button type="submit" className="flex-1">
              <Save className="w-4 h-4 mr-2" />
              Kaydet
            </Button>
            <Button variant="outline" onClick={onCancel} className="flex-1">
              İptal
            </Button>
          </div>
        </form>
        
        {/* Toast Notification */}
        <Toast
          type={toastMessage.type}
          message={toastMessage.message}
          show={toastMessage.show}
          onClose={() => setToastMessage(prev => ({ ...prev, show: false }))}
          progress={uploadProgress}
          showProgress={uploading}
        />
      </div>
    </div>
  );
};

export default AdminPanel;