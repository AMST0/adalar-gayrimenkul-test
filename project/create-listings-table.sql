-- Sahibinden.com İlanları için tablo
CREATE TABLE IF NOT EXISTS public.listings (
    id BIGSERIAL PRIMARY KEY,
    listing_id VARCHAR(50) UNIQUE NOT NULL, -- Sahibinden ilan numarası (duplicate kontrol için)
    title TEXT NOT NULL,
    price VARCHAR(50),
    location VARCHAR(255),
    image_url TEXT,
    listing_date DATE,
    listing_url TEXT,
    description TEXT,
    features JSONB DEFAULT '[]'::jsonb, -- Özellikleri JSON array olarak sakla
    
    -- Ek meta veriler
    source VARCHAR(50) DEFAULT 'sahibinden.com',
    is_active BOOLEAN DEFAULT true,
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW())
);

-- İndeksler
CREATE INDEX IF NOT EXISTS idx_listings_listing_id ON public.listings (listing_id);
CREATE INDEX IF NOT EXISTS idx_listings_is_active ON public.listings (is_active);
CREATE INDEX IF NOT EXISTS idx_listings_created_at ON public.listings (created_at);
CREATE INDEX IF NOT EXISTS idx_listings_location ON public.listings (location);

-- Updated_at trigger
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = TIMEZONE('utc'::text, NOW());
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_listings_updated_at
    BEFORE UPDATE ON public.listings
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

-- RLS (Row Level Security) - isteğe bağlı
ALTER TABLE public.listings ENABLE ROW LEVEL SECURITY;

-- Admin kullanıcıları için policy (isteğe bağlı)
CREATE POLICY "Admin can manage listings" ON public.listings
    FOR ALL USING (true);

-- Herkese okuma izni (isteğe bağlı)
CREATE POLICY "Anyone can read listings" ON public.listings
    FOR SELECT USING (is_active = true);

-- Test verisi ekle (isteğe bağlı)
INSERT INTO public.listings 
(listing_id, title, price, location, image_url, listing_date, listing_url, description, features)
VALUES 
(
    '1071245896',
    'BÜYÜKADA MERKEZ MAH. İMARLI SATILIK ARSA',
    '5.500.000 TL',
    'İstanbul, Adalar, Büyükada',
    'https://i0.shbdn.com/photos/19/71/24/lthmb_1197124589601.jpg',
    '2025-09-23',
    'https://www.sahibinden.com/ilan/emlak-arsa-satilik-buyukada-merkez-mah-imarli-satilik-arsa-1071245896/detay',
    'Büyükada Merkez Mahallesi''nde 750 m² imarlı satılık arsa. Deniz manzaralı, merkezi konumda.',
    '["750 m²", "İmarlı", "Deniz Manzaralı", "Merkezi Konum"]'::jsonb
)
ON CONFLICT (listing_id) DO NOTHING;