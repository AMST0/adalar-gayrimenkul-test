-- Agents tablosuna eksik sütunları ekle
ALTER TABLE agents ADD COLUMN IF NOT EXISTS portfolio_url TEXT;
ALTER TABLE agents ADD COLUMN IF NOT EXISTS specialties TEXT[];

-- Mevcut veriler için default specialty ekle
UPDATE agents SET specialties = ARRAY['Gayrimenkul Danışmanlığı'] WHERE specialties IS NULL;

-- Güncelleme trigger'ı ekle (eğer yoksa)
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger'ları ekle (eğer yoksa)
DROP TRIGGER IF EXISTS update_agents_updated_at ON agents;
CREATE TRIGGER update_agents_updated_at
    BEFORE UPDATE ON agents
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();