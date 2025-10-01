const { Sequelize } = require('sequelize');
const config = require('../config/config.json');

const env = process.env.NODE_ENV || 'development';
const dbConfig = config[env];

const sequelize = new Sequelize(dbConfig.database, dbConfig.username, dbConfig.password, {
  host: dbConfig.host,
  port: dbConfig.port,
  dialect: dbConfig.dialect,
  logging: dbConfig.logging
});

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

// Models
db.Property = require('./Property.js')(sequelize, Sequelize);
db.Listing = require('./Listing.js')(sequelize, Sequelize);

module.exports = db;