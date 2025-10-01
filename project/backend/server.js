// Basit Express sunucusu ve e-posta bildirim sistemi için başlangıç noktası
const express = require('express');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');
const cors = require('cors');

// Routes import
const scrapingRoutes = require('./routes/scrapingRoutes');

const app = express();
const PORT = 5001;

app.use(cors());
app.use(bodyParser.json());

// Routes
app.use('/api', scrapingRoutes);

// Okunmamış mesajları tutmak için bellek içi dizi
let unreadMessages = [];

// E-posta gönderici ayarları (örnek Gmail, kendi bilgilerinizi girin)
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'adalartest@gmail.com',
    pass: 'Adalar2025', // Gmail için uygulama şifresi kullanın
  },
});

// Bildirim e-postası gönderme fonksiyonu
function sendNotificationEmail(message) {
  return transporter.sendMail({
    from: 'adalartest@gmail.com',
    to: 'adalartest@gmail.com',
    subject: 'Yeni İletişim Talebi',
    text: `Yeni bir iletişim talebiniz var:\n\nAd: ${message.name}\nE-posta: ${message.email}\nTelefon: ${message.phone}\nMesaj: ${message.message}`,
  });
}

// API endpoint: İletişim formu
app.post('/api/contact', async (req, res) => {
  const { name, email, phone, message } = req.body;
  const msg = { name, email, phone, message, read: false, createdAt: Date.now() };
  unreadMessages.push(msg);
  try {
    await sendNotificationEmail(msg);
    res.status(200).json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// 1 saat arayla okunmamış mesajlar için tekrar bildirim gönder
setInterval(async () => {
  const now = Date.now();
  for (const msg of unreadMessages) {
    if (!msg.read && now - msg.createdAt >= 60 * 60 * 1000) { // 1 saat geçtiyse
      await sendNotificationEmail(msg);
      msg.createdAt = now; // tekrar 1 saat bekle
    }
  }
}, 60 * 60 * 1000); // Her saat başı kontrol et

// Okundu olarak işaretleme endpoint'i (isteğe bağlı)
app.post('/api/contact/read', (req, res) => {
  const { createdAt } = req.body;
  const msg = unreadMessages.find(m => m.createdAt === createdAt);
  if (msg) msg.read = true;
  res.json({ success: true });
});

app.listen(PORT, () => {
  console.log(`Backend server running on http://localhost:5001}`);
});
