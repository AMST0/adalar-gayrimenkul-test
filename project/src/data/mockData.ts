import { Agent, Property, Project, Testimonial, SliderItem, AdminUser } from '../types';

export const mockAgents: Agent[] = [
  {
    id: '1',
    name: 'Ahmet Yılmaz',
    title: 'Kıdemli Gayrimenkul Danışmanı',
    image: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=400',
    phone: '+90 555 123 4567',
    email: 'ahmet.yilmaz@adalargayrimenkul.com',
    experience: '8 yıl',
    specialties: ['Arsa Satışı', 'Yatırım Danışmanlığı', 'Proje Geliştirme'],
    isActive: true,
    isFeatured: true,
  },
  {
    id: '2',
    name: 'Zeynep Kaya',
    title: 'Bölge Müdürü',
    image: 'https://images.pexels.com/photos/3756679/pexels-photo-3756679.jpeg?auto=compress&cs=tinysrgb&w=400',
    phone: '+90 555 234 5678',
    email: 'zeynep.kaya@adalargayrimenkul.com',
    experience: '12 yıl',
    specialties: ['Lüks Projeler', 'Müşteri İlişkileri', 'Satış Yönetimi'],
    isActive: true,
    isFeatured: true,
  },
  {
    id: '3',
    name: 'Mehmet Demir',
    title: 'Gayrimenkul Uzmanı',
    image: 'https://images.pexels.com/photos/2182970/pexels-photo-2182970.jpeg?auto=compress&cs=tinysrgb&w=400',
    phone: '+90 555 345 6789',
    email: 'mehmet.demir@adalargayrimenkul.com',
    experience: '5 yıl',
    specialties: ['Arsa Değerlendirmesi', 'Hukuki Danışmanlık'],
    isActive: true,
    isFeatured: true,
  },
];

export const mockProperties: Property[] = [
  {
    id: '1',
    title: 'Deniz Manzaralı Arsa',
    location: 'Büyükada, Adalar',
    size: 1200,
    price: 2800000,
    image: 'https://images.pexels.com/photos/1029599/pexels-photo-1029599.jpeg?auto=compress&cs=tinysrgb&w=800',
    description: 'Büyükada\'da deniz manzaralı, imarlı arsa. Yatırım için ideal.',
    isActive: true,
    isFeatured: true,
  },
  {
    id: '2',
    title: 'Merkezi Konum Arsa',
    location: 'Heybeliada, Adalar',
    size: 800,
    price: 1900000,
    image: 'https://images.pexels.com/photos/1438832/pexels-photo-1438832.jpeg?auto=compress&cs=tinysrgb&w=800',
    description: 'Heybeliada merkez konumda, ulaşımı kolay arsa.',
    isActive: true,
    isFeatured: true,
  },
  {
    id: '3',
    title: 'Doğa İçinde Arsa',
    location: 'Burgazada, Adalar',
    size: 1500,
    price: 3200000,
    image: 'https://images.pexels.com/photos/1557238/pexels-photo-1557238.jpeg?auto=compress&cs=tinysrgb&w=800',
    description: 'Burgazada\'da doğal güzellikler içinde, geniş arsa.',
    isActive: true,
    isFeatured: false,
  },
];

export const mockProjects: Project[] = [
  {
    id: '1',
    logo: 'https://sdmntprnortheu.oaiusercontent.com/files/00000000-2f10-61f4-a707-b816de66166c/raw?se=2025-09-19T16%3A32%3A55Z&sp=r&sv=2024-08-04&sr=b&scid=7bb27d16-73e3-5003-955a-8cb1bd871041&skoid=b928fb90-500a-412f-a661-1ece57a7c318&sktid=a48cca56-e6da-484e-a814-9c849652bcb3&skt=2025-09-19T06%3A11%3A06Z&ske=2025-09-20T06%3A11%3A06Z&sks=b&skv=2024-08-04&sig=6C5i%2BNMM147sYJcJ14YadGb4k3GlnOyfVrArlnFsUjE%3D',
    isActive: true,
  },
  {
    id: '2',
    name: 'Manzara Evleri',
    logo: 'https://images.pexels.com/photos/1438832/pexels-photo-1438832.jpeg?auto=compress&cs=tinysrgb&w=200',
    isActive: true,
  },
  {
    id: '3',
    name: 'Doğa Villaları',
    logo: 'https://images.pexels.com/photos/1557238/pexels-photo-1557238.jpeg?auto=compress&cs=tinysrgb&w=200',
    isActive: true,
  },
];

export const mockTestimonials: Testimonial[] = [
  {
    id: '1',
    name: 'Ali Özkan',
    initials: 'AÖ',
    comment: 'Adalar Gayrimenkul ile çalışmak harika bir deneyimdi. Profesyonel hizmet.',
    isActive: true,
  },
  {
    id: '2',
    name: 'Fatma Şen',
    initials: 'FŞ',
    comment: 'Hayallerimizdeki arsayı bulduk. Teşekkürler Adalar Gayrimenkul!',
    isActive: true,
  },
  {
    id: '3',
    name: 'Can Yıldız',
    initials: 'CY',
    comment: 'Güvenilir ve samimi yaklaşımları için çok memnunum.',
    isActive: true,
  },
];

export const mockSliderItems: SliderItem[] = [
  {
    id: '1',
    title: 'ADALAR GAYRİMENKUL',
    subtitle: 'Adalar\'ın en güzel konumlarında',
    location: 'NİDAPARK',
    image: 'https://i.hizliresim.com/7xpfufp.jpg',
    ctaText: 'Arsaları İncele',
    ctaLink: '/arsalar',
    isActive: true,
  },
  {
    id: '2',
    title: 'ADALAR GAYRİMENKUL',
    subtitle: 'Geleceğin değerli toprakları',
    location: 'KIBRIS',
    image: 'https://kibriskonutprojeleri.com/assets/img/projeler-ekrani/caesar-resort/genel/8.jpeg',
    ctaText: 'İletişime Geç',
    ctaLink: '/iletisim',
    isActive: true,
  },
];

export const mockAdminUser: AdminUser = {
  username: 'admin',
  password: 'admin123',
};