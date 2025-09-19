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
  Star
} from 'lucide-react';
import { useData } from '../../contexts/DataContext';
import { useAdmin } from '../../contexts/AdminContext';
import { Agent, Property, Project, Testimonial, SliderItem, ContactRequest } from '../../types';
import Button from '../common/Button';

const AdminPanel: React.FC = () => {
  const { logout } = useAdmin();
  const {
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
    updateContactRequests,
  } = useData();

  const [activeTab, setActiveTab] = useState('dashboard');
  const [editingItem, setEditingItem] = useState<any>(null);
  const [showForm, setShowForm] = useState(false);

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

  const handleDelete = (items: any[], updateFunction: Function, id: string) => {
    if (window.confirm('Bu öğeyi silmek istediğinizden emin misiniz?')) {
      const updated = items.filter(item => item.id !== id);
      updateFunction(updated);
    }
  };

  const handleSave = (items: any[], updateFunction: Function, newItem: any) => {
    if (editingItem && editingItem.id) {
      // Update existing
      const updated = items.map(item =>
        item.id === editingItem.id ? { ...newItem, id: editingItem.id } : item
      );
      updateFunction(updated);
    } else {
      // Add new
      const updated = [...items, { ...newItem, id: Date.now().toString() }];
      updateFunction(updated);
    }
    setEditingItem(null);
    setShowForm(false);
  };

  const renderDashboard = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <div className="bg-blue-500 text-white p-6 rounded-lg">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-blue-100">Toplam Danışman</p>
            <p className="text-3xl font-bold">{agents.filter(a => a.isActive).length}</p>
          </div>
          <Users className="w-12 h-12 text-blue-200" />
        </div>
      </div>
      <div className="bg-green-500 text-white p-6 rounded-lg">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-green-100">Aktif Arsalar</p>
            <p className="text-3xl font-bold">{properties.filter(p => p.isActive).length}</p>
          </div>
          <Building className="w-12 h-12 text-green-200" />
        </div>
      </div>
      <div className="bg-red-500 text-white p-6 rounded-lg">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-red-100">Yeni Mesajlar</p>
            <p className="text-3xl font-bold">{contactRequests.filter(r => !r.isRead).length}</p>
          </div>
          <Mail className="w-12 h-12 text-red-200" />
        </div>
      </div>
      <div className="bg-purple-500 text-white p-6 rounded-lg">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-purple-100">Aktif Yorumlar</p>
            <p className="text-3xl font-bold">{testimonials.filter(t => t.isActive).length}</p>
          </div>
          <MessageSquare className="w-12 h-12 text-purple-200" />
        </div>
      </div>
    </div>
  );

  const renderAgents = () => (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Danışman Yönetimi</h2>
        <Button onClick={() => { setEditingItem({}); setShowForm(true); }}>
          <Plus className="w-4 h-4 mr-2" />
          Yeni Danışman
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {agents.map((agent) => (
          <div key={agent.id} className="bg-white p-6 rounded-lg shadow-md border">
            <div className="flex items-center justify-between mb-4">
              <img src={agent.image} alt={agent.name} className="w-12 h-12 rounded-full object-cover" />
              <div className="flex space-x-2">
                <button
                  onClick={() => handleToggleActive(agents, updateAgents, agent.id)}
                  className={`p-2 rounded ${agent.isActive ? 'text-green-600' : 'text-gray-400'}`}
                >
                  {agent.isActive ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                </button>
                <button
                  onClick={() => { setEditingItem(agent); setShowForm(true); }}
                  className="p-2 text-blue-600 hover:bg-blue-50 rounded"
                >
                  <Edit className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDelete(agents, updateAgents, agent.id)}
                  className="p-2 text-red-600 hover:bg-red-50 rounded"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
            <h3 className="font-bold text-lg mb-2">{agent.name}</h3>
            <p className="text-gray-600 mb-2">{agent.title}</p>
            <p className="text-sm text-gray-500">{agent.experience}</p>
            <div className="flex items-center mt-2">
              <Phone className="w-4 h-4 mr-1 text-gray-400" />
              <span className="text-sm">{agent.phone}</span>
            </div>
            {agent.isFeatured && <Star className="w-4 h-4 text-yellow-500 mt-2" />}
          </div>
        ))}
      </div>

      {showForm && (
        <AgentForm
          agent={editingItem}
          onSave={(agent) => handleSave(agents, updateAgents, agent)}
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
                  className="p-2 text-blue-600 hover:bg-blue-50 rounded"
                >
                  <Edit className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDelete(properties, updateProperties, property.id)}
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
          onSave={(property) => handleSave(properties, updateProperties, property)}
          onCancel={() => { setShowForm(false); setEditingItem(null); }}
        />
      )}
    </div>
  );

  return (
    <div className="pt-24 pb-16 min-h-screen bg-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-blue-900">Admin Panel</h1>
          <Button variant="danger" onClick={logout}>
            Çıkış Yap
          </Button>
        </div>

        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="flex border-b">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 px-6 py-4 font-semibold transition-colors ${
                  activeTab === tab.id
                    ? 'bg-blue-900 text-white'
                    : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
                }`}
              >
                <tab.icon className="w-5 h-5" />
                <span>{tab.label}</span>
              </button>
            ))}
          </div>

          <div className="p-6">
            {activeTab === 'dashboard' && renderDashboard()}
            {activeTab === 'agents' && renderAgents()}
            {activeTab === 'properties' && renderProperties()}
            {activeTab === 'slider' && <div>Slider yönetimi yakında...</div>}
            {activeTab === 'testimonials' && <div>Yorum yönetimi yakında...</div>}
            {activeTab === 'contact' && <div>İletişim talepleri yakında...</div>}
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
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      ...formData,
      id: agent.id || '',
      specialties: formData.specialties.split(',').map(s => s.trim()),
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
  const [formData, setFormData] = useState({
    title: property.title || '',
    location: property.location || '',
    size: property.size || 0,
    price: property.price || 0,
    image: property.image || '',
    description: property.description || '',
    isActive: property.isActive ?? true,
    isFeatured: property.isFeatured ?? false,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      ...formData,
      id: property.id || '',
    } as Property);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold">
            {property.id ? 'Arsa Düzenle' : 'Yeni Arsa'}
          </h3>
          <button onClick={onCancel}>
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            placeholder="Arsa Başlığı"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            className="w-full p-3 border border-gray-300 rounded-lg"
            required
          />
          <input
            type="text"
            placeholder="Konum"
            value={formData.location}
            onChange={(e) => setFormData({ ...formData, location: e.target.value })}
            className="w-full p-3 border border-gray-300 rounded-lg"
            required
          />
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
          <input
            type="url"
            placeholder="Fotoğraf URL"
            value={formData.image}
            onChange={(e) => setFormData({ ...formData, image: e.target.value })}
            className="w-full p-3 border border-gray-300 rounded-lg"
            required
          />
          <textarea
            placeholder="Açıklama"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            rows={3}
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