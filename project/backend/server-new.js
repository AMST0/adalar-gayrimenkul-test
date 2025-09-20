const express = require('express');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');
const cors = require('cors');
const { sequelize } = require('./models');

const app = express();
const PORT = process.env.PORT || 5001;

app.use(cors());
app.use(bodyParser.json());

// Database bağlantısını test et
async function testDatabase() {
  try {
    await sequelize.authenticate();
    console.log('✅ Database bağlantısı başarılı!');
    
    // Tabloları senkronize et (development için)
    if (process.env.NODE_ENV !== 'production') {
      await sequelize.sync({ alter: true });
      console.log('✅ Database tabloları senkronize edildi!');
    }
  } catch (error) {
    console.error('❌ Database bağlantı hatası:', error);
  }
}

// E-posta gönderici ayarları
const transporter = nodemailer.createTransporter({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER || 'adalartest@gmail.com',
    pass: process.env.EMAIL_PASS || 'Adalar2025',
  },
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'Adalar Gayrimenkul API çalışıyor',
    timestamp: new Date().toISOString()
  });
});

// Database status endpoint
app.get('/api/db-status', async (req, res) => {
  try {
    await sequelize.authenticate();
    res.json({ 
      status: 'OK', 
      message: 'Database bağlantısı aktif',
      database: process.env.NODE_ENV || 'development'
    });
  } catch (error) {
    res.status(500).json({ 
      status: 'ERROR', 
      message: 'Database bağlantı hatası',
      error: error.message 
    });
  }
});

// İletişim formu endpoint
app.post('/api/contact', async (req, res) => {
  try {
    const { name, email, phone, message } = req.body;
    
    // Veritabanına kaydet (models hazır olduğunda)
    // const contactRequest = await ContactRequest.create({
    //   name, email, phone, message
    // });
    
    // E-posta gönder
    await transporter.sendMail({
      from: process.env.EMAIL_USER || 'adalartest@gmail.com',
      to: process.env.EMAIL_USER || 'adalartest@gmail.com',
      subject: 'Yeni İletişim Talebi - Adalar Gayrimenkul',
      html: `
        <h2>Yeni İletişim Talebi</h2>
        <p><strong>Ad Soyad:</strong> ${name}</p>
        <p><strong>E-posta:</strong> ${email}</p>
        <p><strong>Telefon:</strong> ${phone}</p>
        <p><strong>Mesaj:</strong></p>
        <p>${message}</p>
        <hr>
        <p><small>Bu mesaj Adalar Gayrimenkul web sitesinden gönderildi.</small></p>
      `
    });
    
    res.json({ success: true, message: 'Mesajınız başarıyla gönderildi!' });
  } catch (error) {
    console.error('İletişim formu hatası:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Mesaj gönderilirken bir hata oluştu.',
      error: error.message 
    });
  }
});

// Server'ı başlat
app.listen(PORT, async () => {
  console.log(`🚀 Server ${PORT} portunda çalışıyor`);
  console.log(`📱 API URL: http://localhost:${PORT}`);
  await testDatabase();
});

module.exports = app;