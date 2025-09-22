// ImgBB API ile görsel yükleme servisi
const express = require('express');
const multer = require('multer');
const FormData = require('form-data');
const fetch = require('node-fetch');
const fs = require('fs');

const router = express.Router();

// ImgBB API Key - .env dosyasından alınacak
const IMGBB_API_KEY = process.env.IMGBB_API_KEY || 'your-imgbb-api-key';

// Multer konfigürasyonu - geçici dosya depolama
const upload = multer({
  dest: 'uploads/temp/',
  limits: {
    fileSize: 32 * 1024 * 1024, // 32MB ImgBB limiti
    files: 10 // Maksimum 10 dosya
  },
  fileFilter: (req, file, cb) => {
    // Sadece resim dosyalarını kabul et
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Sadece resim dosyaları yüklenebilir (JPG, PNG, GIF, WebP)'), false);
    }
  }
});

// Tek dosya yükleme
async function uploadToImgBB(filePath, fileName) {
  try {
    const form = new FormData();
    form.append('image', fs.createReadStream(filePath));
    form.append('name', fileName);

    const response = await fetch(`https://api.imgbb.com/1/upload?key=${IMGBB_API_KEY}`, {
      method: 'POST',
      body: form
    });

    const result = await response.json();
    
    if (result.success) {
      return {
        url: result.data.url,
        display_url: result.data.display_url,
        delete_url: result.data.delete_url,
        size: result.data.size
      };
    } else {
      throw new Error(result.error?.message || 'ImgBB yükleme hatası');
    }
  } catch (error) {
    console.error('ImgBB upload error:', error);
    throw error;
  }
}

// Çoklu dosya yükleme endpoint'i
router.post('/upload-images', upload.array('images', 10), async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ 
        success: false, 
        message: 'Yüklenecek dosya bulunamadı' 
      });
    }

    const uploadPromises = req.files.map(async (file) => {
      try {
        const result = await uploadToImgBB(file.path, file.originalname);
        
        // Geçici dosyayı sil
        fs.unlinkSync(file.path);
        
        return {
          success: true,
          originalName: file.originalname,
          url: result.url,
          displayUrl: result.display_url,
          size: result.size
        };
      } catch (error) {
        // Geçici dosyayı sil (hata durumunda da)
        try {
          fs.unlinkSync(file.path);
        } catch (unlinkError) {
          console.error('Geçici dosya silinemiyor:', unlinkError);
        }
        
        return {
          success: false,
          originalName: file.originalname,
          error: error.message
        };
      }
    });

    const results = await Promise.all(uploadPromises);
    
    const successful = results.filter(r => r.success);
    const failed = results.filter(r => !r.success);

    res.json({
      success: true,
      message: `${successful.length} dosya başarıyla yüklendi`,
      uploaded: successful,
      failed: failed,
      total: results.length
    });

  } catch (error) {
    console.error('Dosya yükleme hatası:', error);
    
    // Tüm geçici dosyaları temizle
    if (req.files) {
      req.files.forEach(file => {
        try {
          fs.unlinkSync(file.path);
        } catch (unlinkError) {
          console.error('Geçici dosya silinemiyor:', unlinkError);
        }
      });
    }

    res.status(500).json({
      success: false,
      message: 'Dosya yükleme sırasında hata oluştu',
      error: error.message
    });
  }
});

// Tek dosya yükleme endpoint'i
router.post('/upload-single', upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ 
        success: false, 
        message: 'Yüklenecek dosya bulunamadı' 
      });
    }

    const result = await uploadToImgBB(req.file.path, req.file.originalname);
    
    // Geçici dosyayı sil
    fs.unlinkSync(req.file.path);

    res.json({
      success: true,
      message: 'Dosya başarıyla yüklendi',
      url: result.url,
      displayUrl: result.display_url,
      size: result.size,
      originalName: req.file.originalname
    });

  } catch (error) {
    console.error('Tek dosya yükleme hatası:', error);
    
    // Geçici dosyayı sil
    if (req.file) {
      try {
        fs.unlinkSync(req.file.path);
      } catch (unlinkError) {
        console.error('Geçici dosya silinemiyor:', unlinkError);
      }
    }

    res.status(500).json({
      success: false,
      message: 'Dosya yükleme sırasında hata oluştu',
      error: error.message
    });
  }
});

// Dosya boyutu kontrol endpoint'i
router.get('/upload-info', (req, res) => {
  res.json({
    maxFileSize: '32MB',
    maxFiles: 10,
    allowedTypes: ['JPG', 'PNG', 'GIF', 'WebP'],
    service: 'ImgBB'
  });
});

module.exports = router;