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
    logo: 'https://i.hizliresim.com/e2veum2.png',
    isActive: true,
  },
  {
    id: '2',
    logo: 'https://www.fuaye.com.tr/images/logo_fuaye_turkuaz_main.jpg',
    isActive: true,
  },
  {
    id: '3',
    logo: 'https://www.fuaye.com.tr/images/logo_fuaye_main.jpg',
    isActive: true,
  },
    {
    id: '4',
    logo: 'https://i.pinimg.com/280x280_RS/a4/36/a3/a436a3c5e6814eaff5770e1d7ba9fb6e.jpg',
    isActive: true,
  },
  {
    id: '5',
    logo: 'https://www.depetente.com.tr/wp-content/uploads/2019/12/narcity_logo.png',
    isActive: true,
  },
    {
    id: '6',
    logo: 'https://www.metropolemlakofisi.com/wp-content/uploads/2015/06/adatepe-logo-150x150.png',
    isActive: true,
  },
  {
    id: '7',
    logo: 'https://cdn02.hemlak.com/SnNPbGdLZ2FISllzMEt2MjVxdERCWEx2eVkxVEUzVU1ic0ozVElJb1BpT1ZoaHhOblRBZmovQ3ZPaENKRUpNK1c3N2k4Tm1EckRlVlpzZk82WFFFSEE9PQ==.jpg',
    isActive: true,
  },  
    {
    id: '8',
    logo: 'https://www.mesa.com.tr/img/logolar/panorama/panorama-logo-beyaz-jpg.jpg',
    isActive: true,
  },
  {
    id: '9',
    logo: 'https://images.endeksa.com/images/projectimages/mesa-mesken-aslan-yapi-caba-mesa-cadde-0.png',
    isActive: true,
  },
    {
    id: '10',
    logo: 'https://cdn02.hemlak.com/ZFR6bFpKbW9BaysyaVFvdHVRdHRYK1lpVTV1MFhXa3oxSjdWS3FHSjlNQ3pDWFk0am40T3htWXRoVWo2NXhqOQ==.jpg',
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
    isActive: true,
  },
  {
    id: '2',
    title: 'ADALAR GAYRİMENKUL',
    subtitle: 'Geleceğin değerli toprakları',
    location: 'KIBRIS',
    image: 'https://kibriskonutprojeleri.com/assets/img/projeler-ekrani/caesar-resort/genel/8.jpeg',
    isActive: true,
  },
    {
    id: '3',
    title: 'ADALAR GAYRİMENKUL',
    subtitle: 'Geleceğin değerli toprakları',
    location: 'MONTENEGRO',
    image: 'https://cdn.shopify.com/s/files/1/0705/7345/7645/files/2_6a2c9329-2d7c-4d3d-96c4-24774e220533_1024x1024.jpg?v=1729688611',
    isActive: true,
  },
];

export const mockAdminUser: AdminUser = {
  username: 'admin',
  password: 'admin123',
};