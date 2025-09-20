# Adalar Gayrimenkul - Database Setup

## Seçenek 1: Docker ile PostgreSQL (Önerilen)

### Gereksinimler:
- Docker Desktop for Windows

### Kurulum:
1. Docker Desktop'ı indirin ve kurun: https://docs.docker.com/desktop/install/windows-install/
2. PowerShell'i Administrator olarak açın
3. Proje dizinine gidin:
   ```powershell
   cd "C:\Users\atabe\OneDrive\Belgeler\adalar-gayrimenkul-test\project"
   ```
4. Database container'ını başlatın:
   ```powershell
   docker-compose -f docker-compose.db.yml up -d
   ```
5. Database'in çalıştığını kontrol edin:
   ```powershell
   docker ps
   ```

### Database'e Bağlanma:
- Host: localhost
- Port: 5432
- Database: adalar_gayrimenkul
- Username: adalar_user
- Password: adalar123

## Seçenek 2: Manuel PostgreSQL Kurulumu

### Windows için:
1. PostgreSQL'i indirin: https://www.postgresql.org/download/windows/
2. EDB Installer'ı çalıştırın
3. Kurulum sırasında:
   - Port: 5432
   - Superuser şifresi: adalar123 (veya kendi şifrenizi)
4. pgAdmin'i açın
5. Yeni database oluşturun: `adalar_gayrimenkul`
6. User oluşturun: `adalar_user` (şifre: `adalar123`)

## Seçenek 3: Online Database (Supabase/Railway)

### Supabase (Ücretsiz):
1. https://supabase.com/ 'a gidin
2. Yeni proje oluşturun
3. Database URL'ini kopyalayın
4. config.json'da production ayarlarını güncelleyin

### Railway (Ücretsiz):
1. https://railway.app/ 'e gidin
2. PostgreSQL template'i seçin
3. Database URL'ini kopyalayın

## Backend'i Çalıştırma:

```powershell
cd backend
npm install
npm start
```

## Test:
Database çalışıyorsa şu URL çalışmalı:
http://localhost:5001/api/health

## Sorun Giderme:

### Docker sorunları:
- Docker Desktop çalışıyor mu kontrol edin
- Port 5432 başka bir uygulama tarafından kullanılıyor olabilir
- Container loglarını kontrol edin: `docker logs adalar-postgres`

### PostgreSQL sorunları:
- Windows Firewall'u kontrol edin
- PostgreSQL servisi çalışıyor mu kontrol edin
- pg_hba.conf dosyasını kontrol edin

### Bağlantı sorunları:
- config.json dosyasındaki bilgileri kontrol edin
- Network bağlantısını kontrol edin