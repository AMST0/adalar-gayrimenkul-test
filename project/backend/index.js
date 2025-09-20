require('dotenv').config();
const express = require('express');
const { Sequelize } = require('sequelize');
const propertyRoutes = require('./routes/propertyRoutes');

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(express.json());

// Database connection
const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, {
  host: process.env.DB_HOST,
  dialect: 'postgres',
});

// Test database connection
sequelize
  .authenticate()
  .then(() => console.log('Database connected...'))
  .catch((err) => console.error('Unable to connect to the database:', err));

// Routes
app.use('/api/properties', propertyRoutes);

app.get('/', (req, res) => {
  res.send('Real Estate Backend is running!');
});

// Start server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});