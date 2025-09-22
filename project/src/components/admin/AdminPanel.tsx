import React, { useState } from 'react';
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
  ChevronDown
} from 'lucide-react';
import { useData } from '../../contexts/DataContext';
import { useAdmin } from '../../contexts/AdminContext';
import { Agent, Property } from '../../types';
import Button from '../common/Button';
import { dbHelpers } from '../../utils/supabaseClient-new';


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
  const [showConfetti, setShowConfetti] = useState(false);

  // Başarı mesajını göster ve konfeti efekti ile birlikte 3 saniye sonra gizle
  const showSuccessMessage = (message: string) => {
    setSuccessMessage(message);
    setShowConfetti(true);
    setTimeout(() => {
      setSuccessMessage(null);
      setShowConfetti(false);
    }, 3000);
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

  const handleDeleteAgent = (id: string) => {
    if (window.confirm('Bu danışmanı silmek istediğinizden emin misiniz?')) {
      deleteAgent(id);
    }
  };

  const handleDeleteProperty = (id: string) => {
    if (window.confirm('Bu mülkü silmek istediğinizden emin misiniz?')) {
      deleteProperty(id);
    }
  };

  const handleDeleteTestimonial = async (id: string) => {
    if (window.confirm('Bu yorumu silmek istediğinizden emin misiniz?')) {
      try {
        // Supabase'dan sil
        const realId = id.replace('-supabase', '');
        const { error } = await dbHelpers.deleteTestimonial(realId);
        
        if (error) {
          console.error('Supabase yorum silme hatası:', error);
          alert('Yorum silinirken bir hata oluştu.');
          return;
        }
        
        console.log('✅ Yorum başarıyla Supabase\'dan silindi');
        
        // Local state'i güncelle
        deleteTestimonial(id);
      } catch (error) {
        console.error('Beklenmeyen hata:', error);
        alert('Yorum silinirken bir hata oluştu.');
      }
    }
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
            alert('Agent güncellenirken hata oluştu: ' + error.message);
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
            is_active: newItem.isActive
          });
          
          if (error) {
            alert('Property güncellenirken hata oluştu: ' + error.message);
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
            alert('Agent eklenirken hata oluştu: ' + error.message);
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
            is_active: newItem.isActive
          });
          
          if (error) {
            alert('Property eklenirken hata oluştu: ' + error.message);
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
      alert(editingItem?.id ? 'Güncelleme başarılı!' : 'Ekleme başarılı!');
      
    } catch (error) {
      console.error('handleSave hatası:', error);
      alert('İşlem sırasında hata oluştu: ' + (error as Error).message);
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
                  onClick={() => handleDeleteAgent(agent.id)}
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
                  onClick={() => handleDeleteProperty(property.id)}
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

  const renderSlider = () => (
    <div>
      <div className="flex justify-between items-center mb-6">
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
        {sliderItems.map((slide) => (
          <div key={slide.id} className="bg-gray-50 rounded-lg p-4 relative group">
            <img 
              src={slide.image} 
              alt={slide.title}
              className="w-full h-48 object-cover rounded-lg mb-4"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = '/api/placeholder/400/300';
              }}
            />
            
            <div className="absolute top-2 right-2 flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <button
                onClick={() => { setEditingItem(slide); setShowForm(true); }}
                className="bg-gray-900 text-white p-2 rounded-full hover:bg-gray-800"
              >
                <Edit className="w-4 h-4" />
              </button>
              <button
                onClick={() => handleToggleActive(sliderItems, updateSliderItems, slide.id)}
                className={`p-2 rounded-full ${slide.isActive ? 'bg-green-500 hover:bg-green-600' : 'bg-gray-500 hover:bg-gray-600'} text-white`}
              >
                {slide.isActive ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
              </button>
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
            </div>
          </div>
        ))}
      </div>

      {showForm && activeTab === 'slider' && renderSliderForm()}
    </div>
  );

  const renderSliderForm = () => {
    const handleSliderSave = async (e: React.FormEvent) => {
      e.preventDefault();
      const formData = new FormData(e.target as HTMLFormElement);
      
      const sliderData = {
        title: formData.get('title') as string,
        subtitle: formData.get('subtitle') as string,
        location: formData.get('location') as string,
        image: formData.get('image') as string,
        isActive: formData.get('isActive') === 'on'
      };

      if (editingItem && editingItem.id) {
        // Edit existing slider
        const updated = sliderItems.map(item =>
          item.id === editingItem.id ? { ...sliderData, id: editingItem.id } : item
        );
        updateSliderItems(updated);
      } else {
        // Add new slider
        await addSliderItem(sliderData);
      }
      
      setShowForm(false);
      setEditingItem(null);
    };

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
          <h3 className="text-lg font-semibold mb-4">
            {editingItem?.id ? 'Slide Düzenle' : 'Yeni Slide Ekle'}
          </h3>
          
          <form onSubmit={handleSliderSave} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Başlık</label>
              <input
                type="text"
                name="title"
                defaultValue={editingItem?.title || ''}
                required
                className="w-full p-2 border rounded"
                placeholder="ADALAR GAYRİMENKUL"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Alt Başlık</label>
              <input
                type="text"
                name="subtitle"
                defaultValue={editingItem?.subtitle || ''}
                required
                className="w-full p-2 border rounded"
                placeholder="Geleceğin değerli toprakları"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Lokasyon</label>
              <input
                type="text"
                name="location"
                defaultValue={editingItem?.location || ''}
                required
                className="w-full p-2 border rounded"
                placeholder="NİDAPARK"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Görsel URL</label>
              <input
                type="url"
                name="image"
                defaultValue={editingItem?.image || 'https://i.hizliresim.com/rs5qoel.png'}
                required
                className="w-full p-2 border rounded"
                placeholder="https://i.hizliresim.com/rs5qoel.png"
              />
            </div>
            
            <div className="flex items-center">
              <input
                type="checkbox"
                name="isActive"
                defaultChecked={editingItem?.isActive || false}
                className="mr-2"
              />
              <label className="text-sm font-medium">Aktif</label>
            </div>
            
            <div className="flex space-x-3 pt-4">
              <button
                type="submit"
                className="flex-1 bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
              >
                Kaydet
              </button>
              <button
                type="button"
                onClick={() => { setShowForm(false); setEditingItem(null); }}
                className="flex-1 bg-gray-500 text-white py-2 rounded hover:bg-gray-600"
              >
                İptal
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  };

  return (
    <div className="pt-24 pb-16 min-h-screen bg-gray-100">
      <style>{`
        .line-clamp-3 {
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
      
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
                setShowConfetti(false);
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
      {showConfetti && (
        <div className="fixed inset-0 pointer-events-none z-40">
          {Array.from({ length: 50 }).map((_, i) => (
            <div
              key={i}
              className="confetti"
              style={{
                left: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 3}s`,
                animationDuration: `${2 + Math.random() * 2}s`
              }}
            />
          ))}
        </div>
      )}

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

        @keyframes confetti-fall {
          0% {
            transform: translateY(-100vh) rotateZ(0deg);
            opacity: 1;
          }
          100% {
            transform: translateY(100vh) rotateZ(360deg);
            opacity: 0;
          }
        }

        .confetti {
          position: fixed;
          width: 10px;
          height: 10px;
          background: #FFD700;
          animation: confetti-fall 3s linear;
          z-index: 9999;
        }

        .confetti:nth-child(odd) {
          background: #FF6B6B;
          width: 8px;
          height: 8px;
          animation-delay: -0.5s;
        }

        .confetti:nth-child(even) {
          background: #4ECDC4;
          width: 6px;
          height: 6px;
          animation-delay: -1s;
        }

        .confetti:nth-child(3n) {
          background: #45B7D1;
          width: 12px;
          height: 12px;
          animation-delay: -1.5s;
        }

        .confetti:nth-child(4n) {
          background: #96CEB4;
          width: 7px;
          height: 7px;
          animation-delay: -2s;
        }

        .confetti:nth-child(5n) {
          background: #FFEAA7;
          width: 9px;
          height: 9px;
          animation-delay: -2.5s;
        }
      `}</style>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 space-y-4 sm:space-y-0">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Admin Panel</h1>
          <Button variant="danger" onClick={logout} className="w-full sm:w-auto">
            Çıkış Yap
          </Button>
        </div>

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

          <div className="p-6">
            {activeTab === 'dashboard' && renderDashboard()}
            {activeTab === 'agents' && renderAgents()}
            {activeTab === 'properties' && renderProperties()}
            {activeTab === 'slider' && renderSlider()}
            {activeTab === 'testimonials' && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold">Müşteri Yorumları</h2>
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
                          alert(`${mappedTestimonials.length} yorum yüklendi`);
                        } else {
                          alert('Supabase\'dan veri çekilemedi: ' + (error?.message || 'Bilinmeyen hata'));
                        }
                      } catch (error) {
                        console.error('Manuel yenileme hatası:', error);
                        alert('Hata: ' + (error as Error).message);
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
                                        alert('Yorum durumu güncellenirken bir hata oluştu.');
                                        return;
                                      }
                                      
                                      console.log('✅ Yorum durumu başarıyla Supabase\'da güncellendi');
                                      
                                      // Local state'i güncelle
                                      const updated = testimonials.map(item => item.id === t.id ? { ...item, isActive: !item.isActive } : item);
                                      updateTestimonials(updated);
                                    } catch (error) {
                                      console.error('Beklenmeyen hata:', error);
                                      alert('Yorum durumu güncellenirken bir hata oluştu.');
                                    }
                                  }}
                                  title={t.isActive ? 'Yayından Kaldır' : 'Yayınla'}
                                >
                                  {t.isActive ? 'Kaldır' : 'Yayınla'}
                                </button>
                                <button
                                  onClick={() => handleDeleteTestimonial(t.id)}
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
    image: agent.image || '',
    phone: agent.phone || '',
    email: agent.email || '',
    experience: agent.experience || '',
    specialties: agent.specialties?.join(', ') || '',
    isActive: agent.isActive ?? true,
    isFeatured: agent.isFeatured ?? false,
    portfolioUrl: agent.portfolioUrl || 'https://adalargayrimenkul.sahibinden.com/',
  });

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
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold">
            {agent.id ? 'Danışman Düzenle' : 'Yeni Danışman'}
          </h3>
          <button onClick={onCancel}>
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            placeholder="Ad Soyad"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="w-full p-3 border border-gray-300 rounded-lg"
            required
          />
          <input
            type="text"
            placeholder="Ünvan"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            className="w-full p-3 border border-gray-300 rounded-lg"
            required
          />
          <input
            type="url"
            placeholder="Fotoğraf URL"
            value={formData.image}
            onChange={(e) => setFormData({ ...formData, image: e.target.value })}
            className="w-full p-3 border border-gray-300 rounded-lg"
            required
          />
          <input
            type="tel"
            placeholder="Telefon"
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            className="w-full p-3 border border-gray-300 rounded-lg"
            required
          />
          <input
            type="email"
            placeholder="E-posta"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            className="w-full p-3 border border-gray-300 rounded-lg"
            required
          />
          <input
            type="text"
            placeholder="Deneyim (örn: 5 yıl)"
            value={formData.experience}
            onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
            className="w-full p-3 border border-gray-300 rounded-lg"
            required
          />
          <input
            type="text"
            placeholder="Uzmanlık alanları (virgülle ayırın)"
            value={formData.specialties}
            onChange={(e) => setFormData({ ...formData, specialties: e.target.value })}
            className="w-full p-3 border border-gray-300 rounded-lg"
            required
          />
          <input
            type="url"
            placeholder="Sahibinden Portföy Linki (opsiyonel)"
            value={formData.portfolioUrl}
            onChange={(e) => setFormData({ ...formData, portfolioUrl: e.target.value })}
            className="w-full p-3 border border-gray-300 rounded-lg"
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
      const districts = getDistrictsByProvince(formData.il);
      setAvailableDistricts(districts);
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
      const neighborhoods = getNeighborhoodsByDistrict(formData.ilce);
      setAvailableNeighborhoods(neighborhoods);
      // İlçe değiştiğinde mahalle temizle
      if (formData.mahalle) {
        setFormData(prev => ({ ...prev, mahalle: '' }));
      }
    } else {
      setAvailableNeighborhoods([]);
    }
  }, [formData.ilce]);

  const handleFileUpload = (files: FileList | null) => {
    if (files) {
      const fileArray = Array.from(files);
      setSelectedFiles(fileArray);
      // Burada dosyaları upload edecek fonksiyon eklenebilir
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      ...formData,
      id: property.id || '',
    } as Property);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold">
            {property.id ? 'Arsa Düzenle' : 'Yeni Arsa'}
          </h3>
          <button onClick={onCancel}>
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Temel Bilgiler */}
          <div className="border-b pb-4">
            <h4 className="font-semibold mb-3 text-gray-700">Temel Bilgiler</h4>
            <input
              type="text"
              placeholder="Arsa Başlığı"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full p-3 border border-gray-300 rounded-lg mb-3"
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
                value={formData.il}
                onChange={(e) => setFormData({ ...formData, il: e.target.value })}
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
                value={formData.ilce}
                onChange={(e) => setFormData({ ...formData, ilce: e.target.value })}
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

          {/* Görseller */}
          <div className="border-b pb-4">
            <h4 className="font-semibold mb-3 text-gray-700">Görseller</h4>
            <input
              type="url"
              placeholder="Ana Fotoğraf URL (İsteğe Bağlı - Boş bırakılırsa varsayılan görsel kullanılır)"
              value={formData.image === 'https://i.hizliresim.com/rs5qoel.png' ? '' : formData.image}
              onChange={(e) => setFormData({ ...formData, image: e.target.value || 'https://i.hizliresim.com/rs5qoel.png' })}
              className="w-full p-3 border border-gray-300 rounded-lg mb-3"
            />
            <div className="bg-gray-50 p-3 rounded-lg mb-3">
              <p className="text-sm text-gray-600 mb-2">
                <strong>Varsayılan Görsel:</strong> {formData.image}
              </p>
              <img 
                src={formData.image} 
                alt="Önizleme" 
                className="w-32 h-20 object-cover rounded border"
                onError={(e) => {
                  e.currentTarget.src = 'https://i.hizliresim.com/rs5qoel.png';
                }}
              />
            </div>
            <input
              type="file"
              multiple
              accept="image/*"
              className="w-full p-3 border border-gray-300 rounded-lg mb-3"
              onChange={(e) => handleFileUpload(e.target.files)}
            />
            {selectedFiles.length > 0 && (
              <div className="bg-green-50 p-3 rounded-lg">
                <p className="text-sm text-green-700 mb-2">Seçilen dosyalar:</p>
                <ul className="text-sm text-green-600">
                  {selectedFiles.map((file, index) => (
                    <li key={index}>• {file.name}</li>
                  ))}
                </ul>
              </div>
            )}
            <p className="text-sm text-gray-500">
              Birden fazla görsel seçebilirsiniz. Görseller yüklendikten sonra galeri oluşturulacak.
            </p>
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
      </div>
    </div>
  );
};

export default AdminPanel;