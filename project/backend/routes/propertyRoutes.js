const express = require('express');
const Property = require('../models/Property');

const router = express.Router();

// Get all properties
router.get('/', async (req, res) => {
  try {
    const properties = await Property.findAll();
    res.json(properties);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch properties' });
  }
});

// Create a new property
router.post('/', async (req, res) => {
  try {
    const newProperty = await Property.create(req.body);
    res.status(201).json(newProperty);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create property' });
  }
});

module.exports = router;