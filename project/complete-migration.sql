-- MockData'daki TÜM verileri Supabase'e tam migrasyon scripti
-- Önce mevcut verileri temizle, sonra mockData'daki her şeyi ekle

-- 0. Eksik column'ları ekle
ALTER TABLE agents ADD COLUMN IF NOT EXISTS specialties TEXT[];
ALTER TABLE properties ADD COLUMN IF NOT EXISTS property_type VARCHAR(50) DEFAULT 'Arsa';

-- 1. Mevcut verileri temizle (foreign key constraints nedeniyle sıralı silme)
DELETE FROM contact_requests;
DELETE FROM testimonials;
DELETE FROM properties;
DELETE FROM agents;
DELETE FROM projects;
DELETE FROM slider_items;

-- 2. AGENTS - MockData'daki tüm agent bilgileri
INSERT INTO agents (name, title, image, phone, email, experience, specialties, is_featured, is_active) VALUES
('Ahmet Yılmaz', 'Kıdemli Gayrimenkul Danışmanı', 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=400', '+90 555 123 4567', 'ahmet.yilmaz@adalargayrimenkul.com', '8 yıl', ARRAY['Arsa Satışı', 'Yatırım Danışmanlığı', 'Proje Geliştirme'], true, true),
('Zeynep Kaya', 'Bölge Müdürü', 'https://images.pexels.com/photos/3756679/pexels-photo-3756679.jpeg?auto=compress&cs=tinysrgb&w=400', '+90 555 234 5678', 'zeynep.kaya@adalargayrimenkul.com', '12 yıl', ARRAY['Lüks Projeler', 'Müşteri İlişkileri', 'Satış Yönetimi'], true, true),
('Mehmet Demir', 'Gayrimenkul Uzmanı', 'https://images.pexels.com/photos/2182970/pexels-photo-2182970.jpeg?auto=compress&cs=tinysrgb&w=400', '+90 555 345 6789', 'mehmet.demir@adalargayrimenkul.com', '5 yıl', ARRAY['Arsa Değerlendirmesi', 'Hukuki Danışmanlık'], true, true);

-- 3. PROPERTIES - MockData'daki tüm mülk bilgileri
INSERT INTO properties (title, location, size, price, image, description, property_type, is_featured, is_active) VALUES
('Deniz Manzaralı Arsa', 'Büyükada, Adalar', '1200 m²', 2800000, 'https://images.pexels.com/photos/1029599/pexels-photo-1029599.jpeg?auto=compress&cs=tinysrgb&w=800', 'Büyükada''da deniz manzaralı, imarlı arsa. Yatırım için ideal.', 'Arsa', true, true),
('Merkezi Konum Arsa', 'Heybeliada, Adalar', '800 m²', 1900000, 'https://images.pexels.com/photos/1438832/pexels-photo-1438832.jpeg?auto=compress&cs=tinysrgb&w=800', 'Heybeliada merkez konumda, ulaşımı kolay arsa.', 'Arsa', true, true),
('Doğa İçinde Arsa', 'Burgazada, Adalar', '1500 m²', 3200000, 'https://images.pexels.com/photos/1557238/pexels-photo-1557238.jpeg?auto=compress&cs=tinysrgb&w=800', 'Burgazada''da doğal güzellikler içinde, geniş arsa.', 'Arsa', false, true);

-- 4. PROJECTS - MockData'daki tüm proje logoları
INSERT INTO projects (name, logo, description, is_active) VALUES
('Nidapark', 'https://i.hizliresim.com/e2veum2.png', 'Premium konut projesi', true),
('Fuaye Turkuaz', 'https://www.fuaye.com.tr/images/logo_fuaye_turkuaz_main.jpg', 'Modern yaşam kompleksi', true),
('Fuaye', 'https://www.fuaye.com.tr/images/logo_fuaye_main.jpg', 'Kentsel dönüşüm projesi', true),
('Proje 4', 'https://i.pinimg.com/280x280_RS/a4/36/a3/a436a3c5e6814eaff5770e1d7ba9fb6e.jpg', 'Yatırım projesi', true),
('Narcity', 'https://www.depetente.com.tr/wp-content/uploads/2019/12/narcity_logo.png', 'Lüks konut projesi', true),
('Adatepe', 'https://www.metropolemlakofisi.com/wp-content/uploads/2015/06/adatepe-logo-150x150.png', 'Doğal yaşam alanı', true),
('Proje 7', 'https://cdn02.hemlak.com/SnNPbGdLZ2FISllzMEt2MjVxdERCWEx2eVkxVEUzVU1ic0ozVElJb1BpT1ZoaHhOblRBZmovQ3ZPaENKRUpNK1c3N2k4Tm1EckRlVlpzZk82WFFFSEE9PQ==.jpg', 'İnşaat projesi', true),
('Mesa Panorama', 'https://www.mesa.com.tr/img/logolar/panorama/panorama-logo-beyaz-jpg.jpg', 'Panoramik manzara projesi', true),
('Mesa Cadde', 'https://images.endeksa.com/images/projectimages/mesa-mesken-aslan-yapi-caba-mesa-cadde-0.png', 'Şehir merkezi projesi', true),
('Proje 10', 'https://cdn02.hemlak.com/ZFR6bFpKbW9BaysyaVFvdHVRdHRYK1lpVTV1MFhXa3oxSjdWS3FHSjlNQ3pDWFk0am40T3htWXRoVWo2NXhqOQ==.jpg', 'Konut projesi', true);

-- 5. TESTIMONIALS - MockData'daki tüm müşteri yorumları
INSERT INTO testimonials (name, initials, comment, rating, is_active) VALUES
('Ali Özkan', 'AÖ', 'Adalar Gayrimenkul ile çalışmak harika bir deneyimdi. Profesyonel hizmet.', 5, true),
('Fatma Şen', 'FŞ', 'Hayallerimizdeki arsayı bulduk. Teşekkürler Adalar Gayrimenkul!', 4, true),
('Can Yıldız', 'CY', 'Güvenilir ve samimi yaklaşımları için çok memnunum.', 5, true);

-- 6. SLIDER ITEMS - MockData'daki tüm slider görselleri
INSERT INTO slider_items (title, subtitle, location, image, sort_order, is_active) VALUES
('ADALAR GAYRİMENKUL', 'Adalar''ın en güzel konumlarında', 'NİDAPARK', 'https://i.hizliresim.com/7xpfufp.jpg', 1, true),
('ADALAR GAYRİMENKUL', 'Geleceğin değerli toprakları', 'KIBRIS', 'https://kibriskonutprojeleri.com/assets/img/projeler-ekrani/caesar-resort/genel/8.jpeg', 2, true),
('ADALAR GAYRİMENKUL', 'Geleceğin değerli toprakları', 'MONTENEGRO', 'https://cdn.shopify.com/s/files/1/0705/7345/7645/files/2_6a2c9329-2d7c-4d3d-96c4-24774e220533_1024x1024.jpg?v=1729688611', 3, true);

-- 7. Admin user için bir tablo oluştur (eğer yoksa)
CREATE TABLE IF NOT EXISTS admin_users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    username VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Admin user ekle (şifreyi hash'lemek için gerçek uygulamada bcrypt kullanın)
INSERT INTO admin_users (username, password_hash) VALUES
('admin', 'admin123') 
ON CONFLICT (username) DO NOTHING;