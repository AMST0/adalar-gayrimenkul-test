const express = require('express');
const puppeteer = require('puppeteer');
const db = require('../models');
const router = express.Router();

// Sahibinden.com ilan scraping endpoint'i
router.get('/scrape-listings', async (req, res) => {
  let browser = null;
  
  try {
    console.log('🔍 Sahibinden.com scraping başlatılıyor...');
    
    // Puppeteer browser başlatma
    browser = await puppeteer.launch({
      headless: true,
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-accelerated-2d-canvas',
        '--no-first-run',
        '--no-zygote',
        '--disable-gpu'
      ]
    });
    
    const page = await browser.newPage();
    
    // User agent ve viewport ayarları
    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36');
    await page.setViewport({ width: 1920, height: 1080 });
    
    // Adalar Gayrimenkul sayfasına git
    console.log('📄 Adalar Gayrimenkul sayfası yükleniyor...');
    await page.goto('https://adalargayrimenkul.sahibinden.com/', {
      waitUntil: 'networkidle2',
      timeout: 30000
    });
    
    // Sayfanın yüklenmesini bekle
    await page.waitForTimeout(3000);
    
    // İlan listesini çek
    console.log('📋 İlanlar çekiliyor...');
    const listings = await page.evaluate(() => {
      const listingElements = document.querySelectorAll('[data-testid="search-result-item"], .searchResultsItem, .result-item');
      const results = [];
      
      listingElements.forEach((element, index) => {
        try {
          // Başlık
          const titleElement = element.querySelector('[data-testid="listing-title"], .searchResultsTitle, .result-title, h3 a, .listingTitle');
          const title = titleElement?.innerText?.trim() || titleElement?.textContent?.trim();
          
          // Fiyat
          const priceElement = element.querySelector('[data-testid="listing-price"], .searchResultsPrice, .result-price, .price');
          const price = priceElement?.innerText?.trim() || priceElement?.textContent?.trim();
          
          // Konum
          const locationElement = element.querySelector('[data-testid="listing-location"], .searchResultsLocation, .result-location, .location');
          const location = locationElement?.innerText?.trim() || locationElement?.textContent?.trim();
          
          // Görsel
          const imageElement = element.querySelector('img');
          let image = imageElement?.src || imageElement?.getAttribute('data-src');
          
          // Görsel URL'ini düzelt
          if (image && !image.startsWith('http')) {
            image = image.startsWith('//') ? 'https:' + image : 'https://sahibinden.com' + image;
          }
          
          // Tarih
          const dateElement = element.querySelector('[data-testid="listing-date"], .searchResultsDate, .result-date, .date');
          const date = dateElement?.innerText?.trim() || dateElement?.textContent?.trim();
          
          // URL
          const linkElement = element.querySelector('a[href]');
          let url = linkElement?.href;
          if (url && !url.startsWith('http')) {
            url = 'https://sahibinden.com' + url;
          }
          
          // Açıklama (varsa)
          const descElement = element.querySelector('.searchResultsDescription, .result-description, .description');
          const description = descElement?.innerText?.trim() || descElement?.textContent?.trim();
          
          // En az başlık varsa ekle
          if (title) {
            results.push({
              id: index + 1,
              title: title,
              price: price || 'Fiyat Belirtilmemiş',
              location: location || 'İstanbul, Adalar',
              image: image || 'https://via.placeholder.com/400x250?text=Resim+Yok',
              date: date || new Date().toLocaleDateString('tr-TR'),
              url: url || 'https://adalargayrimenkul.sahibinden.com/',
              description: description || 'Detaylı bilgi için tıklayın',
              features: ['Arsa', 'Satılık', 'Adalar']
            });
          }
        } catch (error) {
          console.log('Element işleme hatası:', error.message);
        }
      });
      
      return results;
    });
    
    console.log(`✅ ${listings.length} ilan başarıyla çekildi`);
    
    // Database'e kaydet ve duplicate kontrol et
    let savedListings = [];
    let newCount = 0;
    let updatedCount = 0;
    
    if (listings.length > 0) {
      console.log('💾 İlanlar database\'e kaydediliyor...');
      
      for (const listing of listings) {
        try {
          // listing_id oluştur (id varsa kullan, yoksa title'dan hash oluştur)
          let listingId = listing.id?.toString();
          if (!listingId) {
            // Başlıktan basit ID oluştur
            listingId = listing.title.replace(/[^a-zA-Z0-9]/g, '').substring(0, 20) + Date.now();
          }
          
          const listingData = {
            listing_id: listingId,
            title: listing.title,
            price: listing.price,
            location: listing.location,
            image_url: listing.image,
            listing_date: new Date(listing.date.split('.').reverse().join('-')), // DD.MM.YYYY -> YYYY-MM-DD
            listing_url: listing.url,
            description: listing.description,
            features: listing.features || [],
            source: 'sahibinden.com',
            is_active: true
          };
          
          const { listing: savedListing, created } = await db.Listing.upsertListing(listingData);
          
          if (created) {
            newCount++;
            console.log(`➕ Yeni ilan kaydedildi: ${savedListing.listing_id}`);
          } else {
            updatedCount++;
            console.log(`🔄 İlan güncellendi: ${savedListing.listing_id}`);
          }
          
          savedListings.push(savedListing.toJSON());
          
        } catch (dbError) {
          console.error(`❌ Database kayıt hatası (${listing.title}):`, dbError.message);
        }
      }
      
      console.log(`✅ Database işlemi tamamlandı: ${newCount} yeni, ${updatedCount} güncellenen ilan`);
    }
    
    // Eğer hiç ilan bulunamazsa database'den mevcut ilanları getir veya mock data döndür
    if (listings.length === 0) {
      console.log('⚠️ Hiç ilan bulunamadı, örnek data döndürülüyor...');
      const mockListings = [
        {
          id: 1,
          title: "Büyükada'da Deniz Manzaralı Arsa",
          price: "2.500.000 TL",
          location: "İstanbul, Adalar, Büyükada",
          image: "https://i.hizliresim.com/rs5qoel.png",
          date: new Date().toLocaleDateString('tr-TR'),
          url: "https://adalargayrimenkul.sahibinden.com/",
          description: "Büyükada merkezde, deniz manzaralı, 500 m² imarlı arsa. Yatırım için ideal konumda.",
          features: ["İmarlı", "Deniz Manzaralı", "Merkezi Konum", "Yatırım Fırsatı"]
        },
        {
          id: 2,
          title: "Heybeliada Villa Arsası",
          price: "1.850.000 TL", 
          location: "İstanbul, Adalar, Heybeliada",
          image: "https://via.placeholder.com/400x250?text=Heybeliada+Villa+Arsası",
          date: new Date().toLocaleDateString('tr-TR'),
          url: "https://adalargayrimenkul.sahibinden.com/",
          description: "Heybeliada'da sessiz bir sokakta, villa yapımına uygun arsa.",
          features: ["Villa Arsası", "Sessiz Konum", "350 m²", "İmarlı"]
        },
        {
          id: 3,
          title: "Kınalıada Yatırım Arsası",
          price: "980.000 TL",
          location: "İstanbul, Adalar, Kınalıada", 
          image: "https://via.placeholder.com/400x250?text=Kınalıada+Arsa",
          date: new Date().toLocaleDateString('tr-TR'),
          url: "https://adalargayrimenkul.sahibinden.com/",
          description: "Kınalıada'da gelişen bölgede yatırım amaçlı arsa.",
          features: ["Yatırım Fırsatı", "Gelişen Bölge", "280 m²", "Uygun Fiyat"]
        }
      ];
      
      res.json({
        success: true,
        listings: mockListings,
        total: mockListings.length,
        source: 'mock-data',
        message: 'Sahibinden.com\'dan ilan çekilemedi, örnek veriler gösteriliyor'
      });
      
      return;
    }
    
    res.json({
      success: true,
      listings: listings,
      total: listings.length,
      source: 'sahibinden.com',
      message: `${listings.length} ilan başarıyla çekildi`
    });
    
  } catch (error) {
    console.error('❌ Scraping hatası:', error);
    
    // Hata durumunda mock data döndür
    const mockListings = [
      {
        id: 1,
        title: "Büyükada'da Deniz Manzaralı Arsa",
        price: "2.500.000 TL",
        location: "İstanbul, Adalar, Büyükada",
        image: "https://i.hizliresim.com/rs5qoel.png",
        date: new Date().toLocaleDateString('tr-TR'),
        url: "https://adalargayrimenkul.sahibinden.com/",
        description: "Büyükada merkezde, deniz manzaralı, 500 m² imarlı arsa. Yatırım için ideal konumda.",
        features: ["İmarlı", "Deniz Manzaralı", "Merkezi Konum", "Yatırım Fırsatı"]
      },
      {
        id: 2,
        title: "Heybeliada Villa Arsası",
        price: "1.850.000 TL",
        location: "İstanbul, Adalar, Heybeliada", 
        image: "https://via.placeholder.com/400x250?text=Heybeliada+Villa+Arsası",
        date: new Date().toLocaleDateString('tr-TR'),
        url: "https://adalargayrimenkul.sahibinden.com/",
        description: "Heybeliada'da sessiz bir sokakta, villa yapımına uygun arsa.",
        features: ["Villa Arsası", "Sessiz Konum", "350 m²", "İmarlı"]
      }
    ];
    
    res.json({
      success: true,
      listings: mockListings,
      total: mockListings.length,
      source: 'fallback-data',
      message: 'Scraping hatası nedeniyle örnek veriler gösteriliyor: ' + error.message,
      error: error.message
    });
    
  } finally {
    if (browser) {
      await browser.close();
      console.log('🔄 Browser kapatıldı');
    }
  }
});

// Database'den listings getirme endpoint'i
router.get('/listings', async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 50;
    const offset = parseInt(req.query.offset) || 0;
    
    const result = await db.Listing.getActiveListings(limit, offset);
    const listings = result.rows.map(listing => ({
      id: listing.listing_id,
      title: listing.title,
      price: listing.price,
      location: listing.location,
      image: listing.image_url,
      date: listing.listing_date?.toLocaleDateString('tr-TR') || new Date().toLocaleDateString('tr-TR'),
      url: listing.listing_url,
      description: listing.description,
      features: listing.features
    }));
    
    res.json({
      success: true,
      listings,
      total: result.count,
      source: 'database',
      message: `${listings.length} ilan database'den getirildi`
    });
    
  } catch (error) {
    console.error('Database listings hatası:', error);
    res.status(500).json({
      success: false,
      error: error.message,
      message: 'Database\'den ilanlar getirilemedi'
    });
  }
});

module.exports = router;