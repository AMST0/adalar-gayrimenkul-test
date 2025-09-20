-- Veritabanı tabloları oluşturma scripti
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