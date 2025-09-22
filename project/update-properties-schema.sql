-- Properties tablosunu güncelleme - ada, parsel, pafta için integer tipi ve image_urls array ekleme
-- Bu script mevcut properties tablosunu günceller

-- Ada, parsel, pafta sütunlarını INTEGER olarak ekle
ALTER TABLE properties 
ADD COLUMN IF NOT EXISTS ada INTEGER,
ADD COLUMN IF NOT EXISTS parsel INTEGER,
ADD COLUMN IF NOT EXISTS pafta INTEGER,
ADD COLUMN IF NOT EXISTS tapu_alani INTEGER,
ADD COLUMN IF NOT EXISTS nitelik VARCHAR(100),
ADD COLUMN IF NOT EXISTS mevkii VARCHAR(255),
ADD COLUMN IF NOT EXISTS zemin_tipi VARCHAR(100),
ADD COLUMN IF NOT EXISTS agent_id UUID REFERENCES agents(id),
ADD COLUMN IF NOT EXISTS il VARCHAR(100),
ADD COLUMN IF NOT EXISTS ilce VARCHAR(100),
ADD COLUMN IF NOT EXISTS mahalle_koy VARCHAR(255),
ADD COLUMN IF NOT EXISTS mahalle_no VARCHAR(50),
ADD COLUMN IF NOT EXISTS image_urls JSONB DEFAULT '[]';

-- Örnek veri güncelleme
UPDATE properties 
SET ada = 123, 
    parsel = 456, 
    pafta = 789,
    tapu_alani = 1000,
    nitelik = 'Tarla',
    mevkii = 'Merkez',
    zemin_tipi = 'Düz',
    il = 'İstanbul',
    ilce = 'Arnavutköy',
    mahalle_koy = 'Yeniköy',
    image_urls = '["https://i.hizliresim.com/rs5qoel.png"]'
WHERE title IS NOT NULL;

-- Ada, parsel, pafta için constraint ekleme (pozitif sayılar)
ALTER TABLE properties 
ADD CONSTRAINT check_ada_positive CHECK (ada > 0),
ADD CONSTRAINT check_parsel_positive CHECK (parsel > 0),
ADD CONSTRAINT check_pafta_positive CHECK (pafta > 0),
ADD CONSTRAINT check_tapu_alani_positive CHECK (tapu_alani > 0);

-- Index ekleme performans için
CREATE INDEX IF NOT EXISTS idx_properties_ada ON properties(ada);
CREATE INDEX IF NOT EXISTS idx_properties_parsel ON properties(parsel);
CREATE INDEX IF NOT EXISTS idx_properties_agent_id ON properties(agent_id);
CREATE INDEX IF NOT EXISTS idx_properties_location ON properties(il, ilce);