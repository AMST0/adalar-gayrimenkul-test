# Supabase Storage ve Veritabanı Kurulum Rehberi

## 🗄️ Supabase Storage Bucket Kurulumu

### 1. Supabase Dashboard'a giriş yapın
- https://supabase.com/dashboard adresine gidin
- Projenizi seçin

### 2. Storage Bucket Oluşturma
1. Sol menüden **Storage** sekmesine gidin
2. **Create a new bucket** butonuna tıklayın
3. Bucket ayarları:
   - **Name**: `property-images`
   - **Public bucket**: ✅ (Açık)
   - **File size limit**: `10MB`
   - **Allowed MIME types**: `image/jpeg,image/jpg,image/png,image/gif,image/webp`

### 3. Storage Policies (RLS) Ayarları
Storage > property-images > Policies bölümünde:

```sql
-- Public Read Policy
CREATE POLICY "Public read access"
ON storage.objects FOR SELECT
USING (bucket_id = 'property-images');

-- Authenticated Upload Policy  
CREATE POLICY "Authenticated users can upload"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'property-images' AND auth.role() = 'authenticated');

-- Authenticated Delete Policy
CREATE POLICY "Authenticated users can delete own files"
ON storage.objects FOR DELETE
USING (bucket_id = 'property-images' AND auth.role() = 'authenticated');
```

## 🗃️ Veritabanı Migration

### SQL Editor'da çalıştırılacak komutlar:

```sql
-- Properties tablosunu güncelle
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

-- Constraints ekle
ALTER TABLE properties 
ADD CONSTRAINT IF NOT EXISTS check_ada_positive CHECK (ada > 0),
ADD CONSTRAINT IF NOT EXISTS check_parsel_positive CHECK (parsel > 0),
ADD CONSTRAINT IF NOT EXISTS check_pafta_positive CHECK (pafta > 0),
ADD CONSTRAINT IF NOT EXISTS check_tapu_alani_positive CHECK (tapu_alani > 0);

-- Indexes ekle
CREATE INDEX IF NOT EXISTS idx_properties_ada ON properties(ada);
CREATE INDEX IF NOT EXISTS idx_properties_parsel ON properties(parsel);
CREATE INDEX IF NOT EXISTS idx_properties_agent_id ON properties(agent_id);
CREATE INDEX IF NOT EXISTS idx_properties_location ON properties(il, ilce);
CREATE INDEX IF NOT EXISTS idx_properties_image_urls ON properties USING GIN(image_urls);
```

### 📷 Varsayılan Görsel Yükleme
Aşağıdaki komutu çalıştırarak varsayılan bir property görseli yükleyin:

```sql
-- Varsayılan property görseli için placeholder URL ekle
INSERT INTO storage.objects (bucket_id, name, public) 
VALUES ('property-images', 'properties/default-property.jpg', true);
```

**NOT:** Supabase Storage'da `property-images` bucket'ine varsayılan bir görsel yüklemeyi unutmayın!

## 🔧 Uygulama Kurulumu

### 1. Bağımlılıkları kontrol edin
Frontend package.json'da olması gerekenler:
```json
{
  "@supabase/supabase-js": "^2.39.0"
}
```

### 2. Environment Variables
`.env` dosyasında:
```
VITE_SUPABASE_URL=your-supabase-url
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
```

### 3. Test Etme
1. Admin paneline giriş yapın
2. "Yeni Arsa" butonuna tıklayın
3. Görsel yükleme bölümünden dosya seçin
4. Progress bar'ın çalıştığını kontrol edin
5. Yüklenen görsellerin görüntülendiğini doğrulayın

## 📁 Dosya Yapısı
```
bucket: property-images/
├── properties/
│   ├── 1695123456789-abc123.jpg
│   ├── 1695123456790-def456.png
│   └── ...
```

## 🔒 Güvenlik Notları
- Bucket public olarak ayarlandı (görsel erişimi için)
- Upload sadece authenticated kullanıcılar için
- Dosya boyutu limiti: 10MB
- Sadece resim dosyaları kabul ediliyor
- RLS politikaları aktif

## 📊 Storage Limitleri
- **Free Plan**: 1GB storage
- **Pro Plan**: 100GB storage
- **Bandwidth**: Aylık transfer limiti var

## 🚀 Kullanım
Artık AdminPanel'de görsel yükleme tamamen Supabase Storage üzerinden çalışıyor:
- ✅ Gerçek zamanlı progress tracking
- ✅ Çoklu dosya yükleme
- ✅ Dosya boyutu/tür validasyonu
- ✅ Hata yönetimi
- ✅ Önizleme ve silme