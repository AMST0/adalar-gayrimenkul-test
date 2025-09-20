# 🚀 SUPABASE İLE VERİTABANI KURULUMU

## 1. Supabase Hesabı Oluşturun
1. https://supabase.com/ adresine gidin
2. "Start your project" butonuna tıklayın
3. GitHub ile giriş yapın (ücretsiz)

## 2. Yeni Proje Oluşturun
1. "New Project" butonuna tıklayın
2. Proje adı: `adalar-gayrimenkul`
3. Database şifresi: güçlü bir şifre belirleyin
4. Region: Europe (West) seçin
5. "Create new project" butonuna tıklayın

## 3. Database Tablolarını Oluşturun
1. Sol menüden "SQL Editor" seçin
2. Aşağıdaki SQL kodunu kopyalayıp çalıştırın:

```sql
-- Veritabanı tabloları oluşturma
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Agents tablosu
CREATE TABLE agents (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    title VARCHAR(255),
    experience TEXT,
    phone VARCHAR(50),
    email VARCHAR(255),
    image TEXT,
    initials VARCHAR(10),
    is_featured BOOLEAN DEFAULT false,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Properties tablosu
CREATE TABLE properties (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(255) NOT NULL,
    price DECIMAL(15,2),
    location VARCHAR(255),
    size VARCHAR(100),
    type VARCHAR(100),
    description TEXT,
    image TEXT,
    is_featured BOOLEAN DEFAULT false,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Projects tablosu
CREATE TABLE projects (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    logo TEXT,
    description TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Testimonials tablosu
CREATE TABLE testimonials (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    initials VARCHAR(10),
    comment TEXT NOT NULL,
    rating INTEGER CHECK (rating >= 1 AND rating <= 5),
    is_active BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Slider Items tablosu
CREATE TABLE slider_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(255) NOT NULL,
    subtitle TEXT,
    image TEXT,
    location VARCHAR(255),
    is_active BOOLEAN DEFAULT true,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Contact Requests tablosu
CREATE TABLE contact_requests (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(50),
    message TEXT NOT NULL,
    is_read BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Örnek veri ekleme
INSERT INTO agents (name, title, experience, phone, email, image, initials, is_featured, is_active) VALUES
('Ahmet Yılmaz', 'Kıdemli Gayrimenkul Danışmanı', '8 yıllık deneyim', '+90 532 123 4567', 'ahmet@adalar.com', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150', 'AY', true, true),
('Fatma Demir', 'Emlak Uzmanı', '5 yıllık deneyim', '+90 535 987 6543', 'fatma@adalar.com', 'https://images.unsplash.com/photo-1494790108755-2616b95b2b0b?w=150', 'FD', false, true);

INSERT INTO testimonials (name, initials, comment, rating, is_active) VALUES
('Mehmet Özkan', 'MÖ', 'Çok profesyonel hizmet aldık. Kesinlikle tavsiye ederim!', 5, true),
('Ayşe Kaya', 'AK', 'Harika bir deneyimdi. Çok memnun kaldık.', 4, true);

INSERT INTO projects (name, logo, description, is_active) VALUES
('Nidapark', 'https://i.hizliresim.com/nidapark-logo.png', 'Premium konut projesi', true);

INSERT INTO slider_items (title, subtitle, image, location, is_active) VALUES
('Adalar Gayrimenkul', 'Geleceğin Değerli Toprakları', 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=1920', 'İstanbul', true);
```

## 4. API Bilgilerini Kopyalayın
1. Sol menüden "Settings" → "API" seçin
2. Bu bilgileri kopyalayın:
   - Project URL (VITE_SUPABASE_URL)
   - Project API Key - anon public (VITE_SUPABASE_ANON_KEY)

## 5. Environment Variables Ayarlayın

### Local Development:
1. Proje klasöründe `.env` dosyası oluşturun
2. Şu bilgileri ekleyin:
```
VITE_SUPABASE_URL=https://your-project-ref.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

### Vercel Deployment:
1. Vercel dashboard'a gidin
2. Projenizi seçin
3. "Settings" → "Environment Variables"
4. Şu değişkenleri ekleyin:
   - `VITE_SUPABASE_URL`: Supabase Project URL
   - `VITE_SUPABASE_ANON_KEY`: Supabase Anon Key

## 6. Test Edin
1. `npm run dev` ile projeyi çalıştırın
2. Müşteri yorumları eklemeyi test edin
3. Admin panelden verileri kontrol edin

## 🎯 AVANTAJLARI:
- ✅ Ücretsiz (500MB database, 2GB bandwidth)
- ✅ Anında kullanıma hazır
- ✅ Web dashboard ile yönetim
- ✅ Otomatik backup
- ✅ Real-time updates
- ✅ Vercel ile mükemmel entegrasyon