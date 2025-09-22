# 📋 Supabase Dashboard Storage Kurulum Rehberi

## 🚀 Adım Adım Kurulum

### 1️⃣ Supabase Dashboard'a Giriş
1. **https://supabase.com/dashboard** adresine gidin
2. Google/GitHub hesabınızla giriş yapın
3. Projenizi seçin (adalar-gayrimenkul projesi)

### 2️⃣ Storage Bölümüne Geçiş
1. Sol menüden **"Storage"** sekmesine tıklayın
2. **"Buckets"** alt menüsünü seçin
3. Şu an boş bir liste göreceksiniz

### 3️⃣ Yeni Bucket Oluşturma
1. **"Create a new bucket"** yeşil butonuna tıklayın
2. Modal pencere açılacak, şu bilgileri girin:

```
📝 Bucket Ayarları:
┌─────────────────────────────────────┐
│ Name: property-images               │
│ Public bucket: ✅ AÇIK             │
│ File size limit: 10 MB              │
│ Allowed MIME types:                 │
│   image/jpeg,image/jpg,image/png,   │
│   image/gif,image/webp              │
└─────────────────────────────────────┘
```

3. **"Save"** butonuna tıklayın

### 4️⃣ Bucket Policies (Güvenlik) Ayarlama
1. Oluşturduğunuz **"property-images"** bucket'ine tıklayın
2. **"Policies"** sekmesine geçin
3. **"Add policy"** butonuna tıklayın

#### Policy 1: Public Read (Herkes okuyabilir)
```sql
-- Policy Name: Public read access
-- Target roles: public
-- Policy definition:
CREATE POLICY "Public read access"
ON storage.objects FOR SELECT
USING (bucket_id = 'property-images');
```

#### Policy 2: Authenticated Upload (Giriş yapmış kullanıcılar yükleyebilir)
```sql
-- Policy Name: Authenticated users can upload
-- Target roles: authenticated
-- Policy definition:
CREATE POLICY "Authenticated users can upload"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'property-images' AND auth.role() = 'authenticated');
```

#### Policy 3: Authenticated Delete (Giriş yapmış kullanıcılar silebilir)
```sql
-- Policy Name: Authenticated users can delete
-- Target roles: authenticated  
-- Policy definition:
CREATE POLICY "Authenticated users can delete"
ON storage.objects FOR DELETE
USING (bucket_id = 'property-images' AND auth.role() = 'authenticated');
```

### 5️⃣ Varsayılan Görsel Yükleme
1. **"Files"** sekmesine geri dönün
2. **"properties"** klasörü oluşturun:
   - **"Create folder"** butonuna tıklayın
   - Klasör adı: `properties`
3. Varsayılan görsel yükleyin:
   - `properties` klasörüne girin
   - **"Upload file"** butonuna tıklayın
   - Bir arsa/emlak görseli seçin
   - Dosya adını `default-property.jpg` yapın

### 6️⃣ Environment Variables Güncelleme
`.env` dosyanızda şunları kontrol edin:
```env
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

### 7️⃣ Veritabanı Migration
SQL Editor'da şu komutu çalıştırın:
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

-- Constraints ekle (güvenli yöntem)
DO $$ 
BEGIN
    -- Ada constraint
    IF NOT EXISTS (SELECT 1 FROM information_schema.table_constraints 
                   WHERE constraint_name = 'check_ada_positive' AND table_name = 'properties') THEN
        ALTER TABLE properties ADD CONSTRAINT check_ada_positive CHECK (ada > 0);
    END IF;
    
    -- Parsel constraint  
    IF NOT EXISTS (SELECT 1 FROM information_schema.table_constraints 
                   WHERE constraint_name = 'check_parsel_positive' AND table_name = 'properties') THEN
        ALTER TABLE properties ADD CONSTRAINT check_parsel_positive CHECK (parsel > 0);
    END IF;
    
    -- Pafta constraint
    IF NOT EXISTS (SELECT 1 FROM information_schema.table_constraints 
                   WHERE constraint_name = 'check_pafta_positive' AND table_name = 'properties') THEN
        ALTER TABLE properties ADD CONSTRAINT check_pafta_positive CHECK (pafta > 0);
    END IF;
    
    -- Tapu alanı constraint
    IF NOT EXISTS (SELECT 1 FROM information_schema.table_constraints 
                   WHERE constraint_name = 'check_tapu_alani_positive' AND table_name = 'properties') THEN
        ALTER TABLE properties ADD CONSTRAINT check_tapu_alani_positive CHECK (tapu_alani > 0);
    END IF;
END $$;

-- Indexes ekle
CREATE INDEX IF NOT EXISTS idx_properties_ada ON properties(ada);
CREATE INDEX IF NOT EXISTS idx_properties_parsel ON properties(parsel);
CREATE INDEX IF NOT EXISTS idx_properties_agent_id ON properties(agent_id);
CREATE INDEX IF NOT EXISTS idx_properties_location ON properties(il, ilce);
CREATE INDEX IF NOT EXISTS idx_properties_image_urls ON properties USING GIN(image_urls);
```

## 🧪 Test Etme

### 1. Frontend Test
1. Admin paneline giriş yapın
2. **"Yeni Arsa"** butonuna tıklayın
3. Görsel yükleme bölümünden dosya seçin
4. Progress bar'ın çalıştığını kontrol edin
5. Yüklenen görsellerin görüntülendiğini doğrulayın

### 2. Storage Test
1. Supabase Dashboard > Storage > property-images
2. Yüklediğiniz dosyaların `properties/` klasöründe göründüğünü kontrol edin
3. Dosyalara tıklayıp **"Get public URL"** ile erişilebilirliği test edin

## ⚠️ Önemli Notlar

### Güvenlik
- ✅ Public bucket (görsel erişimi için gerekli)
- ✅ RLS policies aktif (yetkilendirme kontrolü)
- ✅ File size limits (10MB limit)
- ✅ MIME type restrictions (sadece resimler)

### Limitler
- **Free Plan**: 1GB storage
- **Pro Plan**: 100GB storage
- **Bandwidth**: Aylık transfer limiti
- **File Size**: Maksimum 10MB per dosya

### Troubleshooting
**Problem:** Dosya yükleme başarısız
**Çözüm:** 
1. Policies doğru kurulmuş mu kontrol edin
2. Bucket public mu kontrol edin
3. File size 10MB'dan küçük mü kontrol edin

**Problem:** Görsel görünmüyor
**Çözüm:**
1. Public read policy aktif mi kontrol edin
2. URL formatı doğru mu kontrol edin
3. CORS ayarları problem yaratıyor mu kontrol edin

## 🎉 Başarı!
Bu adımları tamamladıktan sonra:
- ✅ Supabase Storage tam entegre
- ✅ Görsel yükleme çalışıyor
- ✅ Progress tracking aktif
- ✅ Güvenlik politikaları yerinde
- ✅ Veritabanı güncel