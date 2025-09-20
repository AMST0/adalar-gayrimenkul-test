-- Supabase testimonials tablosuna rating bilgilerini güncelleme

-- Mevcut testimonials kayıtlarına rating ekleyelim
UPDATE testimonials SET rating = 5 WHERE name = 'Mehmet Özkan';
UPDATE testimonials SET rating = 4 WHERE name = 'Ayşe Kaya';
UPDATE testimonials SET rating = 5 WHERE name = 'Ali Veli';
UPDATE testimonials SET rating = 4 WHERE name = 'Zeynep Yıldız';

-- Eğer bu isimler yoksa, hepsine varsayılan rating ekleyelim
UPDATE testimonials SET rating = 5 WHERE rating IS NULL;