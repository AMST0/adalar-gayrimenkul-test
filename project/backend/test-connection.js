const db = require('./models');

async function testConnection() {
  try {
    console.log('🔌 Database bağlantısı test ediliyor...');
    await db.sequelize.authenticate();
    console.log('✅ Database bağlantısı başarılı!');
    
    console.log('📋 Tablolar senkronize ediliyor...');
    await db.sequelize.sync();
    console.log('✅ Tablolar hazır!');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Database bağlantı hatası:', error.message);
    process.exit(1);
  }
}

testConnection();