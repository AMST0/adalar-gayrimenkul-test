-- Supabase tablolarını tam entegrasyon için güncelleme

-- 1. Agents tablosuna eksik alanları ekleme
ALTER TABLE agents ADD COLUMN IF NOT EXISTS specialties TEXT[];
ALTER TABLE agents ADD COLUMN IF NOT EXISTS portfolio_url TEXT;

-- 2. Properties tablosundaki type kolonunu property_type olarak değiştirme
-- (type PostgreSQL'de reserved keyword olduğu için)
ALTER TABLE properties RENAME COLUMN type TO property_type;

-- 3. Projects tablosuna eksik alanları ekleme  
ALTER TABLE projects ADD COLUMN IF NOT EXISTS name VARCHAR(255);

-- 4. Mevcut verilere default değerler atama
UPDATE agents SET specialties = ARRAY['Gayrimenkul Danışmanlığı', 'Satış'] WHERE specialties IS NULL;

-- 5. Testimonials tablosuna rating değerlerini güncelleme
UPDATE testimonials SET rating = 5 WHERE name = 'Mehmet Özkan' AND rating IS NULL;
UPDATE testimonials SET rating = 4 WHERE name = 'Ayşe Kaya' AND rating IS NULL;
UPDATE testimonials SET rating = 5 WHERE name = 'Ali Veli' AND rating IS NULL;
UPDATE testimonials SET rating = 4 WHERE name = 'Zeynep Yıldız' AND rating IS NULL;

-- Diğer tüm testimonials'a varsayılan rating
UPDATE testimonials SET rating = 5 WHERE rating IS NULL;

-- 6. Projects tablosuna name değerleri ekleme
UPDATE projects SET name = 'Nidapark' WHERE logo LIKE '%nidapark%' AND name IS NULL;
UPDATE projects SET name = 'Başakşehir Evleri' WHERE name IS NULL;

-- 7. Properties tablosunda size kolonunu integer'dan VARCHAR'a çevirme (mockData'da "300 m²" formatında)
ALTER TABLE properties ALTER COLUMN size TYPE VARCHAR(100);

-- 8. Yeni veriler için check constraints ekleme
ALTER TABLE testimonials ADD CONSTRAINT rating_check CHECK (rating >= 1 AND rating <= 5);